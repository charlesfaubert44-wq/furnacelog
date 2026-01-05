/**
 * SensorCard Component
 * Displays individual sensor status and reading
 * Part of IoT Integration - Phase 1
 */

import React from 'react';
import { Thermometer, Droplet, Fuel, Wind, Activity, AlertTriangle, Battery, WifiOff } from 'lucide-react';

interface SensorCardProps {
  sensor: {
    _id: string;
    name: string;
    type: string;
    location?: string;
    lastReading?: {
      value: any;
      timestamp: Date;
    };
    specs: {
      unit?: string;
      batteryPowered?: boolean;
      batteryLevel?: number;
    };
    status: 'active' | 'inactive' | 'error' | 'low-battery' | 'offline';
    isOnline?: boolean;
  };
  onClick?: () => void;
}

const SENSOR_ICONS: Record<string, React.ElementType> = {
  temperature: Thermometer,
  humidity: Droplet,
  'water-leak': Droplet,
  'fuel-level': Fuel,
  'air-quality': Wind,
  co2: Wind,
  co: AlertTriangle,
  power: Activity,
  vibration: Activity,
};

const SENSOR_COLORS: Record<string, string> = {
  temperature: 'text-orange-400',
  humidity: 'text-blue-400',
  'water-leak': 'text-cyan-400',
  'fuel-level': 'text-yellow-400',
  'air-quality': 'text-green-400',
  co2: 'text-purple-400',
  co: 'text-red-400',
  power: 'text-indigo-400',
  vibration: 'text-pink-400',
};

export function SensorCard({ sensor, onClick }: SensorCardProps) {
  const Icon = SENSOR_ICONS[sensor.type] || Activity;
  const iconColor = SENSOR_COLORS[sensor.type] || 'text-gray-400';

  const formatValue = (value: any, unit?: string) => {
    if (value === null || value === undefined) return 'N/A';

    // Format based on type
    if (typeof value === 'number') {
      return `${value.toFixed(1)}${unit ? ` ${unit}` : ''}`;
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  };

  const getStatusColor = () => {
    if (!sensor.isOnline || sensor.status === 'offline') return 'bg-gray-600';
    if (sensor.status === 'error') return 'bg-red-600';
    if (sensor.status === 'low-battery') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const getBatteryIcon = () => {
    const level = sensor.specs.batteryLevel || 0;
    if (level < 20) return <Battery className="h-4 w-4 text-red-400" />;
    if (level < 50) return <Battery className="h-4 w-4 text-yellow-400" />;
    return <Battery className="h-4 w-4 text-green-400" />;
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      className={`bg-stone-900 border border-stone-800 rounded-lg p-4 hover:border-stone-700 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-stone-800 rounded-lg ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-stone-100">{sensor.name}</h3>
            {sensor.location && (
              <p className="text-xs text-stone-400">{sensor.location}</p>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          {!sensor.isOnline && (
            <WifiOff className="h-4 w-4 text-stone-500" aria-label="Offline" />
          )}
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>
      </div>

      {/* Reading */}
      <div className="mt-3">
        {sensor.lastReading ? (
          <>
            <div className="text-2xl font-bold text-stone-100">
              {formatValue(sensor.lastReading.value, sensor.specs.unit)}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Updated {getTimeAgo(sensor.lastReading.timestamp)}
            </div>
          </>
        ) : (
          <div className="text-sm text-stone-500">No data</div>
        )}
      </div>

      {/* Battery indicator */}
      {sensor.specs.batteryPowered && (
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-800">
          <div className="flex items-center space-x-2">
            {getBatteryIcon()}
            <span className="text-xs text-stone-400">
              {sensor.specs.batteryLevel || 0}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
