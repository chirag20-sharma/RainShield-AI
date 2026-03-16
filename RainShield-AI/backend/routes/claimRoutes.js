const express = require('express');
const router = express.Router();
const { getMyClaims, createClaim, getAllClaims, approveClaim } = require('../controllers/claimController');
const protect = require('../middlewares/authMiddleware');

router.get('/my', protect, getMyClaims);
router.post('/', protect, createClaim);
router.get('/', protect, getAllClaims);
router.patch('/:id/approve', protect, approveClaim);

module.exports = router;