/**
 * RecommendationsPanel Component
 * Weather-integrated intelligent maintenance recommendations
 */

import { useQuery } from '@tanstack/react-query';
import { Cloud, Thermometer, Wind, Droplets, X, Clock, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  urgencyScore: number; // 0-100
  priority: 'critical' | 'high' | 'medium' | 'low';
  system: {
    id: string;
    type: string;
    name: string;
  };
  action: string;
  estimatedTime: string;
  weather?: {
    condition: string;
    temperature: {
      current: number;
      low: number;
      high: number;
    };
  };
  actions: Array<{
    label: string;
    type: 'log' | 'schedule' | 'contact' | 'dismiss';
  }>;
}

export function RecommendationsPanel() {
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ['weather-recommendations'],
    queryFn: async () => {
      const response = await api.get('/weather/recommendations');
      return response.data.recommendations || [];
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const handleAction = (rec: Recommendation, actionType: string) => {
    switch (actionType) {
      case 'log':
        window.dispatchEvent(new CustomEvent('open-quick-log', {
          detail: { systemId: rec.system.id },
        }));
        break;
      case 'schedule':
        window.dispatchEvent(new CustomEvent('open-schedule-task', {
          detail: { systemId: rec.system.id },
        }));
        break;
      case 'contact':
        window.location.href = '/contractors';
        break;
      case 'dismiss':
        // Handle dismiss
        break;
    }
  };

  const getGradient = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'critical':
        return 'from-red-500 to-orange-500';
      case 'high':
        return 'from-orange-500 to-yellow-500';
      case 'medium':
        return 'from-yellow-500 to-green-500';
      case 'low':
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Cloud className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">
            No urgent maintenance recommendations at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
        <Badge variant="outline" className="text-sm">
          {recommendations.length} active
        </Badge>
      </div>

      {recommendations.map(rec => (
        <Card
          key={rec.id}
          className={cn(
            'border-l-4 overflow-hidden hover:shadow-lg transition-shadow',
            rec.priority === 'critical' && 'border-l-red-500',
            rec.priority === 'high' && 'border-l-orange-500',
            rec.priority === 'medium' && 'border-l-yellow-500',
            rec.priority === 'low' && 'border-l-blue-500'
          )}
        >
          <div className={cn('h-2 bg-gradient-to-r', getGradient(rec.priority))} />

          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{rec.title}</h3>
                  <Badge
                    className={cn(
                      'text-xs font-semibold',
                      rec.priority === 'critical' && 'bg-red-100 text-red-700',
                      rec.priority === 'high' && 'bg-orange-100 text-orange-700',
                      rec.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                      rec.priority === 'low' && 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {rec.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-3">{rec.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    <span className="capitalize">{rec.system.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{rec.estimatedTime}</span>
                  </div>
                  <div className={cn('flex items-center gap-1 font-semibold', getUrgencyColor(rec.urgencyScore))}>
                    <span>Urgency: {rec.urgencyScore}/100</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction(rec, 'dismiss')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Weather info */}
            {rec.weather && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">
                        {rec.weather.temperature.current}°C
                      </p>
                      <p className="text-xs text-blue-700">
                        L: {rec.weather.temperature.low}° H: {rec.weather.temperature.high}°
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-blue-800">
                    {rec.weather.condition}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {rec.actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAction(rec, action.type)}
                  className={idx === 0 ? 'bg-primary' : ''}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
