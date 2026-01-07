/**
 * Onboarding Controller
 * Handles onboarding wizard completion and system setup
 */

import Home from '../models/Home.js';
import System from '../models/System.js';
import UserPreferences from '../models/UserPreferences.js';
import { generateTasksFromOnboarding, generateSeasonalChecklist } from '../services/taskGenerationService.js';
import logger from '../utils/logger.js';

/**
 * Complete onboarding wizard
 * Creates home, systems, generates tasks, and sets preferences
 * POST /api/v1/onboarding/complete
 */
export async function completeOnboarding(req, res) {
  try {
    const { home: homeData, systems: systemsData, preferences } = req.body;
    const userId = req.user._id;

    // Validate required data
    if (!homeData || !homeData.name || !homeData.homeType || !homeData.community || !homeData.territory) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required home information',
          details: ['name, homeType, community, and territory are required']
        }
      });
    }

    // Create the home
    const newHome = await Home.create({
      userId,
      name: homeData.name,
      address: {
        community: homeData.community,
        territory: homeData.territory,
        postalCode: homeData.postalCode
      },
      details: {
        homeType: homeData.homeType,
        yearBuilt: homeData.yearBuilt,
        bedrooms: homeData.bedrooms,
        bathrooms: homeData.bathrooms
      },
      onboardingData: systemsData, // Store complete onboarding data
      utilities: {
        waterSource: systemsData.water?.waterSource,
        sewageSystem: systemsData.sewage?.sewageSystem,
        electricalService: systemsData.electrical?.powerSource,
        primaryHeatFuel: systemsData.heating?.primaryHeating
          ? mapHeatingSystemToFuelType(systemsData.heating.primaryHeating)
          : null
      }
    });

    logger.info(`Home created for user ${userId}: ${newHome._id}`);

    // Create comprehensive set of default systems for immediate dashboard functionality
    // Users can edit/delete systems they don't need
    const createdSystems = await createDefaultSystems(newHome._id, systemsData);

    logger.info(`Created ${createdSystems.length} systems for home ${newHome._id}`);

    // Generate maintenance tasks based on systems
    const generatedTasks = await generateTasksFromOnboarding(newHome, createdSystems);

    logger.info(`Generated ${generatedTasks.length} maintenance tasks for home ${newHome._id}`);

    // Generate initial seasonal checklist if enabled
    let checklistGenerated = false;
    if (preferences?.autoGenerateChecklists !== false) {
      try {
        const currentSeason = getCurrentSeason();
        await generateSeasonalChecklist(newHome._id, currentSeason, createdSystems);
        checklistGenerated = true;
        logger.info(`Generated ${currentSeason} checklist for home ${newHome._id}`);
      } catch (error) {
        logger.error('Error generating seasonal checklist:', error);
        // Don't fail the whole onboarding if checklist generation fails
      }
    }

    // Update or create user preferences
    if (preferences) {
      let userPrefs = await UserPreferences.findOne({ userId });
      if (userPrefs) {
        await userPrefs.updateFromOnboarding(preferences);
      } else {
        userPrefs = await UserPreferences.create({
          userId,
          ...preferences
        });
      }
      logger.info(`Updated preferences for user ${userId}`);
    }

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        home: {
          id: newHome._id,
          name: newHome.name,
          homeType: newHome.details.homeType,
          community: newHome.address.community,
          territory: newHome.address.territory
        },
        systems: createdSystems.map(s => ({
          id: s._id,
          category: s.category,
          type: s.type,
          name: s.name
        })),
        tasksGenerated: generatedTasks.length,
        checklistGenerated
      },
      message: 'Onboarding completed successfully! Your dashboard is ready.'
    });
  } catch (error) {
    logger.error('Error completing onboarding:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to complete onboarding',
        details: process.env.NODE_ENV === 'development' ? [error.message] : []
      }
    });
  }
}

/**
 * Create comprehensive default system set for immediate dashboard functionality
 * Creates all standard northern home systems with data from onboarding
 * Users can edit/configure or delete systems they don't need
 */
