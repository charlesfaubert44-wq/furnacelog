# Dashboard Rehaul - Complete Functional System

## Objective
Transform the FurnaceLog dashboard from placeholder/mock data to a fully functional, production-ready system that dynamically displays real user data based on their onboarding wizard selections.

## Phase 1: Analyze Onboarding Data Structure

### Read and Document All Onboarding Steps

1. **HomeBasicsStep.tsx** - What home information do we collect?
   - Home type (modular, stick-built, etc.)
   - Location/community
   - Square footage
   - Year built
   - Other basic details

2. **HeatingSystemsStep.tsx** - What heating systems can users configure?
   - Primary heating (propane furnace, oil boiler, electric, wood stove, etc.)
   - Secondary heating systems
   - Heat trace cables
   - HRV/ERV systems
   - Backup heating

3. **WaterSystemsStep.tsx** - What water systems are tracked?
   - Water source (municipal, well, trucked, etc.)
   - Water treatment
   - Hot water heater type
   - Holding tanks
   - Pumps

4. **SewageSystemsStep.tsx** - What sewage options exist?
   - Septic system
   - Holding tank
   - Municipal sewer
   - Composting toilet

5. **ElectricalSystemsStep.tsx** - What electrical systems?
   - Grid power
   - Generator
   - Solar panels
   - Battery backup

6. **AdditionalSystemsStep.tsx** - What other systems?
   - Ventilation
   - Insulation
   - Foundation type
   - Skirting

7. **PreferencesStep.tsx** - What user preferences?
   - Notification settings
   - Maintenance schedule preferences
   - Temperature units
   - Language

8. **ReviewStep.tsx** - Final review and submission

### Identify Data Model
- Determine the complete data structure for a "Home" entity
- Identify all system types and their properties
- Map maintenance requirements for each system type
- Define maintenance schedules and frequencies

## Phase 2: Backend API Requirements

### Required API Endpoints

1. **Home Management**
   - `POST /api/v1/homes` - Create new home from onboarding data
   - `GET /api/v1/homes` - Get user's homes list
   - `GET /api/v1/homes/:id` - Get specific home details
   - `PATCH /api/v1/homes/:id` - Update home details
   - `DELETE /api/v1/homes/:id` - Delete home

2. **Systems Management**
   - `GET /api/v1/homes/:homeId/systems` - Get all systems for a home
   - `POST /api/v1/homes/:homeId/systems` - Add new system
   - `PATCH /api/v1/systems/:id` - Update system details
   - `DELETE /api/v1/systems/:id` - Remove system

3. **Maintenance Tasks**
   - `GET /api/v1/homes/:homeId/tasks` - Get maintenance tasks
   - `POST /api/v1/tasks` - Create manual maintenance task
   - `PATCH /api/v1/tasks/:id` - Update task (mark complete, reschedule, etc.)
   - `DELETE /api/v1/tasks/:id` - Delete task
   - `POST /api/v1/tasks/:id/log` - Log maintenance completion

4. **Maintenance Logs**
   - `GET /api/v1/homes/:homeId/logs` - Get maintenance history
   - `POST /api/v1/logs` - Create maintenance log entry
   - `GET /api/v1/logs/:id` - Get specific log details
   - `PATCH /api/v1/logs/:id` - Update log entry
   - `DELETE /api/v1/logs/:id` - Delete log entry

5. **Weather Integration**
   - `GET /api/v1/weather/current?location=:location` - Get current weather
   - `GET /api/v1/weather/forecast?location=:location` - Get forecast
   - `GET /api/v1/weather/alerts?location=:location` - Get weather alerts

6. **Seasonal Checklists**
   - `GET /api/v1/homes/:homeId/checklists/seasonal` - Get seasonal tasks
   - `POST /api/v1/checklists/:id/items/:itemId/complete` - Mark item complete

## Phase 3: Dashboard Widget Overhaul

### 1. Maintenance Summary Widget
**Current Issues:**
- Uses `mockTasks` array with hardcoded data
- Tasks don't relate to user's actual systems
- No real task management

**Required Functionality:**
- Fetch real maintenance tasks from `/api/v1/homes/:homeId/tasks`
- Auto-generate tasks based on user's configured systems
- Display overdue, due soon, and upcoming tasks
- Click task to view details
- Mark tasks as complete
- Reschedule tasks
- Filter tasks by system type
- Sort by priority/date

**Data Flow:**
```
User's Systems → Auto-generated Maintenance Schedule → Active Tasks → Dashboard Display
```

### 2. Weather Widget
**Current Issues:**
- Uses hardcoded temperature data (`currentTemp = -18`)
- No real location integration
- Mock weather alerts

