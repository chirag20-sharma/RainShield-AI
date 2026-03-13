/**
 * Payment Service
 * Handles payment processing and payout operations
 */

const Payout = require('../models/Payout');
const paymentGateway = require('../integrations/paymentGateway');
const notificationService = require('./notificationService');

class PaymentService {
  /**
   * Process payout for a claim
   */
  async processPayout(claim, user) {
    try {
      // Create payout record
      const payout = new Payout({
        claimId: claim._id,
        userId: user._id,
        amount: claim.amount,
        method: 'upi',
        status: 'pending'
      });

      await payout.save();

      // Process payment through gateway
      const paymentResult = await paymentGateway.processPayout(
        user._id,
        claim.amount,
        'upi',
        user.upiId || user.phone + '@paytm'
      );

      // Update payout status
      payout.transactionId = paymentResult.transactionId;
      payout.status = paymentResult.success ? 'completed' : 'failed';
      payout.processedAt = new Date();
      await payout.save();

      // Send notification
      if (paymentResult.success) {
        await notificationService.notifyPayoutCompleted(user, payout);
      }

      return {
        success: paymentResult.success,
        payout,
        transactionId: paymentResult.transactionId
      };
    } catch (error) {
      console.error('Payout processing error:', error);
      throw error;
    }
  }

  /**
   * Get payout status
   */
  async getPayoutStatus(payoutId) {
    try {
      const payout = await Payout.findById(payoutId);
      
      if (!payout) {
        throw new Error('Payout not found');
      }

      // Verify with payment gateway
      if (payout.transactionId) {
        const status = await paymentGateway.getPaymentStatus(payout.transactionId);
        
        // Update if status changed
        if (status.status !== payout.status) {
          payout.status = status.status;
          await payout.save();
        }
      }

      return payout;
    } catch (error) {
      console.error('Payout status error:', error);
      throw error;
    }
  }

  /**
   * Retry failed payout
   */
  async retryPayout(payoutId) {
    try {
      const payout = await Payout.findById(payoutId).populate('userId claimId');
      
      if (!payout) {
        throw new Error('Payout not found');
      }

      if (payout.status !== 'failed') {
        throw new Error('Only failed payouts can be retried');
      }

      // Retry payment
      const paymentResult = await paymentGateway.processPayout(
        payout.userId._id,
        payout.amount,
        payout.method,
        payout.userId.upiId || payout.userId.phone + '@paytm'
      );

      // Update payout
      payout.transactionId = paymentResult.transactionId;
      payout.status = paymentResult.success ? 'completed' : 'failed';
      payout.processedAt = new Date();
      await payout.save();

      return {
        success: paymentResult.success,
        payout
      };
    } catch (error) {
      console.error('Payout retry error:', error);
      throw error;
    }
  }

  /**
   * Get user payout history
   */
  async getUserPayouts(userId) {
    try {
      const payouts = await Payout.find({ userId })
        .populate('claimId')
        .sort({ createdAt: -1 });
      
      return payouts;
    } catch (error) {
      console.error('Get payouts error:', error);
      throw error;
    }
  }

  /**
   * Calculate total payouts
   */
  async calculateTotalPayouts(userId, startDate, endDate) {
    try {
      const query = { userId, status: 'completed' };
      
      if (startDate && endDate) {
        query.processedAt = { $gte: startDate, $lte: endDate };
      }

      const payouts = await Payout.find(query);
      const total = payouts.reduce((sum, p) => sum + p.amount, 0);

      return {
        total,
        count: payouts.length,
        payouts
      };
    } catch (error) {
      console.error('Calculate payouts error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
