const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Policy = require('../models/Policy');
const { getRiskScore } = require('../services/aiService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      normalDailyIncome: user.normalDailyIncome,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, city, normalDailyIncome, vehicleType, platform } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ status: 'error', message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, city, normalDailyIncome, vehicleType, platform });

    // Get AI risk score
    const aiRisk = await getRiskScore({
      city, vehicle_type: vehicleType, platform,
      normal_daily_income: normalDailyIncome || 600,
      claims_last_30_days: 0, disruption_days_last_30: 3,
    });
    const riskScore = aiRisk ? aiRisk.score : Math.floor(Math.random() * 40) + 30;
    const weeklyPremium = aiRisk ? aiRisk.weekly_premium : Math.round((normalDailyIncome || 600) * 0.05);
    const coverageAmount = aiRisk ? aiRisk.coverage_amount : (normalDailyIncome || 600) * 7;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    await Policy.create({ user: user._id, weeklyPremium, coverageAmount, riskScore, city, endDate });

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};