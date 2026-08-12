const User   = require('../models/User');
const Policy = require('../models/Policy');
const { generateToken } = require('../middleware/auth');
const {
  escapeRegex,
  generatePolicyNumber,
  calculateRiskScore,
  calculatePremium,
  calculateCoverage,
  getRiskLabel,
} = require('../utils/helpers');

// ── Register ────────────────────────────────────────────────────

async function register(req, res, next) {
  try {
    const { name, city, platform, weeklyIncome, hoursPerDay = 8, upiId, password } = req.body;

    // Check for duplicate (same name + city + platform)
    const existing = await User.findOne({
      name: new RegExp(`^${escapeRegex(name)}$`, 'i'),
      city,
      platform,
    });
    if (existing) {
      return res.status(409).json({
        error: 'An account with this name, city, and platform already exists.',
      });
    }

    const policyNumber   = generatePolicyNumber();
    const riskScore      = calculateRiskScore({ city, platform, weeklyIncome, hoursPerDay });
    const weeklyPremium  = calculatePremium(weeklyIncome, riskScore);
    const coverageAmount = calculateCoverage(weeklyIncome);
    const riskLabel      = getRiskLabel(riskScore);

    // Save user to MongoDB (password gets hashed automatically via User's pre-save hook)
    const user = await User.create({
      name, city, platform,
      weeklyIncome: parseFloat(weeklyIncome),
      hoursPerDay:  parseFloat(hoursPerDay),
      upiId,
      password,
      policyNumber,
      riskScore,
      riskLabel,
      weeklyPremium,
      coverageAmount,
    });

    // Save policy to MongoDB
    const policy = await Policy.create({
      userId:       user._id,
      policyNumber,
      status:       'inactive',
      weeklyIncome: parseFloat(weeklyIncome),
      coverageAmount,
      weeklyPremium,
      riskScore,
      riskLabel,
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id:             user._id,
        name:           user.name,
        city:           user.city,
        platform:       user.platform,
        weeklyIncome:   user.weeklyIncome,
        upiId:          user.upiId,
        policyNumber:   user.policyNumber,
        riskScore:      user.riskScore,
        riskLabel:      user.riskLabel,
        weeklyPremium:  user.weeklyPremium,
        coverageAmount: user.coverageAmount,
        createdAt:      user.createdAt,
      },
      policy: {
        id:            policy._id,
        policyNumber:  policy.policyNumber,
        status:        policy.status,
        weeklyPremium: policy.weeklyPremium,
        coverageAmount: policy.coverageAmount,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── Login ───────────────────────────────────────────────────────

async function login(req, res, next) {
  try {
    const { name, policyNumber, password } = req.body;

    // include password explicitly since the schema marks it select:false
    const user = await User.findOne({
      name:         new RegExp(`^${escapeRegex(name)}$`, 'i'),
      policyNumber,
    }).select('+password');

    // Same generic error whether the user doesn't exist or the password is
    // wrong — avoids leaking which part of the credential pair was incorrect.
    const passwordMatches = user ? await user.comparePassword(password) : false;
    if (!user || !passwordMatches) {
      return res.status(401).json({
        error: 'Invalid credentials. Please check your details and try again.',
      });
    }

    const policy = await Policy.findOne({ userId: user._id }).lean();
    const token  = generateToken(user._id.toString());

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id:             user._id,
        name:           user.name,
        city:           user.city,
        platform:       user.platform,
        weeklyIncome:   user.weeklyIncome,
        upiId:          user.upiId,
        policyNumber:   user.policyNumber,
        riskScore:      user.riskScore,
        riskLabel:      user.riskLabel,
        weeklyPremium:  user.weeklyPremium,
        coverageAmount: user.coverageAmount,
      },
      policy: policy ? {
        id:             policy._id,
        status:         policy.status,
        weeklyPremium:  policy.weeklyPremium,
        coverageAmount: policy.coverageAmount,
        activatedAt:    policy.activatedAt,
      } : null,
    });
  } catch (err) {
    next(err);
  }
}

// ── Logout ──────────────────────────────────────────────────────

function logout(req, res) {
  return res.json({ message: 'Logged out successfully' });
}

module.exports = { register, login, logout };
