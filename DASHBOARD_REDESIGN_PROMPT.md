# FurnaceLog Dashboard Redesign: Complete Specification

## Project Context
FurnaceLog is a home maintenance tracking application designed for homeowners in Canada's northern territories (Northwest Territories, Nunavut, Yukon). The dashboard is the central hub where users manage their home maintenance, track system health, and connect with service professionals.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS, MERN stack
**Current Dashboard:** [Dashboard.tsx](frontend/src/pages/Dashboard.tsx)
**Color System:** Warm earth tones (cream, burnt-sienna, warm-orange, charcoal, sage)

---

## User Persona: "Northern Homeowner Sarah"

### Demographics
- **Name:** Sarah Thompson
- **Age:** 42
- **Location:** Yellowknife, Northwest Territories
- **Occupation:** Government office manager
- **Home:** 1,800 sq ft single-family home built in 2008
- **Household:** Married with two teenagers
- **Tech Savvy:** Moderate (uses smartphone daily, comfortable with apps)

### Context & Challenges
- **Extreme Climate:** Temperatures range from -40°C in winter to +30°C in summer
- **Critical Systems:** Furnace failure in winter is life-threatening
- **Limited Professional Access:** Only 5-10 HVAC contractors in the city, often booked weeks out
- **High Costs:** Professional services are 30-50% more expensive than southern Canada
- **Busy Schedule:** Works full-time, limited time for home maintenance
- **Knowledge Gap:** Knows basics but not confident with complex repairs

### Goals
1. **Stay ahead of problems** - Prevent furnace/water system failures before they become emergencies
2. **Know when to DIY vs hire** - Save money where possible, but know when to call a pro
3. **Track expenses** - Budget for seasonal maintenance and compare contractor costs
4. **Quick access to help** - Find and hire reliable contractors quickly when needed
5. **Peace of mind** - Confidence that nothing critical is being overlooked

### Pain Points
- **Reactive maintenance** - Often only fixes things when they break
- **Forgotten tasks** - Can't remember when furnace filter was last changed
- **Cost surprises** - Unexpected $2,000+ repair bills
- **Contractor uncertainty** - Don't know which contractors are reliable
- **Weather stress** - Worried about system failures during extreme cold
- **Time constraints** - 15-20 minutes max to check maintenance status

### Usage Patterns
- **Morning routine:** Quick 2-minute check on phone while drinking coffee
- **Weekend planning:** 10-15 minutes on Saturday to plan maintenance tasks
- **Emergency use:** Immediate access when furnace makes strange noise at 10 PM
- **Seasonal prep:** 30+ minutes before winter/summer to prepare home
- **Contractor search:** Needs to find and contact professionals within 5 minutes

### Success Metrics (Sarah's Perspective)
- ✅ Takes less than 5 minutes to log completed maintenance
- ✅ Dashboard shows at-a-glance status without scrolling
- ✅ Critical alerts are impossible to miss
- ✅ Can find and contact a contractor in under 3 minutes
- ✅ Knows exactly how much she spent on home maintenance this year
- ✅ Feels confident she won't have emergency failures

---

## Dashboard User Flow: Complete Journey

### Entry Points
1. **Direct URL** → Dashboard (if authenticated)
2. **Home Page** → Login → Dashboard
3. **Mobile PWA Icon** → Dashboard
4. **Email Notification Link** → Specific Task → Dashboard

### Core User Flows

#### Flow 1: Morning Quick Check (2 minutes)
```
1. User opens app on phone
2. Dashboard loads with glanceable status
   ├─ See red/yellow/green system health at top
   ├─ See count of overdue/upcoming tasks
   └─ See critical weather alerts (if any)
3. If red/yellow alert:
   ├─ Tap to expand details
   ├─ Read recommendation
   └─ Either:
      ├─ "Quick Log" → Log as completed
      ├─ "Schedule" → Add to calendar
      └─ "Hire Pro" → View contractors
4. Exit satisfied or take action
```

#### Flow 2: Log Completed Maintenance (3-5 minutes)
```
1. User clicks "Log Maintenance" button
2. Modal opens with smart form:
   ├─ Auto-suggest recent tasks (predictive)
   ├─ Or select from dropdown
   └─ Or create custom task
3. User fills quick form:
   ├─ What was done (pre-filled if from suggestion)
   ├─ Who did it: [Self | Hired Pro | Other]
   ├─ If "Hired Pro":
   │   ├─ Select from recent contractors dropdown
   │   ├─ Or add new contractor
   │   ├─ Rate performance (1-5 stars)
   │   ├─ Labor cost
   │   └─ Would hire again? [Yes/No]
   ├─ Parts used + costs (optional)
   ├─ Photos (optional, drag-drop)
   └─ Notes (optional)
4. Click "Save Log"
5. Dashboard updates:
   ├─ Task removed from "due soon" list
   ├─ System health score updates
   ├─ Cost tracking updates
   └─ Success toast notification
```

