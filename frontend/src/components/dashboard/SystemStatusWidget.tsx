import React from 'react';
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
    name: 'Propane Furnace',
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
    name: 'HRV Ventilation',
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
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-stone-50">
          System Status
        </h3>
        <p className="text-sm text-stone-400 mt-1">
          Monitor your critical home systems
        </p>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system) => (
          <div
            key={system.id}
            className="bg-stone-800 border border-stone-700 hover:border-stone-600 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                  system.status === 'healthy'
                    ? 'bg-emerald-950/60 border border-emerald-800/50'
                    : system.status === 'warning'
                    ? 'bg-amber-950/60 border border-amber-800/50'
                    : 'bg-red-950/60 border border-red-800/50'
                }`}
              >
                <system.icon
                  className={`h-6 w-6 ${
                    system.status === 'healthy'
                      ? 'text-emerald-400'
                      : system.status === 'warning'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-stone-100">
                    {system.name}
                  </h4>
                  {system.status === 'healthy' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  )}
                  {system.status === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-stone-400">
                  Last service: {system.lastService}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-stone-700">
              <span className="text-xs text-stone-400 uppercase tracking-wide">
                Health Score
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-stone-200">
                  {system.health}%
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    system.status === 'healthy'
                      ? 'bg-emerald-950/40 text-emerald-400'
                      : system.status === 'warning'
                      ? 'bg-amber-950/40 text-amber-400'
                      : 'bg-red-950/40 text-red-400'
                  }`}
                >
                  {system.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
