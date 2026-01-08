/**
 * Contact Routes
 * Routes for contact form submissions
 */

import express from 'express';
import { submitContactForm, validateContactForm } from '../controllers/contact.controller.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/v1/contact
 * Submit contact form
 * Public route - no authentication required
 */
router.post('/', validateContactForm, validate, submitContactForm);

export default router;
