import express from 'express';
import mongoose from 'mongoose';
import { getRedisClient } from '../config/redis.js';
import { getMinIOClient } from '../config/minio.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {},
    };

    // Check MongoDB
    try {
      await mongoose.connection.db.admin().ping();
      health.services.mongodb = 'connected';
    } catch (error) {
      health.services.mongodb = 'disconnected';
      health.status = 'degraded';
    }

    // Check Redis
    const redisClient = getRedisClient();
    if (redisClient) {
      try {
        await redisClient.ping();
        health.services.redis = 'connected';
      } catch (error) {
        health.services.redis = 'disconnected';
        health.status = 'degraded';
      }
    } else {
      health.services.redis = 'not_configured';
    }

    // Check MinIO
    const minioClient = getMinIOClient();
    if (minioClient) {
      try {
        await minioClient.listBuckets();
        health.services.minio = 'connected';
      } catch (error) {
        health.services.minio = 'disconnected';
        health.status = 'degraded';
      }
    } else {
      health.services.minio = 'not_configured';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Simple ping endpoint
router.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

export default router;