**Required Functionality:**
- Fetch real weather from user's home location
- Display current temperature, feels like, wind, humidity
- Show weather alerts relevant to home systems
- Auto-generate maintenance recommendations based on weather
  - Example: "Temperature below -30°C - Check heat trace cables"
  - Example: "Extreme cold warning - Monitor furnace operation"
- Update weather automatically (polling or WebSocket)

**Data Flow:**
```
User's Home Location → Weather API → Current Conditions + Alerts → System-Specific Recommendations
```

### 3. System Status Widget
**Current Issues:**
- Uses `systems` array with hardcoded data
- Shows placeholder health scores
- No real system monitoring

**Required Functionality:**
- Display only systems user configured during onboarding
- Show last service date from maintenance logs
- Calculate health score based on:
  - Time since last maintenance
  - Number of overdue tasks
  - Logged issues/repairs
- Visual status indicators (healthy, warning, critical)
- Click system to view:
  - Full maintenance history
  - Upcoming tasks
  - System details
  - Add manual log entry

**Data Flow:**
```
User's Configured Systems → Maintenance Logs + Tasks → Health Calculation → Status Display
```

### 4. Seasonal Checklist Widget
**Current Issues:**
- Uses `winterChecklist` with hardcoded items
- Items don't relate to user's systems
- No seasonal adaptation

**Required Functionality:**
- Generate checklist based on:
  - Current season
  - User's configured systems
  - Local climate
- Items specific to user's home:
  - Example: If user has heat trace → "Inspect heat trace cables"
  - Example: If user has propane → "Check propane levels"
  - Example: If user has well water → "Check well pump operation"
- Track completion status
- Reset checklists seasonally
- Show progress percentage

**Data Flow:**
```
User's Systems + Current Season + Location → Generated Checklist → Completion Tracking → Progress Display
```

### 5. Quick Actions
**Current Issues:**
- All buttons are non-functional placeholders

**Required Functionality:**

**Add System Button:**
- Opens modal/form to add a new system to existing home
- Same system options as onboarding
- Updates home configuration

**Log Maintenance Button:**
- Opens form with:
  - Select system
  - Maintenance type
  - Date performed
  - Notes
  - Upload photos/documents
  - Cost (optional)
- Creates maintenance log entry
- Updates "last service" dates
- Completes related tasks if applicable

**Schedule Task Button:**
- Create manual maintenance task
- Select system
- Task description
- Due date
- Recurring (yes/no)
- Priority level

**Upload Document Button:**
- Upload photos, manuals, receipts
- Associate with system or maintenance log
- File storage integration (MinIO/S3)

**Find Provider Button:**
- Search for local service providers
- Filter by service type
- View ratings/reviews (future feature)
- Save preferred providers

## Phase 4: Data Models & Database Schema

