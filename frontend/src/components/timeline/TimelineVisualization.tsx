/**
 * Timeline Visualization Component
 *
 * Main interactive timeline with weather and maintenance overlays
 * v1.0 implementation with basic zoom/pan controls
 */

import React, { useState } from 'react';
import { TimelineDataPoint } from '../../services/timeline.service';
import { Thermometer, Droplets, Wind, Wrench, DollarSign } from 'lucide-react';

interface TimelineVisualizationProps {
  timelineData: {
    timeline: TimelineDataPoint[];
    home: {
      name: string;
      community: string;
      territory: string;
    };
    summary: {
      totalMaintenance: number;
      totalCost: number;
    };
  };
  onDateRangeChange?: (start: Date, end: Date) => void;
  granularity: 'day' | 'week' | 'month';
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  timelineData,
  granularity
}) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState<TimelineDataPoint | null>(null);
  const [layersVisible, setLayersVisible] = useState({
    temperature: true,
    precipitation: true,
    maintenance: true,
    cost: true
  });

  const toggleLayer = (layer: keyof typeof layersVisible) => {
    setLayersVisible(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Temperature scale: -50°C to +30°C
  const getTempYPosition = (temp: number) => {
    const min = -50;
    const max = 30;
    const normalized = (temp - min) / (max - min);
    return 100 - (normalized * 100); // Invert for SVG (0 is top)
  };

  // Get color for temperature
  const getTempColor = (temp: number) => {
    if (temp <= -40) return '#1e3a8a'; // Extreme cold - dark blue
    if (temp <= -30) return '#3b82f6'; // Severe cold - blue
    if (temp <= -20) return '#60a5fa'; // Cold - light blue
    if (temp <= -10) return '#93c5fd'; // Cool - very light blue
    if (temp <= 0) return '#dbeafe'; // Just below freezing - pale blue
    if (temp <= 10) return '#d1d5db'; // Cool - gray
    if (temp <= 20) return '#fde68a'; // Warm - yellow
    return '#f59e0b'; // Hot - orange
  };

  const formatDate = (date: Date) => {
    if (granularity === 'day') {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (granularity === 'week') {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Layer Controls */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-3">Timeline Layers:</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toggleLayer('temperature')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
              layersVisible.temperature
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            Temperature
          </button>

          <button
            onClick={() => toggleLayer('precipitation')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
              layersVisible.precipitation
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Droplets className="w-4 h-4" />
            Precipitation
          </button>

          <button
            onClick={() => toggleLayer('maintenance')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
              layersVisible.maintenance
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Maintenance
          </button>

          <button
            onClick={() => toggleLayer('cost')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
              layersVisible.cost
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Costs
          </button>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Interactive Timeline</h3>
            <p className="text-sm text-gray-400">
              Showing {timelineData.timeline.length} data points
            </p>
          </div>

          {/* SVG Timeline */}
          <svg
            width="100%"
            height="400"
            className="bg-gray-900 rounded"
            style={{ minWidth: '800px' }}
          >
            {/* Grid lines */}
            {[...Array(11)].map((_, i) => (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={i * 40}
                x2="100%"
                y2={i * 40}
                stroke="#374151"
                strokeWidth="0.5"
                strokeDasharray="4 2"
              />
            ))}

            {/* Temperature layer */}
            {layersVisible.temperature && timelineData.timeline.length > 0 && (
              <g>
                {/* Temperature area */}
                <path
                  d={timelineData.timeline
                    .map((point, idx) => {
                      if (!point.weather) return null;
                      const x = (idx / (timelineData.timeline.length - 1)) * 100;
                      const y = getTempYPosition(point.weather.temperature.mean) * 4; // Scale to 400px height
                      return `${idx === 0 ? 'M' : 'L'} ${x}% ${y}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Temperature points */}
                {timelineData.timeline.map((point, idx) => {
                  if (!point.weather) return null;
                  const x = (idx / (timelineData.timeline.length - 1)) * 100;
                  const y = getTempYPosition(point.weather.temperature.mean) * 4;

                  return (
                    <circle
                      key={`temp-${idx}`}
                      cx={`${x}%`}
                      cy={y}
                      r="4"
                      fill={getTempColor(point.weather.temperature.low)}
                      stroke="#1e3a8a"
                      strokeWidth="1"
                      className="cursor-pointer hover:r-6 transition-all"
                      onClick={() => setSelectedDataPoint(point)}
                    />
                  );
                })}
              </g>
            )}

            {/* Maintenance events */}
            {layersVisible.maintenance && (
              <g>
                {timelineData.timeline.map((point, idx) => {
                  if (point.maintenance.length === 0) return null;
                  const x = (idx / (timelineData.timeline.length - 1)) * 100;

                  return (
                    <g key={`maint-${idx}`}>
                      {/* Vertical indicator line */}
                      <line
                        x1={`${x}%`}
                        y1="0"
                        x2={`${x}%`}
                        y2="400"
                        stroke="#f97316"
                        strokeWidth="2"
                        opacity="0.5"
                        className="cursor-pointer"
                        onClick={() => setSelectedDataPoint(point)}
                      />

                      {/* Event marker */}
                      <rect
                        x={`calc(${x}% - 6px)`}
                        y="390"
                        width="12"
                        height="10"
                        fill="#f97316"
                        className="cursor-pointer"
                        onClick={() => setSelectedDataPoint(point)}
                      />

                      {/* Event count */}
                      <text
                        x={`${x}%`}
                        y="385"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {point.maintenance.length}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Temperature scale labels */}
            <g>
              {[-40, -20, 0, 20].map((temp) => (
                <text
                  key={`temp-label-${temp}`}
                  x="5"
                  y={getTempYPosition(temp) * 4}
                  fill="#9ca3af"
                  fontSize="11"
                >
                  {temp}°C
                </text>
              ))}
            </g>
          </svg>

          {/* Date axis */}
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            {timelineData.timeline.length > 0 && (
              <>
                <span>{formatDate(timelineData.timeline[0].date)}</span>
                <span>{formatDate(timelineData.timeline[Math.floor(timelineData.timeline.length / 2)].date)}</span>
                <span>{formatDate(timelineData.timeline[timelineData.timeline.length - 1].date)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Selected Data Point Details */}
      {selectedDataPoint && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {new Date(selectedDataPoint.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <button
              onClick={() => setSelectedDataPoint(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather */}
            {selectedDataPoint.weather && (
              <div>
                <h4 className="text-md font-semibold text-orange-500 mb-3">Weather</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-400" />
                    <span className="text-white">
                      {selectedDataPoint.weather.temperature.low}°C to {selectedDataPoint.weather.temperature.high}°C
                    </span>
                  </div>
                  {selectedDataPoint.weather.precipitation.amount > 0 && (
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-cyan-400" />
                      <span className="text-white">
                        {selectedDataPoint.weather.precipitation.amount.toFixed(1)}mm {selectedDataPoint.weather.precipitation.type}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-400" />
                    <span className="text-white">
                      {selectedDataPoint.weather.wind.speed}km/h {selectedDataPoint.weather.wind.direction}
                    </span>
                  </div>
                  {selectedDataPoint.weather.extremeEvents.length > 0 && (
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-700 rounded">
                      {selectedDataPoint.weather.extremeEvents.map((event, idx) => (
                        <p key={idx} className="text-sm text-red-300">
                          ⚠️ {event.description}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Maintenance */}
            {selectedDataPoint.maintenance.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-orange-500 mb-3">
                  Maintenance ({selectedDataPoint.maintenance.length} events)
                </h4>
                <div className="space-y-3">
                  {selectedDataPoint.maintenance.map((event, idx) => (
                    <div key={idx} className="p-3 bg-gray-900 rounded border border-gray-700">
                      <p className="text-white font-medium">
                        {event.systemId?.name || 'System'}: {event.taskPerformed.customDescription || event.taskPerformed.taskId?.name}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Cost: ${event.costs.total.toFixed(2)}
                      </p>
                      {event.details.notes && (
                        <p className="text-sm text-gray-300 mt-2">{event.details.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineVisualization;
