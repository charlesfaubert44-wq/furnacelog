import React from 'react';
import { AlertTriangle, DollarSign, CheckCircle2, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  status?: 'success' | 'warning' | 'error' | 'neutral';
  onClick?: () => void;
}

/**
 * Single Stat Card Component
 */
const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  status = 'neutral',
  onClick
}) => {
  const statusStyles = {
    success: 'border-sage/30 bg-sage/5 hover:border-sage/50',
    warning: 'border-warm-orange/30 bg-warm-orange/5 hover:border-warm-orange/50',
    error: 'border-warm-coral/30 bg-warm-coral/5 hover:border-warm-coral/50',
    neutral: 'border-soft-amber/20 bg-warm-white hover:border-soft-amber/40'
  };

  const iconStyles = {
    success: 'bg-sage text-white',
    warning: 'bg-warm-orange text-white',
    error: 'bg-warm-coral text-white',
    neutral: 'bg-burnt-sienna text-white'
  };

  const valueStyles = {
    success: 'text-sage',
    warning: 'text-warm-orange',
    error: 'text-warm-coral',
    neutral: 'text-charcoal'
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-md",
        statusStyles[status],
        onClick && "cursor-pointer hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md",
        iconStyles[status]
      )}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Value */}
      <div className={cn(
        "text-3xl font-bold mb-1 tabular-nums",
        valueStyles[status]
      )}>
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-warm-gray font-medium mb-1">
        {label}
      </div>

      {/* Subtext or Trend */}
      {subtext && !trend && (
        <div className="text-xs text-warm-gray/80 mt-1">
          {subtext}
        </div>
      )}

      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.direction === 'up' && (
            <TrendingUp className="w-3 h-3 text-warm-coral" />
          )}
          {trend.direction === 'down' && (
            <TrendingDown className="w-3 h-3 text-sage" />
          )}
          <span className={cn(
            "text-xs font-medium",
            trend.direction === 'up' ? 'text-warm-coral' : trend.direction === 'down' ? 'text-sage' : 'text-warm-gray'
          )}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};

interface QuickStatsCardsProps {
  overdueCount: number;
  monthlySpent?: number;
  healthySystems?: { current: number; total: number };
  nextMaintenance?: {
    daysUntil: number;
    taskName: string;
  };
  onOverdueClick?: () => void;
  onSpendingClick?: () => void;
  onSystemsClick?: () => void;
  onNextMaintenanceClick?: () => void;
}

/**
 * QuickStatsCards Component
 * Displays 4 key metrics in a grid
 */
export const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({
  overdueCount,
  monthlySpent,
  healthySystems,
  nextMaintenance,
  onOverdueClick,
  onSpendingClick,
  onSystemsClick,
  onNextMaintenanceClick
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overdue Tasks */}
      <StatCard
        icon={AlertTriangle}
        label="Tasks Overdue"
        value={overdueCount}
        status={overdueCount > 0 ? 'error' : 'success'}
        subtext={overdueCount === 0 ? 'All caught up!' : undefined}
        onClick={onOverdueClick}
      />

      {/* Monthly Spending */}
      {monthlySpent !== undefined && (
        <StatCard
          icon={DollarSign}
          label={`Spent in ${new Date().toLocaleDateString('en-US', { month: 'long' })}`}
          value={`$${monthlySpent.toLocaleString()}`}
          status="neutral"
          onClick={onSpendingClick}
        />
      )}

      {/* Healthy Systems */}
      {healthySystems && (
        <StatCard
          icon={CheckCircle2}
          label="Systems Healthy"
          value={`${healthySystems.current}/${healthySystems.total}`}
          status={
            healthySystems.current === healthySystems.total
              ? 'success'
              : healthySystems.current / healthySystems.total >= 0.7
              ? 'warning'
              : 'error'
          }
          onClick={onSystemsClick}
        />
      )}

      {/* Next Maintenance */}
      {nextMaintenance && (
        <StatCard
          icon={Calendar}
          label="Next Maintenance"
          value={`${nextMaintenance.daysUntil} ${nextMaintenance.daysUntil === 1 ? 'day' : 'days'}`}
          subtext={nextMaintenance.taskName}
          status={
            nextMaintenance.daysUntil <= 3
              ? 'warning'
              : 'neutral'
          }
          onClick={onNextMaintenanceClick}
        />
      )}
    </div>
  );
};

export default QuickStatsCards;
