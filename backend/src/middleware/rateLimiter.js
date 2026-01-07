/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse
 */

import rateLimit from 'express-rate-limit';
import { ErrorCodes } from '../utils/responses.js';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests, please try again later.',
      details: ['Rate limit: 100 requests per 15 minutes']
    }
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false // Disable `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for auth endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many authentication attempts, please try again later.',
      details: ['Rate limit: 5 attempts per 15 minutes']
    }
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Password reset rate limiter
 * 3 requests per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many password reset requests, please try again later.',
      details: ['Rate limit: 3 requests per hour']
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * File upload rate limiter
 * 20 uploads per hour per user
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many upload requests, please try again later.',
      details: ['Rate limit: 20 uploads per hour']
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Create endpoint rate limiter
 * 50 creates per hour per user
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 creates per hour
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many create requests, please try again later.',
      details: ['Rate limit: 50 creates per hour']
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

export default {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  createLimiter
};
