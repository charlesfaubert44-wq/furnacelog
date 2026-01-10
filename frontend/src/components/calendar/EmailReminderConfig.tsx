/**
 * Email Reminder Configuration
 * Configure when email reminders are sent for scheduled tasks
 */

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailReminders {
  enabled: boolean;
  schedule: string[];
}

interface EmailReminderConfigProps {
  value: EmailReminders;
  onChange: (value: EmailReminders) => void;
}

const REMINDER_OPTIONS = [
  { id: '7days', label: '7 days before', description: 'Week before due date' },
  { id: '3days', label: '3 days before', description: 'Three days notice' },
  { id: '1day', label: '1 day before', description: 'Day before due date' },
  { id: 'morning', label: 'Morning of', description: 'Day of at 8:00 AM' },
  { id: '1hour', label: '1 hour before', description: 'One hour notice' },
];

export function EmailReminderConfig({ value, onChange }: EmailReminderConfigProps) {
  const toggleEnabled = () => {
    onChange({
      ...value,
      enabled: !value.enabled,
    });
  };

  const toggleReminder = (reminderId: string) => {
    const newSchedule = value.schedule.includes(reminderId)
      ? value.schedule.filter(id => id !== reminderId)
      : [...value.schedule, reminderId];

    onChange({
      ...value,
      schedule: newSchedule,
    });
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Enable email reminders</span>
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

      {/* Reminder Schedule Options */}
      {value.enabled && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">
            Select when you want to receive email reminders:
          </p>

          {REMINDER_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                value.schedule.includes(option.id)
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
              )}
            >
              <input
                type="checkbox"
                checked={value.schedule.includes(option.id)}
                onChange={() => toggleReminder(option.id)}
                className="mt-0.5 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
              </div>
            </label>
          ))}

          {value.schedule.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ Select at least one reminder time
            </div>
          )}

          {value.schedule.length > 0 && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              ✓ {value.schedule.length} reminder{value.schedule.length !== 1 ? 's' : ''} configured
            </div>
          )}
        </div>
      )}

      {!value.enabled && (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          Email reminders are disabled. You won't receive notifications for this task.
        </div>
      )}
    </div>
  );
}
