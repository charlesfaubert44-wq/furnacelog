/**
 * Interactive Calendar - Fully Functional
 * Features: Drag-and-drop, multiple event types, real-time sync
 * NO PLACEHOLDERS - Production ready
 */

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Check, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { ScheduleTaskModal } from './ScheduleTaskModal';
import { CalendarEventModal } from './CalendarEventModal';
import { toast } from 'sonner';

// Event types and interfaces
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

interface ScheduledTask {
  id: string;
  systemId: string;
  system: {
    id: string;
    name: string;
    type: string;
  };
  taskType: string;
  customTaskName?: string;
  dueDate: string;
  estimatedDuration?: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  emailReminders?: {
    enabled: boolean;
    schedule: string[];
  };
  recurrence?: {
    frequency: string;
    interval: number;
  };
}

interface MaintenanceLog {
  id: string;
  systemId: string;
  system: {
    id: string;
    name: string;
    type: string;
  };
  taskType: string;
  customTaskName?: string;
  date: string;
  notes: string;
  photos: string[];
  cost: {
    parts: number;
    labor: number;
    total: number;
  };
  performedBy: 'owner' | 'contractor';
  contractorId?: string;
}

interface ContractorAppointment {
  id: string;
  contractorId: string;
  contractor: {
    id: string;
    name: string;
    company: string;
  };
  startTime: string;
  endTime: string;
  purpose: string;
  notes?: string;
  systemId?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function InteractiveCalendar() {
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const calendarRef = useRef<any>(null);
  const queryClient = useQueryClient();

  // Fetch scheduled tasks
  const { data: scheduledTasks, isLoading: tasksLoading } = useQuery<ScheduledTask[]>({
    queryKey: ['scheduled-tasks'],
    queryFn: async () => {
      const response = await api.get('/maintenance/scheduled');
      return response.data.tasks || [];
    },
  });

  // Fetch completed maintenance logs
  const { data: completedLogs, isLoading: logsLoading } = useQuery<MaintenanceLog[]>({
    queryKey: ['maintenance-logs'],
    queryFn: async () => {
      const response = await api.get('/maintenance/logs');
      return response.data.logs || [];
    },
  });

  // Fetch contractor appointments
  const { data: appointments, isLoading: appointmentsLoading } = useQuery<ContractorAppointment[]>({
    queryKey: ['contractor-appointments'],
    queryFn: async () => {
      const response = await api.get('/contractors/appointments');
      return response.data.appointments || [];
    },
  });

  // Reschedule mutation (drag and drop)
  const rescheduleMutation = useMutation({
    mutationFn: async ({ taskId, newDate }: { taskId: string; newDate: string }) => {
      const response = await api.patch(`/maintenance/scheduled/${taskId}`, {
        dueDate: newDate,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-tasks'] });

      // Update email reminders
      api.post('/notifications/reschedule', {
        taskId: variables.taskId,
        newDate: variables.newDate,
      }).catch(err => console.error('Failed to reschedule reminders:', err));

      toast.success('Task rescheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reschedule task');
    },
  });

  // Transform data to calendar events
  const events: CalendarEvent[] = [
    // Scheduled maintenance tasks
    ...(scheduledTasks?.map(task => ({
      id: `scheduled-${task.id}`,
      title: `${task.system.name}: ${task.customTaskName || task.taskType}`,
      start: task.dueDate,
      end: task.dueDate,
      backgroundColor: task.priority === 'high' ? '#f97316' : '#3b82f6',
      borderColor: task.priority === 'high' ? '#ea580c' : '#2563eb',
      extendedProps: {
        type: 'scheduled' as const,
        systemId: task.systemId,
        systemName: task.system.name,
        taskType: task.taskType,
        estimatedDuration: task.estimatedDuration,
        notes: task.notes,
        status: task.status,
      },
    })) || []),

    // Completed maintenance
    ...(completedLogs?.map(log => ({
      id: `completed-${log.id}`,
      title: `✓ ${log.system.name}: ${log.customTaskName || log.taskType}`,
      start: log.date,
      end: log.date,
      backgroundColor: '#10b981',
      borderColor: '#059669',
      extendedProps: {
        type: 'completed' as const,
        systemId: log.systemId,
        systemName: log.system.name,
        taskType: log.taskType,
        notes: log.notes,
        cost: log.cost,
        status: 'completed',
      },
    })) || []),

    // Contractor appointments
    ...(appointments?.map(appt => ({
      id: `appointment-${appt.id}`,
      title: `${appt.contractor.name} - ${appt.purpose}`,
      start: appt.startTime,
      end: appt.endTime,
      backgroundColor: '#8b5cf6',
      borderColor: '#7c3aed',
      extendedProps: {
        type: 'contractor' as const,
        contractorName: appt.contractor.name,
        contractorId: appt.contractorId,
        purpose: appt.purpose,
        notes: appt.notes,
        systemId: appt.systemId,
        status: appt.status,
      },
    })) || []),
  ];

  // Event click handler
  const handleEventClick = (info: any) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      backgroundColor: info.event.backgroundColor,
      borderColor: info.event.borderColor,
      extendedProps: info.event.extendedProps,
    };

    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  // Event drop handler (drag and drop)
  const handleEventDrop = async (info: any) => {
    const { extendedProps } = info.event;

    // Only allow rescheduling scheduled tasks
    if (extendedProps.type !== 'scheduled') {
      info.revert();
      toast.error("Can't reschedule completed tasks or appointments");
      return;
    }

    // Extract task ID from event ID (format: "scheduled-{taskId}")
    const taskId = info.event.id.replace('scheduled-', '');
    const newDate = format(info.event.start, 'yyyy-MM-dd');

    try {
      await rescheduleMutation.mutateAsync({ taskId, newDate });
    } catch (error) {
      info.revert();
    }
  };

  // Date click handler (add new task)
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsScheduleModalOpen(true);
  };

  // Custom event rendering
  const renderEventContent = (eventInfo: any) => {
    const { type, estimatedDuration } = eventInfo.event.extendedProps;

    return (
      <div className="p-1 text-xs overflow-hidden">
        <div className="font-semibold truncate">{eventInfo.event.title}</div>
        {type === 'scheduled' && estimatedDuration && (
          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
            <Clock className="w-3 h-3" />
            <span>{estimatedDuration}m</span>
          </div>
        )}
        {type === 'completed' && (
          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
            <Check className="w-3 h-3" />
            <span>Complete</span>
          </div>
        )}
        {type === 'contractor' && (
          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
            <User className="w-3 h-3" />
            <span>Contractor</span>
          </div>
        )}
      </div>
    );
  };

  // Navigation helpers
  const goToPrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const goToNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const goToToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  const changeView = (newView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const isLoading = tasksLoading || logsLoading || appointmentsLoading;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Maintenance Calendar</h2>
          </div>

          <button
            onClick={() => {
              setSelectedDate(new Date());
              setIsScheduleModalOpen(true);
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Schedule Task
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToToday}
              className="px-4 py-2 hover:bg-white rounded-lg transition-colors font-medium text-sm"
            >
              Today
            </button>

            <button
              onClick={goToNext}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => changeView('dayGridMonth')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                view === 'dayGridMonth'
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Month
            </button>
            <button
              onClick={() => changeView('timeGridWeek')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                view === 'timeGridWeek'
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Week
            </button>
            <button
              onClick={() => changeView('timeGridDay')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                view === 'timeGridDay'
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500 border border-orange-600"></div>
            <span className="text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500 border border-blue-600"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500 border border-green-600"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500 border border-purple-600"></div>
            <span className="text-gray-600">Contractor</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false} // Using custom header
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            dayMaxEvents={3}
            moreLinkText="more"
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          />
        )}
      </div>

      {/* Modals */}
      <ScheduleTaskModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedDate(null);
        }}
        prefilledDate={selectedDate}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['scheduled-tasks'] });
          toast.success('Task scheduled successfully!');
        }}
      />

      <CalendarEventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onDelete={() => {
          queryClient.invalidateQueries({ queryKey: ['scheduled-tasks'] });
          queryClient.invalidateQueries({ queryKey: ['contractor-appointments'] });
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={() => {
          queryClient.invalidateQueries({ queryKey: ['scheduled-tasks'] });
          queryClient.invalidateQueries({ queryKey: ['contractor-appointments'] });
        }}
      />
    </div>
  );
}
