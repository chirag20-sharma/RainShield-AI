const Claim = require('../models/Claim');
const Payout = require('../models/Payout');
const Policy = require('../models/Policy');

exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id }).sort('-createdAt');
    res.json({ status: 'success', data: claims });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createClaim = async (req, res) => {
  try {
    const { type, triggerValue, estimatedLoss, description } = req.body;
    const policy = await Policy.findOne({ user: req.user.id, status: 'active' });
    const claim = await Claim.create({ user: req.user.id, policy: policy?._id, type, triggerValue, estimatedLoss, description });
    res.status(201).json({ status: 'success', data: claim });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate('user', 'name email city').sort('-createdAt');
    res.json({ status: 'success', data: claims });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!claim) return res.status(404).json({ status: 'error', message: 'Claim not found' });

    // Auto-create payout
    const txId = 'TXN' + Date.now();
    await Payout.create({
      user: claim.user, claim: claim._id,
      amount: claim.estimatedLoss || 250,
      method: 'mock', status: 'completed',
      transactionId: txId, processedAt: new Date(),
    });
    await Claim.findByIdAndUpdate(claim._id, { status: 'paid' });
    res.json({ status: 'success', message: 'Claim approved and payout processed', transactionId: txId });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};