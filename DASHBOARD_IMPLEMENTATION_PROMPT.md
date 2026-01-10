# FurnaceLog Dashboard - Complete Implementation Prompt

## Mission Statement

Create a **fully functional, production-ready central dashboard** for FurnaceLog that serves as the intelligent command center for Northern Canadian homeowners. This is NOT a prototype - every feature must work end-to-end with real data, calculations, and integrations. No placeholders, no "TODO" comments, no mock data in production code.

---

## Executive Overview

Build an intuitive, visually stunning dashboard that combines:
- **Intelligence**: Proactive AI-driven maintenance recommendations based on weather, system age, and usage patterns
- **Simplicity**: One-click logging, drag-and-drop scheduling, instant contractor access
- **Awareness**: Real-time alerts for critical issues, upcoming maintenance, warranty expirations
- **Completeness**: Everything a homeowner needs in one centralized, beautiful interface

The dashboard should feel like having a home maintenance expert living in your pocket - anticipating needs, preventing problems, and making complex home management effortless.

---

## Technical Foundation

### Stack Requirements
- **Frontend**: React 18+ with TypeScript, Vite build system
- **State Management**: React Query (TanStack Query) for server state + Zustand for UI state
- **UI Framework**: Tailwind CSS 3+ with custom warm color palette
- **Charts/Visualizations**: Recharts for data viz, FullCalendar for scheduling
- **Date Handling**: date-fns for all date operations
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React (consistent with existing design)
- **Real-time**: WebSocket connection for live alerts and notifications
- **Forms**: React Hook Form + Zod validation

### Backend Integration
- **API Base**: `/api/v1` - all endpoints already exist
- **Authentication**: JWT tokens in httpOnly cookies (already configured)
- **WebSocket**: Connect to `ws://localhost:3000` for real-time updates
- **File Uploads**: Use presigned URLs from storage service

---

## Dashboard Layout Architecture

### Main Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo | Home Name | Weather Widget | Alerts | User  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  Main Content Area                            │
│  │          │  (Dynamic based on selected view)             │
│  │ Sidebar  │                                                │
│  │ Nav      │                                                │
│  │          │                                                │
│  │ - Home   │                                                │
│  │ - Sys    │                                                │
│  │ - Maint  │                                                │
│  │ - Cal    │                                                │
│  │ - Contr  │                                                │
│  │ - Alert  │                                                │
│  │ - Reports│                                                │
│  └──────────┘                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Implementation Specifications

## 1. INTELLIGENT HOME OVERVIEW (Default View)

### Top Stats Cards (4-across responsive grid)

**Card 1: System Health Score**
- **Calculation Algorithm**:
  ```typescript
  // Fetch all systems for the home
  const systems = await api.get('/systems?homeId=X');

  // Calculate health score (0-100)
  let score = 100;
  const now = new Date();

  systems.forEach(system => {
    // Deduct points for overdue maintenance
    const lastMaintenance = system.maintenanceHistory[0]?.date;
    const recommendedInterval = system.maintenanceSchedule?.intervalDays || 365;
    const daysSinceLastMaintenance = differenceInDays(now, lastMaintenance);

    if (daysSinceLastMaintenance > recommendedInterval) {
      const overdueDays = daysSinceLastMaintenance - recommendedInterval;
      score -= Math.min(overdueDays / 10, 20); // Max 20 points per system
    }

    // Deduct for age-related degradation
    const systemAge = differenceInYears(now, system.installDate);
    const expectedLifespan = system.expectedLifespan || 15;
    const ageRatio = systemAge / expectedLifespan;

    if (ageRatio > 0.8) {
      score -= (ageRatio - 0.8) * 50; // Deduct more as it approaches end-of-life
    }

    // Deduct for failed status
    if (system.status === 'failed') score -= 30;
    if (system.status === 'needs-repair') score -= 15;
  });

  return Math.max(0, Math.round(score));
  ```

