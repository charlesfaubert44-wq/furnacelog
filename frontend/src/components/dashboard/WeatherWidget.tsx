import React from 'react';
import { AlertTriangle, Wind, Droplets, Thermometer } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  // Mock weather data
  const currentTemp = -18;
  const windChill = -28;
  const humidity = 72;
  const windSpeed = 15;
  const hasAlert = currentTemp < -20;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-stone-50">
          Current Weather
        </h3>
        <p className="text-sm text-stone-400 mt-1">
          Yellowknife, NT
        </p>
      </div>

      {/* Temperature Display */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-sky-400">
                {currentTemp}°C
              </span>
            </div>
            <p className="text-sm text-stone-400 mt-2">
              Feels like <span className="text-stone-300 font-medium">{windChill}°C</span>
            </p>
          </div>
          <div className="text-5xl">🌨️</div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-lg p-3">
          <div className="w-10 h-10 bg-stone-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Wind className="h-5 w-5 text-stone-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-stone-400">Wind</p>
            <p className="text-sm font-semibold text-stone-200">{windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-lg p-3">
          <div className="w-10 h-10 bg-stone-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Droplets className="h-5 w-5 text-stone-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-stone-400">Humidity</p>
            <p className="text-sm font-semibold text-stone-200">{humidity}%</p>
          </div>
        </div>
      </div>

      {/* Weather Alert */}
      {hasAlert && (
        <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 border-2 border-red-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-900/50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-red-300 text-sm mb-1">
                Extreme Cold Warning
              </h4>
              <p className="text-xs text-red-400 leading-relaxed">
                Check heat trace systems and ensure furnace is operating properly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
          <Thermometer className="w-4 h-4" />
          Recommended Actions
        </h4>
        <ul className="space-y-2 text-xs text-amber-400/90">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Monitor furnace operation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Verify heat trace cables are active</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Let taps drip to prevent freezing</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
