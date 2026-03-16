const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['worker', 'admin'], default: 'worker' },
  phone: { type: String },
  city: { type: String, default: 'Mumbai' },  normalDailyIncome: { type: Number, default: 600 },
  vehicleType: { type: String, enum: ['bike', 'cycle', 'foot'], default: 'bike' },
  platform: { type: String, enum: ['swiggy', 'zomato', 'dunzo', 'other'], default: 'zomato' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);