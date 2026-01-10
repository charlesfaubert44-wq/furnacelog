/**
 * Centralized Error Handler Middleware
 * SECURITY: Never exposes stack traces or internal details to clients
 * Epic: Security Hardening
 */

import logger from '../utils/logger.js';

/**
 * Error response types for consistent error handling
 */
const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * Safe error messages that can be shown to users
 * SECURITY: Generic messages that don't leak implementation details
 */
const SafeErrorMessages = {
  [ErrorTypes.VALIDATION_ERROR]: 'The request contains invalid data',
  [ErrorTypes.AUTHENTICATION_ERROR]: 'Authentication failed',
  [ErrorTypes.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action',
  [ErrorTypes.NOT_FOUND]: 'The requested resource was not found',
  [ErrorTypes.RATE_LIMIT]: 'Too many requests. Please try again later',
  [ErrorTypes.SERVER_ERROR]: 'An unexpected error occurred',
  [ErrorTypes.DATABASE_ERROR]: 'A database error occurred'
};

/**
 * Determine error type from error object
 */
function getErrorType(err) {
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return ErrorTypes.VALIDATION_ERROR;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return ErrorTypes.AUTHENTICATION_ERROR;
  }

  // MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return ErrorTypes.DATABASE_ERROR;
  }

  // Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return ErrorTypes.VALIDATION_ERROR;
  }

  // Rate limit errors
  if (err.statusCode === 429) {
    return ErrorTypes.RATE_LIMIT;
  }

  // Not found errors
  if (err.statusCode === 404) {
    return ErrorTypes.NOT_FOUND;
  }

  // Authorization errors
  if (err.statusCode === 403) {
    return ErrorTypes.AUTHORIZATION_ERROR;
  }

  // Authentication errors
  if (err.statusCode === 401) {
    return ErrorTypes.AUTHENTICATION_ERROR;
  }

  // Default to server error
  return ErrorTypes.SERVER_ERROR;
}

/**
 * Sanitize error for client response
 * SECURITY: Removes all sensitive information
 */
function sanitizeError(err) {
  const errorType = getErrorType(err);
  const statusCode = err.statusCode || 500;

  // Use safe generic message
  let message = SafeErrorMessages[errorType];

  // For validation errors, we can show field-level errors (still safe)
  let details = null;
  if (errorType === ErrorTypes.VALIDATION_ERROR && err.errors) {
    // Mongoose validation errors
    if (err.errors && typeof err.errors === 'object') {
      details = Object.keys(err.errors).map(field => ({
        field,
        message: err.errors[field].message
      }));
    }
  }

  return {
    success: false,
    error: {
      type: errorType,
      message,
      ...(details && { details })
    }
  };
}

/**
 * Global error handler middleware
 * SECURITY: NEVER exposes stack traces or internal details to clients
 */
export const errorHandler = (err, req, res, next) => {
  // Log full error details internally for debugging
  // SECURITY: Logs are internal only, never sent to client
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    userId: req.userId,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // SECURITY: Send only sanitized error to client
  const sanitizedError = sanitizeError(err);

  res.status(statusCode).json(sanitizedError);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      type: ErrorTypes.NOT_FOUND,
      message: SafeErrorMessages[ErrorTypes.NOT_FOUND],
      path: req.originalUrl
    }
  });
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errorType = ErrorTypes.SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = true; // Distinguish from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export default {
  errorHandler,
  notFoundHandler,
  AppError,
  ErrorTypes
};
