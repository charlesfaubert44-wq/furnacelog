import { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'ember' | 'snowflake';
  horizontalDrift: number;
}

interface EmberParticlesHeroProps {
  className?: string;
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

const EmberParticlesHero = ({
  className,
  onGetStarted,
  onLearnMore,
}: EmberParticlesHeroProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate particles array with random properties
  const particles = useMemo<Particle[]>(() => {
    const particleCount = 125;
    const emberRatio = 0.6; // 60% embers, 40% snowflakes

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random x position (0-100%)
      y: 100 + Math.random() * 20, // Start below viewport
      size: 2 + Math.random() * 4, // Random size (2px - 6px)
      duration: 40 + Math.random() * 20, // Random duration (40-60s)
      delay: Math.random() * 10, // Random delay (0-10s)
      type: Math.random() < emberRatio ? 'ember' : 'snowflake',
      horizontalDrift: -20 + Math.random() * 40, // Random horizontal drift (-20 to +20)
    }));
  }, []);

  return (
    <div
      className={cn(
        'relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center justify-center',
        className
      )}
      style={{
        background: 'linear-gradient(to bottom, #F5F1E8 0%, #E8DCC4 100%)',
      }}
    >
      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted &&
          particles.map((particle) => {
            const isEmber = particle.type === 'ember';

            return (
              <div
                key={particle.id}
                className={cn(
                  'absolute rounded-full',
                  isEmber ? 'ember-particle' : 'snowflake-particle'
                )}
                style={{
                  left: `${particle.x}%`,
                  bottom: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: isEmber
                    ? Math.random() > 0.5
                      ? '#FF6B35'
                      : '#E88D5A'
                    : '#3B82F6',
                  boxShadow: isEmber
                    ? `0 0 ${particle.size * 2}px ${particle.size}px rgba(255, 107, 53, 0.3)`
                    : 'none',
                  animation: `floatUp ${particle.duration}s ease-in infinite`,
                  animationDelay: `${particle.delay}s`,
                  '--drift-x': `${particle.horizontalDrift}px`,
                  '--particle-size': `${particle.size}px`,
                } as React.CSSProperties}
              />
            );
          })}
      </div>

      {/* Snowflake SVG particles for more detailed snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted &&
          particles
            .filter((p) => p.type === 'snowflake')
            .slice(0, 50) // Use first 50 snowflakes for SVG version
            .map((particle) => (
              <svg
                key={`svg-${particle.id}`}
                className="absolute snowflake-svg"
                style={{
                  left: `${particle.x}%`,
                  bottom: `${particle.y}%`,
                  width: `${particle.size * 2}px`,
                  height: `${particle.size * 2}px`,
                  animation: `floatUp ${particle.duration}s ease-in infinite`,
                  animationDelay: `${particle.delay}s`,
                  '--drift-x': `${particle.horizontalDrift}px`,
                } as React.CSSProperties}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
              </svg>
            ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Headline */}
        <div className="mb-6 animate-fade-slide-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-4">
            <span className="text-[#3A3A3A]">Track Your Heat,</span>
            <span className="block bg-gradient-to-r from-[#FF6B35] to-[#E88D5A] bg-clip-text text-transparent mt-2">
              Embrace the Warmth
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-[#3A3A3A]/80 leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-slide-up animate-delay-100">
          Monitor your wood stove, furnace, and home comfort with intelligent
          tracking. Built for the Arctic, designed for simplicity.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 animate-fade-slide-up animate-delay-200">
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FF6B35] hover:bg-[#E88D5A] text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onLearnMore}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-[#F5F1E8] border-2 border-[#3A3A3A]/20 hover:border-[#FF6B35]/30 text-[#3A3A3A] text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Learn More
          </button>
        </div>

        {/* Yellowknife Tagline */}
        <p className="text-sm md:text-base text-[#3A3A3A]/60 animate-fade-slide-up animate-delay-300">
          Proudly serving Yellowknife, Northwest Territories
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--drift-x, 0), -100vh);
            opacity: 0;
          }
        }

        .ember-particle {
          filter: blur(0.5px);
        }

        .snowflake-particle {
          filter: blur(0.3px);
          opacity: 0.7;
        }

        .snowflake-svg {
          opacity: 0.6;
          filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.3));
        }

        @keyframes fade-slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-slide-up {
          animation: fade-slide-up 0.8s ease-out forwards;
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
    </div>
  );
};

export default EmberParticlesHero;
