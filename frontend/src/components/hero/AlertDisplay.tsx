import { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, Calendar, Home, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertPriority = 'urgent' | 'warning' | 'healthy';

export interface AlertItem {
  id: string;
  priority: AlertPriority;
  icon: 'alert' | 'calendar' | 'home';
  title: string;
  description: string;
  badge: string;
  timeInfo?: string;
  timeIcon?: ReactNode;
  systems?: string[];
}

interface AlertDisplayProps {
  alerts: AlertItem[];
  className?: string;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
}

const ICON_MAP = {
  alert: AlertTriangle,
  calendar: Calendar,
  home: Home,
};

const PRIORITY_CONFIG = {
  urgent: {
    bgGradient: 'from-[#d45d4e]/40 to-[#d4734e]/20',
    borderColor: 'border-[#d45d4e]/40 hover:border-[#d45d4e]/60',
    iconGradient: 'from-[#d45d4e] to-[#d4734e]',
    badgeBg: 'bg-[#d45d4e]/20',
    badgeText: 'text-[#d45d4e]',
    glowColor: 'bg-[#d45d4e]',
    order: 1,
  },
  warning: {
    bgGradient: 'from-[#ff9500]/30 to-[#ff6a00]/15',
    borderColor: 'border-[#ff9500]/30 hover:border-[#ff9500]/50',
    iconGradient: 'from-[#ff9500] to-[#ff6a00]',
    badgeBg: 'bg-[#ff9500]/20',
    badgeText: 'text-[#ff9500]',
    glowColor: 'bg-[#ff9500]',
    order: 2,
  },
  healthy: {
    bgGradient: 'from-[#6a994e]/30 to-[#7ea88f]/15',
    borderColor: 'border-[#6a994e]/30 hover:border-[#6a994e]/50',
    iconGradient: 'from-[#6a994e] to-[#7ea88f]',
    badgeBg: 'bg-[#6a994e]/20',
    badgeText: 'text-[#6a994e]',
    glowColor: 'bg-[#6a994e]',
    order: 3,
  },
};

export function AlertDisplay({
  alerts,
  className,
  autoAdvance = true,
  autoAdvanceInterval = 6000,
}: AlertDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sort alerts by priority
  const sortedAlerts = [...alerts].sort((a, b) => {
    return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
  });

  const currentAlert = sortedAlerts[currentIndex];
  const config = PRIORITY_CONFIG[currentAlert.priority];
  const IconComponent = ICON_MAP[currentAlert.icon];

  useEffect(() => {
    if (!autoAdvance || isPaused || sortedAlerts.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [autoAdvance, isPaused, currentIndex, autoAdvanceInterval, sortedAlerts.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % sortedAlerts.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + sortedAlerts.length) % sortedAlerts.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  if (!alerts.length) {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        <div className="h-32 bg-[#2a2a2a]/50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Alert Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 transition-all duration-500',
          'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]',
          config.borderColor,
          isTransitioning && 'scale-[0.98] opacity-90'
        )}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              'absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-10 transition-all duration-700',
              config.glowColor
            )}
          />
        </div>

        {/* Alert Content */}
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br transition-transform duration-300 group-hover:scale-110',
                config.iconGradient
              )}
            >
              <IconComponent className="w-6 h-6 text-[#f4e8d8]" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title and Badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-[#f4e8d8] text-lg">{currentAlert.title}</h3>
                <span
                  className={cn(
                    'flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded uppercase tracking-wider',
                    config.badgeBg,
                    config.badgeText
                  )}
                >
                  {currentAlert.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#d4a373] leading-relaxed">{currentAlert.description}</p>

              {/* Time Info or Systems List */}
              {currentAlert.timeInfo && (
                <div className="flex items-center gap-2 text-xs text-[#d4a373]/70">
                  {currentAlert.timeIcon || <Clock className="w-3.5 h-3.5" />}
                  <span>{currentAlert.timeInfo}</span>
                </div>
              )}

              {currentAlert.systems && (
                <div className="space-y-2 pt-1">
                  {currentAlert.systems.map((system, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-[#d4a373]">
                      <CheckCircle2 className="w-4 h-4 text-[#6a994e] flex-shrink-0" />
                      <span>{system}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (for auto-advance) */}
        {autoAdvance && sortedAlerts.length > 1 && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2a2a2a]">
            <div
              className={cn('h-full transition-all', config.glowColor)}
              style={{
                animation: `progressBar ${autoAdvanceInterval}ms linear`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {sortedAlerts.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          {/* Alert Counter with Priority Indicators */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {sortedAlerts.map((alert, idx) => {
                const alertConfig = PRIORITY_CONFIG[alert.priority];
                return (
                  <button
                    key={alert.id}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(idx);
                        setTimeout(() => setIsTransitioning(false), 400);
                      }
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      idx === currentIndex
                        ? cn('w-6', alertConfig.glowColor)
                        : cn(alertConfig.glowColor, 'opacity-30 hover:opacity-50')
                    )}
                    aria-label={`View ${alert.title}`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-[#d4a373]/50 ml-2">
              {currentIndex + 1} of {sortedAlerts.length} alerts
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className={cn(
                'w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#f4e8d8]/20',
                'flex items-center justify-center',
                'text-[#d4a373] hover:text-[#f4e8d8] hover:border-[#f4e8d8]/30',
                'transition-all duration-300 hover:scale-105',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
              aria-label="Previous alert"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className={cn(
                'w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#f4e8d8]/20',
                'flex items-center justify-center',
                'text-[#d4a373] hover:text-[#f4e8d8] hover:border-[#f4e8d8]/30',
                'transition-all duration-300 hover:scale-105',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}
              aria-label="Next alert"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CSS Animation for Progress Bar */}
      <style>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
