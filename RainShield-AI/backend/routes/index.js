const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/policies', require('./policyRoutes'));
router.use('/claims', require('./claimRoutes'));
router.use('/payouts', require('./payoutRoutes'));
router.use('/predict', require('./predictorRoutes'));
router.use('/weather', require('./weatherRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/weather', require('./weatherRoutes'));

router.get('/diagnostics/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

module.exports = router;