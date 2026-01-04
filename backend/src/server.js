import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import connectDB from './config/database.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import homeRoutes from './routes/homeRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB and Redis
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
  } catch (error) {
    console.error('Failed to connect to databases:', error);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers

// CORS - Support multiple origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

// Manual CORS middleware (more control than cors package)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    // Set CORS headers manually
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  } else if (!origin) {
    // No origin (server-to-server, Postman, etc.)
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Log rejected origins for security monitoring
    logger.warn(`CORS: Origin ${origin} not allowed`);
  }

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(compression()); // Compress responses
app.use(cookieParser()); // Parse cookies (SECURITY FIX: Required for httpOnly cookies)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CSRF Protection (SECURITY FIX)
const {
  generateToken, // Use this in route to generate a CSRF token
  doubleCsrfProtection, // Apply this to routes you want protected
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'furnacelog-csrf-secret-change-in-production',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
});

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CSRF token endpoint (SECURITY FIX)
app.get('/api/v1/auth/csrf-token', (req, res) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// API Routes (SECURITY FIX: CSRF protection applied to state-changing routes)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', doubleCsrfProtection, userRoutes);
app.use('/api/v1/onboarding', doubleCsrfProtection, onboardingRoutes);
app.use('/api/v1/dashboard', dashboardRoutes); // Dashboard (read-only, no CSRF needed)
app.use('/api/v1/homes', doubleCsrfProtection, homeRoutes);
app.use('/api/v1/templates', doubleCsrfProtection, templateRoutes);
app.use('/api/v1/maintenance', doubleCsrfProtection, maintenanceRoutes);
app.use('/api/v1/timeline', timelineRoutes); // Climate Time Machine (read-only, no CSRF needed)

// Nested routes for systems and components (parameterized by homeId)
// Note: These routes expect :homeId in path, handled by route definitions
app.use('/api/v1/homes/:homeId/systems', doubleCsrfProtection, systemRoutes);
app.use('/api/v1/homes/:homeId/components', doubleCsrfProtection, componentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;
startServer().then(() => {
  const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log('FurnaceLog API Server Running');
    console.log('Port:', PORT);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('=================================');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
  });
});

export default app;
