/**
 * Global Query Filter Middleware for Mongoose
 * SECURITY: Implements Row-Level Security (RLS) at database level
 * Automatically filters queries by userId to prevent unauthorized data access
 *
 * This middleware ensures that even if authorization checks are missed in controllers,
 * users cannot access data belonging to other users.
 */

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Models that should be filtered by userId
 * These are "tenant-isolated" models where data belongs to specific users
 */
const USER_SCOPED_MODELS = [
  'Home',
  'System',
  'Component',
  'MaintenanceLog',
  'ScheduledMaintenance',
  'SeasonalChecklist',
  'Sensor',
  'SensorReading'
];

/**
 * Install global query middleware for automatic user filtering
 * This runs before every find/update/delete operation
 */
export function installRowLevelSecurity() {
  logger.info('Installing Row-Level Security (RLS) middleware...');

  // Add global pre-find hook to all schemas
  mongoose.plugin((schema, options) => {
    const modelName = schema.get('modelName') || options.collection;

    // Only apply to user-scoped models
    if (!modelName || !USER_SCOPED_MODELS.includes(modelName)) {
      return;
    }

    /**
     * Pre-find middleware
     * Automatically adds userId filter to all queries
     */
    schema.pre(/^find/, function(next) {
      const query = this.getQuery();

      // If query already has userId set (from controller), use that
      // If not, check if there's a context userId available
      if (!query.userId && this.options.skipRLS) {
        // Explicitly allow skipping RLS (for admin operations)
        logger.debug(`RLS skipped for ${modelName} query`);
        return next();
      }

      // In normal operations, userId should be set by controller
      // This is a safety net in case it's forgotten
      if (!query.userId && !this.options.rls UserId) {
        logger.warn(`SECURITY WARNING: Query on ${modelName} without userId filter. Blocking query.`);
        // Return empty results rather than all results
        this.where({ _id: null }); // Match nothing
      } else if (this.options.rlsUserId) {
        // Add userId from RLS context
        this.where({ userId: this.options.rlsUserId });
      }

      next();
    });

    /**
     * Pre-update middleware
     * Ensures updates only affect user's own documents
     */
    schema.pre(/^update/, function(next) {
      const update = this.getUpdate();
      const query = this.getQuery();

      if (this.options.skipRLS) {
        return next();
      }

      if (!query.userId && !this.options.rlsUserId) {
        logger.warn(`SECURITY WARNING: Update on ${modelName} without userId filter. Blocking update.`);
        this.where({ _id: null }); // Match nothing
      } else if (this.options.rlsUserId && !query.userId) {
        this.where({ userId: this.options.rlsUserId });
      }

      next();
    });

    /**
     * Pre-delete middleware
     * Ensures deletions only affect user's own documents
     */
    schema.pre(/^delete|^remove/, function(next) {
      const query = this.getQuery();

      if (this.options.skipRLS) {
        return next();
      }

      if (!query.userId && !this.options.rlsUserId) {
        logger.warn(`SECURITY WARNING: Delete on ${modelName} without userId filter. Blocking delete.`);
        this.where({ _id: null }); // Match nothing
      } else if (this.options.rlsUserId && !query.userId) {
        this.where({ userId: this.options.rlsUserId });
      }

      next();
    });

    logger.info(`✓ RLS enabled for model: ${modelName}`);
  });

  logger.info('✓ Row-Level Security (RLS) middleware installed');
}

/**
 * Middleware to attach userId context to Mongoose queries
 * Use this in Express middleware chain after authentication
 */
export function attachUserContext(req, res, next) {
  if (req.userId) {
    // Store userId in request for Mongoose to access
    req.rlsContext = {
      userId: req.userId
    };

    // Monkey-patch Mongoose Model methods to include RLS context
    const originalModel = mongoose.Model;

    // Override find methods to include userId
    ['find', 'findOne', 'findById', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany'].forEach(method => {
      const original = originalModel[method];
      if (original) {
        originalModel[method] = function(...args) {
          const query = original.apply(this, args);
          if (req.rlsContext && !query.options.skipRLS) {
            query.setOptions({ rlsUserId: req.rlsContext.userId });
          }
          return query;
        };
      }
    });
  }

  next();
}

/**
 * Utility to allow admin queries that skip RLS
 * Use with extreme caution - only for admin operations
 */
export function skipRLS(query) {
  return query.setOptions({ skipRLS: true });
}

export default {
  installRowLevelSecurity,
  attachUserContext,
  skipRLS
};
