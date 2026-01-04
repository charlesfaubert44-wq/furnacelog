/**
 * Dashboard Routes
 * Routes for dashboard data aggregation
 */

import express from 'express';
import { getDashboardData, getMaintenanceTasks } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

/**
 * GET /api/v1/dashboard
 * Get complete dashboard data (all widgets)
 */
router.get('/', getDashboardData);

/**
 * GET /api/v1/dashboard/tasks
 * Get maintenance tasks with filtering
 */
router.get('/tasks', getMaintenanceTasks);

export default router;
