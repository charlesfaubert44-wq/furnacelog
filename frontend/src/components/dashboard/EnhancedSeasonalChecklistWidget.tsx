import React, { useState } from 'react';
import { CheckCircle2, Circle, Award, Flame, Leaf, Sun, Snowflake, ChevronDown, ChevronUp, PlayCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChecklistItem {
  id: string;
  task: string;
  system?: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'normal' | 'low';
  difficulty: 'diy-easy' | 'diy-moderate' | 'professional';
  estimatedTime?: string;
  estimatedCost?: { diy?: string; professional?: string };
  tutorialUrl?: string;
}

export interface SeasonalChecklistData {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  year: number;
  items: ChecklistItem[];
  progressPercent: number;
  streak?: number; // Seasons completed in a row
  badge?: string;
}

interface EnhancedSeasonalChecklistWidgetProps {
  data: SeasonalChecklistData;
  onItemToggle?: (itemId: string) => void;
  onHireForTask?: (itemId: string) => void;
  onViewTutorial?: (url: string) => void;
}

/**
 * EnhancedSeasonalChecklistWidget Component
 * Displays seasonal checklist with gamification (progress, streaks, badges)
 */
export const EnhancedSeasonalChecklistWidget: React.FC<EnhancedSeasonalChecklistWidgetProps> = ({
  data,
  onItemToggle,
  onHireForTask,
  onViewTutorial
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring':
        return <Leaf className="w-5 h-5" />;
      case 'summer':
        return <Sun className="w-5 h-5" />;
      case 'fall':
        return <Leaf className="w-5 h-5" />;
      case 'winter':
        return <Snowflake className="w-5 h-5" />;
      default:
        return <Flame className="w-5 h-5" />;
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring':
        return 'from-sage to-soft-sage';
      case 'summer':
        return 'from-soft-amber to-warm-orange';
      case 'fall':
        return 'from-warm-orange to-burnt-sienna';
      case 'winter':
        return 'from-winter-blue to-sage';
      default:
        return 'from-burnt-sienna to-warm-orange';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-warm-coral';
      case 'high':
        return 'text-warm-orange';
      case 'normal':
        return 'text-soft-amber';
      default:
        return 'text-warm-gray';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      'diy-easy': 'bg-sage/20 text-sage border-sage/30',
      'diy-moderate': 'bg-soft-amber/20 text-soft-amber border-soft-amber/30',
      'professional': 'bg-warm-orange/20 text-warm-orange border-warm-orange/30'
    };
    const labels = {
      'diy-easy': 'DIY Easy',
      'diy-moderate': 'DIY Moderate',
      'professional': 'Pro Required'
    };
    return { style: styles[difficulty as keyof typeof styles], label: labels[difficulty as keyof typeof labels] };
  };

  const completedItems = data.items.filter(item => item.completed).length;
  const totalItems = data.items.length;
  const displayItems = showCompleted ? data.items : data.items.filter(item => !item.completed);

  // Celebration for 100%
  const isComplete = data.progressPercent === 100;

  return (
    <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br text-white",
              getSeasonColor(data.season)
            )}>
              {getSeasonIcon(data.season)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-charcoal capitalize">
                {data.season} {data.year} Checklist
              </h3>
              <p className="text-sm text-warm-gray">
                {completedItems} of {totalItems} completed
              </p>
            </div>
          </div>

          {/* Streak Badge */}
          {data.streak && data.streak > 1 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-soft-amber/10 border border-soft-amber/30 rounded-xl">
              <Flame className="w-4 h-4 text-soft-amber" />
              <span className="text-sm font-semibold text-soft-amber">{data.streak} seasons!</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-4 bg-cream rounded-full overflow-hidden shadow-inner">
            <div
              className={cn(
                "h-full transition-all duration-500 bg-gradient-to-r",
                getSeasonColor(data.season)
              )}
              style={{ width: `${data.progressPercent}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-charcoal drop-shadow">
              {data.progressPercent}%
            </span>
          </div>
        </div>

        {/* Completion Celebration */}
        {isComplete && (
          <div className="mt-4 p-4 bg-gradient-to-r from-sage to-soft-sage rounded-xl text-white flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <div className="font-bold">Season Ready! 🎉</div>
              <div className="text-sm opacity-90">
                Your home is prepared for {data.season}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-soft-beige rounded-xl text-sm font-medium text-charcoal transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? 'Collapse' : 'Expand'}
        </button>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="px-4 py-2 bg-cream hover:bg-soft-beige rounded-xl text-sm font-medium text-charcoal transition-colors"
        >
          {showCompleted ? 'Hide' : 'Show'} Completed
        </button>
      </div>

      {/* Checklist Items */}
      {expanded && (
        <div className="space-y-3">
          {displayItems.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-sage mx-auto mb-3" />
              <p className="text-warm-gray font-medium">
                {showCompleted ? 'No items yet' : 'All tasks completed!'}
              </p>
            </div>
          ) : (
            displayItems.map((item) => {
              const difficultyBadge = getDifficultyBadge(item.difficulty);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-300",
                    item.completed
                      ? 'bg-sage/5 border-sage/30'
                      : 'bg-cream/30 border-soft-amber/20 hover:border-soft-amber/40'
                  )}
                >
                  {/* Item Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <button
                      onClick={() => onItemToggle?.(item.id)}
                      className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-sage fill-sage" />
                      ) : (
                        <Circle className={cn("w-5 h-5", getPriorityColor(item.priority))} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "text-sm font-semibold mb-1",
                        item.completed ? 'text-warm-gray line-through' : 'text-charcoal'
                      )}>
                        {item.task}
                      </h4>
                      {item.system && (
                        <p className="text-xs text-warm-gray">{item.system}</p>
                      )}
                    </div>
                  </div>

                  {/* Item Metadata */}
                  {!item.completed && (
                    <div className="flex flex-wrap items-center gap-2 ml-8 mb-3">
                      {/* Priority Badge */}
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-lg border font-medium capitalize",
                        item.priority === 'critical' && 'bg-warm-coral/20 text-warm-coral border-warm-coral/30',
                        item.priority === 'high' && 'bg-warm-orange/20 text-warm-orange border-warm-orange/30',
                        item.priority === 'normal' && 'bg-soft-amber/20 text-soft-amber border-soft-amber/30',
                        item.priority === 'low' && 'bg-warm-gray/20 text-warm-gray border-warm-gray/30'
                      )}>
                        {item.priority}
                      </span>

                      {/* Difficulty Badge */}
                      <span className={cn("text-xs px-2 py-1 rounded-lg border font-medium", difficultyBadge.style)}>
                        {difficultyBadge.label}
                      </span>

                      {/* Time Badge */}
                      {item.estimatedTime && (
                        <span className="text-xs px-2 py-1 rounded-lg border font-medium bg-warm-white text-warm-gray border-warm-gray/30">
                          {item.estimatedTime}
                        </span>
                      )}

                      {/* Cost Badge */}
                      {item.estimatedCost && (
                        <span className="text-xs px-2 py-1 rounded-lg border font-medium bg-warm-white text-warm-gray border-warm-gray/30">
                          {item.estimatedCost.diy || item.estimatedCost.professional}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {!item.completed && (
                    <div className="flex gap-2 ml-8">
                      {item.tutorialUrl && onViewTutorial && item.difficulty !== 'professional' && (
                        <button
                          onClick={() => onViewTutorial(item.tutorialUrl!)}
                          className="px-3 py-1.5 bg-white hover:bg-warm-white text-charcoal border border-soft-amber/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                        >
                          <PlayCircle className="w-3 h-3" />
                          Tutorial
                        </button>
                      )}
                      {onHireForTask && (item.difficulty === 'professional' || item.difficulty === 'diy-moderate') && (
                        <button
                          onClick={() => onHireForTask(item.id)}
                          className="px-3 py-1.5 bg-white hover:bg-warm-white text-charcoal border border-soft-amber/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                        >
                          <User className="w-3 h-3" />
                          Hire Pro
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSeasonalChecklistWidget;
