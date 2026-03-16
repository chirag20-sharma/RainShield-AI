const { getCurrentWeather, getForecast, checkTriggers } = require('../integrations/weatherAPI');

/**
 * GET /api/weather/current?city=Mumbai
 * GET /api/weather/current?lat=19.07&lon=72.87
 */
const current = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: 'Provide either city or lat & lon query params'
      });
    }

    const weather = await getCurrentWeather({
      city,
      latitude: lat ? parseFloat(lat) : undefined,
      longitude: lon ? parseFloat(lon) : undefined
    });

    res.json({ success: true, data: weather });
  } catch (error) {
    const status = error.response?.status === 404 ? 404 : 500;
    res.status(status).json({
      success: false,
      message: status === 404 ? 'City not found' : 'Failed to fetch weather data',
      error: error.message
    });
  }
};

/**
 * GET /api/weather/forecast?city=Mumbai
 * GET /api/weather/forecast?lat=19.07&lon=72.87
 */
const forecast = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: 'Provide either city or lat & lon query params'
      });
    }

    const data = await getForecast({
      city,
      latitude: lat ? parseFloat(lat) : undefined,
      longitude: lon ? parseFloat(lon) : undefined
    });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    const status = error.response?.status === 404 ? 404 : 500;
    res.status(status).json({
      success: false,
      message: status === 404 ? 'City not found' : 'Failed to fetch forecast',
      error: error.message
    });
  }
};

/**
 * POST /api/weather/check-triggers
 * Body: { city, latitude, longitude, triggers: [{ type, threshold, payout }] }
 */
const triggerCheck = async (req, res) => {
  try {
    const { city, latitude, longitude, triggers } = req.body;

    if (!triggers || !Array.isArray(triggers) || triggers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'triggers array is required'
      });
    }

    if (!city && (!latitude || !longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Provide either city or latitude & longitude'
      });
    }

    const result = await checkTriggers({ city, latitude, longitude }, triggers);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check triggers',
      error: error.message
    });
  }
};

module.exports = { current, forecast, triggerCheck };
