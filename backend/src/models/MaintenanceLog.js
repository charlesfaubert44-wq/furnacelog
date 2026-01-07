/**
 * MaintenanceLog Model
 *
 * Represents completed maintenance activities with costs, photos, and details
 * Per PRD section 9.1.7
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const maintenanceLogSchema = new Schema({
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },
  systemId: {
    type: Schema.Types.ObjectId,
    ref: 'System',
    index: true
  },
  componentId: {
    type: Schema.Types.ObjectId,
    ref: 'Component'
  },
  scheduledMaintenanceId: {
    type: Schema.Types.ObjectId,
    ref: 'ScheduledMaintenance'
    // Link to scheduled task if this log completes one
  },
  taskPerformed: {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'MaintenanceTask'
    },
    customDescription: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  execution: {
    date: {
      type: Date,
      required: true,
      index: true
    },
    performedBy: {
      type: String,
      enum: ['self', 'provider', 'other'],
      required: true
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceProvider'
    },
    providerName: {
      type: String,
      trim: true
      // For 'other' or if provider not in system
    },
    duration: {
      type: Number,
      min: 0
      // minutes
    }
  },
  costs: {
    parts: [{
      description: {
        type: String,
        required: true
      },
      partNumber: String,
      quantity: {
        type: Number,
        min: 0,
        default: 1
      },
      unitCost: {
        type: Number,
        min: 0
      },
      totalCost: {
        type: Number,
        min: 0
      }
    }],
    labor: {
      type: Number,
      min: 0,
      default: 0
    },
    other: [{
      description: String,
      amount: {
        type: Number,
        min: 0
      }
    }],
    total: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  details: {
    notes: {
      type: String,
      maxlength: 5000
    },
    issuesDiscovered: [{
      type: String
    }],
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpNotes: String
  },
  // Provider Rating (for professional services)
  providerRating: {
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    wouldHireAgain: {
      type: Boolean
    },
    review: {
      type: String,
      maxlength: 1000
    }
  },
  photos: [{
    url: String,
    caption: String,
    category: {
      type: String,
      enum: ['before', 'during', 'after', 'other']
    },
    uploadedAt: Date
  }],
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
    // Link to receipts, invoices, etc.
  }],
  meterReadings: {
    // For tracking usage (oil tank levels, etc.)
    type: Map,
    of: Schema.Types.Mixed
  },
  followUpTasksCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'ScheduledMaintenance'
  }]
}, {
  timestamps: true
});

// Compound indexes for common queries
maintenanceLogSchema.index({ homeId: 1, 'execution.date': -1 });
maintenanceLogSchema.index({ systemId: 1, 'execution.date': -1 });
maintenanceLogSchema.index({ 'execution.providerId': 1, 'execution.date': -1 });
maintenanceLogSchema.index({ homeId: 1, 'costs.total': 1 });

// Pre-save hook to calculate total cost
maintenanceLogSchema.pre('save', function(next) {
  let partsTotal = 0;
  if (this.costs.parts && this.costs.parts.length > 0) {
    partsTotal = this.costs.parts.reduce((sum, part) => {
      return sum + (part.totalCost || (part.unitCost * part.quantity) || 0);
    }, 0);
  }

  let otherTotal = 0;
  if (this.costs.other && this.costs.other.length > 0) {
    otherTotal = this.costs.other.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  this.costs.total = partsTotal + (this.costs.labor || 0) + otherTotal;
  next();
});

// Virtual for task name
maintenanceLogSchema.virtual('taskName').get(function() {
  return this.taskPerformed.customDescription ||
         (this.taskPerformed.taskId ? this.populated('taskPerformed.taskId')?.name : 'Unknown Task');
});

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);

export default MaintenanceLog;
