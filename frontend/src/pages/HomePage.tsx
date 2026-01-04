import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Home, Calendar, AlertTriangle, Snowflake, Flame, CheckCircle2, ArrowRight, Clock, TrendingDown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import logger from '@/utils/logger';
import { fetchNorthernWeather, type CityWeather } from '@/services/weather.service';
import { getTemperatureQuote } from '@/utils/weatherQuotes';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { AdSense } from '@/components/ads/AdSense';

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
  const [weather, setWeather] = useState<CityWeather[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const { isScrolled } = useScrollPosition();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        logger.warn('Health check failed', err as Record<string, any>);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  // Fetch northern weather on mount
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weatherData = await fetchNorthernWeather();
        setWeather(weatherData);
      } catch (err) {
        logger.warn('Weather fetch failed', err as Record<string, any>);
      }
    };

    loadWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-[#d4a373]/10 bg-[#0a0a0a]/80 backdrop-blur-md"
          : "border-[#d4a373]/10 bg-[#0a0a0a]/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-[#f4e8d8]" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#f4e8d8] tracking-tight">
                    FurnaceLog
                  </h1>
                  <p className="text-xs text-[#d4a373] font-medium">Northern Home Tracker</p>
                </div>
              </div>
              {user && (
                <nav className="hidden md:flex items-center gap-1 ml-8">
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors rounded-lg hover:bg-[#2a2a2a]/50"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors rounded-lg hover:bg-[#2a2a2a]/50"
                  >
                    Dashboard
                  </button>
                </nav>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#f4e8d8]/10 rounded-lg py-2">
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#d4a373] hover:bg-[#2a2a2a] hover:text-[#f4e8d8] transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#d4a373] hover:bg-[#2a2a2a] hover:text-[#f4e8d8] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthModalTab('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('register');
                      setAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:brightness-110 text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-[#d4a373]/10">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff4500]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff6a00]/12 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff8c00]/8 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#f4e8d8] leading-[1.05] tracking-tight animate-fade-slide-up animate-delay-100">
                      Protect Your
                      <span className="block bg-gradient-to-r from-[#ff4500] to-[#ff6a00] bg-clip-text text-transparent mt-2">Northern Home</span>
                    </h2>
                    <p className="text-xl text-[#d4a373] leading-relaxed max-w-xl animate-fade-slide-up animate-delay-200">
                      Track heating systems, prevent freeze damage, and manage maintenance for homes
                      built to survive <span className="text-[#f4e8d8] font-semibold">-40°C winters</span>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-slide-up animate-delay-300">
                    <button
                      onClick={() => {
                        setAuthModalTab('register');
                        setAuthModalOpen(true);
                      }}
                      className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Start Free Today
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a href="#features" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#2a2a2a] hover:to-[#2a2a2a] border border-[#f4e8d8]/20 text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                      See Features
                    </a>
                  </div>

                  {/* Live Northern Weather */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#f4e8d8]/10">
                    {weather.length > 0 ? (
                      weather.map((cityWeather) => (
                        <div key={cityWeather.city} className="space-y-1">
                          <div className="flex items-center gap-2 text-[#5b8fa3]">
                            <Thermometer className="w-4 h-4" />
                            <span className="text-xs font-medium">{cityWeather.city}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className={cn(
                              "text-2xl font-bold",
                              cityWeather.temp < -35 && "text-[#c4d7e0]",
                              cityWeather.temp >= -35 && cityWeather.temp < -20 && "text-[#5b8fa3]",
                              cityWeather.temp >= -20 && "text-[#7ea88f]"
                            )}>
                              {cityWeather.temp}°
                            </span>
                            <span className="text-xs text-[#d4a373]/70">
                              feels {cityWeather.feelsLike}°
                            </span>
                          </div>
                          <p className="text-xs text-[#d4a373]/80 italic leading-tight">
                            {getTemperatureQuote(cityWeather.temp)}
                          </p>
                        </div>
                      ))
                    ) : (
                      // Loading placeholders
                      <>
                        <div className="space-y-1 animate-pulse">
                          <div className="h-4 bg-[#2a2a2a]/50 rounded w-20"></div>
                          <div className="h-8 bg-[#2a2a2a]/50 rounded w-16"></div>
                          <div className="h-3 bg-[#2a2a2a]/50 rounded w-32"></div>
                        </div>
                        <div className="space-y-1 animate-pulse">
                          <div className="h-4 bg-[#2a2a2a]/50 rounded w-20"></div>
                          <div className="h-8 bg-[#2a2a2a]/50 rounded w-16"></div>
                          <div className="h-3 bg-[#2a2a2a]/50 rounded w-32"></div>
                        </div>
                        <div className="space-y-1 animate-pulse">
                          <div className="h-4 bg-[#2a2a2a]/50 rounded w-20"></div>
                          <div className="h-8 bg-[#2a2a2a]/50 rounded w-16"></div>
                          <div className="h-3 bg-[#2a2a2a]/50 rounded w-32"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#d45d4e]/40 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d45d4e] to-[#d4734e] rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-[#f4e8d8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-[#f4e8d8]">Extreme Cold Alert</h3>
                            <span className="flex-shrink-0 text-xs text-[#d45d4e] font-medium bg-[#d45d4e]/20 px-2 py-1 rounded">URGENT</span>
                          </div>
                          <p className="text-sm text-[#d4a373] mb-3">
                            Temperature dropping to -42°C tonight. Inspect heat trace cables and ensure backup heating is ready.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#d4a373]/70">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Due in 6 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#ff9500]/30 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#ff9500] to-[#ff6a00] rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-[#f4e8d8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-[#f4e8d8]">Furnace Filter Due</h3>
                            <span className="flex-shrink-0 text-xs text-[#ff9500] font-medium bg-[#ff9500]/20 px-2 py-1 rounded">TOMORROW</span>
                          </div>
                          <p className="text-sm text-[#d4a373] mb-3">
                            Replace forced-air furnace filter for optimal heating efficiency.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#d4a373]/70">
                            <Thermometer className="w-3.5 h-3.5" />
                            <span>Propane Furnace</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#6a994e]/30 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6a994e] to-[#7ea88f] rounded-xl flex items-center justify-center">
                          <Home className="w-6 h-6 text-[#f4e8d8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-semibold text-[#f4e8d8]">All Systems Running</h3>
                            <span className="flex-shrink-0 text-xs text-[#6a994e] font-medium bg-[#6a994e]/20 px-2 py-1 rounded">HEALTHY</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5 text-sm text-[#d4a373]">
                              <CheckCircle2 className="w-4 h-4 text-[#6a994e] flex-shrink-0" />
                              <span>Propane Furnace</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-[#d4a373]">
                              <CheckCircle2 className="w-4 h-4 text-[#6a994e] flex-shrink-0" />
                              <span>HRV System</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-[#d4a373]">
                              <CheckCircle2 className="w-4 h-4 text-[#6a994e] flex-shrink-0" />
                              <span>Heat Trace Cables</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#ff4500]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-[#6a994e]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Ad Placement 1 */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <AdSense format="horizontal" className="max-w-4xl mx-auto" />
          </div>

          {/* Features Grid */}
          <section id="features" className="py-24 border-b border-[#d4a373]/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#f4e8d8]">Purpose-Built for the North</h2>
                <p className="text-xl text-[#d4a373]">
                  Every feature designed for extreme climates, modular housing, and remote communities
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 hover:border-[#ff4500]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1  /20">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center mb-6  transition-all duration-300 group-hover:scale-110">
                    <Flame className="w-7 h-7 text-[#f4e8d8] group-hover:animate-flicker" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f4e8d8] mb-3">Heating System Tracking</h3>
                  <p className="text-[#d4a373] leading-relaxed">
                    Monitor propane furnaces, oil boilers, heat trace cables, and HRV systems with northern-specific maintenance schedules.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 hover:border-[#6a994e]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1  /20">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#6a994e] to-[#7ea88f] rounded-xl flex items-center justify-center mb-6  transition-all duration-300 group-hover:scale-110">
                    <Calendar className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f4e8d8] mb-3">Seasonal Checklists</h3>
                  <p className="text-[#d4a373] leading-relaxed">
                    Automated freeze-up, winter operations, break-up, and summer task lists tailored to territorial weather patterns.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 hover:border-[#5b8fa3]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1  /20">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-xl flex items-center justify-center mb-6  transition-all duration-300 group-hover:scale-110">
                    <Snowflake className="w-7 h-7 text-[#f4e8d8] group-hover:animate-float" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f4e8d8] mb-3">Weather Alerts</h3>
                  <p className="text-[#d4a373] leading-relaxed">
                    Real-time extreme cold warnings, wind chill alerts, and automated maintenance reminders based on temperature.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 hover:border-[#ff8c00]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1  /20">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#ff8c00] to-[#d4a373] rounded-xl flex items-center justify-center mb-6  transition-all duration-300 group-hover:scale-110">
                    <Home className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f4e8d8] mb-3">Modular Home Support</h3>
                  <p className="text-[#d4a373] leading-relaxed">
                    Track marriage walls, skirting maintenance, foundation piles, and belly board inspections specific to manufactured homes.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 hover:border-[#d45d4e]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1  /20">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#d45d4e] to-[#d4734e] rounded-xl flex items-center justify-center mb-6  transition-all duration-300 group-hover:scale-110">
                    <AlertTriangle className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f4e8d8] mb-3">Freeze Prevention</h3>
                  <p className="text-[#d4a373] leading-relaxed">
                    Log freeze events, track heat trace cable zones, and receive proactive alerts before pipes freeze at -40°C.
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 hover:border-[#d4a373]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1  /20">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#d4a373] to-[#ff8c00] rounded-xl flex items-center justify-center mb-6  transition-all duration-300 group-hover:scale-110">
                    <TrendingDown className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f4e8d8] mb-3">Offline-First Design</h3>
                  <p className="text-[#d4a373] leading-relaxed">
                    Full functionality without internet connection. Perfect for remote communities with limited connectivity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ad Placement 2 */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <AdSense format="horizontal" className="max-w-4xl mx-auto" />
          </div>

          {/* Pricing Section */}
          <section id="pricing" className="py-24 border-b border-[#d4a373]/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#f4e8d8]">
                  Choose Your Plan
                </h2>
                <p className="text-xl text-[#d4a373]">
                  Start free with ads, or go ad-free for just $6.99/month. All plans include core features.
                </p>
              </div>

              <PricingPlans />

              <div className="mt-16 text-center">
                <p className="text-sm text-[#d4a373]/70 max-w-2xl mx-auto">
                  All plans include unlimited homes, maintenance tracking, weather alerts, and community support.
                  Upgrade anytime to remove ads and unlock advanced features. No credit card required to start.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 border-b border-[#d4a373]/10">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-[#f4e8d8]">
                Start Protecting Your Home Today
              </h2>
              <p className="text-xl text-[#d4a373] max-w-2xl mx-auto">
                Join northern homeowners who trust FurnaceLog to keep their homes safe, warm, and well-maintained through extreme winters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

      {/* Ad Placement 3 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdSense format="horizontal" className="max-w-4xl mx-auto" />
      </div>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-[#f4e8d8]/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#f4e8d8]" />
              </div>
              <span className="text-[#f4e8d8] font-semibold">FurnaceLog</span>
            </div>
            {!loading && health?.status === 'healthy' && (
              <div className="flex items-center gap-2 text-sm text-[#d4a373]">
                <div className="w-2 h-2 bg-[#6a994e] rounded-full" />
                <span>All Systems Operational</span>
              </div>
            )}
            <p className="text-sm text-[#d4a373]/70">Built for Canada's North</p>
          </div>
          <div className="pt-8 text-center text-sm text-[#d4a373]/70">
            © 2026 FurnaceLog. Open source home maintenance tracking.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}

export default HomePage;
