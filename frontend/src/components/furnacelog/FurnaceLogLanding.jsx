import React, { useMemo } from 'react';

const FurnaceLogLanding = () => {
  const flames = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
      size: 15 + Math.random() * 35,
      opacity: 0.08 + Math.random() * 0.1,
      hue: Math.random() > 0.5 ? 'orange' : 'amber',
    }));
  }, []);

  const embers = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 5,
      size: 1 + Math.random() * 2.5,
    }));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/10 via-transparent to-transparent" />

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at bottom center, rgba(234, 88, 12, 0.15) 0%, rgba(194, 65, 12, 0.08) 30%, transparent 70%)',
          animation: 'warmthPulse 6s ease-in-out infinite',
        }}
      />

      {/* Flame particles */}
      <div className="absolute inset-0 pointer-events-none">
        {flames.map((flame) => (
          <div
            key={flame.id}
            className="absolute bottom-0"
            style={{
              left: `${flame.left}%`,
              animation: `flameRise ${flame.duration}s ease-out infinite`,
              animationDelay: `${flame.delay}s`,
            }}
          >
            <div
              className={`rounded-full blur-xl ${flame.hue === 'orange' ? 'bg-orange-600' : 'bg-amber-500'}`}
              style={{
                width: `${flame.size}px`,
                height: `${flame.size * 1.5}px`,
                opacity: flame.opacity * 0.6,
                animation: `flameFlicker ${1 + Math.random() * 0.5}s ease-in-out infinite alternate`,
              }}
            />
          </div>
        ))}

        {embers.map((ember) => (
          <div
            key={`ember-${ember.id}`}
            className="absolute bottom-0 bg-orange-500 rounded-full"
            style={{
              left: `${ember.left}%`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              animation: `emberFloat ${ember.duration}s ease-out infinite`,
              animationDelay: `${ember.delay}s`,
              boxShadow: '0 0 3px 1px rgba(251, 146, 60, 0.25)',
            }}
          />
        ))}
      </div>

      {/* Heat wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 opacity-10"
        style={{
          background: 'linear-gradient(to top, rgba(234, 88, 12, 0.15), transparent)',
          animation: 'heatWave 5s ease-in-out infinite',
        }}
      />

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-1 flex items-baseline" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', textRendering: 'optimizeLegibility' }}>
          <span className="text-white" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>FURNACE</span>
          <span className="relative inline-block">
            {/* Steam smoke from top of L */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '0px',
                left: '0px',
              }}
            >
              {/* Steam wisp 1 */}
              <div className="absolute steam-1" style={{ left: '2px', top: '-12px' }}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" style={{ transform: 'translateY(-100%)' }}>
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
              {/* Steam wisp 2 */}
              <div className="absolute steam-2" style={{ left: '4px', top: '-10px' }}>
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" style={{ transform: 'translateY(-100%)' }}>
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
              {/* Steam wisp 3 */}
              <div className="absolute steam-3" style={{ left: '3px', top: '-8px' }}>
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ transform: 'translateY(-100%)' }}>
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
              {/* Steam puff 1 */}
              <div
                className="absolute rounded-full steam-puff-1"
                style={{
                  width: '8px',
                  height: '8px',
                  left: '3px',
                  top: '-4px',
                  background: 'radial-gradient(circle, rgba(200,200,200,0.5) 0%, transparent 70%)',
                  filter: 'blur(2px)',
                }}
              />
              {/* Steam puff 2 */}
              <div
                className="absolute rounded-full steam-puff-2"
                style={{
                  width: '6px',
                  height: '6px',
                  left: '5px',
                  top: '-2px',
                  background: 'radial-gradient(circle, rgba(190,190,190,0.4) 0%, transparent 70%)',
                  filter: 'blur(2px)',
                }}
              />
            </div>
            <span
              className="log-text"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
                color: '#A33D05',
              }}
            >LOG</span><span className="text-gray-500 font-bold text-2xl md:text-4xl" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>.com</span>
          </span>
        </h1>

        {/* Slogan */}
        <p className="text-sm md:text-base text-gray-500 tracking-wide mt-2">
          When did you last change your filter? <span className="text-gray-600 italic">...exactly.</span>
        </p>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes flameRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-35vh) scale(0.2); opacity: 0; }
        }
        @keyframes flameFlicker {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(0.9) scaleY(1.05); }
        }
        @keyframes emberFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.25; }
          100% { transform: translateY(-50vh) translateX(20px); opacity: 0; }
        }
        @keyframes warmthPulse {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.3; transform: translateX(-50%) scale(1.03); }
        }
        @keyframes heatWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
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
        @keyframes steamPuff1 {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.3);
          }
          20% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) scale(1.5) translateX(-4px);
          }
        }
        @keyframes steamPuff2 {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.3);
          }
          20% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateY(-28px) scale(1.4) translateX(3px);
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
        .steam-puff-1 {
          animation: steamPuff1 2.5s ease-out infinite;
          animation-delay: 0.5s;
        }
        .steam-puff-2 {
          animation: steamPuff2 3s ease-out infinite;
          animation-delay: 1.8s;
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

export default FurnaceLogLanding;
