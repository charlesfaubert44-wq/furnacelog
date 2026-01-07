import Home from '../models/Home.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { sendSuccess, handleError, sendNotFound, sendError, ErrorCodes } from '../utils/responses.js';

/**
 * @desc    Create a new home
 * @route   POST /api/v1/homes
 * @access  Private
 */
export const createHome = async (req, res) => {
  try {
    const userId = req.userId;

    // Create home with user ID
    const home = await Home.create({
      ...req.body,
      userId
    });

    logger.info(`User ${userId} created home ${home._id}`);

    return sendSuccess(res, 201, home);
  } catch (error) {
    logger.error('Create home error:', error);
    return handleError(res, error, 'Failed to create home');
  }
};

/**
 * @desc    Get all homes for authenticated user
 * @route   GET /api/v1/homes
 * @access  Private
 */
export const getHomes = async (req, res) => {
  try {
    const userId = req.userId;
    const { includeArchived } = req.query;

    // Build query
    const query = { userId };

    // By default, exclude archived homes
    if (includeArchived !== 'true') {
      query.archived = false;
    }

    const homes = await Home.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 200, homes, { count: homes.length });
  } catch (error) {
    logger.error('Get homes error:', error);
    return handleError(res, error, 'Failed to retrieve homes');
  }
};

/**
 * @desc    Get single home by ID
 * @route   GET /api/v1/homes/:homeId
 * @access  Private
 */
export const getHome = async (req, res) => {
  try {
    // Home is already attached to req by ownership middleware
    const home = req.home;

    return sendSuccess(res, 200, home);
  } catch (error) {
    logger.error('Get home error:', error);
    return handleError(res, error, 'Failed to retrieve home');
  }
};

/**
 * @desc    Update home
 * @route   PATCH /api/v1/homes/:homeId
 * @access  Private
 */
export const updateHome = async (req, res) => {
  try {
    const { homeId } = req.params;

    // Fields that should not be updated
    const restrictedFields = ['userId', '_id', 'createdAt'];

    // Remove restricted fields from update
    restrictedFields.forEach(field => delete req.body[field]);

    // Update home
    const home = await Home.findByIdAndUpdate(
      homeId,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    );

    if (!home) {
      return sendNotFound(res, 'Home');
    }

    logger.info(`Home ${homeId} updated`);

    return sendSuccess(res, 200, home);
  } catch (error) {
    logger.error('Update home error:', error);
    return handleError(res, error, 'Failed to update home');
  }
};

/**
 * @desc    Delete home (soft delete by archiving)
 * @route   DELETE /api/v1/homes/:homeId
 * @access  Private
 */
export const deleteHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { permanent } = req.query;

    if (permanent === 'true') {
      // Permanent deletion
      await Home.findByIdAndDelete(homeId);
      logger.warn(`Home ${homeId} permanently deleted`);

      return sendSuccess(res, 200, null, { message: 'Home permanently deleted' });
    } else {
      // Soft delete (archive)
      const home = await Home.findByIdAndUpdate(
        homeId,
        { archived: true },
        { new: true }
      );

      logger.info(`Home ${homeId} archived`);

      return sendSuccess(res, 200, home, { message: 'Home archived successfully' });
    }
  } catch (error) {
    logger.error('Delete home error:', error);
    return handleError(res, error, 'Failed to delete home');
  }
};

/**
 * @desc    Restore archived home
 * @route   PATCH /api/v1/homes/:homeId/restore
 * @access  Private
 */
export const restoreHome = async (req, res) => {
  try {
    const { homeId } = req.params;

    const home = await Home.findByIdAndUpdate(
      homeId,
      { archived: false },
      { new: true }
    );

    if (!home) {
      return sendNotFound(res, 'Home');
    }

    logger.info(`Home ${homeId} restored`);

    return sendSuccess(res, 200, home, { message: 'Home restored successfully' });
  } catch (error) {
    logger.error('Restore home error:', error);
    return handleError(res, error, 'Failed to restore home');
  }
};

/**
 * @desc    Upload home cover photo
 * @route   POST /api/v1/homes/:homeId/photo
 * @access  Private
 */
export const uploadCoverPhoto = async (req, res) => {
  try {
    const { homeId } = req.params;

    // File upload handled by multer middleware
    if (!req.file) {
      return sendError(res, 400, ErrorCodes.BAD_REQUEST, 'No file uploaded');
    }

    // URL to the uploaded file (set by MinIO upload middleware)
    const photoUrl = req.file.location;

    const home = await Home.findByIdAndUpdate(
      homeId,
      { coverPhoto: photoUrl },
      { new: true }
    );

    logger.info(`Cover photo uploaded for home ${homeId}`);

    return sendSuccess(res, 200, home, { message: 'Cover photo uploaded successfully' });
  } catch (error) {
    logger.error('Upload photo error:', error);
    return handleError(res, error, 'Failed to upload cover photo');
  }
};

/**
 * @desc    Get home statistics for user
 * @route   GET /api/v1/homes/stats
 * @access  Private
 */
export const getHomeStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await Home.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$archived', false] }, 1, 0] }
          },
          archived: {
            $sum: { $cond: [{ $eq: ['$archived', true] }, 1, 0] }
          },
          byType: {
            $push: '$details.homeType'
          }
        }
      }
    ]);

    const data = stats[0] || { total: 0, active: 0, archived: 0, byType: [] };

    return sendSuccess(res, 200, data);
  } catch (error) {
    logger.error('Get home stats error:', error);
    return handleError(res, error, 'Failed to retrieve statistics');
  }
};

export default {
  createHome,
  getHomes,
  getHome,
  updateHome,
  deleteHome,
  restoreHome,
  uploadCoverPhoto,
  getHomeStats
};
