/**
 * IoT Controller
 * Handles sensor management and readings API endpoints
 * Part of IoT Integration - Phase 1
 */

import Sensor from '../models/Sensor.js';
import SensorReading from '../models/SensorReading.js';
import Home from '../models/Home.js';
import iotService from '../services/iotService.js';
import alertService from '../services/alertService.js';
import logger from '../utils/logger.js';

/**
 * Get all sensors for a home
 * GET /api/v1/homes/:homeId/sensors
 */
export async function getSensors(req, res) {
  try {
    const { homeId } = req.params;
    const { type, status, systemId } = req.query;

    // Build query
    const query = { homeId, isActive: true };
    if (type) query.type = type;
    if (status) query.status = status;
    if (systemId) query.systemId = systemId;

    const sensors = await Sensor.find(query)
      .populate('systemId', 'name category type')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        sensors: sensors.map(sensor => ({
          ...sensor,
          isOnline: sensor.lastSeen && (Date.now() - new Date(sensor.lastSeen).getTime()) < 15 * 60 * 1000
        })),
        total: sensors.length
      }
    });

  } catch (error) {
    logger.error('Error fetching sensors:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch sensors'
      }
    });
  }
}

/**
 * Get single sensor details
 * GET /api/v1/homes/:homeId/sensors/:sensorId
 */
export async function getSensor(req, res) {
  try {
    const { sensorId } = req.params;

    const sensor = await Sensor.findById(sensorId)
      .populate('systemId', 'name category type')
      .populate('homeId', 'name address');

    if (!sensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SENSOR_NOT_FOUND',
          message: 'Sensor not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        sensor: {
          ...sensor.toJSON(),
          isOnline: sensor.lastSeen && (Date.now() - sensor.lastSeen.getTime()) < 15 * 60 * 1000
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching sensor:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch sensor'
      }
    });
  }
}

/**
 * Create/register a new sensor
 * POST /api/v1/homes/:homeId/sensors
 */
export async function createSensor(req, res) {
  try {
    const { homeId } = req.params;
    const sensorData = req.body;

    // Verify home exists and user owns it
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOME_NOT_FOUND',
          message: 'Home not found'
        }
      });
    }

    // Check if sensor ID already exists
    const existing = await Sensor.findOne({ sensorId: sensorData.sensorId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'SENSOR_EXISTS',
          message: 'Sensor with this ID already exists'
        }
      });
    }

    // Create default alert rules based on sensor type
    const defaultAlerts = getDefaultAlertRules(sensorData.type);

    // Create sensor
    const sensor = await Sensor.create({
      ...sensorData,
      homeId,
      alerts: {
        enabled: true,
        rules: defaultAlerts
      }
    });

    // Build MQTT topic
    if (!sensor.mqttTopic && iotService.isConnected) {
      sensor.mqttTopic = `furnacelog/sensors/${sensor.sensorId}`;
      await sensor.save();

      // Subscribe to sensor topic
      iotService.subscribe(sensor.mqttTopic);
    }

    logger.info(`Sensor created: ${sensor.name} (${sensor.sensorId})`);

    res.status(201).json({
      success: true,
      data: { sensor }
    });

  } catch (error) {
    logger.error('Error creating sensor:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create sensor',
        details: process.env.NODE_ENV === 'development' ? [error.message] : []
      }
    });
  }
}

/**
 * Update sensor configuration
 * PATCH /api/v1/homes/:homeId/sensors/:sensorId
 */
export async function updateSensor(req, res) {
  try {
    const { sensorId } = req.params;
    const updates = req.body;

    const sensor = await Sensor.findByIdAndUpdate(
      sensorId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!sensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SENSOR_NOT_FOUND',
          message: 'Sensor not found'
        }
      });
    }

    // Clear cache for this sensor
    iotService.clearCache();

    res.json({
      success: true,
      data: { sensor }
    });

  } catch (error) {
    logger.error('Error updating sensor:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update sensor'
      }
    });
  }
}

/**
 * Delete sensor
 * DELETE /api/v1/homes/:homeId/sensors/:sensorId
 */
export async function deleteSensor(req, res) {
  try {
    const { sensorId } = req.params;

    const sensor = await Sensor.findByIdAndUpdate(
      sensorId,
      { isActive: false },
      { new: true }
    );

    if (!sensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SENSOR_NOT_FOUND',
          message: 'Sensor not found'
        }
      });
    }

    logger.info(`Sensor deleted: ${sensor.name}`);

    res.json({
      success: true,
      message: 'Sensor deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting sensor:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete sensor'
      }
    });
  }
}

/**
 * Get sensor readings
 * GET /api/v1/homes/:homeId/sensors/:sensorId/readings
 */
