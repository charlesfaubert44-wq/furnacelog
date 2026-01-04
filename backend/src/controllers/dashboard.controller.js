/**
 * Dashboard Controller
 * Provides aggregated data for dashboard widgets
 */

import Home from '../models/Home.js';
import System from '../models/System.js';
import ScheduledMaintenance from '../models/ScheduledMaintenance.js';
import MaintenanceLog from '../models/MaintenanceLog.js';
import SeasonalChecklist from '../models/SeasonalChecklist.js';
import weatherService from '../services/weatherService.js';
import logger from '../utils/logger.js';

/**
 * Get dashboard data for user's primary home
 * GET /api/v1/dashboard
 */
export async function getDashboardData(req, res) {
  try {
    const userId = req.user._id;

    // Get user's primary (most recent) home
    const home = await Home.findOne({ userId, archived: false }).sort({ createdAt: -1 });

    if (!home) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_HOME_FOUND',
          message: 'No home found for user. Please complete onboarding first.'
        }
      });
    }

    // Fetch all dashboard data in parallel
    const [maintenanceSummary, systemsStatus, weatherData, seasonalChecklist] = await Promise.all([
      getMaintenanceSummary(home._id),
      getSystemsStatus(home._id),
      getWeatherData(home),
      getSeasonalChecklist(home._id)
    ]);

    res.json({
      success: true,
      data: {
        home: {
          id: home._id,
          name: home.name,
          community: home.address.community,
          territory: home.address.territory
        },
        maintenanceSummary,
        systemsStatus,
        weather: weatherData,
        seasonalChecklist
      }
    });
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch dashboard data',
        details: process.env.NODE_ENV === 'development' ? [error.message] : []
      }
    });
  }
}

/**
 * Get maintenance summary for dashboard widget
 */
async function getMaintenanceSummary(homeId) {
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Get task counts
  const [overdue, dueSoon, upcoming, total] = await Promise.all([
    ScheduledMaintenance.countDocuments({
      homeId,
      status: { $in: ['scheduled', 'due'] },
      'scheduling.dueDate': { $lt: now }
    }),
    ScheduledMaintenance.countDocuments({
      homeId,
      status: { $in: ['scheduled', 'due'] },
      'scheduling.dueDate': {
        $gte: now,
        $lte: oneWeekFromNow
      }
    }),
    ScheduledMaintenance.countDocuments({
      homeId,
      status: { $in: ['scheduled', 'due'] },
      'scheduling.dueDate': {
        $gt: oneWeekFromNow,
        $lte: thirtyDaysFromNow
      }
    }),
    ScheduledMaintenance.countDocuments({
      homeId,
      status: { $in: ['scheduled', 'due'] }
    })
  ]);

  // Get upcoming tasks (next 10)
  const upcomingTasks = await ScheduledMaintenance.find({
    homeId,
    status: { $in: ['scheduled', 'due'] },
    'scheduling.dueDate': { $gte: now }
  })
    .populate('systemId', 'name category')
    .sort({ 'scheduling.dueDate': 1 })
    .limit(10)
    .lean();

  return {
    overdue,
    dueSoon,
    upcoming,
    total,
    upcomingTasks: upcomingTasks.map(task => ({
      id: task._id,
      title: task.customTaskName || 'Maintenance Task',
      dueDate: task.scheduling.dueDate,
      priority: task.priority,
      system: task.systemId ? {
        id: task.systemId._id,
        name: task.systemId.name,
        category: task.systemId.category
      } : null,
      daysUntilDue: Math.ceil((task.scheduling.dueDate - now) / (1000 * 60 * 60 * 24))
    }))
  };
}

/**
 * Get systems status with health scores
 */
