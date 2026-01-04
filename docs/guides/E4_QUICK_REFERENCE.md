# Epic E4 - Quick Reference Guide

## System Templates Available

### Heating (5)
- `forced-air-furnace-propane` - Propane furnace, annual service
- `forced-air-furnace-oil` - Oil furnace, annual service
- `forced-air-furnace-natural-gas` - Natural gas furnace, annual service
- `boiler-system` - Hydronic boiler, annual service
- `electric-baseboard` - Electric baseboard heaters, annual service

### Hot Water (2)
- `tankless-water-heater` - Tankless/on-demand, annual descaling
- `tank-water-heater` - Traditional tank, annual flush

### Ventilation (2)
- `hrv-system` - Heat Recovery Ventilator, quarterly filters
- `erv-system` - Energy Recovery Ventilator, quarterly filters

### Freeze Protection (1)
- `heat-trace-cables` - Electric heat trace, annual testing

### Fuel Storage (2)
- `propane-tank` - Propane storage, 5-year recertification
- `oil-tank` - Heating oil storage, annual inspection

---

## Common API Calls

### Create System from Template
```http
POST /api/v1/templates/systems/:templateId/create
{
  "homeId": "...",
  "customData": {
    "name": "My System Name",
    "details": { "make": "...", "model": "..." }
  },
  "includeDefaultComponents": true
}
```

### Get Maintenance Due
```http
GET /api/v1/homes/:homeId/systems/maintenance/due?daysAhead=30
```

### Get Expiring Warranties
```http
GET /api/v1/homes/:homeId/systems/warranty/expiring?daysAhead=90
```

### Log Component Replacement
```http
POST /api/v1/homes/:homeId/components/:componentId/replace
{
  "cost": 25,
  "performer": "self",
  "notes": "Replaced filter"
}
```

### Update Fuel Level
```http
PATCH /api/v1/homes/:homeId/systems/:systemId/fuel-level
{
  "level": 75,
  "fillAmount": 500,
  "pricePerLiter": 1.25
}
```

---

## Data Model Quick Reference

### System Categories
- `heating`
- `hot-water`
- `ventilation`
- `plumbing`
- `electrical`
- `fuel-storage`
- `freeze-protection`
- `other`

### Component Types
- `filter`
- `anode-rod`
- `heat-trace-zone`
- `hrv-core` / `hrv-filter`
- `igniter`
- `flame-sensor`
- `thermocouple`
- `circulator-pump`
- `expansion-tank`
- `pressure-relief-valve`
- `mixing-valve`
- `belt`
- `pilot-assembly`
- `transformer`
- `capacitor`
- `contactor`
- `other`

### Status Values
**System:**
- `active`
- `inactive`
- `replaced`
- `decommissioned`

**Component:**
- `active`
- `inactive`
- `discontinued`

---

## Warranty Alert Thresholds

- **REMINDER:** 90 days before expiration
- **WARNING:** 60 days before expiration
- **CRITICAL:** 30 days before expiration

---

## Common Filter Replacement Intervals

- **Furnace Air Filter:** 90 days (northern climate, dusty)
- **HRV/ERV Filters:** 90 days (quarterly)
- **HRV/ERV Core Cleaning:** 365 days (annual)
- **Tankless Heater Filter:** 365 days (annual)

---

## Integration Points

### E5 - Maintenance
- `maintenance.serviceHistory` → MaintenanceLog references
- `GET /systems/maintenance/due` → Maintenance calendar
- `Component.logReplacement()` → Creates maintenance log

### E7 - Notifications
- Daily warranty check job
- Email alerts for expiring warranties
- In-app notifications for maintenance due
- Low stock alerts

### E6 - Documents
- `warranty.documentIds` → Document references
- System photos storage
- QR code generation

### E11 - Northern Features
- Heat trace zone tracking
- HRV/ERV specific fields
- Fuel level monitoring
- Northern climate intervals

---

## File Locations

**Models:**
- `backend/src/models/System.js`
- `backend/src/models/Component.js`

**Controllers:**
- `backend/src/controllers/systemController.js`
- `backend/src/controllers/componentController.js`
- `backend/src/controllers/templateController.js`

**Routes:**
- `backend/src/routes/systemRoutes.js`
- `backend/src/routes/componentRoutes.js`
- `backend/src/routes/templateRoutes.js`

**Services:**
- `backend/src/services/warrantyAlertService.js`

**Data:**
- `backend/src/data/systemTemplates.js`

**Documentation:**
- `EPIC_E4_IMPLEMENTATION_REPORT.md` (Full report)
- `E4_QUICK_REFERENCE.md` (This file)
