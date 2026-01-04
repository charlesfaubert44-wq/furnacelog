# API Specification - FurnaceLog Backend

Complete REST API specification for the FurnaceLog home maintenance platform.

## Base URL
```
Production: https://furnacelog.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication
All endpoints (except auth endpoints) require authentication via httpOnly cookies:
- `access_token` - JWT access token (15 minutes)
- `refresh_token` - JWT refresh token (7 days)

**Headers Required:**
```
Content-Type: application/json
x-csrf-token: <token> (for non-GET requests)
```

---

## Table of Contents
1. [Homes API](#homes-api)
2. [Systems API](#systems-api)
3. [Maintenance Tasks API](#maintenance-tasks-api)
4. [Maintenance Logs API](#maintenance-logs-api)
5. [Seasonal Checklists API](#seasonal-checklists-api)
6. [Weather API](#weather-api)
7. [User Preferences API](#user-preferences-api)
8. [Onboarding API](#onboarding-api)

---

## Homes API

### GET /homes
Get all homes for authenticated user

**Response 200:**
```json
{
  "success": true,
  "data": {
    "homes": [
      {
        "id": "uuid",
        "name": "Main House",
        "homeType": "modular",
        "community": "Yellowknife",
        "territory": "NWT",
        "yearBuilt": 2015,
        "bedrooms": 3,
        "bathrooms": 2,
        "isActive": true,
        "createdAt": "2024-01-04T12:00:00Z",
        "updatedAt": "2024-01-04T12:00:00Z"
      }
    ],
    "total": 1
  }
}
```

### POST /homes
Create a new home (from onboarding)

**Request Body:**
```json
{
  "name": "Main House",
  "homeType": "modular",
  "community": "Yellowknife",
  "territory": "NWT",
  "yearBuilt": 2015,
  "bedrooms": 3,
  "bathrooms": 2.5
}
```

**Validation Rules:**
- `name`: required, string, max 255 chars
- `homeType`: required, enum: ['modular', 'stick-built', 'log', 'mobile', 'other']
- `community`: required, string, max 255 chars
- `territory`: required, enum: ['NWT', 'Nunavut', 'Yukon', 'Other']
- `yearBuilt`: optional, integer, min 1800, max current year + 1
- `bedrooms`: optional, integer, min 1, max 20
- `bathrooms`: optional, number, min 0.5, max 20

**Response 201:**
```json
{
  "success": true,
  "data": {
    "home": {
      "id": "uuid",
      "name": "Main House",
      ...
    }
  },
  "message": "Home created successfully"
}
```

### GET /homes/:id
Get specific home details

**Response 200:**
```json
{
  "success": true,
  "data": {
    "home": {
      "id": "uuid",
      "name": "Main House",
      "homeType": "modular",
      "community": "Yellowknife",
      "territory": "NWT",
      "latitude": 62.4540,
      "longitude": -114.3718,
      "yearBuilt": 2015,
      "bedrooms": 3,
      "bathrooms": 2,
      "isActive": true,
      "systemsCount": 12,
      "activeTasksCount": 5,
      "overdueTasksCount": 2,
      "createdAt": "2024-01-04T12:00:00Z",
      "updatedAt": "2024-01-04T12:00:00Z"
    }
  }
}
```

### PATCH /homes/:id
Update home details

**Request Body:**
```json
{
  "name": "Updated Name",
  "bedrooms": 4
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "home": { ... }
  },
  "message": "Home updated successfully"
}
```

### DELETE /homes/:id
Soft delete a home (set isActive = false)

**Response 200:**
```json
{
  "success": true,
  "message": "Home deleted successfully"
}
```

---

## Systems API

### GET /homes/:homeId/systems
Get all systems for a home

**Query Parameters:**
- `category` (optional): Filter by category (heating, water, electrical, etc.)
- `active` (optional): Filter by active status (true/false)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "systems": [
      {
        "id": "uuid",
        "homeId": "uuid",
        "category": "heating",
        "systemType": "propane-furnace",
        "name": "Primary Furnace",
        "manufacturer": "Lennox",
        "model": "SLP98V",
        "ageYears": 5,
        "config": {
          "fuel_type": "propane",
          "is_primary": true
        },
        "lastServiceDate": "2023-10-15",
        "nextServiceDate": "2024-10-15",
        "overdueTasksCount": 1,
        "healthScore": 75,
        "isActive": true,
        "createdAt": "2024-01-04T12:00:00Z"
      }
    ],
    "total": 12,
    "byCategory": {
      "heating": 3,
      "water": 2,
      "electrical": 2,
      "sewage": 1,
      "appliance": 3,
      "specialized": 1
    }
  }
}
```

