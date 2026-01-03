import Redis from 'ioredis';
import logger from '../utils/logger.js';

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis connection error: ${err}`);
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting...');
    });

    // Test connection
    await redisClient.ping();
    logger.info('Redis connection test successful');

    return redisClient;
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error.message}`);
    // Redis is not critical - app can run without it
    logger.warn('Continuing without Redis. Caching and session features will be limited.');
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    logger.warn('Redis client not initialized');
  }
  return redisClient;
};

export { connectRedis, getRedisClient };
export default connectRedis;
