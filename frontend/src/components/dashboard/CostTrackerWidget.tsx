import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CostData {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  byCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  byType: {
    diy: number;
    professional: number;
  };
  monthlyData: {
    month: string;
    amount: number;
  }[];
}

interface CostTrackerWidgetProps {
  data: CostData;
  onExport?: () => void;
  onViewDetails?: () => void;
}

type TimeFrame = 'month' | 'year' | 'all';

/**
 * CostTrackerWidget Component
 * Displays cost tracking with charts and breakdowns
 */
export const CostTrackerWidget: React.FC<CostTrackerWidgetProps> = ({
  data,
  onExport,
  onViewDetails
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');

  // Calculate trend
  const trend = data.lastMonth > 0
    ? ((data.thisMonth - data.lastMonth) / data.lastMonth) * 100
    : 0;
  const isIncreasing = trend > 0;

  // Calculate DIY vs Professional percentages
  const total = data.byType.diy + data.byType.professional;
  const diyPercentage = total > 0 ? (data.byType.diy / total) * 100 : 0;
  const proPercentage = total > 0 ? (data.byType.professional / total) * 100 : 0;

  // Get category colors
  const getCategoryColor = (index: number): string => {
    const colors = [
      'bg-burnt-sienna',
      'bg-warm-orange',
      'bg-soft-amber',
      'bg-sage',
      'bg-warm-gray'
    ];
    return colors[index % colors.length];
  };

  const getCategoryTextColor = (index: number): string => {
    const colors = [
      'text-burnt-sienna',
      'text-warm-orange',
      'text-soft-amber',
      'text-sage',
      'text-warm-gray'
    ];
    return colors[index % colors.length];
  };

  // Simple bar chart for monthly data
  const maxAmount = Math.max(...data.monthlyData.map(d => d.amount), 1);

  return (
    <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-charcoal">Cost Tracker</h3>
          <p className="text-sm text-warm-gray mt-1">Monitor your maintenance expenses</p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="p-2 text-warm-gray hover:text-charcoal hover:bg-cream rounded-lg transition-colors"
            title="Export report"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Time Frame Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTimeFrame('month')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all",
            timeFrame === 'month'
              ? 'bg-burnt-sienna text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeFrame('year')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all",
            timeFrame === 'year'
              ? 'bg-burnt-sienna text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          This Year
        </button>
        <button
          onClick={() => setTimeFrame('all')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all",
            timeFrame === 'all'
              ? 'bg-burnt-sienna text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          All Time
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-burnt-sienna to-warm-orange p-6 rounded-2xl text-white mb-6 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">
            {timeFrame === 'month' ? 'This Month' : timeFrame === 'year' ? 'This Year' : 'Total Spent'}
          </span>
        </div>
        <div className="text-4xl font-bold mb-2">
          ${timeFrame === 'month' ? data.thisMonth.toLocaleString() : data.thisYear.toLocaleString()}
        </div>
        {timeFrame === 'month' && data.lastMonth > 0 && (
          <div className="flex items-center gap-2">
            {isIncreasing ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm">
              {Math.abs(trend).toFixed(1)}% {isIncreasing ? 'more' : 'less'} than last month
            </span>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-charcoal mb-4">By Category</h4>
        <div className="space-y-3">
          {data.byCategory.map((category, index) => (
            <div key={category.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-warm-gray">{category.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-charcoal">
                    ${category.amount.toLocaleString()}
                  </span>
                  <span className={cn("text-xs font-medium", getCategoryTextColor(index))}>
                    {category.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-500", getCategoryColor(index))}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIY vs Professional */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-charcoal mb-4">DIY vs Professional</h4>
        <div className="space-y-4">
          {/* Donut chart alternative - stacked bar */}
          <div className="flex h-8 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-sage flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${diyPercentage}%` }}
            >
              {diyPercentage > 15 && `${diyPercentage.toFixed(0)}%`}
            </div>
            <div
              className="bg-burnt-sienna flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${proPercentage}%` }}
            >
              {proPercentage > 15 && `${proPercentage.toFixed(0)}%`}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sage rounded-full" />
              <span className="text-warm-gray">DIY</span>
              <span className="font-semibold text-charcoal">${data.byType.diy.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-burnt-sienna rounded-full" />
              <span className="text-warm-gray">Professional</span>
              <span className="font-semibold text-charcoal">${data.byType.professional.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend (Simple Bar Chart) */}
      {data.monthlyData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-charcoal mb-4">Monthly Trend</h4>
          <div className="flex items-end justify-between gap-2 h-32">
            {data.monthlyData.slice(-6).map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    className="w-full bg-gradient-to-t from-burnt-sienna to-warm-orange rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                    style={{ height: `${(month.amount / maxAmount) * 100}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-charcoal text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${month.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-warm-gray">{month.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Details Button */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full px-4 py-3 bg-cream hover:bg-soft-beige text-charcoal font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          View Full Report
        </button>
      )}
    </div>
  );
};

export default CostTrackerWidget;
