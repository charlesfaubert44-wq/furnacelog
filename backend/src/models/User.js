import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * Per PRD section 9.1.1
 * Epic E2-T1: User Registration API
 */

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    index: true
  },
  passwordHash: {
    type: String,
    required: false, // Not required for OAuth users
    select: false // Don't return password hash by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values to be non-unique
    select: false
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values to be non-unique
    select: false
  },
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    community: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      default: 'America/Edmonton' // Default to MST for NWT/Nunavut
    },
    preferredUnits: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: false
      },
      digestFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'none'],
        default: 'weekly'
      }
    },
    defaultHome: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home',
      default: null
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

/**
 * Hash password before saving
 * E2-T1: Implement password hashing with bcrypt
 */
userSchema.pre('save', async function() {
  // Only hash if password is modified and exists (OAuth users don't have passwords)
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

/**
 * Compare password for login
 * E2-T2: Verify credentials against database
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Get safe user object (without sensitive data)
 * @returns {object} User object without password
 */
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.__v;
  return userObject;
};

/**
 * Update last login timestamp
 */
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

/**
 * Generate password reset token
 * E2-T7: Password Reset Flow
 */
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 3600000; // 1 hour

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
