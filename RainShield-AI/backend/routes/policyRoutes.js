const express = require('express');
const router = express.Router();
const { getMyPolicy, getAllPolicies } = require('../controllers/policyController');
const protect = require('../middlewares/authMiddleware');

router.get('/my', protect, getMyPolicy);
router.get('/', protect, getAllPolicies);

module.exports = router;