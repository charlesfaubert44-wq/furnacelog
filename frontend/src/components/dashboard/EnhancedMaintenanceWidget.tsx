import React, { useState, useMemo } from 'react';
import { CheckCircle2, ArrowUpDown, MoreVertical, Check, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MaintenanceTask {
  id: string;
  title: string;
  system: string;
  dueDate: Date;
  status: 'overdue' | 'due-soon' | 'upcoming';
  priority: 'critical' | 'high' | 'medium' | 'low';
  difficulty?: 'diy-easy' | 'diy-moderate' | 'professional';
  estimatedCost?: { min: number; max: number };
}

type FilterType = 'all' | 'overdue' | 'due-soon' | 'upcoming';
type SortType = 'dueDate' | 'priority' | 'system';

interface EnhancedMaintenanceWidgetProps {
  tasks: MaintenanceTask[];
  overdueCount: number;
  dueSoonCount: number;
  onTaskClick?: (taskId: string) => void;
  onMarkComplete?: (taskId: string) => void;
  onHireContractor?: (taskId: string) => void;
  onReschedule?: (taskId: string) => void;
}

/**
 * EnhancedMaintenanceWidget Component
 * Displays maintenance tasks with filtering, sorting, and actions
 */
export const EnhancedMaintenanceWidget: React.FC<EnhancedMaintenanceWidgetProps> = ({
  tasks,
  overdueCount,
  dueSoonCount,
  onTaskClick,
  onMarkComplete,
  onHireContractor,
  onReschedule
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(task => task.status === activeFilter);
    }

    // Apply sort
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'system') {
        return a.system.localeCompare(b.system);
      }
      return 0;
    });

    return filtered;
  }, [tasks, activeFilter, sortBy]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'overdue':
        return {
          bg: 'bg-warm-coral/5 border-warm-coral/30 hover:border-warm-coral/50 hover:bg-warm-coral/10',
          badge: 'bg-warm-coral/20 text-warm-coral border-warm-coral/30',
          icon: 'text-warm-coral'
        };
      case 'due-soon':
        return {
          bg: 'bg-warm-orange/5 border-warm-orange/30 hover:border-warm-orange/50 hover:bg-warm-orange/10',
          badge: 'bg-warm-orange/20 text-warm-orange border-warm-orange/30',
          icon: 'text-warm-orange'
        };
      default:
        return {
          bg: 'bg-soft-amber/5 border-soft-amber/20 hover:border-soft-amber/40 hover:bg-soft-amber/10',
          badge: 'bg-soft-amber/20 text-soft-amber border-soft-amber/30',
          icon: 'text-soft-amber'
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: 'bg-warm-coral/20 text-warm-coral border-warm-coral/30',
      high: 'bg-warm-orange/20 text-warm-orange border-warm-orange/30',
      medium: 'bg-soft-amber/20 text-soft-amber border-soft-amber/30',
      low: 'bg-warm-gray/20 text-warm-gray border-warm-gray/30'
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  return (
    <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-charcoal">Upcoming Maintenance</h3>
          <button
            onClick={() => setSortBy(sortBy === 'dueDate' ? 'priority' : sortBy === 'priority' ? 'system' : 'dueDate')}
            className="p-2 text-warm-gray hover:text-charcoal hover:bg-cream rounded-lg transition-colors"
            title={`Sort by: ${sortBy}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-warm-gray">Track and manage your maintenance tasks</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all flex-shrink-0",
            activeFilter === 'all'
              ? 'bg-burnt-sienna text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          All Tasks
        </button>
        <button
          onClick={() => setActiveFilter('overdue')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 flex-shrink-0",
            activeFilter === 'overdue'
              ? 'bg-warm-coral text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          Overdue
          {overdueCount > 0 && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold",
              activeFilter === 'overdue' ? 'bg-white/20' : 'bg-warm-coral/20 text-warm-coral'
            )}>
              {overdueCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter('due-soon')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 flex-shrink-0",
            activeFilter === 'due-soon'
              ? 'bg-warm-orange text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          This Week
          {dueSoonCount > 0 && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold",
              activeFilter === 'due-soon' ? 'bg-white/20' : 'bg-warm-orange/20 text-warm-orange'
            )}>
              {dueSoonCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={cn(
            "px-4 py-2 rounded-xl font-medium text-sm transition-all flex-shrink-0",
            activeFilter === 'upcoming'
              ? 'bg-soft-amber text-white shadow-md'
              : 'bg-cream text-warm-gray hover:bg-soft-beige'
          )}
        >
          Upcoming
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-sage mx-auto mb-4" />
            <p className="text-warm-gray font-medium">
              {activeFilter === 'all' ? 'No maintenance tasks' : `No ${activeFilter} tasks`}
            </p>
            <p className="text-warm-gray/70 text-sm mt-1">
              {activeFilter === 'all' ? "You're all caught up!" : 'Select another filter to view more tasks'}
            </p>
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => {
            const styles = getStatusStyles(task.status);
            return (
              <div
                key={task.id}
                className={cn(
                  "group p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                  styles.bg
                )}
                onClick={() => onTaskClick?.(task.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-charcoal mb-1 line-clamp-1">
                          {task.title}
                        </h4>
                        <p className="text-xs text-warm-gray">{task.system}</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Due Date Badge */}
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-lg border font-medium",
                        styles.badge
                      )}>
                        {task.dueDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                      </span>

                      {/* Priority Badge */}
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-lg border font-medium capitalize",
                        getPriorityBadge(task.priority)
                      )}>
                        {task.priority}
                      </span>

                      {/* Difficulty Badge (if available) */}
                      {task.difficulty && (
                        <span className="text-xs px-2 py-1 rounded-lg border font-medium bg-warm-white text-warm-gray border-warm-gray/30">
                          {task.difficulty === 'diy-easy' && 'DIY Easy'}
                          {task.difficulty === 'diy-moderate' && 'DIY Moderate'}
                          {task.difficulty === 'professional' && 'Pro Required'}
                        </span>
                      )}

                      {/* Estimated Cost (if available) */}
                      {task.estimatedCost && (
                        <span className="text-xs px-2 py-1 rounded-lg border font-medium bg-warm-white text-warm-gray border-warm-gray/30">
                          ${task.estimatedCost.min}-${task.estimatedCost.max}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === task.id ? null : task.id);
                      }}
                      className="p-2 text-warm-gray hover:text-charcoal hover:bg-cream rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === task.id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }}
                        />

                        {/* Menu */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-soft-amber/20 rounded-xl shadow-lg py-2 z-20">
                          {onMarkComplete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkComplete(task.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Mark Complete
                            </button>
                          )}
                          {onHireContractor && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onHireContractor(task.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Hire Contractor
                            </button>
                          )}
                          {onReschedule && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onReschedule(task.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                              Reschedule
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EnhancedMaintenanceWidget;