#### Flow 3: Hire a Professional (3-7 minutes)
```
1. User sees task marked "Professional Recommended"
2. Clicks "Find Contractor" button
3. Professional Hiring Modal opens:
   ├─ Task details shown at top
   ├─ Estimated cost range (DIY vs Pro)
   └─ Three sections:
       ├─ "Recent Contractors" (if any)
       │   └─ Shows contractors user has hired before with ratings
       ├─ "Recommended Professionals" (top rated in area)
       │   └─ Name, specialty, rating, avg cost, response time
       └─ "All Local Contractors" (expandable list)
4. User reviews contractor cards:
   ├─ See ratings (community + personal)
   ├─ See specialties (HVAC, plumbing, electrical)
   ├─ See availability indicator
   ├─ See typical cost range
   └─ See distance from home
5. User selects contractor:
   ├─ Click "Contact"
   ├─ Options appear:
   │   ├─ "Call Now" (tel: link)
   │   ├─ "Email Quote Request" (pre-filled template)
   │   └─ "Save for Later" (add to favorites)
6. User sends request
7. Dashboard updates:
   ├─ Task status → "Professional Contacted"
   ├─ Notification reminder set for 3 days
   └─ Contractor added to "recent" list
```

#### Flow 4: Seasonal Preparation (15-20 minutes)
```
1. User receives notification: "Winter Prep: 8 tasks recommended"
2. Opens dashboard
3. Seasonal Checklist Widget prominently displayed:
   ├─ Progress bar: "3/8 completed"
   ├─ Categorized tasks:
   │   ├─ Critical (red): Furnace inspection
   │   ├─ Important (yellow): Weatherstripping
   │   └─ Recommended (blue): Humidifier check
4. User expands checklist
5. For each task, sees:
   ├─ Task name + description
   ├─ Difficulty: [DIY Easy | DIY Moderate | Pro Required]
   ├─ Est. time: "30 minutes"
   ├─ Est. cost: "$25-50 (DIY)" or "$150-300 (Professional)"
   ├─ Tutorial video link (if DIY)
   └─ Action buttons: [Mark Done | Hire Pro | Skip | Remind Me]
6. User processes each task:
   ├─ DIY tasks → Watch tutorial → Mark done → Log completion
   ├─ Pro tasks → Hire contractor → Mark contacted
   └─ Optional tasks → Remind me in 2 weeks
7. Dashboard reflects progress in real-time
8. When 100% complete → Celebration animation + "Winter Ready!" badge
```

#### Flow 5: Emergency Response (1-2 minutes)
```
1. User's furnace makes loud bang at 10 PM, -35°C outside
2. Opens app (high stress, needs help NOW)
3. Dashboard immediately shows:
   ├─ Emergency contact banner (if enabled)
   └─ "Quick Actions" panel
4. User clicks "Emergency Contractors"
5. Modal shows:
   ├─ 24/7 HVAC contractors (sorted by availability)
   ├─ "Call Now" buttons prominent (large, red)
   ├─ Recent contractors (if any) at top
   └─ Backup: Territory-wide contractors
6. User taps "Call Now" → Phone app opens
7. After call, optional quick log:
   ├─ "Emergency service requested from [Contractor]"
   └─ Auto-reminder to log completion when fixed
```

### Navigation Structure
```
Dashboard (Home)
├─ Quick Actions Bar (sticky top on mobile)
│   ├─ Log Maintenance
│   ├─ Find Contractor
│   └─ Emergency Help
├─ Overview Section
│   ├─ Overall Home Health Score (large, central)
│   ├─ Critical Alerts Banner (if any)
│   └─ Quick Stats Cards (4 metrics)
├─ Primary Widgets (grid)
│   ├─ Upcoming Maintenance (with filters)
│   ├─ System Status (all systems)
│   ├─ Seasonal Checklist
│   ├─ Weather & Recommendations
│   ├─ Cost Tracker (new)
│   └─ Recent Contractors (new)
└─ Secondary Actions
    ├─ View Full Calendar
    ├─ Browse Service Providers
    ├─ View Reports
    └─ Manage Home Profile
```

---

## Dashboard Redesign Specification

### Layout Architecture

