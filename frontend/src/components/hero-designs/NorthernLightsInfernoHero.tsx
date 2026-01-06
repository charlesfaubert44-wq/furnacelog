import { ArrowRight } from 'lucide-react';

interface NorthernLightsInfernoHeroProps {
  headline?: {
    normal: string;
    highlight: string;
  };
  subtitle?: string;
  ctaPrimary?: {
    text: string;
    onClick: () => void;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
  tagline?: string;
  className?: string;
}

const defaultProps = {
  headline: {
    normal: 'Keep Your Home Warm,',
    highlight: 'Track Every Degree',
  },
  subtitle: 'Smart furnace monitoring for Yellowknife homes. Never worry about your heating system again.',
  ctaPrimary: {
    text: 'Start Monitoring',
    onClick: () => console.log('CTA clicked'),
  },
  ctaSecondary: {
    text: 'Learn More',
    href: '#features',
  },
  tagline: 'Built for Yellowknife winters',
};

export default function NorthernLightsInfernoHero({
  headline = defaultProps.headline,
  subtitle = defaultProps.subtitle,
  ctaPrimary = defaultProps.ctaPrimary,
  ctaSecondary = defaultProps.ctaSecondary,
  tagline = defaultProps.tagline,
  className = '',
}: NorthernLightsInfernoHeroProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3A3A3A] via-[#4A4540] to-[#FAF8F3]" />

      {/* Aurora Layer 1 - Slow, Deep Orange/Red */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #E88D5A 20%, #DC2626 40%, #E88D5A 60%, transparent 100%)',
          animation: 'aurora1 35s ease-in-out infinite',
          transformOrigin: 'center',
        }}
      />

      {/* Aurora Layer 2 - Medium Speed, Amber/Coral */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #D4A574 15%, #F4A582 35%, #D4A574 55%, transparent 100%)',
          animation: 'aurora2 30s ease-in-out infinite',
          animationDelay: '-5s',
          transformOrigin: 'center',
        }}
      />

      {/* Aurora Layer 3 - Fast, Burnt Sienna/Orange */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #C47A53 25%, #E88D5A 45%, #C47A53 65%, transparent 100%)',
          animation: 'aurora3 32s ease-in-out infinite',
          animationDelay: '-10s',
          transformOrigin: 'center',
        }}
      />

      {/* Aurora Layer 4 - Very Slow, Red/Amber Accent */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #DC2626 30%, #D4A574 50%, #DC2626 70%, transparent 100%)',
          animation: 'aurora4 33s ease-in-out infinite',
          animationDelay: '-15s',
          transformOrigin: 'center',
        }}
      />

      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes aurora1 {
          0%, 100% {
            transform: translateX(-50%) translateY(0%) scaleY(1);
            opacity: 0.2;
          }
          25% {
            transform: translateX(-25%) translateY(5%) scaleY(1.1);
            opacity: 0.25;
          }
          50% {
            transform: translateX(0%) translateY(0%) scaleY(0.9);
            opacity: 0.15;
          }
          75% {
            transform: translateX(25%) translateY(-5%) scaleY(1.05);
            opacity: 0.2;
          }
        }

        @keyframes aurora2 {
          0%, 100% {
            transform: translateX(30%) translateY(-3%) scaleY(0.95);
            opacity: 0.15;
          }
          33% {
            transform: translateX(-10%) translateY(2%) scaleY(1.08);
            opacity: 0.2;
          }
          66% {
            transform: translateX(10%) translateY(-4%) scaleY(0.92);
            opacity: 0.12;
          }
        }

        @keyframes aurora3 {
          0%, 100% {
            transform: translateX(-30%) translateY(4%) scaleY(1.05);
            opacity: 0.25;
          }
          30% {
            transform: translateX(20%) translateY(-2%) scaleY(0.9);
            opacity: 0.18;
          }
          60% {
            transform: translateX(-10%) translateY(3%) scaleY(1.1);
            opacity: 0.28;
          }
        }

        @keyframes aurora4 {
          0%, 100% {
            transform: translateX(40%) translateY(-5%) scaleY(1);
            opacity: 0.1;
          }
          40% {
            transform: translateX(-30%) translateY(0%) scaleY(1.15);
            opacity: 0.15;
          }
          80% {
            transform: translateX(10%) translateY(-3%) scaleY(0.88);
            opacity: 0.08;
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-slide-up {
          animation: fadeSlideUp 0.8s ease-out forwards;
        }

        .animate-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animate-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>

      {/* Content Container */}
      <div className="relative z-10 min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center px-6 sm:px-8 md:px-10 py-16 md:py-20">
        {/* Headline */}
        <div className="text-center max-w-[1000px] mx-auto mb-6 animate-fade-slide-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] tracking-tight drop-shadow-lg">
            {headline.normal}
            <span className="block bg-gradient-to-r from-[#F4A582] via-[#E88D5A] to-[#D4A574] bg-clip-text text-transparent mt-2 drop-shadow-xl">
              {headline.highlight}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-[800px] mx-auto mb-10 drop-shadow-md animate-fade-slide-up animate-delay-100">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-slide-up animate-delay-200">
          <button
            onClick={ctaPrimary.onClick}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#E88D5A] via-[#DC2626] to-[#C47A53] hover:shadow-2xl text-white text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
          >
            {ctaPrimary.text}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-white/50 hover:border-[#E88D5A]/50 text-[#3A3A3A] text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              {ctaSecondary.text}
            </a>
          )}
        </div>

        {/* Yellowknife Tagline */}
        {tagline && (
          <div className="text-center animate-fade-slide-up animate-delay-300">
            <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium tracking-wide uppercase drop-shadow-md">
              {tagline}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Fade Overlay - Ensures smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF8F3] to-transparent z-5" />
    </div>
  );
}
