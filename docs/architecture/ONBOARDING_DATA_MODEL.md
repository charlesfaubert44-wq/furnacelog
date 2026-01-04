# Onboarding Wizard - Complete Data Model Analysis

This document maps all data collected through the onboarding wizard to design the backend database schema.

## Complete Home Configuration Data Structure

### 1. Home Basics (HomeBasicsStep.tsx)

**Required Fields:**
- `homeName`: string - Nickname for the home (e.g., "Main House", "Cabin on the Lake")
- `homeType`: enum - Type of home construction
  - Options: `modular`, `stick-built`, `log`, `mobile`, `other`
- `community`: string - Community/town name (e.g., "Yellowknife", "Iqaluit")
- `territory`: enum - Territory location
  - Options: `NWT`, `Nunavut`, `Yukon`, `Other`

**Optional Fields:**
- `yearBuilt`: number - Year of construction (e.g., 2015)
- `bedrooms`: number - Number of bedrooms
- `bathrooms`: number - Number of bathrooms (supports decimals: 0.5 increments)

**Data Structure:**
```typescript
interface HomeBasics {
  homeName: string;
  homeType: 'modular' | 'stick-built' | 'log' | 'mobile' | 'other';
  community: string;
  territory: 'NWT' | 'Nunavut' | 'Yukon' | 'Other';
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
}
```

---

### 2. Heating Systems (HeatingSystemsStep.tsx)

**Primary Heating System (Required):**
- `primaryHeating`: enum - Main heating system type
  - Options: `oil-furnace`, `propane-furnace`, `natural-gas`, `electric-furnace`, `boiler`, `wood-stove`, `pellet-stove`, `heat-pump`
- `heatingAge`: number (optional) - System age in years
- `heatingBrand`: string (optional) - Manufacturer/brand

**Secondary Heating Systems (Optional):**
- `secondaryHeating`: string[] - Array of backup heating system IDs
  - Options: `wood-stove-secondary`, `pellet-stove-secondary`, `electric-heaters`, `propane-heaters`

**HRV System (Optional):**
- `hasHRV`: boolean - Heat Recovery Ventilator present
- `hrvBrand`: string (optional) - HRV manufacturer
- `hrvAge`: number (optional) - HRV age in years

**Heat Trace/Cables (Optional):**
- `hasHeatTrace`: boolean - Heat trace cables installed
- `heatTraceLocations`: string[] - Array of locations where heat trace is installed
  - Options: `water-lines`, `sewage-lines`, `roof-gutters`, `entryways`

**Data Structure:**
```typescript
interface HeatingSystems {
  // Primary heating (required)
  primaryHeating: 'oil-furnace' | 'propane-furnace' | 'natural-gas' |
                  'electric-furnace' | 'boiler' | 'wood-stove' |
                  'pellet-stove' | 'heat-pump';
  heatingAge?: number;
  heatingBrand?: string;

  // Secondary heating (optional)
  secondaryHeating?: ('wood-stove-secondary' | 'pellet-stove-secondary' |
                      'electric-heaters' | 'propane-heaters')[];

  // HRV system (optional)
  hasHRV?: boolean;
  hrvBrand?: string;
  hrvAge?: number;

  // Heat trace (optional)
  hasHeatTrace?: boolean;
  heatTraceLocations?: ('water-lines' | 'sewage-lines' |
                        'roof-gutters' | 'entryways')[];
}
```

**Maintenance Implications:**
- Different heating systems require different maintenance schedules
- Northern climate = more frequent maintenance
- HRV requires filter changes (every 3 months)
- Heat trace requires seasonal inspections (before winter, after winter)

---

### 3. Water Systems (WaterSystemsStep.tsx)

**Water Source (Required):**
- `waterSource`: enum - Primary water source
  - Options: `municipal`, `well`, `trucked`, `combination`

**Trucked Water Details (if applicable):**
- `tankCapacity`: number - Water tank capacity in gallons
- `refillFrequency`: enum - How often refills are needed
  - Options: `weekly`, `biweekly`, `monthly`, `custom`
- `refillCost`: number (optional) - Average cost per fill
- `enableWaterReminders`: boolean - Enable low-level alerts

**Well Water Details (if applicable):**
- `pumpType`: enum - Type of well pump
  - Options: `submersible`, `jet`, `other`
- `wellDepth`: number - Well depth in feet

**Hot Water System (Required):**
- `hotWaterSystem`: enum - Type of hot water heater
  - Options: `tank`, `tankless`, `boiler-integrated`

