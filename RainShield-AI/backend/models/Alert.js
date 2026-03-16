const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['rain', 'heat', 'pollution', 'traffic'], required: true },
  city: { type: String },
  message: { type: String, required: true },
  predictedLoss: { type: Number },
  normalIncome: { type: Number },
  predictedIncome: { type: Number },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isRead: { type: Boolean, default: false },
  protectionActivated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);