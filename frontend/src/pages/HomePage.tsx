import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Thermometer, Home, Calendar, AlertTriangle, Snowflake, Flame, Shield, CheckCircle2, ArrowRight, MapPin, Clock, TrendingDown, Plus, FileText, Wrench, Wind, Droplets, Zap, Circle, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-stone-300 hover:text-stone-50 font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-stone-900 border border-stone-800 rounded-lg shadow-xl py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-stone-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Conditional Content - Marketing vs Dashboard */}
      {user ? (
        /* DASHBOARD CONTENT (When Logged In) */
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-stone-50 tracking-tight">
                  Dashboard
                </h2>
                <p className="text-stone-400 mt-2">
                  Welcome back! Here's your home maintenance overview.
                </p>
              </div>
              <button className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-stone-50 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Log Maintenance
              </button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Maintenance Summary - Spans 2 columns on xl */}
              <div className="xl:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-stone-50">Maintenance Summary</h3>
                  <p className="text-sm text-stone-400 mt-1">Track your upcoming and overdue tasks</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 border border-red-800/40 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <span className="text-3xl font-bold text-red-300">{overdueCount}</span>
                    </div>
                    <p className="text-xs text-red-400 font-medium text-center uppercase tracking-wide">Overdue</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-950/60 to-amber-900/40 border border-amber-800/40 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-amber-400" />
                      <span className="text-3xl font-bold text-amber-300">{dueSoonCount}</span>
                    </div>
                    <p className="text-xs text-amber-400 font-medium text-center uppercase tracking-wide">This Week</p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-950/60 to-sky-900/40 border border-sky-800/40 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-sky-400" />
                      <span className="text-3xl font-bold text-sky-300">{upcomingCount}</span>
                    </div>
                    <p className="text-xs text-sky-400 font-medium text-center uppercase tracking-wide">Upcoming</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-4 rounded-xl p-4 transition-all cursor-pointer border-2',
                        task.status === 'overdue' && 'bg-red-950/30 border-red-900/50 hover:border-red-800/70',
                        task.status === 'due-soon' && 'bg-amber-950/30 border-amber-900/50 hover:border-amber-800/70',
                        task.status === 'upcoming' && 'bg-stone-800/50 border-stone-700 hover:border-stone-600'
                      )}
                    >
                      <div className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                        task.status === 'overdue' && 'bg-red-900/40 text-red-400',
                        task.status === 'due-soon' && 'bg-amber-900/40 text-amber-400',
                        task.status === 'upcoming' && 'bg-stone-700 text-stone-300'
                      )}>
                        {task.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-100 text-sm">{task.title}</h4>
                        <p className="text-xs text-stone-400 mt-0.5">{task.system}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
                          task.status === 'overdue' && 'bg-red-900/40 text-red-300',
                          task.status === 'due-soon' && 'bg-amber-900/40 text-amber-300',
                          task.status === 'upcoming' && 'bg-stone-700 text-stone-300'
                        )}>
                          {task.dueDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-stone-50">Current Weather</h3>
                  <p className="text-sm text-stone-400 mt-1">Yellowknife, NT</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-sky-400">{currentTemp}°C</span>
                      </div>
                      <p className="text-sm text-stone-400 mt-2">
                        Feels like <span className="text-stone-300 font-medium">{windChill}°C</span>
                      </p>
                    </div>
                    <div className="text-5xl">🌨️</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-lg p-3">
                    <div className="w-10 h-10 bg-stone-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Wind className="h-5 w-5 text-stone-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-stone-400">Wind</p>
                      <p className="text-sm font-semibold text-stone-200">{windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-stone-800 border border-stone-700 rounded-lg p-3">
                    <div className="w-10 h-10 bg-stone-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="h-5 w-5 text-stone-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-stone-400">Humidity</p>
                      <p className="text-sm font-semibold text-stone-200">{humidity}%</p>
                    </div>
                  </div>
                </div>
                {hasAlert && (
                  <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 border-2 border-red-800/50 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-900/50 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-300 text-sm mb-1">Extreme Cold Warning</h4>
                        <p className="text-xs text-red-400 leading-relaxed">
                          Check heat trace systems and ensure furnace is operating properly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2 text-xs text-amber-400/90">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Monitor furnace operation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Verify heat trace cables are active</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Let taps drip to prevent freezing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* System Status - Spans 2 columns on lg */}
              <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-stone-50">System Status</h3>
                  <p className="text-sm text-stone-400 mt-1">Monitor your critical home systems</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systems.map((system) => (
                    <div key={system.id} className="bg-stone-800 border border-stone-700 hover:border-stone-600 rounded-xl p-4 transition-all cursor-pointer">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                          system.status === 'healthy' ? 'bg-emerald-950/60 border border-emerald-800/50' :
                          system.status === 'warning' ? 'bg-amber-950/60 border border-amber-800/50' :
                          'bg-red-950/60 border border-red-800/50'
                        }`}>
                          <system.icon className={`h-6 w-6 ${
                            system.status === 'healthy' ? 'text-emerald-400' :
                            system.status === 'warning' ? 'text-amber-400' :
                            'text-red-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-stone-100">{system.name}</h4>
                            {system.status === 'healthy' && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                            {system.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-stone-400">Last service: {system.lastService}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-stone-700">
                        <span className="text-xs text-stone-400 uppercase tracking-wide">Health Score</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-stone-200">{system.health}%</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            system.status === 'healthy' ? 'bg-emerald-950/40 text-emerald-400' :
                            system.status === 'warning' ? 'bg-amber-950/40 text-amber-400' :
                            'bg-red-950/40 text-red-400'
                          }`}>
                            {system.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Checklist */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-stone-50">Winter Checklist</h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-950/40 text-sky-400">
                      {progressPercentage}%
                    </span>
                  </div>
                  <p className="text-sm text-stone-400">Critical seasonal tasks</p>
                </div>
                <div className="mb-6">
                  <div className="h-2 bg-stone-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
                  </div>
                  <p className="text-xs text-stone-400">{completedCount} of {totalCount} tasks complete</p>
                </div>
                <div className="space-y-2 flex-1 mb-4">
                  {winterChecklist.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-stone-800 border border-stone-700 hover:border-stone-600 rounded-lg transition-all cursor-pointer">
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-stone-500 flex-shrink-0" />
                      )}
                      <span className={`flex-1 text-sm ${item.completed ? 'text-stone-500 line-through' : 'text-stone-200'}`}>
                        {item.title}
                      </span>
                      {item.priority === 'high' && !item.completed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-950/40 text-red-400">High</span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  View Full Checklist
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-stone-50 mb-2">Quick Actions</h3>
                <p className="text-sm text-stone-400">Frequently used actions to manage your home</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Home className="w-6 h-6 text-emerald-100" />
                  </div>
                  <span className="text-sm font-medium text-stone-200">Add System</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-amber-100" />
                  </div>
                  <span className="text-sm font-medium text-stone-200">Schedule Task</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-700 to-sky-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-sky-100" />
                  </div>
                  <span className="text-sm font-medium text-stone-200">Upload Document</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-700 to-violet-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-6 h-6 text-violet-100" />
                  </div>
                  <span className="text-sm font-medium text-stone-200">Find Provider</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MARKETING CONTENT (When Logged Out) */
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-stone-800">
            <div className="absolute inset-0 opacity-[0.015]">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)`
              }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-stone-950" />

            <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                      <span className="block text-amber-500 mt-2">Northern Home</span>
                    </h2>
                    <p className="text-xl text-stone-300 leading-relaxed max-w-xl">
                      Track heating systems, prevent freeze damage, and manage maintenance for homes
                      built to survive <span className="text-stone-50 font-semibold">-40°C winters</span>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/register" className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-amber-700 hover:bg-amber-600 text-stone-50 font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-amber-900/40">
                      Start Free Today
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a href="#features" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-100 font-semibold rounded-xl transition-all duration-200">
                      See Features
                    </a>
                  </div>

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

                <div className="relative">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-stone-900 to-stone-900/95 border-2 border-red-900/40 rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-950/60 border border-red-800/50 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-stone-50">Extreme Cold Alert</h3>
                            <span className="flex-shrink-0 text-xs text-red-400 font-medium bg-red-950/40 px-2 py-1 rounded">URGENT</span>
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

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-950/60 border border-amber-800/50 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-stone-50">Furnace Filter Due</h3>
                            <span className="flex-shrink-0 text-xs text-amber-400 font-medium bg-amber-950/40 px-2 py-1 rounded">TOMORROW</span>
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

                    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-950/60 border border-emerald-800/50 rounded-xl flex items-center justify-center">
                          <Home className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-semibold text-stone-50">All Systems Running</h3>
                            <span className="flex-shrink-0 text-xs text-emerald-400 font-medium bg-emerald-950/40 px-2 py-1 rounded">HEALTHY</span>
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
                <h2 className="text-4xl md:text-5xl font-bold text-stone-50">Purpose-Built for the North</h2>
                <p className="text-xl text-stone-400">
                  Every feature designed for extreme climates, modular housing, and remote communities
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-stone-900 border border-stone-800 hover:border-amber-800/50 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-orange-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Flame className="w-7 h-7 text-amber-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-50 mb-3">Heating System Tracking</h3>
                  <p className="text-stone-400 leading-relaxed">
                    Monitor propane furnaces, oil boilers, heat trace cables, and HRV systems with northern-specific maintenance schedules.
                  </p>
                </div>

                <div className="group bg-stone-900 border border-stone-800 hover:border-emerald-800/50 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Calendar className="w-7 h-7 text-emerald-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-50 mb-3">Seasonal Checklists</h3>
                  <p className="text-stone-400 leading-relaxed">
                    Automated freeze-up, winter operations, break-up, and summer task lists tailored to territorial weather patterns.
                  </p>
                </div>

                <div className="group bg-stone-900 border border-stone-800 hover:border-sky-800/50 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-700 to-sky-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Snowflake className="w-7 h-7 text-sky-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-50 mb-3">Weather Alerts</h3>
                  <p className="text-stone-400 leading-relaxed">
                    Real-time extreme cold warnings, wind chill alerts, and automated maintenance reminders based on temperature.
                  </p>
                </div>

                <div className="group bg-stone-900 border border-stone-800 hover:border-violet-800/50 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-700 to-violet-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Home className="w-7 h-7 text-violet-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-50 mb-3">Modular Home Support</h3>
                  <p className="text-stone-400 leading-relaxed">
                    Track marriage walls, skirting maintenance, foundation piles, and belly board inspections specific to manufactured homes.
                  </p>
                </div>

                <div className="group bg-stone-900 border border-stone-800 hover:border-orange-800/50 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-700 to-red-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-orange-100" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-50 mb-3">Freeze Prevention</h3>
                  <p className="text-stone-400 leading-relaxed">
                    Log freeze events, track heat trace cable zones, and receive proactive alerts before pipes freeze at -40°C.
                  </p>
                </div>

                <div className="group bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl p-8 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-stone-700 to-stone-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <TrendingDown className="w-7 h-7 text-stone-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-50 mb-3">Offline-First Design</h3>
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
                <Link to="/register" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-700 hover:bg-amber-600 text-stone-50 font-semibold rounded-xl transition-all duration-200 shadow-xl shadow-amber-900/40">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

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
            <p className="text-sm text-stone-500">Built for Canada's North</p>
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