**Hot Water Tank Details (if tank selected):**
- `tankSize`: number - Tank capacity in gallons
- `tankFuel`: enum - Fuel type for heating water
  - Options: `electric`, `gas`, `propane`, `oil`
- `tankAge`: number - Age of hot water tank in years

**Water Treatment (Optional):**
- `hasTreatment`: boolean - Water treatment systems present
- `treatmentSystems`: string[] - Array of treatment system types
  - Options: `water-softener`, `uv-sterilizer`, `reverse-osmosis`,
             `whole-house-filter`, `sediment-filter`

**Data Structure:**
```typescript
interface WaterSystems {
  // Water source (required)
  waterSource: 'municipal' | 'well' | 'trucked' | 'combination';

  // Trucked water details (conditional)
  tankCapacity?: number;
  refillFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  refillCost?: number;
  enableWaterReminders?: boolean;

  // Well water details (conditional)
  pumpType?: 'submersible' | 'jet' | 'other';
  wellDepth?: number;

  // Hot water system (required)
  hotWaterSystem: 'tank' | 'tankless' | 'boiler-integrated';
  tankSize?: number;
  tankFuel?: 'electric' | 'gas' | 'propane' | 'oil';
  tankAge?: number;

  // Water treatment (optional)
  hasTreatment?: boolean;
  treatmentSystems?: ('water-softener' | 'uv-sterilizer' | 'reverse-osmosis' |
                      'whole-house-filter' | 'sediment-filter')[];
}
```

**Maintenance Implications:**
- Trucked water: Track refill schedule and costs
- Well pump: Annual inspection and maintenance
- Hot water tank: Flush annually, replace anode rod every 3-5 years
- UV sterilizer: Replace bulb annually
- Filters: Replace according to manufacturer schedule (typically 3-12 months)

---

### 4. Sewage Systems (SewageSystemsStep.tsx)

**Sewage System Type (Required):**
- `sewageSystem`: enum - Wastewater management type
  - Options: `municipal`, `septic`, `holding-tank`, `combination`

**Septic Tank Details (if applicable):**
- `septicTankSize`: number - Tank capacity in gallons
- `septicLastPumped`: date string - Last pump-out date
- `septicFrequency`: enum - Typical pump-out interval
  - Options: `1-year`, `2-years`, `3-years`, `custom`
- `septicCost`: number (optional) - Cost per pump-out

**Holding Tank Details (if applicable):**
- `holdingTankSize`: number - Tank capacity in gallons
- `holdingTankFrequency`: enum - Pump-out frequency
  - Options: `weekly`, `biweekly`, `monthly`, `custom`
- `holdingTankCost`: number (optional) - Cost per pump-out

**Data Structure:**
```typescript
interface SewageSystems {
  sewageSystem: 'municipal' | 'septic' | 'holding-tank' | 'combination';

  // Septic details (conditional)
  septicTankSize?: number;
  septicLastPumped?: string; // ISO date string
  septicFrequency?: '1-year' | '2-years' | '3-years' | 'custom';
  septicCost?: number;

  // Holding tank details (conditional)
  holdingTankSize?: number;
  holdingTankFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  holdingTankCost?: number;
}
```

**Maintenance Implications:**
- Septic: Schedule pump-outs based on frequency
- Holding tank: Track pump-out schedule and costs
- Cost tracking for budgeting

---

### 5. Electrical Systems (ElectricalSystemsStep.tsx)

**Primary Power Source (Required):**
- `powerSource`: enum - Main electrical power source
  - Options: `grid`, `generator-primary`, `hybrid`, `solar`

**Backup Generator (Optional):**
- `hasGenerator`: boolean - Backup generator present
- `generatorType`: enum - Generator style
  - Options: `portable`, `standby`
- `generatorFuel`: enum - Generator fuel type
  - Options: `diesel`, `propane`, `natural-gas`, `gasoline`
- `generatorBrand`: string (optional) - Brand/model
- `generatorHours`: number (optional) - Total running hours
- `hasAutoTransfer`: boolean (optional) - Automatic transfer switch installed

**Electrical Panel (Optional):**
- `panelAmperage`: enum - Service amperage rating
  - Options: `100`, `200`, `400`
- `panelAge`: number (optional) - Panel age in years

**Data Structure:**
```typescript
interface ElectricalSystems {
  powerSource: 'grid' | 'generator-primary' | 'hybrid' | 'solar';

  // Generator details (optional)
  hasGenerator?: boolean;
  generatorType?: 'portable' | 'standby';
  generatorFuel?: 'diesel' | 'propane' | 'natural-gas' | 'gasoline';
  generatorBrand?: string;
  generatorHours?: number;
  hasAutoTransfer?: boolean;

  // Electrical panel (optional)
  panelAmperage?: '100' | '200' | '400';
  panelAge?: number;
}
```

