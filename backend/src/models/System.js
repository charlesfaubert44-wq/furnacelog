/**
 * System Model
 * Represents a home system (heating, plumbing, electrical, ventilation, etc.)
 *
 * Based on PRD Section 9.1.3
 * Part of Epic E4 - System & Component Tracking
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

const SystemSchema = new Schema({
  // Reference to parent home
  homeId: {
    type: Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    index: true
  },

  // System categorization
  category: {
    type: String,
    required: true,
    enum: [
      'heating',
      'hot-water',
      'ventilation',
      'plumbing',
      'electrical',
      'fuel-storage',
      'freeze-protection',
      'other'
    ],
    index: true
  },

  type: {
    type: String,
    required: true,
    // Examples: 'furnace', 'boiler', 'hrv', 'tankless-heater', 'heat-trace', 'propane-tank'
  },

  subtype: {
    type: String,
    // Examples: fuel type for furnace (propane, oil, natural-gas), etc.
  },

  // Basic system information
  name: {
    type: String,
    required: true,
    // User-friendly name like "Main Furnace" or "Master Bathroom HRV"
  },

  // Detailed specifications
  details: {
    make: String,
    model: String,
    serialNumber: String,
    capacity: String,        // e.g., "100,000 BTU", "40 gallons"
    efficiency: String,      // e.g., "95% AFUE", "Energy Factor 0.92"
    fuelType: String,        // For heating systems: propane, oil, natural-gas, electric
    voltage: String,         // For electrical systems
    amperage: String         // For electrical systems
  },

  // Installation information
  installation: {
    date: Date,
    contractor: String,
    contactInfo: String,
    cost: Number,
    permitNumber: String
  },

  // Warranty tracking (E4-T7)
  warranty: {
    provider: String,
    startDate: Date,
    endDate: Date,
    coverageDetails: String,
    registrationNumber: String,
    documentIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Document'
    }],
    manufacturerContact: {
      phone: String,
      email: String,
      website: String
    }
  },

  // Maintenance configuration
  maintenance: {
    // Default interval in days for routine maintenance
    defaultIntervalDays: {
      type: Number,
      default: 365
    },
    lastServiceDate: Date,
    nextServiceDue: Date,
    // References to maintenance logs for this system
    serviceHistory: [{
      type: Schema.Types.ObjectId,
      ref: 'MaintenanceLog'
    }]
  },

  // Northern-specific fields
  northern: {
    // For heat trace cables
    heatTrace: {
      totalLength: Number,          // meters
      wattage: Number,               // watts per meter
      zones: [{
        name: String,
        length: Number,
        circuit: String,
        thermostatLocation: String
      }],
      lastContinuityTest: Date,
      nextTestDue: Date
    },

    // For HRV/ERV systems
    hrvInfo: {
      coreType: String,              // 'aluminum', 'plastic', 'paper'
      defrostType: String,           // 'circulation', 'exhaust-only'
      lastCoreClean: Date,
      lastBalancing: Date,
      intakeFilterSize: String,
      exhaustFilterSize: String
    },

    // For fuel storage (propane/oil tanks)
    fuelStorage: {
      capacity: Number,              // liters
      currentLevel: Number,          // percentage (0-100)
      lastFillDate: Date,
      lastFillAmount: Number,
      pricePerLiter: Number,
      reorderPoint: Number,          // percentage threshold
      supplier: {
        name: String,
        phone: String,
        accountNumber: String
      }
    }
  },

  // Physical location in home
  location: {
    type: String,
    // e.g., "Mechanical room", "Utility closet", "Crawlspace"
  },

  // Photos and documentation
  photos: [{
    url: String,
    caption: String,
    uploadedAt: Date
  }],

  // QR code for physical labeling (E4-T3)
  qrCode: {
    code: String,              // Unique identifier
    generated: Boolean,
    generatedAt: Date,
    url: String                // URL to QR code image in MinIO
  },

  // General notes
  notes: String,

  // System status
  status: {
    type: String,
    enum: ['active', 'inactive', 'replaced', 'decommissioned'],
    default: 'active'
  },

  // Template tracking (E4-T2)
  createdFromTemplate: {
    type: String,
    // Template ID if created from a system template
  },

  // Metadata
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
SystemSchema.index({ homeId: 1, category: 1 });
SystemSchema.index({ homeId: 1, status: 1 });
SystemSchema.index({ 'warranty.endDate': 1 }); // For warranty expiration alerts
SystemSchema.index({ 'maintenance.nextServiceDue': 1 }); // For maintenance reminders
SystemSchema.index({ 'qrCode.code': 1 }, { sparse: true }); // For QR code lookup

// Virtual for warranty status
SystemSchema.virtual('warrantyStatus').get(function() {
  if (!this.warranty || !this.warranty.endDate) {
    return 'none';
  }

  const now = new Date();
  const endDate = new Date(this.warranty.endDate);
  const daysUntilExpiry = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring-soon';
  } else if (daysUntilExpiry <= 90) {
    return 'expiring-warning';
  }
  return 'valid';
});

// Virtual for maintenance status
SystemSchema.virtual('maintenanceStatus').get(function() {
  if (!this.maintenance || !this.maintenance.nextServiceDue) {
    return 'unknown';
  }

  const now = new Date();
  const dueDate = new Date(this.maintenance.nextServiceDue);
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

// Method to calculate next service due date
SystemSchema.methods.calculateNextServiceDue = function() {
  if (this.maintenance.lastServiceDate && this.maintenance.defaultIntervalDays) {
    const lastService = new Date(this.maintenance.lastServiceDate);
    const nextDue = new Date(lastService);
    nextDue.setDate(nextDue.getDate() + this.maintenance.defaultIntervalDays);
    return nextDue;
  }
  return null;
};

// Method to update fuel level (for propane/oil tanks)
SystemSchema.methods.updateFuelLevel = function(level, fillAmount = null, pricePerLiter = null) {
  if (!this.northern.fuelStorage) {
    this.northern.fuelStorage = {};
  }

  this.northern.fuelStorage.currentLevel = level;
  if (fillAmount) {
    this.northern.fuelStorage.lastFillDate = new Date();
    this.northern.fuelStorage.lastFillAmount = fillAmount;
  }
  if (pricePerLiter) {
    this.northern.fuelStorage.pricePerLiter = pricePerLiter;
  }

  return this.save();
};

// Method to check if fuel reorder is needed
SystemSchema.methods.needsFuelReorder = function() {
  if (!this.northern.fuelStorage || !this.northern.fuelStorage.reorderPoint) {
    return false;
  }

  return this.northern.fuelStorage.currentLevel <= this.northern.fuelStorage.reorderPoint;
};

// Pre-save middleware to update timestamps
SystemSchema.pre('save', function(next) {
  this.updatedAt = new Date();

  // Auto-calculate next service due if not set
  if (this.maintenance.lastServiceDate && !this.maintenance.nextServiceDue) {
    this.maintenance.nextServiceDue = this.calculateNextServiceDue();
  }

  next();
});

// Static method to get systems by category
SystemSchema.statics.findByCategory = function(homeId, category) {
  return this.find({ homeId, category, status: 'active' });
};

// Static method to get systems needing maintenance
SystemSchema.statics.findMaintenanceDue = function(homeId, daysAhead = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return this.find({
    homeId,
    status: 'active',
    'maintenance.nextServiceDue': { $lte: futureDate }
  });
};

// Static method to get expiring warranties
SystemSchema.statics.findExpiringWarranties = function(homeId, daysAhead = 90) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return this.find({
    homeId,
    status: 'active',
    'warranty.endDate': {
      $gte: new Date(),
      $lte: futureDate
    }
  });
};

// Ensure virtuals are included in JSON
SystemSchema.set('toJSON', { virtuals: true });
SystemSchema.set('toObject', { virtuals: true });

export default mongoose.model('System', SystemSchema);
