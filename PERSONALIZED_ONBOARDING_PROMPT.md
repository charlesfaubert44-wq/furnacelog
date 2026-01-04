# Interactive Personalized Home Setup Questionnaire - Implementation Prompt

## Project Context
FurnaceLog is a home maintenance tracking platform for northern Canada homeowners. We need to create an interactive onboarding questionnaire that personalizes the user experience based on their specific home configuration.

## Core Objective
Build a multi-step, intelligent questionnaire that:
1. Triggers automatically on first successful login
2. Can be re-accessed anytime from the user dashboard
3. Collects detailed home configuration data
4. Dynamically adapts questions based on previous answers
5. Personalizes the dashboard and feature visibility based on responses
6. Makes maintenance recommendations specific to their setup

## User Flow

### Trigger Points
- **Primary**: Immediately after first successful login (redirect to questionnaire)
- **Secondary**: "Setup Wizard" or "Configure Home" button in user dashboard
- **Indicator**: Show progress indicator if questionnaire is incomplete

### Overall Experience
- Multi-step wizard format (6-8 steps)
- Progress bar showing completion percentage
- Ability to skip and complete later
- Save progress at each step
- Review summary before final submission
- Option to edit answers after completion

---

## Questionnaire Structure & Questions

### Step 1: Welcome & Home Basics
**Purpose**: Set context and gather fundamental information

**Questions**:
1. **Home Name/Nickname** (text input)
   - "Let's give your home a name (e.g., 'Main House', 'Cabin on the Lake')"
   - Optional: Helps when managing multiple properties

2. **Home Type** (single select with icons)
   - Options:
     - Modular home
     - Stick-built
     - Log home
     - Mobile home
     - Other
   - **Conditional**: If "Modular" → show modular-specific fields (manufacturer, model, sections, CSA cert)

3. **Location** (address fields)
   - Community/Town (autocomplete with northern communities)
   - Territory (NWT, Nunavut, Yukon, Other)
   - Postal code
   - **Smart feature**: Auto-populate lat/long for weather data

4. **Year Built** (number input, 1800-2026)

5. **Home Size**
   - Square footage (optional)
   - Number of bedrooms
   - Number of bathrooms
   - Number of stories

6. **Foundation Type** (single select with illustrations)
   - Piles/Stilts (common in permafrost)
   - Crawlspace
   - Full basement
   - Slab on grade
   - **Info icon**: Explain why this matters for northern homes

---

### Step 2: Heating Systems
**Purpose**: Critical for northern homes - determines major maintenance tasks

**Questions**:
1. **Primary Heating System** (single select with detailed descriptions)
   - Oil furnace
   - Propane furnace
   - Natural gas furnace
   - Electric baseboard/furnace
   - Wood stove (primary)
   - Pellet stove
   - Boiler system (hydronic/radiant)
   - Heat pump
   - Other/Multiple systems

   **For each type, show**:
   - Icon/illustration
   - Typical maintenance needs preview
   - "Learn more" expandable section

2. **Secondary/Backup Heating** (multi-select)
   - None
   - Wood stove
   - Pellet stove
   - Electric space heaters
   - Propane heaters
   - Generator-powered
   - Other

3. **Heating System Details** (conditional based on primary selection)

   **If Furnace (Oil/Propane/Gas)**:
   - Brand/Manufacturer (text or dropdown)
   - Age of furnace (years or install date)
   - Last service date (optional)
   - Do you have a service contract? (yes/no)

   **If Boiler System**:
   - In-floor radiant heating? (yes/no)
   - Baseboard radiators? (yes/no)
   - Number of zones

   **If Wood/Pellet Stove**:
   - Number of stoves
   - Primary brand/model
   - Chimney/flue type

4. **Heat Recovery Ventilator (HRV)** (yes/no + details)
   - Do you have an HRV system?
   - If yes: Brand, age, filter change frequency preference

5. **Heat Trace/Heat Cables** (yes/no + locations)
   - Do you have heat trace installed?
   - If yes (multi-select):
     - Water lines
     - Sewage lines
     - Roof/gutters
     - Entrance ways
     - Other

---

### Step 3: Water Systems
**Purpose**: Determines plumbing maintenance and monitoring needs

**Questions**:
1. **Water Source** (single select with northern context)
   - Municipal water (piped)
   - Private well
   - Trucked water (with holding tank)
   - Combination (well + trucked backup)

2. **Water Storage** (conditional on source)

   **If Trucked Water**:
   - Tank capacity (gallons/liters)
   - Typical refill frequency
   - Current average cost per fill
   - Enable low-level reminders? (yes/no)

   **If Well**:
   - Pump type (submersible, jet, etc.)
   - Well depth (if known)
   - Water treatment system? (yes/no → details)