#### Desktop (≥1280px)
```
┌─────────────────────────────────────────────────────────┐
│ Navbar (sticky)                                         │
├─────────────────────────────────────────────────────────┤
│ Welcome Header + Home Selector + Quick Actions         │
├───────────────────┬─────────────────┬───────────────────┤
│                   │                 │                   │
│  Overall Health   │  Critical       │  Quick Stats      │
│  Score Card       │  Alerts         │  (4 mini cards)   │
│  (Large Gauge)    │  Banner         │                   │
│                   │                 │                   │
├───────────────────┴─────────────────┴───────────────────┤
│                                                         │
│  Upcoming Maintenance Widget (full width)              │
│  - Table view with inline actions                      │
│  - Filters: All | Overdue | This Week | This Month     │
│                                                         │
├─────────────────────────────┬───────────────────────────┤
│                             │                           │
│  System Status Widget       │  Weather Widget           │
│  (Grid of system cards)     │  (Current + 7-day)        │
│                             │  (Recommendations)        │
├─────────────────────────────┼───────────────────────────┤
│                             │                           │
│  Seasonal Checklist         │  Cost Tracker Widget      │
│  (Progress + task list)     │  (Monthly/Yearly charts)  │
│                             │                           │
├─────────────────────────────┴───────────────────────────┤
│                                                         │
│  Recent Contractors Widget (carousel)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Mobile (≤768px)
```
┌─────────────────────┐
│ Navbar (sticky)     │
├─────────────────────┤
│ Welcome + Actions   │
├─────────────────────┤
│ Health Score        │
│ (Large, Central)    │
├─────────────────────┤
│ Critical Alerts     │
│ (If any)            │
├─────────────────────┤
│ Quick Stats         │
│ (2x2 grid)          │
├─────────────────────┤
│ Upcoming Tasks      │
│ (Compact cards)     │
│ [Show All →]        │
├─────────────────────┤
│ Systems Status      │
│ (Swipeable cards)   │
├─────────────────────┤
│ Weather             │
├─────────────────────┤
│ Seasonal Checklist  │
├─────────────────────┤
│ Cost Summary        │
├─────────────────────┤
│ Recent Contractors  │
└─────────────────────┘
```

### Component Specifications

#### 1. Overall Home Health Score
**Purpose:** Single, glanceable metric showing overall home status

**Design:**
- Large circular gauge (200px diameter desktop, 150px mobile)
- Percentage score (0-100%) calculated from:
  - System health scores (60% weight)
  - Overdue tasks (20% weight - negative impact)
  - Upcoming critical tasks (10% weight)
  - Recent maintenance activity (10% weight - positive impact)
- Color coding:
  - 90-100%: `sage` (green) - "Excellent"
  - 70-89%: `soft-amber` (yellow) - "Good"
  - 50-69%: `warm-orange` - "Needs Attention"
  - 0-49%: `warm-coral` (red) - "Critical"
- Animated number counter on load
- Below gauge: Text status + "View Details" link

**Implementation:**
```tsx
<HealthScoreGauge
  score={dashboardData.overallHealth}
  breakdown={{
    systems: 85,
    maintenance: 92,
    upcomingTasks: 78
  }}
