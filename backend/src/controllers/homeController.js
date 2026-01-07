import Home from '../models/Home.js';
import mongoose from 'mongoose';

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

    res.status(201).json({
      success: true,
      data: home
    });
  } catch (error) {
    console.error('Create home error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create home'
    });
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

    res.status(200).json({
      success: true,
      count: homes.length,
      data: homes
    });
  } catch (error) {
    console.error('Get homes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve homes'
    });
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

    res.status(200).json({
      success: true,
      data: home
    });
  } catch (error) {
    console.error('Get home error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve home'
    });
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
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    res.status(200).json({
      success: true,
      data: home
    });
  } catch (error) {
    console.error('Update home error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update home'
    });
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
      
      return res.status(200).json({
        success: true,
        message: 'Home permanently deleted'
      });
    } else {
      // Soft delete (archive)
      const home = await Home.findByIdAndUpdate(
        homeId,
        { archived: true },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Home archived successfully',
        data: home
      });
    }
  } catch (error) {
    console.error('Delete home error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete home'
    });
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
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Home restored successfully',
      data: home
    });
  } catch (error) {
    console.error('Restore home error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore home'
    });
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
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // URL to the uploaded file (set by MinIO upload middleware)
    const photoUrl = req.file.location;

    const home = await Home.findByIdAndUpdate(
      homeId,
      { coverPhoto: photoUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cover photo uploaded successfully',
      data: home
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload cover photo'
    });
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

    res.status(200).json({
      success: true,
      data: stats[0] || { total: 0, active: 0, archived: 0, byType: [] }
    });
  } catch (error) {
    console.error('Get home stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
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
