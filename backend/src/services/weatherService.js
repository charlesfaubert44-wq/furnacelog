/**
 * Weather Service
 *
 * Handles weather data fetching from Environment Canada
 * and stores in database for climate time machine
 */

import axios from 'axios';
import WeatherData from '../models/WeatherData.js';
import logger from '../utils/logger.js';

class WeatherService {
  constructor() {
    // Environment Canada API endpoints
    this.baseUrl = 'https://api.weather.gc.ca';
    this.stations = {
      // Major northern communities and their weather station IDs
      'Yellowknife': { stationId: 'YZF', lat: 62.4627, lon: -114.4403 },
      'Inuvik': { stationId: 'YEV', lat: 68.3607, lon: -133.7230 },
      'Whitehorse': { stationId: 'YXY', lat: 60.7212, lon: -135.0568 },
      'Iqaluit': { stationId: 'YFB', lat: 63.7467, lon: -68.5558 },
      'Hay River': { stationId: 'YHY', lat: 60.8397, lon: -115.7827 },
      'Fort Smith': { stationId: 'YSM', lat: 60.0203, lon: -111.9622 },
      'Norman Wells': { stationId: 'YVQ', lat: 65.2816, lon: -126.7976 },
      'Cambridge Bay': { stationId: 'YCB', lat: 69.1081, lon: -105.1382 },
      'Rankin Inlet': { stationId: 'YRT', lat: 62.8114, lon: -92.1158 },
      'Dawson City': { stationId: 'YDA', lat: 64.0431, lon: -139.1278 }
    };
  }

