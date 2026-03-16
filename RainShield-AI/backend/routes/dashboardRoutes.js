const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Payout = require('../models/Payout');
const Alert = require('../models/Alert');

// GET /api/dashboard/stats - summary stats for logged-in user
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const [policy, claims, payouts, alerts] = await Promise.all([
      Policy.findOne({ user: userId, status: 'active' }),
      Claim.find({ user: userId }),
      Payout.find({ user: userId }),
      Alert.find({ user: userId }).sort('-createdAt').limit(5),
    ]);

    const totalPaid = payouts.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

    res.json({
      status: 'success',
      data: {
        user: { name: req.user.name, city: req.user.city, normalDailyIncome: req.user.normalDailyIncome },
        policy,
        claimsCount: claims.length,
        pendingClaims: claims.filter(c => c.status === 'pending').length,
        totalPayoutReceived: totalPaid,
        recentAlerts: alerts,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/dashboard/admin - admin overview
router.get('/admin', protect, async (req, res) => {
  try {
    const [users, policies, claims, payouts] = await Promise.all([
      User.countDocuments(),
      Policy.countDocuments({ status: 'active' }),
      Claim.find().sort('-createdAt').limit(10).populate('user', 'name city'),
      Payout.find({ status: 'completed' }),
    ]);

    const totalPayouts = payouts.reduce((s, p) => s + p.amount, 0);

    res.json({
      status: 'success',
      data: { totalUsers: users, activePolicies: policies, recentClaims: claims, totalPayoutsProcessed: totalPayouts },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