- **Visual**: Circular progress ring with color gradient
  - 90-100: Green (#10b981)
  - 70-89: Yellow (#f59e0b)
  - 50-69: Orange (#f97316)
  - 0-49: Red (#ef4444)
- **Click Action**: Navigate to Systems page with issues highlighted
- **Subtext**: "X systems need attention" (clickable)

**Card 2: Upcoming Maintenance**
- **Data Source**:
  ```typescript
  // Query next 30 days of scheduled maintenance
  const upcoming = await api.get('/maintenance/scheduled', {
    params: {
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      status: 'pending'
    }
  });

  // Group by urgency
  const overdue = upcoming.filter(m => isPast(parseISO(m.dueDate)));
  const thisWeek = upcoming.filter(m =>
    isWithinInterval(parseISO(m.dueDate), {
      start: new Date(),
      end: addDays(new Date(), 7)
    })
  );
  ```

- **Visual**: Stacked list with color-coded urgency dots
  - Overdue: Red dot
  - This week: Orange dot
  - This month: Yellow dot
- **Click Action**: Open quick-log modal for that specific task
- **Hover**: Show system details and last maintenance date

**Card 3: Active Alerts**
- **Data Sources**:
  ```typescript
  // Combine multiple alert sources
  const weatherAlerts = await api.get('/weather/alerts'); // Extreme cold warnings
  const warrantyAlerts = await api.get('/warranties/expiring'); // <90 days
  const systemAlerts = await api.get('/systems/alerts'); // Failed/degraded systems
  const costAlerts = await api.get('/analytics/cost-alerts'); // Spending anomalies

  // Priority scoring
  const prioritized = [...allAlerts].sort((a, b) => {
    const priorityMap = { critical: 3, high: 2, medium: 1, low: 0 };
    return priorityMap[b.priority] - priorityMap[a.priority];
  });
  ```

- **Visual**: Alert badge with count, expandable dropdown
- **Real-time**: WebSocket updates for new alerts
- **Actions**:
  - Dismiss alert (PATCH `/alerts/:id/dismiss`)
  - Take action (context-specific - contact contractor, schedule maintenance, etc.)

**Card 4: This Month's Costs**
- **Calculation**:
  ```typescript
  const thisMonth = await api.get('/maintenance/logs', {
    params: {
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new.Date()), 'yyyy-MM-dd')
    }
  });

  const totalCost = thisMonth.reduce((sum, log) => {
    const partsCost = log.parts?.reduce((s, p) => s + p.cost, 0) || 0;
    const laborCost = log.laborHours * (log.hourlyRate || 0);
    return sum + partsCost + laborCost;
  }, 0);

  // Compare to 6-month average
  const sixMonthAvg = await api.get('/analytics/average-monthly-cost');
  const percentChange = ((totalCost - sixMonthAvg) / sixMonthAvg) * 100;
  ```

- **Visual**: Large dollar amount with sparkline chart of last 6 months
- **Trend Indicator**: Up/down arrow with percentage
- **Click Action**: Navigate to Cost Analytics page

---

### Weather-Integrated Recommendations Panel

**Purpose**: Display intelligent, actionable recommendations based on current weather conditions, forecast, and home systems.

**Data Integration**:
```typescript
// Fetch current weather and home systems
const weather = await api.get('/weather/current', { params: { homeId } });
const systems = await api.get('/systems', { params: { homeId } });
const forecast = await api.get('/weather/forecast?days=7');

// Generate recommendations using backend service
const recommendations = await api.get('/weather/recommendations', {
  params: { homeId }
});

// Frontend augmentation with urgency scoring
const enrichedRecommendations = recommendations.map(rec => ({
  ...rec,
  urgencyScore: calculateUrgency(rec, weather, systems),
  estimatedTime: estimateCompletionTime(rec.action),
  priority: rec.weather?.temperature?.low < -35 ? 'critical' : rec.priority
}));
```

**Visual Design**:
- **Card-based layout** with gradient backgrounds matching urgency
- **Temperature widget** embedded (large, prominent)
- **System-specific icons** (furnace, heat trace, plumbing, etc.)
- **One-click actions**:
  - "Log Completion" → Quick-log modal pre-filled
  - "Schedule" → Calendar modal with suggested dates
  - "Learn More" → System-specific maintenance guide

**Example Recommendations**:

```typescript
// CRITICAL: Temperature below -35°C
{
  id: 'rec-001',
  title: 'Verify Heat Trace Operational',
  description: 'Extreme cold warning: -38°C expected tonight',
  system: { id: 'sys-123', type: 'heat-trace', name: 'Water Line Heat Trace' },
  priority: 'critical',
  urgencyScore: 95,
  action: 'check-operation',
  estimatedTime: '10 minutes',
  icon: 'Zap',
  gradient: 'from-red-500 to-orange-500',
  actions: [
    { label: 'Mark as Checked', action: 'log-completion' },
    { label: 'Call Emergency Contractor', action: 'contact-contractor', contractorType: 'electrician' }
  ]
}

// HIGH: Seasonal maintenance
{
  id: 'rec-002',
  title: 'Furnace Filter Change Due',
  description: 'Recommended every 90 days, last changed 85 days ago',
  system: { id: 'sys-456', type: 'furnace', name: 'Main Furnace' },
  priority: 'high',
  urgencyScore: 70,
  action: 'filter-change',
  estimatedTime: '15 minutes',
  parts: [{ name: '16x25x4 MERV 11 Filter', estimatedCost: 35, vendor: 'Home Hardware' }],
  actions: [
    { label: 'Log Completion', action: 'log-completion' },
    { label: 'Order Filter', action: 'external-link', url: 'https://...' }
  ]
}
```

**Interaction**:
- **Swipeable cards** on mobile
- **Dismiss temporarily** (hide for 7 days)
- **Snooze** (remind me in X days)
- **Complete and log** (one-click workflow)

---

### Quick Action Bar

**Fixed position bar** (bottom on mobile, top-right on desktop) with 4 primary actions:

**1. Log Maintenance (Primary Action)**
```typescript
// Opens modal with smart defaults
const QuickLogModal = () => {
  const [step, setStep] = useState(1); // 3-step wizard
  const [data, setData] = useState({
    system: null,      // Step 1: Select system
    taskType: null,    // Step 2: What did you do?
    details: {}        // Step 3: Additional details
  });

  // Step 1: System Selection
  // - Show all systems as cards with photos
  // - Smart suggestions based on:
  //   - Overdue maintenance
  //   - Recent activity
  //   - Current weather recommendations

  // Step 2: Task Type
  // - Pre-defined tasks based on selected system
  // - Custom task option
  // - Examples: "Filter Change", "Visual Inspection", "Repair", "Cleaning"

  // Step 3: Details
  // - Task-specific fields (dynamic based on taskType)
  // - Photo upload (drag-and-drop + camera on mobile)
  // - Cost tracking (parts + labor)
  // - Notes (rich text editor)
  // - Timestamp (defaults to now, editable)

  // Submit
  const submit = async () => {
    const formData = {
      systemId: data.system.id,
      taskType: data.taskType,
      date: data.timestamp || new Date(),
      notes: data.notes,
      photos: data.photos, // Upload to /storage/upload
      cost: {
        parts: data.partsCost || 0,
        labor: data.laborCost || 0,
        total: (data.partsCost || 0) + (data.laborCost || 0)
      },
      performedBy: 'owner', // or contractor
      nextDueDate: calculateNextDueDate(data.system, data.taskType)
    };

    await api.post('/maintenance/logs', formData);

    // Success feedback
    toast.success('Maintenance logged!');

    // Ask: Schedule next occurrence?
    if (isRecurring(data.taskType)) {
      showSchedulePrompt(formData.nextDueDate);
    }
  };
};
```

**Visual**: Large orange button with icon, tooltip on hover, keyboard shortcut (Cmd/Ctrl+L)

**2. Contact Contractor**
```typescript
// Opens contractor quick-contact modal
const ContractorQuickContact = () => {
  // Show contractors grouped by specialty
  const contractors = await api.get('/contractors');

  // Smart sorting:
  // 1. Contractors currently working on active projects
  // 2. Contractors with highest rating
  // 3. Contractors with relevant specialty for current alerts

  // One-click actions:
  // - Call (tel: link)
  // - Text/SMS (sms: link)
  // - Email (mailto: with pre-filled subject from context)
  // - Schedule Appointment (opens calendar with contractor availability)

  // Context-aware:
  // If clicked from a system alert, pre-select contractors with that specialty
  // If clicked from a recommendation, include recommendation details in message
};
```

**Visual**: Blue button with phone icon

**3. Schedule Task**
```typescript
// Opens mini-calendar overlay
const QuickSchedule = () => {
  // Show calendar view (month by default)
  // Highlight:
  // - Existing scheduled maintenance (green dots)
  // - Overdue tasks (red dots)
  // - Contractor appointments (blue dots)

  // Click date → Show tasks for that day
  // Drag and drop to reschedule
  // Click "Add Task" → Quick task creation
  //   - System selection
  //   - Task type
  //   - Set reminder (email + push notification)
  //   - Recurring options (weekly, monthly, quarterly, annually)

  // Email reminder logic
  const scheduleReminders = async (task) => {
    await api.post('/notifications/schedule', {
      taskId: task.id,
      type: 'email',
      schedule: {
        '7days': task.dueDate - 7 days,
        '1day': task.dueDate - 1 day,
        'due': task.dueDate
      },
      template: 'maintenance-reminder',
      data: {
        systemName: task.system.name,
        taskType: task.type,
        estimatedTime: task.estimatedDuration
      }
    });
  };
};
```

**Visual**: Green button with calendar icon

**4. View Alerts**
```typescript
// Opens alerts sidebar (slides from right)
const AlertsSidebar = () => {
  // Group alerts by priority
  // - Critical (red): Requires immediate action
  // - High (orange): Within 7 days
  // - Medium (yellow): Within 30 days
  // - Info (blue): FYI/educational

  // Each alert shows:
  // - Title + description
  // - Affected system (with photo)
  // - Recommended action
  // - Quick actions:
  //   - Dismiss
  //   - Snooze (1 day, 3 days, 1 week)
  //   - Take Action (context-specific)
  //   - Learn More

  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      if (alert.type === 'new-alert') {
        // Show toast notification
        // Add to alerts list with animation
        // Play subtle sound if enabled
      }
    };
  }, []);
};
```

**Visual**: Red button with bell icon and badge count

---

### Active Systems Grid

**Purpose**: Visual at-a-glance status of all home systems

**Layout**: Responsive grid (4 columns desktop, 2 tablet, 1 mobile)

**System Card Design**:
```typescript
interface SystemCard {
  system: {
    id: string;
    name: string;
    type: string;
    photo: string; // Display actual photo uploaded by user
    status: 'operational' | 'needs-attention' | 'failed' | 'unknown';
    installDate: Date;
    lastMaintenance: Date;
    nextDueDate: Date;
    healthScore: number; // 0-100
  };

  // Visual indicators
  statusColor: string; // Green, Yellow, Red, Gray
  daysUntilMaintenance: number;
  urgencyLevel: 'ok' | 'soon' | 'overdue';

  // Interactive elements
  onClick: () => void; // Navigate to system detail page
  quickActions: [
    { label: 'Log Maintenance', action: () => openQuickLog(system.id) },
    { label: 'View History', action: () => navigate(`/systems/${system.id}/history`) },
    { label: 'Schedule Service', action: () => openScheduler(system.id) }
  ];
}
```

**Visual Design**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {systems.map(system => (
    <Card
      key={system.id}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all hover:shadow-lg",
        "group hover:-translate-y-1"
      )}
      onClick={() => navigate(`/systems/${system.id}`)}
    >
      {/* Status Indicator - Top Right Badge */}
      <Badge className={getStatusColor(system.status)}>
        {system.status}
      </Badge>

      {/* System Photo */}
      <div className="aspect-video relative">
        <img
          src={system.photo || '/default-system-images/' + system.type + '.jpg'}
          alt={system.name}
          className="object-cover w-full h-full"
        />
        {/* Overlay with quick actions on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary">Log Work</Button>
          <Button size="sm" variant="outline">Schedule</Button>
        </div>
      </div>

      {/* System Info */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{system.name}</h3>
        <p className="text-sm text-muted-foreground capitalize">{system.type}</p>

        {/* Health Score Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Health</span>
            <span className={getHealthColor(system.healthScore)}>{system.healthScore}%</span>
          </div>
          <Progress value={system.healthScore} className="h-2" />
        </div>

        {/* Last Maintenance */}
        <div className="mt-3 text-sm">
          <p className="text-muted-foreground">Last service:</p>
          <p className="font-medium">
            {formatDistanceToNow(parseISO(system.lastMaintenance), { addSuffix: true })}
          </p>
        </div>

        {/* Next Due */}
        {system.nextDueDate && (
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Next due:</p>
            <p className={cn(
              "font-medium",
              isPast(parseISO(system.nextDueDate)) ? "text-red-600" : "text-foreground"
            )}>
              {format(parseISO(system.nextDueDate), 'MMM d, yyyy')}
              {isPast(parseISO(system.nextDueDate)) && " (Overdue)"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>
```

**Calculations**:
```typescript
// Health score calculation for individual system
const calculateSystemHealth = (system) => {
  let health = 100;

  // Factor 1: Maintenance currency (40% weight)
  const daysSinceLastMaintenance = differenceInDays(new Date(), system.lastMaintenance);
  const recommendedInterval = system.maintenanceSchedule?.intervalDays || 365;
  const maintenanceRatio = daysSinceLastMaintenance / recommendedInterval;

  if (maintenanceRatio > 1) {
    health -= Math.min((maintenanceRatio - 1) * 40, 40);
  }

  // Factor 2: Age degradation (30% weight)
  const age = differenceInYears(new Date(), system.installDate);
  const lifespan = system.expectedLifespan || 15;
  const ageRatio = age / lifespan;

  if (ageRatio > 0.5) {
    health -= (ageRatio - 0.5) * 60; // Accelerating decline
  }

  // Factor 3: Issue history (30% weight)
  const recentIssues = system.maintenanceHistory.filter(log =>
    log.type === 'repair' &&
    differenceInMonths(new Date(), log.date) < 12
  ).length;

  health -= recentIssues * 10;

  return Math.max(0, Math.round(health));
};
```

**Sorting Options** (Dropdown in top-right):
- Status (Failed → Needs Attention → OK)
- Next Maintenance Due (Soonest first)
- Health Score (Lowest first)
- Recently Added
- Alphabetical

**Filtering** (Multi-select checkboxes):
- System Type (Heating, Cooling, Plumbing, Electrical, etc.)
- Status
- Location (if systems have location tags)

---

## 2. INTERACTIVE CALENDAR VIEW

**Implementation**: FullCalendar with custom event rendering

### Calendar Configuration
```typescript
const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month'); // month, week, day, agenda

  // Fetch all calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      const [scheduled, completed, contractor] = await Promise.all([
        api.get('/maintenance/scheduled'),
        api.get('/maintenance/logs'),
        api.get('/contractors/appointments')
      ]);

      const formattedEvents = [
        // Scheduled maintenance
        ...scheduled.map(m => ({
          id: m.id,
          title: `${m.system.name}: ${m.taskType}`,
          start: m.dueDate,
          end: m.dueDate,
          backgroundColor: m.priority === 'high' ? '#f97316' : '#3b82f6',
          borderColor: m.priority === 'high' ? '#ea580c' : '#2563eb',
          extendedProps: {
            type: 'scheduled',
            system: m.system,
            taskType: m.taskType,
            estimatedDuration: m.estimatedDuration,
            notes: m.notes,
            status: 'pending'
          }
        })),

        // Completed maintenance (read-only)
        ...completed.map(log => ({
          id: log.id,
          title: `✓ ${log.system.name}: ${log.taskType}`,
          start: log.date,
          end: log.date,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          extendedProps: {
            type: 'completed',
            ...log
          }
        })),

        // Contractor appointments
        ...contractor.map(appt => ({
          id: appt.id,
          title: `${appt.contractor.name} - ${appt.purpose}`,
          start: appt.startTime,
          end: appt.endTime,
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          extendedProps: {
            type: 'contractor',
            ...appt
          }
        }))
      ];

      setEvents(formattedEvents);
    };

    fetchEvents();
  }, []);

  // Event click handler
  const handleEventClick = (info) => {
    const { type } = info.event.extendedProps;

    if (type === 'scheduled') {
      showTaskDetailModal(info.event);
    } else if (type === 'completed') {
      showMaintenanceLogModal(info.event);
    } else if (type === 'contractor') {
      showContractorAppointmentModal(info.event);
    }
  };

  // Drag and drop rescheduling
  const handleEventDrop = async (info) => {
    const { id, extendedProps } = info.event;

    if (extendedProps.type !== 'scheduled') {
      info.revert(); // Can't move completed tasks
      toast.error("Can't reschedule completed tasks");
      return;
    }

    // Update on server
    await api.patch(`/maintenance/scheduled/${id}`, {
      dueDate: format(info.event.start, 'yyyy-MM-dd')
    });

    // Update email reminders
    await api.post(`/notifications/reschedule`, {
      taskId: id,
      newDate: info.event.start
    });

    toast.success('Task rescheduled');
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={view}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      }}
      events={events}
      eventClick={handleEventClick}
      editable={true}
      droppable={true}
      eventDrop={handleEventDrop}
      eventContent={renderEventContent}
      dateClick={handleDateClick} // Click empty date to add task
      height="auto"
      slotMinTime="06:00:00"
      slotMaxTime="22:00:00"
      allDaySlot={false}
    />
  );
};
```

### Custom Event Rendering
```typescript
const renderEventContent = (eventInfo) => {
  const { type, system, taskType } = eventInfo.event.extendedProps;

  return (
    <div className="p-1 text-xs">
      <div className="font-semibold truncate">{eventInfo.event.title}</div>
      {type === 'scheduled' && (
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3" />
          <span>{eventInfo.event.extendedProps.estimatedDuration || '30m'}</span>
        </div>
      )}
    </div>
  );
};
```

### Date Click (Add New Task)
```typescript
const handleDateClick = (info) => {
  openTaskCreationModal({
    prefilledDate: info.date,
    onSubmit: async (taskData) => {
      // Create scheduled maintenance
      const task = await api.post('/maintenance/schedule', {
        ...taskData,
        dueDate: format(info.date, 'yyyy-MM-dd'),
        emailReminders: {
          enabled: true,
          schedule: ['7days', '1day', 'morning-of']
        }
      });

      // Add to calendar
      setEvents(prev => [...prev, task]);
    }
  });
};
```

### Email Reminder System
```typescript
// Backend handles sending, but frontend allows configuration
const EmailReminderConfig = ({ task }) => {
  const [reminders, setReminders] = useState({
    '7days': true,    // 7 days before
    '3days': false,   // 3 days before
    '1day': true,     // 1 day before
    'morning': true,  // Morning of (8 AM)
    '1hour': false    // 1 hour before
  });

  const saveReminderPreferences = async () => {
    await api.patch(`/maintenance/scheduled/${task.id}/reminders`, {
      emailReminders: reminders
    });
  };

  return (
    <div className="space-y-2">
      <Label>Email Reminders</Label>
      {Object.entries(reminders).map(([key, enabled]) => (
        <Checkbox
          key={key}
          checked={enabled}
          onCheckedChange={(checked) => {
            setReminders(prev => ({ ...prev, [key]: checked }));
          }}
          label={formatReminderLabel(key)}
        />
      ))}
      <Button onClick={saveReminderPreferences}>Save Preferences</Button>
    </div>
  );
};
```

### Recurring Tasks
```typescript
const RecurringTaskSetup = () => {
  const [recurrence, setRecurrence] = useState({
    enabled: false,
    frequency: 'monthly', // daily, weekly, monthly, quarterly, annually
    interval: 1,          // Every X frequency
    endDate: null,        // Or null for indefinite
    occurrences: null     // Or number of occurrences
  });

  const createRecurringTasks = async (baseTask) => {
    // Generate series of scheduled tasks
    const tasks = [];
    let currentDate = parseISO(baseTask.dueDate);
    const endDate = recurrence.endDate ? parseISO(recurrence.endDate) : addYears(currentDate, 5);

    let count = 0;
    while (currentDate <= endDate) {
      if (recurrence.occurrences && count >= recurrence.occurrences) break;

      tasks.push({
        ...baseTask,
        dueDate: format(currentDate, 'yyyy-MM-dd'),
        recurrenceId: baseTask.id, // Link to parent
        occurrenceNumber: count + 1
      });

      // Increment date based on frequency
      switch (recurrence.frequency) {
        case 'daily':
          currentDate = addDays(currentDate, recurrence.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, recurrence.interval);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, recurrence.interval);
          break;
        case 'quarterly':
          currentDate = addMonths(currentDate, recurrence.interval * 3);
          break;
        case 'annually':
          currentDate = addYears(currentDate, recurrence.interval);
          break;
      }

      count++;
    }

    // Batch create
    await api.post('/maintenance/scheduled/batch', { tasks });
  };
};
```

---

## 3. SYSTEMS MANAGEMENT

### System Detail Page

**Route**: `/systems/:systemId`

**Layout**:
```
┌────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                   │
├────────────────────────────────────────────────────────┤
│  Photo Gallery (3-5 photos)        │  System Info Card │
│  - Installation                     │  - Type           │
│  - Current state                    │  - Install Date   │
│  - Components                       │  - Age            │
│                                     │  - Status         │
│                                     │  - Health Score   │
├────────────────────────────────────────────────────────┤
│  Quick Stats (4 cards)                                 │
│  - Total Cost    - Last Service  - Next Due - Warranty │
├────────────────────────────────────────────────────────┤
│  Tabs:                                                 │
│  • Maintenance History                                 │
│  • Components                                          │
│  • Documents & Manuals                                 │
│  • Cost Analysis                                       │
│  • Timeline Visualization                              │
└────────────────────────────────────────────────────────┘
```

**Maintenance History Tab**:
```typescript
const MaintenanceHistoryTab = ({ systemId }) => {
  const { data: history } = useQuery(['maintenance-history', systemId], () =>
    api.get(`/maintenance/logs?systemId=${systemId}&sort=-date`)
  );

  return (
    <div className="space-y-4">
      {/* Timeline view */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        {history?.map((log, index) => (
          <div key={log.id} className="relative flex gap-4 pb-8">
            {/* Timeline dot */}
            <div className={cn(
              "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
              log.type === 'repair' ? "bg-orange-500 border-orange-600" : "bg-green-500 border-green-600"
            )}>
              {log.type === 'repair' ? <Wrench className="h-4 w-4 text-white" /> : <Check className="h-4 w-4 text-white" />}
            </div>

            {/* Content card */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{log.taskType}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {format(parseISO(log.date), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{log.notes}</p>

                {/* Photos */}
                {log.photos?.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {log.photos.map(photo => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Maintenance photo"
                        className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => openLightbox(log.photos, photo.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Cost breakdown */}
                {log.cost && (
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Parts:</span>
                      <span className="font-medium ml-2">${log.cost.parts}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Labor:</span>
                      <span className="font-medium ml-2">${log.cost.labor}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold ml-2">${log.cost.total}</span>
                    </div>
                  </div>
                )}

                {/* Performed by */}
                <div className="mt-2 text-sm text-muted-foreground">
                  Performed by: {log.performedBy === 'owner' ? 'You' : log.contractor?.name}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {history?.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No maintenance history yet</h3>
          <p className="text-muted-foreground mt-2">Start logging maintenance to track this system's health</p>
          <Button className="mt-4" onClick={() => openQuickLog(systemId)}>
            Log First Maintenance
          </Button>
        </div>
      )}
    </div>
  );
};
```

**Cost Analysis Tab**:
```typescript
const CostAnalysisTab = ({ systemId }) => {
  const { data: costData } = useQuery(['cost-analysis', systemId], () =>
    api.get(`/analytics/system-costs/${systemId}`)
  );

  // Calculate metrics
  const totalLifetimeCost = costData?.logs.reduce((sum, log) => sum + log.cost.total, 0) || 0;
  const averageAnnualCost = totalLifetimeCost / differenceInYears(new Date(), costData?.system.installDate) || 0;
  const costByYear = groupBy(costData?.logs, log => format(parseISO(log.date), 'yyyy'));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Lifetime Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalLifetimeCost.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg. Annual Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${averageAnnualCost.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Last 12 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${calculateLast12Months(costData?.logs)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost trend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Trend (Annual)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(costByYear).map(([year, logs]) => ({
              year,
              parts: logs.reduce((sum, log) => sum + log.cost.parts, 0),
              labor: logs.reduce((sum, log) => sum + log.cost.labor, 0),
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="parts" stackId="a" fill="#3b82f6" name="Parts" />
              <Bar dataKey="labor" stackId="a" fill="#f59e0b" name="Labor" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Parts breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Most Replaced Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>Times Replaced</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Avg. Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculatePartsStats(costData?.logs).map(part => (
                <TableRow key={part.name}>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.count}</TableCell>
                  <TableCell>${part.totalCost.toFixed(2)}</TableCell>
                  <TableCell>${part.avgCost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 4. CONTRACTOR MANAGEMENT

### Contractor Directory

**Route**: `/contractors`

**Features**:
```typescript
const ContractorDirectory = () => {
  const [contractors, setContractors] = useState([]);
  const [filters, setFilters] = useState({
    specialty: 'all',
    rating: 0,
    availability: 'all',
    searchQuery: ''
  });

  // Fetch with filters
  const { data, isLoading } = useQuery(['contractors', filters], () =>
    api.get('/contractors', { params: filters })
  );

  // Smart sorting
  const sortedContractors = useMemo(() => {
    return [...(data || [])].sort((a, b) => {
      // Priority 1: Active projects
      if (a.activeProjects > 0 && b.activeProjects === 0) return -1;
      if (a.activeProjects === 0 && b.activeProjects > 0) return 1;

      // Priority 2: Rating
      if (a.averageRating !== b.averageRating) {
        return b.averageRating - a.averageRating;
      }

      // Priority 3: Response time
      return a.averageResponseTime - b.averageResponseTime;
    });
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search contractors..."
          value={filters.searchQuery}
          onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
          className="flex-1"
        />

        <Select
          value={filters.specialty}
          onValueChange={(value) => setFilters(f => ({ ...f, specialty: value }))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            <SelectItem value="plumber">Plumber</SelectItem>
            <SelectItem value="electrician">Electrician</SelectItem>
            <SelectItem value="hvac">HVAC Technician</SelectItem>
            <SelectItem value="general">General Contractor</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => openAddContractorModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contractor
        </Button>
      </div>

      {/* Contractor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContractors.map(contractor => (
          <ContractorCard key={contractor.id} contractor={contractor} />
        ))}
      </div>
    </div>
  );
};

const ContractorCard = ({ contractor }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={contractor.photo} />
              <AvatarFallback>{contractor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{contractor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{contractor.company}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{contractor.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specialties */}
        <div className="flex flex-wrap gap-2">
          {contractor.specialties.map(specialty => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Contact methods */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.location.href = `tel:${contractor.phone}`}
          >
            <Phone className="h-4 w-4 mr-2" />
            {contractor.phone}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.location.href = `mailto:${contractor.email}`}
          >
            <Mail className="h-4 w-4 mr-2" />
            {contractor.email}
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Projects</p>
            <p className="text-lg font-semibold">{contractor.completedProjects}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Response</p>
            <p className="text-lg font-semibold">{contractor.averageResponseTime}h</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            onClick={() => openScheduleAppointmentModal(contractor)}
          >
            Schedule
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/contractors/${contractor.id}`)}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Schedule Appointment Modal
```typescript
const ScheduleAppointmentModal = ({ contractor, onClose }) => {
  const [formData, setFormData] = useState({
    contractorId: contractor.id,
    date: null,
    time: null,
    duration: 60, // minutes
    purpose: '',
    systemId: null,
    notes: '',
    sendConfirmation: true
  });

  // Fetch contractor availability
  const { data: availability } = useQuery(
    ['contractor-availability', contractor.id],
    () => api.get(`/contractors/${contractor.id}/availability`)
  );

  const submitAppointment = async () => {
    const appointment = await api.post('/contractors/appointments', {
      ...formData,
      startTime: combineDateAndTime(formData.date, formData.time),
      endTime: addMinutes(combineDateAndTime(formData.date, formData.time), formData.duration)
    });

    // Send confirmation email to contractor
    if (formData.sendConfirmation) {
      await api.post(`/contractors/appointments/${appointment.id}/send-confirmation`);
    }

    toast.success(`Appointment scheduled with ${contractor.name}`);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Appointment with {contractor.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* System selection */}
          <div>
            <Label>Related System (Optional)</Label>
            <Select
              value={formData.systemId}
              onValueChange={(value) => setFormData(f => ({ ...f, systemId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a system" />
              </SelectTrigger>
              <SelectContent>
                {/* Populate with user's systems */}
              </SelectContent>
            </Select>
          </div>

          {/* Date picker with availability */}
          <div>
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData(f => ({ ...f, date }))}
              disabled={(date) => {
                // Disable dates contractor is unavailable
                return !isAvailable(date, availability);
              }}
              className="rounded-md border"
            />
          </div>

          {/* Time slots */}
          {formData.date && (
            <div>
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {getTimeSlots(formData.date, availability).map(slot => (
                  <Button
                    key={slot}
                    variant={formData.time === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(f => ({ ...f, time: slot }))}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Purpose */}
          <div>
            <Label>Purpose</Label>
            <Textarea
              value={formData.purpose}
              onChange={(e) => setFormData(f => ({ ...f, purpose: e.target.value }))}
              placeholder="What needs to be done?"
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any specific details the contractor should know?"
            />
          </div>

          {/* Send confirmation */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.sendConfirmation}
              onCheckedChange={(checked) => setFormData(f => ({ ...f, sendConfirmation: checked }))}
            />
            <Label>Send confirmation email to contractor</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submitAppointment} disabled={!formData.date || !formData.time}>
            Schedule Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 5. ALERTS & NOTIFICATIONS

### Real-time Alert System

**WebSocket Integration**:
```typescript
const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    api.get('/alerts').then(data => {
      setAlerts(data.alerts);
      setUnreadCount(data.alerts.filter(a => !a.read).length);
    });

    // WebSocket connection
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Alert WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'new-alert') {
        const alert = message.data;

        // Add to state
        setAlerts(prev => [alert, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show toast notification
        toast({
          title: alert.title,
          description: alert.message,
          variant: alert.priority === 'critical' ? 'destructive' : 'default',
          action: (
            <Button size="sm" onClick={() => handleAlertAction(alert)}>
              Take Action
            </Button>
          )
        });

        // Play notification sound (if enabled)
        if (getNotificationPreferences().soundEnabled) {
          playNotificationSound(alert.priority);
        }

        // Send push notification (if permission granted)
        if (Notification.permission === 'granted') {
          new Notification(alert.title, {
            body: alert.message,
            icon: '/logo.png',
            tag: alert.id
          });
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      // Implement reconnection logic
      setTimeout(() => {
        // Retry connection
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { alerts, unreadCount, setAlerts };
};
```

### Alert Types & Logic

**1. Weather Alerts**
```typescript
// Backend generates these, frontend displays
{
  type: 'weather',
  priority: 'critical',
  title: 'Extreme Cold Warning',
  message: 'Temperature dropping to -42°C tonight. Check heat trace and water lines.',
  systemIds: ['heat-trace-1', 'plumbing-1'],
  actions: [
    { label: 'Mark Systems Checked', action: 'bulk-log', systemIds: [...] },
    { label: 'Call Emergency Contractor', action: 'contact-contractor', specialty: 'plumber' }
  ],
  autoExpire: addHours(new Date(), 24),
  source: 'Environment Canada'
}
```

**2. Warranty Expiration Alerts**
```typescript
{
  type: 'warranty',
  priority: 'high',
  title: 'Furnace Warranty Expiring Soon',
  message: 'Main Furnace warranty expires in 45 days. Consider scheduling inspection.',
  systemId: 'furnace-1',
  expiryDate: '2026-02-23',
  actions: [
    { label: 'Schedule Inspection', action: 'schedule-task', systemId: 'furnace-1' },
    { label: 'Contact Installer', action: 'contact-contractor', contractorId: 'contractor-123' },
    { label: 'Extend Warranty', action: 'external-link', url: 'https://...' }
  ]
}
```

**3. Maintenance Overdue Alerts**
```typescript
{
  type: 'maintenance-overdue',
  priority: 'medium',
  title: 'Overdue: HRV Filter Change',
  message: 'HRV filter change was due 15 days ago. Schedule or log completion.',
  systemId: 'hrv-1',
  taskId: 'task-456',
  dueDate: '2025-12-25',
  daysOverdue: 15,
  actions: [
    { label: 'Log Completion', action: 'quick-log', systemId: 'hrv-1', taskType: 'filter-change' },
    { label: 'Reschedule', action: 'reschedule', taskId: 'task-456' },
    { label: 'Snooze 7 Days', action: 'snooze', duration: 7 }
  ]
}
```

**4. Cost Anomaly Alerts**
```typescript
{
  type: 'cost-anomaly',
  priority: 'low',
  title: 'Unusual Maintenance Costs This Month',
  message: 'This month\'s costs are 45% higher than average. Review spending.',
  amount: 750,
  averageAmount: 517,
  percentIncrease: 45,
  actions: [
    { label: 'View Cost Report', action: 'navigate', path: '/analytics/costs' },
    { label: 'Dismiss', action: 'dismiss' }
  ]
}
```

### Alert Display Component
```typescript
const AlertsPanel = () => {
  const { alerts, setAlerts } = useAlerts();
  const [filter, setFilter] = useState('all'); // all, critical, high, medium, low

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter(a => a.priority === filter);
  }, [alerts, filter]);

  const handleDismiss = async (alertId) => {
    await api.patch(`/alerts/${alertId}/dismiss`);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleSnooze = async (alertId, days) => {
    await api.patch(`/alerts/${alertId}/snooze`, { days });
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success(`Alert snoozed for ${days} days`);
  };

  const handleAction = async (alert, action) => {
    switch (action.action) {
      case 'quick-log':
        openQuickLogModal(action.systemId, action.taskType);
        break;
      case 'schedule-task':
        openScheduler(action.systemId);
        break;
      case 'contact-contractor':
        openContractorModal(action.contractorId || action.specialty);
        break;
      case 'navigate':
        navigate(action.path);
        break;
      case 'external-link':
        window.open(action.url, '_blank');
        break;
      case 'bulk-log':
        openBulkLogModal(action.systemIds);
        break;
      case 'reschedule':
        openRescheduleModal(action.taskId);
        break;
      case 'snooze':
        handleSnooze(alert.id, action.duration);
        break;
      case 'dismiss':
        handleDismiss(alert.id);
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <Card key={alert.id} className={cn(
            "border-l-4",
            alert.priority === 'critical' && "border-l-red-500 bg-red-50",
            alert.priority === 'high' && "border-l-orange-500 bg-orange-50",
            alert.priority === 'medium' && "border-l-yellow-500 bg-yellow-50",
            alert.priority === 'low' && "border-l-blue-500 bg-blue-50"
          )}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <CardTitle className="text-base">{alert.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{alert.message}</p>

              {/* Related system */}
              {alert.systemId && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="h-4 w-4" />
                  <span>Related to: {getSystemName(alert.systemId)}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {alert.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={index === 0 ? "default" : "outline"}
                    onClick={() => handleAction(alert, action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(parseISO(alert.createdAt), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No alerts</h3>
          <p className="text-muted-foreground mt-2">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};
```

---

## 6. REPORTS & ANALYTICS

### Cost Analytics Page

**Visualizations**:

**1. Total Cost Over Time (Line Chart)**
```typescript
const CostTrendChart = () => {
  const { data } = useQuery('cost-trend', () =>
    api.get('/analytics/cost-trend?period=12months')
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Total Cost"
        />
        <Line
          type="monotone"
          dataKey="parts"
          stroke="#10b981"
          strokeWidth={2}
          name="Parts"
        />
        <Line
          type="monotone"
          dataKey="labor"
          stroke="#f59e0b"
          strokeWidth={2}
          name="Labor"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

**2. Cost by System (Pie Chart)**
```typescript
const CostBySystemChart = () => {
  const { data } = useQuery('cost-by-system', () =>
    api.get('/analytics/cost-by-system')
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.system.name}: $${entry.total}`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="total"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
```

**3. Maintenance Frequency Heatmap**
```typescript
const MaintenanceHeatmap = () => {
  const { data } = useQuery('maintenance-heatmap', () =>
    api.get('/analytics/maintenance-frequency')
  );

  // Transform data into heatmap format
  const heatmapData = data.reduce((acc, log) => {
    const date = format(parseISO(log.date), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <CalendarHeatmap
      startDate={subYears(new Date(), 1)}
      endDate={new Date()}
      values={Object.entries(heatmapData).map(([date, count]) => ({
        date,
        count
      }))}
      classForValue={(value) => {
        if (!value || value.count === 0) return 'color-empty';
        if (value.count < 2) return 'color-scale-1';
        if (value.count < 4) return 'color-scale-2';
        if (value.count < 6) return 'color-scale-3';
        return 'color-scale-4';
      }}
      tooltipDataAttrs={(value) => ({
        'data-tip': `${value.date}: ${value.count} maintenance task${value.count !== 1 ? 's' : ''}`
      })}
    />
  );
};
```

---

## 7. MOBILE RESPONSIVENESS

### Mobile-Specific Features

**1. Bottom Navigation (Mobile Only)**
```typescript
const MobileNavigation = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <nav className="flex justify-around items-center h-16">
        <NavItem to="/" icon={Home} label="Home" active={location.pathname === '/'} />
        <NavItem to="/systems" icon={Cog} label="Systems" />
        <NavItem
          to="/quick-log"
          icon={Plus}
          label="Log"
          primary
          onClick={(e) => {
            e.preventDefault();
            openQuickLogModal();
          }}
        />
        <NavItem to="/calendar" icon={Calendar} label="Calendar" />
        <NavItem to="/alerts" icon={Bell} label="Alerts" badge={unreadCount} />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label, active, primary, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors relative",
      active && "text-primary",
      primary && "bg-primary text-primary-foreground scale-110 rounded-full p-3"
    )}
  >
    <Icon className={cn("h-6 w-6", primary && "h-7 w-7")} />
    <span className="text-xs">{label}</span>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);
```

**2. Swipeable Cards**
```typescript
const SwipeableCard = ({ children, onSwipeLeft, onSwipeRight }) => {
  const bind = useSwipeable({
    onSwipedLeft: () => onSwipeLeft?.(),
    onSwipedRight: () => onSwipeRight?.(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return <div {...bind}>{children}</div>;
};

// Usage in recommendations
<SwipeableCard
  onSwipeLeft={() => dismissRecommendation(rec.id)}
  onSwipeRight={() => completeRecommendation(rec.id)}
>
  <RecommendationCard {...rec} />
</SwipeableCard>
```

**3. Camera Integration**
```typescript
const PhotoUpload = ({ onPhotoCapture }) => {
  const fileInputRef = useRef();

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress image before upload
    const compressed = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8
    });

    // Upload to backend
    const presignedUrl = await api.post('/storage/upload-url', {
      filename: file.name,
      contentType: file.type
    });

    await fetch(presignedUrl.url, {
      method: 'PUT',
      body: compressed,
      headers: { 'Content-Type': file.type }
    });

    onPhotoCapture(presignedUrl.fileUrl);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment" // Use rear camera on mobile
        onChange={handleCapture}
        className="hidden"
      />
      <Button onClick={() => fileInputRef.current?.click()}>
        <Camera className="h-4 w-4 mr-2" />
        Take Photo
      </Button>
    </>
  );
};
```

---

## 8. PERFORMANCE OPTIMIZATIONS

### Code Splitting
```typescript
// Lazy load heavy components
const CalendarView = lazy(() => import('./views/CalendarView'));
const CostAnalytics = lazy(() => import('./views/CostAnalytics'));
const ContractorDirectory = lazy(() => import('./views/ContractorDirectory'));

// Preload on hover (desktop)
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    onMouseEnter={() => {
      if (to === '/calendar') {
        import('./views/CalendarView');
      }
    }}
  >
    {children}
  </Link>
);
```

### Data Prefetching
```typescript
// Prefetch likely next pages
const Dashboard = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch systems data (likely next navigation)
    queryClient.prefetchQuery('systems', () => api.get('/systems'));

    // Prefetch alerts
    queryClient.prefetchQuery('alerts', () => api.get('/alerts'));
  }, [queryClient]);

  return <DashboardContent />;
};
```

### Infinite Scroll (Maintenance History)
```typescript
const MaintenanceHistory = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    'maintenance-history',
    ({ pageParam = 1 }) => api.get(`/maintenance/logs?page=${pageParam}&limit=20`),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length + 1 : undefined;
      }
    }
  );

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    }
  });

  return (
    <div>
      {data?.pages.map(page =>
        page.logs.map(log => <LogCard key={log.id} log={log} />)
      )}
      <div ref={ref}>{isFetchingNextPage && <Spinner />}</div>
    </div>
  );
};
```

---

## 9. ACCESSIBILITY

### Keyboard Navigation
```typescript
// Global keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e) => {
    // Cmd/Ctrl + L: Quick log
    if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
      e.preventDefault();
      openQuickLogModal();
    }

    // Cmd/Ctrl + K: Search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }

    // Cmd/Ctrl + /: Show shortcuts
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      openShortcutsModal();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### ARIA Labels
```typescript
<Button aria-label="Log maintenance task" onClick={openQuickLog}>
  <Plus className="h-4 w-4" />
</Button>

<div role="alert" aria-live="polite">
  {alerts.length} new alerts
</div>

<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

---

## 10. DESIGN SYSTEM

### Color Palette
```css
:root {
  /* Warm oranges (primary) */
  --primary: 27 92% 55%;        /* #f97316 */
  --primary-foreground: 0 0% 100%;

  /* Warm accents */
  --accent-warm: 36 100% 50%;   /* #ff9500 */
  --accent-brown: 30 26% 35%;   /* #6b5947 */

  /* System status colors */
  --status-operational: 142 71% 45%;  /* #10b981 green */
  --status-warning: 38 92% 50%;       /* #f59e0b yellow */
  --status-critical: 0 72% 51%;       /* #dc2626 red */
  --status-unknown: 0 0% 64%;         /* #a3a3a3 gray */

  /* Weather integration */
  --weather-cold: 199 89% 48%;   /* #0ea5e9 blue */
  --weather-moderate: 142 71% 45%; /* #10b981 green */
  --weather-warm: 27 96% 61%;    /* #fb923c orange */
}
```

### Typography
```css
/* Headings */
.text-display { font-size: 3.5rem; font-weight: 700; line-height: 1.1; }
.text-h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.text-h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }

/* Body text */
.text-body { font-size: 1rem; line-height: 1.5; }
.text-small { font-size: 0.875rem; line-height: 1.5; }
.text-tiny { font-size: 0.75rem; line-height: 1.5; }
```

### Spacing System
```css
/* 8px base scale */
.space-1 { 0.5rem }  /* 8px */
.space-2 { 1rem }    /* 16px */
.space-3 { 1.5rem }  /* 24px */
.space-4 { 2rem }    /* 32px */
.space-6 { 3rem }    /* 48px */
.space-8 { 4rem }    /* 64px */
```

---

## IMPLEMENTATION REQUIREMENTS

### Must-Have Features (No Compromises)

1. **✅ Real data integration** - Every metric pulls from actual API endpoints
2. **✅ Full CRUD operations** - Create, read, update, delete for all entities
3. **✅ Real-time updates** - WebSocket integration for alerts and notifications
4. **✅ Email reminders** - Functional email system for scheduled tasks
5. **✅ Photo uploads** - Working file upload with presigned URLs
6. **✅ Drag-and-drop calendar** - Fully interactive rescheduling
7. **✅ Responsive design** - Perfect on mobile, tablet, desktop
8. **✅ Error handling** - Graceful failures with user feedback
9. **✅ Loading states** - Skeleton loaders, spinners, optimistic updates
10. **✅ Empty states** - Helpful guidance when no data exists

### Quality Standards

- **Performance**: First Contentful Paint < 1.5s, Time to Interactive < 3s
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **Code Quality**: TypeScript strict mode, ESLint, Prettier, 90%+ test coverage
- **UX**: Smooth animations (60fps), instant feedback, predictable behavior
- **Security**: Input validation, XSS prevention, CSRF protection

---

## SUCCESS CRITERIA

The dashboard implementation is complete when:

1. ✅ A new user can log their first maintenance task in < 30 seconds
2. ✅ All calculations show real data (no hardcoded values)
3. ✅ Calendar events can be dragged/dropped to reschedule
4. ✅ Email reminders are sent and received
5. ✅ Weather data influences system recommendations
6. ✅ Alerts appear in real-time via WebSocket
7. ✅ Contractors can be contacted with one click
8. ✅ Mobile experience is equally powerful as desktop
9. ✅ Every interactive element provides instant visual feedback
10. ✅ The dashboard feels intelligent, anticipatory, and delightful to use

---

## NEXT STEPS FOR IMPLEMENTATION

1. **Phase 1**: Core dashboard layout + navigation (Week 1)
2. **Phase 2**: Quick log modal + maintenance history (Week 1-2)
3. **Phase 3**: Calendar integration + scheduling (Week 2)
4. **Phase 4**: Alerts system + WebSocket (Week 3)
5. **Phase 5**: Contractor management (Week 3)
6. **Phase 6**: Analytics + charts (Week 4)
7. **Phase 7**: Mobile optimization (Week 4)
8. **Phase 8**: Polish + performance (Week 5)
9. **Phase 9**: Testing + bug fixes (Week 5-6)
10. **Phase 10**: Documentation + deployment (Week 6)

---

**This is not a mockup. This is not a prototype. This is the production dashboard that will power FurnaceLog.**

Every feature must work end-to-end. Every calculation must use real algorithms. Every interaction must feel polished. No placeholders. No TODOs. Just a beautiful, functional, intelligent home maintenance command center.

Build it with pride. 🏡🔥
