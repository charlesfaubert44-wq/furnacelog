import Home from '../models/Home.js';

/**
 * Middleware to validate that the authenticated user owns the home
 * Expects req.userId to be set by authentication middleware
 * Expects req.params.homeId to be present in the route
 */
export const validateHomeOwnership = async (req, res, next) => {
  try {
    const { homeId } = req.params;
    const userId = req.userId; // Set by auth middleware

    if (!homeId) {
      return res.status(400).json({
        success: false,
        error: 'Home ID is required'
      });
    }

    // Find the home and check ownership
    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    // Check if user owns the home
    if (home.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this home'
      });
    }

    // Attach home to request for use in controller
    req.home = home;
    next();
  } catch (error) {
    console.error('Ownership validation error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid home ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during ownership validation'
    });
  }
};

/**
 * Middleware to validate home ownership with optional archived homes
 */
export const validateHomeOwnershipWithArchived = async (req, res, next) => {
  try {
    const { homeId } = req.params;
    const userId = req.userId;

    if (!homeId) {
      return res.status(400).json({
        success: false,
        error: 'Home ID is required'
      });
    }

    // Find home including archived ones
    const home = await Home.findOne({ _id: homeId });

    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    if (home.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this home'
      });
    }

    req.home = home;
    next();
  } catch (error) {
    console.error('Ownership validation error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid home ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during ownership validation'
    });
  }
};

export default { validateHomeOwnership, validateHomeOwnershipWithArchived };
