/**
 * Maintenance Controller
 * Handles all maintenance-related operations
 * E5-T3, E5-T4, E5-T7, E5-T9
 */

import MaintenanceTask from '../models/MaintenanceTask.js';
import ScheduledMaintenance from '../models/ScheduledMaintenance.js';
import MaintenanceLog from '../models/MaintenanceLog.js';
import SeasonalChecklist from '../models/SeasonalChecklist.js';

// ============================================================================
// TASK LIBRARY ENDPOINTS (E5-T3)
// ============================================================================

/**
 * GET /api/v1/maintenance/tasks/library
 * Get maintenance tasks from library with filtering
 */
export const getTaskLibrary = async (req, res) => {
  try {
    const {
      category,
      system,
      difficulty,
      search,
      homeType,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    // Build filter query
    if (category) query.category = category;
    if (system) query.applicableSystems = system;
    if (difficulty) query['execution.difficultyLevel'] = difficulty;
    if (homeType) query.applicableHomeTypes = homeType;

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const tasks = await MaintenanceTask.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await MaintenanceTask.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task library',
      message: error.message
    });
  }
};

/**
 * GET /api/v1/maintenance/tasks/library/:taskId
 * Get single task details from library
 */
export const getTaskDetail = async (req, res) => {
  try {
    const task = await MaintenanceTask.findById(req.params.taskId)
      .populate('relatedTasks', 'name description category');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task details',
      message: error.message
    });
  }
};

/**
 * POST /api/v1/maintenance/tasks/custom
 * Create custom maintenance task
 */
export const createCustomTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      isBuiltIn: false,
      createdBy: req.user._id
    };

    const task = await MaintenanceTask.create(taskData);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create custom task',
      message: error.message
    });
  }
};

// ============================================================================
// SCHEDULED MAINTENANCE ENDPOINTS (E5-T4)
// ============================================================================

/**
 * POST /api/v1/maintenance/tasks
 * Schedule a maintenance task
 */
export const scheduleTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      homeId: req.body.homeId || req.params.homeId
    };

    // Validate home ownership
    // TODO: Add ownership check middleware

    const scheduledTask = await ScheduledMaintenance.create(taskData);

    res.status(201).json({
      success: true,
      data: scheduledTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to schedule task',
      message: error.message
    });
  }
};

/**
 * GET /api/v1/maintenance/tasks/scheduled
 * Get scheduled maintenance tasks with filters
 */
export const getScheduledTasks = async (req, res) => {
  try {
    const {
      homeId,
      systemId,
      status,
      startDate,
      endDate,
      priority
    } = req.query;

    const query = {};

    if (homeId) query.homeId = homeId;
    if (systemId) query.systemId = systemId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Date range filter
    if (startDate || endDate) {
      query['scheduling.dueDate'] = {};
      if (startDate) query['scheduling.dueDate'].$gte = new Date(startDate);
      if (endDate) query['scheduling.dueDate'].$lte = new Date(endDate);
    }

    const tasks = await ScheduledMaintenance.find(query)
      .populate('taskId', 'name description category execution')
      .populate('systemId', 'name type')
      .populate('providerId', 'businessName phone')
      .sort({ 'scheduling.dueDate': 1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scheduled tasks',
      message: error.message
    });
  }
};

/**
 * GET /api/v1/maintenance/tasks/scheduled/:taskId
 * Get single scheduled task
 */
export const getScheduledTask = async (req, res) => {
  try {
    const task = await ScheduledMaintenance.findById(req.params.taskId)
      .populate('taskId')
      .populate('systemId')
      .populate('componentId')
      .populate('providerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Scheduled task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scheduled task',
      message: error.message
    });
  }
};

/**
 * PATCH /api/v1/maintenance/tasks/scheduled/:taskId
 * Update scheduled task
 */
export const updateScheduledTask = async (req, res) => {
  try {
    const task = await ScheduledMaintenance.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Scheduled task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update scheduled task',
      message: error.message
    });
  }
};

/**
 * DELETE /api/v1/maintenance/tasks/scheduled/:taskId
 * Delete scheduled task
 */
export const deleteScheduledTask = async (req, res) => {
  try {
    const task = await ScheduledMaintenance.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Scheduled task not found'
      });
    }

    res.json({
      success: true,
      message: 'Scheduled task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete scheduled task',
      message: error.message
    });
  }
};

/**
 * POST /api/v1/maintenance/tasks/scheduled/:taskId/complete
 * Mark task as complete and optionally create log
 */
