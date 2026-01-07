import React from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Alert {
  id: string;
  type: 'overdue' | 'weather' | 'system' | 'urgent';
  title: string;
  message: string;
  priority: 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
}

interface CriticalAlertsBannerProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  className?: string;
}

/**
 * CriticalAlertsBanner Component
 * Displays urgent, impossible-to-miss alerts at the top of the dashboard
 */
export const CriticalAlertsBanner: React.FC<CriticalAlertsBannerProps> = ({
  alerts,
  onDismiss,
  className
}) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  // Show only the most critical alert (can be expanded to show multiple)
  const primaryAlert = alerts[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-gradient-to-r from-warm-coral via-warm-orange to-burnt-sienna p-6 rounded-2xl shadow-lg border-2 border-warm-coral/50 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`
          }} />
        </div>

        <div className="relative flex items-start gap-4">
          {/* Alert Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
            </div>
          </div>

          {/* Alert Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  {primaryAlert.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {primaryAlert.message}
                </p>

                {/* Multiple alerts indicator */}
                {alerts.length > 1 && (
                  <p className="text-white/75 text-xs mt-2">
                    +{alerts.length - 1} more {alerts.length === 2 ? 'alert' : 'alerts'}
                  </p>
                )}
              </div>

              {/* Dismiss button (desktop) */}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(primaryAlert.id)}
                  className="hidden md:flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors flex-shrink-0"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {primaryAlert.onAction && primaryAlert.actionLabel && (
                <button
                  onClick={primaryAlert.onAction}
                  className="px-6 py-2.5 bg-white text-burnt-sienna font-semibold text-sm rounded-xl hover:bg-warm-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {primaryAlert.actionLabel}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Dismiss button (mobile) */}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(primaryAlert.id)}
                  className="md:hidden px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium text-sm rounded-xl transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertsBanner;
