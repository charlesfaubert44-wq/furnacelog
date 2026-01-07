/**
 * ServiceProvider Model
 * Tracks professional service providers (contractors, technicians, etc.)
 */

import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  // Business Information
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  contactName: {
    type: String,
    trim: true,
  },

  // Contact Information
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },

  // Services
  specialties: [{
    type: String,
    enum: ['hvac', 'plumbing', 'electrical', 'general', 'roofing', 'insulation', 'appliances'],
    required: true,
  }],

  // Service Area
  serviceArea: {
    communities: [String], // Array of community names they serve
    territory: {
      type: String,
      enum: ['Northwest Territories', 'Nunavut', 'Yukon', 'All Territories'],
    },
    radius: Number, // Service radius in km
  },

  // Availability
  availability: {
    emergency24h: {
      type: Boolean,
      default: false,
    },
    responseTime: {
      type: String,
      enum: ['same-day', '1-3 days', '1 week+'],
    },
    bookingURL: String,
  },

  // Pricing
  pricing: {
    hourlyRate: Number,
    calloutFee: Number,
    typical: {
      min: Number,
      max: Number,
    },
  },

  // Ratings (aggregated from user logs)
  ratings: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
    breakdown: {
      quality: { type: Number, default: 0 },
      timeliness: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
    },
  },

  // Verification
  verification: {
    licensed: {
      type: Boolean,
      default: false,
    },
    insured: {
      type: Boolean,
      default: false,
    },
    bondable: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false, // Admin verified
    },
    verifiedDate: Date,
  },

  // Metadata
  joined: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Indexes
serviceProviderSchema.index({ businessName: 1 });
serviceProviderSchema.index({ specialties: 1 });
serviceProviderSchema.index({ 'serviceArea.territory': 1 });
serviceProviderSchema.index({ 'serviceArea.communities': 1 });
serviceProviderSchema.index({ 'ratings.overall': -1 });
serviceProviderSchema.index({ status: 1 });

// Virtual for display name
serviceProviderSchema.virtual('displayName').get(function() {
  return this.businessName || this.contactName || 'Unknown Provider';
});

// Method to update rating
serviceProviderSchema.methods.updateRating = async function(newRating) {
  const currentTotal = this.ratings.overall * this.ratings.count;
  this.ratings.count += 1;
  this.ratings.overall = (currentTotal + newRating) / this.ratings.count;

  // Update breakdown if provided
  if (newRating.quality) {
    const qualityTotal = this.ratings.breakdown.quality * (this.ratings.count - 1);
    this.ratings.breakdown.quality = (qualityTotal + newRating.quality) / this.ratings.count;
  }

  await this.save();
};

// Static method to find by specialty
serviceProviderSchema.statics.findBySpecialty = function(specialty, territory) {
  const query = {
    specialties: specialty,
    status: 'active',
  };

  if (territory) {
    query.$or = [
      { 'serviceArea.territory': territory },
      { 'serviceArea.territory': 'All Territories' },
    ];
  }

  return this.find(query).sort({ 'ratings.overall': -1 });
};

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
