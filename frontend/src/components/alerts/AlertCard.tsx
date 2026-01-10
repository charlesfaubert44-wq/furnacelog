/**
 * AlertCard Component
 * Renders an individual alert with actions and metadata
 */

import { useState } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  Cloud,
  DollarSign,
  Calendar,
  X,
  Clock,
  Home,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertAction } from '@/hooks/useAlerts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AlertCardProps {
  alert: Alert;
  onAction: (alert: Alert, action: AlertAction) => void;
  onDismiss: (alertId: string) => void;
  onSnooze: (alertId: string, days: number) => void;
  onView?: (alertId: string) => void;
}

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'weather':
      return <Cloud className="h-5 w-5" />;
    case 'warranty':
      return <AlertCircle className="h-5 w-5" />;
    case 'maintenance-overdue':
      return <Calendar className="h-5 w-5" />;
    case 'cost-anomaly':
      return <DollarSign className="h-5 w-5" />;
    case 'system-failure':
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const getPriorityColors = (priority: Alert['priority']) => {
  switch (priority) {
    case 'critical':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
      };
    case 'high':
      return {
        border: 'border-l-orange-500',
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700',
      };
    case 'medium':
      return {
        border: 'border-l-yellow-500',
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-700',
      };
    case 'low':
      return {
        border: 'border-l-blue-500',
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      };
  }
};

export function AlertCard({
  alert,
  onAction,
  onDismiss,
  onSnooze,
  onView,
}: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = getPriorityColors(alert.priority);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    if (!alert.read && onView) {
      onView(alert.id);
    }
  };

  const handleAction = (action: AlertAction, e: React.MouseEvent) => {
    e.stopPropagation();
    onAction(alert, action);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss(alert.id);
  };

  const handleSnooze = (days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onSnooze(alert.id, days);
  };

  return (
    <Card
      className={cn(
        'border-l-4 cursor-pointer transition-all hover:shadow-md',
        colors.border,
        colors.bg,
        !alert.read && 'ring-2 ring-offset-2 ring-primary/20'
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div className={cn('mt-0.5', colors.icon)}>
              {getAlertIcon(alert.type)}
            </div>

            {/* Title and metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base font-semibold">
                  {alert.title}
                </CardTitle>
                {!alert.read && (
                  <div className="h-2 w-2 bg-primary rounded-full" />
                )}
              </div>

              {/* Priority badge */}
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  colors.badge
                )}>
                  {alert.priority.toUpperCase()}
                </span>

                {/* Timestamp */}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(parseISO(alert.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          {/* Dismiss and snooze menu */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e: React.MouseEvent) => handleSnooze(1, e)}>
                  Snooze 1 day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e: React.MouseEvent) => handleSnooze(3, e)}>
                  Snooze 3 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e: React.MouseEvent) => handleSnooze(7, e)}>
                  Snooze 1 week
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Message */}
        <p className="text-sm text-gray-700">{alert.message}</p>

        {/* Related system(s) */}
        {(alert.systemId || alert.systemIds) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            <span>
              Related system{(alert.systemIds?.length ?? 0) > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Weather-specific metadata */}
        {alert.type === 'weather' && alert.metadata?.temperature && (
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700 bg-blue-100 rounded px-3 py-2">
            <Cloud className="h-4 w-4" />
            <span>Temperature: {alert.metadata.temperature}°C</span>
          </div>
        )}

        {/* Maintenance overdue metadata */}
        {alert.type === 'maintenance-overdue' && alert.metadata?.daysOverdue && (
          <div className="flex items-center gap-2 text-sm font-medium text-orange-700 bg-orange-100 rounded px-3 py-2">
            <Calendar className="h-4 w-4" />
            <span>Overdue by {alert.metadata.daysOverdue} days</span>
          </div>
        )}

        {/* Warranty expiration metadata */}
        {alert.type === 'warranty' && alert.metadata?.expiryDate && (
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded px-3 py-2">
            <CheckCircle className="h-4 w-4" />
            <span>
              Expires: {format(parseISO(alert.metadata.expiryDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}

        {/* Cost anomaly metadata */}
        {alert.type === 'cost-anomaly' && alert.metadata?.amount && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 bg-red-100 rounded px-3 py-2">
            <DollarSign className="h-4 w-4" />
            <span>
              ${alert.metadata.amount.toFixed(2)}
              {alert.metadata.percentIncrease && (
                <span className="ml-2">
                  ({alert.metadata.percentIncrease > 0 ? '+' : ''}
                  {alert.metadata.percentIncrease}% vs average)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Actions */}
        {alert.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {alert.actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={index === 0 ? 'default' : 'outline'}
                onClick={(e) => handleAction(action, e)}
                className={cn(
                  index === 0 && 'bg-primary hover:bg-primary/90'
                )}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Expiration notice */}
        {alert.expiresAt && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Auto-expires {formatDistanceToNow(parseISO(alert.expiresAt), { addSuffix: true })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
