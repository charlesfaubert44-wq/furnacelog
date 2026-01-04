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
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-stone-50">
          Maintenance Summary
        </h3>
        <p className="text-sm text-stone-400 mt-1">
          Track your upcoming and overdue tasks
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 border border-red-800/40 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-3xl font-bold text-red-300">
              {overdueCount}
            </span>
          </div>
          <p className="text-xs text-red-400 font-medium text-center uppercase tracking-wide">
            Overdue
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-950/60 to-amber-900/40 border border-amber-800/40 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <span className="text-3xl font-bold text-amber-300">
              {dueSoonCount}
            </span>
          </div>
          <p className="text-xs text-amber-400 font-medium text-center uppercase tracking-wide">
            This Week
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-950/60 to-sky-900/40 border border-sky-800/40 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-sky-400" />
            <span className="text-3xl font-bold text-sky-300">
              {upcomingCount}
            </span>
          </div>
          <p className="text-xs text-sky-400 font-medium text-center uppercase tracking-wide">
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
              'flex items-start gap-4 rounded-xl p-4 transition-all cursor-pointer border-2',
              task.status === 'overdue' && 'bg-red-950/30 border-red-900/50 hover:border-red-800/70',
              task.status === 'due-soon' && 'bg-amber-950/30 border-amber-900/50 hover:border-amber-800/70',
              task.status === 'upcoming' && 'bg-stone-800/50 border-stone-700 hover:border-stone-600'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                task.status === 'overdue' && 'bg-red-900/40 text-red-400',
                task.status === 'due-soon' && 'bg-amber-900/40 text-amber-400',
                task.status === 'upcoming' && 'bg-stone-700 text-stone-300'
              )}
            >
              {task.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-stone-100 text-sm">
                {task.title}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">{task.system}</p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
                  task.status === 'overdue' && 'bg-red-900/40 text-red-300',
                  task.status === 'due-soon' && 'bg-amber-900/40 text-amber-300',
                  task.status === 'upcoming' && 'bg-stone-700 text-stone-300'
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
