import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArcticSunriseHeroProps {
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

export default function ArcticSunriseHero({
  headline = {
    normal: 'Track Your Furnace',
    highlight: 'With Northern Precision',
  },
  subtitle = 'Monitor fuel levels, maintenance, and efficiency for homes in Yellowknife and beyond',
  ctaPrimary = {
    text: 'Start Tracking',
    onClick: () => console.log('Get Started'),
  },
  ctaSecondary = {
    text: 'Learn More',
    href: '#features',
  },
  tagline = 'Built for Yellowknife Winters',
  className,
}: ArcticSunriseHeroProps) {
  const [sunProgress, setSunProgress] = useState(0);

  // Animate the sunrise cycle
  useEffect(() => {
    const duration = 45000; // 45 seconds for full cycle
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      setSunProgress(progress);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Calculate dynamic colors based on sunrise progress
  const getSkyGradient = () => {
    const progress = sunProgress;

    if (progress < 0.3) {
      // Early sunrise - darker orange to coral
      return 'linear-gradient(to bottom, #D4A574 0%, #E88D5A 40%, #F4A582 100%)';
    } else if (progress < 0.6) {
      // Mid sunrise - brighter warm tones
      return 'linear-gradient(to bottom, #F4A582 0%, #E88D5A 30%, #F7931E 60%, #F4A582 100%)';
    } else {
      // Late sunrise/daylight - lighter sky
      return 'linear-gradient(to bottom, #C4D7E0 0%, #F4A582 50%, #E88D5A 100%)';
    }
  };

  // Calculate sun position (rises from -20% to 30% of container height)
  const sunPosition = -20 + (sunProgress * 50);

  // Calculate sun opacity (fades in and out)
  const sunOpacity = Math.sin(sunProgress * Math.PI);

  return (
    <div
      className={cn('relative w-full overflow-hidden', className)}
      style={{ minHeight: '600px' }}
    >
      {/* Background Container */}
      <div className="absolute inset-0">
        {/* Animated Sky Gradient */}
        <div
          className="absolute inset-0 transition-all duration-[3000ms] ease-in-out"
          style={{
            background: getSkyGradient(),
          }}
        />

        {/* Snow-covered Ground */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '35%',
            background: 'linear-gradient(to bottom, #E8DCC4 0%, #F5F1E8 100%)',
          }}
        />

        {/* Horizon Line */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: '35%',
            height: '2px',
            background: 'linear-gradient(to right, transparent 0%, #D4A574 50%, transparent 100%)',
            opacity: 0.3,
          }}
        />

        {/* Animated Sun */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            bottom: `${sunPosition}%`,
            opacity: sunOpacity,
          }}
        >
          {/* Sun Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(247, 147, 30, 0.4) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Sun Circle */}
          <div
            className="relative"
            style={{
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, #F7931E 0%, #E88D5A 100%)',
              borderRadius: '50%',
              boxShadow: '0 0 60px rgba(247, 147, 30, 0.6)',
            }}
          />
        </div>

        {/* Animated Sun Rays */}
        <svg
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: `${sunPosition}%`,
            width: '400px',
            height: '400px',
            opacity: sunOpacity * 0.3,
          }}
        >
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) - 90;
            const rayOpacity = Math.sin((sunProgress * 4 * Math.PI) + (i * Math.PI / 6)) * 0.5 + 0.5;

            return (
              <line
                key={i}
                x1="200"
                y1="200"
                x2={200 + Math.cos(angle * Math.PI / 180) * 150}
                y2={200 + Math.sin(angle * Math.PI / 180) * 150}
                stroke="#F7931E"
                strokeWidth="2"
                opacity={rayOpacity}
                className="transition-opacity duration-1000"
              />
            );
          })}
        </svg>

        {/* Northern Buildings Silhouettes */}
        <svg
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '40%' }}
          viewBox="0 0 1200 300"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Building 1 - Left */}
          <rect x="50" y="180" width="80" height="120" fill="#3A3A3A" opacity="0.9" />
          <rect x="55" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="75" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="100" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="55" y="215" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="75" y="215" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="100" y="215" width="15" height="20" fill="#4A4A4A" opacity="0.5" />

          {/* Building 2 - Center-Left */}
          <rect x="180" y="160" width="100" height="140" fill="#3A3A3A" opacity="0.85" />
          <rect x="190" y="170" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="210" y="170" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="230" y="170" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="190" y="200" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="210" y="200" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="230" y="200" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <polygon points="180,160 230,130 280,160" fill="#3A3A3A" opacity="0.9" />

          {/* Evergreen Trees - Left Group */}
          <polygon points="320,220 340,160 360,220" fill="#2A3A2A" opacity="0.9" />
          <rect x="337" y="220" width="6" height="80" fill="#3A3A3A" />
          <polygon points="350,230 365,180 380,230" fill="#2A3A2A" opacity="0.85" />
          <rect x="362" y="230" width="6" height="70" fill="#3A3A3A" />
          <polygon points="385,240 398,195 411,240" fill="#2A3A2A" opacity="0.8" />
          <rect x="395" y="240" width="6" height="60" fill="#3A3A3A" />

          {/* Building 3 - Center */}
          <rect x="450" y="190" width="90" height="110" fill="#3A3A3A" opacity="0.9" />
          <rect x="455" y="195" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="475" y="195" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="495" y="195" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="515" y="195" width="15" height="20" fill="#4A4A4A" opacity="0.5" />

          {/* Evergreen Trees - Center Group */}
          <polygon points="570,230 590,170 610,230" fill="#2A3A2A" opacity="0.9" />
          <rect x="587" y="230" width="6" height="70" fill="#3A3A3A" />
          <polygon points="600,240 615,195 630,240" fill="#2A3A2A" opacity="0.85" />
          <rect x="612" y="240" width="6" height="60" fill="#3A3A3A" />
          <polygon points="635,235 648,190 661,235" fill="#2A3A2A" opacity="0.8" />
          <rect x="645" y="235" width="6" height="65" fill="#3A3A3A" />

          {/* Building 4 - Center-Right */}
          <rect x="700" y="175" width="95" height="125" fill="#3A3A3A" opacity="0.85" />
          <rect x="710" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="730" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="750" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="770" y="185" width="15" height="20" fill="#4A4A4A" opacity="0.5" />

          {/* Evergreen Trees - Right Group */}
          <polygon points="830,235 848,185 866,235" fill="#2A3A2A" opacity="0.9" />
          <rect x="845" y="235" width="6" height="65" fill="#3A3A3A" />
          <polygon points="860,245 873,200 886,245" fill="#2A3A2A" opacity="0.85" />
          <rect x="870" y="245" width="6" height="55" fill="#3A3A3A" />

          {/* Building 5 - Right */}
          <rect x="920" y="195" width="85" height="105" fill="#3A3A3A" opacity="0.8" />
          <rect x="930" y="205" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="950" y="205" width="15" height="20" fill="#4A4A4A" opacity="0.5" />
          <rect x="970" y="205" width="15" height="20" fill="#4A4A4A" opacity="0.5" />

          {/* More Evergreen Trees - Far Right */}
          <polygon points="1040,240 1055,195 1070,240" fill="#2A3A2A" opacity="0.85" />
          <rect x="1052" y="240" width="6" height="60" fill="#3A3A3A" />
          <polygon points="1075,250 1088,210 1101,250" fill="#2A3A2A" opacity="0.8" />
          <rect x="1085" y="250" width="6" height="50" fill="#3A3A3A" />

          {/* Subtle Building Shadows on Snow */}
          <ellipse cx="90" cy="300" rx="40" ry="8" fill="#3A3A3A" opacity="0.1" />
          <ellipse cx="230" cy="300" rx="50" ry="8" fill="#3A3A3A" opacity="0.1" />
          <ellipse cx="495" cy="300" rx="45" ry="8" fill="#3A3A3A" opacity="0.1" />
          <ellipse cx="747" cy="300" rx="47" ry="8" fill="#3A3A3A" opacity="0.1" />
          <ellipse cx="962" cy="300" rx="42" ry="8" fill="#3A3A3A" opacity="0.1" />
        </svg>

        {/* Snow Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const x = (i * 37 + 23) % 100;
            const y = 65 + ((i * 13) % 30);
            const delay = (i * 0.3) % 3;
            const duration = 2 + ((i * 0.5) % 2);

            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] px-6 text-center">
        {/* Yellowknife Tagline */}
        <div className="mb-6 animate-fade-in">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
            style={{
              background: 'rgba(58, 58, 58, 0.3)',
              backdropFilter: 'blur(10px)',
              color: '#F5F1E8',
              border: '1px solid rgba(212, 165, 116, 0.3)',
            }}
          >
            {tagline}
          </span>
        </div>

        {/* Headline */}
        <div className="max-w-[900px] mx-auto mb-6 animate-fade-slide-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-3">
            <span
              className="block"
              style={{
                color: '#FFFFFF',
                textShadow: '0 2px 20px rgba(58, 58, 58, 0.3)',
              }}
            >
              {headline.normal}
            </span>
            <span
              className="block mt-2"
              style={{
                background: 'linear-gradient(135deg, #F7931E 0%, #E88D5A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
            >
              {headline.highlight}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-[700px] mx-auto mb-8 animate-fade-slide-up animate-delay-100"
          style={{
            color: '#3A3A3A',
            textShadow: '0 1px 3px rgba(255, 255, 255, 0.5)',
          }}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-slide-up animate-delay-200">
          <button
            onClick={ctaPrimary.onClick}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #F7931E 0%, #E88D5A 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(247, 147, 30, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(247, 147, 30, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(247, 147, 30, 0.3)';
            }}
          >
            {ctaPrimary.text}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(58, 58, 58, 0.3)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                border: '1px solid rgba(212, 165, 116, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(247, 147, 30, 0.6)';
                e.currentTarget.style.background = 'rgba(58, 58, 58, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.4)';
                e.currentTarget.style.background = 'rgba(58, 58, 58, 0.3)';
              }}
            >
              {ctaSecondary.text}
            </a>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-slide-up {
          animation: fade-slide-up 1s ease-out;
        }

        .animate-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
