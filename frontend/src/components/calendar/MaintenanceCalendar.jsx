/**
 * MaintenanceCalendar Component
 * Calendar view for scheduled maintenance tasks (E5-T5)
 *
 * Features:
 * - Month/week/day views
 * - Color-coded by status (due, overdue, completed)
 * - Drag-and-drop rescheduling
 * - Quick-view modal for task details
 * - Filter by system/category
 */

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MaintenanceCalendar.css';

const localizer = momentLocalizer(moment);

const MaintenanceCalendar = ({ homeId }) => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    system: 'all',
    category: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch scheduled maintenance tasks
  useEffect(() => {
    const fetchScheduledTasks = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ homeId });
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.system !== 'all') params.append('systemId', filters.system);

        const response = await fetch(`/api/v1/maintenance/tasks/scheduled?${params}`);
        const data = await response.json();

        if (data.success) {
          // Transform tasks to calendar events
          const calendarEvents = data.data.map(task => ({
            id: task._id,
            title: task.customTaskName || task.taskId?.name || 'Maintenance Task',
            start: new Date(task.scheduling.dueDate),
            end: new Date(task.scheduling.dueDate),
            resource: task,
            status: task.status,
            priority: task.priority
          }));

          setEvents(calendarEvents);
        }
      } catch (error) {
        console.error('Failed to fetch scheduled tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduledTasks();
  }, [homeId, filters]);

  // Event style getter - color code by status
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';

    switch (event.status) {
      case 'overdue':
        backgroundColor = '#dc2626'; // Red
        break;
      case 'due':
        backgroundColor = '#f59e0b'; // Orange
        break;
      case 'completed':
        backgroundColor = '#10b981'; // Green
        break;
      case 'in-progress':
        backgroundColor = '#3b82f6'; // Blue
        break;
      case 'scheduled':
        backgroundColor = '#6b7280'; // Gray
        break;
      default:
        backgroundColor = '#3174ad';
    }

    if (event.priority === 'critical') {
      backgroundColor = '#991b1b'; // Dark red
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  // Handle drag-and-drop rescheduling
  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const response = await fetch(`/api/v1/maintenance/tasks/scheduled/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduling: {
            ...event.resource.scheduling,
            dueDate: start
          }
        })
      });

      if (response.ok) {
        // Update local state
        setEvents(events.map(e =>
          e.id === event.id
            ? { ...e, start, end }
            : e
        ));
      }
    } catch (error) {
      console.error('Failed to reschedule task:', error);
    }
  };

  // Handle view change
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="maintenance-calendar-container">
      {/* Header with filters */}
      <div className="calendar-header">
        <h2>Maintenance Calendar</h2>

        <div className="calendar-filters">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="due">Due</option>
            <option value="overdue">Overdue</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.system}
            onChange={(e) => handleFilterChange('system', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Systems</option>
            {/* Dynamically populate from systems */}
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="routine">Routine</option>
            <option value="seasonal">Seasonal</option>
            <option value="reactive">Reactive</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Calendar legend */}
      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#dc2626' }}></span>
          Overdue
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
          Due
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
          In Progress
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
          Completed
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#6b7280' }}></span>
          Scheduled
        </span>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="loading-state">Loading calendar...</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={handleViewChange}
          views={['month', 'week', 'day', 'agenda']}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          draggableAccessor={() => true}
          resizable={false}
          style={{ height: 700 }}
          popup
        />
      )}

      {/* Quick view modal */}
      {selectedEvent && (
        <TaskQuickView
          task={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Upcoming tasks sidebar */}
      <div className="upcoming-tasks-sidebar">
        <h3>Upcoming Tasks</h3>
        <div className="upcoming-tasks-list">
          {events
            .filter(e => e.status !== 'completed' && new Date(e.start) > new Date())
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="upcoming-task-item">
                <div className="task-title">{event.title}</div>
                <div className="task-date">{moment(event.start).format('MMM D, YYYY')}</div>
                <div className={`task-priority priority-${event.priority}`}>
                  {event.priority}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// Quick view modal component
const TaskQuickView = ({ task, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task.customTaskName || task.taskId?.name}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="task-detail-row">
            <span className="label">Status:</span>
            <span className={`status-badge status-${task.status}`}>{task.status}</span>
          </div>

          <div className="task-detail-row">
            <span className="label">Priority:</span>
            <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
          </div>

          <div className="task-detail-row">
            <span className="label">Due Date:</span>
            <span>{moment(task.scheduling.dueDate).format('MMMM D, YYYY')}</span>
          </div>

          {task.systemId && (
            <div className="task-detail-row">
              <span className="label">System:</span>
              <span>{task.systemId.name}</span>
            </div>
          )}

          {task.taskId?.description && (
            <div className="task-detail-row">
              <span className="label">Description:</span>
              <p className="task-description">{task.taskId.description}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            View Full Details
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCalendar;
