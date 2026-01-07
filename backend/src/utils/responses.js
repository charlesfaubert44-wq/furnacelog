/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints
 */

/**
 * Error codes enum
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

/**
 * Send standardized success response
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {any} data - Response data
 * @param {object} meta - Optional metadata (count, pagination, etc.)
 */
export function sendSuccess(res, statusCode = 200, data, meta = {}) {
  const response = {
    success: true,
    data
  };

  // Add optional metadata
  if (meta.count !== undefined) {
    response.count = meta.count;
  }

  if (meta.pagination) {
    response.pagination = meta.pagination;
  }

  if (meta.message) {
    response.message = meta.message;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send standardized error response
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code from ErrorCodes enum
 * @param {string} message - Human-readable error message
 * @param {array|object} details - Additional error details
 */
export function sendError(res, statusCode, code, message, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };

  // Add details only if provided and in development mode
  if (details) {
    if (Array.isArray(details)) {
      response.error.details = details;
    } else if (process.env.NODE_ENV === 'development') {
      // In development, include full error details
      response.error.details = [details.toString()];
      if (details.stack) {
        response.error.stack = details.stack;
      }
    }
  }

  return res.status(statusCode).json(response);
}

/**
 * Send validation error response
 *
 * @param {object} res - Express response object
 * @param {array} errors - Array of validation errors
 */
export function sendValidationError(res, errors) {
  return sendError(
    res,
    400,
    ErrorCodes.VALIDATION_ERROR,
    'Invalid input data',
    errors
  );
}

/**
 * Send not found error response
 *
 * @param {object} res - Express response object
 * @param {string} resource - Resource name (e.g., 'Home', 'System')
 */
export function sendNotFound(res, resource = 'Resource') {
  return sendError(
    res,
    404,
    ErrorCodes.NOT_FOUND,
    `${resource} not found`
  );
}

/**
 * Send unauthorized error response
 *
 * @param {object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
export function sendUnauthorized(res, message = 'Authentication required') {
  return sendError(
    res,
    401,
    ErrorCodes.UNAUTHORIZED,
    message
  );
}

/**
 * Send forbidden error response
 *
 * @param {object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
export function sendForbidden(res, message = 'Access denied') {
  return sendError(
    res,
    403,
    ErrorCodes.FORBIDDEN,
    message
  );
}

/**
 * Send conflict error response
 *
 * @param {object} res - Express response object
 * @param {string} message - Conflict description
 */
export function sendConflict(res, message) {
  return sendError(
    res,
    409,
    ErrorCodes.CONFLICT,
    message
  );
}

/**
 * Send internal server error response
 *
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} message - Custom message (optional)
 */
export function sendInternalError(res, error, message = 'Internal server error') {
  return sendError(
    res,
    500,
    ErrorCodes.INTERNAL_ERROR,
    message,
    error
  );
}

/**
 * Handle Mongoose validation errors
 *
 * @param {object} res - Express response object
 * @param {Error} error - Mongoose validation error
 */
export function handleMongooseValidationError(res, error) {
  const messages = Object.values(error.errors).map(err => err.message);
  return sendValidationError(res, messages);
}

/**
 * Handle Mongoose duplicate key errors
 *
 * @param {object} res - Express response object
 * @param {Error} error - Mongoose duplicate key error
 */
export function handleDuplicateKeyError(res, error) {
  const field = Object.keys(error.keyPattern)[0];
  return sendConflict(res, `A record with this ${field} already exists`);
}

/**
 * Generic error handler for try-catch blocks
 * Automatically determines error type and sends appropriate response
 *
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 */
export function handleError(res, error, defaultMessage = 'Operation failed') {
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return handleMongooseValidationError(res, error);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return handleDuplicateKeyError(res, error);
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return sendError(
      res,
      400,
      ErrorCodes.BAD_REQUEST,
      'Invalid ID format'
    );
  }

  // Default to internal server error
  return sendInternalError(res, error, defaultMessage);
}

export default {
  ErrorCodes,
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendConflict,
  sendInternalError,
  handleMongooseValidationError,
  handleDuplicateKeyError,
  handleError
};