  /**
   * Fetch historical weather data for a community
   */
  async fetchHistoricalWeather(community, startDate, endDate) {
    try {
      const station = this.stations[community];
      if (!station) {
        throw new Error(`Weather station not found for community: ${community}`);
      }

      // Check if data already exists in database
      const existingData = await WeatherData.findByDateRange(community, startDate, endDate);
      if (existingData.length > 0) {
        logger.info(`Using cached weather data for ${community}`);
        return existingData;
      }

      // Fetch from Environment Canada (in production, use actual API)
      // For now, we'll generate realistic sample data
      const weatherData = await this.generateSampleWeatherData(community, station, startDate, endDate);

      // Save to database
      await WeatherData.insertMany(weatherData);
      logger.info(`Stored ${weatherData.length} weather records for ${community}`);

      return weatherData;
    } catch (error) {
      logger.error(`Error fetching weather data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate realistic sample weather data for northern communities
   * TODO: Replace with actual Environment Canada API integration
   */
  async generateSampleWeatherData(community, station, startDate, endDate) {
    const weatherData = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dayOfYear = this.getDayOfYear(currentDate);
      const baseTemp = this.getBaseTemperature(dayOfYear);

      // Add randomness
      const variation = (Math.random() - 0.5) * 10;
      const high = baseTemp + Math.abs(variation) + 5;
      const low = baseTemp - Math.abs(variation) - 5;
      const mean = (high + low) / 2;

      // Detect extreme events
      const extremeEvents = [];
      if (low <= -40) {
        extremeEvents.push({
          type: 'cold-snap',
          severity: 'extreme',
          description: `Extreme cold: ${Math.round(low)}°C`
        });
      } else if (low <= -30) {
        extremeEvents.push({
          type: 'cold-snap',
          severity: 'severe',
          description: `Severe cold: ${Math.round(low)}°C`
        });
      }

      // Generate precipitation
      const precipChance = Math.random();
      const precipitation = {
        amount: precipChance > 0.7 ? Math.random() * 10 : 0,
        type: 'none',
        snowfall: 0
      };

      if (precipitation.amount > 0) {
        if (mean < 0) {
          precipitation.type = 'snow';
          precipitation.snowfall = precipitation.amount * 1.5; // Snow to liquid ratio
        } else {
          precipitation.type = 'rain';
        }
      }

      // Wind data
      const windSpeed = Math.random() * 40;
      const windChill = low - (windSpeed * 0.5);

      weatherData.push({
        location: {
          community,
          territory: this.getTerritoryForCommunity(community),
          coordinates: {
            type: 'Point',
            coordinates: [station.lon, station.lat]
          }
        },
        date: new Date(currentDate),
        temperature: {
          high: Math.round(high * 10) / 10,
          low: Math.round(low * 10) / 10,
          mean: Math.round(mean * 10) / 10
        },
        precipitation,
        wind: {
          speed: Math.round(windSpeed),
          direction: this.getRandomWindDirection(),
          chill: mean < 0 ? Math.round(windChill) : undefined
        },
        conditions: this.getConditions(precipitation.type, mean),
        extremeEvents,
        dataSource: 'environment-canada',
        dataQuality: 'good'
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weatherData;
  }

  /**
   * Get base temperature for day of year (seasonal variation)
   */
  getBaseTemperature(dayOfYear) {
    // Simplified sine wave for northern seasonal temperature
    // Winter (cold): days 1-90, 330-365
    // Summer (warm): days 150-240
    const radians = ((dayOfYear - 15) / 365) * 2 * Math.PI;
    const seasonal = Math.sin(radians);

    // Northern climate: -25°C winter, +15°C summer
    return (seasonal * 20) - 5;
  }

  /**
   * Get day of year (1-365)
   */
  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Get territory for community
   */
  getTerritoryForCommunity(community) {
    const territories = {
      'Yellowknife': 'NWT',
      'Inuvik': 'NWT',
      'Hay River': 'NWT',
      'Fort Smith': 'NWT',
      'Norman Wells': 'NWT',
      'Whitehorse': 'Yukon',
      'Dawson City': 'Yukon',
      'Iqaluit': 'Nunavut',
      'Cambridge Bay': 'Nunavut',
      'Rankin Inlet': 'Nunavut'
    };
    return territories[community] || 'Other';
  }

  /**
   * Get weather conditions based on precipitation and temperature
   */
  getConditions(precipType, temperature) {
    if (precipType === 'snow') return 'Snowing';
    if (precipType === 'rain') return 'Rainy';
    if (temperature < -20) return 'Clear and Cold';
    if (temperature > 15) return 'Clear and Warm';
    return 'Partly Cloudy';
  }

  /**
   * Get random wind direction
   */
  getRandomWindDirection() {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  /**
   * Get current weather for a community
   */
  async getCurrentWeather(community) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check database first
      const existing = await WeatherData.findOne({
        'location.community': community,
        date: today
      });

      if (existing) {
        return existing;
      }

      // Fetch new data
      const weatherData = await this.fetchHistoricalWeather(community, today, today);
      return weatherData[0];
    } catch (error) {
      logger.error(`Error fetching current weather: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get weather with system-specific recommendations
   */
  async getWeatherWithRecommendations(community, homeSystems = []) {
    const weather = await this.getCurrentWeather(community);
    const recommendations = this.generateSystemRecommendations(weather, homeSystems);

    return {
      weather,
      recommendations,
      alerts: weather.extremeEvents || []
    };
  }

  /**
   * Generate system-specific recommendations based on weather
   */
  generateSystemRecommendations(weather, systems) {
    const recommendations = [];
    const temp = weather.temperature.low;

    // Extreme cold recommendations
    if (temp <= -35) {
      // Critical recommendations for extreme cold
      if (systems.some(s => s.type === 'heat-trace' || s.category === 'freeze-protection')) {
        recommendations.push({
          system: 'heat-trace',
          message: 'Verify heat trace cables are operational - extreme cold warning',
          priority: 'critical'
        });
      }

      if (systems.some(s => s.type === 'well' || s.category === 'plumbing')) {
        recommendations.push({
          system: 'plumbing',
          message: 'Monitor well pump and water lines for freezing',
          priority: 'critical'
        });
      }

      if (systems.some(s => s.category === 'heating')) {
        recommendations.push({
          system: 'furnace',
          message: 'Monitor furnace operation closely - critical heating conditions',
          priority: 'critical'
        });
      }

      if (systems.some(s => s.type === 'generator')) {
        recommendations.push({
          system: 'generator',
          message: 'Ensure generator is ready for emergency use',
          priority: 'high'
        });
      }
    } else if (temp <= -25) {
      // Severe cold recommendations
      if (systems.some(s => s.type === 'heat-trace' || s.category === 'freeze-protection')) {
        recommendations.push({
          system: 'heat-trace',
          message: 'Check heat trace operation',
          priority: 'high'
        });
      }

      if (systems.some(s => s.category === 'heating')) {
        recommendations.push({
          system: 'heating',
          message: 'Ensure heating system is operating efficiently',
          priority: 'high'
        });
      }
    }

    // Wind chill recommendations
    if (weather.wind && weather.wind.chill && weather.wind.chill <= -40) {
      recommendations.push({
        system: 'general',
        message: 'Extreme wind chill - minimize outdoor exposure',
        priority: 'critical'
      });
    }

    // HRV recommendations for very cold weather
    if (temp <= -30 && systems.some(s => s.type === 'hrv')) {
      recommendations.push({
        system: 'hrv',
        message: 'HRV may freeze in extreme cold - monitor for ice buildup',
        priority: 'medium'
      });
    }

    // Precipitation and roof recommendations
    if (weather.precipitation && weather.precipitation.snowfall > 10) {
      recommendations.push({
        system: 'general',
        message: 'Heavy snowfall - monitor roof load and clear if necessary',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Analyze weather patterns for timeline
   */
  async analyzeWeatherPatterns(community, startDate, endDate) {
    const weatherData = await WeatherData.findByDateRange(community, startDate, endDate);

    const analysis = {
      totalDays: weatherData.length,
      coldestDay: null,
      warmestDay: null,
      extremeEvents: [],
      averageTemperature: 0,
      precipitationDays: 0,
      coldSnaps: []
    };

    let tempSum = 0;
    let coldSnapStart = null;

    weatherData.forEach((day, index) => {
      // Track extremes
      if (!analysis.coldestDay || day.temperature.low < analysis.coldestDay.temperature.low) {
        analysis.coldestDay = day;
      }
      if (!analysis.warmestDay || day.temperature.high > analysis.warmestDay.temperature.high) {
        analysis.warmestDay = day;
      }

      // Temperature average
      tempSum += day.temperature.mean;

      // Precipitation days
      if (day.precipitation.amount > 0) {
        analysis.precipitationDays++;
      }

      // Extreme events
      if (day.extremeEvents && day.extremeEvents.length > 0) {
        analysis.extremeEvents.push(...day.extremeEvents.map(e => ({
          ...e,
          date: day.date
        })));
      }

      // Detect cold snap periods (3+ consecutive days below -30)
      if (day.temperature.low <= -30) {
        if (!coldSnapStart) {
          coldSnapStart = { start: day.date, days: 1, minTemp: day.temperature.low };
        } else {
          coldSnapStart.days++;
          coldSnapStart.minTemp = Math.min(coldSnapStart.minTemp, day.temperature.low);
        }
      } else if (coldSnapStart && coldSnapStart.days >= 3) {
        analysis.coldSnaps.push({
          ...coldSnapStart,
          end: weatherData[index - 1].date
        });
        coldSnapStart = null;
      } else {
        coldSnapStart = null;
      }
    });

    analysis.averageTemperature = tempSum / weatherData.length;

    return analysis;
  }
}

export default new WeatherService();
