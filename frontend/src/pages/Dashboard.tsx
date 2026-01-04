import React from 'react';
import { MaintenanceSummaryWidget } from '@/components/dashboard/MaintenanceSummaryWidget';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { SystemStatusWidget } from '@/components/dashboard/SystemStatusWidget';
import { SeasonalChecklistWidget } from '@/components/dashboard/SeasonalChecklistWidget';
import { Plus, Home, Calendar, FileText, Wrench } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#d4a373] text-sm font-medium mb-2">
            {currentDate}
          </p>
          <h1 className="text-4xl font-bold text-[#f4e8d8] tracking-tight">
            Welcome Home
          </h1>
          <p className="text-[#d4a373] mt-2">
            Your home is warm and protected. Here's your maintenance overview.
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] hover:from-[#ff6a00] hover:to-[#ff4500] text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.4)] hover:shadow-[0_6px_24px_rgba(255,107,53,0.5)] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Log Maintenance
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Maintenance Summary - Spans 2 columns on xl */}
        <div className="xl:col-span-2">
          <MaintenanceSummaryWidget />
        </div>

        {/* Weather Widget */}
        <div>
          <WeatherWidget />
        </div>

        {/* System Status - Spans 2 columns on lg */}
        <div className="lg:col-span-2">
          <SystemStatusWidget />
        </div>

        {/* Seasonal Checklist */}
        <div>
          <SeasonalChecklistWidget />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(255,107,53,0.15)] transition-all duration-300">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-[#f4e8d8] mb-2">
            Quick Actions
          </h3>
          <p className="text-sm text-[#d4a373]">
            Frequently used actions to manage your home
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#6a994e]/20 hover:to-[#7ea88f]/10 border border-[#f4e8d8]/10 hover:border-[#6a994e]/40 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_24px_rgba(106,153,78,0.2)] hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#6a994e] to-[#7ea88f] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_4px_16px_rgba(106,153,78,0.4)]">
              <Home className="w-7 h-7 text-[#f4e8d8]" />
            </div>
            <span className="text-sm font-medium text-[#f4e8d8]">Add System</span>
          </button>

          <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#ff4500]/20 hover:to-[#ff6a00]/10 border border-[#f4e8d8]/10 hover:border-[#ff4500]/40 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_4px_16px_rgba(255,107,53,0.4)]">
              <Calendar className="w-7 h-7 text-[#f4e8d8]" />
            </div>
            <span className="text-sm font-medium text-[#f4e8d8]">Schedule Task</span>
          </button>

          <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#5b8fa3]/20 hover:to-[#7ea88f]/10 border border-[#f4e8d8]/10 hover:border-[#5b8fa3]/40 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_24px_rgba(91,143,163,0.2)] hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_4px_16px_rgba(91,143,163,0.4)]">
              <FileText className="w-7 h-7 text-[#f4e8d8]" />
            </div>
            <span className="text-sm font-medium text-[#f4e8d8]">Upload Document</span>
          </button>

          <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#7ea88f]/20 hover:to-[#6a994e]/10 border border-[#f4e8d8]/10 hover:border-[#7ea88f]/40 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_24px_rgba(126,168,143,0.2)] hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#7ea88f] to-[#6a994e] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_4px_16px_rgba(126,168,143,0.4)]">
              <Wrench className="w-7 h-7 text-[#f4e8d8]" />
            </div>
            <span className="text-sm font-medium text-[#f4e8d8]">Find Provider</span>
          </button>
        </div>
      </div>
    </div>
  );
};