### POST /homes/:homeId/systems
Add a new system to a home

**Request Body:**
```json
{
  "category": "heating",
  "systemType": "propane-furnace",
  "name": "Primary Furnace",
  "manufacturer": "Lennox",
  "model": "SLP98V",
  "ageYears": 5,
  "config": {
    "fuel_type": "propane",
    "is_primary": true
  }
}
```

**Validation Rules:**
- `category`: required, enum
- `systemType`: required, string
- `name`: optional, string, max 255 chars
- `config`: optional, object

**Response 201:**
```json
{
  "success": true,
  "data": {
    "system": { ... },
    "generatedTasks": [
      {
        "id": "uuid",
        "title": "Annual Furnace Inspection",
        "dueDate": "2024-10-15"
      }
    ]
  },
  "message": "System added and maintenance tasks generated"
}
```

### GET /systems/:id
Get specific system details

**Response 200:**
```json
{
  "success": true,
  "data": {
    "system": {
      "id": "uuid",
      "homeId": "uuid",
      "category": "heating",
      "systemType": "propane-furnace",
      "name": "Primary Furnace",
      "manufacturer": "Lennox",
      "config": { ... },
      "maintenanceHistory": [
        {
          "id": "uuid",
          "type": "routine",
          "title": "Annual Furnace Service",
          "performedDate": "2023-10-15",
          "performedBy": "Arctic Heating Services",
          "cost": 250.00
        }
      ],
      "upcomingTasks": [
        {
          "id": "uuid",
          "title": "Replace Furnace Filter",
          "dueDate": "2024-02-01",
          "priority": "medium"
        }
      ]
    }
  }
}
```

### PATCH /systems/:id
Update system details

**Request Body:**
```json
{
  "name": "Updated Name",
  "config": {
    "fuel_type": "propane",
    "capacity_btu": 100000
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "system": { ... }
  },
  "message": "System updated successfully"
}
```

### DELETE /systems/:id
Soft delete a system

**Response 200:**
```json
{
  "success": true,
  "message": "System deleted successfully"
}
```

---

## Maintenance Tasks API

### GET /homes/:homeId/tasks
Get maintenance tasks for a home

**Query Parameters:**
- `status` (optional): Filter by status (pending, overdue, completed, etc.)
- `systemId` (optional): Filter by specific system
- `priority` (optional): Filter by priority (low, medium, high, critical)
- `dueBefore` (optional): Filter tasks due before date (ISO format)
- `dueAfter` (optional): Filter tasks due after date (ISO format)
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "homeId": "uuid",
        "systemId": "uuid",
        "systemName": "Primary Furnace",
        "systemCategory": "heating",
        "title": "Replace Furnace Filter",
        "description": "Replace HVAC filter to maintain air quality and system efficiency",
        "dueDate": "2024-02-01",
        "priority": "medium",
        "status": "pending",
        "isRecurring": true,
        "recurrenceIntervalDays": 90,
        "autoGenerated": true,
        "generationRule": "furnace-filter-quarterly",
        "daysUntilDue": 28,
        "createdAt": "2023-11-01T12:00:00Z"
      }
    ],
    "total": 15,
    "summary": {
      "overdue": 2,
      "dueSoon": 3,
      "upcoming": 10
    }
  }
}
```

### POST /tasks
Create a manual maintenance task

**Request Body:**
```json
{
  "homeId": "uuid",
  "systemId": "uuid",  // optional
  "title": "Check propane levels",
  "description": "Verify propane tank gauge and schedule refill if needed",
  "dueDate": "2024-02-15",
  "priority": "high",
  "isRecurring": true,
  "recurrenceIntervalDays": 30
}
```

**Validation Rules:**
- `homeId`: required, valid UUID
- `systemId`: optional, valid UUID
- `title`: required, string, max 255 chars
- `description`: optional, string
- `dueDate`: required, ISO date string, must be future date
- `priority`: optional, enum, default 'medium'
- `isRecurring`: optional, boolean, default false
- `recurrenceIntervalDays`: required if isRecurring is true

**Response 201:**
```json
{
  "success": true,
  "data": {
    "task": { ... }
  },
  "message": "Task created successfully"
}
```

### GET /tasks/:id
Get specific task details

**Response 200:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid",
      "homeId": "uuid",
      "systemId": "uuid",
      "system": {
        "id": "uuid",
        "name": "Primary Furnace",
        "category": "heating"
      },
      "title": "Replace Furnace Filter",
      "description": "...",
      "dueDate": "2024-02-01",
      "priority": "medium",
      "status": "pending",
      "isRecurring": true,
      "recurrenceIntervalDays": 90,
      "autoGenerated": true,
      "relatedLogs": [
        {
          "id": "uuid",
          "performedDate": "2023-11-01",
          "performedBy": "Self"
        }
      ]
    }
  }
}
```

