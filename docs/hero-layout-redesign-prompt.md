# Homepage Hero Section - Complete Layout Redesign Prompt

## Problem Statement

The current hero section has critical UX issues:
- **Elements overlapping** - Navigation arrows, content, and alerts colliding
- **Repeating elements** - Progress bars, indicators appearing multiple times
- **Cluttered layout** - Too many interactive elements competing for attention
- **Poor visual hierarchy** - Unclear focal points and reading order
- **Confusing navigation** - Multiple navigation patterns (arrows, dots, progress bars) creating cognitive overload

## Design Objectives

### Primary Goals
1. **Crystal clear hierarchy** - User should immediately understand what to focus on
2. **Single, elegant transition** - One cohesive animation pattern, not multiple competing carousels
3. **Generous whitespace** - Let content breathe, don't cram everything together
4. **Mobile-first responsive** - Perfect experience on all screen sizes
5. **Accessibility first** - Screen readers, keyboard navigation, reduced motion support

### Secondary Goals
- Showcase product value propositions effectively
- Guide users toward primary CTA (registration)
- Build trust through professional, polished design
- Create memorable brand moments

## Recommended Layout Options

Choose ONE of these layout approaches:

---

## Option A: Full-Width Immersive Hero (Recommended)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    CENTERED CONTENT                     │
│                                                         │
│              [Large Headline]                           │
│              [Subtitle Text]                            │
│                                                         │
│         [Primary CTA]  [Secondary CTA]                  │
│                                                         │
│              ○ ○ ○  [Slide Indicators]                  │
│                                                         │
│    [Featured Alert Card - Centered, Prominent]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Features
- **Full-width centered layout** - No left/right split
- **Vertical stacking** - Natural reading order from top to bottom
- **Headline first** - 60-80% viewport height, dominant focal point
- **Alert card below** - Complementary, not competing for attention
- **Single set of controls** - One carousel controls entire section
- **No overlapping elements** - Everything in its own space

### Specifications
- **Headline**:
  - Desktop: 72px font size, max-width 900px, centered
  - Mobile: 48px, full-width with padding
  - Line height: 1.1
  - Letter spacing: -0.02em

- **Subtitle**:
  - Desktop: 24px, max-width 700px, centered
  - Mobile: 18px
  - Margin-top: 24px

- **CTAs**:
  - Horizontal layout on desktop (centered)
  - Vertical stack on mobile
  - Margin-top: 40px
  - Gap: 16px

- **Alert Card**:
  - Max-width: 600px, centered
  - Margin-top: 60px
  - Shadow: elevated
  - No internal carousel (shows one alert per hero slide)

- **Slide Indicators**:
  - Position: Below CTAs, above alert
  - Margin: 32px auto
  - Simple dots, no progress bars

- **Navigation Arrows**:
  - Position: Absolute, middle of viewport height
  - Left: 24px, Right: 24px (on desktop)
  - Hidden on mobile (swipe gestures instead)

---

## Option B: Asymmetric Split with Visual Focal Point

### Layout Structure
```
┌────────────────────────────┬──────────────────────────┐
│                            │                          │
│    [Headline]              │    [LARGE VISUAL         │
│    [Subtitle]              │     ILLUSTRATION         │
│                            │     OR CARD]             │
│    [Primary CTA]           │                          │
│    [Secondary CTA]         │                          │
│                            │                          │
│    ○ ○ ○                   │                          │
│                            │                          │
└────────────────────────────┴──────────────────────────┘
```

### Key Features
- **60/40 split** - 60% content, 40% visual
- **Left: All text and CTAs** - Clear vertical hierarchy
- **Right: Single focal element** - Alert card OR illustration/mockup
- **Breathing room** - Minimum 48px gap between columns
- **No nested carousels** - Only the entire section transitions

### Specifications
- **Left Column**:
  - Padding: 80px 60px (desktop), 40px 24px (mobile)
  - Max-width: 600px
  - Vertical centering

- **Right Column**:
  - Sticky positioning on scroll
  - Padding: 80px 40px
  - Centered content

- **Responsive Behavior**:
  - Stack vertically on tablet/mobile
  - Right column becomes full-width below content
  - Maintains visual prominence

---

## Option C: Minimal Single-Screen Focus

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Headline]                           │
│                    [Subtitle]                           │
│                                                         │
│              [Primary CTA Button]                       │
│                                                         │
│    ────────────────────────────────────────────         │
│                                                         │
│    [Three Key Features - Icon + Text Grid]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Features
- **NO carousel** - Static, single message
- **Headline + CTA only** - Simplest possible conversion path
- **Features grid below** - Supporting information, not competing
- **Trust indicators** - User count, ratings, testimonials
- **100vh hero** - Full screen takeover on desktop

