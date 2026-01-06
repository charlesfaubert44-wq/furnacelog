import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FurnaceCoreHeroProps {
  onGetStarted?: () => void;
  className?: string;
}

export default function FurnaceCoreHero({
  onGetStarted,
  className = '',
}: FurnaceCoreHeroProps) {
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: '#F5F1E8' }}
    >
      {/* Animated Background Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Radial Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at center,
                rgba(234, 88, 12, 0.15) 0%,
                rgba(232, 141, 90, 0.12) 15%,
                rgba(220, 38, 38, 0.08) 30%,
                rgba(245, 241, 232, 0) 60%
              )
            `,
          }}
        />

        {/* Pulsing Core Circles */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Outer pulse ring 1 */}
          <svg
            className="absolute w-[800px] h-[800px] opacity-40"
            viewBox="0 0 800 800"
            style={{
              animation: 'pulse-expand-1 25s ease-in-out infinite',
            }}
          >
            <defs>
              <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E88D5A" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#EA580C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0.1" />
              </radialGradient>
              <filter id="glow1">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="400"
              cy="400"
              r="200"
              fill="url(#gradient1)"
              filter="url(#glow1)"
            />
          </svg>

          {/* Outer pulse ring 2 */}
          <svg
            className="absolute w-[700px] h-[700px] opacity-50"
            viewBox="0 0 700 700"
            style={{
              animation: 'pulse-expand-2 22s ease-in-out infinite',
              animationDelay: '3s',
            }}
          >
            <defs>
              <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EA580C" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#DC2626" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E88D5A" stopOpacity="0.1" />
              </radialGradient>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="350"
              cy="350"
              r="180"
              fill="url(#gradient2)"
              filter="url(#glow2)"
            />
          </svg>

          {/* Middle pulse ring */}
          <svg
            className="absolute w-[500px] h-[500px] opacity-60"
            viewBox="0 0 500 500"
            style={{
              animation: 'pulse-core 20s ease-in-out infinite',
              animationDelay: '6s',
            }}
          >
            <defs>
              <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#EA580C" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E88D5A" stopOpacity="0.2" />
              </radialGradient>
              <filter id="heatDistortion">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="250"
              cy="250"
              r="150"
              fill="url(#gradient3)"
              filter="url(#heatDistortion)"
            />
          </svg>

          {/* Inner core */}
          <svg
            className="absolute w-[300px] h-[300px] opacity-70"
            viewBox="0 0 300 300"
            style={{
              animation: 'pulse-core-inner 18s ease-in-out infinite',
              animationDelay: '1s',
            }}
          >
            <defs>
              <radialGradient id="gradientCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="1" />
                <stop offset="40%" stopColor="#EA580C" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#E88D5A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E88D5A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="100" fill="url(#gradientCore)" />
          </svg>
        </div>

        {/* Heat wave distortion overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              repeating-radial-gradient(
                circle at center,
                transparent 0px,
                rgba(234, 88, 12, 0.1) 100px,
                transparent 200px
              )
            `,
            animation: 'heat-wave 15s ease-in-out infinite',
          }}
        />
      </div>

      {/* Arctic Icicles - Top Left */}
      <div className="absolute top-0 left-0 pointer-events-none">
        <svg
          width="200"
          height="300"
          viewBox="0 0 200 300"
          className="opacity-80"
          style={{ animation: 'sway-left 8s ease-in-out infinite' }}
        >
          <defs>
            <linearGradient id="icicle-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
            </linearGradient>
            <filter id="ice-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="30,0 50,0 40,120"
            fill="url(#icicle-gradient-1)"
            filter="url(#ice-glow)"
            opacity="0.8"
          />
          <polygon
            points="80,0 100,0 90,150"
            fill="url(#icicle-gradient-1)"
            filter="url(#ice-glow)"
            opacity="0.7"
          />
          <polygon
            points="130,0 150,0 140,100"
            fill="url(#icicle-gradient-1)"
            filter="url(#ice-glow)"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Arctic Icicles - Top Right */}
      <div className="absolute top-0 right-0 pointer-events-none">
        <svg
          width="200"
          height="300"
          viewBox="0 0 200 300"
          className="opacity-80"
          style={{ animation: 'sway-right 7s ease-in-out infinite' }}
        >
          <defs>
            <linearGradient id="icicle-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <polygon
            points="50,0 70,0 60,130"
            fill="url(#icicle-gradient-2)"
            filter="url(#ice-glow)"
            opacity="0.75"
          />
          <polygon
            points="100,0 120,0 110,110"
            fill="url(#icicle-gradient-2)"
            filter="url(#ice-glow)"
            opacity="0.8"
          />
          <polygon
            points="150,0 170,0 160,140"
            fill="url(#icicle-gradient-2)"
            filter="url(#ice-glow)"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl font-black leading-tight animate-fade-slide-up"
          style={{ color: '#3A3A3A' }}
        >
          Don't Let Poor Maintenance Cost You Thousands
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed animate-fade-slide-up"
          style={{
            color: '#3A3A3A',
            opacity: 0.9,
            animationDelay: '0.1s',
          }}
        >
          One forgotten furnace filter or missed heat trace check can cost
          $3,000-$5,000+ in emergency repairs. FurnaceLog helps northern
          homeowners prevent costly failures—completely free.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-white hover:bg-opacity-90 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl"
            style={{
              color: '#3A3A3A',
              backgroundColor: 'white',
            }}
          >
            Start Protecting Your Home
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2.5 px-10 py-5 border-2 text-lg font-bold rounded-xl transition-all duration-300 hover:bg-opacity-10 backdrop-blur-sm"
            style={{
              color: '#3A3A3A',
              borderColor: 'rgba(58, 58, 58, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            See How It Works
          </a>
        </div>

        {/* Yellowknife Tagline */}
        <div
          className="flex items-center justify-center pt-8 animate-fade-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div
            className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-sm border rounded-full"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderColor: 'rgba(58, 58, 58, 0.2)',
            }}
          >
            <svg
              className="w-5 h-5"
              fill="#DC2626"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className="text-sm font-medium"
              style={{ color: '#3A3A3A', opacity: 0.9 }}
            >
              Built with love in Yellowknife, Northwest Territories
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-expand-1 {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.6;
          }
        }

        @keyframes pulse-expand-2 {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
            opacity: 0.7;
          }
        }

        @keyframes pulse-core {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          33% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          66% {
            transform: scale(0.95);
            opacity: 0.5;
          }
        }

        @keyframes pulse-core-inner {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          40% {
            transform: scale(1.15);
            opacity: 0.9;
          }
          70% {
            transform: scale(0.9);
            opacity: 0.6;
          }
        }

        @keyframes heat-wave {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1) rotate(10deg);
            opacity: 0.3;
          }
        }

        @keyframes sway-left {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(-5px) rotate(-2deg);
          }
        }

        @keyframes sway-right {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(5px) rotate(2deg);
          }
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

        .animate-fade-slide-up {
          animation: fade-slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
