/**
 * Component Controller
 * Business logic for component management
 *
 * Part of Epic E4 - System & Component Tracking
 */

import Component from '../models/Component.js';
import System from '../models/System.js';
import Home from '../models/Home.js';

/**
 * Create a new component
 * POST /api/v1/homes/:homeId/systems/:systemId/components
 */
export const createComponent = async (req, res) => {
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

    // Verify system exists and belongs to home
    const system = await System.findOne({ _id: systemId, homeId });
    if (!system) {
      return res.status(404).json({
        success: false,
        error: 'System not found'
      });
    }

    // Create component
    const component = new Component({
      homeId,
      systemId,
      ...req.body
    });

    // Calculate next due date
    if (component.replacement.intervalDays) {
      component.replacement.nextDue = component.calculateNextDue();
    }

    await component.save();

    res.status(201).json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create component'
    });
  }
};

/**
 * Get all components for a system
 * GET /api/v1/homes/:homeId/systems/:systemId/components
 */
export const getComponentsBySystem = async (req, res) => {
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

    const components = await Component.findBySystem(systemId);

    res.json({
      success: true,
      data: {
        components,
        count: components.length
      }
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components'
    });
  }
};

/**
 * Get all components for a home
 * GET /api/v1/homes/:homeId/components
 */
export const getComponentsByHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { type, status } = req.query;
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
    if (type) query.type = type;
    if (status) query.status = status;

    const components = await Component.find(query)
      .populate('systemId', 'name category type')
      .sort({ 'replacement.nextDue': 1 });

    res.json({
      success: true,
      data: {
        components,
        count: components.length
      }
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components'
    });
  }
};

/**
 * Get a specific component by ID
 * GET /api/v1/homes/:homeId/components/:componentId
 */
export const getComponentById = async (req, res) => {
  try {
    const { homeId, componentId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const component = await Component.findOne({ _id: componentId, homeId })
      .populate('systemId');

    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Error fetching component:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch component'
    });
  }
};

/**
 * Update a component
 * PATCH /api/v1/homes/:homeId/components/:componentId
 */
export const updateComponent = async (req, res) => {
  try {
    const { homeId, componentId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const component = await Component.findOne({ _id: componentId, homeId });
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        component[key] = req.body[key];
      }
    });

    // Recalculate next due if replacement data changed
    if (req.body.replacement) {
      component.replacement.nextDue = component.calculateNextDue();
    }

    await component.save();

    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update component'
    });
  }
};

/**
 * Delete a component
 * DELETE /api/v1/homes/:homeId/components/:componentId
 */
export const deleteComponent = async (req, res) => {
  try {
    const { homeId, componentId } = req.params;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const component = await Component.findOne({ _id: componentId, homeId });
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    // Soft delete
    component.status = 'inactive';
    await component.save();

    // Or hard delete:
    // await Component.deleteOne({ _id: componentId });

    res.json({
      success: true,
      message: 'Component deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete component'
    });
  }
};

/**
 * Log a component replacement
 * POST /api/v1/homes/:homeId/components/:componentId/replace
 */
export const logReplacement = async (req, res) => {
  try {
    const { homeId, componentId } = req.params;
    const { cost, performer, partSource, maintenanceLogId, notes } = req.body;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const component = await Component.findOne({ _id: componentId, homeId });
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    await component.logReplacement({
      cost,
      performer,
      partSource,
      maintenanceLogId,
      notes
    });

    res.json({
      success: true,
      data: component,
      message: 'Replacement logged successfully'
    });
  } catch (error) {
    console.error('Error logging replacement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log replacement'
    });
  }
};

/**
 * Update component stock quantity
 * PATCH /api/v1/homes/:homeId/components/:componentId/stock
 */
export const updateStock = async (req, res) => {
  try {
    const { homeId, componentId } = req.params;
    const { quantity, isAdd = true } = req.body;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    const component = await Component.findOne({ _id: componentId, homeId });
    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    await component.updateStock(quantity, isAdd);

    const needsReorder = component.needsReorder();

    res.json({
      success: true,
      data: component,
      needsReorder
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update stock'
    });
  }
};

/**
 * Get components due for replacement
 * GET /api/v1/homes/:homeId/components/due/replacement
 */
export const getReplacementDue = async (req, res) => {
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

    const components = await Component.findReplacementDue(homeId, parseInt(daysAhead));

    // Populate system information
    await Component.populate(components, { path: 'systemId', select: 'name category type' });

    // Categorize by urgency
    const now = new Date();
    const categorized = {
      overdue: [],
      dueThisWeek: [],
      dueThisMonth: []
    };

    components.forEach(component => {
      const daysUntilDue = Math.floor(
        (new Date(component.replacement.nextDue) - now) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilDue < 0) {
        categorized.overdue.push(component);
      } else if (daysUntilDue <= 7) {
        categorized.dueThisWeek.push(component);
      } else {
        categorized.dueThisMonth.push(component);
      }
    });

    res.json({
      success: true,
      data: {
        all: components,
        categorized,
        count: components.length
      }
    });
  } catch (error) {
    console.error('Error fetching replacement due components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components due for replacement'
    });
  }
};

/**
 * Get components with low stock
 * GET /api/v1/homes/:homeId/components/stock/low
 */
export const getLowStock = async (req, res) => {
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

    const components = await Component.findLowStock(homeId);

    // Populate system information
    await Component.populate(components, { path: 'systemId', select: 'name category type' });

    // Categorize by stock status
    const categorized = {
      outOfStock: [],
      lowStock: []
    };

    components.forEach(component => {
      if (component.quantity.onHand === 0) {
        categorized.outOfStock.push(component);
      } else {
        categorized.lowStock.push(component);
      }
    });

    res.json({
      success: true,
      data: {
        all: components,
        categorized,
        count: components.length
      }
    });
  } catch (error) {
    console.error('Error fetching low stock components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch low stock components'
    });
  }
};
