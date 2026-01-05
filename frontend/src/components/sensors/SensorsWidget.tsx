/**
 * SensorsWidget Component
 * Dashboard widget displaying all sensors for a home
 * Part of IoT Integration - Phase 1
 */

import React, { useState, useEffect } from 'react';
import { Activity, Plus, AlertCircle } from 'lucide-react';
import { SensorCard } from './SensorCard';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from 'axios';

interface Sensor {
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
}

interface SensorsWidgetProps {
  homeId: string;
  onAddSensor?: () => void;
  onSensorClick?: (sensorId: string) => void;
}

export function SensorsWidget({ homeId, onAddSensor, onSensorClick }: SensorsWidgetProps) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, onReading } = useWebSocket();

  // Fetch sensors on mount
  useEffect(() => {
    fetchSensors();
  }, [homeId]);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/homes/${homeId}/sensors`);

      if (response.data.success) {
        setSensors(response.data.data.sensors);
      }
    } catch (err: any) {
      console.error('Error fetching sensors:', err);
      setError(err.response?.data?.error?.message || 'Failed to load sensors');
    } finally {
      setLoading(false);
    }
  };

  // Update sensor readings in real-time via WebSocket
  useEffect(() => {
    const cleanup = onReading((reading) => {
      setSensors(prev => prev.map(sensor => {
        if (sensor._id === reading.sensorId) {
          return {
            ...sensor,
            lastReading: {
              value: reading.value,
              timestamp: new Date(reading.timestamp)
            },
            isOnline: true
          };
        }
        return sensor;
      }));
    });

    return cleanup;
  }, [onReading]);

  if (loading) {
    return (
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-stone-400" />
            <h2 className="text-lg font-semibold text-stone-100">IoT Sensors</h2>
          </div>
        </div>
        <div className="text-center py-8 text-stone-400">Loading sensors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
        <div className="flex items-center space-x-2 text-red-400 mb-4">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Error Loading Sensors</h2>
        </div>
        <p className="text-stone-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-stone-100">IoT Sensors</h2>
          <span className="text-sm text-stone-400">
            ({sensors.length})
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* WebSocket status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-xs text-stone-400">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>

          {onAddSensor && (
            <button
              onClick={onAddSensor}
              className="flex items-center space-x-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Sensor</span>
            </button>
          )}
        </div>
      </div>

      {/* Sensors Grid */}
      {sensors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor._id}
              sensor={sensor}
              onClick={onSensorClick ? () => onSensorClick(sensor._id) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-stone-950 rounded-lg border border-stone-800">
          <Activity className="h-12 w-12 text-stone-600 mx-auto mb-3" />
          <p className="text-stone-400 mb-4">No sensors configured yet</p>
          {onAddSensor && (
            <button
              onClick={onAddSensor}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Sensor</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
