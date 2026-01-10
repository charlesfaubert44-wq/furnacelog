import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, AlertTriangle, Snowflake, Flame, ArrowRight, TrendingDown, LogOut, User, BookOpen, Settings, Check, Smartphone, BarChart3, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import logger from '@/utils/logger';
import { Logo } from '@/components/furnacelog/Logo';
import SEO from '@/components/seo/SEO';
import { OrganizationSchema, WebApplicationSchema } from '@/components/seo/StructuredData';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const { isScrolled } = useScrollPosition();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/health`);
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

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };



  return (
    <>
      <SEO
        title="Northern Home Maintenance Tracker - Prevent Costly Failures"
        description="Protect your northern home from -40°C disasters. Track heating systems, get weather alerts, and prevent $5,000+ emergency repairs. Free for Yukon, NWT & Nunavut homeowners."
        keywords="northern home maintenance, yellowknife home care, furnace maintenance tracker, extreme cold home protection, yukon home maintenance, northwest territories property care, nunavut housing, modular home tracking, northern canada homeowner"
        url="https://furnacelog.com"
        type="website"
      />
      <OrganizationSchema />
      <WebApplicationSchema />

      <div className="min-h-screen bg-cream">
        {/* Warm Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-soft-beige/50 bg-warm-white/95 backdrop-blur-sm shadow-warm-sm"
          : "border-soft-beige/30 bg-warm-white/90"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center">
                <Logo size="sm" className="cursor-pointer" />
              </div>
              {/* Main Navigation Menu */}
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-xl hover:bg-soft-beige/30"
                >
                  Homepage
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-xl hover:bg-soft-beige/30"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/wiki')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-xl hover:bg-soft-beige/30"
                >
                  Knowledge Base
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-xl hover:bg-soft-beige/30"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-xl hover:bg-soft-beige/30"
                >
                  Contact Us
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-warm-white border border-soft-beige rounded-2xl py-2 shadow-warm-md">
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-soft-beige/40 hover:text-charcoal transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate('/wiki');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-soft-beige/40 hover:text-charcoal transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Wiki
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-soft-beige/40 hover:text-charcoal transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-soft-beige/40 hover:text-charcoal transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-fireplace text-white text-sm font-semibold rounded-xl transition-all duration-300"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

          {/* Hero Section - Don't Let Poor Maintenance Cost You Thousands */}
          <section className="py-16 md:py-24 bg-gradient-fireplace border-b border-soft-beige/30 relative overflow-hidden">
            {/* Northern Lights Animation */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Aurora Layer 1 - Green */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.4) 30%, rgba(52, 211, 153, 0.5) 50%, rgba(16, 185, 129, 0.4) 70%, transparent 100%)',
                  animation: 'aurora1 25s ease-in-out infinite',
                  transformOrigin: 'center',
                }}
              />
              {/* Aurora Layer 2 - Blue */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 25%, rgba(96, 165, 250, 0.4) 50%, rgba(59, 130, 246, 0.3) 75%, transparent 100%)',
                  animation: 'aurora2 30s ease-in-out infinite',
                  animationDelay: '5s',
                  transformOrigin: 'center',
                }}
              />
              {/* Aurora Layer 3 - Purple */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.3) 35%, rgba(167, 139, 250, 0.4) 50%, rgba(139, 92, 246, 0.3) 65%, transparent 100%)',
                  animation: 'aurora3 35s ease-in-out infinite',
                  animationDelay: '10s',
                  transformOrigin: 'center',
                }}
              />
              {/* Subtle stars overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
            </div>

            {/* CSS Keyframes for Aurora Animation */}
            <style>{`
              @keyframes aurora1 {
                0%, 100% {
                  transform: translateX(-10%) translateY(0%) scaleY(1);
                  opacity: 0.2;
                }
                33% {
                  transform: translateX(10%) translateY(-3%) scaleY(1.1);
                  opacity: 0.25;
                }
                66% {
                  transform: translateX(-5%) translateY(3%) scaleY(0.95);
                  opacity: 0.15;
                }
              }

              @keyframes aurora2 {
                0%, 100% {
                  transform: translateX(5%) translateY(0%) scaleY(1);
                  opacity: 0.15;
                }
                33% {
                  transform: translateX(-8%) translateY(2%) scaleY(1.05);
                  opacity: 0.2;
                }
                66% {
                  transform: translateX(8%) translateY(-2%) scaleY(0.98);
                  opacity: 0.12;
                }
              }

              @keyframes aurora3 {
                0%, 100% {
                  transform: translateX(0%) translateY(-2%) scaleY(1);
                  opacity: 0.1;
                }
                33% {
                  transform: translateX(-12%) translateY(1%) scaleY(1.08);
                  opacity: 0.15;
                }
                66% {
                  transform: translateX(7%) translateY(-1%) scaleY(0.93);
                  opacity: 0.08;
                }
              }
            `}</style>

            <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Don't Let Poor Maintenance Cost You Thousands
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                One forgotten furnace filter or missed heat trace check can cost $3,000-$5,000+ in emergency repairs. FurnaceLog helps northern homeowners prevent costly failures—completely free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-white hover:bg-cream text-charcoal text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Start Protecting Your Home
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white text-lg font-bold rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  See How It Works
                </a>
              </div>

              {/* Yellowknife Tagline */}
              <div className="flex items-center justify-center pt-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                  <svg className="w-5 h-5 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-sm font-medium">Built with love in Yellowknife, Northwest Territories</span>
                </div>
              </div>
            </div>
          </section>

          {/* Northern Territories Section */}
          <section className="py-16 bg-cream border-b border-soft-beige/30 relative overflow-hidden">
            {/* Subtle Map Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <svg width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simplified outline of Canadian Northern Territories */}
                {/* Yukon - Left territory */}
                <path d="M 50 100 L 150 80 L 180 120 L 200 180 L 180 240 L 140 260 L 80 250 L 60 200 Z"
                      stroke="#C47A53" strokeWidth="2" fill="#D4A574" fillOpacity="0.2"/>

                {/* Northwest Territories - Middle territory */}
                <path d="M 200 80 L 350 60 L 450 80 L 480 120 L 500 180 L 480 240 L 420 280 L 350 290 L 280 270 L 240 220 L 220 160 Z"
                      stroke="#C47A53" strokeWidth="2" fill="#D4A574" fillOpacity="0.2"/>

                {/* Nunavut - Right territory (largest) */}
                <path d="M 480 70 L 580 50 L 650 60 L 720 80 L 750 120 L 760 180 L 750 250 L 720 300 L 650 330 L 580 340 L 520 320 L 490 270 L 480 200 L 490 140 Z"
                      stroke="#C47A53" strokeWidth="2" fill="#D4A574" fillOpacity="0.2"/>

                {/* Hudson Bay (negative space in Nunavut) */}
                <path d="M 550 150 L 620 140 L 660 170 L 670 220 L 650 260 L 600 270 L 560 250 L 550 200 Z"
                      stroke="#C47A53" strokeWidth="1" fill="#FAF8F3" fillOpacity="0.5"/>
              </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Serving Canada's North</h2>
                <p className="text-lg text-warm-gray leading-relaxed">
                  Built specifically for homeowners in the territories where maintenance isn't optional—it's survival
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Yukon - Gold Rush & Mountains */}
                <div className="bg-gradient-warm-card border border-soft-beige/60 rounded-2xl p-6 text-center hover:border-soft-amber/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy relative overflow-hidden group">
                  {/* Mountain pattern background */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M20 80 L40 40 L50 55 L70 20 L90 70 L100 80 Z" fill="#C47A53"/>
                    </svg>
                  </div>
                  <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-warm-orange rounded-xl mb-4 shadow-md">
                    {/* Mountain peaks icon */}
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">Yukon</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Territory of adventure and resilient homes</p>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-soft-amber font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span>Gold Rush Heritage</span>
                  </div>
                </div>

                {/* Northwest Territories - Midnight Sun & Great Slave Lake */}
                <div className="bg-gradient-warm-card border border-soft-beige/60 rounded-2xl p-6 text-center hover:border-soft-amber/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy relative overflow-hidden group">
                  {/* Sun rays pattern background */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="15" fill="#D67844"/>
                      <path d="M50 10 L50 25 M50 75 L50 90 M10 50 L25 50 M75 50 L90 50 M20 20 L30 30 M70 70 L80 80 M80 20 L70 30 M30 70 L20 80" stroke="#D67844" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-warm-orange to-burnt-sienna rounded-xl mb-4 shadow-md">
                    {/* Sun icon */}
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">Northwest Territories</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Where the midnight sun meets modern living</p>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-soft-amber font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                    <span>24 Hour Daylight</span>
                  </div>
                </div>

                {/* Nunavut - Arctic & Northern Lights */}
                <div className="bg-gradient-warm-card border border-soft-beige/60 rounded-2xl p-6 text-center hover:border-soft-amber/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy relative overflow-hidden group">
                  {/* Aurora wave pattern background */}
                  <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <svg viewBox="0 0 200 100" fill="none" className="w-full h-full">
                      <path d="M0 40 Q50 20 100 40 T200 40" stroke="#C47A53" strokeWidth="20" opacity="0.3"/>
                      <path d="M0 60 Q50 80 100 60 T200 60" stroke="#D67844" strokeWidth="20" opacity="0.3"/>
                    </svg>
                  </div>
                  <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-burnt-sienna to-warm-coral rounded-xl mb-4 shadow-md">
                    {/* Snowflake icon */}
                    <Snowflake className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">Nunavut</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">Canada's newest and largest territory</p>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-soft-amber font-medium">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                    <span>Arctic Excellence</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Warm Features Grid */}
          <section id="features" className="py-16 bg-cream border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-charcoal leading-tight">Everything You Need for Peace of Mind</h2>
                <p className="text-lg text-warm-gray leading-relaxed">
                  Built for northern homeowners who want to relax knowing their home is safe, warm, and well-maintained
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Heating System Tracking */}
                <div className="group bg-gradient-warm-card border border-soft-beige/60 hover:border-soft-amber/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy">
                  <div className="w-16 h-16 bg-gradient-fireplace rounded-2xl flex items-center justify-center mb-5 shadow-warm-sm">
                    <Flame className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Heating System Tracking</h3>
                  <p className="text-warm-gray leading-relaxed">
                    Monitor propane furnaces, oil boilers, heat trace cables, and HRV systems with northern-specific maintenance schedules.
                  </p>
                </div>

                {/* Seasonal Checklists */}
                <div className="group bg-gradient-warm-card border border-soft-beige/60 hover:border-soft-amber/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy">
                  <div className="w-16 h-16 bg-gradient-fireplace rounded-2xl flex items-center justify-center mb-5 shadow-warm-sm">
                    <Calendar className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Seasonal Checklists</h3>
                  <p className="text-warm-gray leading-relaxed">
                    Automated freeze-up, winter operations, break-up, and summer task lists tailored to territorial weather patterns.
                  </p>
                </div>

                {/* Weather Alerts */}
                <div className="group bg-gradient-warm-card border border-soft-beige/60 hover:border-soft-amber/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy">
                  <div className="w-16 h-16 bg-gradient-fireplace rounded-2xl flex items-center justify-center mb-5 shadow-warm-sm">
                    <Snowflake className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Weather Alerts</h3>
                  <p className="text-warm-gray leading-relaxed">
                    Real-time extreme cold warnings, wind chill alerts, and automated maintenance reminders based on temperature.
                  </p>
                </div>

                {/* Modular Home Support */}
                <div className="group bg-gradient-warm-card border border-soft-beige/60 hover:border-soft-amber/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy">
                  <div className="w-16 h-16 bg-gradient-fireplace rounded-2xl flex items-center justify-center mb-5 shadow-warm-sm">
                    <Home className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Modular Home Support</h3>
                  <p className="text-warm-gray leading-relaxed">
                    Track marriage walls, skirting maintenance, foundation piles, and belly board inspections specific to manufactured homes.
                  </p>
                </div>

                {/* Freeze Prevention */}
                <div className="group bg-gradient-warm-card border border-soft-beige/60 hover:border-soft-amber/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy">
                  <div className="w-16 h-16 bg-gradient-fireplace rounded-2xl flex items-center justify-center mb-5 shadow-warm-sm">
                    <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Freeze Prevention</h3>
                  <p className="text-warm-gray leading-relaxed">
                    Log freeze events, track heat trace cable zones, and receive proactive alerts before pipes freeze at -40°C.
                  </p>
                </div>

                {/* Offline-First Design */}
                <div className="group bg-gradient-warm-card border border-soft-beige/60 hover:border-soft-amber/40 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-cozy">
                  <div className="w-16 h-16 bg-gradient-fireplace rounded-2xl flex items-center justify-center mb-5 shadow-warm-sm">
                    <TrendingDown className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">Offline-First Design</h3>
                  <p className="text-warm-gray leading-relaxed">
                    Full functionality without internet connection. Perfect for remote communities with limited connectivity.
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* Product Showcase Section 1: Everything in One Place */}
          <section className="py-16 bg-cream border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Screenshot */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-warm-lg border border-soft-beige/60">
                    <div className="aspect-video bg-gradient-to-br from-cream via-soft-beige/30 to-warm-white rounded-xl flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Calendar className="w-16 h-16 text-soft-amber mx-auto" />
                        <p className="text-warm-gray font-medium">Dashboard Preview</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-fireplace/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="inline-block px-4 py-2 bg-soft-amber/10 border border-soft-amber/20 rounded-full">
                    <span className="text-sm font-semibold text-warm-orange">Dashboard</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-charcoal leading-tight">
                    Everything in One Place
                  </h2>
                  <p className="text-xl text-warm-gray leading-relaxed">
                    Your entire home maintenance history, upcoming tasks, and system health at a glance. Never dig through old receipts or wonder when you last serviced something.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Complete maintenance history and logs',
                      'Upcoming task reminders and notifications',
                      'System health monitoring and alerts',
                      'Weather-based recommendations'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-fireplace rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Product Showcase Section 2: Mobile App */}
          <section className="py-16 bg-gradient-cozy border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Content (Left on desktop) */}
                <div className="space-y-6 lg:order-1">
                  <div className="inline-block px-4 py-2 bg-soft-amber/10 border border-soft-amber/20 rounded-full">
                    <span className="text-sm font-semibold text-warm-orange">Mobile App</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-charcoal leading-tight">
                    Take Your Home Management Anywhere
                  </h2>
                  <p className="text-xl text-warm-gray leading-relaxed">
                    Get instant alerts on your phone, mark tasks complete on the go, and access your maintenance data even without internet connection.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Push notifications for critical alerts',
                      'Offline-first functionality',
                      'Quick task completion on the go',
                      'Photo uploads for maintenance records'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-fireplace rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phone Mockup (Right on desktop) */}
                <div className="relative lg:order-2">
                  <div className="bg-white rounded-2xl p-8 shadow-warm-lg border border-soft-beige/60">
                    <div className="aspect-[9/16] max-w-xs mx-auto bg-gradient-to-b from-cream to-soft-beige/50 rounded-2xl flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Smartphone className="w-16 h-16 text-soft-amber mx-auto" />
                        <p className="text-warm-gray font-medium text-sm">Mobile View</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-soft-amber/20 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </section>

          {/* Product Showcase Section 3: Analytics */}
          <section className="py-16 bg-cream border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Chart Screenshot */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-warm-lg border border-soft-beige/60">
                    <div className="aspect-video bg-gradient-to-br from-cream via-soft-beige/30 to-warm-white rounded-xl flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BarChart3 className="w-16 h-16 text-soft-amber mx-auto" />
                        <p className="text-warm-gray font-medium">Analytics Dashboard</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-fireplace/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="inline-block px-4 py-2 bg-soft-amber/10 border border-soft-amber/20 rounded-full">
                    <span className="text-sm font-semibold text-warm-orange">Reports & Analytics</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-charcoal leading-tight">
                    Track Costs & Optimize Spending
                  </h2>
                  <p className="text-xl text-warm-gray leading-relaxed">
                    See exactly where your home maintenance budget goes. Identify trends, plan for major expenses, and make data-driven decisions about your home.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Expense tracking and categorization',
                      'Fuel and propane usage analytics',
                      'Maintenance cost forecasting',
                      'Seasonal trend analysis'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-fireplace rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials / Social Proof */}
          <section className="py-16 bg-gradient-paper border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                  Loved by Northern Homeowners
                </h2>
                <p className="text-lg text-warm-gray leading-relaxed">
                  Join thousands of homeowners who've found peace of mind with FurnaceLog
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "After forgetting to change my furnace filter and paying for an expensive repair, FurnaceLog has been a lifesaver. The reminders are perfectly timed.",
                    name: "Sarah M.",
                    location: "Yellowknife, NT",
                    rating: 5
                  },
                  {
                    quote: "Living in a modular home means constant maintenance. FurnaceLog helps me track everything from heat trace cables to skirting checks. Game changer.",
                    name: "James K.",
                    location: "Whitehorse, YT",
                    rating: 5
                  },
                  {
                    quote: "The weather alerts integration is brilliant. When it hits -40, I get reminders about specific tasks I need to check. That's northern-specific design done right.",
                    name: "Michelle D.",
                    location: "Inuvik, NT",
                    rating: 5
                  }
                ].map((testimonial, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-8 border border-soft-beige/60 shadow-warm-md space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-soft-amber text-soft-amber" />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-lg text-charcoal leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                    {/* Attribution */}
                    <div className="pt-4 border-t border-soft-beige/30">
                      <p className="font-bold text-charcoal">{testimonial.name}</p>
                      <p className="text-sm text-warm-gray">{testimonial.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

      {/* Enhanced Footer */}
      <footer className="py-16 bg-wood-dark">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-wood-light/20">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <Logo size="sm" className="[&_path]:fill-cream [&_path]:stroke-cream [&_span]:!text-cream" />
              <p className="text-sm text-soft-beige/70 leading-relaxed">
                Built with care for northern homeowners who deserve peace of mind.
              </p>
              {!loading && health?.status === 'healthy' && (
                <div className="flex items-center gap-2 text-sm text-soft-beige/80">
                  <div className="w-2 h-2 bg-soft-amber rounded-full" />
                  <span>All Systems Running</span>
                </div>
              )}
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cream uppercase tracking-wider">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#features" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/wiki" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Wiki
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cream uppercase tracking-wider">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="https://github.com/charlesfaubert44-wq/furnacelog" target="_blank" rel="noopener noreferrer" className="text-soft-beige/70 hover:text-cream transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cream uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    License
                  </a>
                </li>
                <li>
                  <a href="#" className="text-soft-beige/70 hover:text-cream transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-soft-beige/70">
              © 2026 FurnaceLog. Open source home maintenance tracking for everyone.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/charlesfaubert44-wq/furnacelog" target="_blank" rel="noopener noreferrer" className="text-soft-beige/70 hover:text-cream transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
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
    </>
  );
}

export default HomePage;
