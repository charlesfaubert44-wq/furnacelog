/**
 * useWebSocket Hook
 * Manages WebSocket connection for real-time sensor updates
 * Part of IoT Integration - Phase 1
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SensorReading {
  sensorId: string;
  type: string;
  value: any;
  unit?: string;
  timestamp: Date;
  battery?: number;
}

interface Alert {
  sensor: {
    id: string;
    name: string;
    type: string;
    location?: string;
  };
  severity: 'info' | 'warning' | 'critical';
  message: string;
  currentValue: any;
}

interface WebSocketMessage {
  type: 'connected' | 'sensor-reading' | 'alert' | 'sensor-status' | 'pong';
  data?: any;
  timestamp: Date;
}

export function useWebSocket() {
  const { user, tokens } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastReading, setLastReading] = useState<SensorReading | null>(null);
  const [lastAlert, setLastAlert] = useState<Alert | null>(null);

  // Callbacks for sensor readings and alerts
  const readingCallbacksRef = useRef<Set<(reading: SensorReading) => void>>(new Set());
  const alertCallbacksRef = useRef<Set<(alert: Alert) => void>>(new Set());

  const connect = useCallback(() => {
    if (!tokens?.accessToken) {
      console.warn('Cannot connect WebSocket: No auth token');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const wsUrl = apiUrl.replace('http', 'ws');
    const url = `${wsUrl}/ws/sensors?token=${encodeURIComponent(tokens.accessToken)}`;

    console.log('Connecting to WebSocket...', wsUrl);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'connected':
            console.log('WebSocket handshake complete');
            break;

          case 'sensor-reading':
            const reading = message.data as SensorReading;
            setLastReading(reading);

            // Notify all reading callbacks
            readingCallbacksRef.current.forEach(callback => {
              try {
                callback(reading);
              } catch (error) {
                console.error('Error in reading callback:', error);
              }
            });
            break;

          case 'alert':
            const alert = message.data as Alert;
            setLastAlert(alert);

            // Notify all alert callbacks
            alertCallbacksRef.current.forEach(callback => {
              try {
                callback(alert);
              } catch (error) {
                console.error('Error in alert callback:', error);
              }
            });
            break;

          case 'sensor-status':
            console.log('Sensor status update:', message.data);
            break;

          case 'pong':
            // Heartbeat response
            break;

          default:
            console.warn('Unknown WebSocket message type:', message.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      wsRef.current = null;

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (tokens?.accessToken) {
          connect();
        }
      }, 5000);
    };
  }, [tokens?.accessToken]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const subscribe = useCallback((sensorIds: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        sensorIds
      }));
    }
  }, []);

  const onReading = useCallback((callback: (reading: SensorReading) => void) => {
    readingCallbacksRef.current.add(callback);

    // Return cleanup function
    return () => {
      readingCallbacksRef.current.delete(callback);
    };
  }, []);

  const onAlert = useCallback((callback: (alert: Alert) => void) => {
    alertCallbacksRef.current.add(callback);

    // Return cleanup function
    return () => {
      alertCallbacksRef.current.delete(callback);
    };
  }, []);

  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    isConnected,
    lastReading,
    lastAlert,
    onReading,
    onAlert,
    subscribe,
    disconnect
  };
}
