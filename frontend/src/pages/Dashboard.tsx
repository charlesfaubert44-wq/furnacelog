import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Plus, AlertTriangle, CheckCircle2, Clock, Flame, Droplets, Wind, Zap, BookOpen, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import { LogMaintenanceModal, type MaintenanceTaskInput } from '@/components/modals/LogMaintenanceModal';
import { getDashboardData, type DashboardData } from '@/services/dashboard.service';

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

// Helper function to get icon for system category
const getSystemIcon = (category: string): React.ElementType => {
  const iconMap: Record<string, React.ElementType> = {
    heating: Flame,
    water: Droplets,
    ventilation: Wind,
    electrical: Zap,
    sewage: Wind,
    default: Settings,
  };
  return iconMap[category.toLowerCase()] || iconMap.default;
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const { isScrolled } = useScrollPosition();

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleSaveTask = (task: MaintenanceTaskInput) => {
    // TODO: Connect to backend API to save the task
    console.log('Saving task:', task);
    // For now, we'll just log it - the modal already shows a success message
  };

  const handleTaskClick = (taskId: string) => {
    // TODO: Open task detail modal or navigate to task detail page
    console.log('Task clicked:', taskId);
    alert('Task details coming soon! This will show full task information, allow editing, and mark as complete.');
  };

  // Transform API tasks to component format
  const tasks: MaintenanceTask[] = dashboardData?.maintenanceSummary.upcomingTasks.map(task => ({
    id: task.id,
    title: task.title,
    system: task.system?.name || 'General',
    dueDate: new Date(task.dueDate),
    status: task.daysUntilDue < 0 ? 'overdue' : task.daysUntilDue <= 7 ? 'due-soon' : 'upcoming',
    priority: task.priority === 'critical' ? 'high' : task.priority,
  })) || [];

  // Transform API systems to component format
  const systems: SystemStatus[] = dashboardData?.systemsStatus.systems.map(system => ({
    id: system.id,
    name: system.name,
    icon: getSystemIcon(system.category),
    status: system.statusColor === 'green' ? 'healthy' : system.statusColor === 'yellow' ? 'warning' : 'critical',
    lastService: system.lastServiceDate ? new Date(system.lastServiceDate).toLocaleDateString() : 'Never',
    health: system.healthScore,
  })) || [];

  const overdueCount = dashboardData?.maintenanceSummary.overdue || 0;
  const dueSoonCount = dashboardData?.maintenanceSummary.dueSoon || 0;
  const upcomingCount = dashboardData?.maintenanceSummary.upcoming || 0;

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
                <button
                  onClick={() => navigate('/wiki')}
                  className="px-4 py-2 text-sm text-[#d4a373] hover:text-[#f4e8d8] font-medium transition-colors rounded-lg hover:bg-[#2a2a2a]/50"
                >
                  Wiki
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
                      onClick={() => {
                        navigate('/wiki');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#d4a373] hover:bg-[#2a2a2a] hover:text-[#f4e8d8] transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Wiki
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#d4a373] hover:bg-[#2a2a2a] hover:text-[#f4e8d8] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
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
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#ff6b35] animate-spin mx-auto mb-4" />
                <p className="text-[#d4a373] text-lg">Loading your dashboard...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border border-[#d45d4e]/30 rounded-2xl p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-[#d45d4e] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#f4e8d8] mb-2">Unable to Load Dashboard</h3>
                <p className="text-[#d4a373] mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] hover:from-[#f7931e] hover:to-[#ff6b35] text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!isLoading && !error && dashboardData && (
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
              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] hover:from-[#f7931e] hover:to-[#ff6b35] text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-[0_4px_16px_rgba(255,107,53,0.3)] hover:shadow-[0_6px_24px_rgba(255,107,53,0.45)]"
              >
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
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 text-[#7ea88f] mx-auto mb-3" />
                      <p className="text-[#d4a373] text-sm">No upcoming maintenance tasks</p>
                      <p className="text-[#d4a373]/70 text-xs mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
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
                  ))
                  )}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#f4e8d8]/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-[#f4e8d8] mb-6">System Status</h3>
                <div className="space-y-4">
                  {systems.length === 0 ? (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 text-[#d4a373] mx-auto mb-3" />
                      <p className="text-[#d4a373] text-sm">No systems configured yet</p>
                      <p className="text-[#d4a373]/70 text-xs mt-1">Complete onboarding to add systems</p>
                    </div>
                  ) : (
                    systems.map((system) => (
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
                  ))
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Maintenance Modal */}
      <LogMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}

export default Dashboard;
