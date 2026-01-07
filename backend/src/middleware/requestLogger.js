/**
 * Request Logging Middleware
 * Logs all HTTP requests with timing and response info
 */

import logger from '../utils/logger.js';

/**
 * Request logging middleware
 * Logs request method, path, status, duration, and user info
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Store original res.json to intercept response
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    const duration = Date.now() - start;

    // Log request details
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };

    // Add user info if authenticated
    if (req.user) {
      logData.userId = req.user._id || req.user.userId;
      logData.userEmail = req.user.email;
    }

    // Add query params if present
    if (Object.keys(req.query).length > 0) {
      logData.query = req.query;
    }

    // Determine log level based on status code
    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request error', logData);
    } else {
      logger.info('Request completed', logData);
    }

    return originalJson(body);
  };

  next();
};

/**
 * Detailed request logger for debugging
 * Includes request body (sanitized)
 * Use sparingly - can expose sensitive data
 */
export const detailedRequestLogger = (req, res, next) => {
  const start = Date.now();

  // Store original res.json
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    const duration = Date.now() - start;

    // Sanitize sensitive fields
    const sanitizedBody = { ...req.body };
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];
    sensitiveFields.forEach(field => {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '[REDACTED]';
      }
    });

    logger.debug('Detailed request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      body: sanitizedBody,
      query: req.query,
      params: req.params,
      userId: req.user?._id || req.user?.userId
    });

    return originalJson(body);
  };

  next();
};

export default {
  requestLogger,
  detailedRequestLogger
};
