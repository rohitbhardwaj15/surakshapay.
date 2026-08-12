const Policy = require('../models/Policy');
const Claim  = require('../models/Claim');

async function getMe(req, res, next) {
  try {
    const policy = await Policy.findOne({ userId: req.userId }).lean();
    return res.json({ user: req.user, policy });
  } catch (err) {
    next(err);
  }
}

async function getDashboard(req, res, next) {
  try {
    const [policy, claims] = await Promise.all([
      Policy.findOne({ userId: req.userId }).lean(),
      Claim.find({ userId: req.userId }).sort({ createdAt: -1 }).lean(),
    ]);

    const approvedClaims = claims.filter(c => c.status === 'approved');
    const totalPaidOut   = approvedClaims.reduce((s, c) => s + (c.payoutAmount || 0), 0);

    return res.json({
      user:   req.user,
      policy,
      stats: {
        totalClaims:    claims.length,
        approvedClaims: approvedClaims.length,
        pendingClaims:  claims.filter(c => c.status === 'under_review').length,
        totalPaidOut,
      },
      recentClaims: claims.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, getDashboard };
