# Database Schema Design

Complete database schema for FurnaceLog home maintenance platform.

## Technology Stack
- **Database**: PostgreSQL 14+
- **ORM**: Prisma or TypeORM
- **Schema Management**: Database migrations

---

## Table of Contents
1. [Core Tables](#core-tables)
2. [TypeScript Interfaces](#typescript-interfaces)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Sample Queries](#sample-queries)

---

## Core Tables

### 1. users
Stores user account information (already exists from authentication system)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. homes
Stores basic home information from onboarding

```sql
CREATE TABLE homes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Basic Info (HomeBasicsStep)
  name VARCHAR(255) NOT NULL,
  home_type VARCHAR(50) NOT NULL CHECK (home_type IN ('modular', 'stick-built', 'log', 'mobile', 'other')),

  -- Location
  community VARCHAR(255) NOT NULL,
  territory VARCHAR(50) NOT NULL CHECK (territory IN ('NWT', 'Nunavut', 'Yukon', 'Other')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Additional Details
  year_built INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3, 1),

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT homes_user_id_idx UNIQUE (user_id, id)
);

CREATE INDEX idx_homes_user_id ON homes(user_id);
CREATE INDEX idx_homes_location ON homes(community, territory);
```

### 3. systems
Stores all home systems configured during onboarding

```sql
CREATE TABLE systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,

  -- System Classification
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'heating', 'water', 'sewage', 'electrical', 'appliance',
    'specialized', 'fuel-storage'
  )),
  system_type VARCHAR(100) NOT NULL,

  -- System Details
  name VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  serial_number VARCHAR(255),

  -- Age & Warranty
  install_date DATE,
  age_years INTEGER,
  warranty_expiry DATE,

  -- Configuration (JSON for flexible system-specific data)
  config JSONB DEFAULT '{}',

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_systems_home_id ON systems(home_id);
CREATE INDEX idx_systems_category ON systems(category);
CREATE INDEX idx_systems_config ON systems USING GIN (config);
```

**Example `config` JSONB structures:**

```json
// Heating system
{
  "fuel_type": "propane",
  "brand": "Lennox",
  "is_primary": true
}

// Heat trace
{
  "locations": ["water-lines", "sewage-lines"]
}

// Trucked water tank
{
  "capacity_gallons": 500,
  "refill_frequency": "biweekly",
  "refill_cost": 150.00,
  "enable_reminders": true
}

// Generator
{
  "generator_type": "standby",
  "fuel": "propane",
  "hours": 250,
  "has_auto_transfer": true
}
```

### 4. maintenance_tasks
Stores scheduled maintenance tasks (auto-generated and manual)

```sql
CREATE TABLE maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  system_id UUID REFERENCES systems(id) ON DELETE SET NULL,

  -- Task Details
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Scheduling
  due_date DATE NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'overdue', 'completed', 'skipped', 'cancelled')),

  -- Recurrence
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_interval_days INTEGER,
  recurrence_rule TEXT, -- Cron-like rule for complex recurrence

  -- Generation Info
  auto_generated BOOLEAN DEFAULT FALSE,
  generation_rule VARCHAR(255), -- e.g., "furnace-annual-inspection"

  -- Completion Info
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES users(id),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_home_id ON maintenance_tasks(home_id);
CREATE INDEX idx_tasks_system_id ON maintenance_tasks(system_id);
CREATE INDEX idx_tasks_due_date ON maintenance_tasks(due_date);
CREATE INDEX idx_tasks_status ON maintenance_tasks(status);
CREATE INDEX idx_tasks_overdue ON maintenance_tasks(due_date, status) WHERE status = 'pending';
```

### 5. maintenance_logs
Historical record of completed maintenance

```sql
CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  system_id UUID REFERENCES systems(id) ON DELETE SET NULL,
  task_id UUID REFERENCES maintenance_tasks(id) ON DELETE SET NULL,

  -- Log Details
  type VARCHAR(50) NOT NULL CHECK (type IN ('routine', 'repair', 'inspection', 'installation', 'emergency', 'other')),
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Performance Info
  performed_date DATE NOT NULL,
  performed_by VARCHAR(255), -- "Self", contractor name, etc.

  -- Cost Tracking
  cost_amount DECIMAL(10, 2),
  cost_currency VARCHAR(3) DEFAULT 'CAD',

  -- Attachments
  photos TEXT[], -- Array of S3/MinIO URLs
  documents TEXT[], -- Array of S3/MinIO URLs (receipts, manuals, etc.)

  -- Follow-up
  next_service_date DATE,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_home_id ON maintenance_logs(home_id);
CREATE INDEX idx_logs_system_id ON maintenance_logs(system_id);
CREATE INDEX idx_logs_task_id ON maintenance_logs(task_id);
CREATE INDEX idx_logs_performed_date ON maintenance_logs(performed_date DESC);
```

### 6. seasonal_checklists
Auto-generated seasonal maintenance checklists

```sql
CREATE TABLE seasonal_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,

  -- Season & Year
  season VARCHAR(20) NOT NULL CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
  year INTEGER NOT NULL,

  -- Progress
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,

  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_home_season_year UNIQUE (home_id, season, year)
);

CREATE INDEX idx_checklists_home_id ON seasonal_checklists(home_id);
CREATE INDEX idx_checklists_season_year ON seasonal_checklists(season, year);
```

### 7. checklist_items
Individual items within seasonal checklists

```sql
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES seasonal_checklists(id) ON DELETE CASCADE,
  system_id UUID REFERENCES systems(id) ON DELETE SET NULL,

  -- Item Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),

  -- Completion
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Order
  sort_order INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_system_id ON checklist_items(system_id);
```

### 8. user_preferences
User notification and preference settings

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Notification Preferences
  reminder_methods TEXT[] DEFAULT ARRAY['in-app'], -- ['email', 'in-app', 'weekly-digest', 'monthly-summary']
  reminder_timing VARCHAR(50) DEFAULT '1-week', -- '1-week', '2-weeks', '1-month', 'no-reminders'

  -- Feature Preferences
  auto_generate_checklists BOOLEAN DEFAULT TRUE,

  -- User Profile
  diy_level VARCHAR(50), -- 'all-diy', 'basic-diy', 'hire-most', 'learning'

  -- Service Provider Preferences
  interested_in_providers BOOLEAN DEFAULT FALSE,
  provider_types TEXT[], -- ['hvac', 'plumber', 'electrician', 'septic', 'fuel-delivery', 'general']

  -- Display Preferences
  temperature_unit VARCHAR(10) DEFAULT 'celsius', -- 'celsius' or 'fahrenheit'
  date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preferences_user_id ON user_preferences(user_id);
```

### 9. weather_cache
Cache weather API responses to reduce API calls

```sql
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Location
  location_key VARCHAR(255) UNIQUE NOT NULL, -- "community,territory"

  -- Weather Data (JSON)
  current_weather JSONB,
  forecast JSONB,
  alerts JSONB,

  -- Cache Control
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

  CONSTRAINT weather_cache_location_idx UNIQUE (location_key)
);

CREATE INDEX idx_weather_cache_expires ON weather_cache(expires_at);
```

**Example `current_weather` structure:**
```json
{
  "temperature": -18,
  "feels_like": -28,
  "conditions": "Clear",
  "wind_speed": 15,
  "wind_direction": "NW",
  "humidity": 65,
  "timestamp": "2024-01-04T12:00:00Z"
}
```

---

## TypeScript Interfaces

### Backend Models

```typescript
// Home model
export interface Home {
  id: string;
  userId: string;
  name: string;
  homeType: 'modular' | 'stick-built' | 'log' | 'mobile' | 'other';
  community: string;
  territory: 'NWT' | 'Nunavut' | 'Yukon' | 'Other';
  latitude?: number;
  longitude?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// System model
export interface System {
  id: string;
  homeId: string;
  category: 'heating' | 'water' | 'sewage' | 'electrical' | 'appliance' | 'specialized' | 'fuel-storage';
  systemType: string;
  name?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: Date;
  ageYears?: number;
  warrantyExpiry?: Date;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Maintenance Task model
export interface MaintenanceTask {
  id: string;
  homeId: string;
  systemId?: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'overdue' | 'completed' | 'skipped' | 'cancelled';
  isRecurring: boolean;
  recurrenceIntervalDays?: number;
  recurrenceRule?: string;
  autoGenerated: boolean;
  generationRule?: string;
  completedAt?: Date;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Maintenance Log model
export interface MaintenanceLog {
  id: string;
  homeId: string;
  systemId?: string;
  taskId?: string;
  type: 'routine' | 'repair' | 'inspection' | 'installation' | 'emergency' | 'other';
  title: string;
  description?: string;
  performedDate: Date;
  performedBy?: string;
  costAmount?: number;
  costCurrency: string;
  photos?: string[];
  documents?: string[];
  nextServiceDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Seasonal Checklist model
export interface SeasonalChecklist {
  id: string;
  homeId: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  year: number;
  totalItems: number;
  completedItems: number;
  generatedAt: Date;
  completedAt?: Date;
  items?: ChecklistItem[];
}

// Checklist Item model
export interface ChecklistItem {
  id: string;
  checklistId: string;
  systemId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: Date;
  sortOrder: number;
  createdAt: Date;
}

// User Preferences model
export interface UserPreferences {
  id: string;
  userId: string;
  reminderMethods: string[];
  reminderTiming: string;
  autoGenerateChecklists: boolean;
  diyLevel?: string;
  interestedInProviders: boolean;
  providerTypes?: string[];
  temperatureUnit: 'celsius' | 'fahrenheit';
  dateFormat: string;
  createdAt: Date;
  updatedAt: Date;
}

// Weather Cache model
export interface WeatherCache {
  id: string;
  locationKey: string;
  currentWeather: CurrentWeather;
  forecast: any;
  alerts: any[];
  cachedAt: Date;
  expiresAt: Date;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  conditions: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  timestamp: string;
}
```

---

## Relationships

### Entity Relationship Diagram (ERD)

```
users (1) ----< (∞) homes
users (1) ----< (1) user_preferences

homes (1) ----< (∞) systems
homes (1) ----< (∞) maintenance_tasks
homes (1) ----< (∞) maintenance_logs
homes (1) ----< (∞) seasonal_checklists

systems (1) ----< (∞) maintenance_tasks
systems (1) ----< (∞) maintenance_logs
systems (1) ----< (∞) checklist_items

maintenance_tasks (1) ----< (1) maintenance_logs [optional]

seasonal_checklists (1) ----< (∞) checklist_items
```

### Key Relationships:

1. **User → Homes**: One user can have multiple homes (main house, cabin, etc.)
2. **Home → Systems**: Each home has multiple systems configured
3. **Home → Tasks**: Each home has maintenance tasks
4. **System → Tasks**: Each system generates specific maintenance tasks
5. **Task → Log**: Completing a task creates a log entry
6. **Home → Checklists**: Each home has seasonal checklists
7. **Checklist → Items**: Each checklist contains multiple items

---

## Indexes

### Performance Optimization Indexes

```sql
-- Fast user data retrieval
CREATE INDEX idx_homes_user_active ON homes(user_id, is_active);
CREATE INDEX idx_systems_home_active ON systems(home_id, is_active);

-- Task queries (dashboard widgets)
CREATE INDEX idx_tasks_home_status_due ON maintenance_tasks(home_id, status, due_date);
CREATE INDEX idx_tasks_upcoming ON maintenance_tasks(home_id, due_date)
  WHERE status = 'pending' AND due_date >= CURRENT_DATE;

-- System health calculations
CREATE INDEX idx_logs_system_recent ON maintenance_logs(system_id, performed_date DESC);

-- Seasonal checklist queries
CREATE INDEX idx_checklists_active_season ON seasonal_checklists(home_id, season, year)
  WHERE completed_at IS NULL;

-- Full-text search (if needed)
CREATE INDEX idx_tasks_search ON maintenance_tasks USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

---

## Sample Queries

### Dashboard Widget Queries

#### 1. Get Maintenance Summary for Home

```sql
-- Get task counts by status
SELECT
  status,
  COUNT(*) as count,
  CASE
    WHEN status = 'pending' AND due_date < CURRENT_DATE THEN 'overdue'
    WHEN status = 'pending' AND due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'due_soon'
    WHEN status = 'pending' THEN 'upcoming'
    ELSE status
  END as display_status
FROM maintenance_tasks
WHERE home_id = $1 AND status IN ('pending', 'overdue')
GROUP BY status, display_status;
```

#### 2. Get System Status with Health Score

```sql
-- Get all systems with last maintenance date and overdue task count
SELECT
  s.*,
  MAX(ml.performed_date) as last_service_date,
  COUNT(DISTINCT mt.id) FILTER (WHERE mt.status = 'overdue') as overdue_tasks,
  COUNT(DISTINCT mt.id) FILTER (WHERE mt.status = 'pending' AND mt.due_date <= CURRENT_DATE + INTERVAL '30 days') as upcoming_tasks
FROM systems s
LEFT JOIN maintenance_logs ml ON ml.system_id = s.id
LEFT JOIN maintenance_tasks mt ON mt.system_id = s.id
WHERE s.home_id = $1 AND s.is_active = TRUE
GROUP BY s.id
ORDER BY overdue_tasks DESC, last_service_date ASC NULLS LAST;
```

#### 3. Get Current Seasonal Checklist

```sql
-- Get checklist with progress
SELECT
  sc.*,
  json_agg(
    json_build_object(
      'id', ci.id,
      'title', ci.title,
      'description', ci.description,
      'priority', ci.priority,
      'completed', ci.completed,
      'systemId', ci.system_id
    ) ORDER BY ci.sort_order
  ) as items
FROM seasonal_checklists sc
LEFT JOIN checklist_items ci ON ci.checklist_id = sc.id
WHERE sc.home_id = $1
  AND sc.season = $2
  AND sc.year = $3
GROUP BY sc.id;
```

#### 4. Get Upcoming Tasks (Next 30 Days)

```sql
SELECT
  mt.*,
  s.name as system_name,
  s.category as system_category
FROM maintenance_tasks mt
LEFT JOIN systems s ON s.id = mt.system_id
WHERE mt.home_id = $1
  AND mt.status = 'pending'
  AND mt.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY mt.due_date ASC, mt.priority DESC;
```

---

## Migration Strategy

### Phase 1: Core Schema
1. Create `homes` table
2. Create `systems` table
3. Create indexes for homes and systems

### Phase 2: Task Management
1. Create `maintenance_tasks` table
2. Create `maintenance_logs` table
3. Create indexes for tasks and logs

### Phase 3: Seasonal Features
1. Create `seasonal_checklists` table
2. Create `checklist_items` table
3. Create indexes for checklists

### Phase 4: Preferences & Caching
1. Create `user_preferences` table
2. Create `weather_cache` table
3. Create remaining indexes

### Phase 5: Data Population
1. Implement task auto-generation logic
2. Create seed data for testing
3. Backfill any existing user data

---

## Data Integrity Rules

### Constraints
1. Users cannot be deleted if they have active homes
2. Homes cannot be deleted if they have incomplete tasks
3. Systems can be soft-deleted (is_active = false)
4. Completed tasks cannot be edited (update_trigger)
5. Task due_date must be >= created_at
6. Maintenance log performed_date must be <= CURRENT_DATE

### Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_homes_updated_at BEFORE UPDATE ON homes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_systems_updated_at BEFORE UPDATE ON systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON maintenance_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_logs_updated_at BEFORE UPDATE ON maintenance_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

```sql
-- Auto-update task status to 'overdue'
CREATE OR REPLACE FUNCTION update_task_status_to_overdue()
RETURNS void AS $$
BEGIN
  UPDATE maintenance_tasks
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Run daily via cron job or scheduled task
```

---

## Next Steps

1. ✅ **Complete**: Database schema design
2. **Next**: Create Prisma schema file or migration files
3. **Then**: Implement API endpoints using this schema
4. **Then**: Create seed data for development/testing
5. **Finally**: Deploy schema to production database
