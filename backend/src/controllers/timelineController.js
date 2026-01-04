/**
 * Timeline Controller
 *
 * Handles Climate Time Machine data aggregation and delivery
 */

import MaintenanceLog from '../models/MaintenanceLog.js';
import WeatherData from '../models/WeatherData.js';
import Home from '../models/Home.js';
import weatherService from '../services/weatherService.js';
import logger from '../utils/logger.js';

/**
 * Get timeline data for a home
 * Combines maintenance logs, weather data, and patterns
 */
export const getTimelineData = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { startDate, endDate, granularity = 'day' } = req.query;

    // Validate home ownership
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    if (home.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to home data'
      });
    }

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Fetch maintenance logs
    const maintenanceLogs = await MaintenanceLog.find({
      homeId,
      'execution.date': { $gte: start, $lte: end }
    })
    .populate('systemId', 'name type')
    .populate('componentId', 'name type')
    .populate('taskPerformed.taskId', 'name category')
    .sort({ 'execution.date': 1 });

    // Fetch weather data
    const community = home.address.community;
    let weatherData = [];

    try {
      weatherData = await weatherService.fetchHistoricalWeather(community, start, end);
    } catch (error) {
      logger.warn(`Could not fetch weather data for ${community}: ${error.message}`);
    }

    // Aggregate data based on granularity
    const timelineData = await aggregateTimelineData(
      maintenanceLogs,
      weatherData,
      granularity,
      start,
      end
    );

    res.json({
      success: true,
      data: {
        homeId,
        home: {
          name: home.name,
          community: home.address.community,
          territory: home.address.territory
        },
        dateRange: {
          start,
          end
        },
        granularity,
        timeline: timelineData,
        summary: {
          totalMaintenance: maintenanceLogs.length,
          totalCost: maintenanceLogs.reduce((sum, log) => sum + (log.costs.total || 0), 0),
          totalWeatherDays: weatherData.length
        }
      }
    });

  } catch (error) {
    logger.error(`Error fetching timeline data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeline data'
    });
  }
};

/**
 * Get weather-maintenance correlations
 */
export const getWeatherCorrelations = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { startDate, endDate } = req.query;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    if (home.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get maintenance logs
    const maintenanceLogs = await MaintenanceLog.find({
      homeId,
      'execution.date': { $gte: start, $lte: end }
    })
    .populate('systemId', 'name type')
    .sort({ 'execution.date': 1 });

    // Get weather data
    const weatherData = await weatherService.fetchHistoricalWeather(
      home.address.community,
      start,
      end
    );

    // Analyze correlations
    const correlations = analyzeWeatherMaintenanceCorrelations(maintenanceLogs, weatherData);

    res.json({
      success: true,
      data: correlations
    });

  } catch (error) {
    logger.error(`Error analyzing correlations: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze correlations'
    });
  }
};

/**
 * Get pattern insights for timeline
 */
export const getPatternInsights = async (req, res) => {
  try {
    const { homeId } = req.params;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    if (home.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Get all maintenance logs for pattern analysis
    const maintenanceLogs = await MaintenanceLog.find({ homeId })
      .populate('systemId', 'name type')
      .sort({ 'execution.date': 1 });

    // Detect patterns
    const patterns = detectMaintenancePatterns(maintenanceLogs);

    res.json({
      success: true,
      data: {
        patterns,
        confidence: calculatePatternConfidence(patterns, maintenanceLogs.length)
      }
    });

  } catch (error) {
    logger.error(`Error detecting patterns: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to detect patterns'
    });
  }
};

/**
 * Get cost analysis for timeline
 */
export const getCostAnalysis = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { groupBy = 'month' } = req.query;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({
        success: false,
        error: 'Home not found'
      });
    }

    if (home.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Aggregate costs
    const costData = await MaintenanceLog.aggregate([
      { $match: { homeId: home._id } },
      {
        $group: {
          _id: {
            year: { $year: '$execution.date' },
            month: { $month: '$execution.date' },
            system: '$systemId'
          },
          totalCost: { $sum: '$costs.total' },
          count: { $sum: 1 },
          averageCost: { $avg: '$costs.total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: costData
    });

  } catch (error) {
    logger.error(`Error analyzing costs: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze costs'
    });
  }
};

/**
 * Aggregate timeline data based on granularity
 */
async function aggregateTimelineData(maintenanceLogs, weatherData, granularity, start, end) {
  const timeline = [];
  const weatherMap = new Map();

  // Map weather data by date
  weatherData.forEach(w => {
    const dateKey = w.date.toISOString().split('T')[0];
    weatherMap.set(dateKey, w);
  });

  // Group maintenance by date
  const maintenanceByDate = new Map();
  maintenanceLogs.forEach(log => {
    const dateKey = log.execution.date.toISOString().split('T')[0];
    if (!maintenanceByDate.has(dateKey)) {
      maintenanceByDate.set(dateKey, []);
    }
    maintenanceByDate.get(dateKey).push(log);
  });

  // Create timeline entries
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const dateKey = currentDate.toISOString().split('T')[0];

    timeline.push({
      date: new Date(currentDate),
      weather: weatherMap.get(dateKey) || null,
      maintenance: maintenanceByDate.get(dateKey) || [],
      summary: {
        maintenanceCount: maintenanceByDate.get(dateKey)?.length || 0,
        totalCost: maintenanceByDate.get(dateKey)?.reduce((sum, log) => sum + log.costs.total, 0) || 0,
        temperature: weatherMap.get(dateKey)?.temperature || null
      }
    });

    // Increment date based on granularity
    if (granularity === 'day') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (granularity === 'week') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (granularity === 'month') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return timeline;
}

