import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, className = '' }) => {
  const sizes = {
    sm: {
      icon: 32,
      text: 'text-xl',
      slogan: 'text-xs',
    },
    md: {
      icon: 40,
      text: 'text-2xl',
      slogan: 'text-sm',
    },
    lg: {
      icon: 56,
      text: 'text-4xl',
      slogan: 'text-base',
    },
    xl: {
      icon: 72,
      text: 'text-5xl',
      slogan: 'text-lg',
    },
  };

  const iconSize = sizes[size].icon;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Shield Badge with Furnace */}
      <div className="relative group" style={{ width: iconSize, height: iconSize }}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-warm-md"
        >
          {/* Protective Shield Background */}
          <path
            d="M24 4L6 10V20C6 30 10 38 24 44C38 38 42 30 42 20V10L24 4Z"
            fill="url(#shieldGradient)"
            stroke="#5C4A3A"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Inner Glow - represents warmth radiating */}
          <circle
            cx="24"
            cy="24"
            r="14"
            fill="url(#warmGlow)"
            opacity="0.3"
            className="pulse-glow"
          />

          {/* Furnace/Heat System Icon */}
          <g className="furnace-unit">
            {/* Furnace Body */}
            <rect
              x="16"
              y="18"
              width="16"
              height="18"
              rx="2"
              fill="url(#furnaceGradient)"
              stroke="#5C4A3A"
              strokeWidth="1.5"
            />

            {/* Furnace Vent Lines */}
            <line x1="18" y1="22" x2="30" y2="22" stroke="#8B6F47" strokeWidth="1" opacity="0.6" />
            <line x1="18" y1="25" x2="30" y2="25" stroke="#8B6F47" strokeWidth="1" opacity="0.6" />
            <line x1="18" y1="28" x2="30" y2="28" stroke="#8B6F47" strokeWidth="1" opacity="0.6" />

            {/* Flame inside furnace */}
            <g className="flame-glow">
              <path
                d="M24 32C24 32 21 30.5 21 27.5C21 24.5 22.5 23 24 23C25.5 23 27 24.5 27 27.5C27 30.5 24 32 24 32Z"
                fill="url(#flameGradient)"
              />
              {/* Bright core */}
              <ellipse
                cx="24"
                cy="27"
                rx="1.5"
                ry="2"
                fill="#FAF8F3"
                opacity="0.9"
              />
            </g>

            {/* Control dial/indicator */}
            <circle
              cx="24"
              cy="14"
              r="3"
              fill="#E8DCC4"
              stroke="#5C4A3A"
              strokeWidth="1"
            />
            <circle
              cx="24"
              cy="14"
              r="1"
              fill="#C94A06"
              className="indicator-pulse"
            />
          </g>

          {/* Checkmark - represents monitoring/tracking */}
          <g className="checkmark" opacity="0.8">
            <circle
              cx="36"
              cy="12"
              r="5"
              fill="url(#checkGradient)"
              stroke="#5C4A3A"
              strokeWidth="1"
            />
            <path
              d="M34 12L35.5 13.5L38 11"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Gradients */}
          <defs>
            {/* Shield gradient - protective warmth */}
            <linearGradient id="shieldGradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E8DCC4" />
              <stop offset="50%" stopColor="#D4A574" />
              <stop offset="100%" stopColor="#C47A53" />
            </linearGradient>

            {/* Warm glow radiating from center */}
            <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4A582" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E88D5A" stopOpacity="0" />
            </radialGradient>

            {/* Furnace body gradient */}
            <linearGradient id="furnaceGradient" x1="24" y1="18" x2="24" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5F1E8" />
              <stop offset="100%" stopColor="#E8DCC4" />
            </linearGradient>

            {/* Flame gradient - warm fire colors */}
            <linearGradient id="flameGradient" x1="24" y1="23" x2="24" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F4A582" />
              <stop offset="50%" stopColor="#E88D5A" />
              <stop offset="100%" stopColor="#D4A574" />
            </linearGradient>

            {/* Checkmark badge gradient */}
            <linearGradient id="checkGradient" x1="36" y1="7" x2="36" y2="17" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C94A06" />
              <stop offset="100%" stopColor="#E88D5A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <h1
          className={`${sizes[size].text} font-black tracking-tight leading-none`}
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <span className="bg-gradient-to-r from-wood-dark to-wood-light bg-clip-text text-transparent">
            Furnace
          </span>
          <span className="bg-gradient-to-r from-warm-orange to-soft-amber bg-clip-text text-transparent">
            Log
          </span>
        </h1>
        {showSlogan && (
          <p className={`${sizes[size].slogan} text-warm-gray font-medium mt-0.5`}>
            Track. Monitor. Protect.
          </p>
        )}
      </div>

      <style>{`
        @keyframes gentleGlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }

        @keyframes indicatorPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .flame-glow {
          animation: gentleGlow 2s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }

        .indicator-pulse {
          animation: indicatorPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
