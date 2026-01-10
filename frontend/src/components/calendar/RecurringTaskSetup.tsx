/**
 * Recurring Task Setup
 * Configure recurring maintenance tasks (daily, weekly, monthly, etc.)
 */

import { Repeat, Calendar, Hash } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, addYears, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Recurrence {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  interval: number;
  endDate?: string;
  occurrences?: number;
}

interface RecurringTaskSetupProps {
  value: Recurrence;
  onChange: (value: Recurrence) => void;
  baseDate: string;
}

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily', icon: '📅' },
  { id: 'weekly', label: 'Weekly', icon: '📆' },
  { id: 'monthly', label: 'Monthly', icon: '🗓️' },
  { id: 'quarterly', label: 'Quarterly', icon: '📊' },
  { id: 'annually', label: 'Annually', icon: '🎂' },
] as const;

export function RecurringTaskSetup({ value, onChange, baseDate }: RecurringTaskSetupProps) {
  const toggleEnabled = () => {
    onChange({
      ...value,
      enabled: !value.enabled,
    });
  };

  const setFrequency = (frequency: Recurrence['frequency']) => {
    onChange({
      ...value,
      frequency,
      interval: 1, // Reset interval when changing frequency
    });
  };

  const setInterval = (interval: number) => {
    onChange({
      ...value,
      interval: Math.max(1, interval),
    });
  };

  const setEndDate = (endDate: string) => {
    onChange({
      ...value,
      endDate,
      occurrences: undefined, // Clear occurrences if setting end date
    });
  };

  const setOccurrences = (occurrences: number) => {
    onChange({
      ...value,
      occurrences: Math.max(1, occurrences),
      endDate: undefined, // Clear end date if setting occurrences
    });
  };

  const clearEnd = () => {
    onChange({
      ...value,
      endDate: undefined,
      occurrences: undefined,
    });
  };

  // Calculate preview dates
  const getPreviewDates = () => {
    if (!value.enabled || !baseDate) return [];

    const dates: Date[] = [];
    let currentDate = parseISO(baseDate);
    const maxPreviews = 5;

    for (let i = 0; i < maxPreviews; i++) {
      dates.push(new Date(currentDate));

      switch (value.frequency) {
        case 'daily':
          currentDate = addDays(currentDate, value.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, value.interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, value.interval);
          break;
        case 'quarterly':
          currentDate = addMonths(currentDate, value.interval * 3);
          break;
        case 'annually':
          currentDate = addYears(currentDate, value.interval);
          break;
      }

      // Check if we've exceeded end date or occurrences
      if (value.endDate && currentDate > parseISO(value.endDate)) break;
      if (value.occurrences && i >= value.occurrences - 1) break;
    }

    return dates;
  };

  const previewDates = getPreviewDates();

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Make this a recurring task</span>
        </div>
        <button
          type="button"
          onClick={toggleEnabled}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            value.enabled ? "bg-orange-500" : "bg-gray-300"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              value.enabled ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {value.enabled && (
        <div className="space-y-4">
          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFrequency(option.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium",
                    value.frequency === option.id
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-orange-300 text-gray-700"
                  )}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat every
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="99"
                value={value.interval}
                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">
                {value.frequency === 'daily' && (value.interval === 1 ? 'day' : 'days')}
                {value.frequency === 'weekly' && (value.interval === 1 ? 'week' : 'weeks')}
                {value.frequency === 'monthly' && (value.interval === 1 ? 'month' : 'months')}
                {value.frequency === 'quarterly' && (value.interval === 1 ? 'quarter' : 'quarters')}
                {value.frequency === 'annually' && (value.interval === 1 ? 'year' : 'years')}
              </span>
            </div>
          </div>

          {/* End Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ends
            </label>

            <div className="space-y-3">
              {/* Never option */}
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="endCondition"
                  checked={!value.endDate && !value.occurrences}
                  onChange={clearEnd}
                  className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Never</div>
                  <div className="text-xs text-gray-500">Continue indefinitely</div>
                </div>
              </label>

              {/* On date option */}
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="endCondition"
                  checked={!!value.endDate}
                  onChange={() => {
                    if (!value.endDate) {
                      setEndDate(format(addMonths(parseISO(baseDate), 6), 'yyyy-MM-dd'));
                    }
                  }}
                  className="h-4 w-4 mt-0.5 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    On date
                  </div>
                  {value.endDate && (
                    <input
                      type="date"
                      value={value.endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={baseDate}
                      className="mt-2 w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}
                </div>
              </label>

              {/* After X occurrences option */}
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="endCondition"
                  checked={!!value.occurrences}
                  onChange={() => {
                    if (!value.occurrences) {
                      setOccurrences(10);
                    }
                  }}
                  className="h-4 w-4 mt-0.5 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    After number of occurrences
                  </div>
                  {value.occurrences !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={value.occurrences}
                        onChange={(e) => setOccurrences(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">occurrences</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          {previewDates.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Preview Schedule</h4>
              <div className="space-y-1">
                {previewDates.slice(0, 5).map((date, index) => (
                  <div key={index} className="text-sm text-blue-700 flex items-center gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{format(date, 'MMMM d, yyyy')}</span>
                  </div>
                ))}
                {value.occurrences && value.occurrences > 5 && (
                  <div className="text-xs text-blue-600 mt-2">
                    + {value.occurrences - 5} more occurrences
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Warning */}
          {!value.endDate && !value.occurrences && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-amber-600 text-sm">⚠️</span>
              <div className="text-sm text-amber-800">
                <strong>Infinite recurrence:</strong> This task will continue indefinitely. Consider setting an end date or occurrence limit.
              </div>
            </div>
          )}
        </div>
      )}

      {!value.enabled && (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          This will be a one-time task.
        </div>
      )}
    </div>
  );
}
