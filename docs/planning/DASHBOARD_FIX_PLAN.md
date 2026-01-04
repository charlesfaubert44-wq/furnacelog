# Dashboard Functionality Fix Plan

## Issues Identified
1. ❌ Onboarding wizard exists but not routed or shown to new users
2. ❌ Wiki page doesn't exist  
3. ❌ Settings page doesn't exist
4. ❌ Dashboard buttons are non-functional placeholders
5. ❌ Wiki not in main navigation menu

## Implementation Plan

### Phase 1: Create Missing Pages
- [ ] Create Wiki.tsx - Knowledge base for northern home maintenance
- [ ] Create Settings.tsx - User settings and preferences
- [ ] Create MainLayout.tsx - Shared layout with navigation

### Phase 2: Add Routes & Navigation
- [ ] Add /onboarding route to App.tsx
- [ ] Add /wiki route to App.tsx  
- [ ] Add /settings route to App.tsx
- [ ] Update navigation to include Wiki link
- [ ] Show onboarding to users without homes

### Phase 3: Make Dashboard Functional
- [ ] Connect "Log Maintenance" button to modal/form
- [ ] Make task cards clickable (view/edit/complete)
- [ ] Fetch real data from backend API
- [ ] Add task completion functionality
- [ ] Add navigation to settings from dashboard
- [ ] Make system status cards interactive

### Phase 4: Implement Settings Page Features
- [ ] Profile settings
- [ ] Notification preferences  
- [ ] Home management (add/edit/delete homes)
- [ ] System configuration
- [ ] Account management

### Phase 5: Testing & Polish
- [ ] Test all navigation flows
- [ ] Test onboarding wizard completion
- [ ] Test dashboard interactions
- [ ] Ensure all buttons work
- [ ] Mobile responsive testing

## Priority: HIGH
This is blocking user adoption - dashboard must be functional!
