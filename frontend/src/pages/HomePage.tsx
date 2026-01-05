import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, AlertTriangle, Snowflake, Flame, ArrowRight, TrendingDown, LogOut, User, BookOpen, Settings, Check, Shield, Smartphone, BarChart3, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import logger from '@/utils/logger';
import { Logo } from '@/components/furnacelog/Logo';

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

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };



  return (
    <div className="min-h-screen bg-cream">
      {/* Warm Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-soft-beige/50 bg-warm-white/95 backdrop-blur-sm shadow-warm-sm"
          : "border-soft-beige/30 bg-warm-white/90"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" className="cursor-pointer" />
              {/* Main Navigation Menu */}
              <nav className="hidden md:flex items-center gap-1 ml-8">
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
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

            <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
              <div className="inline-block px-4 py-2 bg-white/20 border border-white/30 rounded-full mb-4">
                <span className="text-sm font-semibold text-white">100% Free. No Catch.</span>
              </div>

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

              {/* Cost Warnings */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/90 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Open Source & Free Forever</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>No Payments Required</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>Built for Northern Homes</span>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Bar */}
          <section className="py-8 bg-cream/50 border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-center text-sm text-warm-gray mb-6">Trusted by northern homeowners in:</p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-charcoal/60 font-medium">
                <span>Yellowknife</span>
                <span className="w-1 h-1 rounded-full bg-warm-gray/30" />
                <span>Whitehorse</span>
                <span className="w-1 h-1 rounded-full bg-warm-gray/30" />
                <span>Inuvik</span>
                <span className="w-1 h-1 rounded-full bg-warm-gray/30" />
                <span>Iqaluit</span>
                <span className="w-1 h-1 rounded-full bg-warm-gray/30" />
                <span>Fort Smith</span>
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
  );
}

export default HomePage;
