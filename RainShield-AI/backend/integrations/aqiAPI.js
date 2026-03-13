const axios = require('axios');

/**
 * Air Quality Index (AQI) API Integration
 * Integrates with AQI data providers
 */

class AQIAPI {
  constructor() {
    this.apiKey = process.env.AQI_API_KEY;
    this.baseURL = process.env.AQI_API_URL || 'https://api.waqi.info';
  }

  /**
   * Get current AQI for a location
   */
  async getCurrentAQI(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseURL}/feed/geo:${latitude};${longitude}/`, {
        params: {
          token: this.apiKey
        }
      });

      if (response.data.status === 'ok') {
        return {
          aqi: response.data.data.aqi,
          level: this.getAQILevel(response.data.data.aqi),
          pollutants: response.data.data.iaqi,
          station: response.data.data.city.name,
          timestamp: new Date(response.data.data.time.iso)
        };
      }

      throw new Error('Failed to fetch AQI data');
    } catch (error) {
      console.error('AQI API error:', error.message);
      
      // Return mock data for development
      return this.getMockAQI();
    }
  }

  /**
   * Get AQI forecast
   */
  async getAQIForecast(latitude, longitude) {
    try {
      // TODO: Implement forecast API
      return this.getMockAQIForecast();
    } catch (error) {
      console.error('AQI forecast error:', error.message);
      throw error;
    }
  }

  /**
   * Check if AQI exceeds threshold
   */
  async checkAQITrigger(latitude, longitude, threshold) {
    const aqiData = await this.getCurrentAQI(latitude, longitude);
    
    return {
      triggered: aqiData.aqi > threshold,
      currentAQI: aqiData.aqi,
      threshold,
      level: aqiData.level,
      exceedBy: Math.max(0, aqiData.aqi - threshold)
    };
  }

  /**
   * Get AQI level description
   */
  getAQILevel(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  /**
   * Get health recommendations based on AQI
   */
  getHealthRecommendations(aqi) {
    if (aqi <= 50) {
      return 'Air quality is good. Normal outdoor activities recommended.';
    }
    if (aqi <= 100) {
      return 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.';
    }
    if (aqi <= 150) {
      return 'Unhealthy for sensitive groups. Reduce prolonged outdoor exertion.';
    }
    if (aqi <= 200) {
      return 'Unhealthy. Everyone should reduce prolonged outdoor exertion.';
    }
    if (aqi <= 300) {
      return 'Very unhealthy. Avoid outdoor activities.';
    }
    return 'Hazardous. Stay indoors and keep activity levels low.';
  }

  /**
   * Mock AQI data for development
   */
  getMockAQI() {
    const mockAQI = Math.floor(Math.random() * 350);
    
    return {
      aqi: mockAQI,
      level: this.getAQILevel(mockAQI),
      pollutants: {
        pm25: Math.floor(Math.random() * 200),
        pm10: Math.floor(Math.random() * 300),
        o3: Math.floor(Math.random() * 150)
      },
      station: 'Mock Station',
      timestamp: new Date()
    };
  }

  /**
   * Mock AQI forecast
   */
  getMockAQIForecast() {
    const forecast = [];
    
    for (let i = 0; i < 5; i++) {
      const mockAQI = Math.floor(Math.random() * 300);
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        aqi: mockAQI,
        level: this.getAQILevel(mockAQI)
      });
    }
    
    return forecast;
  }
}

module.exports = new AQIAPI();