### PATCH /tasks/:id
Update task (reschedule, change priority, etc.)

**Request Body:**
```json
{
  "dueDate": "2024-03-01",
  "priority": "high",
  "status": "pending"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "task": { ... }
  },
  "message": "Task updated successfully"
}
```

### POST /tasks/:id/complete
Mark task as completed

**Request Body:**
```json
{
  "performedDate": "2024-01-04",
  "performedBy": "Self",
  "notes": "Filter replaced, system running smoothly",
  "cost": 35.00,
  "createLog": true  // Create maintenance log entry
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "task": { ... },
    "log": { ... },  // if createLog was true
    "nextTask": { ... }  // if recurring
  },
  "message": "Task completed successfully"
}
```

### DELETE /tasks/:id
Delete a task

**Response 200:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Maintenance Logs API

### GET /homes/:homeId/logs
Get maintenance history for a home

**Query Parameters:**
- `systemId` (optional): Filter by system
- `type` (optional): Filter by type (routine, repair, inspection, etc.)
- `startDate` (optional): Filter logs after date
- `endDate` (optional): Filter logs before date
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "homeId": "uuid",
        "systemId": "uuid",
        "systemName": "Primary Furnace",
        "taskId": "uuid",
        "type": "routine",
        "title": "Annual Furnace Service",
        "description": "Completed annual furnace inspection and cleaning",
        "performedDate": "2023-10-15",
        "performedBy": "Arctic Heating Services",
        "costAmount": 250.00,
        "costCurrency": "CAD",
        "photos": ["https://s3.../photo1.jpg"],
        "documents": ["https://s3.../receipt.pdf"],
        "nextServiceDate": "2024-10-15",
        "notes": "All components in good condition",
        "createdAt": "2023-10-15T14:30:00Z"
      }
    ],
    "total": 45,
    "totalCost": 3250.00,
    "byType": {
      "routine": 30,
      "repair": 10,
      "inspection": 5
    }
  }
}
```

### POST /logs
Create a maintenance log entry

**Request Body:**
```json
{
  "homeId": "uuid",
  "systemId": "uuid",  // optional
  "taskId": "uuid",  // optional - link to completed task
  "type": "routine",
  "title": "Furnace Filter Replacement",
  "description": "Replaced 20x25x4 filter",
  "performedDate": "2024-01-04",
  "performedBy": "Self",
  "costAmount": 35.00,
  "photos": ["base64_encoded_image"],  // or S3 URLs
  "documents": ["base64_encoded_pdf"],
  "nextServiceDate": "2024-04-04",
  "notes": "Filter was very dirty, should check more frequently"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "log": { ... },
    "uploadedFiles": {
      "photos": ["https://s3.../photo1.jpg"],
      "documents": ["https://s3.../doc1.pdf"]
    }
  },
  "message": "Maintenance log created successfully"
}
```

### GET /logs/:id
Get specific log details

**Response 200:**
```json
{
  "success": true,
  "data": {
    "log": {
      "id": "uuid",
      "homeId": "uuid",
      "system": {
        "id": "uuid",
        "name": "Primary Furnace",
        "category": "heating"
      },
      "task": {
        "id": "uuid",
        "title": "Replace Furnace Filter"
      },
      "type": "routine",
      "title": "Furnace Filter Replacement",
      "description": "...",
      "performedDate": "2024-01-04",
      "performedBy": "Self",
      "costAmount": 35.00,
      "photos": ["https://s3.../photo1.jpg"],
      "documents": ["https://s3.../receipt.pdf"],
      "nextServiceDate": "2024-04-04",
      "notes": "...",
      "createdAt": "2024-01-04T15:00:00Z"
    }
  }
}
```

### PATCH /logs/:id
Update log entry

**Request Body:**
```json
{
  "notes": "Updated notes",
  "costAmount": 40.00
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "log": { ... }
  },
  "message": "Log updated successfully"
}
```

### DELETE /logs/:id
Delete a maintenance log

**Response 200:**
```json
{
  "success": true,
  "message": "Log deleted successfully"
}
```

---

## Seasonal Checklists API

### GET /homes/:homeId/checklists/seasonal
Get seasonal checklists for a home

**Query Parameters:**
- `season` (optional): Filter by season (spring, summer, fall, winter)
- `year` (optional): Filter by year (default: current year)
- `current` (optional): Get only current season's checklist (boolean)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "checklist": {
      "id": "uuid",
      "homeId": "uuid",
      "season": "winter",
      "year": 2024,
      "totalItems": 12,
      "completedItems": 7,
      "progressPercent": 58,
      "generatedAt": "2023-12-01T00:00:00Z",
      "items": [
        {
          "id": "uuid",
          "systemId": "uuid",
          "systemName": "Primary Furnace",
          "title": "Inspect heat trace cables",
          "description": "Check all heat trace cables for damage before extreme cold",
          "priority": "high",
          "completed": true,
          "completedAt": "2023-12-15T10:00:00Z",
          "sortOrder": 1
        },
        {
          "id": "uuid",
          "systemId": "uuid",
          "systemName": "HRV System",
          "title": "Clean HRV filters",
          "description": "Remove and clean or replace HRV filters",
          "priority": "medium",
          "completed": false,
          "completedAt": null,
          "sortOrder": 2
        }
      ]
    },
    "currentSeason": "winter"
  }
}
```

