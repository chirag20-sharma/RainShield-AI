const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const Alert = require('../models/Alert');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const { predictIncomeLoss } = require('../services/aiService');

const getEnvironmentData = () => {
  const scenarios = [
    { type: 'rain',      label: 'Heavy Rain',    severity: 'high',   impactFactor: 0.42, triggerValue: 85,  condition_value: 85 },
    { type: 'heat',      label: 'Extreme Heat',  severity: 'medium', impactFactor: 0.25, triggerValue: 42,  condition_value: 43 },
    { type: 'pollution', label: 'High AQI',      severity: 'medium', impactFactor: 0.20, triggerValue: 300, condition_value: 320 },
    { type: 'traffic',   label: 'Heavy Traffic', severity: 'low',    impactFactor: 0.15, triggerValue: 8,   condition_value: 9 },
  ];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

// POST /api/predict
router.post('/', protect, async (req, res) => {
  try {
    const user = req.user;
    const env = getEnvironmentData();
    const normalIncome = user.normalDailyIncome || 600;

    // Call Python AI service, fallback to simple calc if unavailable
    const aiResult = await predictIncomeLoss({
      condition_type: env.type,
      condition_value: env.condition_value,
      normal_daily_income: normalIncome,
      vehicle_type: user.vehicleType || 'bike',
      city: user.city || 'Mumbai',
    });

    const predictedIncome = aiResult ? aiResult.predicted_income : Math.round(normalIncome * (1 - env.impactFactor));
    const predictedLoss   = aiResult ? aiResult.predicted_loss   : normalIncome - predictedIncome;
    const severity        = aiResult
      ? (predictedLoss > normalIncome * 0.5 ? 'high' : predictedLoss > normalIncome * 0.2 ? 'medium' : 'low')
      : env.severity;
    const message = aiResult
      ? aiResult.message
      : `${env.label} expected in ${user.city}. Estimated income loss Rs.${predictedLoss}. Insurance protection activated.`;

    const alert = await Alert.create({
      user: user._id, type: env.type, city: user.city,
      message, predictedLoss, normalIncome, predictedIncome,
      severity, protectionActivated: true,
    });

    if (severity === 'high') {
      const policy = await Policy.findOne({ user: user._id, status: 'active' });
      await Claim.create({
        user: user._id, policy: policy?._id, type: env.type,
        triggerValue: env.triggerValue, estimatedLoss: predictedLoss,
        autoTriggered: true, description: message, status: 'pending',
      });
    }

    res.json({
      status: 'success',
      prediction: {
        city: user.city, conditionType: env.type, conditionLabel: env.label,
        severity, normalDailyIncome: normalIncome, predictedIncome, predictedLoss,
        message, protectionActivated: true,
        autoClaimCreated: severity === 'high',
        aiPowered: !!aiResult,
      },
      alert,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/predict/alerts
router.get('/alerts', protect, async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id }).sort('-createdAt').limit(10);
    res.json({ status: 'success', data: alerts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/predict/alerts/all
router.get('/alerts/all', protect, async (req, res) => {
  try {
    const alerts = await Alert.find().populate('user', 'name city').sort('-createdAt');
    res.json({ status: 'success', data: alerts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