### Specifications
- **Height**: 100vh (desktop), auto (mobile)
- **Headline**: Center-aligned, 80px font size
- **Single CTA**: Large, prominent, center-aligned
- **Features Grid**: 3 columns, icon-first, below fold
- **No animations** - Except subtle hover states
- **Fastest load time** - No carousel logic or images

---

## Carousel Behavior Specifications (Options A & B)

If using a carousel, follow these strict rules:

### Transition Mechanics
- **Duration**: 700ms (not 600ms - feels more premium)
- **Easing**: `cubic-bezier(0.23, 1, 0.32, 1)` - Smooth deceleration
- **Direction**: Horizontal only, fade + slide combined
- **Transform**: `translateX()` with `opacity` transition
- **GPU-accelerated**: Use `transform` and `opacity` only (not `left`, `margin`, etc.)

### Animation Sequence
1. **Exit stage**: Current slide fades to 0.7 opacity while moving -20px in exit direction (300ms)
2. **Enter stage**: Next slide enters from +20px with 0 opacity (starting at 300ms)
3. **Settle**: New slide reaches final position with full opacity (400ms)

### Navigation Controls

**Arrows**:
- Size: 48px × 48px (44px minimum for touch targets)
- Position: `position: absolute; top: 50%; transform: translateY(-50%);`
- Distance from edge: 40px (desktop), hidden (mobile)
- Background: `rgba(26, 26, 26, 0.8)` with `backdrop-filter: blur(8px)`
- Border: `1px solid rgba(244, 232, 216, 0.2)`
- Hover: Scale 1.1, border opacity 0.4
- z-index: 10

**Dot Indicators**:
- Size: 8px × 8px (inactive), 24px × 8px (active)
- Position: Below CTAs, 40px margin-top
- Gap: 12px between dots
- Active color: Orange gradient
- Inactive color: `rgba(244, 232, 216, 0.3)`
- Cursor: pointer
- Hover: Scale 1.2, opacity 0.5
- z-index: 5

**Progress Bar** (optional, only if auto-advance):
- Height: 2px
- Position: Bottom of hero section
- Width: 100%
- Color: Orange gradient
- Animation: Linear fill over interval duration
- Pause on hover: Yes
- Hidden on mobile: No

### Auto-Advance Rules
- **Interval**: 8000ms (8 seconds) - Enough time to read
- **Pause triggers**:
  - Mouse hover anywhere in hero
  - Focus on any interactive element
  - User manually navigates (pause for 30 seconds)
  - Page not visible (Page Visibility API)
  - Reduced motion preference
- **Resume**: 2 seconds after trigger ends
- **Infinite loop**: Yes, cycle back to slide 1 from last slide

---

## Content Strategy

### Slide Structure (Max 3 Slides)

**Slide 1: Primary Value Proposition**
- Headline: Core benefit (6-8 words max)
- Subtitle: Who it's for + key differentiator (15-20 words)
- CTA: "Start Free Today" or "Get Started Free"
- Alert/Visual: Most urgent/relevant (extreme cold alert)

**Slide 2: Secondary Benefit**
- Headline: Supporting feature (6-8 words max)
- Subtitle: How it works or why it matters (15-20 words)
- CTA: "See How It Works" or "View Features"
- Alert/Visual: Maintenance reminder (mid-priority)

**Slide 3: Trust/Proof**
- Headline: Social proof or outcome (6-8 words max)
- Subtitle: Results, testimonial, or guarantee (15-20 words)
- CTA: "Join Northern Homeowners" or "Start Protecting Your Home"
- Alert/Visual: Healthy systems (positive reinforcement)

### Writing Guidelines
- **Headline**:
  - Lead with benefit, not feature
  - Use active voice
  - Include emotional trigger ("Protect", "Never worry", "Stay warm")
  - Avoid jargon or technical terms

- **Subtitle**:
  - Expand on headline with "who" and "why"
  - Include specific detail (-40°C, northern homes, etc.)
  - End with benefit, not feature list

- **CTAs**:
  - Action-oriented verbs
  - Create urgency without pressure
  - Remove friction ("Free", "No credit card", "2-minute setup")

---

## Visual Design Requirements

### Color Usage
- **Headline**: `#f4e8d8` (cream/beige) - High contrast
- **Highlighted text**: Orange gradient `from-[#ff4500] to-[#ff6a00]`
- **Subtitle**: `#d4a373` (tan) - Reduced emphasis
- **Background**: `#0a0a0a` (deep black)
- **Cards**: `#1a1a1a` with subtle gradients
- **Borders**: Use opacity - `rgba(244, 232, 216, 0.1)` for subtle, `0.3` for prominent