### POST /checklists/:id/items/:itemId/complete
Mark checklist item as completed

**Request Body:**
```json
{
  "completed": true,
  "notes": "Completed on schedule"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "item": { ... },
    "checklist": {
      "completedItems": 8,
      "progressPercent": 67
    }
  },
  "message": "Checklist item updated"
}
```

### POST /homes/:homeId/checklists/generate
Manually trigger checklist generation

**Request Body:**
```json
{
  "season": "winter",
  "year": 2024
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "checklist": { ... },
    "itemsGenerated": 12
  },
  "message": "Seasonal checklist generated"
}
```

---

## Weather API

### GET /weather/current
Get current weather for a location

**Query Parameters:**
- `location` (required): "community,territory" (e.g., "Yellowknife,NWT")
- `homeId` (optional): Home ID to use cached location

**Response 200:**
```json
{
  "success": true,
  "data": {
    "weather": {
      "temperature": -18,
      "feelsLike": -28,
      "conditions": "Clear",
      "windSpeed": 15,
      "windDirection": "NW",
      "humidity": 65,
      "pressure": 1013,
      "visibility": 10,
      "timestamp": "2024-01-04T12:00:00Z"
    },
    "alerts": [
      {
        "id": "alert-123",
        "type": "extreme_cold",
        "severity": "warning",
        "title": "Extreme Cold Warning",
        "description": "Wind chill values near -40°C expected",
        "expires": "2024-01-05T06:00:00Z"
      }
    ],
    "recommendations": [
      {
        "system": "heat-trace",
        "message": "Verify heat trace cables are operational",
        "priority": "high"
      },
      {
        "system": "furnace",
        "message": "Monitor furnace operation closely",
        "priority": "medium"
      }
    ],
    "cachedAt": "2024-01-04T11:45:00Z"
  }
}
```

### GET /weather/forecast
Get weather forecast

