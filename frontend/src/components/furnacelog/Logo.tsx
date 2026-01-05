import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, className = '' }) => {
  const sizeClasses = {
    sm: {
      text: 'text-2xl md:text-3xl',
      dot: 'text-base md:text-xl',
      slogan: 'text-xs',
    },
    md: {
      text: 'text-3xl md:text-4xl',
      dot: 'text-lg md:text-2xl',
      slogan: 'text-xs md:text-sm',
    },
    lg: {
      text: 'text-4xl md:text-5xl',
      dot: 'text-2xl md:text-3xl',
      slogan: 'text-sm md:text-base',
    },
    xl: {
      text: 'text-5xl md:text-7xl',
      dot: 'text-2xl md:text-4xl',
      slogan: 'text-sm md:text-base',
    },
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <h1
        className={`${sizeClasses[size].text} font-black tracking-tight flex items-baseline`}
        style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', textRendering: 'optimizeLegibility' }}
      >
        <span className="text-white">FURNACE</span>
        <span className="relative inline-block">
          {/* Steam smoke from top of L */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: size === 'sm' ? '-4px' : size === 'md' ? '-6px' : size === 'lg' ? '-8px' : '0px',
              left: '0px',
            }}
          >
            {/* Steam wisps - scaled based on size */}
            <div className="absolute steam-1" style={{ left: size === 'sm' ? '1px' : '2px', top: size === 'sm' ? '-6px' : size === 'md' ? '-8px' : size === 'lg' ? '-10px' : '-12px' }}>
              <svg width={size === 'sm' ? '8' : size === 'md' ? '10' : '12'} height={size === 'sm' ? '14' : size === 'md' ? '16' : '20'} viewBox="0 0 12 20" fill="none" style={{ transform: 'translateY(-100%)' }}>
                <path
                  d="M6 20 Q3 16 6 12 Q2 8 6 4 Q4 0 6 -4"
                  stroke="rgba(200,200,200,0.6)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'blur(1px)' }}
                />
              </svg>
            </div>
            <div className="absolute steam-2" style={{ left: size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px', top: size === 'sm' ? '-5px' : size === 'md' ? '-7px' : size === 'lg' ? '-8px' : '-10px' }}>
              <svg width={size === 'sm' ? '7' : size === 'md' ? '8' : '10'} height={size === 'sm' ? '12' : size === 'md' ? '14' : '18'} viewBox="0 0 10 18" fill="none" style={{ transform: 'translateY(-100%)' }}>
                <path
                  d="M5 18 Q8 14 5 10 Q9 6 5 2 Q7 -2 5 -5"
                  stroke="rgba(180,180,180,0.5)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'blur(1.5px)' }}
                />
              </svg>
            </div>
            <div className="absolute steam-3" style={{ left: size === 'sm' ? '1.5px' : size === 'md' ? '2px' : '3px', top: size === 'sm' ? '-4px' : size === 'md' ? '-5px' : size === 'lg' ? '-6px' : '-8px' }}>
              <svg width={size === 'sm' ? '7' : size === 'md' ? '8' : '10'} height={size === 'sm' ? '10' : size === 'md' ? '12' : '16'} viewBox="0 0 10 16" fill="none" style={{ transform: 'translateY(-100%)' }}>
                <path
                  d="M5 16 Q2 12 5 8 Q1 4 5 0 Q3 -3 5 -6"
                  stroke="rgba(170,170,170,0.45)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'blur(2px)' }}
                />
              </svg>
            </div>
          </div>
          <span
            className="log-text"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              color: '#A33D05',
            }}
          >LOG</span>
          <span className={`text-gray-500 font-bold ${sizeClasses[size].dot}`}>.com</span>
        </span>
      </h1>

      {showSlogan && (
        <p className={`${sizeClasses[size].slogan} text-gray-500 tracking-wide mt-1`}>
          When did you last change your filter? <span className="text-gray-600 italic">...exactly.</span>
        </p>
      )}

      <style>{`
        @keyframes steamRise1 {
          0% {
            opacity: 0;
            transform: translateY(0) scaleY(0.5);
          }
          15% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scaleY(1) translateX(-3px);
          }
        }
        @keyframes steamRise2 {
          0% {
            opacity: 0;
            transform: translateY(0) scaleY(0.5);
          }
          15% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateY(-35px) scaleY(1) translateX(4px);
          }
        }
        @keyframes steamRise3 {
          0% {
            opacity: 0;
            transform: translateY(0) scaleY(0.5);
          }
          15% {
            opacity: 0.45;
          }
          100% {
            opacity: 0;
            transform: translateY(-28px) scaleY(1) translateX(-2px);
          }
        }
        .steam-1 {
          animation: steamRise1 3s ease-out infinite;
        }
        .steam-2 {
          animation: steamRise2 3.5s ease-out infinite;
          animation-delay: 1s;
        }
        .steam-3 {
          animation: steamRise3 4s ease-out infinite;
          animation-delay: 2s;
        }
        .log-text {
          animation: furnaceBurn 3s ease-in-out infinite;
        }
        @keyframes furnaceBurn {
          0%, 100% {
            filter: brightness(1);
            text-shadow: 0 0 2px rgba(163, 61, 5, 0.3);
          }
          25% {
            filter: brightness(1.08);
            text-shadow: 0 0 4px rgba(201, 74, 6, 0.4);
          }
          50% {
            filter: brightness(1.12);
            text-shadow: 0 0 6px rgba(229, 88, 7, 0.5);
          }
          75% {
            filter: brightness(1.05);
            text-shadow: 0 0 3px rgba(180, 65, 5, 0.35);
          }
        }
      `}</style>
    </div>
  );
};
