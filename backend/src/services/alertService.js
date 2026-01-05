/**
 * Alert Service
 * Handles sensor alert processing and notifications
 * Integrates with existing notification service
 * Part of IoT Integration - Phase 1
 */

import Sensor from '../models/Sensor.js';
import Home from '../models/Home.js';
import User from '../models/User.js';
import emailService from './emailService.js';
import logger from '../utils/logger.js';

class AlertService {
  constructor() {
    this.alertQueue = [];
    this.processing = false;
  }

  /**
   * Process an alert triggered by a sensor
   */
  async processAlert(alertData) {
    try {
      const { sensor, homeId, currentValue, severity, message, name } = alertData;

      logger.info(`Processing alert: ${name} for sensor ${sensor.name}`);

      // Get home and user info
      const home = await Home.findById(homeId).lean();
      if (!home) {
        logger.error(`Home not found: ${homeId}`);
        return;
      }

      const user = await User.findById(home.userId).lean();
      if (!user) {
        logger.error(`User not found for home: ${homeId}`);
        return;
      }

      // Format alert message
      const alertMessage = this.formatAlertMessage(alertData, home);

      // Send notifications based on severity and user preferences
      await this.sendNotifications(user, home, alertData, alertMessage);

      // Log the alert
      logger.info(`✅ Alert processed and sent to ${user.email}`);

      return {
        success: true,
        sentTo: user.email,
        severity
      };

    } catch (error) {
      logger.error('Error processing alert:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Format alert message for human consumption
   */
  formatAlertMessage(alertData, home) {
    const { sensor, currentValue, severity, message, name, threshold, condition } = alertData;

    let emoji = '⚠️';
    if (severity === 'critical') emoji = '🚨';
    if (severity === 'info') emoji = 'ℹ️';

    // Build descriptive message
    let description = message || `Alert triggered for ${sensor.name}`;

    // Add context
    if (condition && threshold !== undefined) {
      const conditionText = {
        'above': `exceeded ${threshold}`,
        'below': `dropped below ${threshold}`,
        'equals': `reached ${threshold}`,
        'change': `changed by more than ${threshold}`
      }[condition] || '';

      description += ` (Current: ${currentValue} ${sensor.unit || ''})`;
    }

    // Add location context
    const location = sensor.location ? ` in ${sensor.location}` : '';

    return {
      emoji,
      title: `${emoji} ${name}`,
      description: `${description}${location}`,
      home: home.name,
      sensor: sensor.name,
      location: sensor.location,
      value: currentValue,
      unit: sensor.unit || '',
      severity,
      timestamp: new Date()
    };
  }

  /**
   * Send notifications via appropriate channels
   */
  async sendNotifications(user, home, alertData, formattedMessage) {
    const { severity } = alertData;

    // Always send email for critical alerts
    // For warning/info, check user preferences
    const shouldSendEmail = severity === 'critical' || this.shouldNotifyUser(user, 'email', severity);

    if (shouldSendEmail) {
      await this.sendEmailNotification(user, home, formattedMessage);
    }

    // TODO: Add SMS notifications for critical alerts
    // if (severity === 'critical' && user.phone) {
    //   await this.sendSMSNotification(user, formattedMessage);
    // }

    // TODO: Add push notifications
    // await this.sendPushNotification(user, formattedMessage);
  }

  /**
   * Check if user should be notified based on preferences
   */
  shouldNotifyUser(user, channel, severity) {
    // TODO: Implement user notification preferences
    // For now, send all warnings and above
    return severity === 'warning' || severity === 'critical';
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(user, home, alertMessage) {
    try {
      const subject = `${alertMessage.emoji} ${alertMessage.title} - ${home.name}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .alert-container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-header {
              background: ${this.getSeverityColor(alertMessage.severity)};
              color: white;
              padding: 15px;
              border-radius: 5px 5px 0 0;
            }
            .alert-body {
              background: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
            }
            .alert-detail { margin: 10px 0; }
            .alert-detail strong { display: inline-block; width: 120px; }
            .alert-footer {
              background: #f0f0f0;
              padding: 15px;
              border-radius: 0 0 5px 5px;
              font-size: 0.9em;
              color: #666;
            }
            .value-display {
              font-size: 2em;
              font-weight: bold;
              color: ${this.getSeverityColor(alertMessage.severity)};
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="alert-container">
            <div class="alert-header">
              <h2>${alertMessage.emoji} ${alertMessage.title}</h2>
            </div>
            <div class="alert-body">
              <p>${alertMessage.description}</p>

              <div class="value-display">
                ${alertMessage.value} ${alertMessage.unit}
              </div>

              <div class="alert-detail">
                <strong>Home:</strong> ${alertMessage.home}
              </div>
              <div class="alert-detail">
                <strong>Sensor:</strong> ${alertMessage.sensor}
              </div>
              ${alertMessage.location ? `
              <div class="alert-detail">
                <strong>Location:</strong> ${alertMessage.location}
              </div>
              ` : ''}
              <div class="alert-detail">
                <strong>Severity:</strong> ${alertMessage.severity.toUpperCase()}
              </div>
              <div class="alert-detail">
                <strong>Time:</strong> ${alertMessage.timestamp.toLocaleString()}
              </div>
            </div>
            <div class="alert-footer">
              <p>This is an automated alert from FurnaceLog. Visit your dashboard to view sensor details and take action.</p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">View Dashboard</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
${alertMessage.emoji} ${alertMessage.title}

${alertMessage.description}

Current Value: ${alertMessage.value} ${alertMessage.unit}

Home: ${alertMessage.home}
Sensor: ${alertMessage.sensor}
${alertMessage.location ? `Location: ${alertMessage.location}\n` : ''}
Severity: ${alertMessage.severity.toUpperCase()}
Time: ${alertMessage.timestamp.toLocaleString()}

Visit your FurnaceLog dashboard to view sensor details and take action.
${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard
      `;

      await emailService.sendEmail({
        to: user.email,
        subject,
        html: htmlContent,
        text: textContent
      });

      logger.info(`📧 Alert email sent to ${user.email}`);

    } catch (error) {
      logger.error('Failed to send alert email:', error);
    }
  }

  /**
   * Get color for severity level
   */
  getSeverityColor(severity) {
    const colors = {
      critical: '#dc2626', // Red
      warning: '#f59e0b',  // Orange
      info: '#3b82f6'      // Blue
    };
    return colors[severity] || colors.warning;
  }

  /**
   * Get all active alerts for a home
   */
  async getActiveAlerts(homeId, limit = 50) {
    try {
      // Find all sensors with recent alerts
      const sensors = await Sensor.find({
        homeId,
        isActive: true,
        'alerts.rules.lastTriggered': {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }).lean();

      const alerts = [];

      for (const sensor of sensors) {
        for (const rule of sensor.alerts.rules || []) {
          if (rule.lastTriggered &&
              rule.lastTriggered > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            alerts.push({
              id: rule._id,
              sensor: {
                id: sensor._id,
                name: sensor.name,
                type: sensor.type,
                location: sensor.location
              },
              rule: {
                name: rule.name,
                condition: rule.condition,
                threshold: rule.threshold,
                severity: rule.severity,
                message: rule.message
              },
              triggeredAt: rule.lastTriggered,
              currentValue: sensor.lastReading?.value
            });
          }
        }
      }

      // Sort by most recent first
      alerts.sort((a, b) => b.triggeredAt - a.triggeredAt);

      return alerts.slice(0, limit);

    } catch (error) {
      logger.error('Error getting active alerts:', error);
      return [];
    }
  }

  /**
   * Clear/acknowledge an alert
   */
  async acknowledgeAlert(sensorId, ruleId) {
    try {
      await Sensor.updateOne(
        {
          _id: sensorId,
          'alerts.rules._id': ruleId
        },
        {
          $set: {
            'alerts.rules.$.lastTriggered': null
          }
        }
      );

      logger.info(`Alert acknowledged: sensor=${sensorId}, rule=${ruleId}`);
      return { success: true };

    } catch (error) {
      logger.error('Error acknowledging alert:', error);
      return { success: false, error: error.message };
    }
  }
}

const alertService = new AlertService();

export default alertService;
