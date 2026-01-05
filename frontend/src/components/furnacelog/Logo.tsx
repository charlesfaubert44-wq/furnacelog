import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, className = '' }) => {
  const sizes = {
    sm: {
      text: 'text-3xl',
      slogan: 'text-xs',
    },
    md: {
      text: 'text-4xl',
      slogan: 'text-sm',
    },
    lg: {
      text: 'text-6xl',
      slogan: 'text-lg',
    },
    xl: {
      text: 'text-7xl',
      slogan: 'text-xl',
    },
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Main Wordmark */}
      <h1
        className={`${sizes[size].text} font-black leading-none tracking-tighter`}
        style={{
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '-0.03em',
        }}
      >
        {/* "Furnace" with charcoal color to match headlines */}
        <span className="text-charcoal">
          Furnace
        </span>
        {/* "Log" with warm gradient */}
        <span className="bg-gradient-to-br from-warm-orange via-burnt-sienna to-warm-coral bg-clip-text text-transparent">
          Log
        </span>
      </h1>

      {/* Slogan to the right */}
      {showSlogan && (
        <p className={`${sizes[size].slogan} text-warm-gray font-bold tracking-wide uppercase border-l-2 border-warm-orange/30 pl-4`}
           style={{ letterSpacing: '0.1em' }}>
          Track. Monitor. Protect.
        </p>
      )}
    </div>
  );
};
