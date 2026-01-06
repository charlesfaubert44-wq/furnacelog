import React from 'react';
import { cn } from '@/lib/utils';

interface ThermalBloomHeroProps {
  className?: string;
}

export const ThermalBloomHero: React.FC<ThermalBloomHeroProps> = ({ className }) => {
  return (
    <div className={cn("relative w-full min-h-screen overflow-hidden bg-charcoal", className)}>
      {/* Thermal Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-flame-red via-warm-orange via-soft-amber via-northern-lights-green via-tech-blue to-ice-blue">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/20 to-charcoal/60" />
      </div>

      {/* Animated Thermal Bloom Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Ring 1 - Innermost, hottest */}
        <div
          className="absolute w-32 h-32 rounded-full animate-thermal-bloom-1"
          style={{
            background: 'radial-gradient(circle, #DC2626 0%, #EA580C 30%, #E88D5A 60%, transparent 100%)',
            filter: 'blur(20px)',
            animationDelay: '0s'
          }}
        />

        {/* Ring 2 */}
        <div
          className="absolute w-64 h-64 rounded-full animate-thermal-bloom-2"
          style={{
            background: 'radial-gradient(circle, #EA580C 0%, #E88D5A 30%, #D4A574 60%, transparent 100%)',
            filter: 'blur(25px)',
            animationDelay: '3s'
          }}
        />

        {/* Ring 3 */}
        <div
          className="absolute w-96 h-96 rounded-full animate-thermal-bloom-3"
          style={{
            background: 'radial-gradient(circle, #E88D5A 0%, #D4A574 30%, #7EA88F 60%, transparent 100%)',
            filter: 'blur(30px)',
            animationDelay: '6s'
          }}
        />

        {/* Ring 4 */}
        <div
          className="absolute w-128 h-128 rounded-full animate-thermal-bloom-4"
          style={{
            background: 'radial-gradient(circle, #D4A574 0%, #7EA88F 30%, #0284C7 60%, transparent 100%)',
            filter: 'blur(35px)',
            animationDelay: '9s',
            width: '32rem',
            height: '32rem'
          }}
        />

        {/* Ring 5 - Outermost, coolest */}
        <div
          className="absolute w-160 h-160 rounded-full animate-thermal-bloom-5"
          style={{
            background: 'radial-gradient(circle, #7EA88F 0%, #0284C7 30%, #3B82F6 60%, transparent 100%)',
            filter: 'blur(40px)',
            animationDelay: '12s',
            width: '40rem',
            height: '40rem'
          }}
        />

        {/* Pulsing Core Heat Source */}
        <div
          className="absolute w-20 h-20 rounded-full animate-pulse-heat"
          style={{
            background: 'radial-gradient(circle, #FFFFFF 0%, #DC2626 40%, #EA580C 70%, transparent 100%)',
            filter: 'blur(15px)'
          }}
        />
      </div>

      {/* Thermal Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 animate-scanline"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)',
          }}
        />
        <div
          className="absolute inset-0 animate-scanline-slow"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(2, 132, 199, 0.02) 3px, rgba(2, 132, 199, 0.02) 6px)',
          }}
        />
      </div>

      {/* Thermal Data Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          className="w-full h-full"
        />
      </div>

      {/* Thermal Reading Indicators */}
      <div className="absolute top-8 right-8 text-ice-blue font-mono text-sm space-y-1 opacity-70">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-flame-red animate-pulse" />
          <span>THERMAL SCAN ACTIVE</span>
        </div>
        <div className="text-xs opacity-60">
          <div>TEMP RANGE: -40°C to 1200°C</div>
          <div>LOCATION: YELLOWKNIFE, NT</div>
          <div className="animate-pulse">BLOOM CYCLE: ACTIVE</div>
        </div>
      </div>

      {/* Temperature Scale Indicator */}
      <div className="absolute bottom-8 left-8 space-y-2">
        <div className="text-white/70 font-mono text-xs mb-3">THERMAL SCALE</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-flame-red to-flame-red" />
            <span className="text-white/70 font-mono text-xs">1200°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-heat-orange to-heat-orange" />
            <span className="text-white/70 font-mono text-xs">800°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-warm-orange to-warm-orange" />
            <span className="text-white/70 font-mono text-xs">500°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-soft-amber to-soft-amber" />
            <span className="text-white/70 font-mono text-xs">250°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-northern-lights-green to-northern-lights-green" />
            <span className="text-white/70 font-mono text-xs">20°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-tech-blue to-tech-blue" />
            <span className="text-white/70 font-mono text-xs">0°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-gradient-to-r from-ice-blue to-ice-blue" />
            <span className="text-white/70 font-mono text-xs">-40°C</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <div className="mb-8 animate-fade-in">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
            }}
          >
            FurnaceLog
          </h1>
          <div className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-medium mb-2">
            Thermal Monitoring Excellence
          </div>
          <div className="text-lg sm:text-xl text-tech-blue font-mono">
            Advanced Home Heating Management
          </div>
        </div>

        {/* Description */}
        <p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mb-12 leading-relaxed"
          style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          Track your furnace performance with precision thermal analytics.
          Engineered for extreme conditions, from arctic cold to scorching heat.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            className="group relative px-8 py-4 bg-gradient-to-r from-flame-red to-heat-orange text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-heat-orange to-flame-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Monitoring
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          <button
            className="group relative px-8 py-4 bg-tech-blue/20 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-tech-blue transition-all duration-300 hover:bg-tech-blue/40 hover:scale-105"
            style={{
              boxShadow: '0 0 20px rgba(2, 132, 199, 0.3)'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              View Analytics
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
          </button>
        </div>

        {/* Yellowknife Tagline */}
        <div
          className="text-sm sm:text-base text-ice-blue font-mono flex items-center gap-2"
          style={{
            textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>ENGINEERED IN YELLOWKNIFE, NT</span>
          <div className="w-2 h-2 rounded-full bg-northern-lights-green animate-pulse" />
        </div>

        {/* Technical Specifications Footer */}
        <div className="absolute bottom-8 right-8 left-8 sm:left-auto">
          <div className="flex flex-wrap justify-center sm:justify-end gap-6 text-xs font-mono text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-northern-lights-green animate-pulse" />
              <span>REAL-TIME TRACKING</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-warm-orange animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>THERMAL ANALYTICS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tech-blue animate-pulse" style={{ animationDelay: '1s' }} />
              <span>ARCTIC OPTIMIZED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations Styles */}
      <style jsx>{`
        @keyframes thermal-bloom-1 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes thermal-bloom-2 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(3.5);
            opacity: 0;
          }
        }

        @keyframes thermal-bloom-3 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes thermal-bloom-4 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes thermal-bloom-5 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes pulse-heat {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes scanline-slow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-thermal-bloom-1 {
          animation: thermal-bloom-1 25s ease-in-out infinite;
        }

        .animate-thermal-bloom-2 {
          animation: thermal-bloom-2 26s ease-in-out infinite;
        }

        .animate-thermal-bloom-3 {
          animation: thermal-bloom-3 27s ease-in-out infinite;
        }

        .animate-thermal-bloom-4 {
          animation: thermal-bloom-4 28s ease-in-out infinite;
        }

        .animate-thermal-bloom-5 {
          animation: thermal-bloom-5 30s ease-in-out infinite;
        }

        .animate-pulse-heat {
          animation: pulse-heat 4s ease-in-out infinite;
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        .animate-scanline-slow {
          animation: scanline-slow 12s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center,
            #DC2626 0%,
            #EA580C 15%,
            #E88D5A 30%,
            #D4A574 45%,
            #7EA88F 60%,
            #0284C7 75%,
            #3B82F6 100%
          );
        }
      `}</style>
    </div>
  );
};

export default ThermalBloomHero;
