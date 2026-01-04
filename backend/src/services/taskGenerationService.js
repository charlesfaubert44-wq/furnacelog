/**
 * Task Generation Service
 * Auto-generates maintenance tasks based on home systems from onboarding
 */

import ScheduledMaintenance from '../models/ScheduledMaintenance.js';
import logger from '../utils/logger.js';

/**
 * Task generation rules for different system types
 * Each rule defines the maintenance schedule for a specific system
 */
const TASK_GENERATION_RULES = {
  // Heating Systems
  'oil-furnace': [
    {
      name: 'Annual Furnace Inspection',
      intervalDays: 365,
      priority: 'high',
      description: 'Professional inspection and servicing of oil furnace'
    },
    {
      name: 'Replace Furnace Filter',
      intervalDays: 90,
      priority: 'medium',
      description: 'Replace HVAC filter to maintain air quality and system efficiency'
    }
  ],
  'propane-furnace': [
    {
      name: 'Annual Furnace Inspection',
      intervalDays: 365,
      priority: 'high',
      description: 'Professional inspection and servicing of propane furnace'
    },
    {
      name: 'Replace Furnace Filter',
      intervalDays: 90,
      priority: 'medium',
      description: 'Replace HVAC filter to maintain air quality and system efficiency'
    }
  ],
  'natural-gas': [
    {
      name: 'Annual Furnace Inspection',
      intervalDays: 365,
      priority: 'high',
      description: 'Professional inspection and servicing of natural gas furnace'
    },
    {
      name: 'Replace Furnace Filter',
      intervalDays: 90,
      priority: 'medium',
      description: 'Replace HVAC filter to maintain air quality and system efficiency'
    }
  ],
  'electric-furnace': [
    {
      name: 'Annual Furnace Inspection',
      intervalDays: 365,
      priority: 'medium',
      description: 'Professional inspection of electric furnace'
    },
    {
      name: 'Replace Furnace Filter',
      intervalDays: 90,
      priority: 'medium',
      description: 'Replace HVAC filter to maintain air quality'
    }
  ],
  'boiler': [
    {
      name: 'Annual Boiler Inspection',
      intervalDays: 365,
      priority: 'high',
      description: 'Professional inspection and servicing of boiler system'
    },
    {
      name: 'Check Boiler Pressure',
      intervalDays: 90,
      priority: 'medium',
      description: 'Verify boiler pressure is within normal range'
    }
  ],
  'wood-stove': [
    {
      name: 'Chimney Cleaning',
      intervalDays: 365,
      priority: 'critical',
      description: 'Professional chimney sweep and inspection (fire hazard prevention)',
      seasonalTiming: 'pre-freeze-up' // Before heating season
    },
    {
      name: 'Inspect Chimney Cap',
      intervalDays: 180,
      priority: 'medium',
      description: 'Check chimney cap for damage or blockages'
    }
  ],
  'pellet-stove': [
    {
      name: 'Comprehensive Pellet Stove Cleaning',
      intervalDays: 90,
      priority: 'high',
      description: 'Clean burn pot, heat exchanger, and flue'
    },
    {
      name: 'Chimney Inspection',
      intervalDays: 365,
      priority: 'high',
      description: 'Professional inspection of pellet stove chimney'
    }
  ],
  'heat-pump': [
    {
      name: 'Heat Pump Service',
      intervalDays: 365,
      priority: 'high',
      description: 'Professional heat pump inspection and servicing'
    },
    {
      name: 'Clean Heat Pump Filters',
      intervalDays: 60,
      priority: 'medium',
      description: 'Clean or replace heat pump air filters'
    }
  ],

  // HRV System
  'hrv': [
    {
      name: 'Replace HRV Filters',
      intervalDays: 90,
      priority: 'medium',
      description: 'Replace or clean HRV intake and exhaust filters'
    },
    {
      name: 'Clean HRV Core',
      intervalDays: 365,
      priority: 'medium',
      description: 'Remove and clean HRV core for optimal heat recovery'
    }
  ],

  // Heat Trace
  'heat-trace': [
    {
      name: 'Test Heat Trace Cables',
      intervalDays: 180,
      priority: 'high',
      description: 'Test heat trace cables for continuity before winter',
      seasonalTiming: 'pre-freeze-up'
    },
    {
      name: 'Inspect Heat Trace Cables',
      intervalDays: 180,
      priority: 'medium',
      description: 'Visual inspection for damage after winter',
      seasonalTiming: 'break-up'
    }
  ],

  // Water Systems - Trucked Water
  'trucked-water-tank': [
    {
      name: 'Water Tank Cleaning',
      intervalDays: 365,
      priority: 'medium',
      description: 'Clean and sanitize water holding tank'
    }
  ],

  // Well System
  'well': [
    {
      name: 'Well Pump Inspection',
      intervalDays: 365,
      priority: 'medium',
      description: 'Professional inspection of well pump and pressure system'
    },
    {
      name: 'Test Well Water Quality',
      intervalDays: 365,
      priority: 'high',
      description: 'Send water sample for bacterial and mineral testing'
    }
  ],

  // Hot Water Systems
  'hot-water-tank': [
    {
      name: 'Flush Hot Water Tank',
      intervalDays: 365,
      priority: 'medium',
      description: 'Drain and flush sediment from hot water tank'
    },
    {
      name: 'Test Pressure Relief Valve',
      intervalDays: 365,
      priority: 'high',
      description: 'Test TPR valve for proper operation (safety critical)'
    },
    {
      name: 'Check Anode Rod',
      intervalDays: 1095, // 3 years
      priority: 'medium',
      description: 'Inspect and replace anode rod if needed'
    }
  ],
  'tankless': [
    {
      name: 'Descale Tankless Heater',
      intervalDays: 365,
      priority: 'medium',
      description: 'Flush tankless water heater to remove mineral buildup'
    }
  ],

  // Water Treatment
  'uv-sterilizer': [
    {
      name: 'Replace UV Bulb',
      intervalDays: 365,
      priority: 'high',
      description: 'Replace UV sterilizer bulb (typically annual replacement)'
    }
  ],
  'water-softener': [
    {
      name: 'Refill Water Softener Salt',
      intervalDays: 30,
      priority: 'low',
      description: 'Check and refill water softener salt'
    },
    {
      name: 'Clean Water Softener Resin',
      intervalDays: 365,
      priority: 'medium',
      description: 'Clean resin tank with iron-out or resin cleaner'
    }
  ],
  'whole-house-filter': [
    {
      name: 'Replace Whole House Filter',
      intervalDays: 180,
      priority: 'medium',
      description: 'Replace whole house water filter cartridge'
    }
  ],
  'sediment-filter': [
    {
      name: 'Replace Sediment Filter',
      intervalDays: 90,
      priority: 'low',
      description: 'Replace sediment pre-filter cartridge'
    }
  ],

  // Sewage Systems
  'septic': [
    // Pump-out frequency set dynamically based on onboarding data
    {
      name: 'Septic System Inspection',
      intervalDays: 1095, // 3 years
      priority: 'medium',
      description: 'Professional septic system inspection'
    }
  ],
  'holding-tank': [
    // Pump-out frequency set dynamically based on onboarding data
  ],

  // Electrical - Generator
  'generator': [
    {
      name: 'Generator Exercise Run',
      intervalDays: 30,
      priority: 'medium',
      description: 'Run generator for 15-20 minutes under load'
    },
    {
      name: 'Generator Oil Change',
      intervalDays: 365,
      priority: 'high',
      description: 'Change generator oil and filter (or every 100 hours)'
    },
    {
      name: 'Check Generator Fuel',
      intervalDays: 90,
      priority: 'medium',
      description: 'Verify fuel levels and add stabilizer if needed'
    }
  ],

  // Specialized Systems
  'sump-pump': [
    {
      name: 'Test Sump Pump',
      intervalDays: 90,
      priority: 'medium',
      description: 'Pour water into sump to test pump operation'
    }
  ],
  'humidifier': [
    {
      name: 'Clean Humidifier',
      intervalDays: 30,
      priority: 'low',
      description: 'Clean humidifier during heating season',
      seasonalTiming: 'winter'
    },
    {
      name: 'Replace Humidifier Filter/Pad',
      intervalDays: 365,
      priority: 'low',
      description: 'Replace humidifier evaporator pad'
    }
  ],

  // Appliances
  'refrigerator': [
    {
      name: 'Clean Refrigerator Coils',
      intervalDays: 180,
      priority: 'low',
      description: 'Vacuum condenser coils for efficiency'
    }
  ],
  'dryer': [
    {
      name: 'Clean Dryer Vent',
      intervalDays: 365,
      priority: 'high',
      description: 'Clean dryer exhaust vent (fire hazard prevention)'
    }
  ]
};

