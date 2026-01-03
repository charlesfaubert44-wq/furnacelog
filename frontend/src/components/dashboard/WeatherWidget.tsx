import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wind, Droplets } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  // Mock weather data
  const currentTemp = -18;
  const windChill = -28;
  const humidity = 72;
  const windSpeed = 15;
  const hasAlert = currentTemp < -20;

  return (
    <Card elevation="elevated">
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-ice-blue-600">
                {currentTemp}°C
              </span>
              <span className="text-sm text-aluminum-500">
                Feels like {windChill}°C
              </span>
            </div>
            <p className="text-sm text-aluminum-600 mt-1">Yellowknife, NT</p>
          </div>
          <div className="text-6xl">🌨️</div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-aluminum-50 p-2">
            <Wind className="h-4 w-4 text-aluminum-500" />
            <div>
              <p className="text-micro text-aluminum-500">Wind</p>
              <p className="text-sm font-semibold">{windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-aluminum-50 p-2">
            <Droplets className="h-4 w-4 text-aluminum-500" />
            <div>
              <p className="text-micro text-aluminum-500">Humidity</p>
              <p className="text-sm font-semibold">{humidity}%</p>
            </div>
          </div>
        </div>

        {/* Weather Alert */}
        {hasAlert && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Extreme Cold Warning</strong>
              <p className="mt-1 text-xs">
                Check heat trace systems and ensure furnace is operating
                properly.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggested Actions */}
        <div className="rounded-lg bg-tech-blue-50 p-3">
          <h4 className="text-sm font-semibold text-tech-blue-700 mb-2">
            Recommended Actions
          </h4>
          <ul className="space-y-1 text-xs text-tech-blue-600">
            <li>• Monitor furnace operation</li>
            <li>• Verify heat trace cables are active</li>
            <li>• Let taps drip to prevent freezing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
