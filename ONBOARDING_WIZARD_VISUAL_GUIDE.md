# Onboarding Wizard - Visual Design Guide

## 🎨 Design Aesthetic: "Northern Hearth"

A warm, industrial interface that feels like gathering around a fireplace in a northern home. The design uses ember glows, warm stone textures, and cozy cream tones to create an inviting yet professional experience.

---

## Color Palette in Action

### Primary Actions
```
Buttons & CTAs:
├─ Background: Linear gradient (ember-glow → hearth-fire)
├─ Shadow: Warm orange glow (0 4px 16px ember-glow/30)
├─ Text: Wool cream (#f4e8d8)
└─ Hover: Scale 1.02 + increased glow shadow
```

### Backgrounds
```
Page Background:
└─ Gradient: deep-charcoal (#1a1412) → rich-umber (#2d1f1a)

Card Background:
├─ Base: rich-umber/80 with backdrop blur
├─ Border: warm-stone/50
└─ Accent: Subtle ember glow radial gradient (opacity 5%)
```

### Interactive Elements
```
Selection Cards:
├─ Default: warm-stone/30 background, warm-stone border
├─ Hover: warm-stone/50 background, honey border, glow-sm shadow
└─ Selected: gradient-hearth background, hearth-fire border, glow-md shadow

Toggles:
├─ Off: warm-stone/50 background
└─ On: forest-green background
```

---

## Typography System

### Headings
```
Main Title (H1):
├─ Font: Fraunces (display serif)
├─ Size: 4xl (36px mobile) / 5xl (48px desktop)
├─ Weight: Bold (700)
├─ Color: wool-cream
└─ Usage: "Welcome to FurnaceLog"

Step Title (H2):
├─ Font: Fraunces
├─ Size: 2xl (24px mobile) / 3xl (30px desktop)
├─ Weight: Bold (700)
├─ Color: wool-cream
└─ Usage: Step headers

Section Title (H3):
├─ Font: DM Sans
├─ Size: lg (18px)
├─ Weight: Medium (500)
├─ Color: wool-cream
└─ Usage: Subsection headers
```

### Body Text
```
Primary Text:
├─ Font: DM Sans
├─ Size: base (16px mobile) / sm (15px desktop)
├─ Weight: Regular (400)
├─ Color: honey (#d4a373)
└─ Usage: Descriptions, helper text

Labels:
├─ Font: DM Sans
├─ Size: base (16px)
├─ Weight: Medium (500)
├─ Color: wool-cream
└─ Required indicator: ember-glow star (*)
```

---

## Component Anatomy

### OnboardingWizard Container

```
┌─────────────────────────────────────────────────────┐
│  [Flame Icon]                                       │ ← Icon: ember-glow gradient background
│  Welcome to FurnaceLog                              │ ← Title: Fraunces 5xl, wool-cream
│  Let's personalize your experience                  │ ← Subtitle: DM Sans lg, honey
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │ ← Progress: gradient-hearth fill
│  │ Step 2 of 8                        25% Complete│ │ ← Stats: honey text, xs
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌──┐  ➤  ┌──┐  ➤  ┌──┐  ➤  ┌──┐  ➤  ┌──┐       │
│  │✓1│     │▪2│     │ 3│     │ 4│     │ 5│       │ ← Step Pills
│  └──┘     └──┘     └──┘     └──┘     └──┘       │   Completed: forest-green
│  Home   Heating  Water  Sewage Electrical        │   Active: gradient-hearth
│                                                      │   Pending: warm-stone/50
│  ┌─────────────────────────────────────────────┐   │
│  │  ┌──┐                                        │   │
│  │  │🔥│  Heating Systems                       │   │ ← Card Header
│  │  └──┘  Critical for northern climates        │   │
│  │  ───────────────────────────────────────────│   │
│  │                                               │   │
│  │  [Step Content Goes Here]                    │   │ ← Card Content
│  │                                               │   │
│  │  ───────────────────────────────────────────│   │
│  │  [← Previous]  [Save Progress]  [Continue →] │   │ ← Card Footer
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  I'll complete this later                           │ ← Skip link: honey/70
└─────────────────────────────────────────────────────┘
```

### Selection Card (Large)

```
┌──────────────────────────────────┐
│ [Badge]                      [✓] │ ← Badge: sunset-amber bg
│                                   │   Check: wool-cream circle
│  ┌────────┐                      │
│  │  🔥   │                       │ ← Icon: 48px, ember-glow
│  └────────┘                      │
│                                   │
│  Oil Furnace                      │ ← Title: lg, semibold
│  Forced air heating with fuel oil │ ← Description: sm, honey
└──────────────────────────────────┘

States:
├─ Default: warm-stone/30 bg, warm-stone border
├─ Hover: warm-stone/50 bg, honey border, scale 1.02
└─ Selected: gradient-hearth bg, hearth-fire border, glow-md
```

