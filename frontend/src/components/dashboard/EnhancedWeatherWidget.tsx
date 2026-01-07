import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, AlertTriangle, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WeatherData {
  current: {
    temperature: number;
    conditions: string;
    windSpeed: number;
    windChill?: number;
    humidity?: number;
  };
  forecast: {
    day: string;
    high: number;
    low: number;
    conditions: string;
  }[];
  alerts: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  recommendations: {
    system: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

interface EnhancedWeatherWidgetProps {
  data: WeatherData | null;
  location?: string;
}

/**
 * EnhancedWeatherWidget Component
 * Displays current weather, 7-day forecast, alerts, and system recommendations
 */
export const EnhancedWeatherWidget: React.FC<EnhancedWeatherWidgetProps> = ({
  data,
  location
}) => {
  if (!data) {
    return (
      <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md">
        <h3 className="text-xl font-semibold text-charcoal mb-2">Weather</h3>
        <p className="text-sm text-warm-gray">Weather data unavailable</p>
      </div>
    );
  }

  const getWeatherIcon = (conditions: string) => {
    const cond = conditions.toLowerCase();
    if (cond.includes('snow')) return <CloudSnow className="w-8 h-8" />;
    if (cond.includes('rain')) return <CloudRain className="w-8 h-8" />;
    if (cond.includes('cloud')) return <Cloud className="w-8 h-8" />;
    return <Sun className="w-8 h-8" />;
  };

  const getSmallWeatherIcon = (conditions: string) => {
    const cond = conditions.toLowerCase();
    if (cond.includes('snow')) return <CloudSnow className="w-5 h-5" />;
    if (cond.includes('rain')) return <CloudRain className="w-5 h-5" />;
    if (cond.includes('cloud')) return <Cloud className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  const getTemperatureColor = (temp: number): string => {
    if (temp < -20) return 'text-winter-blue';
    if (temp < 0) return 'text-sage';
    if (temp < 15) return 'text-warm-gray';
    if (temp < 25) return 'text-soft-amber';
    return 'text-warm-orange';
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-warm-coral/20 text-warm-coral border-warm-coral/30';
      case 'high':
        return 'bg-warm-orange/20 text-warm-orange border-warm-orange/30';
      case 'medium':
        return 'bg-soft-amber/20 text-soft-amber border-soft-amber/30';
      default:
        return 'bg-warm-gray/20 text-warm-gray border-warm-gray/30';
    }
  };

  return (
    <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-charcoal">Weather</h3>
        {location && (
          <p className="text-sm text-warm-gray mt-1">{location}</p>
        )}
      </div>

      {/* Current Weather */}
      <div className="mb-6 p-6 bg-gradient-to-br from-soft-beige to-cream rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className={cn(
              "text-5xl font-bold mb-2",
              getTemperatureColor(data.current.temperature)
            )}>
              {Math.round(data.current.temperature)}°C
            </div>
            <div className="text-sm text-warm-gray mb-1">{data.current.conditions}</div>
            {data.current.windChill !== undefined && data.current.windChill < data.current.temperature && (
              <div className="text-xs text-warm-gray">
                Feels like {Math.round(data.current.windChill)}°C
              </div>
            )}
          </div>
          <div className={cn("text-charcoal", getTemperatureColor(data.current.temperature))}>
            {getWeatherIcon(data.current.conditions)}
          </div>
        </div>

        {/* Current Conditions Details */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-soft-amber/20">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-warm-gray" />
            <span className="text-xs text-warm-gray">{data.current.windSpeed} km/h</span>
          </div>
          {data.current.humidity !== undefined && (
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-warm-gray" />
              <span className="text-xs text-warm-gray">{data.current.humidity}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Weather Alerts */}
      {data.alerts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warm-coral" />
            Weather Alerts
          </h4>
          <div className="space-y-2">
            {data.alerts.map((alert, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-xl border text-xs",
                  getSeverityColor(alert.severity)
                )}
              >
                <div className="font-semibold mb-1 capitalize">{alert.type}</div>
                <div>{alert.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {data.forecast.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-charcoal mb-3">7-Day Forecast</h4>
          <div className="space-y-2">
            {data.forecast.slice(0, 7).map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-cream/30 hover:bg-cream rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-medium text-warm-gray w-12">{day.day}</span>
                  <div className="text-warm-gray">
                    {getSmallWeatherIcon(day.conditions)}
                  </div>
                  <span className="text-xs text-warm-gray capitalize">{day.conditions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-semibold", getTemperatureColor(day.high))}>
                    {Math.round(day.high)}°
                  </span>
                  <span className="text-xs text-warm-gray">/</span>
                  <span className="text-sm text-warm-gray">
                    {Math.round(day.low)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Recommendations */}
      {data.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-burnt-sienna" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {data.recommendations.slice(0, 3).map((rec, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-xl border text-xs",
                  getSeverityColor(rec.priority)
                )}
              >
                <div className="font-semibold mb-1">{rec.system}</div>
                <div>{rec.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWeatherWidget;
