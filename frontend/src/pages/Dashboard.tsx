import React from 'react';
import { MaintenanceSummaryWidget } from '@/components/dashboard/MaintenanceSummaryWidget';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { SystemStatusWidget } from '@/components/dashboard/SystemStatusWidget';
import { SeasonalChecklistWidget } from '@/components/dashboard/SeasonalChecklistWidget';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-heading">Dashboard</h1>
          <p className="text-small text-aluminum-500 mt-1">
            Welcome back! Here's your home maintenance overview.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Maintenance
        </Button>
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
      <div className="rounded-lg border-2 border-dashed border-aluminum-300 bg-aluminum-50 p-8 text-center">
        <h3 className="text-h3 font-heading mb-2">Quick Actions</h3>
        <p className="text-small text-aluminum-500 mb-4">
          Frequently used actions to manage your home
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline">Add System</Button>
          <Button variant="outline">Schedule Task</Button>
          <Button variant="outline">Upload Document</Button>
          <Button variant="outline">Find Provider</Button>
        </div>
      </div>
    </div>
  );
};
