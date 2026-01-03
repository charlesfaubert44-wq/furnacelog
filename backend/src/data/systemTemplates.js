/**
 * Northern-Specific System Templates
 * Pre-configured templates for common northern home systems
 *
 * Part of Epic E4 - System & Component Tracking (E4-T2)
 * Covers major northern systems as specified in TASKS.md
 */

const SYSTEM_TEMPLATES = {
  // ========================================
  // HEATING SYSTEMS
  // ========================================

  'forced-air-furnace-propane': {
    category: 'heating',
    type: 'furnace',
    subtype: 'propane',
    name: 'Propane Forced-Air Furnace',
    details: {
      fuelType: 'propane'
    },
    maintenance: {
      defaultIntervalDays: 365 // Annual service
    },
    description: 'Propane-fired forced-air furnace for northern climates',
    defaultComponents: [
      {
        name: 'Furnace Air Filter',
        type: 'filter',
        replacement: { intervalDays: 90 } // Quarterly in northern climates
      },
      {
        name: 'Flame Sensor',
        type: 'flame-sensor',
        replacement: { intervalDays: 1825, isProfessionalRequired: true } // 5 years
      },
      {
        name: 'Igniter',
        type: 'igniter',
        replacement: { intervalDays: 1825, isProfessionalRequired: true }
      }
    ],
    recommendedTasks: [
      'Annual furnace combustion analysis',
      'Filter replacement (90 days)',
      'Pre-freeze-up inspection (September)',
      'Propane connection inspection',
      'Exhaust vent inspection'
    ]
  },

  'forced-air-furnace-oil': {
    category: 'heating',
    type: 'furnace',
    subtype: 'oil',
    name: 'Oil Forced-Air Furnace',
    details: {
      fuelType: 'oil'
    },
    maintenance: {
      defaultIntervalDays: 365
    },
    description: 'Oil-fired forced-air furnace for northern climates',
    defaultComponents: [
      {
        name: 'Furnace Air Filter',
        type: 'filter',
        replacement: { intervalDays: 90 }
      },
      {
        name: 'Oil Nozzle',
        type: 'other',
        replacement: { intervalDays: 365, isProfessionalRequired: true }
      },
      {
        name: 'Oil Filter',
        type: 'filter',
        replacement: { intervalDays: 365, isProfessionalRequired: true }
      }
    ],
    recommendedTasks: [
      'Annual furnace tune-up and combustion test',
      'Oil filter replacement',
      'Nozzle cleaning/replacement',
      'Air filter replacement (90 days)',
      'Pre-freeze-up inspection',
      'Oil tank level check'
    ]
  },

  'forced-air-furnace-natural-gas': {
    category: 'heating',
    type: 'furnace',
    subtype: 'natural-gas',
    name: 'Natural Gas Forced-Air Furnace',
    details: {
      fuelType: 'natural-gas'
    },
    maintenance: {
      defaultIntervalDays: 365
    },
    description: 'Natural gas forced-air furnace',
    defaultComponents: [
      {
        name: 'Furnace Air Filter',
        type: 'filter',
        replacement: { intervalDays: 90 }
      },
      {
        name: 'Flame Sensor',
        type: 'flame-sensor',
        replacement: { intervalDays: 1825, isProfessionalRequired: true }
      },
      {
        name: 'Igniter',
        type: 'igniter',
        replacement: { intervalDays: 1825, isProfessionalRequired: true }
      }
    ],
    recommendedTasks: [
      'Annual furnace tune-up',
      'Filter replacement (90 days)',
      'Gas line inspection',
      'Combustion analysis',
      'Pre-freeze-up inspection'
    ]
  },

  'boiler-system': {
    category: 'heating',
    type: 'boiler',
    subtype: null,
    name: 'Boiler Heating System',
    details: {},
    maintenance: {
      defaultIntervalDays: 365
    },
    description: 'Hydronic boiler heating system',
    defaultComponents: [
      {
        name: 'Circulator Pump',
        type: 'circulator-pump',
        replacement: { intervalDays: 3650, isProfessionalRequired: true } // 10 years
      },
      {
        name: 'Expansion Tank',
        type: 'expansion-tank',
        replacement: { intervalDays: 3650, isProfessionalRequired: true }
      },
      {
        name: 'Pressure Relief Valve',
        type: 'pressure-relief-valve',
        replacement: { intervalDays: 1825, isProfessionalRequired: true } // 5 years
      }
    ],
    recommendedTasks: [
      'Annual boiler tune-up',
      'System pressure check',
      'Circulation pump inspection',
      'Water chemistry test',
      'Expansion tank check',
      'Pre-freeze-up inspection'
    ]
  },

  'electric-baseboard': {
    category: 'heating',
    type: 'baseboard',
    subtype: 'electric',
    name: 'Electric Baseboard Heating',
    details: {
      fuelType: 'electric'
    },
    maintenance: {
      defaultIntervalDays: 365
    },
    description: 'Electric baseboard heating system',
    defaultComponents: [],
    recommendedTasks: [
      'Annual cleaning and dust removal',
      'Thermostat calibration check',
      'Electrical connection inspection',
      'Baseboard clearance check'
    ]
  },

  // ========================================
  // HOT WATER SYSTEMS
  // ========================================

  'tankless-water-heater': {
    category: 'hot-water',
    type: 'tankless-heater',
    subtype: null,
    name: 'Tankless Water Heater',
    details: {},
    maintenance: {
      defaultIntervalDays: 365
    },
    description: 'On-demand tankless water heater with freeze protection',
    defaultComponents: [
      {
        name: 'Inline Water Filter',
        type: 'filter',
        replacement: { intervalDays: 365 }
      }
    ],
    recommendedTasks: [
      'Annual descaling (critical in hard water areas)',
      'Filter cleaning/replacement',
      'Freeze protection system check',
      'Combustion analysis (gas models)',
      'Inlet filter cleaning',
      'Venting inspection'
    ]
  },

  'tank-water-heater': {
    category: 'hot-water',
    type: 'tank-heater',
    subtype: null,
    name: 'Tank Water Heater',
    details: {},
    maintenance: {
      defaultIntervalDays: 365
    },
    description: 'Standard tank-style water heater',
    defaultComponents: [
      {
        name: 'Anode Rod',
        type: 'anode-rod',
        replacement: { intervalDays: 1825, isProfessionalRequired: false } // 5 years, DIY possible
      },
      {
        name: 'Temperature & Pressure Relief Valve',
        type: 'pressure-relief-valve',
        replacement: { intervalDays: 1825, isProfessionalRequired: true }
      }
    ],
    recommendedTasks: [
      'Annual tank flush',
      'Anode rod inspection (5 years)',
      'T&P valve test',
      'Temperature setting check',
      'Sediment removal'
    ]
  },

  // ========================================
  // VENTILATION SYSTEMS
  // ========================================

  'hrv-system': {
    category: 'ventilation',
    type: 'hrv',
    subtype: null,
    name: 'Heat Recovery Ventilator (HRV)',
    details: {},
    maintenance: {
      defaultIntervalDays: 90 // Quarterly maintenance
    },
    northern: {
      hrvInfo: {
        coreType: '',
        defrostType: ''
      }
    },
    description: 'HRV system for fresh air exchange with heat recovery',
    defaultComponents: [
      {
        name: 'HRV Intake Filter',
        type: 'hrv-filter',
        replacement: { intervalDays: 90 } // Quarterly in dusty northern conditions
      },
      {
        name: 'HRV Exhaust Filter',
        type: 'hrv-filter',
        replacement: { intervalDays: 90 }
      },
      {
        name: 'HRV Core',
        type: 'hrv-core',
        replacement: { intervalDays: 1825 } // Clean annually, replace every 5 years
      }
    ],
    recommendedTasks: [
      'Filter replacement (90 days)',
      'Core cleaning (annual)',
      'Defrost system check (pre-winter)',
      'Airflow balancing (annual)',
      'Condensate drain check',
      'Fan inspection',
      'Duct cleaning (every 3-5 years)'
    ]
  },

  'erv-system': {
    category: 'ventilation',
    type: 'erv',
    subtype: null,
    name: 'Energy Recovery Ventilator (ERV)',
    details: {},
    maintenance: {
      defaultIntervalDays: 90
    },
    northern: {
      hrvInfo: {
        coreType: '',
        defrostType: ''
      }
    },
    description: 'ERV system for fresh air exchange with energy recovery',
    defaultComponents: [
      {
        name: 'ERV Intake Filter',
        type: 'hrv-filter',
        replacement: { intervalDays: 90 }
      },
      {
        name: 'ERV Exhaust Filter',
        type: 'hrv-filter',
        replacement: { intervalDays: 90 }
      },
      {
        name: 'ERV Core',
        type: 'hrv-core',
        replacement: { intervalDays: 1825 }
      }
    ],
    recommendedTasks: [
      'Filter replacement (90 days)',
      'Core cleaning (annual)',
      'Defrost system check',
      'Airflow balancing',
      'Condensate drain check'
    ]
  },

  // ========================================
  // FREEZE PROTECTION
  // ========================================

  'heat-trace-cables': {
    category: 'freeze-protection',
    type: 'heat-trace',
    subtype: null,
    name: 'Heat Trace Cable System',
    details: {},
    maintenance: {
      defaultIntervalDays: 365
    },
    northern: {
      heatTrace: {
        zones: [],
        totalLength: 0,
        wattage: 0
      }
    },
    description: 'Electric heat trace cables for pipe freeze protection',
    defaultComponents: [],
    recommendedTasks: [
      'Pre-freeze-up continuity testing (September)',
      'Thermostat calibration check',
      'Visual inspection for damage',
      'Zone-by-zone testing',
      'Insulation integrity check',
      'Mid-winter operational check',
      'Spring shut-down and inspection'
    ]
  },

  // ========================================
  // FUEL STORAGE
  // ========================================

  'propane-tank': {
    category: 'fuel-storage',
    type: 'propane-tank',
    subtype: null,
    name: 'Propane Storage Tank',
    details: {},
    maintenance: {
      defaultIntervalDays: 1825 // 5-year recertification
    },
    northern: {
      fuelStorage: {
        capacity: 0,
        currentLevel: 0,
        reorderPoint: 30, // Reorder at 30%
        supplier: {}
      }
    },
    description: 'Propane storage tank for home heating fuel',
    defaultComponents: [],
    recommendedTasks: [
      'Regular level monitoring',
      'Annual tank inspection',
      'Regulator inspection',
      'Line inspection for leaks',
      'Valve operation check',
      'Tank recertification (5 years)',
      'Pre-winter fill-up'
    ]
  },

  'oil-tank': {
    category: 'fuel-storage',
    type: 'oil-tank',
    subtype: null,
    name: 'Heating Oil Storage Tank',
    details: {},
    maintenance: {
      defaultIntervalDays: 365
    },
    northern: {
      fuelStorage: {
        capacity: 0,
        currentLevel: 0,
        reorderPoint: 25, // Reorder at 25%
        supplier: {}
      }
    },
    description: 'Heating oil storage tank',
    defaultComponents: [
      {
        name: 'Oil Filter',
        type: 'filter',
        replacement: { intervalDays: 365, isProfessionalRequired: true }
      }
    ],
    recommendedTasks: [
      'Regular level monitoring',
      'Annual tank inspection for rust/leaks',
      'Filter replacement',
      'Water bottom check',
      'Line inspection',
      'Vent cap check',
      'Pre-winter fill-up'
    ]
  }
};

