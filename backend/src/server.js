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
import iotRoutes from './routes/iot.routes.js';
import iotService from './services/iotService.js';
import alertService from './services/alertService.js';
import websocketService from './services/websocketService.js';
import Home from './models/Home.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateEnvironment } from './utils/validateEnv.js';

// Load environment variables
dotenv.config();

// SECURITY: Validate environment configuration on startup
// This will exit the process if configuration is insecure
validateEnvironment();

// Connect to MongoDB, Redis, and IoT services
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // DISABLED: Initialize IoT service (MQTT connection)
    // Temporarily disabled to prevent container crashes from unhandled promise rejections
    // TODO: Re-enable once MQTT broker is configured and error handling is improved
    /*
    try {
      await iotService.connect();

      // Listen for sensor alerts
      iotService.on('alert', async (alertData) => {
        await alertService.processAlert(alertData);
      });

      logger.info('IoT services initialized');
    } catch (iotError) {
      logger.warn('IoT service initialization failed (non-critical):', iotError.message);
      // Continue even if MQTT fails - system can still function without real-time sensors
    }
    */
    logger.info('IoT services disabled (MQTT not configured)');
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-csrf-token');
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
  generateCsrfToken, // Use this in route to generate a CSRF token (correct property name from csrf-csrf v4)
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
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
  getSessionIdentifier: (req) => req.sessionID || '' // Required by csrf-csrf v4
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
  const csrfToken = generateCsrfToken(req, res);
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

// IoT routes (sensors and readings)
app.use('/api/v1/iot', iotRoutes); // General IoT endpoints
app.use('/api/v1/homes/:homeId/sensors', doubleCsrfProtection, iotRoutes); // Home-specific sensor endpoints

// 404 handler - SECURITY: Uses centralized handler
app.use(notFoundHandler);

// Global error handler - SECURITY: Never exposes stack traces
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
startServer().then(async () => {
  const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log('FurnaceLog API Server Running');
    console.log('Port:', PORT);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('=================================');
  });

  // Initialize WebSocket server
  websocketService.initialize(server);

  // DISABLED: Connect IoT service events to WebSocket broadcasting
  // Temporarily disabled - IoT service not initialized
  /*
  iotService.on('reading', async (sensorData) => {
    try {
      // Get home to find userId
      const home = await Home.findById(sensorData.homeId).lean();
      if (home) {
        websocketService.broadcastSensorReading(home.userId, sensorData);
      }
    } catch (error) {
      logger.error('Error broadcasting sensor reading:', error);
    }
  });

  iotService.on('alert', async (alertData) => {
    try {
      // Get home to find userId
      const home = await Home.findById(alertData.homeId).lean();
      if (home) {
        websocketService.broadcastAlert(home.userId, alertData);
      }
    } catch (error) {
      logger.error('Error broadcasting alert:', error);
    }
  });
  */

  // Handle graceful shutdown
  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Close WebSocket connections
    websocketService.close();

    // DISABLED: Close MQTT connection (IoT service not running)
    // await iotService.disconnect();

    // Close HTTP server
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
      logger.error('Forceful shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
  });
});

export default app;