async function createDefaultSystems(homeId, systemsData) {
  const systems = [];

  // 1. PRIMARY HEATING SYSTEM (from onboarding data or default)
  const primaryHeating = systemsData.heating?.primaryHeating || 'oil-furnace';
  const heatingSystem = await System.create({
    homeId,
    category: 'heating',
    type: primaryHeating,
    name: `Primary ${formatSystemName(primaryHeating)}`,
    details: {
      make: systemsData.heating?.heatingBrand || null,
      fuelType: mapHeatingToFuel(primaryHeating)
    },
    installation: {
      date: systemsData.heating?.heatingAge
        ? calculateInstallDate(systemsData.heating.heatingAge)
        : null
    },
    status: 'active'
  });
  systems.push(heatingSystem);

  // 2. HOT WATER TANK (standard for all homes)
  const hotWaterSystem = await System.create({
    homeId,
    category: 'hot-water',
    type: systemsData.water?.hotWaterSystem || 'hot-water-tank',
    name: 'Hot Water Tank',
    details: {
      capacity: systemsData.water?.tankSize ? `${systemsData.water.tankSize} gallons` : null,
      fuelType: systemsData.water?.tankFuel || null
    },
    installation: {
      date: systemsData.water?.tankAge
        ? calculateInstallDate(systemsData.water.tankAge)
        : null
    },
    status: 'active'
  });
  systems.push(hotWaterSystem);

  // 3. WATER SOURCE (from onboarding data)
  const waterSource = systemsData.water?.waterSource || 'municipal';
  if (waterSource === 'well' || waterSource === 'combination') {
    const wellSystem = await System.create({
      homeId,
      category: 'plumbing',
      type: 'well',
      name: 'Well System',
      details: {
        capacity: systemsData.water?.wellDepth ? `${systemsData.water.wellDepth} ft depth` : null
      },
      status: 'active'
    });
    systems.push(wellSystem);
  } else if (waterSource === 'trucked') {
    const tankSystem = await System.create({
      homeId,
      category: 'plumbing',
      type: 'trucked-water-tank',
      name: 'Water Holding Tank',
      northern: {
        fuelStorage: {
          capacity: systemsData.water?.tankCapacity || 500,
          currentLevel: 100,
          reorderPoint: 25
        }
      },
      status: 'active'
    });
    systems.push(tankSystem);
  } else {
    // Municipal water connection
    const municipalWater = await System.create({
      homeId,
      category: 'plumbing',
      type: 'municipal-water',
      name: 'Municipal Water Connection',
      status: 'active'
    });
    systems.push(municipalWater);
  }

  // 4. SEWAGE SYSTEM (from onboarding data)
  const sewageType = systemsData.sewage?.sewageSystem || 'municipal';
  const sewageSystem = await System.create({
    homeId,
    category: 'sewage',
    type: sewageType,
    name: sewageType === 'municipal' ? 'Municipal Sewer Connection' :
          sewageType === 'septic' ? 'Septic System' :
          sewageType === 'holding-tank' ? 'Sewage Holding Tank' :
          'Combination Sewage System',
    details: {
      capacity: systemsData.sewage?.tankCapacity
        ? `${systemsData.sewage.tankCapacity} gallons`
        : null,
      lastPumped: systemsData.sewage?.lastPumped
        ? new Date(systemsData.sewage.lastPumped)
        : null
    },
    status: 'active'
  });
  systems.push(sewageSystem);

  // 5. HRV/VENTILATION SYSTEM (standard for northern homes)
  const hrvSystem = await System.create({
    homeId,
    category: 'ventilation',
    type: 'hrv',
    name: 'Heat Recovery Ventilator (HRV)',
    details: {
      make: systemsData.heating?.hrvBrand || null
    },
    installation: {
      date: systemsData.heating?.hrvAge
        ? calculateInstallDate(systemsData.heating.hrvAge)
        : null
    },
    status: systemsData.heating?.hasHRV ? 'active' : 'not-installed'
  });
  systems.push(hrvSystem);

  // 6. HEAT TRACE SYSTEM (common for northern homes)
  const heatTraceSystem = await System.create({
    homeId,
    category: 'freeze-protection',
    type: 'heat-trace',
    name: 'Heat Trace Cables',
    northern: {
      heatTrace: {
        zones: systemsData.heating?.heatTraceLocations?.map(location => ({
          name: location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        })) || []
      }
    },
    status: systemsData.heating?.hasHeatTrace ? 'active' : 'not-installed'
  });
  systems.push(heatTraceSystem);

  // 7. BACKUP GENERATOR (common for northern homes)
  const generatorSystem = await System.create({
    homeId,
    category: 'electrical',
    type: 'generator',
    subtype: systemsData.electrical?.generatorFuel || 'diesel',
    name: systemsData.electrical?.generatorType === 'standby'
      ? 'Standby Generator'
      : 'Portable Generator',
    details: {
      make: systemsData.electrical?.generatorBrand || null,
      fuelType: systemsData.electrical?.generatorFuel || 'diesel'
    },
    status: systemsData.electrical?.hasGenerator ? 'active' : 'not-installed'
  });
  systems.push(generatorSystem);

  // 8. SUMP PUMP (if applicable)
  const sumpPump = await System.create({
    homeId,
    category: 'plumbing',
    type: 'sump-pump',
    name: 'Sump Pump',
    status: 'not-installed' // User can activate if they have one
  });
  systems.push(sumpPump);

  // 9. WATER SOFTENER/TREATMENT (if applicable)
  if (systemsData.water?.hasTreatment && systemsData.water?.treatmentSystems) {
    for (const treatment of systemsData.water.treatmentSystems) {
      const treatmentSystem = await System.create({
        homeId,
        category: 'plumbing',
        type: treatment,
        name: formatSystemName(treatment),
        status: 'active'
      });
      systems.push(treatmentSystem);
    }
  } else {
    // Add placeholder water softener
    const softener = await System.create({
      homeId,
      category: 'plumbing',
      type: 'water-softener',
      name: 'Water Softener',
      status: 'not-installed'
    });
    systems.push(softener);
  }

  // 10. SECONDARY HEATING (if provided)
  if (systemsData.heating?.secondaryHeating && systemsData.heating.secondaryHeating.length > 0) {
    for (const secondary of systemsData.heating.secondaryHeating) {
      const secondarySystem = await System.create({
        homeId,
        category: 'heating',
        type: secondary,
        name: `Secondary ${formatSystemName(secondary)}`,
        status: 'active'
      });
      systems.push(secondarySystem);
    }
  } else {
    // Add placeholder wood stove
    const woodStove = await System.create({
      homeId,
      category: 'heating',
      type: 'wood-stove',
      name: 'Secondary Wood Stove',
      status: 'not-installed'
    });
    systems.push(woodStove);
  }

  // 11. SMOKE/CO DETECTORS (required for all homes)
  const smokeDetector = await System.create({
    homeId,
    category: 'safety',
    type: 'smoke-detector',
    name: 'Smoke Detectors',
    status: 'active'
  });
  systems.push(smokeDetector);

  const coDetector = await System.create({
    homeId,
    category: 'safety',
    type: 'co-detector',
    name: 'Carbon Monoxide Detectors',
    status: 'active'
  });
  systems.push(coDetector);

  // 12. ADDITIONAL APPLIANCES/SYSTEMS (if provided)
  if (systemsData.additional?.appliances) {
    for (const appliance of systemsData.additional.appliances) {
      const applianceSystem = await System.create({
        homeId,
        category: 'other',
        type: appliance,
        name: formatSystemName(appliance),
        status: 'active'
      });
      systems.push(applianceSystem);
    }
  }

  return systems;
}

