import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceTask {
  id: string;
  title: string;
  system: string;
  dueDate: Date;
  status: 'overdue' | 'due-soon' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Furnace Filter Replacement',
    system: 'Heating',
    dueDate: new Date('2026-01-05'),
    status: 'overdue',
    priority: 'high',
  },
  {
    id: '2',
    title: 'HRV Core Cleaning',
    system: 'Ventilation',
    dueDate: new Date('2026-01-10'),
    status: 'due-soon',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Heat Trace Inspection',
    system: 'Freeze Protection',
    dueDate: new Date('2026-01-15'),
    status: 'upcoming',
    priority: 'high',
  },
];

export const MaintenanceSummaryWidget: React.FC = () => {
  const overdueCount = mockTasks.filter((t) => t.status === 'overdue').length;
  const dueSoonCount = mockTasks.filter((t) => t.status === 'due-soon').length;
  const upcomingCount = mockTasks.filter((t) => t.status === 'upcoming').length;

  return (
    <Card elevation="elevated">
      <CardHeader>
        <CardTitle>Maintenance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-flame-red-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertCircle className="h-4 w-4 text-flame-red-600" />
              <span className="text-2xl font-bold text-flame-red-700">
                {overdueCount}
              </span>
            </div>
            <p className="text-micro text-flame-red-600 font-medium">Overdue</p>
          </div>

          <div className="rounded-lg bg-caution-yellow-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-caution-yellow-600" />
              <span className="text-2xl font-bold text-caution-yellow-700">
                {dueSoonCount}
              </span>
            </div>
            <p className="text-micro text-caution-yellow-600 font-medium">
              Due This Week
            </p>
          </div>

          <div className="rounded-lg bg-tech-blue-50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="h-4 w-4 text-tech-blue-600" />
              <span className="text-2xl font-bold text-tech-blue-700">
                {upcomingCount}
              </span>
            </div>
            <p className="text-micro text-tech-blue-600 font-medium">Upcoming</p>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {mockTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'flex items-center justify-between rounded-lg border-2 p-3 transition-all hover:shadow-md cursor-pointer',
                task.status === 'overdue' && 'border-flame-red-200 bg-flame-red-50',
                task.status === 'due-soon' && 'border-caution-yellow-200 bg-caution-yellow-50',
                task.status === 'upcoming' && 'border-aluminum-200 bg-white'
              )}
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{task.title}</h4>
                <p className="text-micro text-aluminum-500">{task.system}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    task.status === 'overdue'
                      ? 'error'
                      : task.status === 'due-soon'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {task.dueDate.toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