/>
```

#### 2. Critical Alerts Banner
**Purpose:** Impossible-to-miss urgent notifications

**Design:**
- Full-width banner above widgets (only shows if alerts exist)
- Red gradient background (`warm-coral` to `burnt-sienna`)
- Large alert icon (lucide `AlertTriangle`)
- Alert text in white, bold, 18px
- Examples:
  - "Furnace maintenance 45 days overdue"
  - "Extreme cold warning: -42°C tonight"
  - "3 systems need immediate attention"
- Action buttons on right:
  - Primary: "Take Action" → Opens relevant modal
  - Secondary: "Dismiss"
- Mobile: Stacks vertically, icon at top

**Dismissal Logic:**
- Temporary dismiss (24 hours)
- Reappears if condition persists
- Never dismiss overdue critical tasks

#### 3. Quick Stats Cards
**Purpose:** Key metrics at a glance

**Four Cards:**
1. **Overdue Tasks**
   - Large number (red if >0)
   - "Tasks Overdue"
   - Click → Filter tasks to overdue

2. **This Month's Cost**
   - Dollar amount (CAD)
   - "Spent in [Month]"
   - Up/down arrow vs last month
   - Click → Cost tracker widget

3. **Systems Healthy**
   - "X/Y Systems"
   - Green checkmark icon
   - Click → System status widget

4. **Next Maintenance**
   - "In X days"
   - Task name preview
   - Click → Task details

**Design:**
- Card: `warm-white` background, subtle shadow
- Icon: `burnt-sienna` circle background
- Number: Large (32px), `charcoal`
- Label: Small (14px), `warm-gray`
- Hover: Lift shadow, subtle scale
- Mobile: 2x2 grid

#### 4. Upcoming Maintenance Widget (Enhanced)
**Purpose:** Comprehensive task management interface

**Features:**
- Tab filters:
  - All Tasks (default)
  - Overdue (red badge if >0)
  - This Week
  - This Month
  - Completed (last 30 days)

- Table columns (desktop):
  | Task | System | Due Date | Priority | Difficulty | Est. Cost | Actions |

- Task row details:
  - Task name (truncated at 40 chars)
  - System icon + name
  - Due date (color coded: red if overdue, yellow if <7 days)
  - Priority badge (Critical/High/Normal/Low)
  - Difficulty badge (DIY Easy/Moderate/Pro Required)
  - Cost range or "—" if unknown
  - Actions dropdown:
    - ✓ Mark Complete
    - 👤 Hire Contractor
    - 📅 Reschedule
    - ℹ️ View Details
    - 🗑️ Delete

- Mobile view:
  - Card-based layout
  - Swipe left to reveal actions
  - Tap to expand details

- Empty state:
  - Illustration of checkmark
  - "You're all caught up!"
  - "No upcoming tasks in this filter"

- Sorting:
  - Default: Due date (ascending)
  - Options: Priority, System, Cost

- Pagination: Show 10, load more button

**Implementation Notes:**
- Use `react-table` or `@tanstack/react-table` for sorting/filtering
- Virtualize if >50 tasks
- Optimistic updates when marking complete

#### 5. System Status Widget (Enhanced)
**Purpose:** Visual health overview of all home systems

**Layout:**
- Grid of system cards (3 cols desktop, 2 cols tablet, 1 col mobile)
- Each card shows:
  - System icon (custom icons for furnace, water, electrical, etc.)
  - System name
  - Health score (0-100%)
  - Circular progress indicator (color-coded)
  - Last maintenance date
  - Next maintenance due
  - Quick action button

**System Card Design:**
```
┌─────────────────────────┐
│  [Icon]  FURNACE        │
│                         │
│      ◉ 85%             │
│   (circular gauge)      │
│                         │
│  Last: Dec 15, 2025    │
│  Next: Mar 15, 2026    │
│                         │
│  [Log Maintenance]      │
└─────────────────────────┘
```

**Health Score Calculation:**
```javascript
healthScore = (
  (daysUntilNextMaintenance / expectedInterval) * 0.5 +
  (componentHealthAverage) * 0.3 +
  (recentMaintenanceBonus) * 0.2
) * 100
```

**States:**
- Healthy (90-100%): `sage` border, green gauge
- Good (70-89%): `soft-amber` border, yellow gauge
- Warning (50-69%): `warm-orange` border, orange gauge
- Critical (<50%): `warm-coral` border, red gauge

**Interactions:**
- Click card → System detail modal
- Click "Log Maintenance" → Pre-filled log modal
- Hover → Show tooltip with component breakdown

#### 6. Cost Tracker Widget (NEW)
**Purpose:** Financial transparency and budgeting

**Layout:**
```
┌──────────────────────────────────────┐
│  Cost Tracker                        │
│  ─────────────────────────────────   │
│                                      │
│  This Year: $4,250 CAD              │
│  ↑ 15% vs last year                 │
│                                      │
│  [Chart: Monthly spending line]      │
│                                      │
│  Top Categories:                     │
│  ▪ HVAC          $1,800 (42%)       │
│  ▪ Plumbing      $1,200 (28%)       │
│  ▪ Electrical      $850 (20%)       │
│  ▪ Other          $400 (10%)       │
│                                      │
│  DIY vs Professional:                │
│  [Pie chart: 35% DIY, 65% Pro]      │
│                                      │
│  [View Full Report →]               │
└──────────────────────────────────────┘
```

**Features:**
- Toggle: This Month | This Year | All Time
- Charts using `recharts` or `chart.js`
- Breakdown by:
  - Category (HVAC, Plumbing, Electrical, etc.)
  - DIY vs Professional
  - Parts vs Labor
- Export to CSV button
- Budget setting & tracking (future)

**Data Source:**
- Aggregate from `MaintenanceLog.costs` array
- Group by `system.category`
- Calculate DIY (performedBy='self') vs Pro

#### 7. Recent Contractors Widget (NEW)
**Purpose:** Quick access to trusted professionals

**Layout:**
- Horizontal carousel (desktop) or vertical stack (mobile)
- Each contractor card:
```
┌─────────────────────────┐
│  Arctic HVAC Services   │
│  ⭐⭐⭐⭐⭐ 5.0 (3 jobs)   │
│  Last used: Dec 5, 2025 │
│  Avg cost: $250         │
│                         │
│  [Contact] [View Jobs]  │
└─────────────────────────┘
```

**Card Details:**
- Contractor name (bold)
- Star rating (your rating + # of times hired)
- Last job date
- Average cost (from your logs)
- Contact button → Phone/email modal
- View jobs → History of work done

**Sort Options:**
- Most recent (default)
- Most used
- Highest rated
- Lowest cost

**Empty State:**
- "No contractors yet"
- "Hire a professional to track them here"
- [Browse Contractors] button

**Implementation:**
- Data from `MaintenanceLog.providerId`
- Aggregate ratings, costs, dates
- Link to ServiceProvider model (Phase 2)

#### 8. Weather Widget (Enhanced)
**Current Implementation:** Shows temperature, conditions, wind chill
**Enhancements:**

**Add:**
- 7-day forecast (compact)
- Extreme weather alerts (integrated with Critical Alerts banner)
- System-specific recommendations based on weather:
  - Cold snap approaching → "Check furnace filter"
  - Heavy rain → "Inspect gutters"
  - High winds → "Secure outdoor items"
- Temperature trend graph (past 24h)

**Visual Improvements:**
- Larger temperature display (48px)
- Animated weather icons (sun, snow, cloud)
- Color-coded temperature:
  - <-20°C: Light blue
  - -20°C to 0°C: Blue
  - 0°C to 15°C: Gray
  - 15°C to 25°C: Warm-gray
  - >25°C: Warm-orange

#### 9. Seasonal Checklist Widget (Enhanced)
**Current Implementation:** Shows season + checklist items
**Enhancements:**

**Add:**
- Difficulty badges on each item
- Time estimates
- Cost estimates (DIY vs Pro)
- Tutorial video links (YouTube embeds)
- Progress persistence (save state)
- Completion celebration animation

**Improved Task Card:**
```
┌────────────────────────────────────────┐
│ ☐ Inspect Furnace Heat Exchanger      │
│                                        │
│ Priority: Critical                     │
│ Difficulty: Professional Required      │
│ Est. Cost: $150-300 (Professional)    │
│ Est. Time: 45-60 min                  │
│                                        │
│ Why: Cracked heat exchangers can leak │
│ carbon monoxide into your home.       │
│                                        │
│ [Watch Tutorial] [Hire Pro] [Mark ✓] │
└────────────────────────────────────────┘
```

**Gamification:**
- Progress bar with percentage
- Completion badges: "Winter Ready!", "Summer Safe!"
- Streak tracking: "3 seasons in a row!"
- Share achievement (social media, optional)

---

## Visual Design System

### Color Usage Guidelines

**Backgrounds:**
- Page: `cream` (#F5F1E8)
- Cards: `warm-white` (#FAF8F3)
- Hover: `soft-beige` (#E8DCC4)
- Disabled: `cream` with 50% opacity

**Text:**
- Primary: `charcoal` (#3A3A3A)
- Secondary: `warm-gray` (#6B5D50)
- Muted: `warm-gray` with 70% opacity
- Link: `burnt-sienna` (#C47A53)
- Link hover: `warm-orange` (#E88D5A)

**Actions:**
- Primary button: `burnt-sienna` background, white text
- Primary hover: `warm-orange` background
- Secondary button: `cream` background, `charcoal` text, `burnt-sienna` border
- Danger button: `warm-coral` background, white text

**Status Colors:**
- Success: `sage` (#8BA888)
- Warning: `warm-orange` (#E88D5A)
- Error: `warm-coral` (#F4A582)
- Info: `soft-amber` (#D4A574)

**Priority Colors:**
- Critical: `warm-coral`
- High: `warm-orange`
- Normal: `soft-amber`
- Low: `warm-gray`

**Health Score Colors:**
- Excellent (90-100%): `sage`
- Good (70-89%): `soft-amber`
- Needs Attention (50-69%): `warm-orange`
- Critical (0-49%): `warm-coral`

### Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;
```

