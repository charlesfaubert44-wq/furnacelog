# Immediate Dashboard Fixes Required

## Critical Issues (Must Fix Now)

### 1. Dashboard "Log Maintenance" Button
**Status:** Non-functional placeholder
**Fix:** Add onClick handler to open modal/form for logging maintenance
**File:** frontend/src/pages/Dashboard.tsx:207

### 2. Settings Navigation Missing  
**Status:** Settings page doesn't exist
**Fix:** Create Settings.tsx page with:
- Profile settings
- Home management
- Notification preferences
**Files Needed:** 
- frontend/src/pages/Settings.tsx
- Route in App.tsx

### 3. Wiki Missing from Navigation
**Status:** Wiki page doesn't exist, not in menu
**Fix:** Create Wiki.tsx with northern home guides
**Files Needed:**
- frontend/src/pages/Wiki.tsx  
- Route in App.tsx
- Add to navigation menu

### 4. Onboarding Not Integrated
**Status:** Page exists but never shown to users
**Fix:** 
- Add /onboarding route
- Redirect new users without homes to onboarding
- Show onboarding on first login

### 5. Task Cards Non-Functional
**Status:** Cards are display-only
**Fix:** Add onClick handlers to:
- View task details
- Mark as complete
- Edit task
- Reschedule

## Implementation Priority

1. **HIGH:** Create Settings page + route
2. **HIGH:** Create Wiki page + route  
3. **HIGH:** Add Wiki to navigation
4. **MEDIUM:** Make "Log Maintenance" button work
5. **MEDIUM:** Make task cards clickable
6. **LOW:** Integrate onboarding flow

## Notes
- All pages should use same Territorial Homestead styling
- Maintain warm color palette throughout
- Ensure mobile responsive
- Add proper loading states
- Handle errors gracefully
