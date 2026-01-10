/**
 * Schedule Task Modal
 * Create new scheduled maintenance tasks with email reminders and recurrence
 */

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Repeat, Mail, AlertCircle, Loader2, Check } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { EmailReminderConfig } from './EmailReminderConfig';
import { RecurringTaskSetup } from './RecurringTaskSetup';

interface System {
  id: string;
  name: string;
  type: string;
  category: string;
}

interface ScheduleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDate?: Date | null;
  prefilledSystemId?: string;
  onSuccess?: () => void;
}

interface TaskFormData {
  systemId: string;
  taskType: string;
  customTaskName?: string;
  dueDate: string;
  estimatedDuration?: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  emailReminders: {
    enabled: boolean;
    schedule: string[];
  };
  recurrence: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    interval: number;
    endDate?: string;
    occurrences?: number;
  };
}

const TASK_TYPES = [
  { id: 'filter-change', name: 'Filter Change', duration: 15 },
  { id: 'inspection', name: 'Visual Inspection', duration: 20 },
  { id: 'cleaning', name: 'Cleaning', duration: 30 },
  { id: 'repair', name: 'Repair', duration: 60 },
  { id: 'testing', name: 'System Testing', duration: 30 },
  { id: 'calibration', name: 'Calibration', duration: 45 },
  { id: 'custom', name: 'Custom Task', duration: 30 },
];

export function ScheduleTaskModal({
  isOpen,
  onClose,
  prefilledDate,
  prefilledSystemId,
  onSuccess,
}: ScheduleTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    systemId: prefilledSystemId || '',
    taskType: '',
    dueDate: prefilledDate ? format(prefilledDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    emailReminders: {
      enabled: true,
      schedule: ['7days', '1day', 'morning'],
    },
    recurrence: {
      enabled: false,
      frequency: 'monthly',
      interval: 1,
    },
  });

  // Fetch systems
  const { data: systems } = useQuery<System[]>({
    queryKey: ['systems'],
    queryFn: async () => {
      const response = await api.get('/systems');
      return response.data.systems || [];
    },
    enabled: isOpen,
  });

  // Create scheduled task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      if (data.recurrence.enabled) {
        // Create recurring series
        const response = await api.post('/maintenance/scheduled/batch', {
          ...data,
          recurrence: data.recurrence,
        });
        return response.data;
      } else {
        // Create single task
        const response = await api.post('/maintenance/scheduled', data);
        return response.data;
      }
    },
    onSuccess: () => {
      onSuccess?.();
      handleClose();
    },
  });

  // Reset form on open/close
  useEffect(() => {
    if (isOpen) {
      setFormData({
        systemId: prefilledSystemId || '',
        taskType: '',
        dueDate: prefilledDate ? format(prefilledDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        emailReminders: {
          enabled: true,
          schedule: ['7days', '1day', 'morning'],
        },
        recurrence: {
          enabled: false,
          frequency: 'monthly',
          interval: 1,
        },
      });
    }
  }, [isOpen, prefilledDate, prefilledSystemId]);

  const handleClose = () => {
    setFormData({
      systemId: '',
      taskType: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
      emailReminders: {
        enabled: true,
        schedule: ['7days', '1day', 'morning'],
      },
      recurrence: {
        enabled: false,
        frequency: 'monthly',
        interval: 1,
      },
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-set estimated duration based on task type
    const selectedTaskType = TASK_TYPES.find(t => t.id === formData.taskType);
    const finalData = {
      ...formData,
      estimatedDuration: selectedTaskType?.duration || 30,
    };

    createTaskMutation.mutate(finalData);
  };

  const canSubmit = formData.systemId && formData.taskType && formData.dueDate &&
    (!formData.recurrence.enabled || (formData.recurrence.endDate || formData.recurrence.occurrences));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Schedule Maintenance</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* System Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System *
              </label>
              <select
                value={formData.systemId}
                onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select a system...</option>
                {systems?.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.name} ({system.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Type *
              </label>
              <select
                value={formData.taskType}
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value, customTaskName: undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select task type...</option>
                {TASK_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (~{type.duration}min)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Task Name */}
            {formData.taskType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Task Name *
                </label>
                <input
                  type="text"
                  value={formData.customTaskName || ''}
                  onChange={(e) => setFormData({ ...formData, customTaskName: e.target.value })}
                  placeholder="e.g., Annual safety inspection"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all capitalize",
                      formData.priority === priority
                        ? priority === 'high'
                          ? "bg-red-500 text-white"
                          : priority === 'medium'
                          ? "bg-orange-500 text-white"
                          : "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Add any additional details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Email Reminders */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Email Reminders</h3>
              </div>
              <EmailReminderConfig
                value={formData.emailReminders}
                onChange={(emailReminders) => setFormData({ ...formData, emailReminders })}
              />
            </div>

            {/* Recurring Task */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Repeat className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Recurring Task</h3>
              </div>
              <RecurringTaskSetup
                value={formData.recurrence}
                onChange={(recurrence) => setFormData({ ...formData, recurrence })}
                baseDate={formData.dueDate}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || createTaskMutation.isPending}
            className={cn(
              "px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2",
              !canSubmit || createTaskMutation.isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
            )}
          >
            {createTaskMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {formData.recurrence.enabled ? 'Schedule Series' : 'Schedule Task'}
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {createTaskMutation.isError && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Failed to schedule task</h4>
                <p className="text-sm text-red-600 mt-1">
                  {(createTaskMutation.error as any)?.response?.data?.message || 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
