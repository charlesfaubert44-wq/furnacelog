/**
 * MaintenanceTask Model
 *
 * Represents a task in the maintenance library (both built-in and custom tasks)
 * Per PRD section 9.1.5
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const maintenanceTaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['routine', 'seasonal', 'reactive', 'emergency'],
    required: true
  },
  applicableSystems: [{
    type: String,
    // System categories from PRD: heating, plumbing, electrical, ventilation, etc.
  }],
  applicableHomeTypes: [{
    type: String,
    // Home types: modular, stick-built, log, mobile
  }],
  scheduling: {
    intervalDays: {
      type: Number,
      min: 0
    },
    seasonal: {
      applicable: {
        type: Boolean,
        default: false
      },
      seasons: [{
        type: String,
        enum: ['pre-freeze-up', 'winter', 'break-up', 'summer']
      }]
    },
    triggerConditions: [{
      type: String,
      // e.g., 'temperature below -30', 'before freeze-up', etc.
    }]
  },
  execution: {
    difficultyLevel: {
      type: String,
      enum: ['diy-easy', 'diy-moderate', 'professional'],
      required: true
    },
    estimatedMinutes: {
      type: Number,
      min: 0
    },
    toolsRequired: [{
      type: String
    }],
    suppliesRequired: [{
      type: String
    }],
    instructions: [{
      type: String
      // Step-by-step instructions
    }],
    safetyWarnings: [{
      type: String
    }],
    videoUrl: {
      type: String,
      match: /^https?:\/\/.+/
    }
  },
  cost: {
    diyEstimate: {
      type: Number,
      min: 0
    },
    professionalEstimate: {
      type: Number,
      min: 0
    }
  },
  relatedTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'MaintenanceTask'
  }],
  isBuiltIn: {
    type: Boolean,
    default: false
    // System-provided vs user-created
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // null for built-in tasks
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
maintenanceTaskSchema.index({ category: 1 });
maintenanceTaskSchema.index({ applicableSystems: 1 });
maintenanceTaskSchema.index({ 'execution.difficultyLevel': 1 });
maintenanceTaskSchema.index({ isBuiltIn: 1 });
maintenanceTaskSchema.index({ name: 'text', description: 'text' });

const MaintenanceTask = mongoose.model('MaintenanceTask', maintenanceTaskSchema);

export default MaintenanceTask;
