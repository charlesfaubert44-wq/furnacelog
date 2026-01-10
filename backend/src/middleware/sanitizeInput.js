/**
 * Input Sanitization Middleware
 * SECURITY: Prevents mass assignment and attribute injection attacks
 * Ensures only allowed fields can be updated by users
 */

import logger from '../utils/logger.js';

/**
 * Protected fields that should NEVER be updatable by users
 * These fields are system-managed or security-critical
 */
const PROTECTED_FIELDS = [
  '_id',
  'id',
  '__v',
  'createdAt',
  'updatedAt',
  'role',           // User role - only admins can change
  'isActive',       // User active status
  'passwordHash',   // Password - use dedicated endpoint
  'isAdmin',
  'isSuperAdmin',
  'permissions',
  'verified',
  'emailVerified',
  'sessionId',
  'tokenVersion'
];

/**
 * Create middleware to allow only specific fields
 * @param {string[]} allowedFields - Array of field names that are allowed
 * @param {object} options - Additional options
 * @returns {Function} Express middleware
 */
export function allowOnly(allowedFields, options = {}) {
  const { strict = true, logViolations = true } = options;

  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    const violations = [];
    const sanitized = {};

    // Check each field in request body
    for (const [key, value] of Object.entries(req.body)) {
      // Check if field is protected
      if (PROTECTED_FIELDS.includes(key)) {
        violations.push(key);
        if (logViolations) {
          logger.warn(`SECURITY: Attempt to modify protected field "${key}"`, {
            userId: req.userId,
            ip: req.ip,
            path: req.path
          });
        }
        continue;
      }

      // Check if field is in allowlist
      if (allowedFields.includes(key)) {
        sanitized[key] = value;
      } else if (strict) {
        violations.push(key);
        if (logViolations) {
          logger.warn(`SECURITY: Attempt to set disallowed field "${key}"`, {
            userId: req.userId,
            ip: req.ip,
            path: req.path
          });
        }
      }
    }

    // If strict mode and violations found, reject request
    if (strict && violations.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid fields in request',
          details: violations.map(field => ({
            field,
            message: `Field "${field}" is not allowed or is protected`
          }))
        }
      });
    }

    // Replace request body with sanitized version
    req.body = sanitized;
    next();
  };
}

/**
 * Sanitize nested objects to prevent prototype pollution
 * @param {object} obj - Object to sanitize
 * @param {number} depth - Maximum depth to traverse
 * @returns {object} Sanitized object
 */
export function sanitizeObject(obj, depth = 5) {
  if (depth === 0 || obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Protect against prototype pollution
  const dangerous = ['__proto__', 'constructor', 'prototype'];

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth - 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block dangerous keys
    if (dangerous.includes(key)) {
      logger.warn(`SECURITY: Blocked prototype pollution attempt with key "${key}"`);
      continue;
    }

    // Block protected fields
    if (PROTECTED_FIELDS.includes(key)) {
      logger.warn(`SECURITY: Blocked attempt to set protected field "${key}"`);
      continue;
    }

    // Recursively sanitize nested objects
    if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, depth - 1);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Middleware to sanitize all request bodies
 * Protects against prototype pollution
 */
export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Pre-defined allowlists for common operations
 */
export const AllowLists = {
  // User profile updates
  userProfile: [
    'profile.firstName',
    'profile.lastName',
    'profile.phone',
    'profile.community',
    'profile.timezone',
    'profile.preferredUnits'
  ],

  // User preferences
  userPreferences: [
    'preferences.notifications.email',
    'preferences.notifications.push',
    'preferences.notifications.digestFrequency',
    'preferences.defaultHome'
  ],

  // Home creation/update
  home: [
    'name',
    'address',
    'details',
    'utilities',
    'coverPhotoUrl'
  ],

  // System creation/update
  system: [
    'name',
    'category',
    'vintage',
    'manufacturer',
    'model',
    'serialNumber',
    'efficiency',
    'capacity',
    'fuelType',
    'notes'
  ],

  // Maintenance log
  maintenanceLog: [
    'systemId',
    'componentId',
    'taskId',
    'date',
    'notes',
    'cost',
    'contractorId',
    'photos'
  ]
};

/**
 * Flatten nested field paths for comparison
 * Converts 'profile.firstName' to work with nested objects
 */
function flattenObject(obj, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, path, result);
    } else {
      result[path] = value;
    }
  }
  return result;
}

/**
 * Check if a field path is allowed
 */
function isFieldAllowed(fieldPath, allowedFields) {
  // Direct match
  if (allowedFields.includes(fieldPath)) {
    return true;
  }

  // Check if it's a nested field (e.g., 'profile' allows 'profile.firstName')
  return allowedFields.some(allowed => {
    return fieldPath.startsWith(allowed + '.') || allowed.startsWith(fieldPath + '.');
  });
}

/**
 * Advanced allowOnly that handles nested fields
 */
export function allowOnlyNested(allowedFields, options = {}) {
  const { strict = true, logViolations = true } = options;

  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    const flattened = flattenObject(req.body);
    const violations = [];

    for (const fieldPath of Object.keys(flattened)) {
      // Check if field is protected
      const fieldName = fieldPath.split('.')[0];
      if (PROTECTED_FIELDS.includes(fieldName)) {
        violations.push(fieldPath);
        if (logViolations) {
          logger.warn(`SECURITY: Attempt to modify protected field "${fieldPath}"`, {
            userId: req.userId,
            ip: req.ip,
            path: req.path
          });
        }
        continue;
      }

      // Check if field is allowed
      if (!isFieldAllowed(fieldPath, allowedFields)) {
        violations.push(fieldPath);
        if (strict && logViolations) {
          logger.warn(`SECURITY: Attempt to set disallowed field "${fieldPath}"`, {
            userId: req.userId,
            ip: req.ip,
            path: req.path
          });
        }
      }
    }

    if (strict && violations.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid fields in request',
          details: violations.map(field => ({
            field,
            message: `Field "${field}" is not allowed or is protected`
          }))
        }
      });
    }

    // Sanitize for prototype pollution
    req.body = sanitizeObject(req.body);

    next();
  };
}

export default {
  allowOnly,
  allowOnlyNested,
  sanitizeBody,
  sanitizeObject,
  AllowLists,
  PROTECTED_FIELDS
};
