import { useState, useEffect } from 'react';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime?: number;
  services?: {
    mongodb?: string;
    redis?: string;
    minio?: string;
  };
}

function HomePage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to backend API');
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-graphite-900 dark:text-frost mb-4">
            FurnaceLog
          </h1>
          <p className="text-xl text-iron-500 dark:text-aluminum">
            Northern Home Maintenance Tracker
          </p>
        </div>

        <div className="grid gap-6">
          {/* Health Status Card */}
          <div className="bg-white dark:bg-graphite-800 rounded-lg shadow-elevated p-6">
            <h2 className="text-2xl font-semibold mb-4">System Status</h2>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heat-orange"></div>
              </div>
            )}

            {error && (
              <div className="bg-emergency-red/10 border border-emergency-red rounded-lg p-4">
                <p className="text-emergency-red">{error}</p>
              </div>
            )}

            {health && !loading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      health.status === 'healthy'
                        ? 'bg-system-green/10 text-system-green'
                        : 'bg-caution-yellow/10 text-caution-yellow'
                    }`}
                  >
                    {health.status.toUpperCase()}
                  </span>
                </div>

                {health.uptime && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Uptime:</span>
                    <span className="text-iron-600">{Math.floor(health.uptime)} seconds</span>
                  </div>
                )}

                {health.services && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Services:</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(health.services).map(([service, status]) => (
                        <div key={service} className="bg-concrete-200 dark:bg-steel rounded-lg p-3">
                          <div className="text-sm font-medium capitalize">{service}</div>
                          <div
                            className={`text-xs mt-1 ${
                              status === 'connected'
                                ? 'text-system-green'
                                : 'text-caution-yellow'
                            }`}
                          >
                            {status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-aurora text-white rounded-lg shadow-glow-aurora p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome to FurnaceLog</h2>
            <p className="text-lg mb-6">
              Your comprehensive solution for tracking and maintaining northern homes.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-semibold mb-2">Track Systems</div>
                <div>Monitor your heating, plumbing, and electrical systems</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-semibold mb-2">Schedule Maintenance</div>
                <div>Never miss critical seasonal tasks and inspections</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="font-semibold mb-2">Weather Alerts</div>
                <div>Get notified about extreme weather conditions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
