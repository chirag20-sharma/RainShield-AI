const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  type: { type: String, enum: ['rain', 'heat', 'pollution', 'traffic', 'manual'], default: 'rain' },
  triggerValue: { type: Number },
  estimatedLoss: { type: Number },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  autoTriggered: { type: Boolean, default: false },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);