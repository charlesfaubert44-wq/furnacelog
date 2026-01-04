import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  oauthCallback
} from '../controllers/auth.controller.js';
import {
  authenticate,
  loginRateLimiter
} from '../middleware/auth.middleware.js';
import {
  validate,
  registerSchema,
  loginSchema
} from '../validators/auth.validators.js';
import passport from '../config/passport.js';

const router = express.Router();

/**
 * Authentication Routes
 * Epic E2: Authentication & User Management
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 * @task    E2-T1: User Registration API
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 * @task    E2-T2: User Login API
 */
router.post('/login', loginRateLimiter, validate(loginSchema), login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (invalidate session)
 * @access  Private
 * @task    E2-T3: Implement logout functionality
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @task    E2-T3: Implement token refresh logic
 */
router.post('/refresh', refreshToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 * @task    E2-T4: User Profile Management API
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * OAuth Routes
 */

/**
 * @route   GET /api/v1/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?auth_error=google_auth_failed`
  }),
  oauthCallback
);

/**
 * @route   GET /api/v1/auth/facebook
 * @desc    Initiate Facebook OAuth flow
 * @access  Public
 */
router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false
  })
);

/**
 * @route   GET /api/v1/auth/facebook/callback
 * @desc    Facebook OAuth callback
 * @access  Public
 */
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?auth_error=facebook_auth_failed`
  }),
  oauthCallback
);

export default router;
