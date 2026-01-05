import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, className = '' }) => {
  const sizes = {
    sm: {
      text: 'text-2xl',
      slogan: 'text-xs',
    },
    md: {
      text: 'text-3xl',
      slogan: 'text-sm',
    },
    lg: {
      text: 'text-5xl',
      slogan: 'text-base',
    },
    xl: {
      text: 'text-6xl',
      slogan: 'text-lg',
    },
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Wordmark */}
      <div className="relative">
        <h1
          className={`${sizes[size].text} font-black leading-none tracking-tighter relative`}
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.03em',
          }}
        >
          {/* "Furnace" with wood gradient and shadow */}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-br from-wood-dark via-walnut to-wood-dark bg-clip-text text-transparent drop-shadow-sm">
              Furnace
            </span>
            {/* Subtle glow behind text */}
            <span className="absolute inset-0 bg-gradient-to-br from-wood-dark to-walnut bg-clip-text text-transparent opacity-20 blur-sm">
              Furnace
            </span>
          </span>
          {/* "Log" with warm gradient and emphasis */}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-br from-warm-orange via-burnt-sienna to-warm-coral bg-clip-text text-transparent drop-shadow-md">
              Log
            </span>
            {/* Warm glow effect */}
            <span className="absolute inset-0 bg-gradient-to-br from-warm-orange to-warm-coral bg-clip-text text-transparent opacity-30 blur-sm animate-pulse-slow">
              Log
            </span>
          </span>
        </h1>

        {/* Decorative underline accent */}
        <div className="relative mt-1">
          <div className="h-1 bg-gradient-to-r from-transparent via-warm-orange to-transparent opacity-40 rounded-full" />
          <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-warm-orange to-transparent opacity-60 blur-sm rounded-full" />
        </div>

        {showSlogan && (
          <p className={`${sizes[size].slogan} text-warm-gray font-bold mt-2 tracking-wide uppercase`}
             style={{ letterSpacing: '0.1em' }}>
            Track. Monitor. Protect.
          </p>
        )}
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
