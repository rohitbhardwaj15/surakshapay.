/**
 * Seed script — populates MongoDB with demo data
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User   = require('../models/User');
const Policy = require('../models/Policy');
const Claim  = require('../models/Claim');
const {
  generatePolicyNumber,
  generateClaimId,
  generateTxnId,
  calculateRiskScore,
  calculatePremium,
  calculateCoverage,
  getRiskLabel,
} = require('./helpers');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surakshapay';

const DEMO_USERS = [
  { name: 'Ravi Kumar',   city: 'Mumbai',    platform: 'Zepto',   weeklyIncome: 3500, hoursPerDay: 9,  upiId: 'ravi.kumar@upi',   password: 'ravi@1234' },
  { name: 'Priya Sharma', city: 'Delhi',     platform: 'Blinkit', weeklyIncome: 4200, hoursPerDay: 8,  upiId: 'priya.sharma@upi', password: 'priya@1234' },
  { name: 'Arjun Nair',   city: 'Bengaluru', platform: 'Swiggy',  weeklyIncome: 3800, hoursPerDay: 10, upiId: 'arjun.nair@upi',   password: 'arjun@1234' },
  { name: 'Sunita Devi',  city: 'Chennai',   platform: 'Zomato',  weeklyIncome: 3200, hoursPerDay: 7,  upiId: 'sunita.devi@upi',  password: 'sunita@1234' },
  { name: 'Rohit Yadav',  city: 'Hyderabad', platform: 'Dunzo',   weeklyIncome: 2800, hoursPerDay: 6,  upiId: 'rohit.yadav@upi',  password: 'rohit@1234' },
];

const ADMIN_USER = {
  name: 'Admin', city: 'Mumbai', platform: 'Zepto',
  weeklyIncome: 0, hoursPerDay: 8, upiId: 'admin@upi',
  password: 'admin@1234', role: 'admin',
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding\n');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Policy.deleteMany({}), Claim.deleteMany({})]);
    console.log('🗑️  Cleared existing data');

    for (const u of DEMO_USERS) {
      const riskScore     = calculateRiskScore(u);
      const weeklyPremium = calculatePremium(u.weeklyIncome, riskScore);
      const coverageAmount = calculateCoverage(u.weeklyIncome);
      const policyNumber  = generatePolicyNumber();
      const riskLabel     = getRiskLabel(riskScore);

      // Create user
      const user = await User.create({
        ...u, policyNumber, riskScore, riskLabel, weeklyPremium, coverageAmount,
      });

      // Create active policy
      const policy = await Policy.create({
        userId: user._id,
        policyNumber,
        status: 'active',
        weeklyIncome: u.weeklyIncome,
        coverageAmount,
        weeklyPremium,
        riskScore,
        riskLabel,
        activatedAt: new Date(),
      });

      // Create 2 sample claims
      await Claim.create({
        userId: user._id,
        policyId: policy._id,
        claimId: generateClaimId(),
        triggerType: 'Rain',
        status: 'approved',
        payoutAmount: coverageAmount,
        coverageAmount,
        fraudScore: parseFloat((Math.random() * 0.5).toFixed(2)),
        fraudReasons: [],
        fraudDetails: {
          gps:         { passed: true,  description: 'Location matches trigger zone' },
          activity:    { passed: true,  description: 'User was active on platform' },
          repeatClaim: { passed: true,  description: 'No repeat claims today' },
          timeWindow:  { passed: true,  description: 'Within work hours window' },
        },
        txnId: generateTxnId(),
        upiId: u.upiId,
        payoutInitiatedAt: new Date(),
        notificationEmail: 'claims@surakshapay.ai',
      });

      await Claim.create({
        userId: user._id,
        policyId: policy._id,
        claimId: generateClaimId(),
        triggerType: 'AQI',
        status: 'under_review',
        payoutAmount: 0,
        coverageAmount,
        fraudScore: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
        fraudReasons: ['Repeat claim today', 'Outside work window'],
        fraudDetails: {
          gps:         { passed: true,  description: 'Location matches trigger zone' },
          activity:    { passed: true,  description: 'User was active on platform' },
          repeatClaim: { passed: false, description: 'Duplicate claim detected' },
          timeWindow:  { passed: false, description: 'Outside typical work window' },
        },
        txnId: null,
        upiId: u.upiId,
        notificationEmail: 'claims@surakshapay.ai',
      });

      console.log(`✅ Created user: ${u.name} | Policy: ${policyNumber} | Risk: ${riskScore}`);
    }

    // Create a dedicated admin account (no policy/claims — just dashboard access)
    const adminPolicyNumber = generatePolicyNumber();
    await User.create({ ...ADMIN_USER, policyNumber: adminPolicyNumber, riskScore: 0, riskLabel: 'Low', weeklyPremium: 0, coverageAmount: 0 });
    console.log(`✅ Created admin: ${ADMIN_USER.name} | Policy: ${adminPolicyNumber} | Password: ${ADMIN_USER.password}`);

    console.log('\n🌱 Seed complete! 5 users, 1 admin, 5 policies, 10 claims created.');
    console.log('   Login with any user name + their policy number + password (see DEMO_USERS above).\n');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
