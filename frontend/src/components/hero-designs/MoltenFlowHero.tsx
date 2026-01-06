import { ArrowRight } from 'lucide-react';

export default function MoltenFlowHero() {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-[#3A3A3A]">
      {/* SVG Background with Flowing Lava Streams */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients for Molten Lava */}
          <linearGradient id="lavaGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#EA580C" stopOpacity="1" />
            <stop offset="60%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="100%" stopColor="#E88D5A" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="lavaGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E88D5A" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="70%" stopColor="#EA580C" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="lavaGradient3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.85" />
          </linearGradient>

          {/* Ice Blue Gradient */}
          <linearGradient id="iceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#9CB4C4" stopOpacity="0.85" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="lavaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="iceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Flowing Molten Stream 1 - Bottom Left to Right */}
        <path
          d="M -200 500 Q 150 480, 400 520 T 900 500 T 1400 520 T 1800 500"
          fill="none"
          stroke="url(#lavaGradient1)"
          strokeWidth="120"
          strokeLinecap="round"
          opacity="0.6"
          filter="url(#lavaGlow)"
        >
          <animate
            attributeName="d"
            dur="40s"
            repeatCount="indefinite"
            values="
              M -200 500 Q 150 480, 400 520 T 900 500 T 1400 520 T 1800 500;
              M -200 520 Q 150 500, 400 540 T 900 520 T 1400 540 T 1800 520;
              M -200 510 Q 150 490, 400 530 T 900 510 T 1400 530 T 1800 510;
              M -200 500 Q 150 480, 400 520 T 900 500 T 1400 520 T 1800 500;
            "
          />
        </path>

        {/* Flowing Molten Stream 2 - Middle Diagonal */}
        <path
          d="M -100 250 Q 200 280, 500 260 T 1000 280 T 1500 260 T 1900 280"
          fill="none"
          stroke="url(#lavaGradient2)"
          strokeWidth="90"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#lavaGlow)"
        >
          <animate
            attributeName="d"
            dur="45s"
            repeatCount="indefinite"
            values="
              M -100 250 Q 200 280, 500 260 T 1000 280 T 1500 260 T 1900 280;
              M -100 270 Q 200 260, 500 280 T 1000 260 T 1500 280 T 1900 260;
              M -100 260 Q 200 270, 500 270 T 1000 270 T 1500 270 T 1900 270;
              M -100 250 Q 200 280, 500 260 T 1000 280 T 1500 260 T 1900 280;
            "
          />
        </path>

        {/* Flowing Molten Stream 3 - Top Wave */}
        <path
          d="M -150 150 Q 250 120, 600 140 T 1200 120 T 1800 140"
          fill="none"
          stroke="url(#lavaGradient3)"
          strokeWidth="70"
          strokeLinecap="round"
          opacity="0.4"
          filter="url(#lavaGlow)"
        >
          <animate
            attributeName="d"
            dur="38s"
            repeatCount="indefinite"
            values="
              M -150 150 Q 250 120, 600 140 T 1200 120 T 1800 140;
              M -150 140 Q 250 130, 600 150 T 1200 130 T 1800 150;
              M -150 145 Q 250 125, 600 145 T 1200 125 T 1800 145;
              M -150 150 Q 250 120, 600 140 T 1200 120 T 1800 140;
            "
          />
        </path>

        {/* Molten Blob 1 - Large Organic Shape */}
        <ellipse
          cx="300"
          cy="400"
          rx="180"
          ry="140"
          fill="url(#lavaGradient1)"
          opacity="0.35"
          filter="url(#lavaGlow)"
        >
          <animate
            attributeName="rx"
            dur="35s"
            repeatCount="indefinite"
            values="180;200;170;190;180"
          />
          <animate
            attributeName="ry"
            dur="35s"
            repeatCount="indefinite"
            values="140;120;150;130;140"
          />
          <animate
            attributeName="cy"
            dur="35s"
            repeatCount="indefinite"
            values="400;390;410;395;400"
          />
        </ellipse>

        {/* Molten Blob 2 - Right Side */}
        <ellipse
          cx="1200"
          cy="350"
          rx="150"
          ry="120"
          fill="url(#lavaGradient2)"
          opacity="0.3"
          filter="url(#lavaGlow)"
        >
          <animate
            attributeName="rx"
            dur="42s"
            repeatCount="indefinite"
            values="150;170;140;160;150"
          />
          <animate
            attributeName="ry"
            dur="42s"
            repeatCount="indefinite"
            values="120;110;135;115;120"
          />
          <animate
            attributeName="cx"
            dur="42s"
            repeatCount="indefinite"
            values="1200;1220;1190;1210;1200"
          />
        </ellipse>

        {/* Glacial Ice Formation - Top Left */}
        <polygon
          points="0,0 180,0 120,140 60,100"
          fill="url(#iceGradient)"
          opacity="0.7"
          filter="url(#iceGlow)"
        >
          <animate
            attributeName="opacity"
            dur="8s"
            repeatCount="indefinite"
            values="0.7;0.85;0.75;0.7"
          />
        </polygon>

        <polygon
          points="50,0 200,30 150,120 90,80"
          fill="url(#iceGradient)"
          opacity="0.5"
          filter="url(#iceGlow)"
        >
          <animate
            attributeName="opacity"
            dur="9s"
            repeatCount="indefinite"
            values="0.5;0.65;0.55;0.5"
          />
        </polygon>

        {/* Glacial Ice Formation - Top Right */}
        <polygon
          points="100%,0 calc(100% - 150px),0 calc(100% - 100px),130 calc(100% - 50px),90"
          fill="url(#iceGradient)"
          opacity="0.65"
          filter="url(#iceGlow)"
        >
          <animate
            attributeName="opacity"
            dur="7s"
            repeatCount="indefinite"
            values="0.65;0.8;0.7;0.65"
          />
        </polygon>

        <polygon
          points="100%,40 calc(100% - 120px),20 calc(100% - 80px),110 100%,140"
          fill="url(#iceGradient)"
          opacity="0.55"
          filter="url(#iceGlow)"
        >
          <animate
            attributeName="opacity"
            dur="10s"
            repeatCount="indefinite"
            values="0.55;0.7;0.6;0.55"
          />
        </polygon>

        {/* Additional Small Ice Shards */}
        <polygon
          points="150,20 220,10 200,80 170,60"
          fill="#3B82F6"
          opacity="0.4"
          filter="url(#iceGlow)"
        >
          <animate
            attributeName="opacity"
            dur="6s"
            repeatCount="indefinite"
            values="0.4;0.6;0.45;0.4"
          />
        </polygon>
      </svg>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px] px-6 sm:px-8 md:px-10">
        {/* Headline */}
        <div className="text-center max-w-[1100px] mx-auto mb-8 animate-fade-slide-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Control Your Heat
            <span className="block bg-gradient-to-r from-[#FF6B35] via-[#EA580C] to-[#E88D5A] bg-clip-text text-transparent mt-2 drop-shadow-[0_0_30px_rgba(255,107,53,0.5)]">
              From Anywhere
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#9CB4C4] leading-relaxed max-w-[900px] mx-auto mb-10 animate-fade-slide-up animate-delay-100 font-light">
          Monitor and manage your home heating system with powerful insights and remote control
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8 animate-fade-slide-up animate-delay-200">
          <button
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#EA580C] via-[#FF6B35] to-[#E88D5A] text-white text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            style={{
              boxShadow: '0 0 40px rgba(255, 107, 53, 0.6), 0 8px 24px rgba(234, 88, 12, 0.4)',
            }}
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </button>

          <button
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-[#3B82F6]/50 hover:border-[#60A5FA] text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/15 active:scale-95"
            style={{
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            Learn More
          </button>
        </div>

        {/* Yellowknife Tagline */}
        <div className="text-center animate-fade-slide-up animate-delay-300">
          <p className="text-sm sm:text-base md:text-lg text-[#9CB4C4]/80 font-medium tracking-wide">
            Engineered for the North
            <span className="inline-block mx-2 text-[#60A5FA]">•</span>
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#9CB4C4] bg-clip-text text-transparent font-bold">
              Yellowknife, NWT
            </span>
          </p>
        </div>
      </div>

      {/* Ambient Glow Overlays */}
      <div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at bottom left, rgba(234, 88, 12, 0.15) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/3 h-1/3 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