### Typography Scale
- **Display (Headline)**: 72px / 800 weight / -2% tracking / 1.1 line-height
- **Title (Subtitle)**: 24px / 400 weight / 0% tracking / 1.5 line-height
- **Button**: 16px / 600 weight / 0% tracking
- **Alert Title**: 20px / 600 weight
- **Alert Body**: 15px / 400 weight / 1.6 line-height

### Spacing System (8px base)
- **Section padding**:
  - Desktop: 120px top, 120px bottom
  - Tablet: 80px top, 80px bottom
  - Mobile: 60px top, 60px bottom

- **Element gaps**:
  - Headline → Subtitle: 24px
  - Subtitle → CTAs: 40px
  - CTAs → Indicators: 32px
  - Indicators → Alert: 48px

- **Container max-width**: 1400px
- **Content max-width**: 900px (for centered layouts)

### Shadow System
- **Subtle**: `0 1px 3px rgba(0, 0, 0, 0.2)`
- **Elevated**: `0 4px 16px rgba(0, 0, 0, 0.3)`
- **Floating**: `0 12px 48px rgba(0, 0, 0, 0.4)`
- **Glow (hover)**: `0 0 24px rgba(255, 69, 0, 0.3)`

---

## Responsive Breakpoints

### Desktop (1280px+)
- Full layout as designed
- Large text sizes
- Side-by-side elements (if using split layout)
- Navigation arrows visible
- 60px horizontal padding

### Laptop (1024px - 1279px)
- Slightly reduced text sizes (90% scale)
- Navigation arrows closer to edge
- 40px horizontal padding

### Tablet (768px - 1023px)
- Stack columns vertically
- Text sizes: 85% scale
- Navigation arrows: 32px from edge
- 32px horizontal padding
- CTAs: Full width

### Mobile (< 768px)
- Single column, vertical stack
- Text sizes: 70% scale
- Navigation arrows: Hidden (swipe only)
- 24px horizontal padding
- CTAs: Full width, stacked vertically
- Alert card: Compact variant

---

## Accessibility Requirements

### Keyboard Navigation
- Tab order: Headline → CTA 1 → CTA 2 → Dot 1 → Dot 2 → Dot 3 → Arrow Left → Arrow Right
- Enter/Space: Activate focused element
- Arrow keys: Navigate between slides (when focused on carousel)
- Escape: Stop auto-advance

### Screen Reader
- Hero section: `role="region" aria-label="Featured content"`
- Carousel: `role="group" aria-roledescription="carousel" aria-live="polite"`
- Slide: `role="group" aria-roledescription="slide" aria-label="Slide X of Y"`
- Auto-advance status: Announced when paused/resumed
- Navigation: `aria-label="Previous slide"` / `aria-label="Next slide"`
- Dots: `aria-label="Go to slide X"`

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .hero-carousel {
    transition-duration: 0.01ms !important;
  }
  .progress-bar {
    display: none !important;
  }
}
```

### Focus States
- Visible outline: `2px solid #ff4500`
- Offset: `2px`
- Border radius: Match element
- Never use `outline: none` without replacement

### Color Contrast
- Text on dark background: Minimum 7:1 (AAA)
- Alert cards: Minimum 4.5:1 (AA)
- Border contrast: Minimum 3:1

---

## Performance Requirements

### Loading Strategy
- Hero images: `priority` attribute, lazy load off
- Fonts: Preload display fonts
- Critical CSS: Inline hero styles in `<head>`
- JavaScript: Defer carousel logic until after First Contentful Paint

### Animation Performance
- Use `will-change: transform` on sliding elements
- Remove `will-change` after animation completes
- Use `requestAnimationFrame` for JavaScript animations
- Maximum 60fps (16.67ms per frame)

### Metrics Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms
- **Hero Load Time**: < 1.5s on 3G

---

## Mobile-Specific Considerations

### Touch Gestures
- **Swipe left**: Next slide (minimum 50px swipe distance)
- **Swipe right**: Previous slide
- **Tap**: Pause auto-advance
- **Long press**: No action (prevent accidental triggers)

### Mobile Optimizations
- Reduce hero height: 85vh (not 100vh - shows content below)
- Larger touch targets: Minimum 48px × 48px
- Simplified animations: Reduce motion complexity
- Smaller alert cards: Compact layout variant
- Stack CTAs vertically: Full width buttons
- Remove decorative elements: Focus on core content

