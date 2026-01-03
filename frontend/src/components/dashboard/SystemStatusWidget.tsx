import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Droplets, Wind, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SystemStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'healthy' | 'warning' | 'critical';
  lastService: string;
  health: number;
}

const systems: SystemStatus[] = [
  {
    id: '1',
    name: 'Heating System',
    icon: Flame,
    status: 'healthy',
    lastService: '2 weeks ago',
    health: 94,
  },
  {
    id: '2',
    name: 'Water System',
    icon: Droplets,
    status: 'warning',
    lastService: '3 months ago',
    health: 68,
  },
  {
    id: '3',
    name: 'Ventilation (HRV)',
    icon: Wind,
    status: 'healthy',
    lastService: '1 month ago',
    health: 88,
  },
  {
    id: '4',
    name: 'Electrical',
    icon: Zap,
    status: 'healthy',
    lastService: '6 months ago',
    health: 96,
  },
];

export const SystemStatusWidget: React.FC = () => {
  return (
    <Card elevation="elevated">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {systems.map((system) => (
          <div
            key={system.id}
            className="flex items-center gap-3 rounded-lg border border-aluminum-200 p-3 hover:border-tech-blue-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                system.status === 'healthy'
                  ? 'bg-system-green-100'
                  : system.status === 'warning'
                  ? 'bg-caution-yellow-100'
                  : 'bg-flame-red-100'
              }`}
            >
              <system.icon
                className={`h-5 w-5 ${
                  system.status === 'healthy'
                    ? 'text-system-green-600'
                    : system.status === 'warning'
                    ? 'text-caution-yellow-600'
                    : 'text-flame-red-600'
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{system.name}</h4>
                {system.status === 'healthy' && (
                  <CheckCircle2 className="h-4 w-4 text-system-green-600" />
                )}
                {system.status === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-caution-yellow-600" />
                )}
              </div>
              <p className="text-micro text-aluminum-500">
                Last service: {system.lastService}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-graphite-900">
                {system.health}%
              </div>
              <Badge
                variant={
                  system.status === 'healthy'
                    ? 'success'
                    : system.status === 'warning'
                    ? 'warning'
                    : 'error'
                }
              >
                {system.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
