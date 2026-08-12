const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      enum: {
        values: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
        message: '{VALUE} is not a supported city',
      },
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: {
        values: ['Zepto', 'Blinkit', 'Swiggy', 'Zomato', 'Dunzo', 'BigBasket'],
        message: '{VALUE} is not a supported platform',
      },
    },
    weeklyIncome: {
      type: Number,
      required: [true, 'Weekly income is required'],
      min: [100, 'Weekly income must be at least ₹100'],
    },
    hoursPerDay: {
      type: Number,
      default: 8,
      min: 1,
      max: 20,
    },
    upiId: {
      type: String,
      required: [true, 'UPI ID is required'],
      trim: true,
    },
    policyNumber: {
      type: String,
      unique: true,
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    riskLabel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    weeklyPremium: {
      type: Number,
      default: 0,
    },
    coverageAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index for faster lookup by city (admin analytics)
userSchema.index({ city: 1 });
userSchema.index({ platform: 1 });


// Virtual: full display string
userSchema.virtual('displayName').get(function () {
  return `${this.name} (${this.platform} · ${this.city})`;
});

// ── Hash password automatically before saving ───────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plaintext password to hash ─────────
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
