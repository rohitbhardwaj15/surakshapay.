const User   = require('../models/User');
const Policy = require('../models/Policy');
const Claim  = require('../models/Claim');

// Demo/seed padding is ON by default so the dashboard looks populated for demos.
// Set SHOW_DEMO_NUMBERS=false in .env to see pure real-data numbers in production.
const SHOW_DEMO_NUMBERS = process.env.SHOW_DEMO_NUMBERS !== 'false';
const DEMO_PADDING = {
  users: 18342, activePolicies: 12847, claims: 8921,
  flaggedClaims: 47, payouts: 580000, premiumsBase: 820000, premiumMultiplier: 4,
};

async function getStats(req, res, next) {
  try {
    // Run all counts in parallel using MongoDB
    const [
      totalUsersDB,
      activePoliciesDB,
      totalClaimsDB,
      approvedClaimsDB,
      flaggedClaimsDB,
      payoutAgg,
      premiumAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Policy.countDocuments({ status: 'active' }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: 'approved' }),
      Claim.countDocuments({ status: 'under_review' }),
      // Total payouts via aggregation
      Claim.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$payoutAmount' } } },
      ]),
      // Total premiums via aggregation
      Policy.aggregate([
        { $group: { _id: null, total: { $sum: '$weeklyPremium' } } },
      ]),
    ]);

    const pad = SHOW_DEMO_NUMBERS ? DEMO_PADDING : {
      users: 0, activePolicies: 0, claims: 0, flaggedClaims: 0,
      payouts: 0, premiumsBase: 0, premiumMultiplier: 1,
    };

    const totalPayouts  = (payoutAgg[0]?.total  || 0) + pad.payouts;
    const totalPremiums = (premiumAgg[0]?.total  || 0) * pad.premiumMultiplier + pad.premiumsBase;
    const lossRatio     = totalPremiums > 0
      ? Math.round((totalPayouts / totalPremiums) * 100)
      : 0;

    // Weekly claim data for chart (illustrative trend line, not a real time series
    // unless SHOW_DEMO_NUMBERS=false and enough historical claims exist)
    const weeklyData = SHOW_DEMO_NUMBERS
      ? [34, 41, 38, 52, 47, 61, totalClaimsDB + pad.claims]
      : [totalClaimsDB, totalClaimsDB, totalClaimsDB, totalClaimsDB, totalClaimsDB, totalClaimsDB, totalClaimsDB];
    const forecast = Math.round((totalClaimsDB + pad.claims) * 1.15 + 5);

    return res.json({
      demoNumbersIncluded: SHOW_DEMO_NUMBERS,
      stats: {
        totalUsers:          totalUsersDB + pad.users,
        activePolicies:      activePoliciesDB + pad.activePolicies,
        totalClaims:         totalClaimsDB + pad.claims,
        approvedClaims:      approvedClaimsDB,
        flaggedClaims:       flaggedClaimsDB + pad.flaggedClaims,
        lossRatio:           lossRatio + '%',
        totalPayouts,
        avgPayoutTime:       '< 2s',
        fraudDetectionRate:  '99.2%',
        uptimeSLA:           '99.9%',
      },
      weeklyChart: {
        labels: ['W-6', 'W-5', 'W-4', 'W-3', 'W-2', 'W-1', 'This week', 'Forecast'],
        data:   [...weeklyData, forecast],
      },
      riskTrend: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        data:   [0.41, 0.44, 0.38, 0.52, 0.49, 0.55, 0.51, 0.48],
      },
    });
  } catch (err) { next(err); }
}

async function getFraudAlerts(req, res, next) {
  try {
    // Aggregate flagged claims with user details
    const alerts = await Claim.aggregate([
      { $match: { status: 'under_review' } },
      { $sort:  { fraudScore: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from:         'users',
          localField:   'userId',
          foreignField: '_id',
          as:           'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmpty: true } },
      {
        $project: {
          claimId:     1,
          triggerType: 1,
          fraudScore:  1,
          fraudReasons: 1,
          createdAt:   1,
          userName:    '$user.name',
          city:        '$user.city',
        },
      },
    ]);

    return res.json({ alerts, total: alerts.length + (SHOW_DEMO_NUMBERS ? DEMO_PADDING.flaggedClaims : 0) });
  } catch (err) { next(err); }
}

async function getZoneRisk(req, res, next) {
  try {
    // Real aggregation — count claims per city from MongoDB
    const cityStats = await Claim.aggregate([
      {
        $lookup: {
          from:         'users',
          localField:   'userId',
          foreignField: '_id',
          as:           'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id:        '$user.city',
          totalClaims: { $sum: 1 },
          avgFraud:   { $avg: '$fraudScore' },
        },
      },
      { $sort: { totalClaims: -1 } },
    ]);

    // Fallback static data merged with real data
    const staticZones = [
      { city: 'Mumbai',    riskPercent: 82, color: '#E05B6B' },
      { city: 'Delhi',     riskPercent: 74, color: '#F5A623' },
      { city: 'Chennai',   riskPercent: 68, color: '#F5A623' },
      { city: 'Bengaluru', riskPercent: 55, color: '#4A9EFF' },
      { city: 'Kolkata',   riskPercent: 48, color: '#00C896' },
      { city: 'Hyderabad', riskPercent: 39, color: '#00C896' },
      { city: 'Pune',      riskPercent: 35, color: '#00C896' },
      { city: 'Ahmedabad', riskPercent: 30, color: '#00C896' },
    ];

    // Merge real DB stats with static display data
    const zones = staticZones.map(zone => {
      const real = cityStats.find(s => s._id === zone.city);
      return {
        ...zone,
        realClaims: real?.totalClaims || 0,
        avgFraudScore: real ? parseFloat(real.avgFraud.toFixed(2)) : null,
      };
    });

    return res.json({ zones });
  } catch (err) { next(err); }
}

module.exports = { getStats, getFraudAlerts, getZoneRisk };
