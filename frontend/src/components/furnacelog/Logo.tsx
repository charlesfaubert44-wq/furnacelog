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
      {/* House Icon with Fireplace */}
      <div className="relative group" style={{ width: iconSize, height: iconSize }}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-warm-sm"
        >
          {/* House Shape */}
          <path
            d="M4 20L24 4L44 20V42C44 43.1046 43.1046 44 42 44H6C4.89543 44 4 43.1046 4 42V20Z"
            fill="url(#houseGradient)"
            stroke="#8B6F47"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Roof */}
          <path
            d="M2 22L24 2L46 22"
            stroke="#5C4A3A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Window Left */}
          <rect
            x="10"
            y="16"
            width="10"
            height="10"
            rx="2"
            fill="#F5F1E8"
            opacity="0.6"
          />

          {/* Window Right */}
          <rect
            x="28"
            y="16"
            width="10"
            height="10"
            rx="2"
            fill="#F5F1E8"
            opacity="0.6"
          />

          {/* Door */}
          <rect
            x="18"
            y="30"
            width="12"
            height="14"
            rx="1"
            fill="#8B6F47"
          />

          {/* Fireplace Flame */}
          <g className="flame-glow">
            <path
              d="M24 26C24 26 20 24 20 20C20 16 22 14 24 14C26 14 28 16 28 20C28 24 24 26 24 26Z"
              fill="url(#flameGradient)"
              className="animate-pulse"
              style={{ transformOrigin: '24px 20px' }}
            />
            {/* Flame Core */}
            <ellipse
              cx="24"
              cy="20"
              rx="2"
              ry="3"
              fill="#FAF8F3"
              opacity="0.9"
            />
          </g>

          {/* Chimney */}
          <rect
            x="30"
            y="6"
            width="6"
            height="10"
            fill="#5C4A3A"
            stroke="#4A3628"
            strokeWidth="1"
          />

          {/* Smoke wisps */}
          <g className="smoke" opacity="0.4">
            <path
              d="M33 6Q31 4 33 2"
              stroke="#6B5D50"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              className="wisp-1"
            />
            <path
              d="M35 5Q37 3 35 1"
              stroke="#6B5D50"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              className="wisp-2"
            />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="houseGradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E8DCC4" />
              <stop offset="100%" stopColor="#D4A574" />
            </linearGradient>
            <linearGradient id="flameGradient" x1="24" y1="14" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F4A582" />
              <stop offset="50%" stopColor="#E88D5A" />
              <stop offset="100%" stopColor="#D4A574" />
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
            Your Home, Always Protected
          </p>
        )}
      </div>

      <style>{`
        @keyframes gentleGlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes smokeRise {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }

        .flame-glow {
          animation: gentleGlow 2s ease-in-out infinite;
        }

        .wisp-1 {
          animation: smokeRise 3s ease-out infinite;
        }

        .wisp-2 {
          animation: smokeRise 3.5s ease-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};