3. **Hot Water System** (single select - CRITICAL for feature visibility)
   - Hot water tank (traditional storage)
   - Tankless/On-demand water heater
   - Integrated with boiler system
   - None/Other

   **If Hot Water Tank**:
   - Tank size (gallons)
   - Fuel type (electric, gas, oil)
   - Age of tank (years)
   - Anode rod last replaced? (date or never)

   **If Tankless**:
   - Brand/model
   - Fuel type
   - Age

4. **Water Quality/Treatment**
   - Do you have any of these? (multi-select)
     - Water softener
     - UV sterilizer
     - Reverse osmosis system
     - Whole-house filter
     - Sediment filter
     - None

---

### Step 4: Sewage & Waste Systems
**Purpose**: Maintenance scheduling for waste management

**Questions**:
1. **Sewage System** (single select)
   - Municipal sewer
   - Septic tank/field
   - Holding tank (pump-out required)
   - Combination system
   - Other

2. **Septic System Details** (if applicable)
   - Tank size (gallons)
   - Last pumped/cleaned (date)
   - Typical pump-out frequency (years)
   - Cost per pump-out (optional, for budgeting)
   - Field type (conventional, mound, etc.)

3. **Holding Tank Details** (if applicable)
   - Tank capacity
   - Average pump-out frequency (weekly, bi-weekly, monthly)
   - Cost per pump-out
   - Set up automatic reminders based on usage? (yes/no)

---

### Step 5: Electrical & Power
**Purpose**: Generator and power system maintenance

**Questions**:
1. **Primary Power Source** (single select)
   - Grid connected (utility power)
   - Generator (primary)
   - Hybrid (grid + generator)
   - Solar + battery
   - Other

2. **Backup Generator** (yes/no + details)
   - Do you have a backup generator?

   **If Yes**:
   - Type: Portable or Standby/Fixed
   - Fuel type: Diesel, propane, natural gas, gasoline
   - Brand/model
   - Automatic transfer switch? (yes/no)
   - Hours on generator (if known)
   - Last service date

3. **Electrical Panel**
   - Panel age/upgrade date (optional)
   - Amperage service (100A, 200A, etc.)
   - Number of circuits (optional)

---

### Step 6: Additional Systems & Features
**Purpose**: Capture specialized northern systems and custom components

**Questions**:
1. **Specialized Northern Systems** (multi-select)
   - Diesel-fired heater (Espar/Webasto)
   - Block heater outlets
   - Heated garage
   - Heated driveway/walkways
   - Remote monitoring system
   - Smart thermostat(s)
   - Automatic fire suppression
   - Sump pump(s)
   - Battery backup system
   - None of the above

2. **Fuel Storage** (multi-select)
   - Propane tank(s) - size and location
   - Fuel oil tank - above/below ground, size
   - Diesel storage
   - Wood storage/shed
   - Pellet storage
   - None applicable

3. **Appliances to Track** (multi-select - for warranty/maintenance)
   - Refrigerator(s)
   - Freezer (chest/upright)
   - Washer/Dryer
   - Dishwasher
   - Range/Oven
   - Microwave
   - Humidifier/Dehumidifier
   - Air purifier
   - I'll add these later

4. **Ventilation Systems**
   - Kitchen exhaust fan
   - Bathroom exhaust fans (how many?)
   - Whole-house ventilation (beyond HRV)
   - Attic ventilation type

---

### Step 7: Maintenance Preferences
**Purpose**: Tailor notification and scheduling preferences

**Questions**:
1. **Preferred Reminder Method** (multi-select)
   - Email notifications
   - In-app notifications
   - SMS/text (future feature)
   - Weekly digest summary
   - Monthly summary only

2. **Reminder Timing** (single select)
   - Remind me 1 week before tasks are due
   - Remind me 2 weeks before
   - Remind me 1 month before
   - I'll check manually (no automatic reminders)

3. **Seasonal Checklist Preferences**
   - Auto-generate seasonal checklists? (yes/no)
   - Which seasons apply to your region? (pre-select based on territory)
     - Freeze-up (fall preparation)
     - Winter maintenance
     - Break-up (spring thaw)
     - Summer maintenance

4. **Service Provider Preferences**
   - Are you looking to connect with local service providers? (yes/no)
   - Types of services needed (multi-select):
     - Furnace/HVAC technicians
     - Plumbers
     - Electricians
     - Septic/tank pump-out
     - Fuel delivery
     - Snow removal
     - General handyman
     - Other

5. **Maintenance DIY Level** (single select - helps with recommendations)
   - I do all maintenance myself
   - I do basic maintenance, hire for complex work
   - I hire professionals for most maintenance
   - I'm learning and want guidance

