import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Calendar, Wrench } from 'lucide-react';

const FireplaceHearthHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Ember particles
    class Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 2 - 1;
        this.size = Math.random() * 3 + 1;
        this.maxLife = Math.random() * 100 + 100;
        this.life = this.maxLife;
        this.color = Math.random() > 0.5 ? '#FF6B35' : '#F7931E';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vx *= 0.99;
        this.vy *= 0.98;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Snowflake particles for window
    class Snowflake {
      x: number;
      y: number;
      size: number;
      speed: number;
      wind: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind;

        // Reset if out of bounds (within window area)
        if (this.y > 150) {
          this.y = 0;
          this.x = Math.random() * 150;
        }
      }

      draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(offsetX + this.x, offsetY + this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const embers: Ember[] = [];
    const snowflakes: Snowflake[] = [];

    // Initialize snowflakes
    for (let i = 0; i < 30; i++) {
      snowflakes.push(new Snowflake(Math.random() * 150, Math.random() * 150));
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Spawn embers from log area
      if (Math.random() < 0.3) {
        const emberX = width / 2 + (Math.random() - 0.5) * 200;
        const emberY = height - 120;
        embers.push(new Ember(emberX, emberY));
      }

      // Update and draw embers
      for (let i = embers.length - 1; i >= 0; i--) {
        embers[i].update();
        if (embers[i].isDead()) {
          embers.splice(i, 1);
        } else {
          embers[i].draw(ctx);
        }
      }

      // Update and draw snowflakes in window area
      const windowX = width - 180;
      const windowY = 20;

      snowflakes.forEach(flake => {
        flake.update();
        flake.draw(ctx, windowX + 15, windowY + 15);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#C47A53] via-[#E88D5A] to-[#C47A53]">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial glow from fireplace */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-60 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #FF6B35 0%, #F7931E 30%, transparent 70%)',
            animationDuration: '4s',
            filter: 'blur(40px)',
          }}
        />

        {/* Flickering light effect */}
        <div
          className="absolute inset-0 animate-flicker"
          style={{
            background: 'radial-gradient(circle at 50% 80%, rgba(255, 107, 53, 0.2) 0%, transparent 60%)',
            animationDuration: '3s',
          }}
        />

        {/* Additional warm glow layers */}
        <div
          className="absolute bottom-0 left-0 right-0 h-96 opacity-40"
          style={{
            background: 'linear-gradient(to top, #F7931E, transparent)',
          }}
        />
      </div>

      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Frosted window in top-right corner */}
      <div className="absolute top-5 right-5 w-[160px] h-[160px] rounded-lg overflow-hidden border-4 border-[#5C4A3A] shadow-2xl bg-[#3B82F6]/20 backdrop-blur-md">
        {/* Window panes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-[#5C4A3A]" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-[#5C4A3A]" />
        </div>

        {/* Frost effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, white 0%, transparent 50%)',
          }}
        />

        {/* Snow scene visible through window */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a] via-[#2563eb] to-[#60a5fa]">
          {/* Snowflakes rendered on canvas */}
        </div>
      </div>

      {/* SVG Fireplace and Flames */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-[300px] pointer-events-none"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          {/* Wood texture pattern */}
          <pattern id="woodTexture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#5C4A3A"/>
            <path d="M0,20 Q25,15 50,20 T100,20" stroke="#4A3829" strokeWidth="2" fill="none"/>
            <path d="M0,50 Q25,45 50,50 T100,50" stroke="#4A3829" strokeWidth="1.5" fill="none"/>
            <path d="M0,80 Q25,75 50,80 T100,80" stroke="#4A3829" strokeWidth="1" fill="none"/>
          </pattern>

          {/* Flame gradients */}
          <radialGradient id="flameGradient1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FAF8F3" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#F7931E" stopOpacity="0.8"/>
            <stop offset="60%" stopColor="#FF6B35" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#C47A53" stopOpacity="0"/>
          </radialGradient>

          <radialGradient id="flameGradient2" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FAF8F3" stopOpacity="0.95"/>
            <stop offset="40%" stopColor="#F7931E" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0"/>
          </radialGradient>

          {/* Flame animations */}
          <filter id="flameGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Logs at bottom */}
        <g id="logs">
          {/* Log 1 - back left */}
          <rect x="350" y="220" width="180" height="35" rx="5" fill="url(#woodTexture)" opacity="0.7"/>
          <ellipse cx="440" cy="220" rx="90" ry="17.5" fill="#4A3829"/>

          {/* Log 2 - back right */}
          <rect x="650" y="230" width="200" height="40" rx="5" fill="url(#woodTexture)" opacity="0.8"/>
          <ellipse cx="750" cy="230" rx="100" ry="20" fill="#4A3829"/>

          {/* Log 3 - front center */}
          <rect x="450" y="260" width="300" height="40" rx="5" fill="url(#woodTexture)"/>
          <ellipse cx="600" cy="260" rx="150" ry="20" fill="#5C4A3A"/>

          {/* Wood end details */}
          <circle cx="600" cy="280" r="15" fill="#4A3829" opacity="0.6"/>
          <circle cx="600" cy="280" r="10" fill="#3d2f22" opacity="0.4"/>
        </g>

        {/* Animated Flames */}
        <g id="flames" filter="url(#flameGlow)">
          {/* Flame 1 - Left */}
          <path d="M480,240 Q470,200 480,160 Q490,120 500,100 Q510,120 520,160 Q530,200 520,240 Z"
                fill="url(#flameGradient1)" opacity="0.85">
            <animate attributeName="d"
                     dur="2.5s"
                     repeatCount="indefinite"
                     values="M480,240 Q470,200 480,160 Q490,120 500,100 Q510,120 520,160 Q530,200 520,240 Z;
                             M480,240 Q465,195 475,155 Q488,115 500,95 Q512,115 525,155 Q535,195 520,240 Z;
                             M480,240 Q475,205 485,165 Q492,125 500,105 Q508,125 515,165 Q525,205 520,240 Z;
                             M480,240 Q470,200 480,160 Q490,120 500,100 Q510,120 520,160 Q530,200 520,240 Z"/>
            <animate attributeName="opacity"
                     dur="1.8s"
                     repeatCount="indefinite"
                     values="0.85;0.95;0.75;0.85"/>
          </path>

          {/* Flame 2 - Center Main */}
          <path d="M570,250 Q555,210 560,160 Q565,110 580,80 Q595,110 600,160 Q605,210 590,250 Z"
                fill="url(#flameGradient2)" opacity="0.9">
            <animate attributeName="d"
                     dur="3s"
                     repeatCount="indefinite"
                     values="M570,250 Q555,210 560,160 Q565,110 580,80 Q595,110 600,160 Q605,210 590,250 Z;
                             M570,250 Q550,205 555,155 Q562,105 580,75 Q598,105 605,155 Q610,205 590,250 Z;
                             M570,250 Q560,215 565,165 Q568,115 580,85 Q592,115 595,165 Q600,215 590,250 Z;
                             M570,250 Q555,210 560,160 Q565,110 580,80 Q595,110 600,160 Q605,210 590,250 Z"/>
            <animate attributeName="opacity"
                     dur="2.2s"
                     repeatCount="indefinite"
                     values="0.9;0.95;0.8;0.9"/>
          </path>

          {/* Flame 3 - Center Secondary */}
          <path d="M600,245 Q590,200 595,150 Q600,100 610,75 Q620,100 625,150 Q630,200 620,245 Z"
                fill="url(#flameGradient1)" opacity="0.8">
            <animate attributeName="d"
                     dur="2.8s"
                     repeatCount="indefinite"
                     values="M600,245 Q590,200 595,150 Q600,100 610,75 Q620,100 625,150 Q630,200 620,245 Z;
                             M600,245 Q585,195 590,145 Q598,95 610,70 Q622,95 630,145 Q635,195 620,245 Z;
                             M600,245 Q595,205 600,155 Q602,105 610,80 Q618,105 620,155 Q625,205 620,245 Z;
                             M600,245 Q590,200 595,150 Q600,100 610,75 Q620,100 625,150 Q630,200 620,245 Z"/>
            <animate attributeName="opacity"
                     dur="2s"
                     repeatCount="indefinite"
                     values="0.8;0.9;0.7;0.8"/>
          </path>

          {/* Flame 4 - Right */}
          <path d="M680,240 Q670,200 675,160 Q682,120 690,100 Q698,120 705,160 Q710,200 700,240 Z"
                fill="url(#flameGradient2)" opacity="0.85">
            <animate attributeName="d"
                     dur="2.6s"
                     repeatCount="indefinite"
                     values="M680,240 Q670,200 675,160 Q682,120 690,100 Q698,120 705,160 Q710,200 700,240 Z;
                             M680,240 Q665,195 670,155 Q680,115 690,95 Q700,115 710,155 Q715,195 700,240 Z;
                             M680,240 Q675,205 680,165 Q685,125 690,105 Q695,125 700,165 Q705,205 700,240 Z;
                             M680,240 Q670,200 675,160 Q682,120 690,100 Q698,120 705,160 Q710,200 700,240 Z"/>
            <animate attributeName="opacity"
                     dur="1.9s"
                     repeatCount="indefinite"
                     values="0.85;0.95;0.75;0.85"/>
          </path>

          {/* Small accent flames */}
          <path d="M530,235 Q525,215 530,195 Q535,175 540,165 Q545,175 545,195 Q548,215 543,235 Z"
                fill="url(#flameGradient1)" opacity="0.7">
            <animate attributeName="opacity"
                     dur="1.5s"
                     repeatCount="indefinite"
                     values="0.7;0.85;0.6;0.7"/>
          </path>

          <path d="M640,238 Q635,218 638,198 Q642,178 646,168 Q650,178 652,198 Q654,218 650,238 Z"
                fill="url(#flameGradient2)" opacity="0.7">
            <animate attributeName="opacity"
                     dur="1.6s"
                     repeatCount="indefinite"
                     values="0.7;0.9;0.65;0.7"/>
          </path>
        </g>
      </svg>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-gradient-to-br from-[#FAF8F3] to-[#F7931E] shadow-2xl animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Flame className="w-10 h-10 text-[#C47A53]" />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-[#FAF8F3] drop-shadow-2xl animate-fade-slide-up"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(247, 147, 30, 0.4)',
              animationDelay: '0.3s'
            }}
          >
            Keep Your Home
            <br />
            Warm & Safe
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl sm:text-2xl mb-4 text-[#FAF8F3]/90 drop-shadow-lg max-w-2xl mx-auto animate-fade-slide-up"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              animationDelay: '0.4s'
            }}
          >
            Track furnace maintenance, schedule service, and protect your family from the cold
          </p>

          {/* Yellowknife Tagline */}
          <p
            className="text-lg mb-12 text-[#3B82F6] font-semibold drop-shadow-md animate-fade-slide-up"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.5)',
              animationDelay: '0.5s'
            }}
          >
            Built for Yellowknife's Arctic Winters
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-slide-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Button
              size="lg"
              className="min-w-[200px] bg-gradient-to-r from-[#F7931E] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#F7931E] text-white shadow-2xl text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(247,147,30,0.6)]"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Start Tracking
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px] bg-[#FAF8F3]/95 hover:bg-[#FAF8F3] text-[#C47A53] border-2 border-[#FAF8F3] shadow-xl text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,248,243,0.5)]"
            >
              <Wrench className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Trust badge */}
          <p
            className="mt-12 text-sm text-[#FAF8F3]/70 animate-fade-in"
            style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
              animationDelay: '0.8s'
            }}
          >
            Trusted by northern homeowners since 2024
          </p>
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Custom animations */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-flicker {
          animation: flicker 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-slide-up {
          animation: fade-slide-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FireplaceHearthHero;
