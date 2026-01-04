import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Home, Calendar, AlertTriangle, Snowflake, Flame, Shield, CheckCircle2, ArrowRight, MapPin, Clock, TrendingDown } from 'lucide-react';

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

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-amber-900/20 bg-stone-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg flex items-center justify-center shadow-lg">
                  <Flame className="w-6 h-6 text-amber-100" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-stone-50 tracking-tight">
                    FurnaceLog
                  </h1>
                  <p className="text-xs text-stone-400 font-medium">Northern Home Tracker</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-stone-300 hover:text-stone-50 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-stone-50 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-stone-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )`
          }} />
        </div>

        {/* Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-stone-950" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-950/40 border border-emerald-800/30 rounded-full">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">
                  Built for Northwest Territories, Nunavut & Yukon
                </span>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-50 leading-[1.05] tracking-tight">
                  Protect Your
                  <span className="block text-amber-500 mt-2">
                    Northern Home
                  </span>
                </h2>

                <p className="text-xl text-stone-300 leading-relaxed max-w-xl">
                  Track heating systems, prevent freeze damage, and manage maintenance for homes
                  built to survive <span className="text-stone-50 font-semibold">-40°C winters</span>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-amber-700 hover:bg-amber-600 text-stone-50 font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-amber-900/40"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-100 font-semibold rounded-xl transition-all duration-200"
                >
                  See Features
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-medium">Free Forever</span>
                  </div>
                  <p className="text-sm text-stone-500">Open Source</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Snowflake className="w-4 h-4" />
                    <span className="text-xs font-medium">Works Offline</span>
                  </div>
                  <p className="text-sm text-stone-500">Remote Ready</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Home className="w-4 h-4" />
                    <span className="text-xs font-medium">Your Data</span>
                  </div>
                  <p className="text-sm text-stone-500">Self-Hosted</p>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative">
              <div className="space-y-4">
                {/* Alert Card */}
                <div className="bg-gradient-to-br from-stone-900 to-stone-900/95 border-2 border-red-900/40 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-stone-50">Extreme Cold Alert</h3>
                        <span className="flex-shrink-0 text-xs text-red-400 font-medium bg-red-950/40 px-2 py-1 rounded">
                          URGENT
                        </span>
                      </div>
                      <p className="text-sm text-stone-300 mb-3">
                        Temperature dropping to -42°C tonight. Inspect heat trace cables and ensure backup heating is ready.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Due in 6 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Card */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-950/60 border border-amber-800/50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-stone-50">Furnace Filter Due</h3>
                        <span className="flex-shrink-0 text-xs text-amber-400 font-medium bg-amber-950/40 px-2 py-1 rounded">
                          TOMORROW
                        </span>
                      </div>
                      <p className="text-sm text-stone-300 mb-3">
                        Replace forced-air furnace filter for optimal heating efficiency.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>Propane Furnace</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-950/60 border border-emerald-800/50 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-stone-50">All Systems Running</h3>
                        <span className="flex-shrink-0 text-xs text-emerald-400 font-medium bg-emerald-950/40 px-2 py-1 rounded">
                          HEALTHY
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-sm text-stone-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Propane Furnace</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-stone-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>HRV System</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-stone-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Heat Trace Cables</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-50">
              Purpose-Built for the North
            </h2>
            <p className="text-xl text-stone-400">
              Every feature designed for extreme climates, modular housing, and remote communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-stone-900 border border-stone-800 hover:border-amber-800/50 rounded-2xl p-8 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-orange-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Flame className="w-7 h-7 text-amber-100" />
              </div>
              <h3 className="text-xl font-semibold text-stone-50 mb-3">
                Heating System Tracking
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Monitor propane furnaces, oil boilers, heat trace cables, and HRV systems with northern-specific maintenance schedules.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-stone-900 border border-stone-800 hover:border-emerald-800/50 rounded-2xl p-8 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-7 h-7 text-emerald-100" />
              </div>
              <h3 className="text-xl font-semibold text-stone-50 mb-3">
                Seasonal Checklists
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Automated freeze-up, winter operations, break-up, and summer task lists tailored to territorial weather patterns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-stone-900 border border-stone-800 hover:border-sky-800/50 rounded-2xl p-8 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-700 to-sky-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Snowflake className="w-7 h-7 text-sky-100" />
              </div>
              <h3 className="text-xl font-semibold text-stone-50 mb-3">
                Weather Alerts
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Real-time extreme cold warnings, wind chill alerts, and automated maintenance reminders based on temperature.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-stone-900 border border-stone-800 hover:border-violet-800/50 rounded-2xl p-8 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-700 to-violet-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Home className="w-7 h-7 text-violet-100" />
              </div>
              <h3 className="text-xl font-semibold text-stone-50 mb-3">
                Modular Home Support
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Track marriage walls, skirting maintenance, foundation piles, and belly board inspections specific to manufactured homes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-stone-900 border border-stone-800 hover:border-orange-800/50 rounded-2xl p-8 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-700 to-red-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-orange-100" />
              </div>
              <h3 className="text-xl font-semibold text-stone-50 mb-3">
                Freeze Prevention
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Log freeze events, track heat trace cable zones, and receive proactive alerts before pipes freeze at -40°C.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl p-8 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-stone-700 to-stone-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingDown className="w-7 h-7 text-stone-200" />
              </div>
              <h3 className="text-xl font-semibold text-stone-50 mb-3">
                Offline-First Design
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Full functionality without internet connection. Perfect for remote communities with limited connectivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-amber-500">-40°C</div>
              <p className="text-stone-400">Extreme cold tested</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-amber-500">100%</div>
              <p className="text-stone-400">Free & open source</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-amber-500">24/7</div>
              <p className="text-stone-400">Offline access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-50">
            Start Protecting Your Home Today
          </h2>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Join northern homeowners who trust FurnaceLog to keep their homes safe, warm, and well-maintained through extreme winters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-700 hover:bg-amber-600 text-stone-50 font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-amber-900/40"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-100" />
              </div>
              <span className="text-stone-50 font-semibold">FurnaceLog</span>
            </div>
            {!loading && health?.status === 'healthy' && (
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>All Systems Operational</span>
              </div>
            )}
            <p className="text-sm text-stone-500">
              Built for Canada's North
            </p>
          </div>
          <div className="pt-8 text-center text-sm text-stone-500">
            © 2026 FurnaceLog. Open source home maintenance tracking.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
