/**
 * WebSocket Service
 * Handles real-time sensor data broadcasting to frontend clients
 * Part of IoT Integration - Phase 1
 */

import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map of userId -> Set of WebSocket connections
  }

  /**
   * Initialize WebSocket server
   */
  initialize(server) {
    this.wss = new WebSocketServer({
      server,
      path: '/ws/sensors',
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    this.wss.on('error', (error) => {
      logger.error('WebSocket server error:', error);
    });

    logger.info('WebSocket service initialized on /ws/sensors');
  }

  /**
   * Verify client authentication
   */
  verifyClient(info, callback) {
    try {
      // Extract token from URL query parameter
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        callback(false, 401, 'Unauthorized');
        return;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request for later use
      info.req.user = decoded;

      callback(true);

    } catch (error) {
      logger.warn('WebSocket authentication failed:', error.message);
      callback(false, 401, 'Invalid token');
    }
  }

  /**
   * Handle new WebSocket connection
   */
  handleConnection(ws, req) {
    const userId = req.user.userId;
    logger.info(`WebSocket client connected: user=${userId}`);

    // Add client to our clients map
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(ws);

    // Send welcome message
    this.sendToClient(ws, {
      type: 'connected',
      message: 'Connected to FurnaceLog sensor updates',
      timestamp: new Date()
    });

    // Handle client messages
    ws.on('message', (message) => {
      this.handleMessage(ws, userId, message);
    });

    // Handle client disconnect
    ws.on('close', () => {
      logger.info(`WebSocket client disconnected: user=${userId}`);
      const userClients = this.clients.get(userId);
      if (userClients) {
        userClients.delete(ws);
        if (userClients.size === 0) {
          this.clients.delete(userId);
        }
      }
    });

    // Handle errors
    ws.on('error', (error) => {
      logger.error(`WebSocket error for user=${userId}:`, error);
    });
  }

  /**
   * Handle messages from clients
   */
  handleMessage(ws, userId, message) {
    try {
      const data = JSON.parse(message.toString());

      // Handle different message types
      switch (data.type) {
        case 'ping':
          this.sendToClient(ws, { type: 'pong', timestamp: new Date() });
          break;

        case 'subscribe':
          // Client wants to subscribe to specific sensors
          // (Future enhancement: room-based subscriptions)
          logger.debug(`User ${userId} subscribed to sensors:`, data.sensorIds);
          break;

        default:
          logger.warn(`Unknown message type: ${data.type}`);
      }

    } catch (error) {
      logger.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Send message to a specific client
   */
  sendToClient(ws, data) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  /**
   * Broadcast sensor reading to all connected clients for a user
   */
  broadcastSensorReading(userId, sensorData) {
    const userClients = this.clients.get(userId.toString());

    if (!userClients || userClients.size === 0) {
      return; // No connected clients for this user
    }

    const message = {
      type: 'sensor-reading',
      data: sensorData,
      timestamp: new Date()
    };

    userClients.forEach((ws) => {
      this.sendToClient(ws, message);
    });

    logger.debug(`Broadcasted sensor reading to ${userClients.size} clients for user ${userId}`);
  }

  /**
   * Broadcast alert to user's connected clients
   */
  broadcastAlert(userId, alertData) {
    const userClients = this.clients.get(userId.toString());

    if (!userClients || userClients.size === 0) {
      return;
    }

    const message = {
      type: 'alert',
      data: alertData,
      timestamp: new Date()
    };

    userClients.forEach((ws) => {
      this.sendToClient(ws, message);
    });

    logger.info(`Broadcasted alert to ${userClients.size} clients for user ${userId}`);
  }

  /**
   * Broadcast sensor status change (online/offline)
   */
  broadcastSensorStatus(userId, sensorId, status) {
    const userClients = this.clients.get(userId.toString());

    if (!userClients || userClients.size === 0) {
      return;
    }

    const message = {
      type: 'sensor-status',
      data: {
        sensorId,
        status,
        timestamp: new Date()
      }
    };

    userClients.forEach((ws) => {
      this.sendToClient(ws, message);
    });
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const stats = {
      totalConnections: 0,
      userCount: this.clients.size,
      users: []
    };

    this.clients.forEach((connections, userId) => {
      stats.totalConnections += connections.size;
      stats.users.push({
        userId,
        connections: connections.size
      });
    });

    return stats;
  }

  /**
   * Close all connections
   */
  close() {
    if (this.wss) {
      this.wss.clients.forEach((ws) => {
        ws.close();
      });
      this.wss.close();
      logger.info('WebSocket server closed');
    }
  }
}

const websocketService = new WebSocketService();

export default websocketService;
