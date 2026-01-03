/**
 * System Template Routes
 * API endpoints for system template selection and usage
 *
 * Part of Epic E4 - System & Component Tracking (E4-T2)
 */

import express from 'express';
const router = express.Router();
import * as templateController from '../controllers/templateController.js';
import { authenticate } from '../middleware/auth.middleware.js';

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/templates/systems
 * @desc    Get all available system templates
 * @access  Private
 */
router.get(
  '/systems',
  templateController.getAllTemplatesController
);

/**
 * @route   GET /api/v1/templates/systems/category/:category
 * @desc    Get system templates by category
 * @access  Private
 */
router.get(
  '/systems/category/:category',
  templateController.getTemplatesByCategoryController
);

/**
 * @route   GET /api/v1/templates/systems/:templateId
 * @desc    Get a specific system template by ID
 * @access  Private
 */
router.get(
  '/systems/:templateId',
  templateController.getTemplateByIdController
);

/**
 * @route   POST /api/v1/templates/systems/:templateId/create
 * @desc    Create a system from a template
 * @access  Private
 * @body    { homeId, customData: {} }
 */
router.post(
  '/systems/:templateId/create',
  templateController.createSystemFromTemplate
);

export default router;
