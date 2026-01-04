import React, { useState } from 'react';
import { X, Calendar, AlertCircle, Save, Flame, Droplets, Wind, Zap } from 'lucide-react';

/**
 * Log Maintenance Modal Component
 * Allows users to log new maintenance tasks
 */

interface LogMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (task: MaintenanceTaskInput) => void;
}

export interface MaintenanceTaskInput {
  system: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const systems = [
  { id: 'propane-furnace', name: 'Propane Furnace', icon: Flame },
  { id: 'water-system', name: 'Water System', icon: Droplets },
  { id: 'hrv-ventilation', name: 'HRV Ventilation', icon: Wind },
  { id: 'electrical', name: 'Electrical', icon: Zap },
];

const priorities = [
  { value: 'high' as const, label: 'High', color: 'text-[#d45d4e]' },
  { value: 'medium' as const, label: 'Medium', color: 'text-[#f7931e]' },
  { value: 'low' as const, label: 'Low', color: 'text-[#6a994e]' },
];

export const LogMaintenanceModal: React.FC<LogMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<MaintenanceTaskInput>({
    system: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.system) {
      newErrors.system = 'Please select a system';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Connect to backend API to save the task
      // For now, we'll just call the onSave callback if provided
      if (onSave) {
        onSave(formData);
      }

      // Reset form
      setFormData({
        system: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
      });
      setErrors({});

      // Show success message (you could add a toast notification here)
      alert('Maintenance task logged successfully!');

      // Close modal
      onClose();
    } catch (error) {
      console.error('Failed to save maintenance task:', error);
      alert('Failed to save maintenance task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      system: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#f4e8d8] mb-2">Log Maintenance Task</h2>
              <p className="text-[#d4a373]">Record a completed or scheduled maintenance activity</p>
            </div>
            <button
              onClick={handleClose}
              className="text-[#d4a373] hover:text-[#f4e8d8] transition-colors p-2 hover:bg-[#2a2a2a]/50 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* System Selection */}
            <div>
              <label className="block text-sm font-medium text-[#f4e8d8] mb-3">
                System *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {systems.map((system) => {
                  const Icon = system.icon;
                  return (
                    <button
                      key={system.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, system: system.name });
                        setErrors({ ...errors, system: '' });
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.system === system.name
                          ? 'border-[#ff6a00] bg-[#ff6a00]/10 text-[#f4e8d8]'
                          : 'border-[#d4a373]/20 bg-[#2a2a2a]/40 text-[#d4a373] hover:border-[#ff6a00]/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{system.name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.system && (
                <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.system}
                </p>
              )}
            </div>

            {/* Task Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                Task Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: '' });
                }}
                placeholder="e.g., Replace furnace filter"
                className={`w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 ${
                  errors.title ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any notes or details about this maintenance task..."
                rows={4}
                className="w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 border-[#d4a373]/30 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300 resize-none"
              />
            </div>

            {/* Due Date and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                  Due Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4a373]" />
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => {
                      setFormData({ ...formData, dueDate: e.target.value });
                      setErrors({ ...errors, dueDate: '' });
                    }}
                    className={`w-full pl-12 pr-4 py-3 bg-[#2a2a2a]/60 border-b-2 ${
                      errors.dueDate ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                    } text-[#f4e8d8] rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-[#f4e8d8] mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: priority.value })}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                        formData.priority === priority.value
                          ? 'border-[#ff6a00] bg-[#ff6a00]/10 text-[#f4e8d8]'
                          : `border-[#d4a373]/20 bg-[#2a2a2a]/40 ${priority.color} hover:border-[#ff6a00]/40`
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#d4a373]/10">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-[#d4a373] hover:text-[#f4e8d8] hover:bg-[#2a2a2a]/50 rounded-xl transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-[#f4e8d8] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogMaintenanceModal;
