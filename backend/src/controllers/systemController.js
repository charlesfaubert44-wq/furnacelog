/**
 * System Controller
 * Business logic for system management
 *
 * Part of Epic E4 - System & Component Tracking
 */

import System from '../models/System.js';
import Home from '../models/Home.js';
import { generateQRCodeImage } from '../services/qrCodeService.js';
import { uploadToStorage } from '../services/storageService.js';

/**
 * Create a new system
 * POST /api/v1/homes/:homeId/systems
 */
export const createSystem = async (req, res) => {
  try {
    const { homeId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    // Create system
    const system = new System({
      homeId,
      ...req.body
    });

    // Calculate next service due if applicable
    if (system.maintenance.lastServiceDate && system.maintenance.defaultIntervalDays) {
      system.maintenance.nextServiceDue = system.calculateNextServiceDue();
    }

    await system.save();

    res.status(201).json({
      success: true,
      data: system
    });
  } catch (error) {
    console.error('Error creating system:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create system'
    });
  }
};

/**
 * Get all systems for a home
 * GET /api/v1/homes/:homeId/systems
 */
export const getSystemsByHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { category, status } = req.query;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    // Build query
    const query = { homeId };
    if (category) query.category = category;
    if (status) query.status = status;

    const systems = await System.find(query)
      .sort({ category: 1, name: 1 });

    // Group by category
    const groupedSystems = systems.reduce((acc, system) => {
      if (!acc[system.category]) {
        acc[system.category] = [];
      }
      acc[system.category].push(system);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        systems,
        groupedByCategory: groupedSystems,
        count: systems.length
      }
    });
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch systems'
    });
  }
};

/**
 * Get a specific system by ID
 * GET /api/v1/homes/:homeId/systems/:systemId
 */
export const getSystemById = async (req, res) => {
  try {
    const { homeId, systemId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const system = await System.findOne({ _id: systemId, homeId })
      .populate('maintenance.serviceHistory');

    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    res.json({
      success: true,
      data: system
    });
  } catch (error) {
    console.error('Error fetching system:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system'
    });
  }
};

/**
 * Update a system
 * PATCH /api/v1/homes/:homeId/systems/:systemId
 */
export const updateSystem = async (req, res) => {
  try {
    const { homeId, systemId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const system = await System.findOne({ _id: systemId, homeId });
    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        system[key] = req.body[key];
      }
    });

    // Recalculate next service due if maintenance data changed
    if (req.body.maintenance) {
      system.maintenance.nextServiceDue = system.calculateNextServiceDue();
    }

    await system.save();

    res.json({
      success: true,
      data: system
    });
  } catch (error) {
    console.error('Error updating system:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update system'
    });
  }
};

/**
 * Delete a system
 * DELETE /api/v1/homes/:homeId/systems/:systemId
 */
export const deleteSystem = async (req, res) => {
  try {
    const { homeId, systemId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const system = await System.findOne({ _id: systemId, homeId });
    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    // Soft delete by setting status to 'decommissioned'
    system.status = 'decommissioned';
    await system.save();

    // Or hard delete if preferred:
    // await System.deleteOne({ _id: systemId });

    res.json({
      success: true,
      message: 'System deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting system:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete system'
    });
  }
};

/**
 * Get systems with maintenance due
 * GET /api/v1/homes/:homeId/systems/maintenance/due
 */
export const getMaintenanceDue = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { daysAhead = 7 } = req.query;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const systems = await System.findMaintenanceDue(homeId, parseInt(daysAhead));

    // Categorize by urgency
    const now = new Date();
    const categorized = {
      overdue: [],
      dueThisWeek: [],
      dueThisMonth: []
    };

    systems.forEach(system => {
      const daysUntilDue = Math.floor(
        (new Date(system.maintenance.nextServiceDue) - now) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilDue < 0) {
        categorized.overdue.push(system);
      } else if (daysUntilDue <= 7) {
        categorized.dueThisWeek.push(system);
      } else {
        categorized.dueThisMonth.push(system);
      }
    });

    res.json({
      success: true,
      data: {
        all: systems,
        categorized,
        count: systems.length
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance due:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch maintenance due systems'
    });
  }
};

