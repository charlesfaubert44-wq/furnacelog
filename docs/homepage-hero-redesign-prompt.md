# Homepage Hero Section Redesign Prompt

## Context
The current homepage displays too much data simultaneously, creating cognitive overload. We need to redesign the hero section to be more focused, contextual, and engaging while maintaining quick access to critical information.

## Current Problems
1. **Multiple weather locations** displayed at once when most users only care about their location
2. **Three alert cards** competing for attention simultaneously
3. **Static presentation** lacks interactivity and engagement
4. **Information hierarchy** unclear - everything feels equally important

## Design Objectives

### Primary Goals
- **Reduce cognitive load** by showing only the most relevant information
- **Prioritize user location** - show single weather card based on geolocation
- **Create engaging interactions** through thoughtful animations and progressive disclosure
- **Maintain critical alert visibility** without overwhelming the user
- **Guide user attention** through intentional information architecture

### Secondary Goals
- Make additional data accessible through intuitive interactions
- Increase time-on-page through engaging micro-interactions
- Build trust through clear, actionable information
- Create memorable visual moments that differentiate the product

## Redesign Requirements

### Weather Section Transformation

#### Single Location Focus
- Display **one weather card** based on user's detected location (IP or GPS)
- Prominent display with real-time temperature and conditions
- Location name clearly visible with option to change
- "Feels like" temperature for better context

#### Multi-Location Access Pattern
Choose ONE of these approaches:

**Option A: Horizontal Carousel**
- Swipeable carousel for saved locations
- Subtle indicators showing 2-3 more locations available
- Smooth, physics-based transitions
- Peek preview of next card (10-15% visible) to encourage exploration

**Option B: Expandable Card**
- Primary location shows prominently
- Subtle "+2 more locations" button or indicator
- Click/tap expands into accordion showing additional locations
- Collapse back to single view automatically after 5 seconds of inactivity

**Option C: Smart Rotation**
- Auto-rotate between saved locations every 8-10 seconds
- User can pause rotation on hover/tap
- Smooth fade transitions
- Small dots indicator showing position in sequence

**Option D: Contextual Display**
- Show the location with the most extreme conditions (coldest, warmest, most urgent)
- Smart badge: "Coldest location" or "Your location"
- One-tap to cycle through other locations
- Remember user preference for default view

### Alert System Transformation

#### Priority-Based Display
- Show **one primary alert** at a time based on urgency hierarchy:
  1. URGENT (red) - Immediate action required
  2. WARNING (orange) - Action needed soon
  3. INFO (green/blue) - System status
- Other alerts accessible through subtle indicator

#### Alert Presentation Patterns
Choose ONE of these approaches:

**Option A: Alert Stack with Counter**
- Display highest priority alert prominently
- Badge showing "+2 more alerts" if multiple exist
- Click badge to expand stack vertically
- Each alert compact but actionable

**Option B: Alert Ticker/Carousel**
- Featured alert shown fully
- Auto-advance to next alert every 6-8 seconds
- User can pause, navigate forward/back
- Progress dots showing total alerts

**Option C: Smart Alert Bar**
- Consolidated bar showing alert count by priority
- "2 urgent, 1 upcoming, 3 healthy systems"
- Click/tap to open modal with all alerts organized
- Most urgent alert has call-out preview

**Option D: Progressive Disclosure Panel**
- Minimal initial state: Icon badge with number
- Hover/tap reveals quick preview of top alert
- Full click opens detailed panel with all alerts
- Panel slides in from right side, doesn't navigate away

### Visual Design Enhancements

#### Micro-Interactions
- **Temperature updates**: Smooth count-up animation when values change
- **Alert arrivals**: Gentle slide-in with soft bounce
- **Card transitions**: Fluid, physics-based movement
- **Status indicators**: Pulse animation for active systems
- **Loading states**: Skeleton screens that morph into content

