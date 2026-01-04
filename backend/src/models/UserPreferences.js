/**
 * UserPreferences Model
 * Stores user notification and preference settings from onboarding
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const userPreferencesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Notification Preferences
  reminderMethods: {
    type: [String],
    enum: ['email', 'in-app', 'weekly-digest', 'monthly-summary'],
    default: ['in-app']
  },

  reminderTiming: {
    type: String,
    enum: ['1-week', '2-weeks', '1-month', 'no-reminders'],
    default: '1-week'
  },

  // Feature Preferences
  autoGenerateChecklists: {
    type: Boolean,
    default: true
  },

  // User Profile
  diyLevel: {
    type: String,
    enum: ['all-diy', 'basic-diy', 'hire-most', 'learning'],
    default: 'basic-diy'
  },

  // Service Provider Preferences
  interestedInProviders: {
    type: Boolean,
    default: false
  },

  providerTypes: {
    type: [String],
    enum: ['hvac', 'plumber', 'electrician', 'septic', 'fuel-delivery', 'general'],
    default: []
  },

  // Display Preferences
  temperatureUnit: {
    type: String,
    enum: ['celsius', 'fahrenheit'],
    default: 'celsius'
  },

  dateFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },

  // Email notification toggles
  emailNotifications: {
    maintenanceReminders: {
      type: Boolean,
      default: true
    },
    warrantyExpiration: {
      type: Boolean,
      default: true
    },
    weatherAlerts: {
      type: Boolean,
      default: true
    },
    weeklyDigest: {
      type: Boolean,
      default: false
    },
    monthlyReports: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for efficient lookups
userPreferencesSchema.index({ userId: 1 });

// Static method to get or create preferences for a user
userPreferencesSchema.statics.getOrCreate = async function(userId) {
  let preferences = await this.findOne({ userId });

  if (!preferences) {
    preferences = await this.create({ userId });
  }

  return preferences;
};

// Instance method to update from onboarding data
userPreferencesSchema.methods.updateFromOnboarding = function(onboardingPreferences) {
  if (onboardingPreferences.reminderMethods) {
    this.reminderMethods = onboardingPreferences.reminderMethods;
  }
  if (onboardingPreferences.reminderTiming) {
    this.reminderTiming = onboardingPreferences.reminderTiming;
  }
  if (typeof onboardingPreferences.autoGenerateChecklists === 'boolean') {
    this.autoGenerateChecklists = onboardingPreferences.autoGenerateChecklists;
  }
  if (onboardingPreferences.diyLevel) {
    this.diyLevel = onboardingPreferences.diyLevel;
  }
  if (typeof onboardingPreferences.interestedInProviders === 'boolean') {
    this.interestedInProviders = onboardingPreferences.interestedInProviders;
  }
  if (onboardingPreferences.providerTypes) {
    this.providerTypes = onboardingPreferences.providerTypes;
  }

  return this.save();
};

export default mongoose.model('UserPreferences', userPreferencesSchema);
