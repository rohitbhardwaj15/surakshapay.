const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policyNumber: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    weeklyIncome: {
      type: Number,
      required: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    weeklyPremium: {
      type: Number,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
    },
    riskLabel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    deactivatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user lookup
policySchema.index({ userId: 1 });
policySchema.index({ status: 1 });

module.exports = mongoose.model('Policy', policySchema);