**Sizes:**
- h1: 32px (mobile: 24px) - Page title
- h2: 24px (mobile: 20px) - Widget titles
- h3: 20px (mobile: 18px) - Section headers
- Body: 16px - Default text
- Small: 14px - Labels, captions
- Tiny: 12px - Timestamps, metadata

**Weights:**
- Bold (700): Headers, important numbers
- Semibold (600): Subheaders, labels
- Regular (400): Body text
- Light (300): De-emphasized text

### Spacing System
Use Tailwind's spacing scale (4px base):
- xs: 4px (p-1)
- sm: 8px (p-2)
- md: 16px (p-4)
- lg: 24px (p-6)
- xl: 32px (p-8)
- 2xl: 48px (p-12)

### Shadows
```css
/* Card */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Card hover */
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Modal */
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Border Radius
- Small: 4px (rounded)
- Medium: 8px (rounded-lg) - Default for cards
- Large: 12px (rounded-xl) - Modals
- Full: 9999px (rounded-full) - Pills, avatars

### Animations

**Page Load:**
- Fade in + slide up: 300ms ease-out
- Stagger child elements by 50ms

**Interactions:**
- Button hover: Scale 1.02, 150ms ease
- Card hover: Lift (translate -2px), 200ms ease
- Toggle: 200ms ease-in-out
- Modal open: Fade + scale, 250ms ease-out
- Modal close: Fade, 150ms ease-in

**Data Updates:**
- Number counter: Animated count-up, 800ms
- Progress bar: Smooth fill, 500ms ease-out
- Health gauge: Animated arc draw, 1000ms ease-in-out
- Success checkmark: Draw animation, 400ms

**Loading States:**
- Skeleton: Shimmer pulse, 2s infinite
- Spinner: Rotate 360deg, 1s linear infinite

### Icons
**Library:** Lucide React
**Size:** 20px default, 24px for large, 16px for small
**Color:** Inherit from parent or `warm-gray`

**Common Icons:**
- Home: `Home`
- Maintenance: `Wrench`
- Calendar: `Calendar`
- Contractor: `User`
- Cost: `DollarSign`
- Alert: `AlertTriangle`
- Success: `CheckCircle`
- System: `Settings`
- Weather: `Cloud`, `Sun`, `CloudRain`, `CloudSnow`

---

## Interaction Patterns

### Button States
```tsx
// Primary
className="bg-burnt-sienna text-white px-6 py-3 rounded-lg
           hover:bg-warm-orange hover:scale-102
           active:scale-98 transition-all duration-150
           disabled:opacity-50 disabled:cursor-not-allowed"

