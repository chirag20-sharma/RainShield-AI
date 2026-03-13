const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Weather API Integration
 * Integrates with external weather service (OpenWeatherMap, WeatherAPI, etc.)
 */

class WeatherAPI {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseURL = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Get current weather for a location
   */
  async getCurrentWeather(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        rainfall: response.data.rain?.['1h'] || 0,
        description: response.data.weather[0].description,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Weather API error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }

  /**
   * Get weather forecast
   */
  async getForecast(latitude, longitude, days = 5) {
    try {
      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      });

      return response.data.list.map(item => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        rainfall: item.rain?.['3h'] || 0,
        description: item.weather[0].description
      }));
    } catch (error) {
      logger.error('Weather forecast error:', error.message);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Check if weather conditions meet trigger thresholds
   */
  async checkTriggers(latitude, longitude, triggers) {
    const weather = await this.getCurrentWeather(latitude, longitude);
    const activatedTriggers = [];

    triggers.forEach(trigger => {
      if (trigger.type === 'rainfall' && weather.rainfall > trigger.threshold) {
        activatedTriggers.push({
          type: trigger.type,
          value: weather.rainfall,
          threshold: trigger.threshold,
          payout: trigger.payout
        });
      }
      if (trigger.type === 'temperature' && weather.temperature > trigger.threshold) {
        activatedTriggers.push({
          type: trigger.type,
          value: weather.temperature,
          threshold: trigger.threshold,
          payout: trigger.payout
        });
      }
    });

    return {
      triggered: activatedTriggers.length > 0,
      triggers: activatedTriggers,
      weather
    };
  }
}

module.exports = new WeatherAPI();
