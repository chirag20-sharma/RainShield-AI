const axios = require('axios');

/**
 * Traffic API Integration
 * Monitors traffic conditions that affect delivery workers
 */

class TrafficAPI {
  constructor() {
    this.apiKey = process.env.TRAFFIC_API_KEY;
    this.baseURL = process.env.TRAFFIC_API_URL || 'https://api.tomtom.com/traffic/services/4';
  }

  /**
   * Get current traffic conditions
   */
  async getCurrentTraffic(latitude, longitude, radius = 5000) {
    try {
      // TODO: Implement actual traffic API integration
      return this.getMockTrafficData(latitude, longitude);
    } catch (error) {
      console.error('Traffic API error:', error.message);
      throw error;
    }
  }

  /**
   * Get traffic incidents in area
   */
  async getTrafficIncidents(latitude, longitude, radius = 10000) {
    try {
      // TODO: Implement traffic incidents API
      return this.getMockIncidents();
    } catch (error) {
      console.error('Traffic incidents error:', error.message);
      throw error;
    }
  }

  /**
   * Calculate traffic congestion level
   */
  async getCongestionLevel(latitude, longitude) {
    const trafficData = await this.getCurrentTraffic(latitude, longitude);
    
    return {
      level: trafficData.congestionLevel,
      percentage: trafficData.congestionPercentage,
      impact: this.getImpactLevel(trafficData.congestionPercentage),
      recommendation: this.getRecommendation(trafficData.congestionPercentage)
    };
  }

  /**
   * Check if traffic exceeds threshold
   */
  async checkTrafficTrigger(latitude, longitude, threshold) {
    const congestion = await this.getCongestionLevel(latitude, longitude);
    
    return {
      triggered: congestion.percentage > threshold,
      currentLevel: congestion.percentage,
      threshold,
      impact: congestion.impact
    };
  }

  /**
   * Get impact level from congestion percentage
   */
  getImpactLevel(percentage) {
    if (percentage < 30) return 'low';
    if (percentage < 60) return 'medium';
    if (percentage < 80) return 'high';
    return 'severe';
  }

  /**
   * Get recommendation based on traffic
   */
  getRecommendation(percentage) {
    if (percentage < 30) {
      return 'Normal traffic conditions. Good time for deliveries.';
    }
    if (percentage < 60) {
      return 'Moderate traffic. Plan routes carefully.';
    }
    if (percentage < 80) {
      return 'Heavy traffic. Expect delays in deliveries.';
    }
    return 'Severe congestion. Consider avoiding peak hours.';
  }

  /**
   * Estimate delivery time impact
   */
  estimateDeliveryImpact(normalTime, congestionPercentage) {
    const delayFactor = 1 + (congestionPercentage / 100);
    const estimatedTime = Math.round(normalTime * delayFactor);
    
    return {
      normalTime,
      estimatedTime,
      additionalTime: estimatedTime - normalTime,
      delayPercentage: Math.round((delayFactor - 1) * 100)
    };
  }

  /**
   * Get traffic forecast
   */
  async getTrafficForecast(latitude, longitude, hours = 24) {
    try {
      // TODO: Implement traffic forecast
      return this.getMockTrafficForecast(hours);
    } catch (error) {
      console.error('Traffic forecast error:', error.message);
      throw error;
    }
  }

  /**
   * Mock traffic data for development
   */
  getMockTrafficData(latitude, longitude) {
    const congestionPercentage = Math.floor(Math.random() * 100);
    
    return {
      location: { latitude, longitude },
      congestionLevel: this.getImpactLevel(congestionPercentage),
      congestionPercentage,
      averageSpeed: Math.floor(20 + Math.random() * 40),
      freeFlowSpeed: 60,
      timestamp: new Date()
    };
  }

  /**
   * Mock traffic incidents
   */
  getMockIncidents() {
    const incidents = [
      {
        type: 'accident',
        severity: 'medium',
        description: 'Minor accident on main road',
        delay: 15
      },
      {
        type: 'roadwork',
        severity: 'low',
        description: 'Road maintenance in progress',
        delay: 5
      }
    ];
    
    return Math.random() > 0.5 ? incidents : [];
  }

  /**
   * Mock traffic forecast
   */
  getMockTrafficForecast(hours) {
    const forecast = [];
    
    for (let i = 0; i < hours; i++) {
      const hour = (new Date().getHours() + i) % 24;
      let congestion;
      
      // Peak hours: 8-10 AM and 6-8 PM
      if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20)) {
        congestion = 60 + Math.random() * 30;
      } else {
        congestion = 20 + Math.random() * 40;
      }
      
      forecast.push({
        hour,
        congestionPercentage: Math.round(congestion),
        level: this.getImpactLevel(congestion)
      });
    }
    
    return forecast;
  }
}

module.exports = new TrafficAPI();
