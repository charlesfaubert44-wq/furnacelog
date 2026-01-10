/**
 * MaintenanceHistoryTab Component
 * Timeline view of all maintenance activities for a system
 */

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Wrench, Check, AlertCircle, DollarSign, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MaintenanceLog {
  id: string;
  taskType: string;
  date: string;
  notes: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  performedBy: 'owner' | 'contractor';
  contractor?: {
    id: string;
    name: string;
    company?: string;
  };
  cost: {
    parts: number;
    labor: number;
    total: number;
  };
  parts?: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  photos?: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
  duration?: number; // minutes
}

interface MaintenanceHistoryTabProps {
  systemId: string;
}

export function MaintenanceHistoryTab({ systemId }: MaintenanceHistoryTabProps) {
  const { data: logs, isLoading } = useQuery<MaintenanceLog[]>({
    queryKey: ['maintenance-history', systemId],
    queryFn: async () => {
      const response = await api.get(`/maintenance/logs?systemId=${systemId}&sort=-date`);
      return response.data.logs || [];
    },
  });

  const handleQuickLog = () => {
    window.dispatchEvent(new CustomEvent('open-quick-log', {
      detail: { systemId },
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Maintenance History</h3>
        <p className="text-gray-600 mb-6">
          Start tracking maintenance for this system by logging your first activity
        </p>
        <Button onClick={handleQuickLog}>
          <Wrench className="h-4 w-4 mr-2" />
          Log First Maintenance
        </Button>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'repair':
        return <Wrench className="h-5 w-5 text-white" />;
      case 'routine':
        return <Check className="h-5 w-5 text-white" />;
      case 'inspection':
        return <AlertCircle className="h-5 w-5 text-white" />;
      case 'emergency':
        return <AlertCircle className="h-5 w-5 text-white" />;
      default:
        return <Wrench className="h-5 w-5 text-white" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'repair':
        return 'bg-orange-500 border-orange-600';
      case 'routine':
        return 'bg-green-500 border-green-600';
      case 'inspection':
        return 'bg-blue-500 border-blue-600';
      case 'emergency':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Timeline container */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline items */}
        {logs.map((log, index) => (
          <div key={log.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline dot */}
            <div
              className={cn(
                'relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4',
                getTypeColor(log.type)
              )}
            >
              {getTypeIcon(log.type)}
            </div>

            {/* Content card */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{log.taskType}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(log.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>
                          {log.performedBy === 'owner'
                            ? 'You'
                            : log.contractor?.name || 'Contractor'}
                        </span>
                      </div>
                      {log.duration && (
                        <span className="text-gray-500">{log.duration} min</span>
                      )}
                    </div>
                  </div>

                  {/* Cost badge */}
                  {log.cost.total > 0 && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${log.cost.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Total Cost</div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Notes */}
                {log.notes && (
                  <div>
                    <p className="text-sm text-gray-700">{log.notes}</p>
                  </div>
                )}

                {/* Photos */}
                {log.photos && log.photos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {log.photos.map(photo => (
                      <div
                        key={photo.id}
                        className="h-24 w-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Maintenance photo'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Parts list */}
                {log.parts && log.parts.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Parts Used</h4>
                    <div className="space-y-1">
                      {log.parts.map((part, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {part.name} (×{part.quantity})
                          </span>
                          <span className="font-medium">${part.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost breakdown */}
                {log.cost.total > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Cost Breakdown</h4>
                    <div className="space-y-1">
                      {log.cost.parts > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Parts</span>
                          <span className="font-medium">${log.cost.parts.toFixed(2)}</span>
                        </div>
                      )}
                      {log.cost.labor > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Labor</span>
                          <span className="font-medium">${log.cost.labor.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-semibold border-t pt-1">
                        <span>Total</span>
                        <span>${log.cost.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Type badge */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2 py-1 rounded text-xs font-medium text-white',
                    getTypeColor(log.type)
                  )}>
                    {log.type.toUpperCase()}
                  </span>
                  {log.contractor && (
                    <span className="text-xs text-gray-500">
                      {log.contractor.company || 'Professional Service'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Add more button */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={handleQuickLog}>
          <Wrench className="h-4 w-4 mr-2" />
          Log New Maintenance
        </Button>
      </div>
    </div>
  );
}
