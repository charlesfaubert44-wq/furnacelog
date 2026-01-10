/**
 * AlertsDropdown Component
 * Compact dropdown for displaying recent alerts in the header with badge
 */

import { useState } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAlerts, Alert, AlertAction } from '@/hooks/useAlerts';
import { AlertCard } from './AlertCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface AlertsDropdownProps {
  maxAlerts?: number;
}

export function AlertsDropdown({ maxAlerts = 5 }: AlertsDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const {
    alerts,
    unreadCount,
    isConnected,
    viewAlert,
    dismissAlert,
    snoozeAlert,
  } = useAlerts();

  // Get recent alerts (sorted by priority and date)
  const recentAlerts = alerts
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, maxAlerts);

  // Handle alert actions
  const handleAction = (alert: Alert, action: AlertAction) => {
    setIsOpen(false); // Close dropdown when action is taken

    switch (action.action) {
      case 'quick-log':
        window.dispatchEvent(new CustomEvent('open-quick-log', {
          detail: {
            systemId: action.systemId,
            taskType: action.taskType,
          },
        }));
        break;

      case 'schedule-task':
        window.dispatchEvent(new CustomEvent('open-schedule-task', {
          detail: {
            systemId: action.systemId,
          },
        }));
        break;

      case 'contact-contractor':
        if (action.contractorId) {
          navigate(`/contractors/${action.contractorId}`);
        } else if (action.specialty) {
          navigate(`/contractors?specialty=${action.specialty}`);
        } else {
          navigate('/contractors');
        }
        break;

      case 'navigate':
        if (action.path) {
          navigate(action.path);
        }
        break;

      case 'external-link':
        if (action.url) {
          window.open(action.url, '_blank');
        }
        break;

      case 'bulk-log':
        window.dispatchEvent(new CustomEvent('open-bulk-log', {
          detail: {
            systemIds: action.systemIds,
          },
        }));
        break;

      case 'reschedule':
        window.dispatchEvent(new CustomEvent('open-reschedule', {
          detail: {
            taskId: action.taskId,
          },
        }));
        break;

      case 'snooze':
        if (action.duration) {
          snoozeAlert(alert.id, action.duration);
        }
        break;

      case 'dismiss':
        dismissAlert(alert.id);
        break;
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/alerts');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Alerts${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className={cn(
            'h-5 w-5',
            unreadCount > 0 && 'text-primary animate-pulse'
          )} />

          {/* Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}

          {/* Connection status indicator */}
          {!isConnected && (
            <span
              className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-yellow-500"
              title="Reconnecting..."
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[420px] p-0">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Alerts</h3>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? (
                  <span>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
                ) : (
                  <span>All caught up!</span>
                )}
              </p>
            </div>

            <div
              className={cn(
                'h-2 w-2 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-yellow-500'
              )}
              title={isConnected ? 'Connected' : 'Reconnecting...'}
            />
          </div>
        </div>

        {/* Alerts list */}
        <ScrollArea className="h-[400px]">
          {recentAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm font-medium text-gray-900 mb-1">No alerts</p>
              <p className="text-sm text-muted-foreground">
                You'll be notified when important events occur
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {recentAlerts.map(alert => (
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
        </ScrollArea>

        {/* Footer */}
        {alerts.length > maxAlerts && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={handleViewAll}
              >
                View all {alerts.length} alerts
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
