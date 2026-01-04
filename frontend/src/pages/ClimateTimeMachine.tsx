/**
 * Climate Time Machine Page
 *
 * Interactive timeline visualization of home maintenance history + weather data
 * v1.0: Basic timeline with weather overlay and PDF export
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import timelineService, { TimelineResponse, PatternInsight, WeatherCorrelation } from '../services/timeline.service';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';
import { ErrorState } from '../components/error/ErrorState';
import TimelineVisualization from '../components/timeline/TimelineVisualization';
import PatternInsights from '../components/timeline/PatternInsights';
import { Calendar, TrendingUp, Download, Info } from 'lucide-react';

const ClimateTimeMachine: React.FC = () => {
  const { homeId } = useParams<{ homeId: string }>();
  const navigate = useNavigate();

  // State
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [patterns, setPatterns] = useState<PatternInsight | null>(null);
  const [correlations, setCorrelations] = useState<WeatherCorrelation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    end: new Date()
  });

  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('day');
  const [activeView, setActiveView] = useState<'timeline' | 'patterns' | 'correlations'>('timeline');

  // Load data on mount
  useEffect(() => {
    if (!homeId) {
      navigate('/dashboard');
      return;
    }

    loadTimelineData();
  }, [homeId, dateRange, granularity]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch timeline data
      const data = await timelineService.getTimelineData(
        homeId!,
        dateRange.start,
        dateRange.end,
        granularity
      );
      setTimelineData(data);

      // Fetch patterns in background
      fetchPatterns();
      fetchCorrelations();

    } catch (err: any) {
      console.error('Failed to load timeline data:', err);
      setError(err.response?.data?.error || 'Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatterns = async () => {
    try {
      const patternData = await timelineService.getPatternInsights(homeId!);
      setPatterns(patternData);
    } catch (err) {
      console.error('Failed to load patterns:', err);
    }
  };

  const fetchCorrelations = async () => {
    try {
      const correlationData = await timelineService.getWeatherCorrelations(
        homeId!,
        dateRange.start,
        dateRange.end
      );
      setCorrelations(correlationData);
    } catch (err) {
      console.error('Failed to load correlations:', err);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon!');
  };

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const handleGranularityChange = (newGranularity: 'day' | 'week' | 'month') => {
    setGranularity(newGranularity);
  };

  if (loading && !timelineData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !timelineData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to Load Timeline"
          message={error}
          retry={loadTimelineData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-500" />
                Climate Time Machine
              </h1>
              <p className="text-gray-400 mt-1">
                {timelineData?.data.home.name} • {timelineData?.data.home.community}, {timelineData?.data.home.territory}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={activeView === 'timeline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('timeline')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </Button>
                <Button
                  variant={activeView === 'patterns' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('patterns')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Patterns
                </Button>
                <Button
                  variant={activeView === 'correlations' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('correlations')}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Insights
                </Button>
              </div>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Granularity Controls */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-400">View:</span>
            <div className="flex gap-2">
              {(['day', 'week', 'month'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGranularityChange(g)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    granularity === g
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>

            <div className="ml-auto text-sm text-gray-400">
              {timelineData?.data.summary.totalMaintenance} maintenance events •
              ${timelineData?.data.summary.totalCost.toLocaleString()} total cost
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeView === 'timeline' && timelineData && (
          <TimelineVisualization
            timelineData={timelineData.data}
            onDateRangeChange={handleDateRangeChange}
            granularity={granularity}
          />
        )}

        {activeView === 'patterns' && patterns && (
          <PatternInsights
            patterns={patterns}
            correlations={correlations}
          />
        )}

        {activeView === 'correlations' && correlations && (
          <div className="space-y-6">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Weather-Maintenance Correlations</h2>

              {/* Cold Snap Correlations */}
              {correlations.coldSnapMaintenance.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-orange-500 mb-3">Cold Snap Maintenance</h3>
                  <div className="space-y-2">
                    {correlations.coldSnapMaintenance.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-900 rounded border border-gray-700">
                        <p className="text-white">
                          {item.maintenance.system} maintenance occurred {item.daysAfter} days after a cold snap
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Cost: ${item.maintenance.cost} • Date: {new Date(item.maintenance.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seasonal Patterns */}
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-3">Seasonal Patterns</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(correlations.seasonalPatterns).map(([season, data]: [string, any]) => (
                    <div key={season} className="p-4 bg-gray-900 rounded border border-gray-700">
                      <p className="text-white font-semibold capitalize">{season}</p>
                      <p className="text-2xl font-bold text-orange-500">{data.count}</p>
                      <p className="text-sm text-gray-400">events</p>
                      <p className="text-sm text-gray-400 mt-1">
                        ${Math.round(data.totalCost).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateTimeMachine;
