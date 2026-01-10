/**
 * TimelineTab Component
 * Visual timeline of all system events
 */

import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Calendar, Wrench, FileText, DollarSign, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface TimelineEvent {
  id: string;
  type: 'installation' | 'maintenance' | 'repair' | 'inspection' | 'document' | 'cost';
  date: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface TimelineTabProps {
  systemId: string;
}

export function TimelineTab({ systemId }: TimelineTabProps) {
  const { data: events, isLoading } = useQuery<TimelineEvent[]>({
    queryKey: ['system-timeline', systemId],
    queryFn: async () => {
      const response = await api.get(`/systems/${systemId}/timeline`);
      return response.data.events || [];
    },
  });

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'installation':
        return <Calendar className="h-5 w-5" />;
      case 'maintenance':
      case 'repair':
        return <Wrench className="h-5 w-5" />;
      case 'inspection':
        return <AlertCircle className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'cost':
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'installation':
        return 'bg-purple-500 text-white';
      case 'maintenance':
        return 'bg-green-500 text-white';
      case 'repair':
        return 'bg-orange-500 text-white';
      case 'inspection':
        return 'bg-blue-500 text-white';
      case 'document':
        return 'bg-gray-500 text-white';
      case 'cost':
        return 'bg-red-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No timeline events yet</p>
      </div>
    );
  }

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = format(parseISO(event.date), 'yyyy');
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const years = Object.keys(eventsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-8">
      {years.map(year => (
        <div key={year}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 sticky top-0 bg-white py-2">
            {year}
          </h3>
          <div className="relative pl-8 border-l-2 border-gray-200">
            {eventsByYear[year].map((event, idx) => (
              <div key={event.id} className="relative mb-6 last:mb-0">
                {/* Timeline dot */}
                <div
                  className={cn(
                    'absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full',
                    getEventColor(event.type)
                  )}
                >
                  {getEventIcon(event.type)}
                </div>

                {/* Event content */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(event.date), 'MMM d')}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600">{event.description}</p>
                  )}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {event.metadata.cost && (
                        <span className="mr-3">Cost: ${event.metadata.cost}</span>
                      )}
                      {event.metadata.performedBy && (
                        <span>By: {event.metadata.performedBy}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