// Secondary
className="bg-cream text-charcoal border-2 border-burnt-sienna px-6 py-3 rounded-lg
           hover:bg-soft-beige
           transition-colors duration-150"

// Danger
className="bg-warm-coral text-white px-6 py-3 rounded-lg
           hover:bg-warm-orange
           transition-colors duration-150"
```

### Card Hover Effects
```tsx
className="bg-warm-white p-6 rounded-lg shadow-md
           hover:shadow-lg hover:-translate-y-1
           transition-all duration-200 cursor-pointer"
```

### Loading Skeletons
```tsx
<div className="animate-pulse">
  <div className="h-8 bg-soft-beige rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-soft-beige rounded w-full mb-2"></div>
  <div className="h-4 bg-soft-beige rounded w-5/6"></div>
</div>
```

### Toast Notifications
- Position: Top-right (desktop), top-center (mobile)
- Auto-dismiss: 4 seconds
- Types: Success (green), Error (red), Info (blue), Warning (yellow)
- Action button: Optional "Undo" or "View"
- Library: `react-hot-toast` (already used in project)

### Modal Behavior
- Backdrop: Semi-transparent `charcoal` (40% opacity)
- Click outside: Close (with confirmation if form has unsaved changes)
- Escape key: Close
- Focus trap: Tab navigation within modal
- Scroll lock: Disable body scroll when open
- Mobile: Full screen or bottom sheet (for small modals)

### Form Validation
- Real-time validation (on blur)
- Error messages below field in `warm-coral`
- Success checkmark when valid
- Disabled submit until form valid
- Loading state on submit button
- Library: Already using `react-hook-form` + `zod`

---

## Mobile Optimization

### Touch Targets
- Minimum: 44x44px for all interactive elements
- Spacing: 8px minimum between targets
- Buttons: Full width on mobile (<640px)

### Gestures
- Swipe left on task card: Reveal actions (Mark Done, Hire Pro, Delete)
- Pull to refresh: Reload dashboard data
- Swipe between widgets: Carousel navigation

### Mobile-Specific UI
- Sticky "Log Maintenance" FAB (Floating Action Button) bottom-right
- Bottom sheet modals instead of centered modals
- Collapsible sections (accordion) for long content
- Horizontal scrolling for contractor cards
- Sticky quick action bar at top

### Performance
- Lazy load widgets below fold
- Optimize images (WebP, lazy load)
- Virtual scrolling for task lists >20 items
- Service worker for offline access (already implemented)
- Target: <3s initial load on 3G

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Check all color combinations with WebAIM contrast checker

### Keyboard Navigation
- Tab order: Logical, left-to-right, top-to-bottom
- Focus indicators: 2px `burnt-sienna` outline
- Skip to main content link
- All modals keyboard-accessible
- Escape closes modals/dropdowns

### Screen Readers
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic updates
- Alt text for all images/icons
- Form labels always present

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Data Visualization Components

### Health Score Gauge
**Library:** `recharts` or custom SVG
**Type:** Circular progress / donut chart
**Animation:** Arc draws from 0 to score over 1s
**Features:**
- Score in center (large number)
- Color changes based on score threshold
- Tooltip on hover showing breakdown
- Responsive size

**Code Example:**
```tsx
<ResponsiveContainer width="100%" height={200}>
  <RadialBarChart
    cx="50%"
    cy="50%"
    innerRadius="70%"
    outerRadius="100%"
    data={[{ value: 85, fill: '#8BA888' }]}
  >
    <RadialBar dataKey="value" />
    <text x="50%" y="50%" textAnchor="middle">
      <tspan className="text-4xl font-bold">85%</tspan>
      <tspan x="50%" dy="1.5em" className="text-sm">Excellent</tspan>
    </text>
  </RadialBarChart>
</ResponsiveContainer>
```

### Cost Tracker Charts
**Monthly Spending:**
- Type: Line chart
- X-axis: Months (last 12)
- Y-axis: Cost (CAD)
- Line color: `burnt-sienna`
- Area fill: Gradient from `burnt-sienna` to transparent
- Hover: Show exact amount + breakdown

**Category Breakdown:**
- Type: Horizontal bar chart
- Bars: Sorted by cost (descending)
- Colors: Different shade of `burnt-sienna` for each
- Labels: Category name + percentage

**DIY vs Professional:**
- Type: Donut chart
- Two segments: DIY (`sage`) vs Pro (`burnt-sienna`)
- Center: Total cost
- Legend below

### System Health Visualization
**Type:** Mini circular progress per system
**Size:** 60px diameter
**Implementation:**
```tsx
<CircularProgress
  value={85}
  size={60}
  strokeWidth={6}
  color={getHealthColor(85)} // Returns 'sage' for 85%