/**
 * Helper: Map heating system type to fuel type
 */
function mapHeatingToFuel(heatingType) {
  const fuelMap = {
    'oil-furnace': 'oil',
    'propane-furnace': 'propane',
    'natural-gas': 'natural-gas',
    'electric-furnace': 'electric',
    'wood-stove': 'wood',
    'pellet-stove': 'wood',
    'heat-pump': 'electric',
    'boiler': 'oil'
  };
  return fuelMap[heatingType] || null;
}

/**
 * Create heating system documents (LEGACY - kept for backwards compatibility)
 */
async function createHeatingSystems(homeId, heatingData) {
  const systems = [];

  // Primary heating system
  if (heatingData.primaryHeating) {
    const primarySystem = await System.create({
      homeId,
      category: 'heating',
      type: heatingData.primaryHeating,
      name: `Primary ${formatSystemName(heatingData.primaryHeating)}`,
      details: {
        make: heatingData.heatingBrand,
        fuelType: heatingData.primaryHeating.includes('propane') ? 'propane' :
                  heatingData.primaryHeating.includes('oil') ? 'oil' :
                  heatingData.primaryHeating.includes('gas') ? 'natural-gas' :
                  heatingData.primaryHeating.includes('electric') ? 'electric' : undefined
      },
      installation: {
        date: heatingData.heatingAge ? calculateInstallDate(heatingData.heatingAge) : undefined
      },
      status: 'active'
    });
    systems.push(primarySystem);
  }

  // HRV system
  if (heatingData.hasHRV) {
    const hrvSystem = await System.create({
      homeId,
      category: 'ventilation',
      type: 'hrv',
      name: 'Heat Recovery Ventilator',
      details: {
        make: heatingData.hrvBrand
      },
      installation: {
        date: heatingData.hrvAge ? calculateInstallDate(heatingData.hrvAge) : undefined
      },
      status: 'active'
    });
    systems.push(hrvSystem);
  }

  // Heat trace system
  if (heatingData.hasHeatTrace) {
    const heatTraceSystem = await System.create({
      homeId,
      category: 'freeze-protection',
      type: 'heat-trace',
      name: 'Heat Trace Cables',
      northern: {
        heatTrace: {
          zones: (heatingData.heatTraceLocations || []).map(location => ({
            name: location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          }))
        }
      },
      status: 'active'
    });
    systems.push(heatTraceSystem);
  }

  // Secondary heating systems
  if (heatingData.secondaryHeating && heatingData.secondaryHeating.length > 0) {
    for (const secondary of heatingData.secondaryHeating) {
      const secondarySystem = await System.create({
        homeId,
        category: 'heating',
        type: secondary,
        name: `Secondary ${formatSystemName(secondary)}`,
        status: 'active'
      });
      systems.push(secondarySystem);
    }
  }

  return systems;
}

