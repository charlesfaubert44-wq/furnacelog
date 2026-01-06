import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatWaveHeroProps {
  className?: string;
}

export default function HeatWaveHero({ className }: HeatWaveHeroProps) {
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setAnimationTime(elapsed);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Calculate turbulence frequency for heat wave effect
  const baseFrequency = 0.01 + Math.sin(animationTime * 0.3) * 0.005;

  return (
    <div className={cn('relative w-full min-h-[600px] overflow-hidden', className)}>
      {/* SVG Filters Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          {/* Heat Wave Distortion Filter */}
          <filter id="heat-wave-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="3"
              result="turbulence"
              seed="2"
            >
              <animate
                attributeName="baseFrequency"
                values="0.005;0.015;0.005"
                dur="18s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacement"
            >
              <animate
                attributeName="scale"
                values="10;20;10"
                dur="15s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
            <feGaussianBlur in="displacement" stdDeviation="0.5" result="blur" />
            <feBlend in="blur" in2="SourceGraphic" mode="normal" />
          </filter>

          {/* Cool Edge Gradient - Left */}
          <linearGradient id="cool-gradient-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#9CB4C4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FAF8F3" stopOpacity="0" />
          </linearGradient>

          {/* Cool Edge Gradient - Right */}
          <linearGradient id="cool-gradient-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#9CB4C4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FAF8F3" stopOpacity="0" />
          </linearGradient>

          {/* Subtle Texture Pattern */}
          <pattern id="subtle-texture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="#E8DCC4" opacity="0.1" />
            <circle cx="50" cy="50" r="0.5" fill="#E8DCC4" opacity="0.08" />
            <circle cx="90" cy="30" r="0.5" fill="#E8DCC4" opacity="0.12" />
            <circle cx="30" cy="70" r="0.5" fill="#E8DCC4" opacity="0.09" />
            <circle cx="70" cy="90" r="0.5" fill="#E8DCC4" opacity="0.11" />
          </pattern>
        </defs>
      </svg>

      {/* Base Background with Texture */}
      <div className="absolute inset-0 bg-[#FAF8F3]">
        <svg className="w-full h-full">
          <rect width="100%" height="100%" fill="url(#subtle-texture)" />
        </svg>
      </div>

      {/* Cool Blue Edges - Being Pushed Back */}
      <div className="absolute inset-0">
        {/* Left Cool Edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/4 transition-all duration-[20s] ease-in-out"
          style={{
            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.25), rgba(156, 180, 196, 0.15), transparent)',
            opacity: 0.6 + Math.sin(animationTime * 0.2) * 0.2,
            transform: `translateX(${Math.sin(animationTime * 0.15) * -10}px)`,
          }}
        />

        {/* Right Cool Edge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/4 transition-all duration-[20s] ease-in-out"
          style={{
            background: 'linear-gradient(to left, rgba(59, 130, 246, 0.25), rgba(156, 180, 196, 0.15), transparent)',
            opacity: 0.6 + Math.cos(animationTime * 0.2) * 0.2,
            transform: `translateX(${Math.cos(animationTime * 0.15) * 10}px)`,
          }}
        />
      </div>

      {/* Heat Wave Distortion Layer - Middle Third */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-2/3 h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 10%, rgba(232, 141, 90, 0.03) 50%, transparent 90%)',
            filter: 'url(#heat-wave-distortion)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] px-6 py-16">
        {/* Headline */}
        <div className="text-center max-w-[900px] mx-auto mb-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#3A3A3A] leading-[1.1] tracking-tight mb-4">
            Keep Your Home
            <span className="block mt-2 bg-gradient-to-r from-[#E88D5A] via-[#E88D5A] to-[#E8DCC4] bg-clip-text text-transparent">
              Warm & Safe
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-lg md:text-xl lg:text-2xl text-[#3A3A3A]/70 leading-relaxed max-w-[700px] mx-auto mb-8 animate-fade-in-up">
          Monitor your furnace, track maintenance, and ensure reliable heat
          <span className="block mt-2 text-base md:text-lg text-[#3B82F6]/80 font-medium">
            Built for Yellowknife's Arctic Winters
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 animate-fade-in-up-delay">
          <button
            onClick={() => console.log('Start Free Trial clicked')}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#E88D5A] hover:bg-[#E88D5A]/90 text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#learn-more"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 hover:bg-white border-2 border-[#E8DCC4] hover:border-[#E88D5A]/30 text-[#3A3A3A] text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            Learn More
          </a>
        </div>

        {/* Yellowknife Tagline with Arctic Accent */}
        <div className="flex items-center gap-2 text-sm md:text-base text-[#3A3A3A]/60 animate-fade-in-up-delay-2">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
          <span className="font-medium">Proudly serving Yellowknife, Northwest Territories</span>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
        </div>

        {/* Subtle Heat Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-[#E88D5A]/40"
              style={{
                height: `${16 + Math.sin(animationTime * 2 + i * 1.2) * 6}px`,
                transition: 'height 0.3s ease-out',
              }}
            />
          ))}
        </div>
      </div>

      {/* Warm Glow Overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(232, 141, 90, 0.08) 0%, transparent 60%)',
          opacity: 0.5 + Math.sin(animationTime * 0.25) * 0.2,
        }}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
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
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
