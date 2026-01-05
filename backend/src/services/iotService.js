/**
 * IoT Service
 * Handles MQTT connection, sensor data ingestion, and real-time processing
 * Part of IoT Integration - Phase 1
 */

import mqtt from 'mqtt';
import { EventEmitter } from 'events';
import Sensor from '../models/Sensor.js';
import SensorReading from '../models/SensorReading.js';
import logger from '../utils/logger.js';

class IoTService extends EventEmitter {
  constructor() {
    super();
    this.client = null;
    this.isConnected = false;
    this.sensors = new Map(); // Cache of sensor configs
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  /**
   * Initialize MQTT connection
   */
  async connect() {
    try {
      const options = {
        host: process.env.MQTT_HOST || 'localhost',
        port: parseInt(process.env.MQTT_PORT || '1883'),
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        clientId: `furnacelog-backend-${Date.now()}`,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        keepalive: 60,
        will: {
          topic: 'furnacelog/status',
          payload: JSON.stringify({ status: 'offline', timestamp: new Date() }),
          qos: 1,
          retain: true
        }
      };

      // For development without MQTT broker
      if (process.env.MQTT_DISABLED === 'true') {
        logger.info('🔌 MQTT disabled via environment variable');
        return;
      }

      this.client = mqtt.connect(options);

      this.client.on('connect', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        logger.info('✅ IoT Service: Connected to MQTT broker');

        // Subscribe to all sensor topics
        this.client.subscribe('furnacelog/sensors/#', { qos: 1 }, (err) => {
          if (err) {
            logger.error('Failed to subscribe to sensor topics:', err);
          } else {
            logger.info('📡 Subscribed to: furnacelog/sensors/#');
          }
        });

        // Publish connection status
        this.client.publish(
          'furnacelog/status',
          JSON.stringify({ status: 'online', timestamp: new Date() }),
          { qos: 1, retain: true }
        );

        this.emit('connected');
      });

      this.client.on('message', async (topic, message) => {
        await this.handleMessage(topic, message);
      });

      this.client.on('error', (error) => {
        logger.error('MQTT connection error:', error);
        this.emit('error', error);
      });

      this.client.on('offline', () => {
        this.isConnected = false;
        logger.warn('⚠️  MQTT client offline');
        this.emit('offline');
      });

      this.client.on('reconnect', () => {
        this.reconnectAttempts++;
        logger.info(`🔄 MQTT reconnecting... (attempt ${this.reconnectAttempts})`);

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          logger.error('Max reconnection attempts reached');
          this.client.end();
        }
      });

      this.client.on('close', () => {
        this.isConnected = false;
        logger.warn('MQTT connection closed');
      });

    } catch (error) {
      logger.error('Failed to initialize MQTT:', error);
      throw error;
    }
  }

  /**
   * Handle incoming MQTT messages
   */
  async handleMessage(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      logger.debug(`📨 MQTT message received - Topic: ${topic}`, data);

      // Extract sensor ID from topic
      // Expected format: furnacelog/sensors/{sensorId} or furnacelog/sensors/{sensorId}/{type}
      const topicParts = topic.split('/');
      const sensorId = topicParts[2];

      if (!sensorId) {
        logger.warn('Invalid topic format:', topic);
        return;
      }

      // Process the sensor data
      await this.processSensorData(sensorId, data);

    } catch (error) {
      logger.error('Error handling MQTT message:', error);
    }
  }

  /**
   * Process sensor data
   */
  async processSensorData(sensorId, data) {
    try {
      // Find sensor in database
      let sensor = this.sensors.get(sensorId);

      if (!sensor) {
        sensor = await Sensor.findOne({ sensorId }).lean();
        if (sensor) {
          this.sensors.set(sensorId, sensor); // Cache it
        }
      }

      if (!sensor) {
        logger.warn(`Sensor not found: ${sensorId}`);
        return;
      }

      // Extract value based on sensor type
      const value = this.extractValue(data, sensor.type);

      // Update sensor's last reading and last seen
      await Sensor.findByIdAndUpdate(sensor._id, {
        lastSeen: new Date(),
        lastReading: {
          value,
          timestamp: new Date(),
          raw: data
        },
        'specs.batteryLevel': data.battery || sensor.specs.batteryLevel
      });

      // Create sensor reading record
      const reading = await SensorReading.create({
        sensorId: sensor._id,
        homeId: sensor.homeId,
        systemId: sensor.systemId,
        sensorType: sensor.type,
        value,
        unit: sensor.specs.unit,
        timestamp: new Date(data.timestamp || Date.now()),
        quality: {
          signalStrength: data.rssi || data.signal,
          batteryLevel: data.battery,
          isCalibrated: true
        },
        rawData: data,
        source: 'mqtt'
      });

      // Check alert rules
      const sensorDoc = await Sensor.findById(sensor._id);
      const triggeredAlerts = sensorDoc.checkAlerts(value);

      if (triggeredAlerts.length > 0) {
        // Save updated sensor with alert timestamps
        await sensorDoc.save();

        // Emit alert event
        for (const alert of triggeredAlerts) {
          this.emit('alert', {
            ...alert,
            readingId: reading._id,
            homeId: sensor.homeId
          });
          logger.warn(`🚨 Alert triggered: ${alert.name} - ${sensor.name} = ${value}`);
        }

        // Update reading to mark alert
        reading.alertTriggered = true;
        await reading.save();
      }

      // Emit reading event for WebSocket broadcast
      this.emit('reading', {
        sensorId: sensor._id,
        sensorIdStr: sensorId,
        homeId: sensor.homeId,
        systemId: sensor.systemId,
        type: sensor.type,
        name: sensor.name,
        value,
        unit: sensor.specs.unit,
        timestamp: reading.timestamp,
        battery: data.battery
      });

      // Update cache
      this.sensors.set(sensorId, { ...sensor, lastSeen: new Date() });

    } catch (error) {
      logger.error('Error processing sensor data:', error);
    }
  }

  /**
   * Extract value from sensor data based on type
   */
  extractValue(data, sensorType) {
    // Handle different sensor data formats
    switch (sensorType) {
      case 'temperature':
        return data.temperature || data.temp || data.value;
      case 'humidity':
        return data.humidity || data.value;
      case 'water-leak':
        return data.leak || data.water || data.detected || data.value;
      case 'water-level':
        return data.level || data.percentage || data.value;
      case 'fuel-level':
        return data.level || data.percentage || data.value;
      case 'air-quality':
        return data.aqi || data.quality || data.value;
      case 'co2':
        return data.co2 || data.value;
      case 'co':
        return data.co || data.value;
      case 'power':
        return data.power || data.watts || data.value;
      case 'vibration':
        return data.vibration || data.acceleration || data.value;
      case 'pressure':
        return data.pressure || data.value;
      case 'door-window':
        return data.open || data.state || data.value;
      case 'motion':
        return data.motion || data.detected || data.value;
      default:
        return data.value;
    }
  }

  /**
   * Publish message to MQTT (for two-way communication)
   */
  publish(topic, message, options = {}) {
    if (!this.isConnected || !this.client) {
      logger.warn('Cannot publish: MQTT not connected');
      return false;
    }

    const payload = typeof message === 'string' ? message : JSON.stringify(message);

    this.client.publish(topic, payload, { qos: options.qos || 0 }, (err) => {
      if (err) {
        logger.error('Failed to publish message:', err);
      }
    });

    return true;
  }

  /**
   * Subscribe to additional topic
   */
  subscribe(topic, callback) {
    if (!this.isConnected || !this.client) {
      logger.warn('Cannot subscribe: MQTT not connected');
      return false;
    }

    this.client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        logger.error(`Failed to subscribe to ${topic}:`, err);
      } else {
        logger.info(`📡 Subscribed to: ${topic}`);
        if (callback) callback();
      }
    });

    return true;
  }

  /**
   * Disconnect from MQTT
   */
  async disconnect() {
    if (this.client) {
      // Publish offline status
      if (this.isConnected) {
        this.client.publish(
          'furnacelog/status',
          JSON.stringify({ status: 'offline', timestamp: new Date() }),
          { qos: 1, retain: true }
        );
      }

      this.client.end(true);
      this.isConnected = false;
      logger.info('Disconnected from MQTT broker');
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      cachedSensors: this.sensors.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Clear sensor cache (useful for testing or when sensors are updated)
   */
  clearCache() {
    this.sensors.clear();
    logger.info('Sensor cache cleared');
  }
}

// Singleton instance
const iotService = new IoTService();

export default iotService;
