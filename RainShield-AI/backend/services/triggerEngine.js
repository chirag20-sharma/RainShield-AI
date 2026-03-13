/**
 * Trigger Engine Service
 * Monitors weather conditions and activates policy triggers
 */

const Trigger = require('../models/Trigger');
const Policy = require('../models/Policy');
const weatherAPI = require('../integrations/weatherAPI');
const aqiAPI = require('../integrations/aqiAPI');

class TriggerEngine {
  /**
   * Check all active policies for trigger conditions
   */
  async checkAllTriggers() {
    try {
      const activePolicies = await Policy.find({ status: 'active' });
      
      console.log(`Checking triggers for ${activePolicies.length} active policies`);
      
      const results = [];
      for (const policy of activePolicies) {
        const result = await this.checkPolicyTriggers(policy);
        if (result.triggered) {
          results.push(result);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Trigger check error:', error);
      throw error;
    }
  }

  /**
   * Check triggers for a specific policy
   */
  async checkPolicyTriggers(policy) {
    try {
      const user = await policy.populate('userId');
      const location = user.userId.location;
      
      if (!location || !location.latitude || !location.longitude) {
        return { triggered: false, reason: 'No location data' };
      }

      // Get current weather data
      const weatherData = await weatherAPI.getCurrentWeather(
        location.latitude,
        location.longitude
      );

      // Get AQI data
      const aqiData = await aqiAPI.getCurrentAQI(
        location.latitude,
        location.longitude
      );

      const triggeredConditions = [];

      // Check each trigger in the policy
      for (const trigger of policy.triggers) {
        const isTriggered = await this.evaluateTrigger(
          trigger,
          weatherData,
          aqiData
        );

        if (isTriggered) {
          // Create trigger record
          const triggerRecord = await Trigger.create({
            policyId: policy._id,
            type: trigger.type,
            threshold: trigger.threshold,
            actualValue: this.getActualValue(trigger.type, weatherData, aqiData),
            location,
            triggered: true,
            triggeredAt: new Date(),
            payout: trigger.payout,
            status: 'activated',
            metadata: {
              weatherData,
              aqiData,
              source: 'automated'
            }
          });

          triggeredConditions.push(triggerRecord);
        }
      }

      return {
        triggered: triggeredConditions.length > 0,
        policyId: policy._id,
        userId: policy.userId,
        triggers: triggeredConditions,
        totalPayout: triggeredConditions.reduce((sum, t) => sum + t.payout, 0)
      };
    } catch (error) {
      console.error('Policy trigger check error:', error);
      return { triggered: false, error: error.message };
    }
  }

  /**
   * Evaluate a single trigger condition
   */
  async evaluateTrigger(trigger, weatherData, aqiData) {
    const actualValue = this.getActualValue(trigger.type, weatherData, aqiData);
    
    switch (trigger.type) {
      case 'rainfall':
        return actualValue > trigger.threshold;
      
      case 'temperature':
        return actualValue > trigger.threshold;
      
      case 'aqi':
        return actualValue > trigger.threshold;
      
      case 'flood':
        // Check for flood warnings
        return weatherData.alerts?.includes('flood');
      
      default:
        return false;
    }
  }

  /**
   * Get actual value for trigger type
   */
  getActualValue(type, weatherData, aqiData) {
    switch (type) {
      case 'rainfall':
        return weatherData.rainfall || 0;
      
      case 'temperature':
        return weatherData.temperature || 0;
      
      case 'aqi':
        return aqiData?.aqi || 0;
      
      default:
        return 0;
    }
  }

  /**
   * Get trigger recommendations for a location
   */
  async getRecommendedTriggers(latitude, longitude) {
    try {
      // Get historical data to recommend appropriate thresholds
      const recommendations = [
        {
          type: 'rainfall',
          threshold: 60,
          payout: 200,
          description: 'Heavy rainfall (>60mm/day)'
        },
        {
          type: 'temperature',
          threshold: 42,
          payout: 150,
          description: 'Extreme heat (>42°C)'
        },
        {
          type: 'aqi',
          threshold: 300,
          payout: 150,
          description: 'Severe air pollution (AQI >300)'
        }
      ];

      return recommendations;
    } catch (error) {
      console.error('Trigger recommendation error:', error);
      throw error;
    }
  }
}

module.exports = new TriggerEngine();
