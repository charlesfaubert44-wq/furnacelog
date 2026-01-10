/**
 * useAlerts Hook
 * Manages real-time alert delivery via WebSocket and provides alert state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

export interface Alert {
  id: string;
  type: 'weather' | 'warranty' | 'maintenance-overdue' | 'cost-anomaly' | 'system-failure';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  systemId?: string;
  systemIds?: string[];
  createdAt: string;
  read: boolean;
  dismissed: boolean;
  snoozedUntil?: string;
  expiresAt?: string;
  actions: AlertAction[];
  metadata?: {
    temperature?: number;
    daysOverdue?: number;
    expiryDate?: string;
    amount?: number;
    percentIncrease?: number;
    taskId?: string;
    contractorId?: string;
    [key: string]: any;
  };
}

export interface AlertAction {
  label: string;
  action: 'quick-log' | 'schedule-task' | 'contact-contractor' | 'navigate' | 'external-link' | 'bulk-log' | 'reschedule' | 'snooze' | 'dismiss';
  systemId?: string;
  systemIds?: string[];
  taskType?: string;
  taskId?: string;
  contractorId?: string;
  specialty?: string;
  path?: string;
  url?: string;
  duration?: number;
}

interface WebSocketMessage {
  type: 'new-alert' | 'alert-updated' | 'alert-dismissed' | 'connection' | 'ping' | 'pong';
  data?: Alert;
  message?: string;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 10;

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const queryClient = useQueryClient();

  // Fetch initial alerts from API
  const { data: initialAlerts, isLoading } = useQuery<{ alerts: Alert[] }>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await api.get('/alerts');
      return response.data;
    },
  });

  // Update alerts when initial data is fetched
  useEffect(() => {
    if (initialAlerts?.alerts) {
      setAlerts(initialAlerts.alerts);
      setUnreadCount(initialAlerts.alerts.filter((a: Alert) => !a.read).length);
    }
  }, [initialAlerts]);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Alerts] WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;

        // Send authentication token if needed
        const token = localStorage.getItem('token');
        if (token) {
          ws.send(JSON.stringify({ type: 'authenticate', token }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'new-alert':
              if (message.data) {
                handleNewAlert(message.data);
              }
              break;

            case 'alert-updated':
              if (message.data) {
                handleAlertUpdated(message.data);
              }
              break;

            case 'alert-dismissed':
              if (message.data?.id) {
                handleAlertDismissed(message.data.id);
              }
              break;

            case 'connection':
              console.log('[Alerts] Server message:', message.message);
              break;

            case 'ping':
              // Respond to ping with pong
              ws.send(JSON.stringify({ type: 'pong' }));
              break;

            default:
              console.log('[Alerts] Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('[Alerts] Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[Alerts] WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('[Alerts] WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`[Alerts] Reconnecting (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, RECONNECT_INTERVAL) as unknown as number;
        } else {
          console.error('[Alerts] Max reconnection attempts reached');
          toast.error('Lost connection to alert system. Please refresh the page.');
        }
      };
    } catch (error) {
      console.error('[Alerts] Failed to create WebSocket:', error);
    }
  }, []);

  // Handle new alert from WebSocket
  const handleNewAlert = useCallback((alert: Alert) => {
    // Add to state
    setAlerts(prev => {
      // Check if alert already exists (deduplicate)
      if (prev.some(a => a.id === alert.id)) {
        return prev;
      }
      return [alert, ...prev];
    });

    setUnreadCount(prev => prev + 1);

    // Show toast notification
    const toastVariant = alert.priority === 'critical' ? 'error' :
                        alert.priority === 'high' ? 'warning' :
                        'default';

    toast[toastVariant === 'error' ? 'error' : toastVariant === 'warning' ? 'warning' : 'info'](alert.title, {
      description: alert.message,
      duration: alert.priority === 'critical' ? 10000 : 5000,
    });

    // Play notification sound (if enabled)
    playNotificationSound(alert.priority);

    // Request browser notification permission and send
    if (Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/logo.png',
        tag: alert.id,
        requireInteraction: alert.priority === 'critical',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(alert.title, {
            body: alert.message,
            icon: '/logo.png',
            tag: alert.id,
          });
        }
      });
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  }, [queryClient]);

  // Handle alert updated from WebSocket
  const handleAlertUpdated = useCallback((updatedAlert: Alert) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === updatedAlert.id ? updatedAlert : alert
      )
    );
  }, []);

  // Handle alert dismissed from WebSocket
  const handleAlertDismissed = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Play notification sound
  const playNotificationSound = (priority: Alert['priority']) => {
    const soundEnabled = localStorage.getItem('notificationSoundEnabled') !== 'false';
    if (!soundEnabled) return;

    try {
      const audio = new Audio(
        priority === 'critical' ? '/sounds/alert-critical.mp3' :
        priority === 'high' ? '/sounds/alert-high.mp3' :
        '/sounds/alert-default.mp3'
      );
      audio.volume = 0.5;
      audio.play().catch(err => {
        console.log('[Alerts] Could not play sound:', err);
      });
    } catch (error) {
      console.error('[Alerts] Error playing notification sound:', error);
    }
  };

  // Mark alert as read
  const markAsRead = useCallback(async (alertId: string) => {
    try {
      await api.patch(`/alerts/${alertId}/read`);

      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('[Alerts] Failed to mark as read:', error);
      toast.error('Failed to mark alert as read');
    }
  }, []);

  // Dismiss alert mutation
  const dismissMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await api.patch(`/alerts/${alertId}/dismiss`);
      return response.data;
    },
    onSuccess: (_, alertId) => {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      setUnreadCount(prev => {
        const alert = alerts.find(a => a.id === alertId);
        return alert && !alert.read ? Math.max(0, prev - 1) : prev;
      });
      toast.success('Alert dismissed');
    },
    onError: () => {
      toast.error('Failed to dismiss alert');
    },
  });

  // Snooze alert mutation
  const snoozeMutation = useMutation({
    mutationFn: async ({ alertId, days }: { alertId: string; days: number }) => {
      const response = await api.patch(`/alerts/${alertId}/snooze`, { days });
      return response.data;
    },
    onSuccess: (_, { alertId, days }) => {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      setUnreadCount(prev => {
        const alert = alerts.find(a => a.id === alertId);
        return alert && !alert.read ? Math.max(0, prev - 1) : prev;
      });
      toast.success(`Alert snoozed for ${days} day${days !== 1 ? 's' : ''}`);
    },
    onError: () => {
      toast.error('Failed to snooze alert');
    },
  });

  // Dismiss all alerts mutation
  const dismissAllMutation = useMutation({
    mutationFn: async (priority?: Alert['priority']) => {
      const response = await api.post('/alerts/dismiss-all', { priority });
      return response.data;
    },
    onSuccess: (_, priority) => {
      if (priority) {
        setAlerts(prev => prev.filter(a => a.priority !== priority));
      } else {
        setAlerts([]);
        setUnreadCount(0);
      }
      toast.success('All alerts dismissed');
    },
    onError: () => {
      toast.error('Failed to dismiss alerts');
    },
  });

  // Connect WebSocket on mount
  useEffect(() => {
    connectWebSocket();

    return () => {
      // Cleanup
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  // Mark alert as read when viewing
  const viewAlert = useCallback((alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.read) {
      markAsRead(alertId);
    }
  }, [alerts, markAsRead]);

  return {
    alerts,
    unreadCount,
    isConnected,
    isLoading,
    viewAlert,
    markAsRead,
    dismissAlert: (alertId: string) => dismissMutation.mutate(alertId),
    snoozeAlert: (alertId: string, days: number) => snoozeMutation.mutate({ alertId, days }),
    dismissAllAlerts: (priority?: Alert['priority']) => dismissAllMutation.mutate(priority),
    isDismissing: dismissMutation.isPending,
    isSnoozing: snoozeMutation.isPending,
  };
}