**Maintenance Implications:**
- Generator: Monthly exercise runs, oil changes every 100 hours or annually
- Generator: Fuel stabilizer for gasoline units
- Track generator hours for maintenance scheduling

---

### 6. Additional Systems (AdditionalSystemsStep.tsx)

**Appliances to Track (Optional):**
- `appliances`: string[] - Array of appliance IDs to monitor
  - Options: `refrigerator`, `freezer`, `washer`, `dryer`, `dishwasher`, `range`

**Specialized Systems (Optional):**
- `specializedSystems`: string[] - Array of specialized system IDs
  - Options: `heated-garage`, `heated-driveway`, `sump-pump`,
             `humidifier`, `smart-thermostat`

**Fuel Storage (Optional):**
- `fuelStorage`: string[] - Array of fuel storage types
  - Options: `propane-tank`, `fuel-oil-tank`, `diesel-storage`, `wood-storage`

**Data Structure:**
```typescript
interface AdditionalSystems {
  appliances?: ('refrigerator' | 'freezer' | 'washer' | 'dryer' |
                'dishwasher' | 'range')[];

  specializedSystems?: ('heated-garage' | 'heated-driveway' | 'sump-pump' |
                        'humidifier' | 'smart-thermostat')[];

  fuelStorage?: ('propane-tank' | 'fuel-oil-tank' | 'diesel-storage' |
                 'wood-storage')[];
}
```

**Maintenance Implications:**
- Appliances: Track warranties, service schedules
- Sump pump: Test quarterly
- Humidifier: Clean/replace filter monthly during use

---

### 7. User Preferences (PreferencesStep.tsx)

**Reminder Methods:**
- `reminderMethods`: string[] - How user wants to receive notifications
  - Options: `email`, `in-app`, `weekly-digest`, `monthly-summary`

**Reminder Timing:**
- `reminderTiming`: enum - How far in advance to send reminders
  - Options: `1-week`, `2-weeks`, `1-month`, `no-reminders`

**Seasonal Checklists:**
- `autoGenerateChecklists`: boolean - Auto-create seasonal task lists

**DIY Level:**
- `diyLevel`: enum - User's maintenance approach
  - Options: `all-diy`, `basic-diy`, `hire-most`, `learning`

**Service Providers:**
- `interestedInProviders`: boolean - Connect with local professionals
- `providerTypes`: string[] - Types of services needed
  - Options: `hvac`, `plumber`, `electrician`, `septic`,
             `fuel-delivery`, `general`

**Data Structure:**
```typescript
interface UserPreferences {
  reminderMethods?: ('email' | 'in-app' | 'weekly-digest' | 'monthly-summary')[];
  reminderTiming?: '1-week' | '2-weeks' | '1-month' | 'no-reminders';
  autoGenerateChecklists?: boolean;
  diyLevel?: 'all-diy' | 'basic-diy' | 'hire-most' | 'learning';
  interestedInProviders?: boolean;
  providerTypes?: ('hvac' | 'plumber' | 'electrician' | 'septic' |
                   'fuel-delivery' | 'general')[];
}
```

---

## Combined Complete Data Model

```typescript
interface CompleteHomeConfiguration {
  // Step 1: Home Basics
  homeName: string;
  homeType: 'modular' | 'stick-built' | 'log' | 'mobile' | 'other';
  community: string;
  territory: 'NWT' | 'Nunavut' | 'Yukon' | 'Other';
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;

  // Step 2: Heating Systems
  primaryHeating: string;
  heatingAge?: number;
  heatingBrand?: string;
  secondaryHeating?: string[];
  hasHRV?: boolean;
  hrvBrand?: string;
  hrvAge?: number;
  hasHeatTrace?: boolean;
  heatTraceLocations?: string[];

  // Step 3: Water Systems
  waterSource: string;
  tankCapacity?: number;
  refillFrequency?: string;
  refillCost?: number;
  enableWaterReminders?: boolean;
  pumpType?: string;
  wellDepth?: number;
  hotWaterSystem: string;
  tankSize?: number;
  tankFuel?: string;
  tankAge?: number;
  hasTreatment?: boolean;
  treatmentSystems?: string[];

  // Step 4: Sewage Systems
  sewageSystem: string;
  septicTankSize?: number;
  septicLastPumped?: string;
  septicFrequency?: string;
  septicCost?: number;
  holdingTankSize?: number;
  holdingTankFrequency?: string;
  holdingTankCost?: number;

  // Step 5: Electrical Systems
  powerSource: string;
  hasGenerator?: boolean;
  generatorType?: string;
  generatorFuel?: string;
  generatorBrand?: string;
  generatorHours?: number;
  hasAutoTransfer?: boolean;
  panelAmperage?: string;
  panelAge?: number;

  // Step 6: Additional Systems
  appliances?: string[];
  specializedSystems?: string[];
  fuelStorage?: string[];

  // Step 7: User Preferences
  reminderMethods?: string[];
  reminderTiming?: string;
  autoGenerateChecklists?: boolean;
  diyLevel?: string;
  interestedInProviders?: boolean;
  providerTypes?: string[];
}
```