export async function getSensorReadings(req, res) {
  try {
    const { sensorId } = req.params;
    const { hours = 24, downsample = false, buckets = 100 } = req.query;

    const hoursNum = parseInt(hours);
    const startDate = new Date(Date.now() - hoursNum * 60 * 60 * 1000);
    const endDate = new Date();

    let readings;

    if (downsample === 'true') {
      // Get downsampled data for charts
      readings = await SensorReading.getDownsampled(
        sensorId,
        startDate,
        endDate,
        parseInt(buckets)
      );
    } else {
      // Get raw readings
      readings = await SensorReading.getRange(sensorId, startDate, endDate);
    }

    // Get stats
    const stats = await SensorReading.getStats(sensorId, hoursNum);

    res.json({
      success: true,
      data: {
        readings,
        stats,
        period: {
          start: startDate,
          end: endDate,
          hours: hoursNum
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching sensor readings:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch sensor readings'
      }
    });
  }
}

/**
 * Manual sensor reading submission (HTTP POST)
 * POST /api/v1/iot/sensor-data
 */
export async function submitSensorData(req, res) {
  try {
    const { sensorId, value, timestamp, battery, rssi } = req.body;

    // Find sensor
    const sensor = await Sensor.findOne({ sensorId });
    if (!sensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SENSOR_NOT_FOUND',
          message: 'Sensor not found'
        }
      });
    }

    // Process the data through IoT service (same path as MQTT)
    await iotService.processSensorData(sensorId, {
      value,
      timestamp: timestamp || new Date(),
      battery,
      rssi
    });

    res.json({
      success: true,
      message: 'Sensor data received'
    });

  } catch (error) {
    logger.error('Error submitting sensor data:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process sensor data'
      }
    });
  }
}

/**
 * Get active alerts for a home
 * GET /api/v1/homes/:homeId/alerts
 */
export async function getAlerts(req, res) {
  try {
    const { homeId } = req.params;
    const { limit = 50 } = req.query;

    const alerts = await alertService.getActiveAlerts(homeId, parseInt(limit));

    res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length
      }
    });

  } catch (error) {
    logger.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch alerts'
      }
    });
  }
}

/**
 * Acknowledge/dismiss an alert
 * POST /api/v1/homes/:homeId/alerts/:alertId/acknowledge
 */
export async function acknowledgeAlert(req, res) {
  try {
    const { sensorId, ruleId } = req.body;

    const result = await alertService.acknowledgeAlert(sensorId, ruleId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Alert acknowledged'
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'ACKNOWLEDGEMENT_FAILED',
          message: result.error
        }
      });
    }

  } catch (error) {
    logger.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to acknowledge alert'
      }
    });
  }
}

/**
 * Get IoT service status
 * GET /api/v1/iot/status
 */
export async function getIoTStatus(req, res) {
  try {
    const status = iotService.getStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    logger.error('Error fetching IoT status:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch status'
      }
    });
  }
}

/**
 * Helper: Get default alert rules based on sensor type
 */
function getDefaultAlertRules(sensorType) {
  const rules = {
    'temperature': [
      {
        name: 'Freeze Risk',
        condition: 'below',
        threshold: 5,
        severity: 'critical',
        message: 'Temperature below 5°C - Freeze risk!',
        enabled: true,
        cooldownMinutes: 30
      },
      {
        name: 'High Temperature',
        condition: 'above',
        threshold: 30,
        severity: 'warning',
        message: 'Temperature above 30°C',
        enabled: true,
        cooldownMinutes: 60
      }
    ],
    'water-leak': [
      {
        name: 'Water Detected',
        condition: 'equals',
        threshold: 1,
        severity: 'critical',
        message: 'Water leak detected!',
        enabled: true,
        cooldownMinutes: 5
      }
    ],
    'fuel-level': [
      {
        name: 'Low Fuel',
        condition: 'below',
        threshold: 20,
        severity: 'warning',
        message: 'Fuel level below 20%',
        enabled: true,
        cooldownMinutes: 360 // 6 hours
      },
      {
        name: 'Critical Fuel',
        condition: 'below',
        threshold: 10,
        severity: 'critical',
        message: 'Fuel level critically low!',
        enabled: true,
        cooldownMinutes: 180 // 3 hours
      }
    ],
    'co': [
      {
        name: 'CO Detected',
        condition: 'above',
        threshold: 50,
        severity: 'critical',
        message: 'Carbon monoxide detected!',
        enabled: true,
        cooldownMinutes: 5
      }
    ],
    'co2': [
      {
        name: 'High CO2',
        condition: 'above',
        threshold: 1000,
        severity: 'warning',
        message: 'CO2 level high - ventilation needed',
        enabled: true,
        cooldownMinutes: 60
      }
    ]
  };

  return rules[sensorType] || [];
}

export default {
  getSensors,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorReadings,
  submitSensorData,
  getAlerts,
  acknowledgeAlert,
  getIoTStatus
};
