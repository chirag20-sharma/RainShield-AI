const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather by city name or coordinates
 */
const getCurrentWeather = async ({ city, latitude, longitude }) => {
  const params = {
    appid: process.env.WEATHER_API_KEY,
    units: 'metric'
  };

  if (city) {
    params.q = city;
  } else {
    params.lat = latitude;
    params.lon = longitude;
  }

  const response = await axios.get(`${BASE_URL}/weather`, { params });
  const data = response.data;

  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feels_like: data.main.feels_like,
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    rainfall_1h: data.rain?.['1h'] || 0,
    rainfall_3h: data.rain?.['3h'] || 0,
    wind_speed: data.wind.speed,
    wind_direction: data.wind.deg,
    visibility: data.visibility,
    cloudiness: data.clouds.all,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
    coordinates: {
      latitude: data.coord.lat,
      longitude: data.coord.lon
    },
    timestamp: new Date()
  };
};

/**
 * Fetch 5-day / 3-hour forecast by city or coordinates
 */
const getForecast = async ({ city, latitude, longitude }) => {
  const params = {
    appid: process.env.WEATHER_API_KEY,
    units: 'metric',
    cnt: 40 // 5 days × 8 intervals
  };

  if (city) {
    params.q = city;
  } else {
    params.lat = latitude;
    params.lon = longitude;
  }

  const response = await axios.get(`${BASE_URL}/forecast`, { params });

  return response.data.list.map(item => ({
    datetime: new Date(item.dt * 1000),
    temperature: item.main.temp,
    feels_like: item.main.feels_like,
    humidity: item.main.humidity,
    rainfall_3h: item.rain?.['3h'] || 0,
    wind_speed: item.wind.speed,
    condition: item.weather[0].main,
    description: item.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
    cloudiness: item.clouds.all,
    pop: item.pop // probability of precipitation (0-1)
  }));
};

/**
 * Check weather against policy trigger thresholds
 */
const checkTriggers = async ({ city, latitude, longitude }, triggers) => {
  const weather = await getCurrentWeather({ city, latitude, longitude });
  const activated = [];

  for (const trigger of triggers) {
    let actualValue = null;
    let triggered = false;

    switch (trigger.type) {
      case 'rainfall':
        actualValue = weather.rainfall_1h;
        triggered = actualValue > trigger.threshold;
        break;
      case 'temperature':
        actualValue = weather.temperature;
        triggered = actualValue > trigger.threshold;
        break;
      case 'humidity':
        actualValue = weather.humidity;
        triggered = actualValue > trigger.threshold;
        break;
      case 'wind_speed':
        actualValue = weather.wind_speed;
        triggered = actualValue > trigger.threshold;
        break;
    }

    if (triggered) {
      activated.push({
        type: trigger.type,
        actualValue,
        threshold: trigger.threshold,
        payout: trigger.payout,
        exceededBy: parseFloat((actualValue - trigger.threshold).toFixed(2))
      });
    }
  }

  return {
    triggered: activated.length > 0,
    activatedTriggers: activated,
    totalPayout: activated.reduce((sum, t) => sum + t.payout, 0),
    weather
  };
};

module.exports = { getCurrentWeather, getForecast, checkTriggers };