/>
```

---

## Professional Hiring Features (NEW)

### Contractor Database Schema
```typescript
interface ServiceProvider {
  _id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  website?: string;
  specialties: ('hvac' | 'plumbing' | 'electrical' | 'general')[];
  serviceArea: {
    communities: string[];  // ["Yellowknife", "Behchokǫ̀"]
    territory: string;      // "Northwest Territories"
    radius: number;         // km
  };
  availability: {
    emergency24h: boolean;
    responseTime: string;   // "Same day", "1-3 days", "1 week+"
    bookingURL?: string;
  };
  pricing: {
    hourlyRate?: number;
    calloutFee?: number;
    typical: { min: number; max: number };
  };
  ratings: {
    overall: number;        // 0-5
    count: number;
    breakdown: {
      quality: number;
      timeliness: number;
      communication: number;
      value: number;
    };
  };
  verification: {
    licensed: boolean;
    insured: boolean;
    bondable: boolean;
    verified: boolean;      // Admin verified
  };
  joined: Date;
  lastActive: Date;
}
```

### User Contractor Tracking
```typescript
interface UserContractor {
  _id: string;
  userId: string;
  providerId: string;
  firstUsed: Date;
  lastUsed: Date;
  timesHired: number;
  totalSpent: number;
  averageCost: number;
  userRating: number;      // Personal rating (0-5)
  wouldHireAgain: boolean;
  notes?: string;
  favorite: boolean;
  jobs: {
    logId: string;         // Reference to MaintenanceLog
    date: Date;
    task: string;
    cost: number;
    rating: number;
    review?: string;
  }[];
}
```

### Contractor Card Component
```tsx
<ContractorCard
  contractor={contractor}
  userHistory={userContractorHistory}
  onContact={() => handleContact(contractor)}
  onViewJobs={() => handleViewJobs(contractor)}
  variant="compact" // or "full"
/>
```

**Compact Variant (for widget):**
- Business name
- Star rating + # of jobs
- Specialties (icons)
- Last used date
- [Contact] button

**Full Variant (for directory):**
- All above plus:
- Contact info (phone, email)
- Service area
- Availability badge
- Typical cost range
- Verification badges
- [Request Quote] [Add to Favorites] buttons

### Contractor Search/Filter
**Filters:**
- Specialty (HVAC, Plumbing, Electrical, General)
- Availability (24/7 emergency, Same day, Within week)
- Rating (4+ stars, 3+ stars, All)
- Verification (Licensed, Insured, All)
- Distance (within 10km, 25km, 50km, Territory-wide)
- Cost range (slider)

**Sort:**
- Recommended (your history + overall rating)
- Highest rated
- Most recent (your usage)
- Lowest cost
- Closest distance

### Cost Comparison Tool
When user considers hiring for a task:
```
┌─────────────────────────────────────────┐
│  Furnace Filter Replacement             │
│                                         │
│  DIY Option:                            │
│  Parts: $25-40                         │
│  Time: 15 minutes                       │
│  Difficulty: Easy                       │
│  [Watch Tutorial] [Mark as DIY]        │
│                                         │
│  Professional Option:                   │
│  Typical cost: $80-150                 │
│  Time: 30 minutes                       │
│  Includes: Filter + labor + inspection  │
│  [Find Contractor]                      │
│                                         │
│  You could save: $55-110               │
└─────────────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1: Core Dashboard Improvements (Week 1-2)
1. ✅ Overall Health Score gauge component
2. ✅ Critical Alerts banner system
3. ✅ Quick Stats cards (4 metrics)
4. ✅ Enhanced Upcoming Maintenance widget (filters, sorting)
5. ✅ Enhanced System Status cards (better visuals)
6. ✅ Mobile responsive refinements
7. ✅ Loading/error state improvements

### Phase 2: Cost & Contractor Tracking (Week 3-4)
1. ✅ Cost Tracker widget (charts, breakdowns)
2. ✅ Recent Contractors widget
3. ✅ Contractor logging in maintenance log modal
4. ✅ User contractor history tracking
5. ✅ Cost aggregation and reporting
6. ✅ DIY vs Professional cost tracking

### Phase 3: Professional Hiring System (Week 5-6)
1. ✅ Service Provider database model
2. ✅ Contractor directory/search page
3. ✅ Contractor detail modal
4. ✅ "Find Contractor" flow from tasks
5. ✅ Contact request system
6. ✅ Contractor rating/review system
7. ✅ Cost comparison tool

### Phase 4: Advanced Features (Week 7-8)
1. ✅ Weather enhancements (7-day forecast, alerts)
2. ✅ Seasonal checklist gamification
3. ✅ Tutorial video integration
4. ✅ Emergency contractor quick access
5. ✅ Budget setting and tracking
6. ✅ Export reports (PDF/CSV)
7. ✅ Notification preferences

---

## Success Metrics