### Mobile-First Typography
```css
/* Mobile base */
.hero-headline { font-size: 40px; }
.hero-subtitle { font-size: 18px; }

/* Desktop scale-up */
@media (min-width: 768px) {
  .hero-headline { font-size: 72px; }
  .hero-subtitle { font-size: 24px; }
}
```

---

## Component Architecture

### Recommended Structure
```tsx
<HeroSection>
  <HeroBackground /> {/* Gradient blobs, static */}

  <HeroCarousel slides={slides}>
    {(currentSlide) => (
      <>
        <HeroContent>
          <Headline>{currentSlide.headline}</Headline>
          <Subtitle>{currentSlide.subtitle}</Subtitle>
          <CTAGroup>
            <PrimaryCTA />
            <SecondaryCTA />
          </CTAGroup>
        </HeroContent>

        <HeroVisual>
          <AlertCard alert={currentSlide.alert} />
        </HeroVisual>
      </>
    )}
  </HeroCarousel>

  <CarouselControls>
    <DotIndicators />
    <NavigationArrows />
  </CarouselControls>
</HeroSection>
```

### State Management
- Keep carousel state isolated
- Use `useReducer` for complex state (current index, animation state, pause state)
- Debounce user interactions (prevent spam clicking)
- Persist user preference (if manually paused, stay paused)

---

## Testing Checklist

### Visual Regression
- [ ] Screenshot comparison at all breakpoints
- [ ] Test in dark mode (if applicable)
- [ ] Verify font loading states
- [ ] Check color contrast ratios

### Functional Testing
- [ ] Auto-advance works after 8 seconds
- [ ] Pause on hover works
- [ ] Navigation arrows change slides
- [ ] Dot indicators change slides
- [ ] Swipe gestures work on mobile
- [ ] Keyboard navigation works
- [ ] No layout shift during transitions

### Cross-Browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Samsung Internet (Android)

### Accessibility Audit
- [ ] Lighthouse accessibility score: 100
- [ ] axe DevTools: 0 violations
- [ ] Screen reader: VoiceOver, NVDA, JAWS
- [ ] Keyboard-only navigation
- [ ] High contrast mode

### Performance
- [ ] Lighthouse performance score: > 90
- [ ] No CLS during carousel transitions
- [ ] Smooth 60fps animations
- [ ] Load time under 2s on 3G

---

## Example Implementations

### Option A Example (Recommended)
**Slide 1:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

              Protect Your Northern Home
    Track heating, prevent freeze damage, and stay warm
           through -40°C winters. Automated and simple.

        [Start Free Today →]  [See Features]

                    ● ○ ○

    ┌────────────────────────────────────────────┐
    │  🔴  Extreme Cold Alert        URGENT      │
    │                                            │
    │  Temperature dropping to -42°C tonight.    │
    │  Inspect heat trace cables and ensure      │
    │  backup heating is ready.                  │
    │                                            │
    │  ⏰ Due in 6 hours                         │
    └────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Decision Framework

**Choose Option A (Full-Width Centered) if:**
- You want maximum impact and visual prominence
- Mobile traffic > 60%
- Content is king (text-heavy value prop)
- Simplicity is a brand value

**Choose Option B (Asymmetric Split) if:**
- You have strong visual assets (mockups, illustrations)
- Desktop traffic > 50%
- You want to show product UI
- Professional/enterprise audience

**Choose Option C (Minimal Single-Screen) if:**
- Conversion rate is the only metric that matters
- You have clear, singular value proposition
- Target audience is impatient/busy
- A/B testing showed carousels hurt conversion

---

## Implementation Priority

### Phase 1 (MVP - 1 day)
1. Remove all nested carousels
2. Implement single, clean layout (Option A or C)
3. Fix overlapping elements
4. Basic responsive behavior
5. Single slide (no carousel yet)

### Phase 2 (Enhanced - 2 days)
1. Add carousel functionality (if Option A or B)
2. Implement smooth transitions
3. Add navigation controls
4. Auto-advance with pause
5. Mobile swipe gestures

### Phase 3 (Polish - 1 day)
1. Micro-interactions and hover states
2. Loading states and skeleton screens
3. Accessibility improvements
4. Performance optimization
5. Cross-browser testing

---

## Success Metrics

Track these after implementation:

1. **Engagement**: Time on hero section (target: > 8 seconds)
2. **Conversion**: CTA click rate (target: > 5%)
3. **Comprehension**: A/B test headline variants
4. **Technical**: Lighthouse scores, load times, CLS
5. **User Feedback**: Heatmaps, session recordings

---

**Remember**: The best hero is the one that converts, not the one with the most features. When in doubt, simplify.
