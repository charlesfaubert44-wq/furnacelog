import express from 'express';
import {
  getMe,
  updateMe,
  changePassword,
  deleteAccount
} from '../controllers/user.controller.js';
import {
  authenticate
} from '../middleware/auth.middleware.js';
import {
  validate,
  updateProfileSchema,
  changePasswordSchema
} from '../validators/auth.validators.js';

const router = express.Router();

/**
 * User Profile Routes
 * Epic E2-T4: User Profile Management API
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', getMe);

/**
 * @route   PATCH /api/v1/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch('/me', validate(updateProfileSchema), updateMe);

/**
 * @route   POST /api/v1/users/me/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/me/change-password', validate(changePasswordSchema), changePassword);

/**
 * @route   DELETE /api/v1/users/me
 * @desc    Delete/deactivate user account
 * @access  Private
 */
router.delete('/me', deleteAccount);

export default router;