/**
 * Create water system documents
 */
async function createWaterSystems(homeId, waterData) {
  const systems = [];

  // Hot water system
  if (waterData.hotWaterSystem) {
    const hotWaterSystem = await System.create({
      homeId,
      category: 'hot-water',
      type: waterData.hotWaterSystem === 'tank' ? 'hot-water-tank' : waterData.hotWaterSystem,
      name: waterData.hotWaterSystem === 'tank' ? 'Hot Water Tank' :
            waterData.hotWaterSystem === 'tankless' ? 'Tankless Water Heater' :
            'Boiler-Integrated Hot Water',
      details: {
        capacity: waterData.tankSize ? `${waterData.tankSize} gallons` : undefined,
        fuelType: waterData.tankFuel
      },
      installation: {
        date: waterData.tankAge ? calculateInstallDate(waterData.tankAge) : undefined
      },
      status: 'active'
    });
    systems.push(hotWaterSystem);
  }

  // Well system
  if (waterData.waterSource === 'well' || waterData.waterSource === 'combination') {
    const wellSystem = await System.create({
      homeId,
      category: 'plumbing',
      type: 'well',
      name: 'Well System',
      details: {
        capacity: waterData.wellDepth ? `${waterData.wellDepth} ft depth` : undefined
      },
      status: 'active'
    });
    systems.push(wellSystem);
  }

  // Trucked water tank
  if (waterData.waterSource === 'trucked') {
    const tankSystem = await System.create({
      homeId,
      category: 'plumbing',
      type: 'trucked-water-tank',
      name: 'Water Holding Tank',
      northern: {
        fuelStorage: { // Reusing fuel storage structure for water tank
          capacity: waterData.tankCapacity,
          currentLevel: 100, // Start at full
          reorderPoint: 25 // Alert at 25%
        }
      },
      status: 'active'
    });
    systems.push(tankSystem);
  }

  // Water treatment systems
  if (waterData.hasTreatment && waterData.treatmentSystems) {
    for (const treatment of waterData.treatmentSystems) {
      const treatmentSystem = await System.create({
        homeId,
        category: 'plumbing',
        type: treatment,
        name: formatSystemName(treatment),
        status: 'active'
      });
      systems.push(treatmentSystem);
    }
  }

  return systems;
}

