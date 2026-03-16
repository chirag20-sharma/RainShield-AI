const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weeklyPremium: { type: Number, required: true },
  coverageAmount: { type: Number, required: true },
  riskScore: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'expired', 'suspended'], default: 'active' },
  city: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);