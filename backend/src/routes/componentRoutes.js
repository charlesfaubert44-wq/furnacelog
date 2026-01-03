/**
 * Component Routes
 * API endpoints for component management
 *
 * Part of Epic E4 - System & Component Tracking
 */

import express from 'express';
const router = express.Router();
import * as componentController from '../controllers/componentController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateComponentInput } from '../middleware/validation.js';

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/homes/:homeId/systems/:systemId/components
 * @desc    Create a new component for a system
 * @access  Private
 */
router.post(
  '/:homeId/systems/:systemId/components',
  validateComponentInput,
  componentController.createComponent
);

/**
 * @route   GET /api/v1/homes/:homeId/systems/:systemId/components
 * @desc    Get all components for a system
 * @access  Private
 */
router.get(
  '/:homeId/systems/:systemId/components',
  componentController.getComponentsBySystem
);

/**
 * @route   GET /api/v1/homes/:homeId/components
 * @desc    Get all components for a home (across all systems)
 * @access  Private
 * @query   type - Filter by component type
 * @query   status - Filter by status
 */
router.get(
  '/:homeId/components',
  componentController.getComponentsByHome
);

/**
 * @route   GET /api/v1/homes/:homeId/components/:componentId
 * @desc    Get a specific component by ID
 * @access  Private
 */
router.get(
  '/:homeId/components/:componentId',
  componentController.getComponentById
);

/**
 * @route   PATCH /api/v1/homes/:homeId/components/:componentId
 * @desc    Update a component
 * @access  Private
 */
router.patch(
  '/:homeId/components/:componentId',
  validateComponentInput,
  componentController.updateComponent
);

/**
 * @route   DELETE /api/v1/homes/:homeId/components/:componentId
 * @desc    Delete a component
 * @access  Private
 */
router.delete(
  '/:homeId/components/:componentId',
  componentController.deleteComponent
);

/**
 * @route   POST /api/v1/homes/:homeId/components/:componentId/replace
 * @desc    Log a component replacement
 * @access  Private
 */
router.post(
  '/:homeId/components/:componentId/replace',
  componentController.logReplacement
);

/**
 * @route   PATCH /api/v1/homes/:homeId/components/:componentId/stock
 * @desc    Update component stock quantity
 * @access  Private
 */
router.patch(
  '/:homeId/components/:componentId/stock',
  componentController.updateStock
);

/**
 * @route   GET /api/v1/homes/:homeId/components/due/replacement
 * @desc    Get components due for replacement
 * @access  Private
 * @query   daysAhead - Number of days to look ahead (default: 7)
 */
router.get(
  '/:homeId/components/due/replacement',
  componentController.getReplacementDue
);

/**
 * @route   GET /api/v1/homes/:homeId/components/stock/low
 * @desc    Get components with low stock
 * @access  Private
 */
router.get(
  '/:homeId/components/stock/low',
  componentController.getLowStock
);

export default router;
