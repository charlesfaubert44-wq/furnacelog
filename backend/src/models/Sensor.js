/**
 * Sensor Model
 * Represents an IoT sensor device (temperature, leak, fuel level, etc.)
 * Part of IoT Integration - Phase 1
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const SensorSchema = new Schema({
  // Reference to parent home
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },

  // Optional: Link to specific system (e.g., furnace temp sensor)
  systemId: {
    type: Schema.Types.ObjectId,
    ref: 'System',
    index: true
  },

  // Sensor identification
  sensorId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    // Unique device identifier (MAC address, UUID, etc.)
  },

  // Sensor metadata
  name: {
    type: String,
    required: true,
    trim: true,
    // User-friendly name like "Living Room Temperature" or "Basement Leak Detector"
  },

  type: {
    type: String,
    required: true,
    enum: [
      'temperature',
      'humidity',
      'water-leak',
      'water-level',
      'fuel-level',
      'air-quality',
      'co2',
      'co',
      'power',
      'vibration',
      'pressure',
      'door-window',
      'motion',
      'other'
    ],
    index: true
  },

  // Physical location in home
  location: {
    type: String,
    trim: true,
    // e.g., "Living Room", "Mechanical Room", "Crawlspace"
  },

  // Sensor specifications
  specs: {
    manufacturer: String,
    model: String,
    serialNumber: String,
    firmware: String,

    // Measurement specs
    unit: String,               // °C, %, L, ppm, etc.
    minValue: Number,
    maxValue: Number,
    accuracy: String,

    // Communication
    protocol: {
      type: String,
      enum: ['mqtt', 'http', 'websocket', 'zigbee', 'zwave', 'bluetooth', 'lora'],
      default: 'mqtt'
    },

    // Battery info
    batteryPowered: {
      type: Boolean,
      default: false
    },
    batteryLevel: Number,       // Percentage 0-100
    lastBatteryCheck: Date,

    // Update frequency
    updateInterval: {
      type: Number,
      default: 300,             // Seconds (default: 5 minutes)
    }
  },

  // Alert configuration
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    rules: [{
      name: String,
      condition: {
        type: String,
        enum: ['above', 'below', 'equals', 'change', 'no-update'],
        required: true
      },
      threshold: Number,
      severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'warning'
      },
      message: String,
      enabled: {
        type: Boolean,
        default: true
      },
      cooldownMinutes: {
        type: Number,
        default: 60           // Don't spam alerts
      },
      lastTriggered: Date
    }]
  },

  // Calibration
  calibration: {
    offset: {
      type: Number,
      default: 0
    },
    multiplier: {
      type: Number,
      default: 1
    },
    lastCalibrated: Date,
    calibratedBy: String
  },

  // Current status
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'low-battery', 'offline'],
    default: 'active',
    index: true
  },

  // Connection status
  lastSeen: {
    type: Date,
    index: true
  },
  lastReading: {
    value: mongoose.Schema.Types.Mixed,
    timestamp: Date,
    raw: mongoose.Schema.Types.Mixed  // Store raw sensor data if needed
  },

  // MQTT topic (if using MQTT)
  mqttTopic: {
    type: String,
    index: true,
    sparse: true
  },

  // Metadata
  notes: String,

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
SensorSchema.index({ homeId: 1, type: 1 });
SensorSchema.index({ homeId: 1, isActive: 1 });
SensorSchema.index({ systemId: 1 }, { sparse: true });
SensorSchema.index({ lastSeen: 1 });
SensorSchema.index({ 'specs.batteryPowered': 1, 'specs.batteryLevel': 1 });

// Virtual for connection status (online if seen in last 15 minutes)
SensorSchema.virtual('isOnline').get(function() {
  if (!this.lastSeen) return false;
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  return this.lastSeen > fifteenMinutesAgo;
});

// Virtual for battery status
SensorSchema.virtual('batteryStatus').get(function() {
  if (!this.specs.batteryPowered) return 'n/a';
  if (!this.specs.batteryLevel) return 'unknown';

  if (this.specs.batteryLevel < 10) return 'critical';
  if (this.specs.batteryLevel < 20) return 'low';
  if (this.specs.batteryLevel < 50) return 'medium';
  return 'good';
});

// Method to update last reading
SensorSchema.methods.updateReading = async function(value, rawData = null) {
  // Apply calibration
  let calibratedValue = value;
  if (typeof value === 'number') {
    calibratedValue = (value * this.calibration.multiplier) + this.calibration.offset;
  }

  this.lastReading = {
    value: calibratedValue,
    timestamp: new Date(),
    raw: rawData
  };
  this.lastSeen = new Date();

  // Update status to active if it was offline
  if (this.status === 'offline' || this.status === 'error') {
    this.status = 'active';
  }

  await this.save();
  return calibratedValue;
};

// Method to check alert rules
SensorSchema.methods.checkAlerts = function(value) {
  if (!this.alerts.enabled || !this.alerts.rules) return [];

  const now = new Date();
  const triggeredAlerts = [];

  for (const rule of this.alerts.rules) {
    if (!rule.enabled) continue;

    // Check cooldown
    if (rule.lastTriggered) {
      const cooldownMs = rule.cooldownMinutes * 60 * 1000;
      const timeSinceLastTrigger = now - rule.lastTriggered;
      if (timeSinceLastTrigger < cooldownMs) continue;
    }

    let shouldTrigger = false;

    switch (rule.condition) {
      case 'above':
        shouldTrigger = value > rule.threshold;
        break;
      case 'below':
        shouldTrigger = value < rule.threshold;
        break;
      case 'equals':
        shouldTrigger = value === rule.threshold;
        break;
      case 'change':
        // Trigger if value changed by more than threshold
        if (this.lastReading && this.lastReading.value !== null) {
          const change = Math.abs(value - this.lastReading.value);
          shouldTrigger = change > rule.threshold;
        }
        break;
    }

    if (shouldTrigger) {
      triggeredAlerts.push({
        ...rule.toObject(),
        currentValue: value,
        sensor: {
          id: this._id,
          name: this.name,
          type: this.type,
          location: this.location
        }
      });

      // Update last triggered time
      rule.lastTriggered = now;
    }
  }

  return triggeredAlerts;
};

// Static method to find sensors needing battery replacement
SensorSchema.statics.findLowBattery = function(homeId, threshold = 20) {
  return this.find({
    homeId,
    isActive: true,
    'specs.batteryPowered': true,
    'specs.batteryLevel': { $lte: threshold }
  });
};

// Static method to find offline sensors
SensorSchema.statics.findOffline = function(homeId, minutesOffline = 15) {
  const thresholdDate = new Date(Date.now() - minutesOffline * 60 * 1000);
  return this.find({
    homeId,
    isActive: true,
    lastSeen: { $lt: thresholdDate }
  });
};

// Pre-save middleware to update timestamps
SensorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Ensure virtuals are included in JSON
SensorSchema.set('toJSON', { virtuals: true });
SensorSchema.set('toObject', { virtuals: true });

export default mongoose.model('Sensor', SensorSchema);
