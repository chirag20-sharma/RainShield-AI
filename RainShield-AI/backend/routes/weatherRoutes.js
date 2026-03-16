const express = require('express');
const router = express.Router();
const { current, forecast, triggerCheck } = require('../controllers/weatherController');

// GET /api/weather/current?city=Mumbai
// GET /api/weather/current?lat=19.07&lon=72.87
router.get('/current', current);

// GET /api/weather/forecast?city=Mumbai
// GET /api/weather/forecast?lat=19.07&lon=72.87
router.get('/forecast', forecast);

// POST /api/weather/check-triggers
router.post('/check-triggers', triggerCheck);

module.exports = router;
