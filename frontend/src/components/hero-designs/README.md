# FurnaceLog Hero Designs - Mockup Showcase

## 🎨 10 Unique Hero Section Designs

This directory contains 10 production-ready hero section designs for FurnaceLog, each with a unique approach to merging warmth/fire themes with Arctic/northern elements.

## 🚀 View the Mockup Page

To see all designs in action, navigate to:

**http://localhost:5173/hero-mockup**

The mockup page features:
- ✅ **Single View Mode**: See one design at a time with full details
- ✅ **Grid View Mode**: Compare all 10 designs side-by-side
- ✅ **Design Stats**: View scores for visual appeal, animation, brand, technical, and uniqueness
- ✅ **Navigation**: Easy arrows and thumbnails to switch between designs
- ✅ **Top 3 Highlighted**: Stylist-recommended designs marked with stars

## 📊 All Designs

### Top 3 Recommended ⭐

1. **EmberParticlesHero** - Grade A (95% production ready)
   - 125 floating particles (60% embers, 40% snowflakes)
   - Perfect Arctic+Warmth balance
   - File: `EmberParticlesHero.tsx`

2. **ArcticSunriseHero** - Grade A (90% production ready)
   - Dynamic 45-second sunrise animation
   - Yellowknife skyline with buildings and trees
   - File: `ArcticSunriseHero.tsx`

3. **FurnaceBlueprintHero** - Grade A (95% production ready)
   - Technical blueprint with isometric furnace
   - Temperature comparison: -40°C vs +20°C
   - File: `FurnaceBlueprintHero.tsx`

### Other Excellent Designs

4. **DancingFlamesHero** - Grade A
   - 5 SVG flames with aurora borealis
   - File: `DancingFlamesHero.tsx`

5. **NorthernLightsInfernoHero** - Grade A-
   - Aurora borealis in warm fire colors
   - File: `NorthernLightsInfernoHero.tsx`

6. **HeatWaveHero** - Grade A-
   - SVG turbulence heat distortion
   - File: `HeatWaveHero.tsx`

7. **MoltenFlowHero** - Grade A-
   - Flowing lava with glacial ice
   - File: `MoltenFlowHero.tsx`

8. **FireplaceHearthHero** - Grade A-
   - Canvas particles with fireplace view
   - File: `FireplaceHearthHero.tsx`

9. **FurnaceCoreHero** - Grade B+
   - Pulsing circular core
   - File: `FurnaceCoreHero.tsx`

10. **ThermalBloomHero** - Grade B+
    - Thermal camera aesthetic
    - File: `ThermalBloomHero.tsx`

## 📝 Design Review

See **[DESIGN_REVIEW.md](./DESIGN_REVIEW.md)** for comprehensive analysis including:
- Individual design reviews with strengths/issues
- Comparison matrix with scores
- Common issues and suggested improvements
- Accessibility audit
- Animation performance review

## 🎯 How to Use a Design

### Option 1: Replace Current Hero in HomePage

```tsx
// In HomePage.tsx
import EmberParticlesHero from '@/components/hero-designs/EmberParticlesHero';

// Replace the hero section with:
<EmberParticlesHero
  onGetStarted={() => setAuthModalOpen(true)}
  onLearnMore={() => window.location.href = '#features'}
/>
```

### Option 2: Test Individual Design

```tsx
import ArcticSunriseHero from '@/components/hero-designs/ArcticSunriseHero';

<ArcticSunriseHero
  headline={{
    normal: 'Track Your Furnace',
    highlight: 'With Northern Precision'
  }}
  subtitle="Monitor fuel, maintenance, and efficiency"
  ctaPrimary={{
    text: 'Start Tracking',
    onClick: () => navigate('/signup')
  }}
  ctaSecondary={{
    text: 'Learn More',
    href: '#features'
  }}
/>
```

### Option 3: Create Variant System

```tsx
const HERO_VARIANTS = {
  default: EmberParticlesHero,
  sunrise: ArcticSunriseHero,
  technical: FurnaceBlueprintHero,
  flames: DancingFlamesHero,
  aurora: NorthernLightsInfernoHero,
  heatwave: HeatWaveHero,
  blueprint: FurnaceBlueprintHero,
  hearth: FireplaceHearthHero,
  thermal: ThermalBloomHero,
  core: FurnaceCoreHero,
  molten: MoltenFlowHero,
};

// Use variant based on user preference, A/B test, or season
<HeroVariant variant="default" />
```

## 🔧 Common Improvements Needed

All designs are production-ready with these minor refinements:

1. **Replace Hardcoded Colors** (7/10 designs)
   - Use Tailwind classes instead of hex values
   - Add custom color shortcuts to tailwind.config.js

2. **Add Accessibility** (4/10 designs)
   - Add aria-labels to decorative SVG elements
   - Ensure proper contrast ratios

3. **Performance Optimizations** (3/10 designs)
   - Add `will-change` CSS property to animated elements
   - Add reduced-motion media queries

4. **Standardize Buttons**
   - Use shadcn Button component consistently

## 🎨 Color Palette Used

All designs use approved FurnaceLog colors:

**Warm/Fire Colors:**
- Burnt Sienna: #C47A53
- Warm Orange: #E88D5A
- Warm Coral: #F4A582
- Ember Glow: #FF6B35
- Heat Orange: #EA580C
- Flame Red: #DC2626

**Arctic/Cool Colors:**
- Ice Blue: #3B82F6
- Winter Blue: #9CB4C4
- Northern Lights Green: #7EA88F

**Neutrals:**
- Cream: #F5F1E8
- Soft Beige: #E8DCC4
- Warm White: #FAF8F3
- Charcoal: #3A3A3A

## 📈 Next Steps

1. **View Mockup Page**: http://localhost:5173/hero-mockup
2. **Choose Top 3**: Test EmberParticles, ArcticSunrise, or FurnaceBlueprint
3. **Apply Fixes**: Follow recommendations in DESIGN_REVIEW.md
4. **A/B Test**: Measure user engagement with different designs
5. **Optimize**: Add performance improvements

All designs are ready to use! 🎉