/**
 * Create sewage system documents
 */
async function createSewageSystems(homeId, sewageData) {
  const systems = [];

  // Main sewage system
  if (sewageData.sewageSystem) {
    const sewageSystem = await System.create({
      homeId,
      category: 'sewage',
      type: sewageData.sewageSystem,
      name: sewageData.sewageSystem === 'municipal' ? 'Municipal Sewer Connection' :
            sewageData.sewageSystem === 'septic' ? 'Septic System' :
            sewageData.sewageSystem === 'holding-tank' ? 'Sewage Holding Tank' :
            'Combination Sewage System',
      details: {
        capacity: sewageData.tankCapacity ? `${sewageData.tankCapacity} gallons` : undefined,
        lastPumped: sewageData.lastPumped ? new Date(sewageData.lastPumped) : undefined
      },
      status: 'active'
    });
    systems.push(sewageSystem);
  }

  return systems;
}

/**
 * Create electrical system documents
 */
async function createElectricalSystems(homeId, electricalData) {
  const systems = [];

  // Generator
  if (electricalData.hasGenerator) {
    const generatorSystem = await System.create({
      homeId,
      category: 'electrical',
      type: 'generator',
      subtype: electricalData.generatorFuel,
      name: `${electricalData.generatorType === 'standby' ? 'Standby' : 'Portable'} Generator`,
      details: {
        make: electricalData.generatorBrand,
        fuelType: electricalData.generatorFuel
      },
      status: 'active'
    });
    systems.push(generatorSystem);
  }

  return systems;
}

/**
 * Create additional system documents (appliances, specialized, fuel storage)
 */
async function createAdditionalSystems(homeId, additionalData) {
  const systems = [];

  // Appliances
  if (additionalData.appliances) {
    for (const appliance of additionalData.appliances) {
      const applianceSystem = await System.create({
        homeId,
        category: 'other',
        type: appliance,
        name: formatSystemName(appliance),
        status: 'active'
      });
      systems.push(applianceSystem);
    }
  }

  // Specialized systems
  if (additionalData.specializedSystems) {
    for (const specialized of additionalData.specializedSystems) {
      const category = specialized.includes('heated') ? 'heating' :
                      specialized.includes('sump') ? 'plumbing' :
                      specialized.includes('humidifier') ? 'ventilation' : 'other';

      const specializedSystem = await System.create({
        homeId,
        category,
        type: specialized,
        name: formatSystemName(specialized),
        status: 'active'
      });
      systems.push(specializedSystem);
    }
  }

  // Fuel storage
  if (additionalData.fuelStorage) {
    for (const storage of additionalData.fuelStorage) {
      const storageSystem = await System.create({
        homeId,
        category: 'fuel-storage',
        type: storage,
        name: formatSystemName(storage),
        status: 'active'
      });
      systems.push(storageSystem);
    }
  }

  return systems;
}

/**
 * Helper: Format system type name for display
 */
function formatSystemName(systemType) {
  return systemType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper: Calculate installation date from age
 */
function calculateInstallDate(ageYears) {
  const now = new Date();
  const installYear = now.getFullYear() - ageYears;
  return new Date(installYear, 0, 1); // January 1st of install year
}

/**
 * Helper: Get current season based on date
 */
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Helper: Map heating system type to fuel type for Home utilities
 */
function mapHeatingSystemToFuelType(heatingType) {
  const fuelMap = {
    'oil-furnace': 'oil',
    'propane-furnace': 'propane',
    'natural-gas': 'natural-gas',
    'electric-furnace': 'electric',
    'wood-stove': 'wood',
    'pellet-stove': 'wood',
    'heat-pump': 'electric',
    'boiler': 'oil' // Default boiler to oil, can be overridden later
  };
  return fuelMap[heatingType] || null;
}

export default {
  completeOnboarding
};
