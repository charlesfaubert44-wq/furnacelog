/**
 * IoT Routes
 * API endpoints for sensor management and IoT data
 * Part of IoT Integration - Phase 1
 */

import express from 'express';
import {
  getSensors,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorReadings,
  submitSensorData,
  getAlerts,
  acknowledgeAlert,
  getIoTStatus
} from '../controllers/iot.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateHomeOwnership } from '../middleware/ownership.js';

const router = express.Router({ mergeParams: true }); // mergeParams to access :homeId from parent router

// Public endpoint for sensors to submit data (authenticated via sensor ID/key in future)
// POST /api/v1/iot/sensor-data
router.post('/sensor-data', submitSensorData);

// IoT system status (authenticated)
// GET /api/v1/iot/status
router.get('/status', authenticate, getIoTStatus);

// All routes below require authentication and home ownership validation

// Get all sensors for a home
// GET /api/v1/homes/:homeId/sensors
router.get('/', authenticate, validateHomeOwnership, getSensors);

// Create new sensor
// POST /api/v1/homes/:homeId/sensors
router.post('/', authenticate, validateHomeOwnership, createSensor);

// Get single sensor details
// GET /api/v1/homes/:homeId/sensors/:sensorId
router.get('/:sensorId', authenticate, getSensor);

// Update sensor configuration
// PATCH /api/v1/homes/:homeId/sensors/:sensorId
router.patch('/:sensorId', authenticate, updateSensor);

// Delete sensor (soft delete)
// DELETE /api/v1/homes/:homeId/sensors/:sensorId
router.delete('/:sensorId', authenticate, deleteSensor);

// Get sensor readings
// GET /api/v1/homes/:homeId/sensors/:sensorId/readings
router.get('/:sensorId/readings', authenticate, getSensorReadings);

// Get active alerts for home
// GET /api/v1/homes/:homeId/alerts
router.get('/alerts', authenticate, validateHomeOwnership, getAlerts);

// Acknowledge alert
// POST /api/v1/homes/:homeId/alerts/acknowledge
router.post('/alerts/acknowledge', authenticate, validateHomeOwnership, acknowledgeAlert);

export default router;
