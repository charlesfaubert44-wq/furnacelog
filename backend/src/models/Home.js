import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Home name is required'],
    trim: true,
    maxlength: [100, 'Home name cannot exceed 100 characters']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    community: {
      type: String,
      required: [true, 'Community is required'],
      trim: true
    },
    territory: {
      type: String,
      enum: ['NWT', 'Nunavut', 'Yukon', 'Other'],
      required: [true, 'Territory is required']
    },
    postalCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function(coords) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 &&
                   coords[1] >= -90 && coords[1] <= 90;
          },
          message: 'Invalid coordinates. Format: [longitude, latitude]'
        }
      }
    }
  },
  details: {
    homeType: {
      type: String,
      enum: ['modular', 'stick-built', 'log', 'mobile', 'other'],
      required: [true, 'Home type is required']
    },
    yearBuilt: {
      type: Number,
      min: [1800, 'Year built must be after 1800'],
      max: [new Date().getFullYear() + 1, 'Year built cannot be in the future']
    },
    squareFootage: {
      type: Number,
      min: [0, 'Square footage must be positive']
    },
    bedrooms: {
      type: Number,
      min: [0, 'Number of bedrooms must be positive'],
      max: [20, 'Number of bedrooms seems unrealistic']
    },
    bathrooms: {
      type: Number,
      min: [0, 'Number of bathrooms must be positive'],
      max: [10, 'Number of bathrooms seems unrealistic']
    },
    foundationType: {
      type: String,
      enum: ['piles', 'crawlspace', 'basement', 'slab']
    },
    stories: {
      type: Number,
      min: [1, 'Must have at least one story'],
      max: [5, 'Stories count seems unrealistic'],
      default: 1
    }
  },
  utilities: {
    waterSource: {
      type: String,
      enum: ['municipal', 'well', 'trucked']
    },
    sewageSystem: {
      type: String,
      enum: ['municipal', 'septic', 'holding-tank']
    },
    electricalService: {
      type: String,
      enum: ['grid', 'generator', 'hybrid']
    },
    primaryHeatFuel: {
      type: String,
      enum: ['propane', 'oil', 'electric', 'wood', 'natural-gas']
    },
    secondaryHeatFuel: {
      type: String,
      trim: true
    }
  },
  modularInfo: {
    manufacturer: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    serialNumber: {
      type: String,
      trim: true
    },
    csaCertification: {
      type: String,
      trim: true
    },
    sections: {
      type: Number,
      min: [1, 'Must have at least one section']
    },
    transportDate: {
      type: Date
    },
    setupContractor: {
      type: String,
      trim: true
    }
  },
  coverPhoto: {
    type: String, // URL to MinIO storage
    trim: true
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create geospatial index for location-based queries
homeSchema.index({ 'address.coordinates': '2dsphere' });

// Compound index for user's homes query
homeSchema.index({ userId: 1, archived: 1 });

// Virtual for full address display
homeSchema.virtual('fullAddress').get(function() {
  const parts = [];
  if (this.address.street) parts.push(this.address.street);
  if (this.address.community) parts.push(this.address.community);
  if (this.address.territory) parts.push(this.address.territory);
  if (this.address.postalCode) parts.push(this.address.postalCode);
  return parts.join(', ');
});

// Virtual to check if modular home
homeSchema.virtual('isModular').get(function() {
  return this.details.homeType === 'modular';
});

// Pre-save middleware to conditionally validate modular info
homeSchema.pre('save', function(next) {
  if (this.details.homeType !== 'modular') {
    // Clear modular info if home type is not modular
    this.modularInfo = undefined;
  }
  next();
});

// Instance method to archive home
homeSchema.methods.archive = function() {
  this.archived = true;
  return this.save();
};

// Instance method to unarchive home
homeSchema.methods.unarchive = function() {
  this.archived = false;
  return this.save();
};

// Static method to find user's active homes
homeSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, archived: false }).sort({ createdAt: -1 });
};

// Static method to find homes in a specific community
homeSchema.statics.findByCommunity = function(community, includeArchived = false) {
  const query = { 'address.community': community };
  if (!includeArchived) {
    query.archived = false;
  }
  return this.find(query);
};

const Home = mongoose.model('Home', homeSchema);

export default Home;
