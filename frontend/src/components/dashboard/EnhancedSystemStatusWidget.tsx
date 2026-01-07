import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SystemStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'healthy' | 'warning' | 'critical';
  lastService: string;
  health: number;
  category: string;
}

interface EnhancedSystemStatusWidgetProps {
  systems: SystemStatus[];
  onSystemClick?: (systemId: string) => void;
  onAddSystem?: () => void;
  onLogMaintenance?: (systemId: string) => void;
}

/**
 * EnhancedSystemStatusWidget Component
 * Displays home systems with health scores and visual indicators
 */
export const EnhancedSystemStatusWidget: React.FC<EnhancedSystemStatusWidgetProps> = ({
  systems,
  onSystemClick,
  onAddSystem,
  onLogMaintenance
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          icon: CheckCircle2,
          iconColor: 'text-sage',
          iconBg: 'bg-gradient-to-br from-sage to-sage/80',
          badge: 'bg-sage/20 text-sage border-sage/30',
          gauge: 'stroke-sage',
          border: 'border-sage/20 hover:border-sage/40'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-warm-orange',
          iconBg: 'bg-gradient-to-br from-warm-orange to-warm-orange/80',
          badge: 'bg-warm-orange/20 text-warm-orange border-warm-orange/30',
          gauge: 'stroke-warm-orange',
          border: 'border-warm-orange/20 hover:border-warm-orange/40'
        };
      default:
        return {
          icon: XCircle,
          iconColor: 'text-warm-coral',
          iconBg: 'bg-gradient-to-br from-warm-coral to-warm-coral/80',
          badge: 'bg-warm-coral/20 text-warm-coral border-warm-coral/30',
          gauge: 'stroke-warm-coral',
          border: 'border-warm-coral/20 hover:border-warm-coral/40'
        };
    }
  };

  return (
    <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-charcoal">System Status</h3>
          <p className="text-sm text-warm-gray mt-1">Monitor your critical home systems</p>
        </div>
        {onAddSystem && (
          <button
            onClick={onAddSystem}
            className="p-2 text-warm-gray hover:text-charcoal hover:bg-cream rounded-lg transition-colors"
            title="Add new system"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-soft-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-soft-amber" />
            </div>
            <p className="text-warm-gray font-medium mb-2">No systems configured yet</p>
            <p className="text-warm-gray/70 text-sm mb-4">Add your home systems to start tracking</p>
            {onAddSystem && (
              <button
                onClick={onAddSystem}
                className="px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add System
              </button>
            )}
          </div>
        ) : (
          systems.map((system) => {
            const config = getStatusConfig(system.status);
            const StatusIcon = config.icon;
            const SystemIcon = system.icon;
            const circumference = 2 * Math.PI * 28;
            const strokeDashoffset = circumference - (system.health / 100) * circumference;

            return (
              <div
                key={system.id}
                className={cn(
                  "group p-5 bg-cream/30 border-2 rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1",
                  config.border
                )}
                onClick={() => onSystemClick?.(system.id)}
              >
                {/* System Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105",
                    config.iconBg
                  )}>
                    <SystemIcon className="w-7 h-7 text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-charcoal line-clamp-1">
                        {system.name}
                      </h4>
                      <StatusIcon className={cn("w-4 h-4 flex-shrink-0", config.iconColor)} />
                    </div>
                    <p className="text-xs text-warm-gray">
                      Last service: {system.lastService}
                    </p>
                  </div>
                </div>

                {/* Health Score and Status */}
                <div className="flex items-center justify-between pt-4 border-t border-soft-amber/20">
                  <div>
                    <p className="text-xs text-warm-gray font-medium uppercase tracking-wide mb-1">
                      Health Score
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-charcoal tabular-nums">
                        {system.health}%
                      </span>
                    </div>
                  </div>

                  {/* Circular Progress */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        {/* Background circle */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#E8DCC4"
                          strokeWidth="6"
                          fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          className={cn(config.gauge, "transition-all duration-1000")}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <StatusIcon className={cn("w-5 h-5", config.iconColor)} />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize",
                      config.badge
                    )}>
                      {system.status}
                    </span>
                  </div>
                </div>

                {/* Quick Actions (shown on hover) */}
                {onLogMaintenance && (
                  <div className="mt-4 pt-4 border-t border-soft-amber/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogMaintenance(system.id);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-burnt-sienna bg-cream hover:bg-soft-beige rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Log Maintenance
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats (if systems exist) */}
      {systems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-soft-amber/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sage">
                {systems.filter(s => s.status === 'healthy').length}
              </div>
              <div className="text-xs text-warm-gray mt-1">Healthy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warm-orange">
                {systems.filter(s => s.status === 'warning').length}
              </div>
              <div className="text-xs text-warm-gray mt-1">Needs Attention</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warm-coral">
                {systems.filter(s => s.status === 'critical').length}
              </div>
              <div className="text-xs text-warm-gray mt-1">Critical</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSystemStatusWidget;