---

## Maintenance Schedule Generation Rules

Based on the onboarding data, the system should auto-generate maintenance tasks:

### Heating Systems
- **Oil Furnace**: Annual inspection, filter change every 3 months
- **Propane Furnace**: Annual inspection, filter change every 3 months
- **Wood Stove**: Chimney cleaning annually (before heating season)
- **Pellet Stove**: Comprehensive cleaning quarterly
- **HRV**: Filter change every 3 months
- **Heat Trace**: Inspection before winter (September), after winter (May)

### Water Systems
- **Trucked Water**: Refill reminders based on frequency
- **Well Pump**: Annual inspection
- **Hot Water Tank**: Flush annually, anode rod check every 3 years
- **UV Sterilizer**: Bulb replacement annually
- **Water Softener**: Salt refill monthly, resin cleaning annually
- **Filters**: Replacement every 3-12 months (system-specific)

### Sewage Systems
- **Septic Tank**: Pump-out based on frequency (1-3 years)
- **Holding Tank**: Pump-out based on frequency (weekly to monthly)

### Electrical Systems
- **Generator**: Exercise run monthly (15 minutes), oil change every 100 hours or annually
- **Generator**: Fuel stabilizer check (gasoline units)

### Seasonal Tasks
- **Spring**: HRV cleaning, furnace filter, check heat trace
- **Summer**: Generator maintenance, AC filters
- **Fall**: Furnace inspection, heat trace activation, check heating fuel levels
- **Winter**: Monitor heating systems, check generator operation

---

## Dashboard Widget Data Requirements

### Maintenance Summary Widget
**Data Needed:**
- All active maintenance tasks from auto-generation
- Overdue tasks count
- Due soon tasks (within reminder period)
- Upcoming tasks (next 30 days)
- Task completion status

**API Endpoint:** `GET /api/v1/homes/:homeId/tasks`

### Weather Widget
**Data Needed:**
- Current temperature for home location (from `community` + `territory`)
- Weather conditions
- Wind speed and direction
- Humidity
- Weather alerts
- System-specific recommendations based on temperature

**API Endpoint:** `GET /api/v1/weather/current?location={community},{territory}`

### System Status Widget
**Data Needed:**
- List of all configured systems from onboarding
- Last service date for each system
- Health score calculation:
  - Green (90-100): All tasks on schedule
  - Yellow (70-89): 1-2 overdue tasks
  - Red (<70): 3+ overdue tasks or critical maintenance overdue
- Upcoming maintenance for each system

**API Endpoint:** `GET /api/v1/homes/:homeId/systems`

### Seasonal Checklist Widget
**Data Needed:**
- Current season based on date
- System-specific checklist items
- Completion status
- Progress percentage

**API Endpoint:** `GET /api/v1/homes/:homeId/checklists/seasonal`

---

## Database Design Implications

### Tables Required:
1. **homes** - Store home basic information
2. **systems** - Store all systems configured for each home (heating, water, electrical, etc.)
3. **maintenance_tasks** - Auto-generated and manual tasks
4. **maintenance_logs** - Historical record of completed maintenance
5. **seasonal_checklists** - Generated seasonal task lists
6. **user_preferences** - Notification and preference settings
7. **weather_cache** - Cache weather API responses

### Relationships:
- `homes` → one-to-many → `systems`
- `homes` → one-to-many → `maintenance_tasks`
- `systems` → one-to-many → `maintenance_tasks`
- `homes` → one-to-many → `maintenance_logs`
- `maintenance_tasks` → one-to-one (optional) → `maintenance_logs`
- `homes` → one-to-many → `seasonal_checklists`

---

## Next Steps

1. ✅ **Complete**: Document onboarding data structure
2. **Next**: Design database schema with proper relationships
3. **Then**: Define API endpoints for CRUD operations
4. **Then**: Implement backend with task auto-generation logic
5. **Then**: Replace frontend mock data with real API calls
6. **Finally**: Test and deploy production-ready system
