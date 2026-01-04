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
    <div className="bg-gradient-to-br from-[#2d1f1a] to-[#1a1412] border border-[#f4e8d8]/10 rounded-2xl p-8 h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(255,107,53,0.15)] transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#f4e8d8]">
          System Status
        </h3>
        <p className="text-sm text-[#d4a373] mt-1">
          Monitor your critical home systems
        </p>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system) => (
          <div
            key={system.id}
            className="bg-gradient-to-br from-[#3d3127] to-[#2d1f1a] border border-[#f4e8d8]/10 hover:border-[#ff6b35]/30 rounded-xl p-5 transition-all duration-300 cursor-pointer group hover:shadow-[0_8px_24px_rgba(255,107,53,0.2)] hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-105 ${
                  system.status === 'healthy'
                    ? 'bg-gradient-to-br from-[#6a994e] to-[#7ea88f] shadow-[0_4px_16px_rgba(106,153,78,0.4)]'
                    : system.status === 'warning'
                    ? 'bg-gradient-to-br from-[#f2a541] to-[#f7931e] shadow-[0_4px_16px_rgba(242,165,65,0.4)]'
                    : 'bg-gradient-to-br from-[#d45d4e] to-[#d4734e] shadow-[0_4px_16px_rgba(212,93,78,0.4)]'
                }`}
              >
                <system.icon className="h-7 w-7 text-[#f4e8d8]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[#f4e8d8]">
                    {system.name}
                  </h4>
                  {system.status === 'healthy' && (
                    <CheckCircle2 className="h-4 w-4 text-[#6a994e] flex-shrink-0" />
                  )}
                  {system.status === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-[#f2a541] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#d4a373]">
                  Last service: {system.lastService}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#f4e8d8]/10">
              <span className="text-xs text-[#d4a373] uppercase tracking-wide font-medium">
                Health Score
              </span>
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      className="stroke-[#3d3127]"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      className={
                        system.status === 'healthy'
                          ? 'stroke-[#6a994e]'
                          : system.status === 'warning'
                          ? 'stroke-[#f2a541]'
                          : 'stroke-[#d45d4e]'
                      }
                      strokeWidth="3"
                      strokeDasharray={`${system.health * 0.942} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#f4e8d8]">
                    {system.health}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    system.status === 'healthy'
                      ? 'bg-[#6a994e]/20 text-[#6a994e] border-[#6a994e]/30'
                      : system.status === 'warning'
                      ? 'bg-[#f2a541]/20 text-[#f2a541] border-[#f2a541]/30'
                      : 'bg-[#d45d4e]/20 text-[#d45d4e] border-[#d45d4e]/30'
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
