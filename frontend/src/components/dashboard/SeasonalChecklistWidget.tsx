import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    <Card elevation="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Winter Operations Checklist</CardTitle>
          <Badge variant="info">{progressPercentage}%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-small text-aluminum-500">
            {completedCount} of {totalCount} tasks complete
          </p>
        </div>

        {/* Checklist Items */}
        <div className="space-y-2">
          {winterChecklist.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-aluminum-200 p-3 hover:bg-aluminum-50 transition-colors cursor-pointer"
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-system-green-600 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-aluminum-300 flex-shrink-0" />
              )}
              <span
                className={`flex-1 text-sm ${
                  item.completed
                    ? 'text-aluminum-500 line-through'
                    : 'text-graphite-900'
                }`}
              >
                {item.title}
              </span>
              {item.priority === 'high' && !item.completed && (
                <Badge variant="error" className="text-micro">
                  High
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <Button variant="outline" className="w-full">
          View Full Checklist
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
