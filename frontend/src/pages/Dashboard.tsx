import React from 'react';
import { MaintenanceSummaryWidget } from '@/components/dashboard/MaintenanceSummaryWidget';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { SystemStatusWidget } from '@/components/dashboard/SystemStatusWidget';
import { SeasonalChecklistWidget } from '@/components/dashboard/SeasonalChecklistWidget';
import { Plus, Home, Calendar, FileText, Wrench } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-stone-50 tracking-tight">
            Dashboard
          </h1>
          <p className="text-stone-400 mt-2">
            Welcome back! Here's your home maintenance overview.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-stone-50 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30 flex items-center gap-2">
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
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-stone-50 mb-2">
            Quick Actions
          </h3>
          <p className="text-sm text-stone-400">
            Frequently used actions to manage your home
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6 text-emerald-100" />
            </div>
            <span className="text-sm font-medium text-stone-200">Add System</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-amber-100" />
            </div>
            <span className="text-sm font-medium text-stone-200">Schedule Task</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-700 to-sky-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-sky-100" />
            </div>
            <span className="text-sm font-medium text-stone-200">Upload Document</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-700 to-violet-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6 text-violet-100" />
            </div>
            <span className="text-sm font-medium text-stone-200">Find Provider</span>
          </button>
        </div>
      </div>
    </div>
  );
};
