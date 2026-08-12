const Claim = require('../models/Claim');

async function getClaims(req, res, next) {
  try {
    // Pagination — avoids pulling a user's entire claim history in one response
    // once accounts have been active for a while.
    const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip  = (page - 1) * limit;

    const [claims, total] = await Promise.all([
      Claim.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Claim.countDocuments({ userId: req.userId }),
    ]);

    return res.json({
      claims,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) { next(err); }
}

async function getClaimById(req, res, next) {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!claim) return res.status(404).json({ error: 'Claim not found.' });
    return res.json({ claim });
  } catch (err) { next(err); }
}

module.exports = { getClaims, getClaimById };