/**
 * Generate all maintenance tasks for a home based on onboarding data
 * @param {Object} home - Home document with onboardingData
 * @param {Object} systems - Array of System documents created from onboarding
 * @returns {Promise<Array>} Array of created ScheduledMaintenance tasks
 */
export async function generateTasksFromOnboarding(home, systems) {
  const tasks = [];
  const now = new Date();

  try {
    // Generate tasks for each system
    for (const system of systems) {
      const systemTasks = await generateTasksForSystem(home._id, system, now);
      tasks.push(...systemTasks);
    }

    // Generate tasks based on onboarding data not captured in systems
    const onboardingTasks = await generateTasksFromOnboardingData(home, now);
    tasks.push(...onboardingTasks);

    logger.info(`Generated ${tasks.length} maintenance tasks for home ${home._id}`);
    return tasks;
  } catch (error) {
    logger.error('Error generating tasks from onboarding:', error);
    throw error;
  }
}

/**
 * Generate tasks for a specific system
 * @param {String} homeId - Home ID
 * @param {Object} system - System document
 * @param {Date} baseDate - Base date for scheduling
 * @returns {Promise<Array>} Array of created tasks
 */
async function generateTasksForSystem(homeId, system, baseDate) {
  const tasks = [];
  const rules = TASK_GENERATION_RULES[system.type] || TASK_GENERATION_RULES[system.subtype];

  if (!rules || rules.length === 0) {
    return tasks;
  }

  for (const rule of rules) {
    // Calculate first due date
    let dueDate = new Date(baseDate);

    // For seasonal tasks, adjust to appropriate season
    if (rule.seasonalTiming) {
      dueDate = calculateSeasonalDate(dueDate, rule.seasonalTiming);
    } else {
      // For non-seasonal, schedule based on interval
      dueDate.setDate(dueDate.getDate() + (rule.intervalDays || 30));
    }

    const task = await ScheduledMaintenance.create({
      homeId,
      systemId: system._id,
      customTaskName: rule.name,
      scheduling: {
        dueDate,
        recurrence: {
          type: 'interval',
          intervalDays: rule.intervalDays
        }
      },
      status: 'scheduled',
      priority: rule.priority || 'medium',
      assignedTo: 'self'
    });

    tasks.push(task);
  }

  return tasks;
}