#### Visual Hierarchy
- Larger, bolder typography for critical information
- Use of white space to create breathing room
- Color coding that's accessible and meaningful:
  - Red (#DC2626): Urgent/critical
  - Orange (#F97316): Warning/upcoming
  - Green (#10B981): Healthy/good
  - Blue (#3B82F6): Info/neutral
- Depth through subtle shadows and layering

#### Accessibility Considerations
- ARIA labels for all interactive elements
- Keyboard navigation support
- Reduced motion option for users with vestibular disorders
- Sufficient color contrast (WCAG AA minimum)
- Screen reader announcements for alert changes

## Engagement Strategies

### Progressive Disclosure
- Start with minimal, essential information
- Reveal more details on user interaction
- Use hover states to preview additional information
- Provide clear affordances for "more info"

### Contextual Intelligence
- Time-based greetings ("Good morning" vs "Good evening")
- Weather-appropriate tips ("Extreme cold - check your heat trace cables")
- Proactive suggestions based on patterns
- Celebration moments ("All systems healthy for 30 days!")

### Subtle Gamification
- Streak tracking for system maintenance
- Achievement badges for preventive actions
- Energy savings visualization
- System health score with improving trend indicators

## Implementation Recommendations

### Animation Guidelines
- **Duration**: 200-300ms for small elements, 400-600ms for larger transitions
- **Easing**: `ease-out` for entering, `ease-in` for exiting, `ease-in-out` for movements
- **Respect user preferences**: Check `prefers-reduced-motion` media query
- **Performance**: Use CSS transforms and opacity (GPU-accelerated)

### Mobile-First Considerations
- Touch targets minimum 44x44px
- Swipe gestures for carousel navigation
- Larger tap areas for critical actions
- Bottom-sheet pattern for expanded views on mobile
- Consider thumb-reachable zones

### Data Loading Strategy
- Show skeleton/placeholder immediately
- Load critical data first (user location, urgent alerts)
- Lazy load secondary information
- Cache weather data (refresh every 15-30 minutes)
- Optimistic UI updates

## Content Strategy

### Weather Card Content (Priority Order)
1. **Current temperature** (large, prominent)
2. **Location name** (medium, with change option)
3. **Weather condition** (icon + description)
4. **Feels like temperature** (small, supplementary)
5. **High/Low for day** (optional, expandable)
6. **Last updated** (timestamp, small)

### Alert Card Content (Priority Order)
1. **Alert title** (clear, action-oriented)
2. **Urgency indicator** (color + badge)
3. **Brief description** (one sentence)
4. **Time context** ("Due in 6 hours", "Tomorrow")
5. **System affected** (icon + name)
6. **Quick action button** (optional, for urgent items)

## Success Metrics
- Reduced time to find critical information
- Increased engagement with alert system
- Lower bounce rate on homepage
- Higher click-through to detailed pages
- Positive user feedback on clarity and usability
- Decreased support requests about "where is X information"

## Example User Flows

### Flow 1: Quick Weather Check
1. User lands on homepage
2. Sees their location's current temperature immediately (-28°C, Whitehorse)
3. Notices indicator showing 2 more saved locations
4. Swipes carousel to see Yellowknife (-32°C)
5. Returns to default location
6. Total time: 3-5 seconds

### Flow 2: Alert Investigation
1. User sees "Extreme Cold Alert" badge (URGENT)
2. Notices "+2 more" indicator
3. Taps to expand alert panel
4. Reviews all three alerts in order of priority
5. Dismisses info alert, marks furnace filter task
6. Panel closes back to minimal state
7. Total time: 10-15 seconds

### Flow 3: System Status Overview
1. User wants to check if everything is okay
2. Sees single "All Systems Running" card (GREEN)
3. Taps to expand and see individual system status
4. Confirms Propane, HRV, Heat Trace all healthy
5. Collapses back to summary
6. Total time: 5-8 seconds

## Technical Considerations

### Component Architecture
```
<HeroSection>
  <WeatherDisplay mode="single|carousel" />
  <AlertDisplay mode="stack|ticker|bar" />
  <SystemStatus mode="summary|detailed" />
</HeroSection>
```

### State Management
- User location (stored, with override option)
- Saved locations array
- Alert queue (priority-sorted)
- User preferences (carousel speed, auto-advance on/off)
- Dismissed alerts
- Last refresh timestamp

### API Integration
- Geolocation API for user position
- Weather API with caching strategy
- Real-time alert system (WebSocket or polling)
- System status monitoring
- User preferences sync

## Inspiration & References

### Design Patterns to Consider
- Apple Weather app (clean, minimal, progressive disclosure)
- Nest thermostat interface (clear status, simple controls)
- Google Material Design (meaningful motion, clear hierarchy)
- iOS notifications (priority-based, actionable)

### Animation References
- Framer Motion for React animations
- GSAP for complex sequences
- CSS transitions for simple states
- Lottie for micro-interactions

## Next Steps

1. **Wireframe** the chosen patterns for weather and alerts
2. **Prototype** interaction patterns (Figma, Framer, or CodePen)
3. **User test** with 3-5 target users (northern homeowners)
4. **Iterate** based on feedback
5. **Develop** in phases (MVP → enhancements)
6. **Measure** success metrics after launch
7. **Optimize** based on analytics and user behavior

## Key Decisions Required

Before implementation, decide on:
1. Weather display pattern (A, B, C, or D?)
2. Alert display pattern (A, B, C, or D?)
3. Auto-advance timing (if applicable)
4. Mobile interaction model
5. Animation complexity level
6. Accessibility priority features

---

**Remember**: The goal is not to hide information, but to present it in a way that respects the user's attention and makes critical information immediately actionable while keeping everything else easily accessible.
