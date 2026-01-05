import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, AlertTriangle, Snowflake, Flame, ArrowRight, TrendingDown, LogOut, User, BookOpen, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import logger from '@/utils/logger';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { HeroCarouselImmersive, type HeroSlide } from '@/components/hero/HeroCarouselImmersive';
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

  // Hero carousel slides
  const heroSlides: HeroSlide[] = [
    {
      id: 'filter-question',
      headline: {
        normal: 'When Did You Last',
        highlight: 'Change Your Filter?',
      },
      subtitle: '...exactly. Stop guessing. Track every maintenance task with precision. Your furnace (and your wallet) will thank you.',
      ctaPrimary: {
        text: 'Start Tracking Free',
        onClick: () => {
          setAuthModalTab('register');
          setAuthModalOpen(true);
        },
      },
      ctaSecondary: {
        text: 'See How It Works',
        href: '#features',
      },
    },
    {
      id: 'cost-comparison',
      headline: {
        normal: '$3,000 Frozen Pipe Repair',
        highlight: 'vs. $7/Month',
      },
      subtitle: 'One missed heat trace check can cost thousands. FurnaceLog sends automated reminders before problems become emergencies.',
      ctaPrimary: {
        text: 'Protect Your Home',
        onClick: () => {
          setAuthModalTab('register');
          setAuthModalOpen(true);
        },
      },
      ctaSecondary: {
        text: 'View Pricing',
        href: '#pricing',
      },
    },
    {
      id: 'furnace-failure',
      headline: {
        normal: 'Your Furnace Quit at -35°C.',
        highlight: 'Would You Even Know?',
      },
      subtitle: 'Real-time monitoring and instant alerts mean you catch problems before your home freezes. Sleep better knowing you\'re protected.',
      ctaPrimary: {
        text: 'Get Peace of Mind',
        onClick: () => {
          setAuthModalTab('register');
          setAuthModalOpen(true);
        },
      },
      ctaSecondary: {
        text: 'Learn About Monitoring',
        href: '#features',
      },
    },
    {
      id: 'cognitive-relief',
      headline: {
        normal: 'Track 50 Maintenance Tasks',
        highlight: 'Or Remember... Nothing',
      },
      subtitle: 'Stop carrying home maintenance stress in your head. Smart seasonal checklists, automatic reminders, complete peace of mind.',
      ctaPrimary: {
        text: 'Try It Free',
        onClick: () => {
          setAuthModalTab('register');
          setAuthModalOpen(true);
        },
      },
      ctaSecondary: {
        text: 'See All Features',
        href: '#features',
      },
    },
    {
      id: 'northern-built',
      headline: {
        normal: 'Built for Yellowknife.',
        highlight: 'Works in Whitehorse.',
      },
      subtitle: 'Purpose-built for extreme northern climates. From -40°C freeze protection to modular home maintenance, we speak your language.',
      ctaPrimary: {
        text: 'Start Free Today',
        onClick: () => {
          setAuthModalTab('register');
          setAuthModalOpen(true);
        },
      },
      ctaSecondary: {
        text: 'Why Northern-Specific?',
        href: '#features',
      },
    },
  ];


  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-furnace-primary/10 bg-black/80 backdrop-blur-md"
          : "border-furnace-primary/10 bg-black/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" className="cursor-pointer" />
              {user && (
                <nav className="hidden md:flex items-center gap-1 ml-8">
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 text-sm text-fl-text-secondary hover:text-white font-medium transition-colors rounded-lg hover:bg-fl-card-bg"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-sm text-fl-text-secondary hover:text-white font-medium transition-colors rounded-lg hover:bg-fl-card-bg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/wiki')}
                    className="px-4 py-2 text-sm text-fl-text-secondary hover:text-white font-medium transition-colors rounded-lg hover:bg-fl-card-bg"
                  >
                    Wiki
                  </button>
                </nav>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-fl-text-secondary hover:text-white font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-fl-card-bg border border-fl-card-border rounded-lg py-2">
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fl-text-secondary hover:bg-fl-card-border hover:text-white transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate('/wiki');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fl-text-secondary hover:bg-fl-card-border hover:text-white transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Wiki
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fl-text-secondary hover:bg-fl-card-border hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fl-text-secondary hover:bg-fl-card-border hover:text-white transition-colors"
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
                    className="px-4 py-2 text-sm text-fl-text-secondary hover:text-white font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('register');
                      setAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-furnace-primary hover:bg-furnace-light text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40"
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
          <section className="relative overflow-hidden border-b border-furnace-primary/10">
            {/* Animated Flames Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Flame particles */}
              {Array.from({ length: 25 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 5,
                duration: 6 + Math.random() * 4,
                size: 15 + Math.random() * 35,
                opacity: 0.08 + Math.random() * 0.1,
                hue: Math.random() > 0.5 ? 'orange' : 'amber',
              })).map((flame) => (
                <div
                  key={flame.id}
                  className="absolute bottom-0"
                  style={{
                    left: `${flame.left}%`,
                    animation: `flameRise ${flame.duration}s ease-out infinite`,
                    animationDelay: `${flame.delay}s`,
                  }}
                >
                  <div
                    className={`rounded-full blur-xl ${flame.hue === 'orange' ? 'bg-orange-600' : 'bg-amber-500'}`}
                    style={{
                      width: `${flame.size}px`,
                      height: `${flame.size * 1.5}px`,
                      opacity: flame.opacity * 0.6,
                      animation: `flameFlicker ${1 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                    }}
                  />
                </div>
              ))}

              {/* Embers */}
              {Array.from({ length: 12 }, (_, i) => ({
                id: i,
                left: 10 + Math.random() * 80,
                delay: Math.random() * 8,
                duration: 7 + Math.random() * 5,
                size: 1 + Math.random() * 2.5,
              })).map((ember) => (
                <div
                  key={`ember-${ember.id}`}
                  className="absolute bottom-0 bg-orange-500 rounded-full"
                  style={{
                    left: `${ember.left}%`,
                    width: `${ember.size}px`,
                    height: `${ember.size}px`,
                    animation: `emberFloat ${ember.duration}s ease-out infinite`,
                    animationDelay: `${ember.delay}s`,
                    boxShadow: '0 0 3px 1px rgba(251, 146, 60, 0.25)',
                  }}
                />
              ))}

              {/* Heat wave at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-28 opacity-10"
                style={{
                  background: 'linear-gradient(to top, rgba(234, 88, 12, 0.15), transparent)',
                  animation: 'heatWave 5s ease-in-out infinite',
                }}
              />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-8 md:py-10">
              <HeroCarouselImmersive
                slides={heroSlides}
                autoAdvance={true}
                autoAdvanceInterval={10000}
              />
            </div>

            {/* Flame Animation Styles */}
            <style>{`
              @keyframes flameRise {
                0% { transform: translateY(0) scale(1); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 0.4; }
                100% { transform: translateY(-35vh) scale(0.2); opacity: 0; }
              }
              @keyframes flameFlicker {
                0% { transform: scaleX(1) scaleY(1); }
                100% { transform: scaleX(0.9) scaleY(1.05); }
              }
              @keyframes emberFloat {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                15% { opacity: 0.6; }
                85% { opacity: 0.25; }
                100% { transform: translateY(-50vh) translateX(20px); opacity: 0; }
              }
              @keyframes heatWave {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
            `}</style>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 border-b border-furnace-primary/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white">Purpose-Built for the North</h2>
                <p className="text-xl text-fl-text-secondary">
                  Every feature designed for extreme climates, modular housing, and remote communities
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-fl-card-bg border border-fl-card-border hover:border-furnace-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-furnace-primary/10 border border-furnace-primary/30 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-furnace-primary/20">
                    <Flame className="w-7 h-7 text-furnace-primary group-hover:animate-flicker" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Heating System Tracking</h3>
                  <p className="text-fl-text-secondary leading-relaxed">
                    Monitor propane furnaces, oil boilers, heat trace cables, and HRV systems with northern-specific maintenance schedules.
                  </p>
                </div>

                <div className="group bg-fl-card-bg border border-fl-card-border hover:border-furnace-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-furnace-primary/10 border border-furnace-primary/30 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-furnace-primary/20">
                    <Calendar className="w-7 h-7 text-furnace-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Seasonal Checklists</h3>
                  <p className="text-fl-text-secondary leading-relaxed">
                    Automated freeze-up, winter operations, break-up, and summer task lists tailored to territorial weather patterns.
                  </p>
                </div>

                <div className="group bg-fl-card-bg border border-fl-card-border hover:border-furnace-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-furnace-primary/10 border border-furnace-primary/30 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-furnace-primary/20">
                    <Snowflake className="w-7 h-7 text-furnace-primary group-hover:animate-float" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Weather Alerts</h3>
                  <p className="text-fl-text-secondary leading-relaxed">
                    Real-time extreme cold warnings, wind chill alerts, and automated maintenance reminders based on temperature.
                  </p>
                </div>

                <div className="group bg-fl-card-bg border border-fl-card-border hover:border-furnace-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-furnace-primary/10 border border-furnace-primary/30 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-furnace-primary/20">
                    <Home className="w-7 h-7 text-furnace-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Modular Home Support</h3>
                  <p className="text-fl-text-secondary leading-relaxed">
                    Track marriage walls, skirting maintenance, foundation piles, and belly board inspections specific to manufactured homes.
                  </p>
                </div>

                <div className="group bg-fl-card-bg border border-fl-card-border hover:border-furnace-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-furnace-primary/10 border border-furnace-primary/30 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-furnace-primary/20">
                    <AlertTriangle className="w-7 h-7 text-furnace-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Freeze Prevention</h3>
                  <p className="text-fl-text-secondary leading-relaxed">
                    Log freeze events, track heat trace cable zones, and receive proactive alerts before pipes freeze at -40°C.
                  </p>
                </div>

                <div className="group bg-fl-card-bg border border-fl-card-border hover:border-furnace-primary/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-furnace-primary/10 border border-furnace-primary/30 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-furnace-primary/20">
                    <TrendingDown className="w-7 h-7 text-furnace-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Offline-First Design</h3>
                  <p className="text-fl-text-secondary leading-relaxed">
                    Full functionality without internet connection. Perfect for remote communities with limited connectivity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-24 border-b border-furnace-primary/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Choose Your Plan
                </h2>
                <p className="text-xl text-fl-text-secondary">
                  Start free, or unlock advanced features for just $6.99/month. All plans include core features.
                </p>
              </div>

              <PricingPlans />

              <div className="mt-16 text-center">
                <p className="text-sm text-fl-text-secondary/70 max-w-2xl mx-auto">
                  All plans include unlimited homes, maintenance tracking, weather alerts, and community support.
                  Upgrade anytime to unlock advanced features. No credit card required to start.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 border-b border-furnace-primary/10">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Start Protecting Your Home Today
              </h2>
              <p className="text-xl text-fl-text-secondary max-w-2xl mx-auto">
                Join northern homeowners who trust FurnaceLog to keep their homes safe, warm, and well-maintained through extreme winters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-furnace-primary to-furnace-light text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-fl-card-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-furnace-primary to-furnace-light rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">FurnaceLog</span>
            </div>
            {!loading && health?.status === 'healthy' && (
              <div className="flex items-center gap-2 text-sm text-fl-text-secondary">
                <div className="w-2 h-2 bg-furnace-primary rounded-full" />
                <span>All Systems Operational</span>
              </div>
            )}
            <p className="text-sm text-fl-text-secondary/70">Built for Canada's North</p>
          </div>
          <div className="pt-8 text-center text-sm text-fl-text-secondary/70">
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
