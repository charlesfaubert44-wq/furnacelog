import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import { getRedisClient } from '../config/redis.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Epic E2-T3: JWT Authentication Middleware
 */

/**
 * Authenticate user via JWT token
 * Verifies token, checks session validity, and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // SECURITY FIX: Extract token from httpOnly cookie first, then fallback to Authorization header
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header for backward compatibility during transition
    if (!token) {
      token = extractTokenFromHeader(req);
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid or expired token'
      });
    }

    // Check if session exists in Redis (if Redis is available)
    const redis = getRedisClient();
    if (redis) {
      try {
        const sessionKey = `session:${decoded.userId}:${decoded.sessionId}`;
        const session = await redis.get(sessionKey);

        if (!session) {
          return res.status(401).json({
            success: false,
            message: 'Session expired or invalid. Please login again.'
          });
        }
      } catch (redisError) {
        // Log error but continue - Redis failure shouldn't block authentication
        console.warn('Redis session check failed:', redisError.message);
      }
    }

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Attach user and session info to request
    req.user = user;
    req.userId = user._id;
    req.sessionId = decoded.sessionId;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Require specific role(s)
 * Use after authenticate middleware
 * @param  {...string} roles - Allowed roles
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // SECURITY FIX: Extract token from httpOnly cookie first, then fallback to Authorization header
    let token = req.cookies?.accessToken;

    if (!token) {
      token = extractTokenFromHeader(req);
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
        req.sessionId = decoded.sessionId;
      }
    } catch (error) {
      // Invalid token, but that's okay for optional auth
      console.log('Optional auth token invalid:', error.message);
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Rate limiting for login attempts
 * Prevents brute force attacks
 */
export const loginRateLimiter = async (req, res, next) => {
  const redis = getRedisClient();

  if (!redis) {
    // If Redis is not available, skip rate limiting
    return next();
  }

  try {
    const { email } = req.body;
    const key = `login_attempts:${email}`;

    const attempts = await redis.get(key);
    const attemptCount = attempts ? parseInt(attempts) : 0;

    // Allow 5 attempts per 15 minutes
    if (attemptCount >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again in 15 minutes.'
      });
    }

    // Increment attempt counter
    await redis.incr(key);
    await redis.expire(key, 900); // 15 minutes

    // Store attempt count in request for cleanup on success
    req.loginAttempts = {
      key,
      count: attemptCount + 1
    };

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Don't block request if rate limiter fails
    next();
  }
};

/**
 * Clear login attempts on successful login
 * Call this after successful authentication
 */
export const clearLoginAttempts = async (email) => {
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  try {
    const key = `login_attempts:${email}`;
    await redis.del(key);
  } catch (error) {
    console.error('Error clearing login attempts:', error);
  }
};

export default {
  authenticate,
  requireRole,
  optionalAuth,
  loginRateLimiter,
  clearLoginAttempts
};
