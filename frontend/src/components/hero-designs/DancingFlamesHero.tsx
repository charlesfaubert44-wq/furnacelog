import { ArrowRight } from 'lucide-react';

/**
 * DancingFlamesHero Component
 *
 * A visually striking hero section featuring animated SVG flame elements rising from the bottom,
 * combined with subtle aurora borealis effects in the upper portion. This design creates a unique
 * blend of warmth (furnace/heating theme) and northern atmosphere (Arctic/Yellowknife theme).
 *
 * ANIMATION APPROACH:
 * - Flames: 5 individual SVG flame shapes positioned at bottom with staggered animations
 * - Each flame uses CSS keyframes for:
 *   1. translateY: Vertical movement (rising effect)
 *   2. opacity: Flickering/fading effect
 *   3. scale: Subtle size variations
 * - Animation duration: 25-30 seconds with ease-in-out for smooth, natural motion
 * - Delays are staggered to create organic, non-uniform flame behavior
 *
 * VISUAL HIERARCHY:
 * - Background: Warm gradient (burnt sienna to warm orange)
 * - Flames: Bottom layer with glowing shadows
 * - Aurora: Top third with subtle green/blue gradients
 * - Content: High contrast white text over semi-transparent backdrop
 */

interface DancingFlamesHeroProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export default function DancingFlamesHero({
  onGetStarted,
  onLearnMore
}: DancingFlamesHeroProps) {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-burnt-sienna via-warm-orange to-warm-coral border-b border-soft-beige/30 overflow-hidden">

      {/* ============================================
          FLAME ANIMATIONS - Bottom Layer
          ============================================ */}

      {/* Flame 1 - Left Edge */}
      <div
        className="absolute bottom-0 left-[5%] w-24 h-48 md:w-32 md:h-64 opacity-60"
        style={{
          animation: 'flame1 28s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(255, 107, 53, 0.6))',
        }}
      >
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main flame body - Warm Orange */}
          <path
            d="M50 180 Q30 140 35 100 Q40 60 50 20 Q60 60 65 100 Q70 140 50 180 Z"
            fill="#E88D5A"
            opacity="0.9"
          />
          {/* Inner flame - Ember Glow */}
          <path
            d="M50 160 Q38 130 42 100 Q45 70 50 40 Q55 70 58 100 Q62 130 50 160 Z"
            fill="#FF6B35"
            opacity="0.8"
          />
          {/* Core - Brightest */}
          <path
            d="M50 140 Q43 115 46 90 Q48 70 50 60 Q52 70 54 90 Q57 115 50 140 Z"
            fill="#FFF7ED"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Flame 2 - Left-Center */}
      <div
        className="absolute bottom-0 left-[22%] w-28 h-56 md:w-36 md:h-72 opacity-70"
        style={{
          animation: 'flame2 26s ease-in-out infinite 3s',
          filter: 'drop-shadow(0 0 35px rgba(255, 107, 53, 0.7))',
        }}
      >
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 185 Q28 135 32 95 Q38 55 50 15 Q62 55 68 95 Q72 135 50 185 Z"
            fill="#E88D5A"
            opacity="0.9"
          />
          <path
            d="M50 165 Q36 125 40 90 Q44 60 50 35 Q56 60 60 90 Q64 125 50 165 Z"
            fill="#FF6B35"
            opacity="0.85"
          />
          <path
            d="M50 145 Q42 110 45 85 Q47 65 50 55 Q53 65 55 85 Q58 110 50 145 Z"
            fill="#FFF7ED"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Flame 3 - Center (Tallest) */}
      <div
        className="absolute bottom-0 left-[45%] w-32 h-64 md:w-40 md:h-80 opacity-80"
        style={{
          animation: 'flame3 30s ease-in-out infinite 1.5s',
          filter: 'drop-shadow(0 0 40px rgba(255, 107, 53, 0.8))',
        }}
      >
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 190 Q25 130 30 85 Q35 45 50 10 Q65 45 70 85 Q75 130 50 190 Z"
            fill="#E88D5A"
            opacity="0.95"
          />
          <path
            d="M50 170 Q33 120 38 80 Q42 50 50 30 Q58 50 62 80 Q67 120 50 170 Z"
            fill="#FF6B35"
            opacity="0.9"
          />
          <path
            d="M50 150 Q40 105 44 75 Q46 55 50 50 Q54 55 56 75 Q60 105 50 150 Z"
            fill="#FFF7ED"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Flame 4 - Right-Center */}
      <div
        className="absolute bottom-0 right-[20%] w-26 h-52 md:w-34 md:h-68 opacity-65"
        style={{
          animation: 'flame4 27s ease-in-out infinite 4s',
          filter: 'drop-shadow(0 0 32px rgba(255, 107, 53, 0.65))',
        }}
      >
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 182 Q30 138 34 98 Q39 58 50 18 Q61 58 66 98 Q70 138 50 182 Z"
            fill="#E88D5A"
            opacity="0.88"
          />
          <path
            d="M50 162 Q37 128 41 95 Q45 68 50 38 Q55 68 59 95 Q63 128 50 162 Z"
            fill="#FF6B35"
            opacity="0.82"
          />
          <path
            d="M50 142 Q43 112 46 88 Q48 72 50 62 Q52 72 54 88 Q57 112 50 142 Z"
            fill="#FFF7ED"
            opacity="0.72"
          />
        </svg>
      </div>

      {/* Flame 5 - Right Edge */}
      <div
        className="absolute bottom-0 right-[6%] w-22 h-44 md:w-30 md:h-60 opacity-55"
        style={{
          animation: 'flame5 25s ease-in-out infinite 2s',
          filter: 'drop-shadow(0 0 28px rgba(255, 107, 53, 0.55))',
        }}
      >
        <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 178 Q32 142 36 102 Q41 62 50 22 Q59 62 64 102 Q68 142 50 178 Z"
            fill="#E88D5A"
            opacity="0.85"
          />
          <path
            d="M50 158 Q39 132 43 102 Q46 74 50 42 Q54 74 57 102 Q61 132 50 158 Z"
            fill="#FF6B35"
            opacity="0.78"
          />
          <path
            d="M50 138 Q44 116 47 92 Q49 76 50 64 Q51 76 53 92 Q56 116 50 138 Z"
            fill="#FFF7ED"
            opacity="0.68"
          />
        </svg>
      </div>

      {/* ============================================
          AURORA BOREALIS - Top Third Layer
          ============================================ */}

      {/* Aurora Wave 1 - Northern Lights Green */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3 opacity-25"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(126, 168, 143, 0.5) 30%, rgba(126, 168, 143, 0.7) 50%, rgba(126, 168, 143, 0.5) 70%, transparent 100%)',
          animation: 'aurora1 28s ease-in-out infinite',
          transformOrigin: 'center',
        }}
      />

      {/* Aurora Wave 2 - Winter Blue */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(156, 180, 196, 0.4) 25%, rgba(156, 180, 196, 0.6) 50%, rgba(156, 180, 196, 0.4) 75%, transparent 100%)',
          animation: 'aurora2 32s ease-in-out infinite 5s',
          transformOrigin: 'center',
        }}
      />

      {/* Aurora Wave 3 - Blended */}
      <div
        className="absolute top-0 left-0 right-0 h-1/4 opacity-15"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(126, 168, 143, 0.3) 35%, rgba(156, 180, 196, 0.4) 50%, rgba(126, 168, 143, 0.3) 65%, transparent 100%)',
          animation: 'aurora3 30s ease-in-out infinite 10s',
          transformOrigin: 'center',
        }}
      />

      {/* ============================================
          CSS KEYFRAME ANIMATIONS
          ============================================ */}

      <style>{`
        /* FLAME ANIMATIONS - Each flame has unique rising pattern */

        @keyframes flame1 {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-15px) scale(1.05);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-8px) scale(0.98);
            opacity: 0.55;
          }
          75% {
            transform: translateY(-20px) scale(1.03);
            opacity: 0.65;
          }
        }

        @keyframes flame2 {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-18px) scale(1.06);
            opacity: 0.8;
          }
          60% {
            transform: translateY(-10px) scale(0.97);
            opacity: 0.65;
          }
          80% {
            transform: translateY(-22px) scale(1.04);
            opacity: 0.75;
          }
        }

        @keyframes flame3 {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          20% {
            transform: translateY(-25px) scale(1.08);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-12px) scale(0.95);
            opacity: 0.75;
          }
          70% {
            transform: translateY(-30px) scale(1.06);
            opacity: 0.85;
          }
        }

        @keyframes flame4 {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.65;
          }
          35% {
            transform: translateY(-16px) scale(1.04);
            opacity: 0.75;
          }
          65% {
            transform: translateY(-9px) scale(0.99);
            opacity: 0.6;
          }
          85% {
            transform: translateY(-21px) scale(1.02);
            opacity: 0.7;
          }
        }

        @keyframes flame5 {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.55;
          }
          40% {
            transform: translateY(-14px) scale(1.03);
            opacity: 0.65;
          }
          70% {
            transform: translateY(-7px) scale(0.96);
            opacity: 0.5;
          }
          90% {
            transform: translateY(-19px) scale(1.01);
            opacity: 0.6;
          }
        }

        /* AURORA ANIMATIONS - Gentle wave-like motion */

        @keyframes aurora1 {
          0%, 100% {
            transform: translateX(-8%) translateY(0%) scaleY(1);
            opacity: 0.25;
          }
          33% {
            transform: translateX(8%) translateY(-2%) scaleY(1.08);
            opacity: 0.3;
          }
          66% {
            transform: translateX(-4%) translateY(2%) scaleY(0.96);
            opacity: 0.2;
          }
        }

        @keyframes aurora2 {
          0%, 100% {
            transform: translateX(4%) translateY(0%) scaleY(1);
            opacity: 0.2;
          }
          33% {
            transform: translateX(-6%) translateY(1.5%) scaleY(1.05);
            opacity: 0.25;
          }
          66% {
            transform: translateX(6%) translateY(-1.5%) scaleY(0.98);
            opacity: 0.18;
          }
        }

        @keyframes aurora3 {
          0%, 100% {
            transform: translateX(0%) translateY(-1%) scaleY(1);
            opacity: 0.15;
          }
          33% {
            transform: translateX(-10%) translateY(0.5%) scaleY(1.06);
            opacity: 0.2;
          }
          66% {
            transform: translateX(5%) translateY(-0.5%) scaleY(0.94);
            opacity: 0.12;
          }
        }
      `}</style>

      {/* ============================================
          CONTENT LAYER - Hero Text & CTAs
          ============================================ */}

      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8 z-10">
        {/* Main Headline - High contrast white with text shadow for legibility */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          Don't Let Poor Maintenance Cost You Thousands
        </h1>

        {/* Subheadline - Slightly transparent white with text shadow */}
        <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
          One forgotten furnace filter or missed heat trace check can cost $3,000-$5,000+ in emergency repairs. FurnaceLog helps northern homeowners prevent costly failures—completely free.
        </p>

        {/* CTA Buttons - White primary, transparent secondary */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-white hover:bg-cream text-charcoal text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Start Protecting Your Home
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onLearnMore}
            className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white text-lg font-bold rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            See How It Works
          </button>
        </div>

        {/* Yellowknife Tagline - Semi-transparent card at bottom */}
        <div className="flex items-center justify-center pt-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            {/* Heart Icon */}
            <svg className="w-5 h-5 text-white/90" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-white/90 text-sm font-medium">
              Built with love in Yellowknife, Northwest Territories
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
