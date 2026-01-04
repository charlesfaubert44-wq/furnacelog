import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Plus, AlertTriangle, CheckCircle2, Clock, Flame, Droplets, Wind, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useScrollAnimation';

/**
 * Dashboard Page
 * Main dashboard for authenticated users
 */

interface MaintenanceTask {
  id: string;
  title: string;
  system: string;
  dueDate: Date;
  status: 'overdue' | 'due-soon' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
}

interface SystemStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'healthy' | 'warning' | 'critical';
  lastService: string;
  health: number;
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Furnace Filter Replacement',
    system: 'Propane Furnace',
    dueDate: new Date('2026-01-05'),
    status: 'overdue',
    priority: 'high',
  },
  {
    id: '2',
    title: 'HRV Core Cleaning',
    system: 'HRV System',
    dueDate: new Date('2026-01-10'),
    status: 'due-soon',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Heat Trace Inspection',
    system: 'Freeze Protection',
    dueDate: new Date('2026-01-15'),
    status: 'upcoming',
    priority: 'high',
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

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isScrolled } = useScrollPosition();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const overdueCount = mockTasks.filter((t) => t.status === 'overdue').length;
  const dueSoonCount = mockTasks.filter((t) => t.status === 'due-soon').length;
  const upcomingCount = mockTasks.filter((t) => t.status === 'upcoming').length;

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
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                  <Flame className="w-6 h-6 text-[#f4e8d8]" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#f4e8d8] tracking-tight">
                    FurnaceLog
                  </h1>
                  <p className="text-xs text-[#d4a373] font-medium">Northern Home Tracker</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-1 ml-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors rounded-lg hover:bg-[#2a2a2a]/50"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm text-[#ff6b35] font-medium transition-colors rounded-lg bg-[#2a2a2a]/50"
                >
                  Dashboard
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
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
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
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
              <button className="px-6 py-3 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] hover:from-[#f7931e] hover:to-[#ff6b35] text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                <Plus className="h-4 w-4" />
                Log Maintenance
              </button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Maintenance Summary */}
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
                    <p className="text-center text-sm text-[#d45d4e] font-medium">Overdue</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#f7931e]/20 to-[#f7931e]/10 border border-[#f7931e]/30 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-[#f7931e]" />
                      <span className="text-3xl font-bold text-[#f4e8d8]">{dueSoonCount}</span>
                    </div>
                    <p className="text-center text-sm text-[#f7931e] font-medium">Due Soon</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#d4a373]/20 to-[#d4a373]/10 border border-[#d4a373]/30 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-[#d4a373]" />
                      <span className="text-3xl font-bold text-[#f4e8d8]">{upcomingCount}</span>
                    </div>
                    <p className="text-center text-sm text-[#d4a373] font-medium">Upcoming</p>
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "group p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02]",
                        task.status === 'overdue' && 'bg-gradient-to-br from-[#d45d4e]/10 to-[#0a0a0a] border-[#d45d4e]/30 hover:border-[#d45d4e]/50',
                        task.status === 'due-soon' && 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#f7931e]/30 hover:border-[#f7931e]/50',
                        task.status === 'upcoming' && 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-[#f4e8d8]/10 hover:border-[#ff6b35]/30'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-[#f4e8d8] mb-1">{task.title}</h4>
                          <p className="text-xs text-[#d4a373]">{task.system}</p>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-lg border font-medium",
                          task.status === 'overdue' && 'bg-[#d45d4e]/20 text-[#d45d4e] border-[#d45d4e]/30',
                          task.status === 'due-soon' && 'bg-[#f7931e]/20 text-[#f7931e] border-[#f7931e]/30',
                          task.status === 'upcoming' && 'bg-[#d4a373]/20 text-[#d4a373] border-[#d4a373]/30'
                        )}>
                          {task.dueDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-[#f4e8d8] mb-6">System Status</h3>
                <div className="space-y-4">
                  {systems.map((system) => (
                    <div key={system.id} className="group p-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#2a2a2a] hover:to-[#2a2a2a] border border-[#f4e8d8]/10 hover:border-[#ff6b35]/30 rounded-xl transition-all duration-300 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          system.status === 'healthy' && 'bg-gradient-to-br from-[#7ea88f] to-[#6a994e]',
                          system.status === 'warning' && 'bg-gradient-to-br from-[#f7931e] to-[#ff6b35]',
                          system.status === 'critical' && 'bg-gradient-to-br from-[#d45d4e] to-[#d4734e]'
                        )}>
                          <system.icon className="h-7 w-7 text-[#f4e8d8]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-[#f4e8d8]">{system.name}</h4>
                          <p className="text-xs text-[#d4a373]">{system.lastService}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                              <circle
                                cx="24"
                                cy="24"
                                r="15"
                                stroke="#2a2a2a"
                                strokeWidth="3"
                                fill="none"
                              />
                              <circle
                                cx="24"
                                cy="24"
                                r="15"
                                className={cn(
                                  system.status === 'healthy' && 'stroke-[#7ea88f]',
                                  system.status === 'warning' && 'stroke-[#f7931e]',
                                  system.status === 'critical' && 'stroke-[#d45d4e]'
                                )}
                                strokeWidth="3"
                                strokeDasharray={`${system.health * 0.942} 100`}
                                strokeLinecap="round"
                                fill="none"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#f4e8d8]">
                              {system.health}%
                            </span>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-lg border font-medium",
                            system.status === 'healthy' && 'bg-[#7ea88f]/20 text-[#7ea88f] border-[#7ea88f]/30',
                            system.status === 'warning' && 'bg-[#f7931e]/20 text-[#f7931e] border-[#f7931e]/30',
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
