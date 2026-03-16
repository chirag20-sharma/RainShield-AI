const Policy = require('../models/Policy');
const protect = require('../middlewares/authMiddleware');

exports.getMyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ user: req.user.id, status: 'active' });
    res.json({ status: 'success', data: policy });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().populate('user', 'name email city');
    res.json({ status: 'success', data: policies });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};