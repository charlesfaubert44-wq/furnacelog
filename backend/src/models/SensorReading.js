/**
 * SensorReading Model
 * Time-series data for sensor measurements
 * Part of IoT Integration - Phase 1
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const SensorReadingSchema = new Schema({
  // Reference to sensor
  sensorId: {
    type: Schema.Types.ObjectId,
    ref: 'Sensor',
    required: true,
    index: true
  },

  // Reference to home (denormalized for faster queries)
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },

  // Reference to system (if sensor is linked to a system)
  systemId: {
    type: Schema.Types.ObjectId,
    ref: 'System',
    index: true
  },

  // Sensor type (denormalized for faster queries)
  sensorType: {
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

  // Reading data
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
    // Can be number, boolean, or object depending on sensor type
  },

  unit: {
    type: String,
    // °C, °F, %, L, ppm, W, etc.
  },

  // Timestamp of the reading
  timestamp: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  },

  // Quality indicators
  quality: {
    signalStrength: Number,    // RSSI or similar (dBm)
    batteryLevel: Number,      // Percentage
    isCalibrated: {
      type: Boolean,
      default: true
    }
  },

  // Raw data from sensor (if different from processed value)
  rawData: {
    type: mongoose.Schema.Types.Mixed
  },

  // Alert triggered flag
  alertTriggered: {
    type: Boolean,
    default: false,
    index: true
  },

  // Metadata
  source: {
    type: String,
    default: 'mqtt',
    // mqtt, http, manual, etc.
  }
}, {
  timestamps: false // We use timestamp field instead
});

// Compound indexes for efficient time-series queries
SensorReadingSchema.index({ sensorId: 1, timestamp: -1 });
SensorReadingSchema.index({ homeId: 1, timestamp: -1 });
SensorReadingSchema.index({ homeId: 1, sensorType: 1, timestamp: -1 });
SensorReadingSchema.index({ timestamp: -1 }); // For cleanup jobs

// TTL index to automatically delete old readings (optional, default 90 days)
SensorReadingSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 days
);

// Static method to get latest reading for a sensor
SensorReadingSchema.statics.getLatest = function(sensorId) {
  return this.findOne({ sensorId }).sort({ timestamp: -1 }).lean();
};

// Static method to get readings in a time range
SensorReadingSchema.statics.getRange = function(sensorId, startDate, endDate) {
  return this.find({
    sensorId,
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ timestamp: 1 }).lean();
};

// Static method to get aggregated stats
SensorReadingSchema.statics.getStats = async function(sensorId, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const stats = await this.aggregate([
    {
      $match: {
        sensorId: new mongoose.Types.ObjectId(sensorId),
        timestamp: { $gte: since }
      }
    },
    {
      $group: {
        _id: null,
        min: { $min: '$value' },
        max: { $max: '$value' },
        avg: { $avg: '$value' },
        count: { $sum: 1 },
        latest: { $last: '$value' }
      }
    }
  ]);

  return stats[0] || { min: null, max: null, avg: null, count: 0, latest: null };
};

// Static method to get downsampled data (for charts)
SensorReadingSchema.statics.getDownsampled = async function(sensorId, startDate, endDate, buckets = 100) {
  const timeRange = endDate - startDate;
  const bucketSize = timeRange / buckets;

  return this.aggregate([
    {
      $match: {
        sensorId: new mongoose.Types.ObjectId(sensorId),
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $toDate: {
            $subtract: [
              { $toLong: '$timestamp' },
              { $mod: [{ $toLong: '$timestamp' }, bucketSize] }
            ]
          }
        },
        avgValue: { $avg: '$value' },
        minValue: { $min: '$value' },
        maxValue: { $max: '$value' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        timestamp: '$_id',
        value: '$avgValue',
        min: '$minValue',
        max: '$maxValue',
        count: '$count',
        _id: 0
      }
    }
  ]);
};

export default mongoose.model('SensorReading', SensorReadingSchema);
