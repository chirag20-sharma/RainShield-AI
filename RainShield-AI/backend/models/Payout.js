const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['upi', 'bank', 'mock'], default: 'mock' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String },
  processedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);