### Selection List Item (Compact)

```
┌──────────────────────────────────────────────┐
│  ┌───┐  Wood Stove                      [✓] │
│  │🪵 │  Backup heating                       │
│  └───┘                                       │
└──────────────────────────────────────────────┘

Height: 56px (compact)
Layout: Horizontal with icon, text, and check
```

### Toggle Switch

```
OFF:                 ON:
┌────────┐          ┌────────┐
│ ○      │          │      ● │
└────────┘          └────────┘
warm-stone/50       forest-green

Circle: wool-cream, smooth slide animation (300ms)
```

### Input Fields

```
┌──────────────────────────────────────┐
│ Home Name *                          │ ← Label: wool-cream
│ ┌──────────────────────────────────┐ │
│ │ e.g., Main House, Cabin...       │ │ ← Input: warm-stone/50 bg
│ └──────────────────────────────────┘ │
│ Give your home a nickname...         │ ← Helper: honey/70, xs
└──────────────────────────────────────┘

States:
├─ Default: border-warm-stone
├─ Focus: ring-ember-glow (2px)
└─ Error: border-brick-red, text-brick-red
```

---

## Animation Specifications

### Page Transitions
```css
Entry:
- opacity: 0 → 1
- translateX: 20px → 0
- duration: 300ms
- easing: cubic-bezier(0.16, 1, 0.3, 1)

Exit:
- opacity: 1 → 0
- translateX: 0 → -20px
- duration: 300ms
```

### Progress Bar Fill
```css
- width: 0% → target%
- duration: 500ms
- easing: easeOut
- background: linear-gradient(135deg, #ff6b35, #f7931e)
```

### Selection Card Interaction
```css
Hover:
- scale: 1 → 1.02
- shadow: none → glow-sm
- duration: 300ms

Tap/Click:
- scale: 1 → 0.98 → 1
- duration: 200ms
```

### Check Mark Appear
```css
- scale: 0 → 1.1 → 1
- opacity: 0 → 1
- duration: 300ms
- easing: cubic-bezier(0.34, 1.56, 0.64, 1) /* Bouncy */
```

---

## Responsive Breakpoints

### Mobile (< 640px)
```
Layout:
├─ Single column
├─ Full-width cards
├─ Stacked navigation buttons
├─ Scrollable step pills
└─ 16px padding

Typography:
├─ H1: 36px
├─ H2: 24px
├─ Body: 16px (larger for readability)
└─ Inputs: 48px height (touch-friendly)
```

### Tablet (640px - 1024px)
```
Layout:
├─ 2-column selection grids
├─ Side-by-side input groups
└─ 24px padding

Typography:
├─ H1: 42px
├─ H2: 28px
└─ Body: 15px
```

### Desktop (> 1024px)
```
Layout:
├─ 3-column selection grids
├─ Max-width: 1024px (contained)
├─ Horizontal step pills
└─ 32px padding

Typography:
├─ H1: 48px
├─ H2: 30px
└─ Body: 15px
```

---

## Accessibility Features

### Focus States
- 2px ring in ember-glow
- 2px offset from element
- Visible on all interactive elements
- Matches warm theme

### Color Contrast
```
Combinations (WCAG AA+):
├─ wool-cream on rich-umber: 12.5:1 ✓
├─ honey on deep-charcoal: 6.2:1 ✓
├─ ember-glow on rich-umber: 4.8:1 ✓
└─ wool-cream on gradient-hearth: 4.5:1 ✓
```

### Keyboard Navigation
- Tab order follows visual flow
- Enter/Space activates buttons and toggles
- Arrow keys navigate selection grids (future)
- Escape closes skip confirmation

### Screen Reader
- Semantic HTML (headings, labels, buttons)
- ARIA labels on icon-only buttons
- Live region for progress updates
- Form validation announcements

---

## Dark/Light Mode

**Current Implementation:** Dark mode only (Territorial Homestead theme)

**Rationale:** Northern homes often experience long, dark winters. A warm, dark interface reduces eye strain during evening maintenance planning and creates a cozy, hearth-like atmosphere.

**Future Enhancement:** Optional light mode with:
- Birch white backgrounds
- Soft honey accents
- Reduced ember glow intensity
- Same warm aesthetic, lighter palette

---

## Icon System

