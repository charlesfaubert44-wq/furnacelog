import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import contractorRoutes from './routes/contractor.routes.js';
import homeRoutes from './routes/homeRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import userRoutes from './routes/user.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import contactRoutes from './routes/contact.routes.js';
import sitemapRoutes from './routes/sitemap.routes.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Trust proxy (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS - Support multiple origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

// Manual CORS middleware (more control than cors package)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  logger.info(`CORS check - Origin: ${origin}, Allowed: ${JSON.stringify(allowedOrigins)}`);

  // Check if origin is allowed
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    // Set CORS headers manually
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    logger.info(`CORS: Set Access-Control-Allow-Origin to ${origin}`);
  } else if (!origin) {
    // No origin (server-to-server, Postman, etc.)
    res.setHeader('Access-Control-Allow-Origin', '*');
    logger.info('CORS: No origin, allowing all');
  } else {
    logger.warn(`CORS: Origin ${origin} not allowed`);
  }

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser
app.use(cookieParser());

// Initialize Passport for OAuth
app.use(passport.initialize());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// HTTP Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// SEO Routes (before API routes, no /api prefix)
app.use('/', sitemapRoutes);

// API Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/contractors', contractorRoutes);
app.use('/api/v1/homes', homeRoutes);
app.use('/api/v1/systems', systemRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/contact', contactRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'FurnaceLog API',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to FurnaceLog - Northern Home Maintenance Tracker',
    documentation: '/api/v1/health',
  });
});

// 404 Handler - SECURITY: Uses centralized handler
app.use(notFoundHandler);

// Global Error Handler - SECURITY: Never exposes stack traces
app.use(errorHandler);

export default app;
