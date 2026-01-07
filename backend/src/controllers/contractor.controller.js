/**
 * Contractor Controller
 * Handles contractor/service provider operations
 */

import ServiceProvider from '../models/ServiceProvider.js';
import { getContractorWithUserStats } from '../services/contractorAggregation.service.js';
import Home from '../models/Home.js';
import logger from '../utils/logger.js';

/**
 * Get all contractors with optional filters
 * GET /api/v1/contractors
 */
export async function getContractors(req, res) {
  try {
    const { specialty, territory, verified, minRating, limit = 50, offset = 0 } = req.query;

    const query = { status: 'active' };

    if (specialty) {
      query.specialties = specialty;
    }

    if (territory) {
      query.$or = [
        { 'serviceArea.territory': territory },
        { 'serviceArea.territory': 'All Territories' }
      ];
    }

    if (verified === 'true') {
      query['verification.verified'] = true;
    }

    if (minRating) {
      query['ratings.overall'] = { $gte: parseFloat(minRating) };
    }

    const contractors = await ServiceProvider.find(query)
      .sort({ 'ratings.overall': -1, 'ratings.count': -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    const total = await ServiceProvider.countDocuments(query);

    res.json({
      success: true,
      data: {
        contractors,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Error fetching contractors:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch contractors'
      }
    });
  }
}

/**
 * Get contractor by ID with user stats
 * GET /api/v1/contractors/:id
 */
export async function getContractorById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Get user's home
    const home = await Home.findOne({ userId, archived: false }).sort({ createdAt: -1 });

    if (!home) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_HOME_FOUND',
          message: 'User home not found'
        }
      });
    }

    const contractor = await getContractorWithUserStats(userId, home._id, id);

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contractor not found'
        }
      });
    }

    res.json({
      success: true,
      data: contractor
    });
  } catch (error) {
    logger.error('Error fetching contractor:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch contractor'
      }
    });
  }
}

/**
 * Create new contractor (admin only)
 * POST /api/v1/contractors
 */
export async function createContractor(req, res) {
  try {
    const contractorData = req.body;

    const contractor = new ServiceProvider(contractorData);
    await contractor.save();

    res.status(201).json({
      success: true,
      data: contractor
    });
  } catch (error) {
    logger.error('Error creating contractor:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid contractor data',
          details: Object.values(error.errors).map(e => e.message)
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create contractor'
      }
    });
  }
}

/**
 * Update contractor (admin only)
 * PUT /api/v1/contractors/:id
 */
export async function updateContractor(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const contractor = await ServiceProvider.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!contractor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contractor not found'
        }
      });
    }

    res.json({
      success: true,
      data: contractor
    });
  } catch (error) {
    logger.error('Error updating contractor:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update contractor'
      }
    });
  }
}

export default {
  getContractors,
  getContractorById,
  createContractor,
  updateContractor
};
