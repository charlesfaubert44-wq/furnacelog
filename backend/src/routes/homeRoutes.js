import express from 'express';
import {
  createHome,
  getHomes,
  getHome,
  updateHome,
  deleteHome,
  restoreHome,
  uploadCoverPhoto,
  getHomeStats
} from '../controllers/homeController.js';
import { validateHomeOwnership, validateHomeOwnershipWithArchived } from '../middleware/ownership.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes protected with authentication middleware

// @route   GET /api/v1/homes/stats
// @desc    Get home statistics for authenticated user
// @access  Private
router.get('/stats', authenticate, getHomeStats);

// @route   POST /api/v1/homes
// @desc    Create a new home
// @access  Private
router.post('/', authenticate, createHome);

// @route   GET /api/v1/homes
// @desc    Get all homes for authenticated user
// @access  Private
router.get('/', authenticate, getHomes);

// @route   GET /api/v1/homes/:homeId
// @desc    Get single home
// @access  Private
router.get('/:homeId', authenticate, validateHomeOwnership, getHome);

// @route   PATCH /api/v1/homes/:homeId
// @desc    Update home
// @access  Private
router.patch('/:homeId', authenticate, validateHomeOwnership, updateHome);

// @route   DELETE /api/v1/homes/:homeId
// @desc    Delete home (soft delete by default)
// @access  Private
router.delete('/:homeId', authenticate, validateHomeOwnership, deleteHome);

// @route   PATCH /api/v1/homes/:homeId/restore
// @desc    Restore archived home
// @access  Private
router.patch('/:homeId/restore', authenticate, validateHomeOwnershipWithArchived, restoreHome);

// @route   POST /api/v1/homes/:homeId/photo
// @desc    Upload home cover photo
// @access  Private
router.post('/:homeId/photo', authenticate, validateHomeOwnership, uploadCoverPhoto);

export default router;
