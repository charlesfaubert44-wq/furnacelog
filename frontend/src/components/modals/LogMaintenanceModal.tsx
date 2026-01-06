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
  { value: 'high' as const, label: 'High', color: 'text-warm-coral' },
  { value: 'medium' as const, label: 'Medium', color: 'text-warm-orange' },
  { value: 'low' as const, label: 'Low', color: 'text-sage' },
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
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-md z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-warm-white to-cream border-2 border-soft-amber/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-2">Log Maintenance Task</h2>
              <p className="text-warm-gray">Record a completed or scheduled maintenance activity</p>
            </div>
            <button
              onClick={handleClose}
              className="text-warm-gray hover:text-burnt-sienna transition-colors p-2 hover:bg-soft-amber/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* System Selection */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
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
                          ? 'border-burnt-sienna bg-burnt-sienna/10 text-charcoal'
                          : 'border-soft-amber/30 bg-white text-warm-gray hover:border-burnt-sienna/50 hover:bg-soft-amber/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{system.name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.system && (
                <p className="mt-2 text-sm text-warm-coral flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.system}
                </p>
              )}
            </div>

            {/* Task Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-2">
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
                className={`w-full px-4 py-3 bg-white border-2 ${
                  errors.title ? 'border-warm-coral' : 'border-soft-amber/30'
                } text-charcoal placeholder-warm-gray/50 rounded-xl focus:outline-none focus:border-burnt-sienna focus:ring-2 focus:ring-burnt-sienna/20 transition-all duration-300`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-warm-coral flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any notes or details about this maintenance task..."
                rows={4}
                className="w-full px-4 py-3 bg-white border-2 border-soft-amber/30 text-charcoal placeholder-warm-gray/50 rounded-xl focus:outline-none focus:border-burnt-sienna focus:ring-2 focus:ring-burnt-sienna/20 transition-all duration-300 resize-none"
              />
            </div>

            {/* Due Date and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-charcoal mb-2">
                  Due Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => {
                      setFormData({ ...formData, dueDate: e.target.value });
                      setErrors({ ...errors, dueDate: '' });
                    }}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 ${
                      errors.dueDate ? 'border-warm-coral' : 'border-soft-amber/30'
                    } text-charcoal rounded-xl focus:outline-none focus:border-burnt-sienna focus:ring-2 focus:ring-burnt-sienna/20 transition-all duration-300`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="mt-2 text-sm text-warm-coral flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
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
                          ? 'border-burnt-sienna bg-burnt-sienna/10 text-charcoal'
                          : `border-soft-amber/30 bg-white ${priority.color} hover:border-burnt-sienna/50`
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-soft-amber/20">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-warm-gray hover:text-charcoal hover:bg-soft-amber/10 rounded-xl transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-md"
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