---

### Step 8: Review & Confirmation
**Purpose**: Let user review all answers before submission

**Display**:
- Collapsible sections showing all answers by category
- "Edit" button next to each section
- Clear summary of what will be personalized:
  - "Your dashboard will show: [list of systems]"
  - "You won't see options for: [list of excluded features]"
  - "You'll receive reminders for: [list of maintenance types]"

**Actions**:
- "Complete Setup" (primary button)
- "Save and finish later" (secondary)
- "Start over" (tertiary/link)

**After submission**:
- Success message: "Your home profile is complete!"
- Show generated maintenance calendar preview
- "Go to Dashboard" button
- Optional: "Would you like to add another property?"

---

## Technical Implementation Requirements

### Frontend Components

1. **WizardContainer Component**
   ```jsx
   Features needed:
   - Step navigation (next, back, skip)
   - Progress bar
   - Auto-save on step change
   - Responsive design
   - Smooth transitions between steps
   - Validation before proceeding
   ```

2. **Dynamic Form Fields**
   - Conditional rendering based on previous answers
   - Smart defaults based on territory/location
   - Field validation (required, format, ranges)
   - Help text and tooltips
   - Icons/illustrations for visual appeal

3. **Review Component**
   - Accordion/collapsible sections
   - Edit functionality returning to specific step
   - Summary generation

### Backend Requirements

1. **Data Model Extensions**
   ```javascript
   // Add to User model or create separate OnboardingProgress model
   {
     onboardingCompleted: Boolean,
     onboardingProgress: {
       currentStep: Number,
       completedSteps: [Number],
       lastSaved: Date
     }
   }
   ```

2. **API Endpoints**
   ```
   POST   /api/v1/onboarding/start
   PATCH  /api/v1/onboarding/step/:stepNumber
   GET    /api/v1/onboarding/progress
   POST   /api/v1/onboarding/complete
   GET    /api/v1/onboarding/summary
   ```

3. **System Generation**
   - Auto-create System and Component records based on selections
   - Generate initial maintenance schedule
   - Create seasonal checklists
   - Set up reminder preferences

### Personalization Logic

1. **Dashboard Customization**
   ```javascript
   // Hide/show features based on questionnaire
   {
     hasHotWaterTank: false → Hide "Hot Water Tank" maintenance section
     hasGenerator: true → Show "Generator Maintenance" card
     heatingType: "wood-stove" → Prioritize chimney cleaning reminders
     waterSource: "trucked" → Show water level monitoring
   }
   ```

2. **Maintenance Task Filtering**
   - Filter task library to show only relevant tasks
   - Pre-populate scheduled maintenance based on systems
   - Adjust frequency recommendations for climate/territory

3. **Smart Defaults**
   ```javascript
   // Example logic
   if (territory === "Nunavut" && heatingType === "oil-furnace") {
     // Set furnace filter change to every 30 days (vs 90 for south)
     // Add fuel level monitoring
     // Include freeze-up checklist items
   }
   ```

---

## UX/UI Design Guidelines

### Visual Design
- **Theme**: Align with "Industrial Reliability" design system
- **Colors**: Use existing palette (Graphite, Steel Gray, System Green, Heat Orange)
- **Icons**: Use clear, simple icons for each home system type
- **Illustrations**: Optional step headers with home diagrams

### Accessibility
- Keyboard navigation throughout wizard
- Screen reader friendly labels
- High contrast mode support
- Large touch targets for mobile

### Mobile Responsiveness
- Single column layout on mobile
- Sticky progress bar
- Bottom sheet for long option lists
- Save progress prominent on mobile

### Micro-interactions
- Smooth step transitions (slide/fade)
- Checkmarks on completed steps
- Confetti or success animation on completion
- Progress bar fills with animation

---

## Data Usage Examples

### Example 1: Oil Furnace Home in NWT
**User selections**:
- Territory: NWT
- Primary heat: Oil furnace
- HRV: Yes
- Water: Trucked (500 gallon tank)
- Sewage: Holding tank

**System generates**:
- Monthly furnace filter change reminders
- Annual furnace service reminder (August, before freeze-up)
- Quarterly HRV filter changes
- Weekly water level monitoring prompt
- Bi-weekly holding tank monitoring
- Freeze-up checklist (September)
- Oil tank level tracking
- Heat trace activation reminder (October)

### Example 2: Modern Modular with Municipal Services
**User selections**:
- Territory: Yellowknife
- Type: Modular home
- Primary heat: Natural gas furnace
- Water: Municipal + hot water tank
- Sewage: Municipal
- Generator: Yes (standby)

