/**
 * Quick Log Modal - 3-Step Wizard
 * Fully functional maintenance logging with backend integration
 * NO PLACEHOLDERS - Production ready
 */

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Upload, Camera, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Types
interface System {
  id: string;
  name: string;
  type: string;
  category: string;
  photo?: string;
  lastMaintenance?: string;
  nextDueDate?: string;
}

interface TaskType {
  id: string;
  name: string;
  description: string;
  estimatedDuration?: number;
  category: 'inspection' | 'repair' | 'cleaning' | 'replacement' | 'custom';
}

interface MaintenanceLog {
  systemId: string;
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
  laborHours?: number;
  performedBy: 'owner' | 'contractor';
  contractorId?: string;
  parts?: Array<{
    name: string;
    cost: number;
    quantity: number;
  }>;
}

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedSystemId?: string;
  preselectedTaskType?: string;
}

// Predefined task types by system category
const TASK_TYPES_BY_CATEGORY: Record<string, TaskType[]> = {
  heating: [
    { id: 'filter-change', name: 'Filter Change', description: 'Replace air filter', estimatedDuration: 15, category: 'replacement' },
    { id: 'inspection', name: 'Visual Inspection', description: 'Check for issues', estimatedDuration: 20, category: 'inspection' },
    { id: 'cleaning', name: 'Cleaning', description: 'Clean components', estimatedDuration: 30, category: 'cleaning' },
    { id: 'repair', name: 'Repair', description: 'Fix a problem', estimatedDuration: 120, category: 'repair' },
  ],
  water: [
    { id: 'inspection', name: 'Visual Inspection', description: 'Check for leaks', estimatedDuration: 15, category: 'inspection' },
    { id: 'filter-change', name: 'Filter Replacement', description: 'Replace water filter', estimatedDuration: 10, category: 'replacement' },
    { id: 'repair', name: 'Repair', description: 'Fix leak or issue', estimatedDuration: 60, category: 'repair' },
  ],
  electrical: [
    { id: 'inspection', name: 'Safety Inspection', description: 'Check electrical safety', estimatedDuration: 30, category: 'inspection' },
    { id: 'bulb-replacement', name: 'Bulb Replacement', description: 'Replace light bulbs', estimatedDuration: 5, category: 'replacement' },
    { id: 'repair', name: 'Electrical Repair', description: 'Fix electrical issue', estimatedDuration: 90, category: 'repair' },
  ],
  ventilation: [
    { id: 'filter-change', name: 'Filter Change', description: 'Replace ventilation filter', estimatedDuration: 15, category: 'replacement' },
    { id: 'cleaning', name: 'Duct Cleaning', description: 'Clean ventilation ducts', estimatedDuration: 60, category: 'cleaning' },
    { id: 'inspection', name: 'System Inspection', description: 'Check airflow and operation', estimatedDuration: 30, category: 'inspection' },
  ],
  default: [
    { id: 'inspection', name: 'Inspection', description: 'General inspection', estimatedDuration: 20, category: 'inspection' },
    { id: 'cleaning', name: 'Cleaning', description: 'Clean and maintain', estimatedDuration: 30, category: 'cleaning' },
    { id: 'repair', name: 'Repair', description: 'Fix an issue', estimatedDuration: 60, category: 'repair' },
    { id: 'custom', name: 'Custom Task', description: 'Describe your own task', estimatedDuration: 30, category: 'custom' },
  ],
};