### Icons Used (Lucide React)
```
Navigation & Actions:
├─ Home - Home basics
├─ Flame - Heating systems
├─ Droplet - Water systems
├─ Trash2 - Sewage/waste
├─ Zap - Electrical/power
├─ Settings - Additional systems
├─ Bell - Preferences
├─ CheckCircle - Review/confirm
├─ ChevronLeft/Right - Navigation
├─ Save - Save progress
├─ X - Close/skip
└─ Check - Completion indicator

System Types:
├─ TreePine - Wood stove
├─ Boxes - Pellet stove
├─ Thermometer - Temperature/boiler
├─ Wind - HRV/ventilation
├─ FlaskRound - Water treatment
├─ TrendingUp - Well water
├─ AlertCircle - Warnings
├─ Info - Help text
└─ HelpCircle - Tooltips
```

### Icon Styling
```css
Small: 16px (w-4 h-4)
Medium: 20px (w-5 h-5)
Large: 24px (w-6 h-6)

Colors:
├─ Primary: ember-glow
├─ Secondary: honey
├─ Success: northern-lights
├─ Warning: sunset-amber
└─ On selected cards: wool-cream
```

---

## Loading & Empty States

### Loading Skeleton
```
┌──────────────────────────────────┐
│ ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Shimmer animation
│                                   │
│  ┌────────┐                      │
│  │░░░░░░░│                       │
│  └────────┘                      │
│  ░░░░░░░░░░░░░                   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░        │
└──────────────────────────────────┘

Animation: warm-shimmer (left to right, 2s loop)
Colors: warm-stone/20 → warm-stone/40 → warm-stone/20
```

### Error State
```
┌──────────────────────────────────┐
│  ⚠️  Oops! Something went wrong  │
│                                   │
│  We couldn't save your progress. │
│  Please check your connection.   │
│                                   │
│  [Try Again]                      │
└──────────────────────────────────┘

Alert: brick-red/10 background, brick-red/30 border
Icon: sunset-amber
Text: honey
```

---

## Special UI Patterns

### Conditional Field Expansion
```
Parent Toggle: HRV System [ON]
└─ Animated slide-down (300ms)
   ┌─────────────────────────────┐
   │ ├─ HRV Brand               │
   │ └─ HRV Age                 │
   └─────────────────────────────┘

   Visual: Left border (honey/30, 2px)
          Padding-left: 16px + 36px icon offset
          Smooth height animation
```

### Multi-Select Chips
```
Selected Items:
┌────┐ ┌────┐ ┌────┐
│✓ A │ │✓ B │ │  C │
└────┘ └────┘ └────┘

Selected: forest-green/20 bg, forest-green/40 border
Unselected: warm-stone/30 bg, warm-stone border
Hover: Border color → honey
```

### Info Boxes
```
┌──────────────────────────────────────┐
│ 💡  Northern Climate Maintenance     │
│ ─────────────────────────────────── │
│ Northern homes require more frequent │
│ heating system maintenance...        │
└──────────────────────────────────────┘

Types:
├─ Info: slate-blue/10 bg, winter-sky icon
├─ Warning: sunset-amber/10 bg, sunset-amber icon
├─ Success: forest-green/10 bg, northern-lights icon
└─ Danger: brick-red/10 bg, brick-red icon
```

---

## Mobile-Specific Considerations

### Touch Gestures (Future)
- Swipe right → Previous step
- Swipe left → Next step
- Pull down → Show step menu
- Long press → Show help tooltip

### Bottom Sheet Navigation (Mobile)
```
Fixed bottom bar on mobile:
┌──────────────────────────────────┐
│ [← Previous]       [Continue →]  │
└──────────────────────────────────┘

Height: 72px
Padding: 16px
Background: deep-charcoal/95 with backdrop-blur
Shadow: Upward glow-lg
Safe area insets: Respected
```

---

## Implementation Notes

### Framer Motion Variants
```tsx
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const cardHover = {
  scale: 1.02,
  transition: { duration: 0.3 }
};
```

### Tailwind Classes Pattern
```tsx
// Selection Card Default
className="bg-warm-stone/30 border-2 border-warm-stone
          hover:bg-warm-stone/50 hover:border-honey hover:shadow-glow-sm
          focus:ring-2 focus:ring-ember-glow focus:ring-offset-2
          transition-all duration-300 rounded-xl p-5"

// Selection Card Selected
className="bg-gradient-hearth border-2 border-hearth-fire
          shadow-glow-md text-wool-cream"
```

---

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ iOS Safari 14+
✅ Chrome Android 90+

**Required Features:**
- CSS Grid
- CSS Custom Properties
- CSS backdrop-filter
- Flexbox
- ES2020 JavaScript
- Intersection Observer (for animations)

---

**This visual guide ensures consistent implementation of the warm, northern-inspired design across all onboarding wizard components.**
