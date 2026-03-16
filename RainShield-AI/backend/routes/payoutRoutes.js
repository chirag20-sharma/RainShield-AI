const express = require('express');
const router = express.Router();
const { getMyPayouts, getAllPayouts } = require('../controllers/payoutController');
const protect = require('../middlewares/authMiddleware');

router.get('/my', protect, getMyPayouts);
router.get('/', protect, getAllPayouts);

module.exports = router;