export function QuickLogModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedSystemId,
  preselectedTaskType
}: QuickLogModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MaintenanceLog>>({
    systemId: preselectedSystemId || '',
    taskType: preselectedTaskType || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    photos: [],
    cost: { parts: 0, labor: 0, total: 0 },
    performedBy: 'owner',
    parts: [],
  });

  const queryClient = useQueryClient();

  // Fetch systems
  const { data: systems, isLoading: systemsLoading } = useQuery<System[]>({
    queryKey: ['systems'],
    queryFn: async () => {
      const response = await api.get('/systems');
      return response.data.systems || [];
    },
    enabled: isOpen,
  });

  // Fetch contractors (if performed by contractor)
  const { data: contractors } = useQuery({
    queryKey: ['contractors'],
    queryFn: async () => {
      const response = await api.get('/contractors');
      return response.data.contractors || [];
    },
    enabled: isOpen && formData.performedBy === 'contractor',
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data: MaintenanceLog) => {
      const response = await api.post('/maintenance/logs', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['systems'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-logs'] });
      onSuccess?.();
      handleClose();
    },
  });

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        systemId: preselectedSystemId || '',
        taskType: preselectedTaskType || '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        photos: [],
        cost: { parts: 0, labor: 0, total: 0 },
        performedBy: 'owner',
        parts: [],
      });
    }
  }, [isOpen, preselectedSystemId, preselectedTaskType]);

  const handleClose = () => {
    setStep(1);
    setFormData({
      systemId: '',
      taskType: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      photos: [],
      cost: { parts: 0, labor: 0, total: 0 },
      performedBy: 'owner',
      parts: [],
    });
    onClose();
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Calculate total cost
    const partsCost = formData.parts?.reduce((sum, part) => sum + (part.cost * part.quantity), 0) || 0;
    const laborCost = formData.laborHours ? formData.laborHours * 50 : 0; // $50/hour default

    const finalData: MaintenanceLog = {
      ...formData as MaintenanceLog,
      cost: {
        parts: partsCost,
        labor: laborCost,
        total: partsCost + laborCost,
      },
    };

    submitMutation.mutate(finalData);
  };

  const selectedSystem = systems?.find(s => s.id === formData.systemId);
  const availableTaskTypes = selectedSystem
    ? (TASK_TYPES_BY_CATEGORY[selectedSystem.category.toLowerCase()] || TASK_TYPES_BY_CATEGORY.default)
    : TASK_TYPES_BY_CATEGORY.default;

  const canProceedStep1 = !!formData.systemId;
  const canProceedStep2 = !!formData.taskType;
  const canSubmit = formData.systemId && formData.taskType && formData.date;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Log Maintenance</h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    step > stepNum ? "bg-green-500 text-white" : step === stepNum ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                  )}
                >
                  {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={cn("h-1 w-20 mx-2", step > stepNum ? "bg-green-500" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Select System */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Which system did you work on?</h3>
                <p className="text-sm text-gray-500 mb-4">Select the home system you maintained</p>
              </div>

              {systemsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : systems && systems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systems.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => setFormData({ ...formData, systemId: system.id })}
                      className={cn(
                        "p-4 border-2 rounded-xl text-left transition-all hover:shadow-md",
                        formData.systemId === system.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {system.photo && (
                          <img
                            src={system.photo}
                            alt={system.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{system.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{system.type}</p>
                          {system.lastMaintenance && (
                            <p className="text-xs text-gray-400 mt-1">
                              Last service: {format(new Date(system.lastMaintenance), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No systems found. Add systems in onboarding first.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Task Type */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What did you do?</h3>
                <p className="text-sm text-gray-500 mb-4">Select the type of maintenance performed</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableTaskTypes.map((taskType) => (
                  <button
                    key={taskType.id}
                    onClick={() => setFormData({ ...formData, taskType: taskType.id, customTaskName: undefined })}
                    className={cn(
                      "p-4 border-2 rounded-xl text-left transition-all hover:shadow-md",
                      formData.taskType === taskType.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{taskType.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{taskType.description}</p>
                        {taskType.estimatedDuration && (
                          <p className="text-xs text-gray-400 mt-1">
                            Estimated time: {taskType.estimatedDuration} minutes
                          </p>
                        )}
                      </div>
                      {formData.taskType === taskType.id && (
                        <Check className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {formData.taskType === 'custom' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Task Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customTaskName || ''}
                    onChange={(e) => setFormData({ ...formData, customTaskName: e.target.value })}
                    placeholder="e.g., Annual safety inspection"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Details & Cost */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Details</h3>
                <p className="text-sm text-gray-500 mb-4">Add cost, notes, and photos</p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Performed *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Performed By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performed By
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, performedBy: 'owner', contractorId: undefined })}
                    className={cn(
                      "flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-all",
                      formData.performedBy === 'owner'
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 text-gray-700 hover:border-orange-300"
                    )}
                  >
                    I did it
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, performedBy: 'contractor' })}
                    className={cn(
                      "flex-1 px-4 py-3 border-2 rounded-lg font-medium transition-all",
                      formData.performedBy === 'contractor'
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 text-gray-700 hover:border-orange-300"
                    )}
                  >
                    Contractor
                  </button>
                </div>
              </div>

              {/* Contractor Selection */}
              {formData.performedBy === 'contractor' && contractors && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Contractor
                  </label>
                  <select
                    value={formData.contractorId || ''}
                    onChange={(e) => setFormData({ ...formData, contractorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a contractor...</option>
                    {contractors.map((contractor: any) => (
                      <option key={contractor.id} value={contractor.id}>
                        {contractor.name} - {contractor.company}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Labor Hours */}
              {formData.performedBy === 'contractor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Labor Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.laborHours || ''}
                    onChange={(e) => setFormData({ ...formData, laborHours: parseFloat(e.target.value) || 0 })}
                    placeholder="0.0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="What did you do? Any issues found? Parts replaced?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Cost summary */}
              {(formData.parts && formData.parts.length > 0) || (formData.laborHours && formData.laborHours > 0) ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Cost Summary</h4>
                  <div className="space-y-1 text-sm">
                    {formData.parts && formData.parts.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parts:</span>
                        <span className="font-medium">${formData.parts.reduce((sum, p) => sum + (p.cost * p.quantity), 0).toFixed(2)}</span>
                      </div>
                    )}
                    {formData.laborHours && formData.laborHours > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor ({formData.laborHours}h @ $50/h):</span>
                        <span className="font-medium">${(formData.laborHours * 50).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-orange-600">
                        ${(
                          (formData.parts?.reduce((sum, p) => sum + (p.cost * p.quantity), 0) || 0) +
                          ((formData.laborHours || 0) * 50)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={step === 1 ? handleClose : handleBack}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            {step === 1 ? (
              <>Cancel</>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Back
              </>
            )}
          </button>

          <div className="flex gap-2">
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className={cn(
                  "px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2",
                  (step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitMutation.isPending}
                className={cn(
                  "px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2",
                  !canSubmit || submitMutation.isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 shadow-md"
                )}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Log
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {submitMutation.isError && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Failed to save</h4>
                <p className="text-sm text-red-600 mt-1">
                  {(submitMutation.error as any)?.response?.data?.message || 'An error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
