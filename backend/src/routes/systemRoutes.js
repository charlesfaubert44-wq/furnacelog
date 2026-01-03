/**
 * System Routes
 * API endpoints for system management
 *
 * Part of Epic E4 - System & Component Tracking
 */

import express from 'express';
const router = express.Router();
import * as systemController from '../controllers/systemController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateSystemInput } from '../middleware/validation.js';

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/homes/:homeId/systems
 * @desc    Create a new system for a home
 * @access  Private
 */
router.post(
  '/:homeId/systems',
  validateSystemInput,
  systemController.createSystem
);

/**
 * @route   GET /api/v1/homes/:homeId/systems
 * @desc    Get all systems for a home
 * @access  Private
 * @query   category - Filter by category (heating, plumbing, etc.)
 * @query   status - Filter by status (active, inactive, replaced)
 */
router.get(
  '/:homeId/systems',
  systemController.getSystemsByHome
);

/**
 * @route   GET /api/v1/homes/:homeId/systems/:systemId
 * @desc    Get a specific system by ID
 * @access  Private
 */
router.get(
  '/:homeId/systems/:systemId',
  systemController.getSystemById
);

/**
 * @route   PATCH /api/v1/homes/:homeId/systems/:systemId
 * @desc    Update a system
 * @access  Private
 */
router.patch(
  '/:homeId/systems/:systemId',
  validateSystemInput,
  systemController.updateSystem
);

/**
 * @route   DELETE /api/v1/homes/:homeId/systems/:systemId
 * @desc    Delete a system
 * @access  Private
 */
router.delete(
  '/:homeId/systems/:systemId',
  systemController.deleteSystem
);

/**
 * @route   GET /api/v1/homes/:homeId/systems/maintenance/due
 * @desc    Get systems with maintenance due
 * @access  Private
 * @query   daysAhead - Number of days to look ahead (default: 7)
 */
router.get(
  '/:homeId/systems/maintenance/due',
  systemController.getMaintenanceDue
);

/**
 * @route   GET /api/v1/homes/:homeId/systems/warranty/expiring
 * @desc    Get systems with expiring warranties
 * @access  Private
 * @query   daysAhead - Number of days to look ahead (default: 90)
 */
router.get(
  '/:homeId/systems/warranty/expiring',
  systemController.getExpiringWarranties
);

/**
 * @route   PATCH /api/v1/homes/:homeId/systems/:systemId/fuel-level
 * @desc    Update fuel level for propane/oil tanks
 * @access  Private
 */
router.patch(
  '/:homeId/systems/:systemId/fuel-level',
  systemController.updateFuelLevel
);

/**
 * @route   POST /api/v1/homes/:homeId/systems/:systemId/qr-code
 * @desc    Generate QR code for system
 * @access  Private
 */
router.post(
  '/:homeId/systems/:systemId/qr-code',
  systemController.generateQRCode
);

/**
 * @route   POST /api/v1/homes/:homeId/systems/:systemId/photos
 * @desc    Upload photos for system
 * @access  Private
 */
router.post(
  '/:homeId/systems/:systemId/photos',
  systemController.uploadPhotos
);

export default router;
