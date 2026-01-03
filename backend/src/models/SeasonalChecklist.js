/**
 * SeasonalChecklist Model
 *
 * Represents seasonal checklists for northern home preparation
 * Per PRD section 9.1.11
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const seasonalChecklistSchema = new Schema({
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },
  season: {
    type: String,
    enum: ['pre-freeze-up', 'winter', 'break-up', 'summer'],
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2100
  },
  items: [{
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'MaintenanceTask'
    },
    customDescription: {
      type: String,
      trim: true,
      maxlength: 300
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped', 'not-applicable'],
      default: 'pending'
    },
    completedAt: Date,
    notes: {
      type: String,
      maxlength: 1000
    }
  }],
  startDate: {
    type: Date,
    required: true
  },
  targetEndDate: {
    type: Date,
    required: true
  },
  completedAt: Date,
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
    // Percentage of items completed
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
seasonalChecklistSchema.index({ homeId: 1, season: 1, year: 1 }, { unique: true });
seasonalChecklistSchema.index({ homeId: 1, year: 1 });

// Pre-save hook to calculate progress
seasonalChecklistSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    const completedCount = this.items.filter(item =>
      item.status === 'completed' || item.status === 'not-applicable'
    ).length;
    this.progress = Math.round((completedCount / this.items.length) * 100);

    // Set completedAt if all items are done
    if (this.progress === 100 && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

// Static method to generate checklist from templates
seasonalChecklistSchema.statics.generateFromTemplate = async function(homeId, season, year) {
  const MaintenanceTask = mongoose.model('MaintenanceTask');

  // Find all tasks applicable to this season
  const seasonalTasks = await MaintenanceTask.find({
    'scheduling.seasonal.applicable': true,
    'scheduling.seasonal.seasons': season,
    isBuiltIn: true
  });

  // Determine start and end dates based on season
  const dates = getSeasonDates(season, year);

  const items = seasonalTasks.map(task => ({
    taskId: task._id,
    status: 'pending'
  }));

  return this.create({
    homeId,
    season,
    year,
    items,
    startDate: dates.start,
    targetEndDate: dates.end,
    progress: 0
  });
};

// Helper function to get season dates
function getSeasonDates(season, year) {
  const dates = {
    'pre-freeze-up': {
      start: new Date(year, 8, 1),   // September 1
      end: new Date(year, 9, 31)     // October 31
    },
    'winter': {
      start: new Date(year, 10, 1),  // November 1
      end: new Date(year + 1, 2, 31) // March 31
    },
    'break-up': {
      start: new Date(year, 3, 1),   // April 1
      end: new Date(year, 4, 31)     // May 31
    },
    'summer': {
      start: new Date(year, 5, 1),   // June 1
      end: new Date(year, 7, 31)     // August 31
    }
  };

  return dates[season] || { start: new Date(), end: new Date() };
}

const SeasonalChecklist = mongoose.model('SeasonalChecklist', seasonalChecklistSchema);

export default SeasonalChecklist;
