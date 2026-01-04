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
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(255,107,53,0.15)] transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#f4e8d8]">
          Current Weather
        </h3>
        <p className="text-sm text-[#d4a373] mt-1">
          Yellowknife, NT
        </p>
      </div>

      {/* Temperature Display */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold bg-gradient-to-br from-[#c4d7e0] to-[#5b8fa3] bg-clip-text text-transparent">
                {currentTemp}°C
              </span>
            </div>
            <p className="text-sm text-[#d4a373] mt-2">
              Feels like <span className="text-[#c4d7e0] font-semibold">{windChill}°C</span>
            </p>
          </div>
          <div className="text-6xl opacity-90">🌨️</div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 rounded-xl p-3 hover:border-[#5b8fa3]/30 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(91,143,163,0.3)]">
            <Wind className="h-5 w-5 text-[#f4e8d8]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#d4a373]">Wind</p>
            <p className="text-sm font-semibold text-[#f4e8d8]">{windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 rounded-xl p-3 hover:border-[#5b8fa3]/30 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(91,143,163,0.3)]">
            <Droplets className="h-5 w-5 text-[#f4e8d8]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#d4a373]">Humidity</p>
            <p className="text-sm font-semibold text-[#f4e8d8]">{humidity}%</p>
          </div>
        </div>
      </div>

      {/* Weather Alert */}
      {hasAlert && (
        <div className="bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border border-[#d45d4e]/40 rounded-xl p-4 mb-4 shadow-[0_4px_16px_rgba(212,93,78,0.2)]">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d45d4e] to-[#d4734e] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(212,93,78,0.4)]">
              <AlertTriangle className="h-6 w-6 text-[#f4e8d8]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#f4e8d8] text-sm mb-1">
                Extreme Cold Warning
              </h4>
              <p className="text-xs text-[#d4a373] leading-relaxed">
                Check heat trace systems and ensure furnace is operating properly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      <div className="bg-gradient-to-br from-[#ff9500]/15 to-[#ff6a00]/10 border border-[#ff9500]/30 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-[#f4e8d8] mb-3 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#ff9500]" />
          Recommended Actions
        </h4>
        <ul className="space-y-2 text-xs text-[#d4a373]">
          <li className="flex items-start gap-2">
            <span className="text-[#ff4500] mt-0.5 font-bold">•</span>
            <span>Monitor furnace operation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ff4500] mt-0.5 font-bold">•</span>
            <span>Verify heat trace cables are active</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ff4500] mt-0.5 font-bold">•</span>
            <span>Let taps drip to prevent freezing</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
