const Payout = require('../models/Payout');

exports.getMyPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({ user: req.user.id }).sort('-createdAt');
    res.json({ status: 'success', data: payouts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find().populate('user', 'name email').sort('-createdAt');
    res.json({ status: 'success', data: payouts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};