/**
 * Template Controller
 * Business logic for system template management
 *
 * Part of Epic E4 - System & Component Tracking (E4-T2)
 */

import {
  getAllTemplates,
  getTemplateById,
  getTemplatesByCategory,
  createFromTemplate
} from '../data/systemTemplates.js';
import System from '../models/System.js';
import Component from '../models/Component.js';
import Home from '../models/Home.js';

/**
 * Get all system templates
 * GET /api/v1/templates/systems
 */
export const getAllTemplatesController = async (req, res) => {
  try {
    const templates = getAllTemplates();

    // Group by category
    const groupedByCategory = templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        templates,
        groupedByCategory,
        count: templates.length
      }
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates'
    });
  }
};

/**
 * Get templates by category
 * GET /api/v1/templates/systems/category/:category
 */
export const getTemplatesByCategoryController = async (req, res) => {
  try {
    const { category } = req.params;

    const templates = getTemplatesByCategory(category);

    res.json({
      success: true,
      data: {
        category,
        templates,
        count: templates.length
      }
    });
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates'
    });
  }
};

/**
 * Get template by ID
 * GET /api/v1/templates/systems/:templateId
 */
export const getTemplateByIdController = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = getTemplateById(templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: templateId,
        ...template
      }
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template'
    });
  }
};

/**
 * Create a system from a template
 * POST /api/v1/templates/systems/:templateId/create
 */
export const createSystemFromTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { homeId, customData = {} } = req.body;
    const userId = req.user.id;

    // Verify home ownership
    const home = await Home.findOne({ _id: homeId, userId });
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found or you do not have permission to access it'
      });
    }

    // Get template and create system data
    const templateResult = createFromTemplate(templateId, customData);
    const { systemData, defaultComponents, recommendedTasks } = templateResult;

    // Create the system
    const system = new System({
      homeId,
      ...systemData
    });

    await system.save();

    // Create default components if requested
    const createdComponents = [];
    if (customData.includeDefaultComponents !== false && defaultComponents.length > 0) {
      for (const compData of defaultComponents) {
        const component = new Component({
          homeId,
          systemId: system._id,
          ...compData
        });

        await component.save();
        createdComponents.push(component);
      }
    }

    res.status(201).json({
      success: true,
      data: {
        system,
        components: createdComponents,
        recommendedTasks
      },
      message: 'System created from template successfully'
    });
  } catch (error) {
    console.error('Error creating system from template:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create system from template'
    });
  }
};
