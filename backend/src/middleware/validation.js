/**
 * Validation Middleware
 * Input validation for API requests using express-validator
 */

import { validationResult } from 'express-validator';
import { sendValidationError } from '../utils/responses.js';

/**
 * Middleware to handle validation results
 * Must be placed after validation chain in route
 *
 * @example
 * router.post('/homes',
 *   authenticate,
 *   [...homeValidation.create],
 *   validate,
 *   homeController.createHome
 * );
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Extract error messages
    const messages = errors.array().map(err => {
      // Format: "Field: Message" or just "Message"
      return err.path ? `${err.path}: ${err.msg}` : err.msg;
    });

    return sendValidationError(res, messages);
  }

  next();
};

/**
 * Legacy validation for backward compatibility
 * @deprecated Use express-validator chains with validate middleware
 */
export const validateSystemInput = (req, res, next) => {
  if (req.method === 'POST' && !req.body.category) {
    return sendValidationError(res, ['Category is required']);
  }

  if (req.method === 'POST' && !req.body.name) {
    return sendValidationError(res, ['Name is required']);
  }

  next();
};

/**
 * Legacy validation for backward compatibility
 * @deprecated Use express-validator chains with validate middleware
 */
export const validateComponentInput = (req, res, next) => {
  if (req.method === 'POST' && !req.body.name) {
    return sendValidationError(res, ['Component name is required']);
  }

  if (req.method === 'POST' && !req.body.type) {
    return sendValidationError(res, ['Component type is required']);
  }

  next();
};

export default {
  validate,
  validateSystemInput,
  validateComponentInput
};
