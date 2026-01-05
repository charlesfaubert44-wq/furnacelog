# FurnaceLog Integration Guide

## Files Included

1. **FurnaceLogLanding.jsx** - Animated landing page with logo, steam effects, and flame background
2. **FurnaceLogUI.jsx** - Complete UI component library (buttons, cards, inputs, etc.)

---

## Claude Code Integration Directions

### 1. Copy Files to Your Project

```bash
# Navigate to your project
cd your-project

# Create components directory if needed
mkdir -p src/components/furnacelog

# Copy the files (assuming they're downloaded to Downloads)
cp ~/Downloads/FurnaceLogLanding.jsx src/components/furnacelog/
cp ~/Downloads/FurnaceLogUI.jsx src/components/furnacelog/
```

### 2. Ensure Tailwind CSS is Configured

Your `tailwind.config.js` should include:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        furnace: {
          primary: '#C94A06',
          dark: '#A33D05',
          light: '#E55807',
        }
      }
    },
  },
  plugins: [],
}
```

### 3. Usage Examples

**Landing Page:**
```jsx
import FurnaceLogLanding from './components/furnacelog/FurnaceLogLanding';

function App() {
  return <FurnaceLogLanding />;
}
```

**UI Components:**
```jsx
import { 
  Button, 
  Card, 
  CardHeader,
  Input, 
  StatCard,
  Badge,
  Alert,
  Modal,
  Toggle
} from './components/furnacelog/FurnaceLogUI';

function Dashboard() {
  return (
    <div className="min-h-screen bg-black p-8">
      <Card>
        <CardHeader title="Furnace Status" subtitle="Current readings" />
        <StatCard 
          label="Temperature" 
          value="21" 
          unit="°C" 
          icon="🌡️"
        />
        <Button variant="primary">View Details</Button>
      </Card>
    </div>
  );
}
```

### 4. Extract Background as Reusable Wrapper

If you want just the animated background for other pages:

```jsx
// In your component
import FurnaceLogLanding from './components/furnacelog/FurnaceLogLanding';

// The component accepts children, so wrap your content:
<FurnaceLogLanding>
  <YourContent />
</FurnaceLogLanding>
```

---

## Color Palette Reference

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#C94A06` | Buttons, accents, links |
| Primary Dark | `#A33D05` | LOG text, hover states |
| Primary Light | `#E55807` | Highlights, glows |
| Background | `#000000` | Page background |
| Card BG | `#0a0a0a` | Card backgrounds |
| Card Border | `#1a1a1a` | Borders, dividers |
| Text | `#ffffff` | Primary text |
| Text Muted | `#6b7280` | Secondary text |
| Text Secondary | `#9ca3af` | Tertiary text |

---

## Claude Code Commands

Use these prompts with Claude Code to integrate:

```
# Add landing page to your app
"Add FurnaceLogLanding.jsx as the home page route in my React app"

# Set up routing
"Create React Router setup with FurnaceLogLanding as the / route and a Dashboard component at /dashboard"

# Create dashboard using UI components
"Create a Dashboard page using FurnaceLogUI components with cards showing temperature, filter status, and energy usage"

# Add authentication wrapper
"Wrap FurnaceLogLanding with an auth check that redirects to /dashboard if logged in"

# Customize the slogan
"Change the slogan in FurnaceLogLanding to 'Track your home heating like a pro'"

# Add navigation
"Add a navigation bar to FurnaceLogLanding with links to Dashboard, Settings, and About"
```

---

## File Structure Recommendation

```
src/
├── components/
│   └── furnacelog/
│       ├── FurnaceLogLanding.jsx
│       ├── FurnaceLogUI.jsx
│       └── index.js          # Re-export all components
├── pages/
│   ├── Home.jsx              # Uses FurnaceLogLanding
│   ├── Dashboard.jsx         # Uses FurnaceLogUI components
│   └── Settings.jsx
└── App.jsx
```

**Create index.js for clean imports:**

```js
// src/components/furnacelog/index.js
export { default as FurnaceLogLanding } from './FurnaceLogLanding';
export * from './FurnaceLogUI';
```

Then import like:
```jsx
import { FurnaceLogLanding, Button, Card } from './components/furnacelog';
```

---

## Notes

- All components use Tailwind CSS utility classes
- Animations are CSS-based (no external animation libraries needed)
- Components are functional React components with hooks
- Dark theme by default - designed for black backgrounds