/**
 * Generate tasks from onboarding data (for systems without dedicated System documents)
 * @param {Object} home - Home document
 * @param {Date} baseDate - Base date for scheduling
 * @returns {Promise<Array>} Array of created tasks
 */
async function generateTasksFromOnboardingData(home, baseDate) {
  const tasks = [];
  const { onboardingData } = home;

  if (!onboardingData) {
    return tasks;
  }

  // Septic tank pump-out based on frequency
  if (onboardingData.sewageSystem === 'septic' && onboardingData.septicFrequency) {
    const intervalDays = getSepticIntervalDays(onboardingData.septicFrequency);
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + intervalDays);

    const task = await ScheduledMaintenance.create({
      homeId: home._id,
      customTaskName: 'Septic Tank Pump-Out',
      scheduling: {
        dueDate,
        recurrence: {
          type: 'interval',
          intervalDays
        }
      },
      status: 'scheduled',
      priority: 'high',
      assignedTo: 'provider'
    });

    tasks.push(task);
  }

  // Holding tank pump-out based on frequency
  if (onboardingData.sewageSystem === 'holding-tank' && onboardingData.holdingTankFrequency) {
    const intervalDays = getHoldingTankIntervalDays(onboardingData.holdingTankFrequency);
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + intervalDays);

    const task = await ScheduledMaintenance.create({
      homeId: home._id,
      customTaskName: 'Holding Tank Pump-Out',
      scheduling: {
        dueDate,
        recurrence: {
          type: 'interval',
          intervalDays
        }
      },
      status: 'scheduled',
      priority: 'critical',
      assignedTo: 'provider'
    });

    tasks.push(task);
  }

  // Trucked water refill reminders
  if (onboardingData.waterSource === 'trucked' && onboardingData.refillFrequency && onboardingData.enableWaterReminders) {
    const intervalDays = getWaterRefillIntervalDays(onboardingData.refillFrequency);
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + intervalDays);

    const task = await ScheduledMaintenance.create({
      homeId: home._id,
      customTaskName: 'Water Tank Refill',
      scheduling: {
        dueDate,
        recurrence: {
          type: 'interval',
          intervalDays
        }
      },
      status: 'scheduled',
      priority: 'high',
      assignedTo: 'provider'
    });

    tasks.push(task);
  }

  return tasks;
}

