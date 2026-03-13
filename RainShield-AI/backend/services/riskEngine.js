/**
 * Risk Engine Service
 * Calculates risk scores and premiums based on location and worker profile
 */

const weatherAPI = require('../integrations/weatherAPI');
const aqiAPI = require('../integrations/aqiAPI');

class RiskEngine {
  /**
   * Calculate risk score for a location
   * Risk Score: 0-100 (higher = more risky)
   */
  async calculateRiskScore(location, workerProfile) {
    try {
      const { latitude, longitude, city } = location;
      const { avgWeeklyIncome, platform, experience } = workerProfile;

      // Get historical weather data
      const weatherRisk = await this.calculateWeatherRisk(latitude, longitude);
      
      // Get air quality risk
      const aqiRisk = await this.calculateAQIRisk(latitude, longitude);
      
      // Calculate location-based risk
      const locationRisk = this.calculateLocationRisk(city);
      
      // Calculate temporal risk (seasonal)
      const seasonalRisk = this.calculateSeasonalRisk();

      // Weighted risk calculation
      const riskScore = Math.round(
        weatherRisk * 0.4 +
        aqiRisk * 0.2 +
        locationRisk * 0.3 +
        seasonalRisk * 0.1
      );

      return {
        riskScore: Math.min(100, Math.max(0, riskScore)),
        breakdown: {
          weatherRisk,
          aqiRisk,
          locationRisk,
          seasonalRisk
        },
        riskLevel: this.getRiskLevel(riskScore)
      };
    } catch (error) {
      console.error('Risk calculation error:', error);
      throw error;
    }
  }

  /**
   * Calculate weather-based risk
   */
  async calculateWeatherRisk(latitude, longitude) {
    try {
      // TODO: Fetch historical weather data
      // For now, return mock data based on location
      const mockRisk = 50 + Math.random() * 30;
      return Math.round(mockRisk);
    } catch (error) {
      return 50; // Default medium risk
    }
  }

  /**
   * Calculate AQI-based risk
   */
  async calculateAQIRisk(latitude, longitude) {
    try {
      // TODO: Fetch AQI data
      const mockRisk = 40 + Math.random() * 40;
      return Math.round(mockRisk);
    } catch (error) {
      return 40; // Default medium risk
    }
  }

  /**
   * Calculate location-specific risk
   */
  calculateLocationRisk(city) {
    // High-risk cities (flood-prone, extreme weather)
    const highRiskCities = ['Mumbai', 'Chennai', 'Kolkata', 'Guwahati'];
    const mediumRiskCities = ['Delhi', 'Bangalore', 'Hyderabad', 'Pune'];
    
    if (highRiskCities.includes(city)) return 70;
    if (mediumRiskCities.includes(city)) return 50;
    return 30;
  }

  /**
   * Calculate seasonal risk
   */
  calculateSeasonalRisk() {
    const month = new Date().getMonth();
    
    // Monsoon season (June-September): High risk
    if (month >= 5 && month <= 8) return 80;
    
    // Summer (March-May): Medium-high risk
    if (month >= 2 && month <= 4) return 60;
    
    // Winter (November-February): Low risk
    return 30;
  }

  /**
   * Get risk level from score
   */
  getRiskLevel(score) {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
  }

  /**
   * Calculate weekly premium based on risk score
   */
  calculatePremium(riskScore, coverage) {
    const basePremium = 20;
    const riskMultiplier = 1 + (riskScore / 100);
    const coverageMultiplier = coverage / 1000;
    
    const premium = Math.round(basePremium * riskMultiplier * coverageMultiplier);
    
    return {
      premium: Math.max(20, Math.min(50, premium)),
      basePremium,
      riskMultiplier: parseFloat(riskMultiplier.toFixed(2)),
      coverageMultiplier: parseFloat(coverageMultiplier.toFixed(2))
    };
  }

  /**
   * Get recommended coverage based on income
   */
  getRecommendedCoverage(avgWeeklyIncome) {
    // Recommend 20-25% of weekly income as coverage
    const coverage = Math.round(avgWeeklyIncome * 0.22);
    return Math.max(500, Math.min(2000, coverage));
  }
}

module.exports = new RiskEngine();
