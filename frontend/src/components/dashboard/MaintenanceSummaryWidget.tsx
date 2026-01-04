import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Flame, Wind, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceTask {
  id: string;
  title: string;
  system: string;
  dueDate: Date;
  status: 'overdue' | 'due-soon' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Furnace Filter Replacement',
    system: 'Propane Furnace',
    dueDate: new Date('2026-01-05'),
    status: 'overdue',
    priority: 'high',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: '2',
    title: 'HRV Core Cleaning',
    system: 'HRV System',
    dueDate: new Date('2026-01-10'),
    status: 'due-soon',
    priority: 'medium',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    id: '3',
    title: 'Heat Trace Inspection',
    system: 'Freeze Protection',
    dueDate: new Date('2026-01-15'),
    status: 'upcoming',
    priority: 'high',
    icon: <Droplets className="w-4 h-4" />,
  },
];

export const MaintenanceSummaryWidget: React.FC = () => {
  const overdueCount = mockTasks.filter((t) => t.status === 'overdue').length;
  const dueSoonCount = mockTasks.filter((t) => t.status === 'due-soon').length;
  const upcomingCount = mockTasks.filter((t) => t.status === 'upcoming').length;

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(255,107,53,0.15)] transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#f4e8d8]">
          Maintenance Summary
        </h3>
        <p className="text-sm text-[#d4a373] mt-1">
          Track your upcoming and overdue tasks
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border border-[#d45d4e]/30 rounded-xl p-4 shadow-[0_4px_16px_rgba(212,93,78,0.2)]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-[#d45d4e]" />
            <span className="text-3xl font-bold text-[#f4e8d8]">
              {overdueCount}
            </span>
          </div>
          <p className="text-xs text-[#d45d4e] font-medium text-center uppercase tracking-wide">
            Overdue
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#ff9500]/20 to-[#ff9500]/10 border border-[#ff9500]/30 rounded-xl p-4 shadow-[0_4px_16px_rgba(242,165,65,0.2)]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-[#ff9500]" />
            <span className="text-3xl font-bold text-[#f4e8d8]">
              {dueSoonCount}
            </span>
          </div>
          <p className="text-xs text-[#ff9500] font-medium text-center uppercase tracking-wide">
            This Week
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#d4a373]/20 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-[#d4a373]" />
            <span className="text-3xl font-bold text-[#f4e8d8]">
              {upcomingCount}
            </span>
          </div>
          <p className="text-xs text-[#d4a373] font-medium text-center uppercase tracking-wide">
            Upcoming
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex items-start gap-4 rounded-xl p-4 transition-all duration-300 cursor-pointer border',
              task.status === 'overdue' && 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#d45d4e]/30 hover:border-[#d45d4e]/50 hover:shadow-[0_4px_16px_rgba(212,93,78,0.2)]',
              task.status === 'due-soon' && 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#ff9500]/30 hover:border-[#ff9500]/50 hover:shadow-[0_4px_16px_rgba(242,165,65,0.2)]',
              task.status === 'upcoming' && 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-[#f4e8d8]/10 hover:border-[#ff4500]/30 hover:shadow-[0_4px_16px_rgba(255,107,53,0.15)]'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)]',
                task.status === 'overdue' && 'bg-gradient-to-br from-[#d45d4e] to-[#d4734e] text-[#f4e8d8]',
                task.status === 'due-soon' && 'bg-gradient-to-br from-[#ff9500] to-[#ff6a00] text-[#f4e8d8]',
                task.status === 'upcoming' && 'bg-gradient-to-br from-[#d4a373] to-[#ff8c00] text-[#f4e8d8]'
              )}
            >
              {task.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#f4e8d8] text-sm">
                {task.title}
              </h4>
              <p className="text-xs text-[#d4a373] mt-0.5">{task.system}</p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                  task.status === 'overdue' && 'bg-[#d45d4e]/20 text-[#d45d4e] border-[#d45d4e]/30',
                  task.status === 'due-soon' && 'bg-[#ff9500]/20 text-[#ff9500] border-[#ff9500]/30',
                  task.status === 'upcoming' && 'bg-[#d4a373]/20 text-[#d4a373] border-[#d4a373]/30'
                )}
              >
                {task.dueDate.toLocaleDateString('en-CA', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