### Homes Collection/Table
```typescript
interface Home {
  id: string;
  userId: string;
  name: string; // "My Home", "Cabin", etc.
  type: 'modular' | 'stick-built' | 'manufactured' | 'other';
  location: {
    community: string;
    territory: 'NWT' | 'Nunavut' | 'Yukon';
    coordinates?: { lat: number; lng: number };
  };
  details: {
    squareFootage?: number;
    yearBuilt?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Systems Collection/Table
```typescript
interface System {
  id: string;
  homeId: string;
  category: 'heating' | 'water' | 'sewage' | 'electrical' | 'ventilation' | 'other';
  type: string; // 'propane_furnace', 'well_water', etc.
  name: string; // User-friendly name
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: Date;
  warrantyExpiry?: Date;
  maintenanceSchedule: {
    taskType: string;
    frequency: number; // in days
    lastCompleted?: Date;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### MaintenanceTasks Collection/Table
```typescript
interface MaintenanceTask {
  id: string;
  homeId: string;
  systemId?: string; // null for home-wide tasks
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'overdue' | 'completed' | 'skipped';
  recurring: boolean;
  recurrenceInterval?: number; // in days
  autoGenerated: boolean; // true if created by system
  completedAt?: Date;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### MaintenanceLogs Collection/Table
```typescript
interface MaintenanceLog {
  id: string;
  homeId: string;
  systemId?: string;
  taskId?: string; // if completing a scheduled task
  type: 'routine' | 'repair' | 'inspection' | 'installation' | 'other';
  title: string;
  description: string;
  performedDate: Date;
  performedBy?: string; // "Self", "Contractor Name", etc.
  cost?: number;
  photos?: string[]; // URLs to stored files
  documents?: string[]; // URLs to PDFs, manuals, etc.
  nextServiceDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### SeasonalChecklists Collection/Table
```typescript
interface SeasonalChecklist {
  id: string;
  homeId: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  year: number;
  items: {
    id: string;
    systemId?: string;
    title: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
    priority: 'low' | 'medium' | 'high';
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Phase 5: Implementation Steps

### Step 1: Backend Implementation
1. Create database migrations for all tables
2. Implement all API endpoints
3. Add data validation and error handling
4. Write unit tests for each endpoint
5. Implement auto-task generation logic
6. Integrate weather API (OpenWeatherMap, Weather.gc.ca, etc.)

### Step 2: Frontend Services
1. Create API service layer for all endpoints
2. Implement data fetching hooks
3. Add error handling and loading states
4. Create form validation schemas
5. Implement file upload functionality

### Step 3: Replace Dashboard Widgets
1. Update MaintenanceSummaryWidget to fetch real data
2. Update WeatherWidget with real weather API
3. Update SystemStatusWidget with user's systems
4. Update SeasonalChecklistWidget with generated items
5. Implement all Quick Actions functionality

### Step 4: Add Missing Features
1. System detail modals
2. Task management modals
3. Maintenance log forms
4. Document upload interface
5. Task filtering and sorting
6. Search functionality

### Step 5: Auto-Generation Logic
Implement smart task generation:
- When user completes onboarding → Generate initial tasks for all systems
- When user adds a system → Generate tasks for that system
- When task is completed → Create next occurrence if recurring
- When season changes → Generate seasonal checklist
- When weather alert → Create weather-related recommendations

### Step 6: Testing
1. Test all CRUD operations
2. Test task auto-generation
3. Test seasonal checklist generation
4. Test weather integration
5. Test file uploads
6. End-to-end user flows

## Phase 6: Production Readiness Checklist

### Functionality
- [ ] All buttons perform their intended actions
- [ ] All data is real, no mock/placeholder data
- [ ] All forms validate and submit correctly
- [ ] All API endpoints return proper responses
- [ ] Error states handled gracefully
- [ ] Loading states shown appropriately

### Data Integrity
- [ ] User data persists correctly
- [ ] Relationships between entities maintained
- [ ] Data validation on both frontend and backend
- [ ] Duplicate prevention mechanisms

### Performance
- [ ] API responses under 500ms
- [ ] Efficient database queries (indexes)
- [ ] Pagination for large data sets
- [ ] Image optimization
- [ ] Lazy loading where appropriate

### Security
- [ ] All endpoints require authentication
- [ ] Users can only access their own data
- [ ] Input sanitization
- [ ] File upload validation
- [ ] CSRF protection

### User Experience
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Success confirmations
- [ ] Responsive design
- [ ] Accessibility (ARIA labels, keyboard navigation)

## Expected Deliverables

1. **Complete Backend API** - All endpoints functional and tested
2. **Database Schema** - Migrations and seed data
3. **Functional Dashboard** - All widgets showing real data
4. **Working Forms** - All modals and forms operational
5. **Task Auto-Generation** - Smart task creation based on systems
6. **Weather Integration** - Real-time weather data
7. **File Upload System** - Photos and documents storage
8. **Seasonal Checklists** - Dynamic generation based on systems
9. **System Health Scores** - Calculated from real data
10. **Production Deployment** - Ready to launch

## Success Criteria

✅ **No Placeholder Data** - Everything comes from database
✅ **No Broken Buttons** - Every action performs a real operation
✅ **Dynamic Content** - Dashboard reflects user's actual configuration
✅ **Automatic Maintenance** - Tasks generated without manual intervention
✅ **Real-Time Updates** - Weather and alerts update automatically
✅ **Complete CRUD** - Users can create, read, update, delete all entities
✅ **Production Quality** - Error handling, validation, security
✅ **Scalable Architecture** - Can handle growing user base

## Timeline Estimate

- Phase 1 (Analysis): 2-3 hours
- Phase 2 (Backend): 8-10 hours
- Phase 3 (Dashboard): 6-8 hours
- Phase 4 (Data Models): 2-3 hours
- Phase 5 (Implementation): 12-15 hours
- Phase 6 (Testing): 4-6 hours

**Total: ~35-45 hours of development**

---

## Next Steps

1. Read all onboarding wizard files to extract complete data structure
2. Design final database schema
3. Implement backend API endpoints
4. Update frontend widgets with real data
5. Implement all button functionalities
6. Test thoroughly
7. Deploy to production

**Goal: Transform FurnaceLog from a prototype to a fully functional, production-ready home maintenance platform.**