export const completeScheduledTask = async (req, res) => {
  try {
    const task = await ScheduledMaintenance.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Scheduled task not found'
      });
    }

    task.status = 'completed';
    task.completedAt = new Date();

    // If log data provided, create maintenance log
    if (req.body.logData) {
      const log = await MaintenanceLog.create({
        ...req.body.logData,
        scheduledMaintenanceId: task._id,
        homeId: task.homeId,
        systemId: task.systemId,
        componentId: task.componentId
      });

      task.completedLogId = log._id;
    }

    // Generate next occurrence if recurring
    if (task.scheduling.recurrence.type !== 'none') {
      const nextDueDate = task.generateNextOccurrence();
      if (nextDueDate) {
        await ScheduledMaintenance.create({
          homeId: task.homeId,
          systemId: task.systemId,
          componentId: task.componentId,
          taskId: task.taskId,
          customTaskName: task.customTaskName,
          scheduling: {
            dueDate: nextDueDate,
            recurrence: task.scheduling.recurrence
          },
          priority: task.priority,
          assignedTo: task.assignedTo,
          providerId: task.providerId,
          reminders: task.reminders.map(r => ({ ...r, sent: false, sentAt: null }))
        });
      }
    }

    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to complete task',
      message: error.message
    });
  }
};

// ============================================================================
// MAINTENANCE LOGGING ENDPOINTS (E5-T7)
// ============================================================================

/**
 * POST /api/v1/maintenance/logs
 * Create maintenance log entry
 */
export const createMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.create(req.body);

    // If this log completes a scheduled task, update it
    if (req.body.scheduledMaintenanceId) {
      await ScheduledMaintenance.findByIdAndUpdate(
        req.body.scheduledMaintenanceId,
        {
          status: 'completed',
          completedAt: new Date(),
          completedLogId: log._id
        }
      );
    }

    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create maintenance log',
      message: error.message
    });
  }
};

/**
 * GET /api/v1/maintenance/logs
 * Get maintenance logs with filters
 */
export const getMaintenanceLogs = async (req, res) => {
  try {
    const {
      homeId,
      systemId,
      startDate,
      endDate,
      performedBy,
      providerId,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (homeId) query.homeId = homeId;
    if (systemId) query.systemId = systemId;
    if (performedBy) query['execution.performedBy'] = performedBy;
    if (providerId) query['execution.providerId'] = providerId;

    // Date range filter
    if (startDate || endDate) {
      query['execution.date'] = {};
      if (startDate) query['execution.date'].$gte = new Date(startDate);
      if (endDate) query['execution.date'].$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const logs = await MaintenanceLog.find(query)
      .populate('taskPerformed.taskId', 'name category')
      .populate('systemId', 'name type')
      .populate('execution.providerId', 'businessName')
      .sort({ 'execution.date': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MaintenanceLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch maintenance logs',
      message: error.message
    });
  }
};

/**
 * GET /api/v1/maintenance/logs/:logId
 * Get single maintenance log
 */
export const getMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.logId)
      .populate('taskPerformed.taskId')
      .populate('systemId')
      .populate('componentId')
      .populate('execution.providerId')
      .populate('scheduledMaintenanceId');

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Maintenance log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch maintenance log',
      message: error.message
    });
  }
};

// ============================================================================
// SEASONAL CHECKLIST ENDPOINTS (E5-T9)
// ============================================================================

/**
 * GET /api/v1/maintenance/checklists/seasonal
 * Get seasonal checklists for a home
 */
export const getSeasonalChecklists = async (req, res) => {
  try {
    const { homeId, season, year } = req.query;

    const query = {};
    if (homeId) query.homeId = homeId;
    if (season) query.season = season;
    if (year) query.year = parseInt(year);

    const checklists = await SeasonalChecklist.find(query)
      .populate('items.taskId', 'name description execution')
      .sort({ year: -1, season: 1 });

    res.json({
      success: true,
      data: checklists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seasonal checklists',
      message: error.message
    });
  }
};

/**
 * POST /api/v1/maintenance/checklists/seasonal
 * Generate seasonal checklist for home
 */
export const generateSeasonalChecklist = async (req, res) => {
  try {
    const { homeId, season, year } = req.body;

    // Check if checklist already exists
    const existing = await SeasonalChecklist.findOne({ homeId, season, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Checklist already exists for this season/year'
      });
    }

    const checklist = await SeasonalChecklist.generateFromTemplate(homeId, season, year);

    res.status(201).json({
      success: true,
      data: checklist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to generate seasonal checklist',
      message: error.message
    });
  }
};

/**
 * PATCH /api/v1/maintenance/checklists/seasonal/:checklistId/item/:itemId
 * Update checklist item status
 */
export const updateChecklistItem = async (req, res) => {
  try {
    const { checklistId, itemId } = req.params;
    const { status, notes } = req.body;

    const checklist = await SeasonalChecklist.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        error: 'Checklist not found'
      });
    }

    const item = checklist.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Checklist item not found'
      });
    }

    item.status = status;
    if (notes) item.notes = notes;
    if (status === 'completed') item.completedAt = new Date();

    await checklist.save();

    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update checklist item',
      message: error.message
    });
  }
};
