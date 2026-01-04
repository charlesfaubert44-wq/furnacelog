/**
 * Timeline Routes
 *
 * API endpoints for Climate Time Machine feature
 */

import express from 'express';
import timelineController from '../controllers/timelineController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/timeline/:homeId
 * @desc    Get timeline data for a home (maintenance + weather)
 * @access  Private
 * @query   startDate, endDate, granularity (day|week|month)
 */
router.get('/:homeId', timelineController.getTimelineData);

/**
 * @route   GET /api/v1/timeline/:homeId/correlations
 * @desc    Get weather-maintenance correlations
 * @access  Private
 */
router.get('/:homeId/correlations', timelineController.getWeatherCorrelations);

/**
 * @route   GET /api/v1/timeline/:homeId/patterns
 * @desc    Get detected patterns and insights
 * @access  Private
 */
router.get('/:homeId/patterns', timelineController.getPatternInsights);

/**
 * @route   GET /api/v1/timeline/:homeId/costs
 * @desc    Get cost analysis over time
 * @access  Private
 * @query   groupBy (day|week|month|year)
 */
router.get('/:homeId/costs', timelineController.getCostAnalysis);

export default router;
