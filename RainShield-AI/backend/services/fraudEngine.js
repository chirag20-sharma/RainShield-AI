/**
 * Fraud Detection Engine
 * Analyzes claims for potential fraud
 */

const Claim = require('../models/Claim');

class FraudEngine {
  /**
   * Analyze claim for fraud indicators
   * Returns fraud score: 0.0 (legitimate) to 1.0 (fraudulent)
   */
  async analyzeClaim(claim) {
    try {
      const fraudScore = await this.calculateFraudScore(claim);
      const flags = await this.detectFraudFlags(claim);
      const recommendation = this.getRecommendation(fraudScore);

      return {
        fraudScore: parseFloat(fraudScore.toFixed(2)),
        isValid: fraudScore < 0.6,
        confidence: parseFloat((1 - fraudScore).toFixed(2)),
        flags,
        recommendation,
        riskLevel: this.getRiskLevel(fraudScore)
      };
    } catch (error) {
      console.error('Fraud analysis error:', error);
      throw error;
    }
  }

  /**
   * Calculate overall fraud score
   */
  async calculateFraudScore(claim) {
    let score = 0;

    // Check claim frequency
    score += await this.checkClaimFrequency(claim.userId) * 0.3;

    // Check location consistency
    score += await this.checkLocationConsistency(claim) * 0.2;

    // Check amount consistency
    score += this.checkAmountConsistency(claim) * 0.2;

    // Check timing patterns
    score += this.checkTimingPatterns(claim) * 0.15;

    // Check evidence quality
    score += this.checkEvidenceQuality(claim) * 0.15;

    return Math.min(1.0, score);
  }

  /**
   * Check claim frequency for user
   */
  async checkClaimFrequency(userId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentClaims = await Claim.countDocuments({
        userId,
        createdAt: { $gte: thirtyDaysAgo }
      });

      // More than 4 claims in 30 days is suspicious
      if (recentClaims > 4) return 1.0;
      if (recentClaims > 2) return 0.6;
      return 0.0;
    } catch (error) {
      return 0.0;
    }
  }

  /**
   * Check location consistency
   */
  async checkLocationConsistency(claim) {
    // Check if claim location matches user's registered location
    // TODO: Implement actual location verification
    return 0.0;
  }

  /**
   * Check if claim amount is consistent
   */
  checkAmountConsistency(claim) {
    // Check if amount matches policy payout
    // Exact match is good, deviation is suspicious
    const expectedPayout = claim.policyId?.triggers?.find(
      t => t.type === claim.triggerType
    )?.payout || 0;

    if (expectedPayout === 0) return 0.5;
    
    const deviation = Math.abs(claim.amount - expectedPayout) / expectedPayout;
    
    if (deviation > 0.2) return 0.8;
    if (deviation > 0.1) return 0.4;
    return 0.0;
  }

  /**
   * Check timing patterns
   */
  checkTimingPatterns(claim) {
    const hour = new Date(claim.createdAt).getHours();
    
    // Claims at unusual hours (2 AM - 5 AM) are slightly suspicious
    if (hour >= 2 && hour <= 5) return 0.3;
    
    return 0.0;
  }

  /**
   * Check evidence quality
   */
  checkEvidenceQuality(claim) {
    if (!claim.evidence) return 0.8;
    
    const { screenshot, location, timestamp } = claim.evidence;
    
    let qualityScore = 0;
    
    if (!screenshot) qualityScore += 0.4;
    if (!location) qualityScore += 0.3;
    if (!timestamp) qualityScore += 0.3;
    
    return qualityScore;
  }

  /**
   * Detect specific fraud flags
   */
  async detectFraudFlags(claim) {
    const flags = [];

    // Check for duplicate claims
    const duplicates = await Claim.countDocuments({
      userId: claim.userId,
      triggerType: claim.triggerType,
      createdAt: {
        $gte: new Date(claim.createdAt.getTime() - 24 * 60 * 60 * 1000),
        $lte: new Date(claim.createdAt.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (duplicates > 1) {
      flags.push({
        type: 'duplicate_claim',
        severity: 'high',
        message: 'Multiple claims for same event'
      });
    }

    // Check for missing evidence
    if (!claim.evidence || !claim.evidence.screenshot) {
      flags.push({
        type: 'missing_evidence',
        severity: 'medium',
        message: 'No screenshot provided'
      });
    }

    // Check for suspicious timing
    const recentClaims = await Claim.countDocuments({
      userId: claim.userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    if (recentClaims > 3) {
      flags.push({
        type: 'high_frequency',
        severity: 'high',
        message: 'Unusually high claim frequency'
      });
    }

    return flags;
  }

  /**
   * Get recommendation based on fraud score
   */
  getRecommendation(fraudScore) {
    if (fraudScore < 0.3) return 'approve';
    if (fraudScore < 0.6) return 'review';
    return 'reject';
  }

  /**
   * Get risk level
   */
  getRiskLevel(fraudScore) {
    if (fraudScore < 0.3) return 'low';
    if (fraudScore < 0.6) return 'medium';
    return 'high';
  }

  /**
   * Verify screenshot authenticity
   */
  async verifyScreenshot(imageData, platform) {
    // TODO: Implement OCR and image verification
    // For now, return mock verification
    return {
      isAuthentic: true,
      confidence: 0.85,
      extractedData: {
        earnings: null,
        date: null,
        platform: platform
      }
    };
  }
}

module.exports = new FraudEngine();
