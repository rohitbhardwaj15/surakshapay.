const Policy = require('../models/Policy');

async function getPolicy(req, res, next) {
  try {
    const policy = await Policy.findOne({ userId: req.userId }).lean();
    if (!policy) return res.status(404).json({ error: 'Policy not found.' });
    return res.json({ policy });
  } catch (err) { next(err); }
}

async function activatePolicy(req, res, next) {
  try {
    const policy = await Policy.findOne({ userId: req.userId });
    if (!policy) return res.status(404).json({ error: 'Policy not found.' });
    if (policy.status === 'active') return res.status(400).json({ error: 'Policy is already active.' });

    policy.status      = 'active';
    policy.activatedAt = new Date();
    policy.deactivatedAt = null;
    await policy.save();

    return res.json({
      message: 'Policy activated! All 8 trigger types are now monitored.',
      policy,
    });
  } catch (err) { next(err); }
}

async function deactivatePolicy(req, res, next) {
  try {
    const policy = await Policy.findOne({ userId: req.userId });
    if (!policy) return res.status(404).json({ error: 'Policy not found.' });
    if (policy.status === 'inactive') return res.status(400).json({ error: 'Policy is already inactive.' });

    policy.status        = 'inactive';
    policy.deactivatedAt = new Date();
    await policy.save();

    return res.json({
      message: 'Policy deactivated. Coverage has been paused.',
      policy,
    });
  } catch (err) { next(err); }
}

module.exports = { getPolicy, activatePolicy, deactivatePolicy };
