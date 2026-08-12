const mongoose = require('mongoose');

const fraudLayerSchema = new mongoose.Schema(
  {
    passed: Boolean,
    description: String,
  },
  { _id: false }
);

const fraudDetailsSchema = new mongoose.Schema(
  {
    gps:         { type: fraudLayerSchema },
    activity:    { type: fraudLayerSchema },
    repeatClaim: { type: fraudLayerSchema },
    timeWindow:  { type: fraudLayerSchema },
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Policy',
      required: true,
    },
    claimId: {
      type: String,
      unique: true,
      required: true,
    },
    triggerType: {
      type: String,
      required: true,
      enum: ['Rain', 'AQI', 'Heatwave', 'Curfew', 'Flood', 'Cyclone', 'Dense Fog', 'Bandh'],
    },
    status: {
      type: String,
      enum: ['approved', 'under_review'],
      required: true,
    },
    payoutAmount: {
      type: Number,
      default: 0,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    fraudScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    fraudReasons: {
      type: [String],
      default: [],
    },
    fraudDetails: {
      type: fraudDetailsSchema,
    },
    txnId: {
      type: String,
      default: null,
    },
    upiId: {
      type: String,
    },
    notificationEmail: {
      type: String,
      default: 'claims@surakshapay.ai',
    },
    payoutInitiatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics and fraud detection
claimSchema.index({ userId: 1, createdAt: -1 });
claimSchema.index({ triggerType: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ fraudScore: -1 });

// Compound index for repeat claim detection
claimSchema.index({ userId: 1, triggerType: 1, createdAt: -1 });

module.exports = mongoose.model('Claim', claimSchema);
