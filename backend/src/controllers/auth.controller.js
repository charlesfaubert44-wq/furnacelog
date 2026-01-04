import User from '../models/User.js';
import { generateTokenPair } from '../utils/jwt.js';
import { getRedisClient } from '../config/redis.js';
import { clearLoginAttempts } from '../middleware/auth.middleware.js';

/**
 * Authentication Controller
 * Epic E2: Authentication & User Management
 */

/**
 * Register new user
 * E2-T1: User Registration API
 * POST /api/v1/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, profile } = req.validatedData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = new User({
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      profile: profile || {}
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Store session in Redis
    const redis = getRedisClient();
    if (redis) {
      try {
        const sessionKey = `session:${user._id}:${tokens.sessionId}`;
        const sessionData = {
          userId: user._id.toString(),
          email: user.email,
          createdAt: new Date().toISOString(),
          userAgent: req.headers['user-agent']
        };
        await redis.setex(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(sessionData)); // 7 days
      } catch (redisError) {
        console.warn('Failed to store session in Redis:', redisError.message);
      }
    }

    // Set httpOnly cookies for tokens (SECURITY FIX)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'strict', // 'lax' for cross-subdomain in production
      ...(isProduction && { domain: '.furnacelog.com' }) // Share cookies across subdomains
    };

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return success with user data only (no tokens in response body)
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Login user
 * E2-T2: User Login API
 * POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.validatedData;

    // Find user with password field
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Clear login attempts on successful login
    await clearLoginAttempts(email);

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Store session in Redis
    const redis = getRedisClient();
    if (redis) {
      try {
        const sessionKey = `session:${user._id}:${tokens.sessionId}`;
        const sessionTTL = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days if remember me, else 7 days

        const sessionData = {
          userId: user._id.toString(),
          email: user.email,
          createdAt: new Date().toISOString(),
          rememberMe: rememberMe || false,
          userAgent: req.headers['user-agent'],
          ip: req.ip
        };

        await redis.setex(sessionKey, sessionTTL, JSON.stringify(sessionData));
      } catch (redisError) {
        console.warn('Failed to store session in Redis:', redisError.message);
      }
    }

    // Set httpOnly cookies for tokens (SECURITY FIX)
    const isProduction = process.env.NODE_ENV === 'production';
    const refreshTokenMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'strict', // 'lax' for cross-subdomain in production
      ...(isProduction && { domain: '.furnacelog.com' }) // Share cookies across subdomains
    };

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge
    });

    // Return success with user data only (no tokens in response body)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Logout user
 * E2-T3: Implement logout functionality (token invalidation)
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  try {
    const { userId, sessionId } = req;

    // Remove session from Redis
    const redis = getRedisClient();
    if (redis) {
      try {
        const sessionKey = `session:${userId}:${sessionId}`;
        await redis.del(sessionKey);
      } catch (redisError) {
        console.warn('Failed to delete session from Redis:', redisError.message);
      }
    }

    // Clear httpOnly cookies (SECURITY FIX)
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

/**
 * Refresh access token
 * E2-T3: Implement token refresh logic
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie instead of body (SECURITY FIX)
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const { verifyRefreshToken } = await import('../utils/jwt.js');
    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Check if session still exists
    const redis = getRedisClient();
    if (redis) {
      try {
        const sessionKey = `session:${decoded.userId}:${decoded.sessionId}`;
        const session = await redis.get(sessionKey);

        if (!session) {
          return res.status(401).json({
            success: false,
            message: 'Session expired. Please login again.'
          });
        }
      } catch (redisError) {
        console.warn('Redis session check failed:', redisError.message);
      }
    }

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new token pair
    const tokens = generateTokenPair(user);

    // Update session in Redis with new session ID
    if (redis) {
      try {
        // Delete old session
        const oldSessionKey = `session:${decoded.userId}:${decoded.sessionId}`;
        await redis.del(oldSessionKey);

        // Create new session
        const newSessionKey = `session:${user._id}:${tokens.sessionId}`;
        const sessionData = {
          userId: user._id.toString(),
          email: user.email,
          createdAt: new Date().toISOString(),
          userAgent: req.headers['user-agent']
        };
        await redis.setex(newSessionKey, 7 * 24 * 60 * 60, JSON.stringify(sessionData));
      } catch (redisError) {
        console.warn('Failed to update session in Redis:', redisError.message);
      }
    }

    // Set new httpOnly cookies for tokens (SECURITY FIX)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'strict', // 'lax' for cross-subdomain in production
      ...(isProduction && { domain: '.furnacelog.com' }) // Share cookies across subdomains
    };

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {}
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

/**
 * Get current user profile
 * E2-T4: User Profile Management API
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user.toSafeObject()
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile'
    });
  }
};

/**
 * OAuth callback handler (Google & Facebook)
 * Generates tokens and redirects to frontend with auth data
 * SECURITY FIX: Tokens stored in httpOnly cookies, NOT in URL
 */
export const oauthCallback = async (req, res) => {
  try {
    const user = req.user; // Set by Passport

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?auth_error=user_not_found`);
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Store session in Redis
    const redis = getRedisClient();
    if (redis) {
      try {
        const sessionKey = `session:${user._id}:${tokens.sessionId}`;
        const sessionData = {
          userId: user._id.toString(),
          email: user.email,
          createdAt: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          oauth: true
        };
        await redis.setex(sessionKey, 30 * 24 * 60 * 60, JSON.stringify(sessionData)); // 30 days for OAuth
      } catch (redisError) {
        console.warn('Failed to store OAuth session in Redis:', redisError.message);
      }
    }

    // Set httpOnly cookies for tokens (SECURITY FIX: No tokens in URL!)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax', // 'lax' for OAuth redirects and cross-subdomain
      ...(isProduction && { domain: '.furnacelog.com' }) // Share cookies across subdomains
    };

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days for OAuth
    });

    // Redirect to frontend WITHOUT tokens in URL (SECURITY FIX)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback`;

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}?auth_error=oauth_failed`);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  oauthCallback
};
