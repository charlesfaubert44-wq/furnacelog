/**
 * Timeline Service
 *
 * API client for Climate Time Machine feature
 */

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1`;

export interface TimelineDataPoint {
  date: Date;
  weather: WeatherData | null;
  maintenance: MaintenanceEvent[];
  summary: {
    maintenanceCount: number;
    totalCost: number;
    temperature: {
      high: number;
      low: number;
      mean: number;
    } | null;
  };
}

export interface WeatherData {
  _id: string;
  location: {
    community: string;
    territory: string;
  };
  date: Date;
  temperature: {
    high: number;
    low: number;
    mean: number;
  };
  precipitation: {
    amount: number;
    type: string;
    snowfall: number;
  };
  wind: {
    speed: number;
    direction: string;
    chill?: number;
  };
  conditions: string;
  extremeEvents: ExtremeEvent[];
}

export interface ExtremeEvent {
  type: string;
  severity: string;
  description: string;
}

export interface MaintenanceEvent {
  _id: string;
  homeId: string;
  systemId?: {
    _id: string;
    name: string;
    type: string;
  };
  componentId?: {
    _id: string;
    name: string;
    type: string;
  };
  taskPerformed: {
    customDescription?: string;
    taskId?: {
      _id: string;
      name: string;
      category: string;
    };
  };
  execution: {
    date: Date;
    performedBy: string;
    providerName?: string;
    duration?: number;
  };
  costs: {
    parts: any[];
    labor: number;
    other: any[];
    total: number;
  };
  details: {
    notes?: string;
    issuesDiscovered?: string[];
    followUpRequired?: boolean;
  };
}

export interface TimelineResponse {
  success: boolean;
  data: {
    homeId: string;
    home: {
      name: string;
      community: string;
      territory: string;
    };
    dateRange: {
      start: Date;
      end: Date;
    };
    granularity: string;
    timeline: TimelineDataPoint[];
    summary: {
      totalMaintenance: number;
      totalCost: number;
      totalWeatherDays: number;
    };
  };
}

export interface PatternInsight {
  patterns: {
    recurring: RecurringPattern[];
    seasonal: any[];
    costTrends: any[];
  };
  confidence: string;
}

export interface RecurringPattern {
  system: string;
  interval: number;
  occurrences: number;
  consistency: number;
  description: string;
}

export interface WeatherCorrelation {
  coldSnapMaintenance: any[];
  temperatureTriggered: any[];
  seasonalPatterns: Record<string, any>;
}

class TimelineService {
  /**
   * Get timeline data for a home
   */
  async getTimelineData(
    homeId: string,
    startDate?: Date,
    endDate?: Date,
    granularity: 'day' | 'week' | 'month' = 'day'
  ): Promise<TimelineResponse> {
    const params: any = { granularity };

    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    if (endDate) {
      params.endDate = endDate.toISOString();
    }

    const response = await axios.get(`${API_URL}/timeline/${homeId}`, {
      params,
      withCredentials: true
    });

    return response.data;
  }

  /**
   * Get weather-maintenance correlations
   */
  async getWeatherCorrelations(
    homeId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<WeatherCorrelation> {
    const params: any = {};

    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    if (endDate) {
      params.endDate = endDate.toISOString();
    }

    const response = await axios.get(`${API_URL}/timeline/${homeId}/correlations`, {
      params,
      withCredentials: true
    });

    return response.data.data;
  }

  /**
   * Get pattern insights
   */
  async getPatternInsights(homeId: string): Promise<PatternInsight> {
    const response = await axios.get(`${API_URL}/timeline/${homeId}/patterns`, {
      withCredentials: true
    });

    return response.data.data;
  }

  /**
   * Get cost analysis
   */
  async getCostAnalysis(homeId: string, groupBy: 'day' | 'month' | 'year' = 'month') {
    const response = await axios.get(`${API_URL}/timeline/${homeId}/costs`, {
      params: { groupBy },
      withCredentials: true
    });

    return response.data.data;
  }
}

export default new TimelineService();
