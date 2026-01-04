import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Home, Calendar, AlertTriangle, Snowflake, Flame, CheckCircle2, ArrowRight, MapPin, Clock, TrendingDown, Plus, FileText, Wrench, Wind, Droplets, Zap, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import logger from '@/utils/logger';
import { fetchNorthernWeather, type CityWeather } from '@/services/weather.service';
import { getTemperatureQuote } from '@/utils/weatherQuotes';
import { PricingPlans } from '@/components/pricing/PricingPlans';

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

interface MaintenanceTask {
  id: string;
  title: string;
  system: string;
  dueDate: Date;
  status: 'overdue' | 'due-soon' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
}

interface SystemStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'healthy' | 'warning' | 'critical';
  lastService: string;
  health: number;
}

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Furnace Filter Replacement',
    system: 'Propane Furnace',
    dueDate: new Date('2026-01-05'),
    status: 'overdue',
    priority: 'high',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: '2',
    title: 'HRV Core Cleaning',
    system: 'HRV System',
    dueDate: new Date('2026-01-10'),
    status: 'due-soon',
    priority: 'medium',
    icon: <Wind className="w-4 h-4" />,
  },
  {
    id: '3',
    title: 'Heat Trace Inspection',
    system: 'Freeze Protection',
    dueDate: new Date('2026-01-15'),
    status: 'upcoming',
    priority: 'high',
    icon: <Droplets className="w-4 h-4" />,
  },
];

const systems: SystemStatus[] = [
  {
    id: '1',
    name: 'Propane Furnace',
    icon: Flame,
    status: 'healthy',
    lastService: '2 weeks ago',
    health: 94,
  },
  {
    id: '2',
    name: 'Water System',
    icon: Droplets,
    status: 'warning',
    lastService: '3 months ago',
    health: 68,
  },
  {
    id: '3',
    name: 'HRV Ventilation',
    icon: Wind,
    status: 'healthy',
    lastService: '1 month ago',
    health: 88,
  },
  {
    id: '4',
    name: 'Electrical',
    icon: Zap,
    status: 'healthy',
    lastService: '6 months ago',
    health: 96,
  },
];

