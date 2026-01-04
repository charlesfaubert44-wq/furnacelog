import React from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const winterChecklist: ChecklistItem[] = [
  { id: '1', title: 'Inspect heat trace cables', completed: true, priority: 'high' },
  { id: '2', title: 'Test furnace safety systems', completed: true, priority: 'high' },
  { id: '3', title: 'Clean HRV filters', completed: false, priority: 'medium' },
  { id: '4', title: 'Check insulation in attic', completed: false, priority: 'medium' },
  { id: '5', title: 'Stock emergency supplies', completed: false, priority: 'low' },
];

export const SeasonalChecklistWidget: React.FC = () => {
  const completedCount = winterChecklist.filter((item) => item.completed).length;
  const totalCount = winterChecklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-stone-50">
            Winter Checklist
          </h3>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-950/40 text-sky-400">
            {progressPercentage}%
          </span>
        </div>
        <p className="text-sm text-stone-400">
          Critical seasonal tasks
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-stone-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-stone-400">
          {completedCount} of {totalCount} tasks complete
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 flex-1 mb-4">
        {winterChecklist.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-stone-800 border border-stone-700 hover:border-stone-600 rounded-lg transition-all cursor-pointer group"
          >
            {item.completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-stone-500 flex-shrink-0" />
            )}
            <span
              className={`flex-1 text-sm ${
                item.completed
                  ? 'text-stone-500 line-through'
                  : 'text-stone-200'
              }`}
            >
              {item.title}
            </span>
            {item.priority === 'high' && !item.completed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-950/40 text-red-400">
                High
              </span>
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button className="w-full px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
        View Full Checklist
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
