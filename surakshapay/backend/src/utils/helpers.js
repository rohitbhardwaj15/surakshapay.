/**
 * SurakshaPay utility helpers
 * Risk scoring, premium calculation, ID generation, email simulation
 */

// ── Security helpers ─────────────────────────────────────────────

/**
 * Escape special regex characters before interpolating user input
 * into a MongoDB RegExp query (prevents ReDoS / query injection via name field).
 */
function escapeRegex(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── ID / Number generators ──────────────────────────────────────

function generatePolicyNumber() {
  return 'SPY-' + Math.floor(10000 + Math.random() * 90000);
}

function generateTxnId() {
  return 'TXN' + Math.floor(1e8 + Math.random() * 9e8);
}

function generateClaimId() {
  return 'CLM-' + Date.now().toString().slice(-8);
}

// ── Risk & premium logic ────────────────────────────────────────

const CITY_RISK = {
  Mumbai:    0.65,
  Chennai:   0.60,
  Kolkata:   0.55,
  Delhi:     0.50,
  Bengaluru: 0.40,
  Hyderabad: 0.38,
  Pune:      0.35,
  Ahmedabad: 0.32,
};

const PLATFORM_RISK = {
  Zepto:      0.40,
  Blinkit:    0.38,
  Swiggy:     0.35,
  Zomato:     0.33,
  Dunzo:      0.45,
  BigBasket:  0.30,
};

/**
 * Calculate AI risk score (0–1) for a user
 */
function calculateRiskScore({ city, platform, weeklyIncome, hoursPerDay = 8 }) {
  const cityBase     = CITY_RISK[city]     || 0.45;
  const platformBase = PLATFORM_RISK[platform] || 0.40;
  const hoursNorm    = Math.min(1, hoursPerDay / 16);
  const incomeNorm   = Math.min(1, weeklyIncome / 10000);

  const base = cityBase * 0.35 + platformBase * 0.30 + hoursNorm * 0.20 + incomeNorm * 0.15;
  const noise = (Math.random() - 0.5) * 0.12;
  const score = Math.max(0.05, Math.min(0.95, base + noise));

  return parseFloat(score.toFixed(2));
}

/**
 * Weekly premium = income × 5% × (1 + riskScore)
 */
function calculatePremium(weeklyIncome, riskScore) {
  return parseFloat((weeklyIncome * 0.05 * (1 + riskScore)).toFixed(2));
}

/**
 * Coverage = 70% of weekly income
 */
function calculateCoverage(weeklyIncome) {
  return parseFloat((weeklyIncome * 0.70).toFixed(2));
}

/**
 * Risk label from score
 */
function getRiskLabel(score) {
  if (score < 0.35) return 'Low';
  if (score < 0.65) return 'Medium';
  return 'High';
}

// ── Email notification (simulated) ─────────────────────────────

function sendEmailNotification({ claimId, userId, amount, status, triggerType }) {
  const emailTo = process.env.CLAIMS_EMAIL || 'claims@surakshapay.ai';

  const subject = status === 'approved'
    ? `✅ Claim Approved: ${claimId} — ₹${Math.round(amount)} payout initiated`
    : `⚠️ Claim Flagged: ${claimId} — Manual review required`;

  const body = status === 'approved'
    ? `Claim ${claimId} for trigger "${triggerType}" has been approved.\nPayout: ₹${Math.round(amount)}\nUser ID: ${userId}`
    : `Claim ${claimId} for trigger "${triggerType}" has been flagged for manual review.\nUser ID: ${userId}`;

  // In production: use Nodemailer / SendGrid / AWS SES here
  console.log(`\n📧 EMAIL NOTIFICATION`);
  console.log(`   To     : ${emailTo}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body   : ${body}\n`);

  return {
    sent: true,
    to: emailTo,
    subject,
    sentAt: new Date().toISOString(),
  };
}

module.exports = {
  escapeRegex,
  generatePolicyNumber,
  generateTxnId,
  generateClaimId,
  calculateRiskScore,
  calculatePremium,
  calculateCoverage,
  getRiskLabel,
  sendEmailNotification,
};
