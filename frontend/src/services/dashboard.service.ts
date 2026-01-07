/**
 * Dashboard Service
 * Handles dashboard data fetching
 */

import api from './api';

export interface MaintenanceTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  system: {
    id: string;
    name: string;
    category: string;
  } | null;
  daysUntilDue: number;
}

export interface SystemStatus {
  id: string;
  name: string;
  category: string;
  type: string;
  healthScore: number;
  statusColor: 'green' | 'yellow' | 'red';
  lastServiceDate: string | null;
  overdueTasksCount: number;
}

export interface WeatherData {
  current: {
    temperature: number;
    conditions: string;
    windSpeed: number;
    windChill?: number;
    humidity?: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    conditions: string;
  }>;
  alerts: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  recommendations: Array<{
    system: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface SeasonalChecklist {
  id?: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  year: number;
  items: Array<{
    id: string;
    system?: string;
    task: string;
    completed: boolean;
    priority: 'critical' | 'high' | 'normal' | 'low';
    difficulty: 'diy-easy' | 'diy-moderate' | 'professional';
    estimatedTime?: string;
    estimatedCost?: { diy?: string; professional?: string };
    tutorialUrl?: string;
  }>;
  totalItems: number;
  completedItems: number;
  progressPercent: number;
  streak?: number;
  badge?: string;
}

export interface CostData {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  byCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  byType: {
    diy: number;
    professional: number;
  };
  monthlyData: Array<{
    month: string;
    amount: number;
  }>;
}

export interface ContractorData {
  id: string;
  businessName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  specialties: string[];
  timesHired: number;
  averageCost: number;
  rating: number;
  lastUsed: Date | string;
  wouldHireAgain?: boolean;
}

export interface DashboardData {
  home: {
    id: string;
    name: string;
    community: string;
    territory: string;
  } | null;
  maintenanceSummary: {
    overdue: number;
    dueSoon: number;
    upcoming: number;
    total: number;
    upcomingTasks: MaintenanceTask[];
  };
  systemsStatus: {
    systems: SystemStatus[];
    total: number;
    byCategory: Record<string, number>;
    overallHealth: number;
  };
  weather: WeatherData | null;
  seasonalChecklist: SeasonalChecklist;
  costData?: CostData;
  recentContractors?: ContractorData[];
  needsOnboarding?: boolean;
}

/**
 * Get complete dashboard data
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const response = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    // Extract error message from backend error response structure
    const errorData = error.response?.data;
    if (errorData?.error?.message) {
      throw new Error(errorData.error.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to load dashboard data');
  }
}

/**
 * Get maintenance tasks with filtering
 */
export async function getMaintenanceTasks(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ tasks: MaintenanceTask[]; total: number }> {
  try {
    const response = await api.get<{
      success: boolean;
      data: { tasks: MaintenanceTask[]; total: number };
    }>('/dashboard/tasks', { params });
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching maintenance tasks:', error);
    // Extract error message from backend error response structure
    const errorData = error.response?.data;
    if (errorData?.error?.message) {
      throw new Error(errorData.error.message);
    }
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to load maintenance tasks');
  }
}

export default {
  getDashboardData,
  getMaintenanceTasks
};
