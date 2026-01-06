import React from 'react';

const FurnaceBlueprintHero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#F5F1E8] overflow-hidden">
      {/* Blueprint Grid Pattern Background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#3A3A3A"
              strokeWidth="0.5"
              opacity="0.15"
            />
          </pattern>
          <pattern id="blueprintGridLarge" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#blueprintGrid)" />
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="#3A3A3A"
              strokeWidth="1"
              opacity="0.25"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGridLarge)" />
      </svg>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#3A3A3A] bg-white/50 backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span className="text-sm font-mono text-[#3A3A3A]">Yellowknife, NT</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#3A3A3A] leading-tight">
                Engineered for
                <br />
                <span className="text-[#E88D5A]">Arctic Winters</span>
              </h1>
              <p className="text-xl text-[#3A3A3A]/80 font-light max-w-xl">
                Professional furnace monitoring and maintenance tracking designed for extreme cold climates.
                Keep your home warm when it matters most.
              </p>
            </div>

            {/* Temperature Comparison */}
            <div className="flex items-center gap-8 p-6 bg-white/60 backdrop-blur-sm border-2 border-[#3A3A3A]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <path d="M12 2v10m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#3B82F6]">-40°C</p>
                  <p className="text-xs font-mono text-[#3A3A3A]/60">Outside</p>
                </div>
              </div>

              <div className="w-px h-12 bg-[#3A3A3A]/20"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E88D5A]/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E88D5A" strokeWidth="2">
                    <path d="M12 2v10m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#E88D5A]">+20°C</p>
                  <p className="text-xs font-mono text-[#3A3A3A]/60">Inside</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-[#E88D5A] text-white font-semibold hover:bg-[#C47A53] transition-colors border-2 border-[#3A3A3A] shadow-[4px_4px_0px_0px_rgba(58,58,58,1)]">
                Start Monitoring
              </button>
              <button className="px-8 py-4 bg-white/60 backdrop-blur-sm text-[#3A3A3A] font-semibold hover:bg-white/80 transition-colors border-2 border-[#3A3A3A]">
                View Demo
              </button>
            </div>

            {/* Tagline */}
            <p className="text-sm font-mono text-[#3A3A3A]/60 italic">
              "Because -40° doesn't wait for business hours"
            </p>
          </div>

          {/* Right Column - Isometric Illustration */}
          <div className="relative h-[600px] flex items-center justify-center">
            <svg
              viewBox="0 0 600 600"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient for heat */}
                <linearGradient id="heatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E88D5A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C47A53" stopOpacity="0.4" />
                </linearGradient>

                {/* Pulsing animation */}
                <style>
                  {`
                    @keyframes pulse {
                      0%, 100% { transform: scale(1); opacity: 0.8; }
                      50% { transform: scale(1.1); opacity: 1; }
                    }
                    @keyframes rotate {
                      0% { transform: rotate(-45deg); }
                      100% { transform: rotate(315deg); }
                    }
                    @keyframes dash {
                      0% { stroke-dashoffset: 1000; }
                      100% { stroke-dashoffset: 0; }
                    }
                    @keyframes fill {
                      0% { height: 0%; }
                      100% { height: 70%; }
                    }
                    .flame-pulse {
                      animation: pulse 2s ease-in-out infinite;
                      transform-origin: center;
                    }
                    .gauge-needle {
                      animation: rotate 4s ease-in-out infinite;
                      transform-origin: center;
                    }
                    .flow-line {
                      stroke-dasharray: 10 5;
                      animation: dash 2s linear infinite;
                    }
                  `}
                </style>
              </defs>

              {/* Isometric Furnace Base */}
              <g id="furnace">
                {/* Main furnace body - isometric cube */}
                <path
                  d="M 250 350 L 350 300 L 350 200 L 250 250 Z"
                  fill="#E8DCC4"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />
                <path
                  d="M 350 300 L 450 250 L 450 150 L 350 200 Z"
                  fill="#F5F1E8"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />
                <path
                  d="M 250 250 L 350 200 L 450 150 L 350 200 L 250 250 Z"
                  fill="#fff"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />

                {/* Furnace front panel */}
                <rect
                  x="270"
                  y="270"
                  width="60"
                  height="60"
                  fill="#3A3A3A"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />

                {/* Flame inside furnace */}
                <g className="flame-pulse">
                  <path
                    d="M 300 310 Q 295 300 300 290 Q 305 300 300 310 Z"
                    fill="#E88D5A"
                    opacity="0.9"
                  />
                  <path
                    d="M 300 305 Q 297 300 300 295 Q 303 300 300 305 Z"
                    fill="#fff"
                    opacity="0.7"
                  />
                </g>

                {/* Vent pipes */}
                <rect
                  x="370"
                  y="180"
                  width="60"
                  height="15"
                  fill="#C47A53"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />
                <rect
                  x="390"
                  y="100"
                  width="20"
                  height="80"
                  fill="#C47A53"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />

                {/* Heat flow indicators */}
                <path
                  className="flow-line"
                  d="M 400 170 L 400 120"
                  stroke="#E88D5A"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* Circular Temperature Gauge */}
              <g id="gauge" transform="translate(150, 100)">
                <circle
                  cx="0"
                  cy="0"
                  r="60"
                  fill="white"
                  stroke="#3A3A3A"
                  strokeWidth="3"
                />

                {/* Gauge markings */}
                <circle cx="0" cy="0" r="50" fill="none" stroke="#3A3A3A" strokeWidth="1" opacity="0.3" />

                {/* Gauge arc */}
                <path
                  d="M -42 -42 A 60 60 0 1 1 42 -42"
                  fill="none"
                  stroke="#E88D5A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Gauge needle - animated */}
                <g className="gauge-needle">
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-45"
                    stroke="#E88D5A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="0" cy="0" r="5" fill="#3A3A3A" />
                </g>

                {/* Gauge label */}
                <text
                  x="0"
                  y="30"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#3A3A3A"
                >
                  TEMP
                </text>
              </g>

              {/* Thermometer with filling animation */}
              <g id="thermometer" transform="translate(500, 150)">
                {/* Thermometer outline */}
                <rect
                  x="-15"
                  y="0"
                  width="30"
                  height="150"
                  rx="15"
                  fill="white"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />
                <circle
                  cx="0"
                  cy="165"
                  r="20"
                  fill="white"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                />

                {/* Cold section (top) */}
                <rect
                  x="-8"
                  y="10"
                  width="16"
                  height="45"
                  fill="#3B82F6"
                  opacity="0.5"
                />

                {/* Warm section (bottom) - animated */}
                <rect
                  x="-8"
                  y="55"
                  width="16"
                  height="95"
                  fill="#E88D5A"
                >
                  <animate
                    attributeName="height"
                    from="0"
                    to="95"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    from="150"
                    to="55"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </rect>

                {/* Bulb fill */}
                <circle
                  cx="0"
                  cy="165"
                  r="15"
                  fill="#E88D5A"
                />

                {/* Scale markings */}
                <text x="25" y="30" fontSize="10" fontFamily="monospace" fill="#3B82F6">-40°</text>
                <text x="25" y="90" fontSize="10" fontFamily="monospace" fill="#3A3A3A">0°</text>
                <text x="25" y="150" fontSize="10" fontFamily="monospace" fill="#E88D5A">+20°</text>
              </g>

              {/* Technical dimension lines */}
              <g id="dimensions">
                {/* Horizontal dimension */}
                <line
                  x1="240"
                  y1="380"
                  x2="460"
                  y2="380"
                  stroke="#3A3A3A"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line x1="240" y1="375" x2="240" y2="385" stroke="#3A3A3A" strokeWidth="1" />
                <line x1="460" y1="375" x2="460" y2="385" stroke="#3A3A3A" strokeWidth="1" />
                <text
                  x="350"
                  y="400"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fill="#3A3A3A"
                >
                  FURNACE UNIT
                </text>

                {/* Vertical dimension */}
                <line
                  x1="470"
                  y1="150"
                  x2="470"
                  y2="350"
                  stroke="#3A3A3A"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line x1="465" y1="150" x2="475" y2="150" stroke="#3A3A3A" strokeWidth="1" />
                <line x1="465" y1="350" x2="475" y2="350" stroke="#3A3A3A" strokeWidth="1" />
              </g>

              {/* Pulsing status indicator */}
              <g id="status" transform="translate(80, 450)">
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#E88D5A"
                  className="flame-pulse"
                />
                <text
                  x="20"
                  y="5"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#3A3A3A"
                >
                  SYSTEM ACTIVE
                </text>
              </g>

              {/* Blueprint corner marks */}
              <g id="blueprintMarks">
                <path d="M 50 50 L 50 80 M 50 50 L 80 50" stroke="#3A3A3A" strokeWidth="2" />
                <path d="M 550 50 L 550 80 M 550 50 L 520 50" stroke="#3A3A3A" strokeWidth="2" />
                <path d="M 50 550 L 50 520 M 50 550 L 80 550" stroke="#3A3A3A" strokeWidth="2" />
                <path d="M 550 550 L 550 520 M 550 550 L 520 550" stroke="#3A3A3A" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>

        {/* Bottom Feature Icons */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm border border-[#3A3A3A]/20">
            <div className="w-12 h-12 flex-shrink-0 border-2 border-[#3A3A3A] bg-[#E88D5A]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E88D5A" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#3A3A3A] mb-1">24/7 Monitoring</h3>
              <p className="text-sm text-[#3A3A3A]/70">Real-time furnace status tracking</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm border border-[#3A3A3A]/20">
            <div className="w-12 h-12 flex-shrink-0 border-2 border-[#3A3A3A] bg-[#3B82F6]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#3A3A3A] mb-1">Instant Alerts</h3>
              <p className="text-sm text-[#3A3A3A]/70">Get notified before problems start</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm border border-[#3A3A3A]/20">
            <div className="w-12 h-12 flex-shrink-0 border-2 border-[#3A3A3A] bg-[#C47A53]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C47A53" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#3A3A3A] mb-1">Maintenance Log</h3>
              <p className="text-sm text-[#3A3A3A]/70">Track service history and schedules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blueprint elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-2 border-[#3A3A3A]/20 rotate-45"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-[#3A3A3A]/20"></div>
    </div>
  );
};

export default FurnaceBlueprintHero;