/**
 * Calculate seasonal date for task scheduling
 * @param {Date} baseDate - Starting date
 * @param {String} season - Season identifier
 * @returns {Date} Calculated seasonal date
 */
function calculateSeasonalDate(baseDate, season) {
  const year = baseDate.getFullYear();
  const seasonDates = {
    'pre-freeze-up': new Date(year, 8, 1), // September 1
    'winter': new Date(year, 11, 1), // December 1
    'break-up': new Date(year, 4, 1), // May 1
    'summer': new Date(year, 6, 1) // July 1
  };

  let targetDate = seasonDates[season] || baseDate;

  // If target date is in the past, move to next year
  if (targetDate < baseDate) {
    targetDate = new Date(targetDate);
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }

  return targetDate;
}

/**
 * Convert septic frequency to interval days
 */
function getSepticIntervalDays(frequency) {
  const intervals = {
    '1-year': 365,
    '2-years': 730,
    '3-years': 1095,
    'custom': 730 // Default to 2 years
  };
  return intervals[frequency] || 730;
}

/**
 * Convert holding tank frequency to interval days
 */
function getHoldingTankIntervalDays(frequency) {
  const intervals = {
    'weekly': 7,
    'biweekly': 14,
    'monthly': 30,
    'custom': 14 // Default to biweekly
  };
  return intervals[frequency] || 14;
}

/**
 * Convert water refill frequency to interval days
 */
function getWaterRefillIntervalDays(frequency) {
  const intervals = {
    'weekly': 7,
    'biweekly': 14,
    'monthly': 30,
    'custom': 14 // Default to biweekly
  };
  return intervals[frequency] || 14;
}

/**
 * Generate seasonal checklist for a home
 * @param {String} homeId - Home ID
 * @param {String} season - Season (spring, summer, fall, winter)
 * @param {Array} systems - Array of home systems
 * @returns {Promise<Object>} Created seasonal checklist
 */
export async function generateSeasonalChecklist(homeId, season, systems) {
  // Import SeasonalChecklist model
  const SeasonalChecklist = (await import('../models/SeasonalChecklist.js')).default;

  const checklistItems = [];

  // Generate checklist items based on season and systems
  for (const system of systems) {
    const items = getSeasonalChecklistItems(system, season);
    checklistItems.push(...items);
  }

  // Create checklist
  const checklist = await SeasonalChecklist.create({
    homeId,
    season,
    year: new Date().getFullYear(),
    items: checklistItems
  });

  return checklist;
}

/**
 * Get seasonal checklist items for a system
 */
function getSeasonalChecklistItems(system, season) {
  const items = [];

  // Seasonal-specific tasks
  const seasonalTasks = {
    fall: {
      'furnace': ['Test heating system', 'Replace furnace filter', 'Check thermostat'],
      'heat-trace': ['Test heat trace cables', 'Verify thermostats working'],
      'hrv': ['Clean HRV filters'],
      'generator': ['Test generator operation', 'Check fuel levels']
    },
    winter: {
      'furnace': ['Monitor furnace operation', 'Check for ice dams'],
      'hot-water-tank': ['Test pressure relief valve']
    },
    spring: {
      'heat-trace': ['Inspect heat trace for damage'],
      'hrv': ['Clean HRV core']
    },
    summer: {
      'furnace': ['Schedule annual furnace inspection'],
      'chimney': ['Schedule chimney cleaning']
    }
  };

  const systemTasks = seasonalTasks[season]?.[system.type] || [];

  systemTasks.forEach(taskName => {
    items.push({
      system: system._id,
      task: taskName,
      completed: false
    });
  });

  return items;
}

export default {
  generateTasksFromOnboarding,
  generateTasksForSystem,
  generateSeasonalChecklist
};
