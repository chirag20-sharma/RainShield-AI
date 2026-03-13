/**
 * Notification Service
 * Handles SMS, email, and push notifications
 */

class NotificationService {
  /**
   * Send SMS notification
   */
  async sendSMS(phone, message) {
    try {
      console.log(`📱 SMS to ${phone}: ${message}`);
      
      // TODO: Integrate with SMS gateway (Twilio, MSG91, etc.)
      if (process.env.NODE_ENV === 'production') {
        // Real SMS sending logic here
      }

      return {
        success: true,
        channel: 'sms',
        recipient: phone,
        message
      };
    } catch (error) {
      console.error('SMS sending error:', error);
      throw error;
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(email, subject, body) {
    try {
      console.log(`📧 Email to ${email}: ${subject}`);
      
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      if (process.env.NODE_ENV === 'production') {
        // Real email sending logic here
      }

      return {
        success: true,
        channel: 'email',
        recipient: email,
        subject
      };
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  /**
   * Send policy activation notification
   */
  async notifyPolicyActivation(user, policy) {
    const message = `Your RainShield policy is now active! Coverage: ₹${policy.coverage}. Valid until: ${policy.endDate.toLocaleDateString()}`;
    
    await this.sendSMS(user.phone, message);
    
    if (user.email) {
      await this.sendEmail(
        user.email,
        'Policy Activated - RainShield',
        message
      );
    }
  }

  /**
   * Send trigger alert notification
   */
  async notifyTriggerActivated(user, trigger, payout) {
    const message = `Weather alert! ${trigger.type} threshold crossed. Your payout of ₹${payout} is being processed.`;
    
    await this.sendSMS(user.phone, message);
    
    if (user.email) {
      await this.sendEmail(
        user.email,
        'Payout Triggered - RainShield',
        message
      );
    }
  }

  /**
   * Send claim status notification
   */
  async notifyClaimStatus(user, claim, status) {
    let message;
    
    switch (status) {
      case 'approved':
        message = `Your claim has been approved! Payout of ₹${claim.amount} will be processed shortly.`;
        break;
      case 'rejected':
        message = `Your claim has been rejected. Please contact support for details.`;
        break;
      case 'under_review':
        message = `Your claim is under review. We'll update you soon.`;
        break;
      default:
        message = `Claim status updated: ${status}`;
    }
    
    await this.sendSMS(user.phone, message);
  }

  /**
   * Send payout confirmation
   */
  async notifyPayoutCompleted(user, payout) {
    const message = `Payout successful! ₹${payout.amount} has been transferred to your account. Transaction ID: ${payout.transactionId}`;
    
    await this.sendSMS(user.phone, message);
    
    if (user.email) {
      await this.sendEmail(
        user.email,
        'Payout Completed - RainShield',
        message
      );
    }
  }

  /**
   * Send weather alert
   */
  async notifyWeatherAlert(user, alertType, severity, message) {
    const alertMessage = `⚠️ Weather Alert: ${message}`;
    
    await this.sendSMS(user.phone, alertMessage);
  }

  /**
   * Send income loss prediction
   */
  async notifyIncomeLossPrediction(user, prediction) {
    const message = `Weather forecast: ${prediction.condition}. Estimated income loss: ₹${prediction.estimatedLoss}. Your insurance is active.`;
    
    await this.sendSMS(user.phone, message);
  }

  /**
   * Send policy expiry reminder
   */
  async notifyPolicyExpiring(user, policy, daysRemaining) {
    const message = `Your RainShield policy expires in ${daysRemaining} days. Renew now to stay protected!`;
    
    await this.sendSMS(user.phone, message);
    
    if (user.email) {
      await this.sendEmail(
        user.email,
        'Policy Expiring Soon - RainShield',
        message
      );
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(users, message) {
    const results = [];
    
    for (const user of users) {
      try {
        await this.sendSMS(user.phone, message);
        results.push({ userId: user._id, success: true });
      } catch (error) {
        results.push({ userId: user._id, success: false, error: error.message });
      }
    }
    
    return results;
  }
}

module.exports = new NotificationService();
