/**
 * Warranty Alert Service
 * Handles warranty expiration monitoring and notifications
 *
 * Part of Epic E4 - System & Component Tracking (E4-T7)
 * Integrates with Epic E7 - Notifications
 */

import System from '../models/System.js';
import { sendEmail } from './emailService.js';
import { createNotification } from './notificationService.js';

/**
 * Warranty alert thresholds (in days)
 */
export const ALERT_THRESHOLDS = {
  CRITICAL: 30,    // 30 days before expiration
  WARNING: 60,     // 60 days before expiration
  REMINDER: 90     // 90 days before expiration
};

/**
 * Check all systems for expiring warranties
 * This should be run daily via a scheduled job (cron/BullMQ)
 */
export const checkExpiringWarranties = async () => {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + ALERT_THRESHOLDS.REMINDER);

    // Find all active systems with warranties expiring in the next 90 days
    const systems = await System.find({
      status: 'active',
      'warranty.endDate': {
        $gte: now,
        $lte: futureDate
      }
    }).populate('homeId');

    console.log(`Checking ${systems.length} systems for warranty expiration`);

    const alerts = {
      critical: [],
      warning: [],
      reminder: []
    };

    for (const system of systems) {
      const daysUntilExpiry = Math.floor(
        (new Date(system.warranty.endDate) - now) / (1000 * 60 * 60 * 24)
      );

      // Determine alert level
      let alertLevel = null;
      if (daysUntilExpiry <= ALERT_THRESHOLDS.CRITICAL) {
        alertLevel = 'critical';
        alerts.critical.push(system);
      } else if (daysUntilExpiry <= ALERT_THRESHOLDS.WARNING) {
        alertLevel = 'warning';
        alerts.warning.push(system);
      } else if (daysUntilExpiry <= ALERT_THRESHOLDS.REMINDER) {
        alertLevel = 'reminder';
        alerts.reminder.push(system);
      }

      // Send notification if we have an alert level
      if (alertLevel) {
        await sendWarrantyExpirationAlert(system, daysUntilExpiry, alertLevel);
      }
    }

    return {
      success: true,
      summary: {
        total: systems.length,
        critical: alerts.critical.length,
        warning: alerts.warning.length,
        reminder: alerts.reminder.length
      },
      alerts
    };
  } catch (error) {
    console.error('Error checking expiring warranties:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send warranty expiration alert to user
 */
export const sendWarrantyExpirationAlert = async (system, daysUntilExpiry, alertLevel) => {
  try {
    const home = system.homeId;
    if (!home || !home.userId) {
      console.error('System has no associated home or user:', system._id);
      return;
    }

    // Get user (would need to populate or fetch separately)
    // For now, assuming we have access to user data through home

    // Determine urgency message
    let urgencyMessage = '';
    let subject = '';

    switch (alertLevel) {
      case 'critical':
        urgencyMessage = `Your warranty expires in ${daysUntilExpiry} days! Take action soon.`;
        subject = `URGENT: Warranty Expiring Soon - ${system.name}`;
        break;
      case 'warning':
        urgencyMessage = `Your warranty expires in ${daysUntilExpiry} days. Consider filing any pending claims.`;
        subject = `Warranty Expiring in ${daysUntilExpiry} Days - ${system.name}`;
        break;
      case 'reminder':
        urgencyMessage = `Your warranty expires in ${daysUntilExpiry} days. Plan ahead for coverage renewal or replacement.`;
        subject = `Warranty Reminder - ${system.name}`;
        break;
    }

    // Create in-app notification
    await createNotification({
      userId: home.userId,
      type: 'warranty-expiration',
      title: `Warranty Expiring: ${system.name}`,
      message: urgencyMessage,
      priority: alertLevel === 'critical' ? 'high' : alertLevel === 'warning' ? 'medium' : 'low',
      relatedEntity: {
        type: 'system',
        id: system._id,
        homeId: home._id
      },
      actionUrl: `/homes/${home._id}/systems/${system._id}`,
      expiresAt: new Date(system.warranty.endDate)
    });

    // Send email notification (if user preferences allow)
    const emailData = {
      systemName: system.name,
      homeName: home.name || home.address,
      warrantyProvider: system.warranty.provider || 'Unknown',
      expirationDate: system.warranty.endDate.toLocaleDateString(),
      daysRemaining: daysUntilExpiry,
      urgencyMessage,
      manufacturerContact: system.warranty.manufacturerContact || {},
      coverageDetails: system.warranty.coverageDetails || 'N/A'
    };

    await sendEmail({
      to: home.userId.email, // Assumes userId is populated
      subject,
      template: 'warranty-expiration',
      data: emailData
    });

    console.log(`Warranty alert sent for system ${system._id} (${alertLevel})`);
  } catch (error) {
    console.error('Error sending warranty expiration alert:', error);
  }
};

/**
 * Get warranty status for a specific system
 */
export const getWarrantyStatus = (system) => {
  if (!system.warranty || !system.warranty.endDate) {
    return {
      status: 'none',
      daysRemaining: null,
      alertLevel: null
    };
  }

  const now = new Date();
  const endDate = new Date(system.warranty.endDate);
  const daysRemaining = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: 'expired',
      daysRemaining: 0,
      alertLevel: null
    };
  }

  let alertLevel = null;
  if (daysRemaining <= ALERT_THRESHOLDS.CRITICAL) {
    alertLevel = 'critical';
  } else if (daysRemaining <= ALERT_THRESHOLDS.WARNING) {
    alertLevel = 'warning';
  } else if (daysRemaining <= ALERT_THRESHOLDS.REMINDER) {
    alertLevel = 'reminder';
  }

  return {
    status: alertLevel ? 'expiring' : 'valid',
    daysRemaining,
    alertLevel
  };
};

/**
 * Get warranty summary for a home
 */
export const getWarrantySummary = async (homeId) => {
  try {
    const systems = await System.find({
      homeId,
      status: 'active',
      'warranty.endDate': { $exists: true, $ne: null }
    });

    const summary = {
      total: systems.length,
      expired: 0,
      critical: 0,
      warning: 0,
      reminder: 0,
      valid: 0,
      systems: []
    };

    for (const system of systems) {
      const warrantyStatus = getWarrantyStatus(system);

      summary.systems.push({
        systemId: system._id,
        name: system.name,
        category: system.category,
        warrantyProvider: system.warranty.provider,
        endDate: system.warranty.endDate,
        ...warrantyStatus
      });

      // Count by status
      if (warrantyStatus.status === 'expired') {
        summary.expired++;
      } else if (warrantyStatus.alertLevel === 'critical') {
        summary.critical++;
      } else if (warrantyStatus.alertLevel === 'warning') {
        summary.warning++;
      } else if (warrantyStatus.alertLevel === 'reminder') {
        summary.reminder++;
      } else {
        summary.valid++;
      }
    }

    // Sort systems by days remaining
    summary.systems.sort((a, b) => {
      if (a.daysRemaining === null) return 1;
      if (b.daysRemaining === null) return -1;
      return a.daysRemaining - b.daysRemaining;
    });

    return summary;
  } catch (error) {
    console.error('Error getting warranty summary:', error);
    throw error;
  }
};

/**
 * Check if a warranty document upload is needed
 */
export const needsWarrantyDocument = (system) => {
  if (!system.warranty || !system.warranty.endDate) {
    return false;
  }

  // Check if warranty exists but no documents attached
  return !system.warranty.documentIds || system.warranty.documentIds.length === 0;
};