/**
 * Get systems with expiring warranties
 * GET /api/v1/homes/:homeId/systems/warranty/expiring
 */
export const getExpiringWarranties = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { daysAhead = 90 } = req.query;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const systems = await System.findExpiringWarranties(homeId, parseInt(daysAhead));

    // Categorize by urgency
    const now = new Date();
    const categorized = {
      expired: [],
      expiring30Days: [],
      expiring60Days: [],
      expiring90Days: []
    };

    systems.forEach(system => {
      const daysUntilExpiry = Math.floor(
        (new Date(system.warranty.endDate) - now) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0) {
        categorized.expired.push(system);
      } else if (daysUntilExpiry <= 30) {
        categorized.expiring30Days.push(system);
      } else if (daysUntilExpiry <= 60) {
        categorized.expiring60Days.push(system);
      } else {
        categorized.expiring90Days.push(system);
      }
    });

    res.json({
      success: true,
      data: {
        all: systems,
        categorized,
        count: systems.length
      }
    });
  } catch (error) {
    console.error('Error fetching expiring warranties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expiring warranties'
    });
  }
};

/**
 * Update fuel level for propane/oil tanks
 * PATCH /api/v1/homes/:homeId/systems/:systemId/fuel-level
 */
export const updateFuelLevel = async (req, res) => {
  try {
    const { homeId, systemId } = req.params;
    const { level, fillAmount, pricePerLiter } = req.body;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const system = await System.findOne({ _id: systemId, homeId });
    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    // Validate this is a fuel storage system
    if (system.category !== 'fuel-storage') {
      return res.status(400).json({
        success: false,
        error: 'This system is not a fuel storage system'
      });
    }

    await system.updateFuelLevel(level, fillAmount, pricePerLiter);

    // Check if reorder needed
    const needsReorder = system.needsFuelReorder();

    res.json({
      success: true,
      data: system,
      needsReorder
    });
  } catch (error) {
    console.error('Error updating fuel level:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update fuel level'
    });
  }
};

/**
 * Generate QR code for system
 * POST /api/v1/homes/:homeId/systems/:systemId/qr-code
 */
export const generateQRCode = async (req, res) => {
  try {
    const { homeId, systemId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const system = await System.findOne({ _id: systemId, homeId });
    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    // Generate unique code
    const qrCodeData = `furnacelog://system/${systemId}`;
    const qrCodeImage = await generateQRCodeImage(qrCodeData);

    // Upload to storage
    const qrCodeUrl = await uploadToStorage(
      qrCodeImage,
      `qr-codes/systems/${systemId}.png`,
      'image/png'
    );

    // Update system
    system.qrCode = {
      code: systemId,
      generated: true,
      generatedAt: new Date(),
      url: qrCodeUrl
    };

    await system.save();

    res.json({
      success: true,
      data: {
        qrCode: system.qrCode
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
};

/**
 * Upload photos for system
 * POST /api/v1/homes/:homeId/systems/:systemId/photos
 */
export const uploadPhotos = async (req, res) => {
  try {
    const { homeId, systemId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const system = await System.findOne({ _id: systemId, homeId });
    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    // Handle file upload (implementation depends on upload middleware)
    // This is a placeholder - actual implementation would use multer or similar
    const { photos } = req.body; // Array of { url, caption }

    if (photos && Array.isArray(photos)) {
      photos.forEach(photo => {
        system.photos.push({
          url: photo.url,
          caption: photo.caption || '',
          uploadedAt: new Date()
        });
      });

      await system.save();
    }

    res.json({
      success: true,
      data: system
    });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photos'
    });
  }
};