**System generates**:
- Quarterly furnace filter changes
- Annual furnace inspection
- Hot water tank maintenance (anode rod, sediment flush)
- Monthly generator exercise reminder
- Seasonal generator service
- Municipal system user (skip tank monitoring)
- Simplified dashboard (fewer critical systems)

---

## Success Metrics

### Completion Tracking
- % of users who complete questionnaire on first login
- Average time to complete
- Most commonly skipped questions
- Step with highest drop-off rate

### Personalization Impact
- Engagement with dashboard widgets vs. non-personalized users
- Maintenance task completion rate
- Feature usage correlation with questionnaire answers
- User satisfaction scores

---

## Future Enhancements

1. **AI-Powered Suggestions**
   - Recommend maintenance based on similar homes in region
   - Predict seasonal issues based on weather + home config
   - Suggest upgrades based on age/efficiency

2. **Visual Home Builder**
   - Interactive home diagram
   - Click to add systems/components
   - Visual representation of home layout

3. **Import from Photos**
   - Upload furnace nameplate → auto-fill make/model/serial
   - Photo of fuel tank → estimate size
   - Use AI to extract data from images

4. **Community Insights**
   - "X% of Yellowknife homes have HRVs"
   - Average maintenance costs in your community
   - Popular service providers in your area

5. **Multi-Property Management**
   - Quick clone settings from primary home
   - Comparison view across properties
   - Aggregate maintenance calendar

---

## Development Approach

### Phase 1: MVP (Core Wizard)
- Steps 1-4 (Home basics, heating, water, sewage)
- Basic conditional logic
- Save progress functionality
- Auto-generate core systems

### Phase 2: Enhanced Personalization
- Steps 5-7 (Power, additional systems, preferences)
- Advanced dashboard customization
- Maintenance task filtering
- Seasonal checklist generation

### Phase 3: Polish & Intelligence
- Review/edit functionality
- Smart recommendations
- Visual enhancements
- Analytics and optimization

---

## Technical Stack Recommendations

**Frontend**:
- React Hook Form for wizard state management
- Zod for validation schema
- Framer Motion for transitions
- React Query for API integration
- Tailwind for responsive layout

**Backend**:
- Transaction support for multi-step data creation
- Validation middleware for each step
- Background job for system generation (BullMQ)
- Caching for frequently accessed data

---

## Testing Strategy

### Unit Tests
- Form validation logic
- Conditional field rendering
- Data transformation functions

### Integration Tests
- Complete wizard flow
- API endpoint responses
- System generation accuracy

### E2E Tests
- Full onboarding journey
- Dashboard personalization verification
- Edit/update flows

### User Testing
- Northern homeowner beta group
- Time-to-complete benchmarks
- Question clarity feedback
- Feature discovery rates

---

## Implementation Checklist

**Planning**:
- [ ] Review and refine question set with stakeholders
- [ ] Create wireframes/mockups for each step
- [ ] Define data model changes needed
- [ ] Map questionnaire answers to system generation logic

**Development**:
- [ ] Build wizard framework and navigation
- [ ] Implement steps 1-4 (MVP)
- [ ] Create conditional logic system
- [ ] Build API endpoints
- [ ] Implement auto-save functionality
- [ ] Create system generation service
- [ ] Build review/summary component
- [ ] Implement steps 5-7 (enhanced)
- [ ] Add dashboard personalization logic
- [ ] Build edit/update flows

**Testing**:
- [ ] Unit tests for all components
- [ ] Integration tests for wizard flow
- [ ] E2E tests for complete journey
- [ ] User acceptance testing
- [ ] Performance testing (load time, auto-save)

**Launch**:
- [ ] Feature flag for gradual rollout
- [ ] Monitor completion rates
- [ ] Gather user feedback
- [ ] Iterate based on analytics

---

## Example User Stories

**As a first-time user**, I want to quickly set up my home profile so that I see relevant maintenance tasks without manual configuration.

**As a homeowner with trucked water**, I want to specify my tank size so the app can remind me before I run out of water.

**As someone without a hot water tank**, I don't want to see hot water tank maintenance options cluttering my dashboard.

**As a user managing multiple properties**, I want to complete the questionnaire for each home separately so each property has accurate tracking.

**As a returning user**, I want to update my home configuration if I install new systems without starting from scratch.

---

## Design Inspiration & References

- Onboarding wizards: Notion setup, Slack workspace config
- Home questionnaires: Insurance quote forms, HVAC sizing tools
- Northern context: CMHC northern housing resources
- Visual style: Industrial/mechanical aesthetic, blueprint feel

---

**End of Prompt**

This comprehensive guide should provide all necessary context, requirements, and implementation details for creating an exceptional personalized onboarding experience for FurnaceLog users.
