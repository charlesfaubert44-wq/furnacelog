/**
 * WeatherData Model
 *
 * Stores historical weather data for climate time machine
 * Integrates with Environment Canada API
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const weatherDataSchema = new Schema({
  location: {
    community: {
      type: String,
      required: true,
      index: true
    },
    territory: {
      type: String,
      enum: ['NWT', 'Nunavut', 'Yukon', 'Other'],
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  temperature: {
    high: {
      type: Number,
      required: true
    },
    low: {
      type: Number,
      required: true
    },
    mean: {
      type: Number,
      required: true
    }
  },
  precipitation: {
    amount: {
      type: Number, // mm
      default: 0
    },
    type: {
      type: String,
      enum: ['none', 'rain', 'snow', 'mixed', 'ice'],
      default: 'none'
    },
    snowfall: {
      type: Number, // cm
      default: 0
    }
  },
  wind: {
    speed: {
      type: Number, // km/h
      default: 0
    },
    direction: {
      type: String
    },
    chill: {
      type: Number // Wind chill temperature
    }
  },
  conditions: {
    type: String, // Clear, Cloudy, Overcast, etc.
    trim: true
  },
  extremeEvents: [{
    type: {
      type: String,
      enum: ['cold-snap', 'heat-wave', 'blizzard', 'high-wind', 'ice-storm', 'heavy-snow']
    },
    severity: {
      type: String,
      enum: ['moderate', 'severe', 'extreme']
    },
    description: String
  }],
  dataSource: {
    type: String,
    enum: ['environment-canada', 'manual', 'estimated'],
    default: 'environment-canada'
  },
  dataQuality: {
    type: String,
    enum: ['good', 'fair', 'poor', 'estimated'],
    default: 'good'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
weatherDataSchema.index({ 'location.community': 1, date: -1 });
weatherDataSchema.index({ 'location.coordinates': '2dsphere' });
weatherDataSchema.index({ date: 1, 'location.community': 1 });
weatherDataSchema.index({ 'temperature.low': 1, date: 1 }); // For cold snap detection

// Static method to find weather for date range
weatherDataSchema.statics.findByDateRange = function(community, startDate, endDate) {
  return this.find({
    'location.community': community,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
};

// Static method to find extreme weather events
weatherDataSchema.statics.findExtremeEvents = function(community, startDate, endDate) {
  return this.find({
    'location.community': community,
    date: { $gte: startDate, $lte: endDate },
    'extremeEvents.0': { $exists: true } // Has at least one extreme event
  }).sort({ date: -1 });
};

// Static method to detect cold snaps
weatherDataSchema.statics.detectColdSnaps = function(community, startDate, endDate, threshold = -30) {
  return this.find({
    'location.community': community,
    date: { $gte: startDate, $lte: endDate },
    'temperature.low': { $lte: threshold }
  }).sort({ date: 1 });
};

// Method to categorize severity
weatherDataSchema.methods.getTemperatureSeverity = function() {
  if (this.temperature.low <= -40) return 'extreme-cold';
  if (this.temperature.low <= -30) return 'severe-cold';
  if (this.temperature.low <= -20) return 'moderate-cold';
  if (this.temperature.high >= 25) return 'warm';
  if (this.temperature.high >= 30) return 'hot';
  return 'normal';
};

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

export default WeatherData;
