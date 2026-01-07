import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Plus, AlertTriangle, CheckCircle2, Flame, Droplets, Wind, Zap, BookOpen, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useScrollAnimation';
import { LogMaintenanceModal, type MaintenanceTaskInput } from '@/components/modals/LogMaintenanceModal';
import { getDashboardData, type DashboardData } from '@/services/dashboard.service';
import { Logo } from '@/components/furnacelog/Logo';
import { HealthScoreGauge } from '@/components/dashboard/HealthScoreGauge';
import { CriticalAlertsBanner, type Alert } from '@/components/dashboard/CriticalAlertsBanner';
import { QuickStatsCards } from '@/components/dashboard/QuickStatsCards';
import { EnhancedMaintenanceWidget } from '@/components/dashboard/EnhancedMaintenanceWidget';
import { EnhancedSystemStatusWidget } from '@/components/dashboard/EnhancedSystemStatusWidget';

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
  category: string;
}

// Helper function to get icon for system category
const getSystemIcon = (category: string): React.ElementType => {
  const iconMap: Record<string, React.ElementType> = {
    heating: Flame,
    water: Droplets,
    ventilation: Wind,
    electrical: Zap,
    sewage: Wind,
    default: SettingsIcon,
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

  const handleMarkComplete = (taskId: string) => {
    // TODO: Implement mark complete functionality
    console.log('Mark complete:', taskId);
    alert('Mark complete functionality coming soon!');
  };

  const handleHireContractor = (taskId: string) => {
    // TODO: Implement hire contractor functionality
    console.log('Hire contractor:', taskId);
    alert('Contractor hiring functionality coming soon!');
  };

  const handleReschedule = (taskId: string) => {
    // TODO: Implement reschedule functionality
    console.log('Reschedule:', taskId);
    alert('Reschedule functionality coming soon!');
  };

  const handleSystemClick = (systemId: string) => {
    // TODO: Open system detail modal
    console.log('System clicked:', systemId);
    alert('System details coming soon!');
  };

  const handleLogMaintenanceForSystem = (systemId: string) => {
    // TODO: Open log maintenance modal with system pre-selected
    console.log('Log maintenance for system:', systemId);
    setIsMaintenanceModalOpen(true);
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
    category: system.category,
  })) || [];

  const overdueCount = dashboardData?.maintenanceSummary.overdue || 0;
  const dueSoonCount = dashboardData?.maintenanceSummary.dueSoon || 0;

  // Generate critical alerts
  const criticalAlerts: Alert[] = [];

  // Add overdue tasks alert
  if (overdueCount > 0) {
    criticalAlerts.push({
      id: 'overdue-tasks',
      type: 'overdue',
      title: `${overdueCount} ${overdueCount === 1 ? 'Task' : 'Tasks'} Overdue`,
      message: `You have ${overdueCount} overdue maintenance ${overdueCount === 1 ? 'task' : 'tasks'} that need immediate attention to keep your home safe and efficient.`,
      priority: 'critical',
      actionLabel: 'View Tasks',
      onAction: () => {
        // Scroll to maintenance widget or filter to overdue
        document.getElementById('maintenance-widget')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Add critical system alerts
  const criticalSystems = systems.filter(s => s.status === 'critical');
  if (criticalSystems.length > 0) {
    criticalAlerts.push({
      id: 'critical-systems',
      type: 'system',
      title: `${criticalSystems.length} ${criticalSystems.length === 1 ? 'System' : 'Systems'} Need Immediate Attention`,
      message: `${criticalSystems.map(s => s.name).join(', ')} ${criticalSystems.length === 1 ? 'is' : 'are'} in critical condition. Schedule maintenance as soon as possible.`,
      priority: 'critical',
      actionLabel: 'View Systems',
      onAction: () => {
        document.getElementById('systems-widget')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Calculate stats for Quick Stats Cards
  const healthySystemsCount = systems.filter(s => s.status === 'healthy').length;
  const nextTask = tasks.length > 0 ? tasks[0] : null;
  const daysUntilNext = nextTask ? Math.ceil((nextTask.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const activeAlerts = criticalAlerts.filter(alert => !dismissedAlerts.includes(alert.id));

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-soft-amber/20 bg-warm-white/95 backdrop-blur-md shadow-sm"
          : "border-soft-amber/10 bg-warm-white/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />

              {/* Main Navigation Menu */}
              <nav className="hidden md:flex items-center gap-1 ml-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Homepage
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm text-charcoal font-semibold transition-colors rounded-lg bg-cream"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/wiki')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Knowledge Base
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Contact Us
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-soft-amber/20 rounded-xl shadow-lg py-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('/wiki');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Knowledge Base
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-soft-amber/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
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
        {/* Subtle warm background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-white via-cream to-warm-white opacity-60" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)`
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-warm-orange animate-spin mx-auto mb-4" />
                <p className="text-warm-gray text-lg">Loading your dashboard...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border-2 border-warm-orange/30 rounded-2xl p-8 text-center shadow-lg">
                <AlertTriangle className="w-12 h-12 text-warm-orange mx-auto mb-4" />
                <h3 className="text-xl font-bold text-charcoal mb-2">Unable to Load Dashboard</h3>
                <p className="text-warm-gray mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Onboarding Needed State */}
          {!isLoading && !error && dashboardData?.needsOnboarding && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-white to-cream border-2 border-warm-orange/30 rounded-2xl p-10 shadow-xl">
                <div className="text-center mb-8">
                  <Home className="w-16 h-16 text-warm-orange mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-charcoal mb-3">Welcome to FurnaceLog!</h3>
                  <p className="text-warm-gray text-lg">
                    Let's get started by adding your home information
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 mb-6 border border-soft-amber/20">
                  <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-warm-orange" />
                    What we'll set up:
                  </h4>
                  <ul className="space-y-2 text-warm-gray">
                    <li className="flex items-start gap-2">
                      <span className="text-warm-orange mt-1">•</span>
                      <span>Your home location and details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warm-orange mt-1">•</span>
                      <span>Heating systems (furnace, boiler, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warm-orange mt-1">•</span>
                      <span>Water and sewage systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warm-orange mt-1">•</span>
                      <span>Maintenance schedules and reminders</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="px-8 py-4 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white text-base font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Start Onboarding
                  </button>
                  <button
                    onClick={() => navigate('/wiki')}
                    className="px-8 py-4 bg-white hover:bg-cream text-charcoal text-base font-semibold rounded-xl transition-all duration-300 border-2 border-soft-amber/30 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Learn More First
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!isLoading && !error && dashboardData && !dashboardData.needsOnboarding && (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-warm-gray text-sm font-medium mb-2">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
                  Welcome Home
                </h2>
                <p className="text-warm-gray mt-2">
                  {dashboardData.home?.name || 'Your home'} is being monitored. Here's your maintenance overview.
                </p>
              </div>
              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Log Maintenance
              </button>
            </div>

            {/* Critical Alerts Banner */}
            {activeAlerts.length > 0 && (
              <CriticalAlertsBanner
                alerts={activeAlerts}
                onDismiss={handleDismissAlert}
              />
            )}

            {/* Overall Health & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Score Gauge */}
              <div className="bg-white border border-soft-amber/20 rounded-2xl p-8 shadow-md transition-all duration-300 flex items-center justify-center">
                <HealthScoreGauge
                  score={dashboardData.systemsStatus.overallHealth}
                  size="lg"
                  showLabel={true}
                />
              </div>

              {/* Quick Stats Cards */}
              <div className="lg:col-span-2">
                <QuickStatsCards
                  overdueCount={overdueCount}
                  healthySystems={{
                    current: healthySystemsCount,
                    total: systems.length
                  }}
                  nextMaintenance={nextTask ? {
                    daysUntil: Math.max(0, daysUntilNext),
                    taskName: nextTask.title
                  } : undefined}
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* Maintenance Widget - Spans 2 columns on XL */}
              <div id="maintenance-widget" className="xl:col-span-2">
                <EnhancedMaintenanceWidget
                  tasks={tasks}
                  overdueCount={overdueCount}
                  dueSoonCount={dueSoonCount}
                  onTaskClick={handleTaskClick}
                  onMarkComplete={handleMarkComplete}
                  onHireContractor={handleHireContractor}
                  onReschedule={handleReschedule}
                />
              </div>

              {/* System Status Widget */}
              <div id="systems-widget">
                <EnhancedSystemStatusWidget
                  systems={systems}
                  onSystemClick={handleSystemClick}
                  onAddSystem={() => navigate('/onboarding')}
                  onLogMaintenance={handleLogMaintenanceForSystem}
                />
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
