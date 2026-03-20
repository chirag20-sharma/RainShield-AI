const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const protect = require('../middlewares/authMiddleware');

const OWM = 'https://api.openweathermap.org/data/2.5';
const KEY  = () => process.env.WEATHER_API_KEY;

// Risk level from weather condition
function weatherRisk(data) {
  const rain  = (data.rain?.['1h'] || 0) + (data.rain?.['3h'] || 0);
  const temp  = data.main.temp;
  const wind  = data.wind.speed;
  const cond  = data.weather[0].main.toLowerCase();

  if (rain > 10 || cond.includes('thunderstorm') || wind > 15) return 'high';
  if (rain > 3  || cond.includes('rain') || temp > 38 || wind > 10) return 'medium';
  return 'low';
}

// GET /api/weather/current?city=Mumbai
router.get('/current', protect, async (req, res) => {
  const city = req.query.city || req.user.city || 'Mumbai';
  try {
    const { data } = await axios.get(`${OWM}/weather`, {
      params: { q: city, appid: KEY(), units: 'metric' },
      timeout: 6000,
    });

    const risk = weatherRisk(data);

    res.json({
      status: 'success',
      data: {
        city:        data.name,
        country:     data.sys.country,
        temp:        Math.round(data.main.temp),
        feels_like:  Math.round(data.main.feels_like),
        temp_min:    Math.round(data.main.temp_min),
        temp_max:    Math.round(data.main.temp_max),
        humidity:    data.main.humidity,
        wind_speed:  data.wind.speed,
        rainfall_1h: data.rain?.['1h'] || 0,
        visibility:  data.visibility,
        cloudiness:  data.clouds.all,
        condition:   data.weather[0].main,
        description: data.weather[0].description,
        icon:        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        risk_level:  risk,
        timestamp:   new Date(),
      },
    });
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) return res.status(404).json({ status: 'error', message: `City "${city}" not found` });
    if (status === 401) return res.status(500).json({ status: 'error', message: 'Invalid weather API key' });
    res.status(500).json({ status: 'error', message: 'Weather service unavailable' });
  }
});

// GET /api/weather/forecast?city=Mumbai
router.get('/forecast', protect, async (req, res) => {
  const city = req.query.city || req.user.city || 'Mumbai';
  try {
    const { data } = await axios.get(`${OWM}/forecast`, {
      params: { q: city, appid: KEY(), units: 'metric', cnt: 8 }, // next 24h (3h intervals)
      timeout: 6000,
    });

    const forecast = data.list.map(item => ({
      time:        new Date(item.dt * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      temp:        Math.round(item.main.temp),
      condition:   item.weather[0].main,
      description: item.weather[0].description,
      icon:        `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      rainfall:    item.rain?.['3h'] || 0,
      wind_speed:  item.wind.speed,
      pop:         Math.round((item.pop || 0) * 100), // % chance of rain
    }));

    res.json({ status: 'success', data: { city: data.city.name, forecast } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Forecast unavailable' });
  }
});

module.exports = router;
