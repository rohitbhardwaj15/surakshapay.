const Policy = require('../models/Policy');
const Claim  = require('../models/Claim');
const { runFraudAnalysis } = require('../utils/fraudEngine');
const { generateClaimId, generateTxnId, sendEmailNotification } = require('../utils/helpers');

const TRIGGER_TYPES = [
  { id: 'Rain',      label: 'Heavy Rain',   description: 'Rainfall disrupting deliveries',        threshold: '≥ 50mm/hr' },
  { id: 'AQI',       label: 'High AQI',     description: 'Hazardous air quality levels',           threshold: 'AQI ≥ 300' },
  { id: 'Heatwave',  label: 'Heatwave',     description: 'Extreme heat above 42°C',                threshold: 'Temp ≥ 42°C' },
  { id: 'Curfew',    label: 'Curfew',       description: 'Government curfew or city strike',       threshold: 'Govt declared' },
  { id: 'Flood',     label: 'Flood',        description: 'Waterlogging blocking road access',      threshold: 'Local flood advisory' },
  { id: 'Cyclone',   label: 'Cyclone',      description: 'Cyclonic storm or severe wind alert',    threshold: 'State cyclone warning' },
  { id: 'Dense Fog', label: 'Dense Fog',    description: 'Visibility below safe riding threshold', threshold: 'Visibility < 50m' },
  { id: 'Bandh',     label: 'Bandh / Riot', description: 'Civil unrest or city-wide shutdown',     threshold: 'District shutdown' },
];

function getTriggerTypes(req, res) {
  return res.json({ triggerTypes: TRIGGER_TYPES });
}

async function fireTrigger(req, res, next) {
  try {
    const user = req.user;
    const { triggerType } = req.body;

    // 1. Check policy is active
    const policy = await Policy.findOne({ userId: user._id });
    if (!policy) {
      return res.status(400).json({ error: 'No policy found. Please register first.' });
    }
    if (policy.status !== 'active') {
      return res.status(400).json({
        error: 'Your policy is not active. Please activate your policy before filing a claim.',
      });
    }

    // 2. Run 4-layer fraud analysis (async, uses MongoDB for repeat check)
    const fraudResult = await runFraudAnalysis(user, triggerType);

    // 3. Determine outcome
    const isApproved  = fraudResult.isApproved;
    const claimStatus = isApproved ? 'approved' : 'under_review';
    const payoutAmount = isApproved ? policy.coverageAmount : 0;
    const txnId       = isApproved ? generateTxnId() : null;
    const claimId     = generateClaimId();

    // 4. Save claim to MongoDB
    const claim = await Claim.create({
      userId:           user._id,
      policyId:         policy._id,
      claimId,
      triggerType,
      status:           claimStatus,
      payoutAmount,
      coverageAmount:   policy.coverageAmount,
      fraudScore:       fraudResult.score,
      fraudReasons:     fraudResult.reasons,
      fraudDetails:     fraudResult.layerDetails,
      txnId,
      upiId:            user.upiId,
      notificationEmail: process.env.CLAIMS_EMAIL || 'claims@surakshapay.ai',
      payoutInitiatedAt: isApproved ? new Date() : null,
    });

    // 5. Simulate email notification
    const emailResult = sendEmailNotification({
      claimId,
      userId:      user._id,
      amount:      payoutAmount,
      status:      isApproved ? 'approved' : 'flagged',
      triggerType,
    });

    // 6. Respond
    return res.status(201).json({
      message: isApproved
        ? 'Claim approved. UPI payout initiated.'
        : 'Claim flagged for manual review.',
      claim: {
        id:               claim._id,
        claimId:          claim.claimId,
        triggerType:      claim.triggerType,
        status:           claim.status,
        payoutAmount:     claim.payoutAmount,
        fraudScore:       claim.fraudScore,
        fraudReasons:     claim.fraudReasons,
        fraudDetails:     claim.fraudDetails,
        txnId:            claim.txnId,
        upiId:            claim.upiId,
        payoutInitiatedAt: claim.payoutInitiatedAt,
        createdAt:        claim.createdAt,
      },
      fraud: {
        score:        fraudResult.score,
        isApproved:   fraudResult.isApproved,
        threshold:    fraudResult.threshold,
        reasons:      fraudResult.reasons,
        layerDetails: fraudResult.layerDetails,
      },
      payout: isApproved ? {
        amount:        payoutAmount,
        txnId,
        upiId:         user.upiId,
        status:        'initiated',
        estimatedTime: '< 2 seconds',
        notifiedTo:    process.env.CLAIMS_EMAIL || 'claims@surakshapay.ai',
      } : null,
      emailNotification: emailResult,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTriggerTypes, fireTrigger };
