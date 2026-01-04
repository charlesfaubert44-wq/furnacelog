/**
 * Onboarding Routes
 * Routes for onboarding wizard completion
 */

import express from 'express';
import { completeOnboarding } from '../controllers/onboarding.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All onboarding routes require authentication
router.use(protect);

/**
 * POST /api/v1/onboarding/complete
 * Complete onboarding wizard and setup home
 */
router.post('/complete', completeOnboarding);

export default router;
