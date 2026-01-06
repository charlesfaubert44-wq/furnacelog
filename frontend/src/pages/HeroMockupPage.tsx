import { useState } from 'react';
import { ArrowLeft, ArrowRight, Grid3x3, Maximize2, Star, Zap, Palette, Code, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all hero designs
import DancingFlamesHero from '@/components/hero-designs/DancingFlamesHero';
import FurnaceCoreHero from '@/components/hero-designs/FurnaceCoreHero';
import NorthernLightsInfernoHero from '@/components/hero-designs/NorthernLightsInfernoHero';
import EmberParticlesHero from '@/components/hero-designs/EmberParticlesHero';
import HeatWaveHero from '@/components/hero-designs/HeatWaveHero';
import FurnaceBlueprintHero from '@/components/hero-designs/FurnaceBlueprintHero';
import FireplaceHearthHero from '@/components/hero-designs/FireplaceHearthHero';
import ThermalBloomHero from '@/components/hero-designs/ThermalBloomHero';
import ArcticSunriseHero from '@/components/hero-designs/ArcticSunriseHero';
import MoltenFlowHero from '@/components/hero-designs/MoltenFlowHero';

interface HeroDesign {
  id: number;
  name: string;
  component: React.ComponentType<any>;
  grade: string;
  concept: string;
  scores: {
    visual: number;
    animation: number;
    brand: number;
    technical: number;
    uniqueness: number;
  };
  highlights: string[];
  recommended: boolean;
}

const heroDesigns: HeroDesign[] = [
  {
    id: 1,
    name: 'Dancing Flames',
    component: DancingFlamesHero,
    grade: 'A',
    concept: 'Animated flames rising from bottom with aurora borealis at top',
    scores: { visual: 9, animation: 10, brand: 10, technical: 9, uniqueness: 8 },
    highlights: [
      '5 SVG flames with unique animations',
      'Aurora borealis in top third',
      '25-30 second animation cycles',
      'Warm glow shadows'
    ],
    recommended: false
  },
  {
    id: 2,
    name: 'Furnace Core',
    component: FurnaceCoreHero,
    grade: 'B+',
    concept: 'Circular burning core/portal with pulsing animations',
    scores: { visual: 8, animation: 9, brand: 9, technical: 8, uniqueness: 7 },
    highlights: [
      'Pulsing circular core',
      'Heat distortion effects',
      'Icicle shapes at edges',
      'Radial gradient emanation'
    ],
    recommended: false
  },
  {
    id: 3,
    name: 'Northern Lights Inferno',
    component: NorthernLightsInfernoHero,
    grade: 'A-',
    concept: 'Aurora borealis rendered in warm fire colors',
    scores: { visual: 10, animation: 9, brand: 8, technical: 8, uniqueness: 10 },
    highlights: [
      '4 layered aurora bands',
      'Fire colors instead of green',
      '30-35 second cycles',
      'Ethereal, flowing aesthetic'
    ],
    recommended: false
  },
  {
    id: 4,
    name: 'Ember Particles',
    component: EmberParticlesHero,
    grade: 'A',
    concept: 'Rising ember particles mixed with snowflakes for arctic duality',
    scores: { visual: 9, animation: 9, brand: 10, technical: 8, uniqueness: 9 },
    highlights: [
      '125 particles (60% embers, 40% snowflakes)',
      'Minimalist, elegant design',
      '40-60 second float animations',
      'Perfect Arctic+Warmth balance'
    ],
    recommended: true
  },
  {
    id: 5,
    name: 'Heat Wave Distortion',
    component: HeatWaveHero,
    grade: 'A-',
    concept: 'Visible heat waves rising with cool edges being pushed back',
    scores: { visual: 8, animation: 10, brand: 9, technical: 9, uniqueness: 9 },
    highlights: [
      'SVG turbulence filter',
      'Cool blue edges pushed back',
      '15-20 second loop',
      'Sophisticated, subtle'
    ],
    recommended: false
  },
  {
    id: 6,
    name: 'Furnace Blueprint',
    component: FurnaceBlueprintHero,
    grade: 'A',
    concept: 'Technical blueprint aesthetic with animated gauges',
    scores: { visual: 9, animation: 9, brand: 10, technical: 9, uniqueness: 10 },
    highlights: [
      'Isometric furnace illustration',
      'Animated gauges & thermometer',
      'Temperature comparison: -40°C vs +20°C',
      'Professional technical feel'
    ],
    recommended: true
  },
  {
    id: 7,
    name: 'Fireplace Hearth',
    component: FireplaceHearthHero,
    grade: 'A-',
    concept: 'View of burning logs from living room perspective',
    scores: { visual: 10, animation: 10, brand: 10, technical: 7, uniqueness: 9 },
    highlights: [
      'Canvas-based particle system',
      'SVG animated flames on logs',
      'Frosted window with snow',
      'Cozy, intimate atmosphere'
    ],
    recommended: false
  },
  {
    id: 8,
    name: 'Thermal Bloom',
    component: ThermalBloomHero,
    grade: 'B+',
    concept: 'Thermal imaging camera aesthetic with heat signatures',
    scores: { visual: 10, animation: 9, brand: 7, technical: 8, uniqueness: 10 },
    highlights: [
      '5 blooming thermal rings',
      'Full thermal color spectrum',
      'Scanline effects',
      'High-tech aesthetic'
    ],
    recommended: false
  },
  {
    id: 9,
    name: 'Arctic Sunrise',
    component: ArcticSunriseHero,
    grade: 'A',
    concept: 'Yellowknife winter sunrise with warm sky over snow',
    scores: { visual: 10, animation: 10, brand: 10, technical: 8, uniqueness: 10 },
    highlights: [
      '45-second dynamic sunrise',
      'Yellowknife skyline silhouette',
      'Snow sparkles with twinkle',
      'Most emotionally engaging'
    ],
    recommended: true
  },
  {
    id: 10,
    name: 'Molten Flow',
    component: MoltenFlowHero,
    grade: 'A-',
    concept: 'Flowing liquid fire/lava with glacial ice contrast',
    scores: { visual: 10, animation: 9, brand: 9, technical: 8, uniqueness: 9 },
    highlights: [
      'Flowing lava streams',
      'Glacial ice formations',
      '35-45 second organic flow',
      'Powerful, elemental feeling'
    ],
    recommended: false
  }
];

export default function HeroMockupPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [showStats, setShowStats] = useState(true);

  const currentDesign = heroDesigns[currentIndex];
  const CurrentComponent = currentDesign.component;

  const nextDesign = () => {
    setCurrentIndex((prev) => (prev + 1) % heroDesigns.length);
  };

  const prevDesign = () => {
    setCurrentIndex((prev) => (prev - 1 + heroDesigns.length) % heroDesigns.length);
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (grade === 'A-') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (grade === 'B+') return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const averageScore = Object.values(currentDesign.scores).reduce((a, b) => a + b, 0) / 5;

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-soft-beige shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-charcoal">FurnaceLog Hero Designs</h1>
              <p className="text-sm text-warm-gray">10 unique designs • Stylist reviewed</p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium text-sm transition-all",
                  viewMode === 'grid'
                    ? "bg-gradient-to-r from-burnt-sienna to-warm-orange text-white"
                    : "bg-soft-beige text-charcoal hover:bg-soft-amber/30"
                )}
              >
                <div className="flex items-center gap-2">
                  {viewMode === 'single' ? <Grid3x3 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  {viewMode === 'single' ? 'Grid View' : 'Single View'}
                </div>
              </button>

              {/* Stats Toggle */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium text-sm transition-all",
                  showStats
                    ? "bg-soft-amber/30 text-charcoal"
                    : "bg-soft-beige text-warm-gray hover:bg-soft-amber/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {showStats ? 'Hide Stats' : 'Show Stats'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Single View Mode */}
      {viewMode === 'single' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Design Info Card */}
          {showStats && (
            <div className="mb-6 bg-white rounded-2xl border border-soft-beige shadow-warm-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-charcoal">{currentDesign.name}</h2>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-bold border",
                      getGradeColor(currentDesign.grade)
                    )}>
                      Grade: {currentDesign.grade}
                    </span>
                    {currentDesign.recommended && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-600" />
                        Top 3 Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-warm-gray">{currentDesign.concept}</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-burnt-sienna">{averageScore.toFixed(1)}</div>
                  <div className="text-xs text-warm-gray">Average Score</div>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">{currentDesign.scores.visual}</div>
                  <div className="text-xs text-warm-gray flex items-center justify-center gap-1">
                    <Palette className="w-3 h-3" />
                    Visual
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">{currentDesign.scores.animation}</div>
                  <div className="text-xs text-warm-gray flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    Animation
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">{currentDesign.scores.brand}</div>
                  <div className="text-xs text-warm-gray flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    Brand
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">{currentDesign.scores.technical}</div>
                  <div className="text-xs text-warm-gray flex items-center justify-center gap-1">
                    <Code className="w-3 h-3" />
                    Technical
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">{currentDesign.scores.uniqueness}</div>
                  <div className="text-xs text-warm-gray flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    Uniqueness
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {currentDesign.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cream text-warm-gray text-xs rounded-lg border border-soft-beige"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hero Display */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevDesign}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-warm-lg flex items-center justify-center transition-all hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5 text-charcoal" />
            </button>
            <button
              onClick={nextDesign}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-warm-lg flex items-center justify-center transition-all hover:scale-110"
            >
              <ArrowRight className="w-5 h-5 text-charcoal" />
            </button>

            {/* Hero Component */}
            <div className="bg-white rounded-2xl border-2 border-soft-beige shadow-warm-lg overflow-hidden">
              <CurrentComponent />
            </div>

            {/* Design Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-charcoal/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {heroDesigns.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {heroDesigns.map((design, idx) => (
              <button
                key={design.id}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl border-2 transition-all",
                  idx === currentIndex
                    ? "bg-gradient-to-r from-burnt-sienna to-warm-orange text-white border-burnt-sienna shadow-warm-md"
                    : "bg-white text-charcoal border-soft-beige hover:border-soft-amber"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{design.name}</span>
                  {design.recommended && <Star className="w-3 h-3 fill-amber-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {heroDesigns.map((design, idx) => {
              const DesignComponent = design.component;
              return (
                <div
                  key={design.id}
                  className="bg-white rounded-2xl border-2 border-soft-beige shadow-warm-md overflow-hidden hover:shadow-warm-lg transition-shadow"
                >
                  {/* Mini Stats Header */}
                  {showStats && (
                    <div className="p-4 bg-cream border-b border-soft-beige">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-charcoal">{design.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-bold border",
                            getGradeColor(design.grade)
                          )}>
                            {design.grade}
                          </span>
                          {design.recommended && (
                            <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs text-warm-gray">
                        <span>Visual: {design.scores.visual}/10</span>
                        <span>•</span>
                        <span>Animation: {design.scores.animation}/10</span>
                        <span>•</span>
                        <span>Brand: {design.scores.brand}/10</span>
                      </div>
                    </div>
                  )}

                  {/* Hero Preview */}
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewMode('single');
                    }}
                  >
                    <DesignComponent />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
