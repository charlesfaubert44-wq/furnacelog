import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import homeRoutes from './routes/homeRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
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

app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

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

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/homes', homeRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);

// Nested routes for systems and components (parameterized by homeId)
// Note: These routes expect :homeId in path, handled by route definitions
app.use('/api/v1/homes/:homeId/systems', systemRoutes);
app.use('/api/v1/homes/:homeId/components', componentRoutes);

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
