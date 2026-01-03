/**
 * Maintenance Routes
 * API routes for Epic E5 - Maintenance Management
 */

import express from 'express';
const router = express.Router();
import * as maintenanceController from '../controllers/maintenanceController.js';

// Middleware (to be implemented)
// const { protect } = require('../middleware/auth');
// const { validateHome } = require('../middleware/validation');

// ============================================================================
// TASK LIBRARY ROUTES (E5-T3)
// ============================================================================

// GET /api/v1/maintenance/tasks/library - Get task library with filters
router.get('/tasks/library', maintenanceController.getTaskLibrary);

// GET /api/v1/maintenance/tasks/library/:taskId - Get task details
router.get('/tasks/library/:taskId', maintenanceController.getTaskDetail);

// POST /api/v1/maintenance/tasks/custom - Create custom task
router.post('/tasks/custom', maintenanceController.createCustomTask);

// ============================================================================
// SCHEDULED MAINTENANCE ROUTES (E5-T4)
// ============================================================================

// POST /api/v1/maintenance/tasks - Schedule a task
router.post('/tasks', maintenanceController.scheduleTask);

// GET /api/v1/maintenance/tasks/scheduled - Get scheduled tasks
router.get('/tasks/scheduled', maintenanceController.getScheduledTasks);

// GET /api/v1/maintenance/tasks/scheduled/:taskId - Get scheduled task
router.get('/tasks/scheduled/:taskId', maintenanceController.getScheduledTask);

// PATCH /api/v1/maintenance/tasks/scheduled/:taskId - Update scheduled task
router.patch('/tasks/scheduled/:taskId', maintenanceController.updateScheduledTask);

// DELETE /api/v1/maintenance/tasks/scheduled/:taskId - Delete scheduled task
router.delete('/tasks/scheduled/:taskId', maintenanceController.deleteScheduledTask);

// POST /api/v1/maintenance/tasks/scheduled/:taskId/complete - Complete task
router.post('/tasks/scheduled/:taskId/complete', maintenanceController.completeScheduledTask);

// ============================================================================
// MAINTENANCE LOGGING ROUTES (E5-T7)
// ============================================================================

// POST /api/v1/maintenance/logs - Create maintenance log
router.post('/logs', maintenanceController.createMaintenanceLog);

// GET /api/v1/maintenance/logs - Get maintenance logs with filters
router.get('/logs', maintenanceController.getMaintenanceLogs);

// GET /api/v1/maintenance/logs/:logId - Get single maintenance log
router.get('/logs/:logId', maintenanceController.getMaintenanceLog);

// ============================================================================
// SEASONAL CHECKLIST ROUTES (E5-T9)
// ============================================================================

// GET /api/v1/maintenance/checklists/seasonal - Get seasonal checklists
router.get('/checklists/seasonal', maintenanceController.getSeasonalChecklists);

// POST /api/v1/maintenance/checklists/seasonal - Generate seasonal checklist
router.post('/checklists/seasonal', maintenanceController.generateSeasonalChecklist);

// PATCH /api/v1/maintenance/checklists/seasonal/:checklistId/item/:itemId - Update checklist item
router.patch(
  '/checklists/seasonal/:checklistId/item/:itemId',
  maintenanceController.updateChecklistItem
);

export default router;
