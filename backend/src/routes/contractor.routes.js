/**
 * Contractor Routes
 * Routes for contractor/service provider operations
 */

import express from 'express';
import {
  getContractors,
  getContractorById,
  createContractor,
  updateContractor
} from '../controllers/contractor.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorization.js';

const router = express.Router();

/**
 * @route   GET /api/v1/contractors
 * @desc    Get all contractors with filters
 * @access  Private
 */
router.get('/', authenticate, getContractors);

/**
 * @route   GET /api/v1/contractors/:id
 * @desc    Get contractor by ID with user stats
 * @access  Private
 */
router.get('/:id', authenticate, getContractorById);

/**
 * @route   POST /api/v1/contractors
 * @desc    Create new contractor
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, createContractor);

/**
 * @route   PUT /api/v1/contractors/:id
 * @desc    Update contractor
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, updateContractor);

export default router;
