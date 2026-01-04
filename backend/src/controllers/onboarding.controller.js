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
      }
    });

    logger.info(`Home created for user ${userId}: ${newHome._id}`);

    // Create System documents for configured systems
    const createdSystems = [];

    // Create heating system(s)
    if (systemsData.heating) {
      const heatingSystems = await createHeatingSystems(newHome._id, systemsData.heating);
      createdSystems.push(...heatingSystems);
    }

    // Create water systems
    if (systemsData.water) {
      const waterSystems = await createWaterSystems(newHome._id, systemsData.water);
      createdSystems.push(...waterSystems);
    }

    // Create electrical systems
    if (systemsData.electrical) {
      const electricalSystems = await createElectricalSystems(newHome._id, systemsData.electrical);
      createdSystems.push(...electricalSystems);
    }

    // Create additional systems (appliances, specialized, fuel storage)
    if (systemsData.additional) {
      const additionalSystems = await createAdditionalSystems(newHome._id, systemsData.additional);
      createdSystems.push(...additionalSystems);
    }

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
 * Create heating system documents
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

export default {
  completeOnboarding
};
