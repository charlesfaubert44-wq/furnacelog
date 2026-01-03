/**
 * Component Model
 * Represents individual replaceable parts/components within a system
 * (filters, anode rods, heat trace zones, HRV cores, etc.)
 *
 * Based on PRD Section 9.1.4
 * Part of Epic E4 - System & Component Tracking
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const ComponentSchema = new Schema({
  // Reference to parent home and system
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },

  systemId: {
    type: Schema.Types.ObjectId,
    ref: 'System',
    required: true,
    index: true
  },

  // Component identification
  name: {
    type: String,
    required: true,
    // User-friendly name like "Furnace Air Filter" or "HRV Intake Filter"
  },

  type: {
    type: String,
    required: true,
    enum: [
      'filter',
      'anode-rod',
      'heat-trace-zone',
      'hrv-core',
      'hrv-filter',
      'igniter',
      'flame-sensor',
      'thermocouple',
      'circulator-pump',
      'expansion-tank',
      'pressure-relief-valve',
      'mixing-valve',
      'belt',
      'pilot-assembly',
      'transformer',
      'capacitor',
      'contactor',
      'other'
    ],
    index: true
  },

  // Detailed specifications
  details: {
    partNumber: String,
    manufacturer: String,
    model: String,
    size: String,               // e.g., "16x20x1", "3/4 inch"
    specifications: {
      type: Map,
      of: String                // Flexible key-value pairs for component-specific specs
    },
    description: String
  },

  // Replacement schedule
  replacement: {
    intervalDays: {
      type: Number,
      required: true,
      // Common intervals: 30, 90, 180, 365 days
    },
    lastReplaced: Date,
    nextDue: Date,
    estimatedCost: Number,
    laborCost: Number,
    totalEstimate: Number,
    isProfessionalRequired: {
      type: Boolean,
      default: false
    }
  },

  // Supplier information
  supplier: {
    name: String,
    partNumber: String,         // Supplier's part number (may differ from manufacturer)
    url: String,                 // Direct link to purchase
    phone: String,
    lastPrice: Number,
    lastOrderDate: Date,
    leadTime: Number,            // Days to receive
    notes: String
  },

  // Inventory tracking
  quantity: {
    onHand: {
      type: Number,
      default: 0
    },
    reorderPoint: {
      type: Number,
      default: 1
    },
    preferredStock: {
      type: Number,
      default: 2
    }
  },

  // Installation/location details
  location: String,              // Specific location within the system

  // Photos
  photos: [{
    url: String,
    caption: String,
    uploadedAt: Date
  }],

  // Maintenance history
  replacementHistory: [{
    date: Date,
    cost: Number,
    performer: String,           // Who replaced it: 'self', provider name
    partSource: String,          // Where part was purchased
    maintenanceLogId: {
      type: Schema.Types.ObjectId,
      ref: 'MaintenanceLog'
    },
    notes: String
  }],

  // Alerts and notifications
  alerts: {
    lowStock: {
      type: Boolean,
      default: false
    },
    replacementDue: {
      type: Boolean,
      default: false
    },
    lastAlertSent: Date
  },

  // General notes
  notes: String,

  // Component status
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
ComponentSchema.index({ homeId: 1, systemId: 1 });
ComponentSchema.index({ homeId: 1, type: 1 });
ComponentSchema.index({ systemId: 1, status: 1 });
ComponentSchema.index({ 'replacement.nextDue': 1 }); // For replacement reminders
ComponentSchema.index({ 'quantity.onHand': 1 }); // For low stock alerts

// Virtual for replacement status
ComponentSchema.virtual('replacementStatus').get(function() {
  if (!this.replacement || !this.replacement.nextDue) {
    return 'unknown';
  }

  const now = new Date();
  const dueDate = new Date(this.replacement.nextDue);
  const daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) {
    return 'overdue';
  } else if (daysUntilDue <= 7) {
    return 'due-soon';
  } else if (daysUntilDue <= 30) {
    return 'due-this-month';
  }
  return 'current';
});

// Virtual for stock status
ComponentSchema.virtual('stockStatus').get(function() {
  if (!this.quantity) {
    return 'unknown';
  }

  const { onHand, reorderPoint, preferredStock } = this.quantity;

  if (onHand === 0) {
    return 'out-of-stock';
  } else if (onHand <= reorderPoint) {
    return 'low-stock';
  } else if (onHand < preferredStock) {
    return 'below-preferred';
  }
  return 'in-stock';
});

// Method to calculate next replacement due date
ComponentSchema.methods.calculateNextDue = function() {
  if (this.replacement.lastReplaced && this.replacement.intervalDays) {
    const lastReplaced = new Date(this.replacement.lastReplaced);
    const nextDue = new Date(lastReplaced);
    nextDue.setDate(nextDue.getDate() + this.replacement.intervalDays);
    return nextDue;
  } else if (this.createdAt && this.replacement.intervalDays) {
    // If never replaced, use creation date
    const created = new Date(this.createdAt);
    const nextDue = new Date(created);
    nextDue.setDate(nextDue.getDate() + this.replacement.intervalDays);
    return nextDue;
  }
  return null;
};

// Method to log a replacement
ComponentSchema.methods.logReplacement = function(replacementData) {
  const {
    cost = 0,
    performer = 'self',
    partSource = null,
    maintenanceLogId = null,
    notes = ''
  } = replacementData;

  // Add to history
  this.replacementHistory.push({
    date: new Date(),
    cost,
    performer,
    partSource,
    maintenanceLogId,
    notes
  });

  // Update replacement tracking
  this.replacement.lastReplaced = new Date();
  this.replacement.nextDue = this.calculateNextDue();

  // Update last price if provided
  if (cost > 0 && this.supplier) {
    this.supplier.lastPrice = cost;
  }

  // Decrement stock if tracking
  if (this.quantity && this.quantity.onHand > 0) {
    this.quantity.onHand -= 1;
  }

  return this.save();
};

// Method to update stock quantity
ComponentSchema.methods.updateStock = function(quantity, isAdd = true) {
  if (!this.quantity) {
    this.quantity = {
      onHand: 0,
      reorderPoint: 1,
      preferredStock: 2
    };
  }

  if (isAdd) {
    this.quantity.onHand += quantity;
    if (quantity > 0) {
      this.supplier.lastOrderDate = new Date();
    }
  } else {
    this.quantity.onHand = quantity;
  }

  // Update low stock alert
  this.alerts.lowStock = this.quantity.onHand <= this.quantity.reorderPoint;

  return this.save();
};

// Method to check if reorder is needed
ComponentSchema.methods.needsReorder = function() {
  if (!this.quantity) {
    return false;
  }
  return this.quantity.onHand <= this.quantity.reorderPoint;
};

// Pre-save middleware
ComponentSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  // Auto-calculate next due date if not set
  if (this.replacement && !this.replacement.nextDue) {
    this.replacement.nextDue = this.calculateNextDue();
  }

  // Calculate total estimate
  if (this.replacement) {
    const partCost = this.replacement.estimatedCost || 0;
    const laborCost = this.replacement.laborCost || 0;
    this.replacement.totalEstimate = partCost + laborCost;
  }

  // Update alerts
  if (this.replacement && this.replacement.nextDue) {
    const now = new Date();
    const daysUntilDue = Math.floor((this.replacement.nextDue - now) / (1000 * 60 * 60 * 24));
    this.alerts.replacementDue = daysUntilDue <= 7;
  }

  if (this.quantity) {
    this.alerts.lowStock = this.quantity.onHand <= this.quantity.reorderPoint;
  }

  next();
});

// Static method to find components by system
ComponentSchema.statics.findBySystem = function(systemId) {
  return this.find({ systemId, status: 'active' });
};

// Static method to find components due for replacement
ComponentSchema.statics.findReplacementDue = function(homeId, daysAhead = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return this.find({
    homeId,
    status: 'active',
    'replacement.nextDue': { $lte: futureDate }
  });
};

// Static method to find low stock components
ComponentSchema.statics.findLowStock = function(homeId) {
  return this.find({
    homeId,
    status: 'active',
    $expr: { $lte: ['$quantity.onHand', '$quantity.reorderPoint'] }
  });
};

// Ensure virtuals are included in JSON
ComponentSchema.set('toJSON', { virtuals: true });
ComponentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Component', ComponentSchema);