async function getSystemsStatus(homeId) {
  const systems = await System.find({ homeId, status: 'active' }).lean();
  const now = new Date();

  // Calculate health score for each system
  const systemsWithHealth = await Promise.all(
    systems.map(async (system) => {
      // Get overdue tasks for this system
      const overdueTasks = await ScheduledMaintenance.countDocuments({
        systemId: system._id,
        status: { $in: ['scheduled', 'due'] },
        'scheduling.dueDate': { $lt: now }
      });

      // Get last maintenance log
      const lastLog = await MaintenanceLog.findOne({
        systemId: system._id
      })
        .sort({ performedDate: -1 })
        .lean();

      // Calculate health score
      let healthScore = 100;

      // Deduct for overdue tasks
      healthScore -= overdueTasks * 15;

      // Deduct for old service
      if (lastLog) {
        const daysSinceService = Math.ceil((now - lastLog.performedDate) / (1000 * 60 * 60 * 24));
        if (daysSinceService > 365) {
          healthScore -= 20;
        } else if (daysSinceService > 180) {
          healthScore -= 10;
        }
      } else {
        healthScore -= 30; // Never serviced
      }

      // Ensure score is in valid range
      healthScore = Math.max(0, Math.min(100, healthScore));

      // Determine status color
      let statusColor = 'green';
      if (healthScore < 70) statusColor = 'red';
      else if (healthScore < 90) statusColor = 'yellow';

      return {
        id: system._id,
        name: system.name,
        category: system.category,
        type: system.type,
        healthScore,
        statusColor,
        lastServiceDate: lastLog ? lastLog.performedDate : null,
        overdueTasksCount: overdueTasks
      };
    })
  );

  // Calculate overall health
  const avgHealthScore = systemsWithHealth.length > 0
    ? Math.round(systemsWithHealth.reduce((sum, s) => sum + s.healthScore, 0) / systemsWithHealth.length)
    : 100;

  // Count by category
  const byCategory = systems.reduce((acc, system) => {
    acc[system.category] = (acc[system.category] || 0) + 1;
    return acc;
  }, {});

  return {
    systems: systemsWithHealth,
    total: systems.length,
    byCategory,
    overallHealth: avgHealthScore
  };
}

/**
 * Get weather data with system-specific recommendations
 */
async function getWeatherData(home) {
  try {
    const community = home.address.community;

    // Get home systems for recommendations
    const systems = await System.find({ homeId: home._id, status: 'active' }).lean();

    // Get weather with recommendations
    const weatherData = await weatherService.getWeatherWithRecommendations(community, systems);

    return {
      temperature: weatherData.weather.temperature.mean,
      conditions: weatherData.weather.conditions,
      windSpeed: weatherData.weather.wind.speed,
      windDirection: weatherData.weather.wind.direction,
      windChill: weatherData.weather.wind.chill,
      humidity: weatherData.weather.humidity || null,
      alerts: weatherData.alerts.map(alert => ({
        type: alert.type,
        severity: alert.severity,
        description: alert.description
      })),
      recommendations: weatherData.recommendations,
      lastUpdated: weatherData.weather.date
    };
  } catch (error) {
    logger.error(`Error fetching weather for ${home.address.community}:`, error);
    // Return null weather if fetch fails
    return null;
  }
}

/**
 * Get current seasonal checklist
 */
async function getSeasonalChecklist(homeId) {
  const currentSeason = getCurrentSeason();
  const currentYear = new Date().getFullYear();

  const checklist = await SeasonalChecklist.findOne({
    homeId,
    season: currentSeason,
    year: currentYear
  }).lean();

  if (!checklist) {
    return {
      season: currentSeason,
      year: currentYear,
      items: [],
      totalItems: 0,
      completedItems: 0,
      progressPercent: 0
    };
  }

  // Calculate progress
  const totalItems = checklist.items ? checklist.items.length : 0;
  const completedItems = checklist.items ? checklist.items.filter(i => i.completed).length : 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    id: checklist._id,
    season: checklist.season,
    year: checklist.year,
    items: checklist.items || [],
    totalItems,
    completedItems,
    progressPercent
  };
}

/**
 * Helper: Get current season
 */
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Get maintenance tasks for home
 * GET /api/v1/dashboard/tasks
 */
export async function getMaintenanceTasks(req, res) {
  try {
    const userId = req.user._id;
    const { status, limit = 50, offset = 0 } = req.query;

    // Get user's home
    const home = await Home.findOne({ userId, archived: false }).sort({ createdAt: -1 });

    if (!home) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_HOME_FOUND',
          message: 'No home found'
        }
      });
    }

    // Build query
    const query = { homeId: home._id };
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['scheduled', 'due'] };
    }

    // Get tasks
    const tasks = await ScheduledMaintenance.find(query)
      .populate('systemId', 'name category')
      .sort({ 'scheduling.dueDate': 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    const total = await ScheduledMaintenance.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks: tasks.map(task => ({
          id: task._id,
          title: task.customTaskName || 'Maintenance Task',
          dueDate: task.scheduling.dueDate,
          priority: task.priority,
          status: task.status,
          system: task.systemId ? {
            id: task.systemId._id,
            name: task.systemId.name,
            category: task.systemId.category
          } : null
        })),
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Error fetching maintenance tasks:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch tasks'
      }
    });
  }
}

export default {
  getDashboardData,
  getMaintenanceTasks
};