### User Engagement
- Dashboard viewed: Daily active users >70%
- Average session time: >5 minutes
- Task logging: >3 logs per month per user
- Contractor contacts: >1 per quarter per user

### Performance
- Initial load: <3s on 3G
- Time to interactive: <5s
- Lighthouse score: >90
- Cumulative Layout Shift: <0.1

### User Satisfaction (Post-Launch Survey)
- Dashboard clarity: 4+ stars (out of 5)
- Easy to log maintenance: 4+ stars
- Easy to find contractors: 4+ stars
- Overall app helpfulness: 4+ stars
- Would recommend: >80% yes

### Business Metrics
- User retention: >60% month-over-month
- Feature adoption: >50% use cost tracker within 30 days
- Contractor directory: >40% use within 90 days
- Premium conversion: (future paid features)

---

## Testing Requirements

### Unit Tests
- All dashboard widgets render correctly
- Data calculations (health score, costs) are accurate
- Filters and sorting work correctly
- Form validation works

### Integration Tests
- Dashboard API endpoint returns correct data
- Task logging creates database entries
- Contractor tracking updates user history
- Cost aggregation matches logs

### E2E Tests (Playwright)
1. User logs in → Dashboard loads with data
2. User logs maintenance → Task disappears from upcoming
3. User hires contractor → Appears in recent contractors
4. User marks seasonal task complete → Progress updates
5. Mobile: Swipe task card → Actions appear

### Accessibility Tests
- Keyboard navigation works for all flows
- Screen reader announces all dynamic updates
- Color contrast meets WCAG AA
- Focus indicators visible

### Performance Tests
- Dashboard loads with 100 tasks in <3s
- Charts render smoothly (60fps)
- No memory leaks on repeated navigation
- Offline mode works (PWA)

---

## Technical Implementation Notes

### State Management
**Current:** AuthContext for user state
**Add:** DashboardContext for dashboard data
```tsx
const DashboardContext = createContext({
  data: null,
  loading: true,
  error: null,
  refresh: () => {},
  updateTask: (id, updates) => {},
  logMaintenance: (log) => {},
});
```

### API Optimization
- Single dashboard endpoint returns all data (already exists)
- Add pagination to task list: `?page=1&limit=10`
- Add date range filter: `?startDate=2025-01-01&endDate=2025-12-31`
- Cache dashboard data for 5 minutes (Redis)
- Implement optimistic updates for instant UI feedback

### Data Fetching Strategy
```tsx
// Use React Query or SWR for caching
const { data, isLoading, error, mutate } = useSWR(
  '/api/v1/dashboard',
  fetcher,
  { refreshInterval: 300000 } // 5 min
);
```

### Real-time Updates (Future)
- WebSocket connection for live weather alerts
- Push notifications for critical overdue tasks
- Real-time contractor availability

### Error Handling
- Network errors: Retry 3x with exponential backoff
- 404: Show "No data yet" state
- 500: Show generic error + contact support
- Offline: Use cached data + show offline banner

---

## Design Files & Assets

### Required Assets
1. **System Icons** - Custom icons for:
   - Furnace/Heating
   - Water/Plumbing
   - Electrical
   - Ventilation
   - Insulation
   - Roof
   - Windows/Doors
   - Appliances

2. **Contractor Specialties Icons:**
   - HVAC technician
   - Plumber
   - Electrician
   - General handyman

3. **Empty State Illustrations:**
   - "No tasks" - Checkmark with confetti
   - "No contractors yet" - Person with toolbox
   - "No cost data" - Empty piggy bank
   - "Seasonal checklist complete" - House with shield

4. **Loading Animations:**
   - Spinner (SVG)
   - Skeleton screens
   - Progress bars

### Design Tool Export
- Figma file with all components (if available)
- SVG exports for icons
- Color palette swatch
- Component library

---

## Conclusion

This specification provides a complete blueprint for transforming the FurnaceLog dashboard into a user-centered, visually stunning, and fully functional home maintenance hub. The design is rooted in Sarah's needs as a busy northern homeowner who values:

1. **Speed** - Glanceable status, quick actions
2. **Clarity** - Impossible to miss critical information
3. **Empowerment** - Know when to DIY, when to hire
4. **Control** - Track costs, manage contractors
5. **Peace of mind** - Confidence that nothing is overlooked

Every component, interaction, and visual detail serves these goals. The warm, inviting color palette creates a sense of home, while the clear information hierarchy and strong calls-to-action ensure Sarah (and all users) can accomplish their tasks efficiently.

The phased implementation approach allows for iterative improvements, gathering user feedback at each stage, while the comprehensive testing plan ensures quality and accessibility throughout.

**Next Steps:**
1. Review this specification with stakeholders
2. Create high-fidelity mockups in Figma (optional)
3. Begin Phase 1 implementation
4. User testing with 5-10 beta users
5. Iterate based on feedback
6. Launch Phase 2-4 features

This dashboard will become the heart of FurnaceLog, empowering northern homeowners to maintain safe, efficient homes through harsh winters and beyond.
