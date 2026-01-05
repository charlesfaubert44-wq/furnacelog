import React from 'react';
import { Flame, Calendar, AlertTriangle, Snowflake, CheckCircle2, Clock } from 'lucide-react';

export const DashboardMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Browser-style window frame */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-soft-beige/50 overflow-hidden transform perspective-1000 rotate-y-2">
        {/* Window chrome */}
        <div className="bg-gradient-to-r from-soft-beige/30 to-soft-amber/20 px-4 py-3 flex items-center gap-2 border-b border-soft-beige/40">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-warm-coral/60" />
            <div className="w-3 h-3 rounded-full bg-soft-amber/60" />
            <div className="w-3 h-3 rounded-full bg-gradient-fireplace/60" />
          </div>
          <div className="flex-1 text-center">
            <div className="inline-block bg-cream/80 px-4 py-1 rounded-lg text-xs text-warm-gray">
              app.furnacelog.com/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="bg-gradient-to-br from-cream to-warm-white p-6">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-charcoal mb-1">Dashboard</h3>
            <p className="text-sm text-warm-gray">Your home maintenance overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-soft-beige/60 shadow-warm-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-fireplace rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-warm-gray">System Health</span>
              </div>
              <div className="text-2xl font-bold text-charcoal">98%</div>
              <div className="text-xs text-soft-amber">All systems normal</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-soft-beige/60 shadow-warm-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-fireplace rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-warm-gray">Tasks Due</span>
              </div>
              <div className="text-2xl font-bold text-charcoal">3</div>
              <div className="text-xs text-warm-orange">This week</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-soft-beige/60 shadow-warm-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-fireplace rounded-lg flex items-center justify-center">
                  <Snowflake className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-warm-gray">Temperature</span>
              </div>
              <div className="text-2xl font-bold text-charcoal">-28°C</div>
              <div className="text-xs text-blue-500">Extreme cold alert</div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-xl p-4 border border-soft-beige/60 shadow-warm-sm">
            <h4 className="text-sm font-bold text-charcoal mb-3">Upcoming Maintenance</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-soft-beige/30">
                <div className="w-8 h-8 bg-soft-amber/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-warm-orange" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-charcoal">Change furnace filter</div>
                  <div className="text-xs text-warm-gray">Due in 3 days</div>
                </div>
                <div className="text-xs text-warm-orange font-medium">Overdue</div>
              </div>

              <div className="flex items-center gap-3 pb-3 border-b border-soft-beige/30">
                <div className="w-8 h-8 bg-soft-beige/40 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warm-gray" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-charcoal">Check heat trace cables</div>
                  <div className="text-xs text-warm-gray">Seasonal task</div>
                </div>
                <div className="text-xs text-warm-gray font-medium">This week</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-soft-amber/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-soft-amber" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-charcoal">Test smoke detectors</div>
                  <div className="text-xs text-warm-gray">Monthly check</div>
                </div>
                <div className="text-xs text-soft-amber font-medium">Next week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-fireplace rounded-2xl opacity-20 blur-2xl animate-pulse" />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-soft-amber/30 rounded-full blur-3xl" />
    </div>
  );
};