/**
 * Get all available system templates
 */
export const getAllTemplates = () => {
  return Object.keys(SYSTEM_TEMPLATES).map(key => ({
    id: key,
    ...SYSTEM_TEMPLATES[key]
  }));
};

/**
 * Get template by ID
 */
export const getTemplateById = (templateId) => {
  return SYSTEM_TEMPLATES[templateId] || null;
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category) => {
  return Object.keys(SYSTEM_TEMPLATES)
    .filter(key => SYSTEM_TEMPLATES[key].category === category)
    .map(key => ({
      id: key,
      ...SYSTEM_TEMPLATES[key]
    }));
};

/**
 * Create system from template
 * Returns a new system object with template defaults applied
 */
export const createFromTemplate = (templateId, customData = {}) => {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Merge template with custom data
  const systemData = {
    category: template.category,
    type: template.type,
    subtype: template.subtype,
    name: customData.name || template.name,
    details: {
      ...template.details,
      ...(customData.details || {})
    },
    maintenance: {
      ...template.maintenance,
      ...(customData.maintenance || {})
    },
    northern: {
      ...template.northern,
      ...(customData.northern || {})
    },
    createdFromTemplate: templateId
  };

  return {
    systemData,
    defaultComponents: template.defaultComponents || [],
    recommendedTasks: template.recommendedTasks || []
  };
};