/**
 * Analyze weather-maintenance correlations
 */
function analyzeWeatherMaintenanceCorrelations(maintenanceLogs, weatherData) {
  const correlations = {
    coldSnapMaintenance: [],
    temperatureTriggered: [],
    seasonalPatterns: {}
  };

  // Create weather lookup
  const weatherMap = new Map();
  weatherData.forEach(w => {
    weatherMap.set(w.date.toISOString().split('T')[0], w);
  });

  // Analyze each maintenance event
  maintenanceLogs.forEach(log => {
    const logDate = log.execution.date.toISOString().split('T')[0];
    const weather = weatherMap.get(logDate);

    if (weather) {
      // Check for cold snap correlation (within 14 days)
      const coldSnaps = findRecentColdSnaps(weather.date, weatherData, 14);
      if (coldSnaps.length > 0) {
        correlations.coldSnapMaintenance.push({
          maintenance: {
            date: log.execution.date,
            system: log.systemId?.name,
            cost: log.costs.total
          },
          coldSnap: coldSnaps[0],
          daysAfter: Math.floor((log.execution.date - coldSnaps[0].date) / (1000 * 60 * 60 * 24))
        });
      }

      // Temperature-triggered maintenance
      if (weather.temperature.low <= -30) {
        correlations.temperatureTriggered.push({
          date: log.execution.date,
          temperature: weather.temperature.low,
          system: log.systemId?.name,
          type: log.systemId?.type
        });
      }
    }

    // Seasonal patterns
    const month = log.execution.date.getMonth();
    const season = getSeason(month);
    if (!correlations.seasonalPatterns[season]) {
      correlations.seasonalPatterns[season] = { count: 0, totalCost: 0, systems: {} };
    }
    correlations.seasonalPatterns[season].count++;
    correlations.seasonalPatterns[season].totalCost += log.costs.total;

    const systemType = log.systemId?.type || 'other';
    correlations.seasonalPatterns[season].systems[systemType] =
      (correlations.seasonalPatterns[season].systems[systemType] || 0) + 1;
  });

  return correlations;
}

/**
 * Find recent cold snaps before a date
 */
function findRecentColdSnaps(date, weatherData, daysBack) {
  const cutoff = new Date(date);
  cutoff.setDate(cutoff.getDate() - daysBack);

  return weatherData
    .filter(w => w.date >= cutoff && w.date < date && w.temperature.low <= -30)
    .sort((a, b) => b.date - a.date);
}

/**
 * Get season for month
 */
function getSeason(month) {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Detect maintenance patterns
 */
function detectMaintenancePatterns(maintenanceLogs) {
  const patterns = {
    recurring: [],
    seasonal: [],
    costTrends: []
  };

  // Group by system and task
  const systemTasks = new Map();
  maintenanceLogs.forEach(log => {
    const key = `${log.systemId?._id || 'unknown'}`;
    if (!systemTasks.has(key)) {
      systemTasks.set(key, []);
    }
    systemTasks.get(key).push(log);
  });

  // Detect recurring intervals
  systemTasks.forEach((logs, systemKey) => {
    if (logs.length < 2) return;

    const intervals = [];
    for (let i = 1; i < logs.length; i++) {
      const daysBetween = Math.floor(
        (logs[i].execution.date - logs[i-1].execution.date) / (1000 * 60 * 60 * 24)
      );
      intervals.push(daysBetween);
    }

    // Calculate average interval
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // If consistent interval (low variance), it's a pattern
    if (stdDev < avgInterval * 0.3 && logs.length >= 3) {
      patterns.recurring.push({
        system: logs[0].systemId?.name,
        interval: Math.round(avgInterval),
        occurrences: logs.length,
        consistency: Math.round((1 - stdDev / avgInterval) * 100),
        description: `${logs[0].systemId?.name} maintained every ${Math.round(avgInterval)} days`
      });
    }
  });

  return patterns;
}

/**
 * Calculate pattern confidence
 */
function calculatePatternConfidence(patterns, totalLogs) {
  if (totalLogs < 5) return 'low';
  if (patterns.recurring.length > 0 && totalLogs > 20) return 'high';
  if (totalLogs > 10) return 'medium';
  return 'low';
}

export default {
  getTimelineData,
  getWeatherCorrelations,
  getPatternInsights,
  getCostAnalysis
};
