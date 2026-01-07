import React from 'react';
import { cn } from '@/lib/utils';

interface HealthScoreGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  breakdown?: {
    systems: number;
    maintenance: number;
    upcomingTasks: number;
  };
}

/**
 * HealthScoreGauge Component
 * Displays overall home health score as a circular gauge
 */
export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  size = 'lg',
  showLabel = true,
  breakdown
}) => {
  // Determine status based on score
  const getStatus = (score: number): { label: string; color: string; bgColor: string; strokeColor: string } => {
    if (score >= 90) return {
      label: 'Excellent',
      color: 'text-sage',
      bgColor: 'bg-sage/10',
      strokeColor: 'stroke-sage'
    };
    if (score >= 70) return {
      label: 'Good',
      color: 'text-soft-amber',
      bgColor: 'bg-soft-amber/10',
      strokeColor: 'stroke-soft-amber'
    };
    if (score >= 50) return {
      label: 'Needs Attention',
      color: 'text-warm-orange',
      bgColor: 'bg-warm-orange/10',
      strokeColor: 'stroke-warm-orange'
    };
    return {
      label: 'Critical',
      color: 'text-warm-coral',
      bgColor: 'bg-warm-coral/10',
      strokeColor: 'stroke-warm-coral'
    };
  };

  const status = getStatus(score);

  // Size configurations
  const sizeConfig = {
    sm: {
      containerSize: 'w-32 h-32',
      svgSize: 128,
      radius: 50,
      strokeWidth: 10,
      fontSize: 'text-2xl',
      labelSize: 'text-xs'
    },
    md: {
      containerSize: 'w-40 h-40',
      svgSize: 160,
      radius: 60,
      strokeWidth: 12,
      fontSize: 'text-3xl',
      labelSize: 'text-sm'
    },
    lg: {
      containerSize: 'w-48 h-48',
      svgSize: 192,
      radius: 75,
      strokeWidth: 14,
      fontSize: 'text-4xl',
      labelSize: 'text-base'
    }
  };

  const config = sizeConfig[size];
  const center = config.svgSize / 2;
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge */}
      <div className="relative">
        {/* Outer glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-1000",
          status.bgColor
        )} />

        {/* SVG Gauge */}
        <div className={cn("relative", config.containerSize)}>
          <svg
            width={config.svgSize}
            height={config.svgSize}
            className="transform -rotate-90"
            viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
          >
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={config.radius}
              stroke="#E8DCC4"
              strokeWidth={config.strokeWidth}
              fill="none"
              opacity="0.2"
            />

            {/* Progress circle */}
            <circle
              cx={center}
              cy={center}
              r={config.radius}
              className={cn(
                status.strokeColor,
                "transition-all duration-1000 ease-out"
              )}
              strokeWidth={config.strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              style={{
                filter: 'drop-shadow(0 0 8px currentColor)'
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn(
              "font-bold tabular-nums tracking-tight",
              config.fontSize,
              status.color
            )}>
              {Math.round(score)}%
            </div>
            {showLabel && (
              <div className={cn(
                "font-semibold mt-1",
                config.labelSize,
                status.color
              )}>
                {status.label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown (optional) */}
      {breakdown && (
        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray">Systems Health</span>
            <span className="font-semibold text-charcoal">{breakdown.systems}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray">Maintenance Status</span>
            <span className="font-semibold text-charcoal">{breakdown.maintenance}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray">Upcoming Tasks</span>
            <span className="font-semibold text-charcoal">{breakdown.upcomingTasks}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthScoreGauge;
