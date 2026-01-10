/**
 * AlertsPanel Component
 * Main panel for displaying and managing alerts with filtering
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Filter, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlerts, Alert, AlertAction } from '@/hooks/useAlerts';
import { AlertCard } from './AlertCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low';
type AlertTypeFilter = 'all' | 'weather' | 'warranty' | 'maintenance-overdue' | 'cost-anomaly' | 'system-failure';

interface AlertsPanelProps {
  className?: string;
  onActionTaken?: (action: string) => void;
}

export function AlertsPanel({ className, onActionTaken }: AlertsPanelProps) {
  const navigate = useNavigate();
  const {
    alerts,
    unreadCount,
    isConnected,
    isLoading,
    viewAlert,
    dismissAlert,
    snoozeAlert,
    dismissAllAlerts,
    isDismissing,
  } = useAlerts();

  const [priorityFilter, setPriorityFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<AlertTypeFilter>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(a => a.priority === priorityFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }

    // Filter by unread status
    if (showOnlyUnread) {
      filtered = filtered.filter(a => !a.read);
    }

    // Sort by priority and date
    return filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDiff !== 0) return priorityDiff;

      // Sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [alerts, priorityFilter, typeFilter, showOnlyUnread]);

  // Get counts by priority
  const priorityCounts = useMemo(() => {
    return {
      all: alerts.length,
      critical: alerts.filter(a => a.priority === 'critical').length,
      high: alerts.filter(a => a.priority === 'high').length,
      medium: alerts.filter(a => a.priority === 'medium').length,
      low: alerts.filter(a => a.priority === 'low').length,
    };
  }, [alerts]);

  // Handle alert actions
  const handleAction = (alert: Alert, action: AlertAction) => {
    switch (action.action) {
      case 'quick-log':
        // Open quick log modal with pre-filled data
        window.dispatchEvent(new CustomEvent('open-quick-log', {
          detail: {
            systemId: action.systemId,
            taskType: action.taskType,
          },
        }));
        onActionTaken?.('quick-log');
        break;

      case 'schedule-task':
        // Open schedule task modal
        window.dispatchEvent(new CustomEvent('open-schedule-task', {
          detail: {
            systemId: action.systemId,
          },
        }));
        onActionTaken?.('schedule-task');
        break;

      case 'contact-contractor':
        // Navigate to contractors page or open contact modal
        if (action.contractorId) {
          navigate(`/contractors/${action.contractorId}`);
        } else if (action.specialty) {
          navigate(`/contractors?specialty=${action.specialty}`);
        } else {
          navigate('/contractors');
        }
        onActionTaken?.('contact-contractor');
        break;

      case 'navigate':
        if (action.path) {
          navigate(action.path);
        }
        onActionTaken?.('navigate');
        break;

      case 'external-link':
        if (action.url) {
          window.open(action.url, '_blank');
        }
        onActionTaken?.('external-link');
        break;

      case 'bulk-log':
        // Open bulk log modal
        window.dispatchEvent(new CustomEvent('open-bulk-log', {
          detail: {
            systemIds: action.systemIds,
          },
        }));
        onActionTaken?.('bulk-log');
        break;

      case 'reschedule':
        // Open reschedule modal
        window.dispatchEvent(new CustomEvent('open-reschedule', {
          detail: {
            taskId: action.taskId,
          },
        }));
        onActionTaken?.('reschedule');
        break;

      case 'snooze':
        if (action.duration) {
          snoozeAlert(alert.id, action.duration);
        }
        onActionTaken?.('snooze');
        break;

      case 'dismiss':
        dismissAlert(alert.id);
        onActionTaken?.('dismiss');
        break;

      default:
        console.warn('Unknown action:', action.action);
    }
  };

  // Handle dismiss all
  const handleDismissAll = () => {
    if (window.confirm('Are you sure you want to dismiss all alerts?')) {
      dismissAllAlerts();
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Alerts</h2>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? (
                    <span>{unreadCount} unread</span>
                  ) : (
                    <span>All caught up!</span>
                  )}
                </p>
              </div>
            </div>

            {/* Connection status */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                )}
                title={isConnected ? 'Connected' : 'Disconnected'}
              />
              {alerts.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissAll}
                  disabled={isDismissing}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Priority filter tabs */}
          <Tabs value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as FilterType)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All ({priorityCounts.all})
              </TabsTrigger>
              <TabsTrigger value="critical" className="flex-1">
                Critical ({priorityCounts.critical})
              </TabsTrigger>
              <TabsTrigger value="high" className="flex-1">
                High ({priorityCounts.high})
              </TabsTrigger>
              <TabsTrigger value="medium" className="flex-1">
                Medium ({priorityCounts.medium})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Additional filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AlertTypeFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="warranty">Warranty</SelectItem>
                <SelectItem value="maintenance-overdue">Maintenance</SelectItem>
                <SelectItem value="cost-anomaly">Cost Anomaly</SelectItem>
                <SelectItem value="system-failure">System Failure</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showOnlyUnread ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
            >
              Unread Only
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredAlerts.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <Bell className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {showOnlyUnread ? 'No unread alerts' : 'No alerts'}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {showOnlyUnread
                ? 'You\'re all caught up! Check back later for new alerts.'
                : priorityFilter === 'all' && typeFilter === 'all'
                ? 'When important events occur, you\'ll see alerts here.'
                : 'No alerts match your current filters. Try adjusting them.'}
            </p>
          </div>
        ) : (
          // Alerts grid
          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAction={handleAction}
                onDismiss={dismissAlert}
                onSnooze={snoozeAlert}
                onView={viewAlert}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
