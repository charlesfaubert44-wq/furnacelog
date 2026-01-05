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
  ];


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
              {user && (
                <nav className="hidden md:flex items-center gap-1 ml-8">
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-xl hover:bg-soft-beige/30"
                  >
                    Home
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
                <>
                  <button
                    onClick={() => {
                      setAuthModalTab('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('register');
                      setAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-fireplace hover:shadow-warm-glow text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-warm-sm"
                  >
                    Start Free Today
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

          {/* Warm, Cozy Hero Section */}
          <section className="relative overflow-hidden bg-gradient-paper border-b border-soft-beige/30">
            {/* Subtle warm glow background */}
            <div className="absolute inset-0 bg-gradient-warm-glow opacity-50 pointer-events-none" />

            {/* Gentle floating particles (like warm dust in sunlight) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {Array.from({ length: 8 }, (_, i) => ({
                id: i,
                left: 10 + Math.random() * 80,
                top: Math.random() * 100,
                delay: Math.random() * 10,
                duration: 15 + Math.random() * 10,
                size: 2 + Math.random() * 3,
              })).map((particle) => (
                <div
                  key={`particle-${particle.id}`}
                  className="absolute bg-soft-amber/40 rounded-full blur-sm"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animation: `gentleFloat ${particle.duration}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-8 md:py-10">
              <HeroCarouselImmersive
                slides={heroSlides}
                autoAdvance={true}
                autoAdvanceInterval={10000}
              />
            </div>

            {/* Gentle animation styles */}
            <style>{`
              @keyframes gentleFloat {
                0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
                50% { transform: translateY(-10px) translateX(-10px); opacity: 0.4; }
                75% { transform: translateY(-30px) translateX(5px); opacity: 0.5; }
              }
            `}</style>
          </section>

          {/* Warm Features Grid */}
          <section id="features" className="py-24 bg-cream border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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

          {/* Warm Pricing Section */}
          <section id="pricing" className="py-24 bg-gradient-cozy border-b border-soft-beige/30">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                  Simple, Honest Pricing
                </h2>
                <p className="text-lg text-warm-gray leading-relaxed">
                  Start free and upgrade when you're ready. No surprises, no pressure—just peace of mind.
                </p>
              </div>

              <PricingPlans />

              <div className="mt-16 text-center">
                <p className="text-sm text-warm-gray/80 max-w-2xl mx-auto leading-relaxed">
                  All plans include unlimited homes, maintenance tracking, weather alerts, and community support.
                  Upgrade anytime to unlock advanced features. No credit card required to start.
                </p>
              </div>
            </div>
          </section>

          {/* Warm CTA Section */}
          <section className="py-24 bg-gradient-paper border-b border-soft-beige/30">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                Welcome Home to Peace of Mind
              </h2>
              <p className="text-lg text-warm-gray max-w-2xl mx-auto leading-relaxed">
                Join northern homeowners who sleep soundly knowing their homes are safe, warm, and well-maintained—even in the coldest winters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-fireplace hover:shadow-warm-glow text-white font-semibold rounded-xl transition-all duration-300 shadow-warm-sm"
                >
                  Start Your Free Journey
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

      {/* Warm Footer */}
      <footer className="py-12 bg-wood-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-wood-light/20">
            <Logo size="sm" className="[&_path]:fill-cream [&_path]:stroke-cream [&_span]:!text-cream" />
            {!loading && health?.status === 'healthy' && (
              <div className="flex items-center gap-2 text-sm text-soft-beige/80">
                <div className="w-2 h-2 bg-soft-amber rounded-full animate-pulse" />
                <span>All Systems Running</span>
              </div>
            )}
            <p className="text-sm text-soft-beige/70">Built with Care for Northern Homes</p>
          </div>
          <div className="pt-8 text-center text-sm text-soft-beige/70">
            © 2026 FurnaceLog. Open source home maintenance tracking for everyone.
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
