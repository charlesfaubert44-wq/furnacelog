/**
 * Contact Controller
 * Handles contact form submissions
 */

import logger from '../utils/logger.js';
import { sendSuccess, handleError } from '../utils/responses.js';
import { body, validationResult } from 'express-validator';

/**
 * Submit contact form
 * POST /api/v1/contact
 * Public route - no authentication required
 */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Log the contact form submission
    logger.info('Contact form submission received', {
      name,
      email,
      subject,
      messageLength: message?.length,
      timestamp: new Date().toISOString(),
    });

    // In a production environment, you would:
    // 1. Send an email to hello@furnacelog.com, support@furnacelog.com, or community@furnacelog.com
    // 2. Store the submission in a database for tracking
    // 3. Send an auto-reply confirmation email to the user
    // 4. Integrate with a service like SendGrid, Mailgun, or AWS SES

    // For now, we'll just log it and return success
    // You can integrate email service later

    // Example: Store in database (optional)
    // const contactSubmission = await ContactSubmission.create({
    //   name,
    //   email,
    //   subject,
    //   message,
    //   submittedAt: new Date(),
    // });

    // TODO: Send email notification
    // await sendContactEmail({
    //   to: getEmailForSubject(subject),
    //   from: 'noreply@furnacelog.com',
    //   replyTo: email,
    //   subject: `Contact Form: ${subject}`,
    //   html: generateEmailTemplate({ name, email, subject, message })
    // });

    return sendSuccess(res, 200, {
      message: 'Contact form submitted successfully',
    }, {
      message: 'Thank you for reaching out! We\'ll get back to you soon.',
    });
  } catch (error) {
    logger.error('Error submitting contact form', {
      error: error.message,
      stack: error.stack,
    });
    return handleError(res, error, 'Failed to submit contact form');
  }
};

/**
 * Validation middleware for contact form
 */
export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isIn(['general', 'support', 'feature', 'partnership', 'story'])
    .withMessage('Invalid subject'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
];

/**
 * Helper function to determine which email address to use based on subject
 */
function getEmailForSubject(subject) {
  const emailMap = {
    general: 'hello@furnacelog.com',
    support: 'support@furnacelog.com',
    feature: 'hello@furnacelog.com',
    partnership: 'hello@furnacelog.com',
    story: 'community@furnacelog.com',
  };
  return emailMap[subject] || 'hello@furnacelog.com';
}
