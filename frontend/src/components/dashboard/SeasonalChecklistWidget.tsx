import React from 'react';
import { CheckCircle2, ChevronRight, Snowflake } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-[#2d1f1a] to-[#1a1412] border border-[#f4e8d8]/10 rounded-2xl p-8 h-full flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(255,107,53,0.15)] transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-[#f4e8d8]">
              Winter Checklist
            </h3>
            <Snowflake className="w-5 h-5 text-[#c4d7e0]" />
          </div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-br from-[#ff6b35] to-[#f7931e] text-[#f4e8d8] shadow-[0_4px_12px_rgba(255,107,53,0.3)]">
            {progressPercentage}%
          </span>
        </div>
        <p className="text-sm text-[#d4a373]">
          Critical seasonal tasks
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-[#3d3127] rounded-full overflow-hidden mb-2 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] transition-all duration-500 shadow-[0_0_8px_rgba(255,107,53,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-[#d4a373] font-medium">
          {completedCount} of {totalCount} tasks complete
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 flex-1 mb-4">
        {winterChecklist.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#3d3127] to-[#2d1f1a] border border-[#f4e8d8]/10 hover:border-[#ff6b35]/30 rounded-xl transition-all duration-300 cursor-pointer group hover:shadow-[0_4px_16px_rgba(255,107,53,0.15)]"
          >
            {item.completed ? (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#6a994e] to-[#7ea88f] flex items-center justify-center shadow-[0_2px_8px_rgba(106,153,78,0.4)]">
                <CheckCircle2 className="h-4 w-4 text-[#f4e8d8]" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#d4a373]/40 group-hover:border-[#ff6b35] transition-colors" />
            )}
            <span
              className={`flex-1 text-sm transition-colors ${
                item.completed
                  ? 'text-[#d4a373]/60 line-through'
                  : 'text-[#f4e8d8] group-hover:text-[#f4e8d8]'
              }`}
            >
              {item.title}
            </span>
            {item.priority === 'high' && !item.completed && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#d45d4e]/20 text-[#d45d4e] border border-[#d45d4e]/30">
                High
              </span>
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button className="w-full px-4 py-3 bg-gradient-to-br from-[#3d3127] to-[#2d1f1a] hover:from-[#ff6b35]/20 hover:to-[#f7931e]/20 border border-[#f4e8d8]/20 hover:border-[#ff6b35]/40 text-[#f4e8d8] text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
        View Full Checklist
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
