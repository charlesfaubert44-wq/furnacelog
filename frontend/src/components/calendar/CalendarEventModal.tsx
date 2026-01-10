/**
 * Calendar Event Modal
 * View, edit, and delete calendar events (scheduled tasks, completed logs, appointments)
 */

import { useState } from 'react';
import { X, Calendar, Clock, DollarSign, User, FileText, Trash2, Edit, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    type: 'scheduled' | 'completed' | 'contractor';
    systemId?: string;
    systemName?: string;
    taskType?: string;
    estimatedDuration?: number;
    notes?: string;
    status?: string;
    contractorName?: string;
    contractorId?: string;
    purpose?: string;
    cost?: {
      parts: number;
      labor: number;
      total: number;
    };
  };
}

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function CalendarEventModal({
  isOpen,
  onClose,
  event,
  onDelete,
  onEdit,
}: CalendarEventModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { type } = event!.extendedProps;
      const id = eventId.replace(/^(scheduled|completed|appointment)-/, '');

      if (type === 'scheduled') {
        await api.delete(`/maintenance/scheduled/${id}`);
      } else if (type === 'contractor') {
        await api.delete(`/contractors/appointments/${id}`);
      } else {
        throw new Error('Cannot delete completed maintenance logs from calendar');
      }
    },
    onSuccess: () => {
      toast.success('Event deleted successfully');
      onDelete?.();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    },
  });

  // Mark as complete mutation (for scheduled tasks)
  const markCompleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const id = taskId.replace('scheduled-', '');
      await api.post(`/maintenance/scheduled/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-logs'] });
      toast.success('Task marked as complete!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark as complete');
    },
  });

  if (!isOpen || !event) return null;

  const { type, systemName, taskType, estimatedDuration, notes, status, contractorName, purpose, cost } = event.extendedProps;

  const canDelete = type === 'scheduled' || type === 'contractor';
  const canMarkComplete = type === 'scheduled' && status === 'pending';
  const canEdit = type === 'scheduled' || type === 'contractor';

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteMutation.mutate(event.id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleMarkComplete = () => {
    markCompleteMutation.mutate(event.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: event.backgroundColor + '20' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {type === 'scheduled' && <Calendar className="w-5 h-5" style={{ color: event.borderColor }} />}
                {type === 'completed' && <Check className="w-5 h-5" style={{ color: event.borderColor }} />}
                {type === 'contractor' && <User className="w-5 h-5" style={{ color: event.borderColor }} />}
                <span
                  className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded"
                  style={{ backgroundColor: event.backgroundColor, color: 'white' }}
                >
                  {type === 'scheduled' ? 'Scheduled' : type === 'completed' ? 'Completed' : 'Appointment'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Date & Time */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Date & Time</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-medium">
                {format(parseISO(event.start), 'MMMM d, yyyy')}
              </span>
              {event.end && event.start !== event.end && (
                <>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">
                    {format(parseISO(event.end), 'MMMM d, yyyy')}
                  </span>
                </>
              )}
            </div>
            {estimatedDuration && (
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>Estimated duration: {estimatedDuration} minutes</span>
              </div>
            )}
          </div>

          {/* System Info (for maintenance tasks) */}
          {systemName && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">System</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{systemName}</p>
                {taskType && <p className="text-sm text-gray-600 mt-1 capitalize">{taskType.replace(/-/g, ' ')}</p>}
              </div>
            </div>
          )}

          {/* Contractor Info (for appointments) */}
          {contractorName && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Contractor</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{contractorName}</p>
                {purpose && <p className="text-sm text-gray-600 mt-1">{purpose}</p>}
              </div>
            </div>
          )}

          {/* Cost (for completed logs) */}
          {cost && cost.total > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Cost</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {cost.parts > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Parts:</span>
                    <span className="font-medium text-gray-900">${cost.parts.toFixed(2)}</span>
                  </div>
                )}
                {cost.labor > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Labor:</span>
                    <span className="font-medium text-gray-900">${cost.labor.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-orange-600">${cost.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          {status && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  status === 'completed' && "bg-green-100 text-green-800",
                  status === 'pending' && "bg-blue-100 text-blue-800",
                  status === 'cancelled' && "bg-gray-100 text-gray-800"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            {canMarkComplete && (
              <button
                onClick={handleMarkComplete}
                disabled={markCompleteMutation.isPending}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {markCompleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Marking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Mark Complete
                  </>
                )}
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2",
                  showDeleteConfirm
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                )}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                  </>
                )}
              </button>
            )}

            {showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Error Display */}
        {(deleteMutation.isError || markCompleteMutation.isError) && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Action failed</h4>
                <p className="text-sm text-red-600 mt-1">
                  {(deleteMutation.error as any)?.response?.data?.message ||
                    (markCompleteMutation.error as any)?.response?.data?.message ||
                    'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
