import User from '../models/User.js';
import { getRedisClient } from '../config/redis.js';

/**
 * User Controller
 * Epic E2-T4: User Profile Management API
 */

/**
 * Get current user profile
 * GET /api/v1/users/me
 */
export const getMe = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.userId).populate('preferences.defaultHome', 'name address');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
};

/**
 * Update current user profile
 * PATCH /api/v1/users/me
 */
export const updateMe = async (req, res) => {
  try {
    const { profile, preferences } = req.validatedData;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    if (profile) {
      Object.keys(profile).forEach(key => {
        if (profile[key] !== undefined) {
          user.profile[key] = profile[key];
        }
      });
    }

    // Update preferences
    if (preferences) {
      if (preferences.notifications) {
        Object.keys(preferences.notifications).forEach(key => {
          if (preferences.notifications[key] !== undefined) {
            user.preferences.notifications[key] = preferences.notifications[key];
          }
        });
      }

      if (preferences.defaultHome !== undefined) {
        user.preferences.defaultHome = preferences.defaultHome;
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * Change password
 * E2-T4: Implement password change functionality
 * POST /api/v1/users/me/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.validatedData;

    // Get user with password field
    const user = await User.findById(req.userId).select('+passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save hook
    await user.save();

    // Invalidate all sessions except current
    const redis = getRedisClient();
    if (redis) {
      try {
        // Get all user sessions
        const pattern = `session:${user._id}:*`;
        const keys = await redis.keys(pattern);

        // Delete all sessions except current
        const currentSessionKey = `session:${user._id}:${req.sessionId}`;
        const keysToDelete = keys.filter(key => key !== currentSessionKey);

        if (keysToDelete.length > 0) {
          await redis.del(...keysToDelete);
        }
      } catch (redisError) {
        console.warn('Failed to invalidate sessions:', redisError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Other sessions have been logged out.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

/**
 * Delete account
 * E2-T4: Create account deletion endpoint
 * DELETE /api/v1/users/me
 */
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Get user with password field
    const user = await User.findById(req.userId).select('+passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Soft delete: deactivate account instead of hard delete
    user.isActive = false;
    await user.save();

    // Delete all sessions
    const redis = getRedisClient();
    if (redis) {
      try {
        const pattern = `session:${user._id}:*`;
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } catch (redisError) {
        console.warn('Failed to delete sessions:', redisError.message);
      }
    }

    // Note: In production, you might want to:
    // 1. Delete or anonymize user data after a grace period
    // 2. Delete related homes, systems, maintenance logs
    // 3. Send confirmation email
    // 4. Schedule permanent deletion after X days

    return res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

export default {
  getMe,
  updateMe,
  changePassword,
  deleteAccount
};