const winterChecklist: ChecklistItem[] = [
  { id: '1', title: 'Inspect heat trace cables', completed: true, priority: 'high' },
  { id: '2', title: 'Test furnace safety systems', completed: true, priority: 'high' },
  { id: '3', title: 'Clean HRV filters', completed: false, priority: 'medium' },
  { id: '4', title: 'Check insulation in attic', completed: false, priority: 'medium' },
  { id: '5', title: 'Stock emergency supplies', completed: false, priority: 'low' },
];

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

  // Dashboard widgets data
  const overdueCount = mockTasks.filter((t) => t.status === 'overdue').length;
  const dueSoonCount = mockTasks.filter((t) => t.status === 'due-soon').length;
  const upcomingCount = mockTasks.filter((t) => t.status === 'upcoming').length;
  const completedCount = winterChecklist.filter((item) => item.completed).length;
  const totalCount = winterChecklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);
  const currentTemp = -18;
  const windChill = -28;
  const humidity = 72;
  const windSpeed = 15;
  const hasAlert = currentTemp < -20;

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

      {/* Conditional Content - Marketing vs Dashboard */}
      {user ? (
        /* DASHBOARD CONTENT (When Logged In) */
        <div className="relative min-h-screen">
          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] opacity-60" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(247, 147, 30, 0.15) 0%, transparent 50%)`
          }} />

          <div className="relative max-w-7xl mx-auto px-6 py-12">
            <div className="space-y-8">
              {/* Dashboard Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#d4a373] text-sm font-medium mb-2">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <h2 className="text-4xl font-bold text-[#f4e8d8] tracking-tight">
                    Welcome Home
                  </h2>
                  <p className="text-[#d4a373] mt-2">
                    Your home is warm and protected. Here's your maintenance overview.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] hover:from-[#ff6a00] hover:to-[#ff4500] text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Log Maintenance
                </button>
              </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Maintenance Summary - Spans 2 columns on xl */}
              <div className="xl:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#f4e8d8]">Maintenance Summary</h3>
                  <p className="text-sm text-[#d4a373] mt-1">Track your upcoming and overdue tasks</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border border-[#d45d4e]/30 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-[#d45d4e]" />
                      <span className="text-3xl font-bold text-[#f4e8d8]">{overdueCount}</span>
                    </div>
                    <p className="text-xs text-[#d45d4e] font-medium text-center uppercase tracking-wide">Overdue</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#ff9500]/20 to-[#ff9500]/10 border border-[#ff9500]/30 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-[#ff9500]" />
                      <span className="text-3xl font-bold text-[#f4e8d8]">{dueSoonCount}</span>
                    </div>
                    <p className="text-xs text-[#ff9500] font-medium text-center uppercase tracking-wide">This Week</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#d4a373]/20 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-[#d4a373]" />
                      <span className="text-3xl font-bold text-[#f4e8d8]">{upcomingCount}</span>
                    </div>
                    <p className="text-xs text-[#d4a373] font-medium text-center uppercase tracking-wide">Upcoming</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-4 rounded-xl p-4 transition-all duration-300 cursor-pointer border',
                        task.status === 'overdue' && 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#d45d4e]/30 hover:border-[#d45d4e]/50',
                        task.status === 'due-soon' && 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#ff9500]/30 hover:border-[#ff9500]/50',
                        task.status === 'upcoming' && 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-[#f4e8d8]/10 hover:border-[#ff4500]/30'
                      )}
                    >
                      <div className={cn(
                        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                        task.status === 'overdue' && 'bg-gradient-to-br from-[#d45d4e] to-[#d4734e] text-[#f4e8d8]',
                        task.status === 'due-soon' && 'bg-gradient-to-br from-[#ff9500] to-[#ff6a00] text-[#f4e8d8]',
                        task.status === 'upcoming' && 'bg-gradient-to-br from-[#d4a373] to-[#ff8c00] text-[#f4e8d8]'
                      )}>
                        {task.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#f4e8d8] text-sm">{task.title}</h4>
                        <p className="text-xs text-[#d4a373] mt-0.5">{task.system}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={cn(
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                          task.status === 'overdue' && 'bg-[#d45d4e]/20 text-[#d45d4e] border-[#d45d4e]/30',
                          task.status === 'due-soon' && 'bg-[#ff9500]/20 text-[#ff9500] border-[#ff9500]/30',
                          task.status === 'upcoming' && 'bg-[#d4a373]/20 text-[#d4a373] border-[#d4a373]/30'
                        )}>
                          {task.dueDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#f4e8d8]">Current Weather</h3>
                  <p className="text-sm text-[#d4a373] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Yellowknife, NT
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-bold bg-gradient-to-br from-[#c4d7e0] to-[#5b8fa3] bg-clip-text text-transparent">{currentTemp}°C</span>
                      </div>
                      <p className="text-sm text-[#d4a373] mt-2">
                        Feels like <span className="text-[#c4d7e0] font-semibold">{windChill}°C</span>
                      </p>
                    </div>
                    <div className="text-6xl opacity-90">🌨️</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-3 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 rounded-xl p-3 hover:border-[#5b8fa3]/30 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wind className="h-5 w-5 text-[#f4e8d8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#d4a373]">Wind</p>
                      <p className="text-sm font-semibold text-[#f4e8d8]">{windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 rounded-xl p-3 hover:border-[#5b8fa3]/30 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="h-5 w-5 text-[#f4e8d8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#d4a373]">Humidity</p>
                      <p className="text-sm font-semibold text-[#f4e8d8]">{humidity}%</p>
                    </div>
                  </div>
                </div>
                {hasAlert && (
                  <div className="bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border border-[#d45d4e]/40 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d45d4e] to-[#d4734e] rounded-xl flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-[#f4e8d8]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#f4e8d8] text-sm mb-1">Extreme Cold Warning</h4>
                        <p className="text-xs text-[#d4a373] leading-relaxed">
                          Check heat trace systems and ensure furnace is operating properly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-gradient-to-br from-[#ff9500]/15 to-[#ff6a00]/10 border border-[#ff9500]/30 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-[#f4e8d8] mb-3 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#ff9500]" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2 text-xs text-[#d4a373]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff4500] mt-0.5 font-bold">•</span>
                      <span>Monitor furnace operation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff4500] mt-0.5 font-bold">•</span>
                      <span>Verify heat trace cables are active</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ff4500] mt-0.5 font-bold">•</span>
                      <span>Let taps drip to prevent freezing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* System Status - Spans 2 columns on lg */}
              <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#f4e8d8]">System Status</h3>
                  <p className="text-sm text-[#d4a373] mt-1">Monitor your critical home systems</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systems.map((system) => (
                    <div key={system.id} className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 hover:border-[#ff4500]/30 rounded-xl p-5 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={cn(
                          'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
                          system.status === 'healthy' && 'bg-gradient-to-br from-[#6a994e] to-[#7ea88f]',
                          system.status === 'warning' && 'bg-gradient-to-br from-[#ff9500] to-[#ff6a00]',
                          system.status === 'critical' && 'bg-gradient-to-br from-[#d45d4e] to-[#d4734e]'
                        )}>
                          <system.icon className="h-7 w-7 text-[#f4e8d8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-[#f4e8d8]">{system.name}</h4>
                            {system.status === 'healthy' && <CheckCircle2 className="h-4 w-4 text-[#6a994e] flex-shrink-0" />}
                            {system.status === 'warning' && <AlertTriangle className="h-4 w-4 text-[#ff9500] flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-[#d4a373]">Last service: {system.lastService}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#f4e8d8]/10">
                        <span className="text-xs text-[#d4a373] uppercase tracking-wide font-medium">Health Score</span>
                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                              <circle
                                cx="18"
                                cy="18"
                                r="15"
                                fill="none"
                                className="stroke-[#2a2a2a]"
                                strokeWidth="3"
                              />
                              <circle
                                cx="18"
                                cy="18"
                                r="15"
                                fill="none"
                                className={cn(
                                  system.status === 'healthy' && 'stroke-[#6a994e]',
                                  system.status === 'warning' && 'stroke-[#ff9500]',
                                  system.status === 'critical' && 'stroke-[#d45d4e]'
                                )}
                                strokeWidth="3"
                                strokeDasharray={`${system.health * 0.942} 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#f4e8d8]">
                              {system.health}
                            </span>
                          </div>
                          <span className={cn(
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                            system.status === 'healthy' && 'bg-[#6a994e]/20 text-[#6a994e] border-[#6a994e]/30',
                            system.status === 'warning' && 'bg-[#ff9500]/20 text-[#ff9500] border-[#ff9500]/30',
                            system.status === 'critical' && 'bg-[#d45d4e]/20 text-[#d45d4e] border-[#d45d4e]/30'
                          )}>
                            {system.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Checklist */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 flex flex-col transition-all duration-300">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-[#f4e8d8]">Winter Checklist</h3>
                      <Snowflake className="w-5 h-5 text-[#c4d7e0]" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-br from-[#ff4500] to-[#ff6a00] text-[#f4e8d8]">
                      {progressPercentage}%
                    </span>
                  </div>
                  <p className="text-sm text-[#d4a373]">Critical seasonal tasks</p>
                </div>
                <div className="mb-6">
                  <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff6a00] transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#d4a373] font-medium">{completedCount} of {totalCount} tasks complete</p>
                </div>
                <div className="space-y-2 flex-1 mb-4">
                  {winterChecklist.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#f4e8d8]/10 hover:border-[#ff4500]/30 rounded-xl transition-all duration-300 cursor-pointer group"
                    >
                      {item.completed ? (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#6a994e] to-[#7ea88f] flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-[#f4e8d8]" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#d4a373]/40 group-hover:border-[#ff4500] transition-colors" />
                      )}
                      <span className={`flex-1 text-sm transition-colors ${item.completed ? 'text-[#d4a373]/60 line-through' : 'text-[#f4e8d8] group-hover:text-[#f4e8d8]'}`}>
                        {item.title}
                      </span>
                      {item.priority === 'high' && !item.completed && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#d45d4e]/20 text-[#d45d4e] border border-[#d45d4e]/30">
                          High
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#ff4500]/20 hover:to-[#ff6a00]/20 border border-[#f4e8d8]/20 hover:border-[#ff4500]/40 text-[#f4e8d8] text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                  View Full Checklist
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-[#f4e8d8] mb-2">Quick Actions</h3>
                <p className="text-sm text-[#d4a373]">Frequently used actions to manage your home</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#6a994e]/20 hover:to-[#7ea88f]/10 border border-[#f4e8d8]/10 hover:border-[#6a994e]/40 rounded-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#6a994e] to-[#7ea88f] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Home className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <span className="text-sm font-medium text-[#f4e8d8]">Add System</span>
                </button>
                <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#ff4500]/20 hover:to-[#ff6a00]/10 border border-[#f4e8d8]/10 hover:border-[#ff4500]/40 rounded-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <span className="text-sm font-medium text-[#f4e8d8]">Schedule Task</span>
                </button>
                <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#5b8fa3]/20 hover:to-[#7ea88f]/10 border border-[#f4e8d8]/10 hover:border-[#5b8fa3]/40 rounded-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#5b8fa3] to-[#7ea88f] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <span className="text-sm font-medium text-[#f4e8d8]">Upload Document</span>
                </button>
                <button className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#7ea88f]/20 hover:to-[#6a994e]/10 border border-[#f4e8d8]/10 hover:border-[#7ea88f]/40 rounded-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7ea88f] to-[#6a994e] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-7 h-7 text-[#f4e8d8]" />
                  </div>
                  <span className="text-sm font-medium text-[#f4e8d8]">Find Provider</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        /* MARKETING CONTENT (When Logged Out) */
        <>
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

          {/* Stats Section */}
          <section className="py-20 border-b border-[#d4a373]/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#ff4500] to-[#ff6a00] bg-clip-text text-transparent">-40°C</div>
                  <p className="text-[#d4a373]">Extreme cold tested</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#ff4500] to-[#ff6a00] bg-clip-text text-transparent">100%</div>
                  <p className="text-[#d4a373]">Free & open source</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#ff4500] to-[#ff6a00] bg-clip-text text-transparent">24/7</div>
                  <p className="text-[#d4a373]">Offline access</p>
                </div>
              </div>
            </div>
          </section>

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
        </>
      )}

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
