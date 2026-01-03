import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * JWT Utilities
 * Epic E2-T2: Generate JWT access and refresh tokens
 * Epic E2-T3: JWT Authentication Middleware
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // 15 minutes for access token
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // 7 days for refresh token

/**
 * Generate access token
 * @param {object} payload - User data to encode in token
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'furnacelog-api',
    audience: 'furnacelog-client'
  });
};

/**
 * Generate refresh token
 * @param {object} payload - User data to encode in token
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'furnacelog-api',
    audience: 'furnacelog-client'
  });
};

/**
 * Generate both access and refresh tokens
 * @param {object} user - User object
 * @returns {object} Object containing access and refresh tokens
 */
export const generateTokenPair = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const sessionId = crypto.randomBytes(16).toString('hex');

  const accessToken = generateAccessToken({ ...payload, sessionId });
  const refreshToken = generateRefreshToken({ ...payload, sessionId });

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresIn: JWT_EXPIRES_IN
  };
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'furnacelog-api',
      audience: 'furnacelog-client'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'furnacelog-api',
      audience: 'furnacelog-client'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode token without verifying (useful for debugging)
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Extract token from Authorization header
 * @param {object} req - Express request object
 * @returns {string|null} Token or null if not found
 */
export const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Calculate token expiry time
 * @param {string} expiresIn - Expiry string (e.g., '15m', '7d')
 * @returns {Date} Expiry date
 */
export const calculateExpiryDate = (expiresIn) => {
  const now = Date.now();
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error('Invalid expiresIn format');
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return new Date(now + value * multipliers[unit]);
};