**Query Parameters:**
- `location` (required): "community,territory"
- `days` (optional): Number of forecast days (default: 7, max: 14)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "forecast": [
      {
        "date": "2024-01-05",
        "tempHigh": -15,
        "tempLow": -25,
        "conditions": "Partly Cloudy",
        "precipitation": 0,
        "windSpeed": 10
      }
    ]
  }
}
```

---

## User Preferences API

### GET /preferences
Get current user preferences

**Response 200:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "id": "uuid",
      "userId": "uuid",
      "reminderMethods": ["email", "in-app"],
      "reminderTiming": "1-week",
      "autoGenerateChecklists": true,
      "diyLevel": "basic-diy",
      "interestedInProviders": true,
      "providerTypes": ["hvac", "plumber"],
      "temperatureUnit": "celsius",
      "dateFormat": "YYYY-MM-DD"
    }
  }
}
```

### PATCH /preferences
Update user preferences

**Request Body:**
```json
{
  "reminderMethods": ["email", "in-app", "weekly-digest"],
  "reminderTiming": "2-weeks"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "preferences": { ... }
  },
  "message": "Preferences updated successfully"
}
```

---

## Onboarding API

### POST /onboarding/complete
Complete onboarding wizard and create home + systems

**Request Body:**
```json
{
  "home": {
    "name": "Main House",
    "homeType": "modular",
    "community": "Yellowknife",
    "territory": "NWT",
    "yearBuilt": 2015,
    "bedrooms": 3,
    "bathrooms": 2
  },
  "systems": {
    "heating": {
      "primaryHeating": "propane-furnace",
      "heatingAge": 5,
      "heatingBrand": "Lennox",
      "hasHRV": true,
      "hrvBrand": "Venmar"
    },
    "water": {
      "waterSource": "trucked",
      "tankCapacity": 500,
      "refillFrequency": "biweekly",
      "hotWaterSystem": "tank"
    },
    "sewage": {
      "sewageSystem": "holding-tank",
      "holdingTankSize": 500,
      "holdingTankFrequency": "biweekly"
    },
    "electrical": {
      "powerSource": "hybrid",
      "hasGenerator": true,
      "generatorType": "standby",
      "generatorFuel": "propane"
    },
    "additional": {
      "appliances": ["refrigerator", "washer", "dryer"],
      "specializedSystems": ["heated-garage"],
      "fuelStorage": ["propane-tank"]
    }
  },
  "preferences": {
    "reminderMethods": ["email", "in-app"],
    "reminderTiming": "1-week",
    "autoGenerateChecklists": true,
    "diyLevel": "basic-diy"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "home": {
      "id": "uuid",
      "name": "Main House",
      ...
    },
    "systems": [
      {
        "id": "uuid",
        "category": "heating",
        "systemType": "propane-furnace",
        ...
      }
    ],
    "tasksGenerated": 24,
    "checklistGenerated": true
  },
  "message": "Onboarding completed successfully! Your dashboard is ready."
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "dueDate",
        "message": "Due date must be a future date"
      }
    ]
  }
}
```

### Error Codes

- `400` - Bad Request (validation errors, invalid data)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic error)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Weather API**: 100 requests per hour (cached for 15 minutes)
- **File uploads**: 50 uploads per hour, max 10MB per file

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1704376800
```

---

## Pagination

For list endpoints, use `limit` and `offset`:

**Request:**
```
GET /homes/uuid/tasks?limit=20&offset=40
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [...],
    "total": 100,
    "limit": 20,
    "offset": 40,
    "hasMore": true
  }
}
```

---

## File Uploads

For endpoints that accept file uploads (photos, documents):

**Method 1: Base64 in JSON**
```json
{
  "photos": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."],
  "documents": ["data:application/pdf;base64,JVBERi0xLjQK..."]
}
```

**Method 2: Multipart Form Data**
```
POST /logs
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="data"

{"title": "Furnace Service", ...}
------WebKitFormBoundary
Content-Disposition: form-data; name="photo"; filename="furnace.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary--
```

**Supported File Types:**
- Images: JPEG, PNG, WebP (max 10MB each)
- Documents: PDF (max 10MB)

---

## Next Steps

1. ✅ **Complete**: API specification
2. **Next**: Implement backend routes and controllers
3. **Then**: Create frontend API service layer
4. **Then**: Connect dashboard widgets to real API
5. **Finally**: Test all endpoints end-to-end
