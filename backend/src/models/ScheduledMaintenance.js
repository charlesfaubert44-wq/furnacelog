/**
 * ScheduledMaintenance Model
 *
 * Represents scheduled (upcoming/recurring) maintenance tasks for a home
 * Per PRD section 9.1.6
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const scheduledMaintenanceSchema = new Schema({
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },
  systemId: {
    type: Schema.Types.ObjectId,
    ref: 'System'
  },
  componentId: {
    type: Schema.Types.ObjectId,
    ref: 'Component'
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'MaintenanceTask'
    // Reference to library task
  },
  customTaskName: {
    type: String,
    trim: true,
    maxlength: 200
    // Used if not using a library task
  },
  scheduling: {
    dueDate: {
      type: Date,
      required: true,
      index: true
    },
    recurrence: {
      type: {
        type: String,
        enum: ['none', 'interval', 'seasonal', 'annual'],
        default: 'none'
      },
      intervalDays: {
        type: Number,
        min: 1
        // For interval-based recurrence
      },
      season: {
        type: String,
        enum: ['pre-freeze-up', 'winter', 'break-up', 'summer']
        // For seasonal recurrence
      },
      dayOfYear: {
        month: {
          type: Number,
          min: 1,
          max: 12
        },
        day: {
          type: Number,
          min: 1,
          max: 31
        }
        // For annual recurrence (e.g., May 15 every year)
      }
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'due', 'overdue', 'in-progress', 'completed', 'skipped', 'deferred'],
    default: 'scheduled',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedTo: {
    type: String,
    enum: ['self', 'provider'],
    default: 'self'
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceProvider'
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push']
    },
    daysBefore: {
      type: Number,
      min: 0
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  completedAt: Date,
  completedLogId: {
    type: Schema.Types.ObjectId,
    ref: 'MaintenanceLog'
  },
  skippedReason: String,
  deferredTo: Date
}, {
  timestamps: true
});

// Compound indexes for common queries
scheduledMaintenanceSchema.index({ homeId: 1, status: 1 });
scheduledMaintenanceSchema.index({ homeId: 1, 'scheduling.dueDate': 1 });
scheduledMaintenanceSchema.index({ systemId: 1, status: 1 });
scheduledMaintenanceSchema.index({ status: 1, 'scheduling.dueDate': 1 });

// Virtual for task name (either from library or custom)
scheduledMaintenanceSchema.virtual('taskName').get(function() {
  return this.customTaskName || (this.taskId ? this.populated('taskId')?.name : 'Unknown Task');
});

// Method to check if task is overdue
scheduledMaintenanceSchema.methods.checkOverdue = function() {
  if (this.status === 'completed' || this.status === 'skipped') {
    return false;
  }
  return this.scheduling.dueDate < new Date();
};

// Method to generate next occurrence for recurring tasks
scheduledMaintenanceSchema.methods.generateNextOccurrence = function() {
  if (this.scheduling.recurrence.type === 'none') {
    return null;
  }

  const nextDueDate = new Date(this.scheduling.dueDate);

  switch (this.scheduling.recurrence.type) {
    case 'interval':
      nextDueDate.setDate(nextDueDate.getDate() + this.scheduling.recurrence.intervalDays);
      break;
    case 'annual':
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      break;
    case 'seasonal':
      // Seasonal recurrence handled by application logic
      break;
  }

  return nextDueDate;
};

const ScheduledMaintenance = mongoose.model('ScheduledMaintenance', scheduledMaintenanceSchema);

export default ScheduledMaintenance;
