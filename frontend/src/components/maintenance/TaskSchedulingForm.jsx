/**
 * TaskSchedulingForm Component
 * UI for scheduling maintenance tasks (E5-T6)
 *
 * Features:
 * - Task selection from library
 * - One-time vs recurring scheduling
 * - Interval, seasonal, and annual recurrence
 * - System/component association
 * - Reminder preferences
 */

import React, { useState, useEffect } from 'react';
import './TaskSchedulingForm.css';

const TaskSchedulingForm = ({ homeId, systemId, onScheduled, onCancel }) => {
  const [step, setStep] = useState(1);
  const [taskLibrary, setTaskLibrary] = useState([]);
  const [formData, setFormData] = useState({
    taskId: null,
    customTaskName: '',
    homeId: homeId,
    systemId: systemId || null,
    componentId: null,
    scheduling: {
      dueDate: '',
      recurrence: {
        type: 'none',
        intervalDays: null,
        season: null,
        dayOfYear: { month: null, day: null }
      }
    },
    priority: 'medium',
    assignedTo: 'self',
    providerId: null,
    reminders: []
  });

  // Fetch task library
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams();
        if (systemId) params.append('system', systemId);

        const response = await fetch(`/api/v1/maintenance/tasks/library?${params}`);
        const data = await response.json();

        if (data.success) {
          setTaskLibrary(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch task library:', error);
      }
    };

    fetchTasks();
  }, [systemId]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested scheduling changes
  const handleSchedulingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      scheduling: {
        ...prev.scheduling,
        [field]: value
      }
    }));
  };

  // Handle recurrence changes
  const handleRecurrenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      scheduling: {
        ...prev.scheduling,
        recurrence: {
          ...prev.scheduling.recurrence,
          [field]: value
        }
      }
    }));
  };

  // Add reminder
  const addReminder = (type, daysBefore) => {
    setFormData(prev => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        { type, daysBefore, sent: false }
      ]
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/v1/maintenance/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onScheduled(data.data);
      } else {
        alert('Failed to schedule task');
      }
    } catch (error) {
      console.error('Failed to schedule task:', error);
      alert('Error scheduling task');
    }
  };

  return (
    <div className="task-scheduling-form">
      <h2>Schedule Maintenance Task</h2>

      <div className="form-steps">
        <div className={`step ${step === 1 ? 'active' : ''}`}>1. Select Task</div>
        <div className={`step ${step === 2 ? 'active' : ''}`}>2. Schedule</div>
        <div className={`step ${step === 3 ? 'active' : ''}`}>3. Reminders</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Task Selection */}
        {step === 1 && (
          <div className="form-step">
            <h3>Choose Task</h3>

            <div className="task-selection">
              <label>
                <input
                  type="radio"
                  name="taskSource"
                  value="library"
                  defaultChecked
                  onChange={() => handleChange('customTaskName', '')}
                />
                Select from library
              </label>

              <label>
                <input
                  type="radio"
                  name="taskSource"
                  value="custom"
                  onChange={() => handleChange('taskId', null)}
                />
                Create custom task
              </label>
            </div>

            {/* Task library selection */}
            <div className="task-library-list">
              {taskLibrary.map(task => (
                <div
                  key={task._id}
                  className={`task-card ${formData.taskId === task._id ? 'selected' : ''}`}
                  onClick={() => handleChange('taskId', task._id)}
                >
                  <h4>{task.name}</h4>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`badge difficulty-${task.execution.difficultyLevel}`}>
                      {task.execution.difficultyLevel}
                    </span>
                    <span className="badge">{task.category}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom task name */}
            {!formData.taskId && (
              <div className="form-group">
                <label>Custom Task Name</label>
                <input
                  type="text"
                  value={formData.customTaskName}
                  onChange={(e) => handleChange('customTaskName', e.target.value)}
                  required
                  placeholder="Enter task name"
                />
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={!formData.taskId && !formData.customTaskName}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Scheduling */}
        {step === 2 && (
          <div className="form-step">
            <h3>Schedule Details</h3>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={formData.scheduling.dueDate}
                onChange={(e) => handleSchedulingChange('dueDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Recurrence</label>
              <select
                value={formData.scheduling.recurrence.type}
                onChange={(e) => handleRecurrenceChange('type', e.target.value)}
              >
                <option value="none">One-time</option>
                <option value="interval">Interval (days)</option>
                <option value="seasonal">Seasonal</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            {/* Interval recurrence */}
            {formData.scheduling.recurrence.type === 'interval' && (
              <div className="form-group">
                <label>Repeat Every (days)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.scheduling.recurrence.intervalDays || ''}
                  onChange={(e) => handleRecurrenceChange('intervalDays', parseInt(e.target.value))}
                  placeholder="e.g., 30, 90, 365"
                />
                <div className="quick-intervals">
                  <button type="button" onClick={() => handleRecurrenceChange('intervalDays', 30)}>
                    Monthly
                  </button>
                  <button type="button" onClick={() => handleRecurrenceChange('intervalDays', 90)}>
                    Quarterly
                  </button>
                  <button type="button" onClick={() => handleRecurrenceChange('intervalDays', 180)}>
                    Semi-Annual
                  </button>
                  <button type="button" onClick={() => handleRecurrenceChange('intervalDays', 365)}>
                    Annual
                  </button>
                </div>
              </div>
            )}

            {/* Seasonal recurrence */}
            {formData.scheduling.recurrence.type === 'seasonal' && (
              <div className="form-group">
                <label>Season</label>
                <select
                  value={formData.scheduling.recurrence.season || ''}
                  onChange={(e) => handleRecurrenceChange('season', e.target.value)}
                >
                  <option value="">Select season</option>
                  <option value="pre-freeze-up">Pre-Freeze-Up (Sept-Oct)</option>
                  <option value="winter">Winter (Nov-Mar)</option>
                  <option value="break-up">Break-Up (Apr-May)</option>
                  <option value="summer">Summer (Jun-Aug)</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Assigned To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
              >
                <option value="self">Self (DIY)</option>
                <option value="provider">Service Provider</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reminders */}
        {step === 3 && (
          <div className="form-step">
            <h3>Set Reminders</h3>

            <div className="reminders-list">
              {formData.reminders.map((reminder, index) => (
                <div key={index} className="reminder-item">
                  <span>{reminder.daysBefore} days before - {reminder.type}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newReminders = formData.reminders.filter((_, i) => i !== index);
                      handleChange('reminders', newReminders);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="add-reminder">
              <button type="button" onClick={() => addReminder('email', 7)}>
                7 days before (email)
              </button>
              <button type="button" onClick={() => addReminder('email', 3)}>
                3 days before (email)
              </button>
              <button type="button" onClick={() => addReminder('email', 1)}>
                1 day before (email)
              </button>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" className="btn btn-success">
                Schedule Task
              </button>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskSchedulingForm;
