import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Filter, DollarSign, Thermometer, Brain, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  id: string;
  headline: {
    normal: string;
    highlight: string;
  };
  subtitle: string;
  ctaPrimary: {
    text: string;
    onClick: () => void;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  className?: string;
}

// Slide-specific visual components
const FilterSlideVisual = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
    <div className="absolute top-20 right-20 animate-float">
      <Filter className="w-32 h-32 text-furnace-primary" strokeWidth={1} />
    </div>
    <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '1s' }}>
      <Filter className="w-24 h-24 text-furnace-light" strokeWidth={1} />
    </div>
    {/* Question marks floating */}
    <div className="absolute top-40 left-1/4 text-6xl text-furnace-primary/30 animate-pulse">?</div>
    <div className="absolute bottom-40 right-1/3 text-4xl text-furnace-light/20 animate-pulse" style={{ animationDelay: '0.5s' }}>?</div>
  </div>
);

const CostComparisonVisual = () => (
  <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
    {/* Broken pipe visual */}
    <div className="absolute top-10 left-10">
      <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
        <line x1="20" y1="60" x2="100" y2="60" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"/>
        <line x1="60" y1="20" x2="60" y2="100" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5"/>
        <circle cx="60" cy="60" r="15" fill="#ef4444" opacity="0.3"/>
      </svg>
    </div>
    {/* Dollar signs */}
    <div className="absolute top-20 right-20 animate-float">
      <DollarSign className="w-24 h-24 text-red-500" strokeWidth={1.5} />
    </div>
    <div className="absolute bottom-20 right-40 animate-float" style={{ animationDelay: '0.7s' }}>
      <DollarSign className="w-16 h-16 text-furnace-primary" strokeWidth={1.5} />
    </div>
    {/* Shield (protection) */}
    <div className="absolute bottom-10 left-20">
      <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
        <path d="M50 10 L90 30 L90 50 Q90 80 50 90 Q10 80 10 50 L10 30 Z" fill="none" stroke="#C94A06" strokeWidth="3"/>
        <path d="M35 50 L45 60 L65 35" stroke="#C94A06" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  </div>
);

const FurnaceFailureVisual = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
    {/* Temperature gauge */}
    <div className="absolute top-10 right-10 animate-pulse">
      <Thermometer className="w-32 h-32 text-blue-400" strokeWidth={1} />
    </div>
    {/* Alert symbols */}
    <div className="absolute top-1/2 left-10">
      <svg width="80" height="80" viewBox="0 0 80 80" className="animate-pulse">
        <path d="M40 10 L70 65 L10 65 Z" fill="none" stroke="#ef4444" strokeWidth="3"/>
        <line x1="40" y1="35" x2="40" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="40" cy="58" r="3" fill="#ef4444"/>
      </svg>
    </div>
    {/* Snowflakes */}
    <div className="absolute bottom-20 right-20 animate-float">
      <svg width="60" height="60" viewBox="0 0 60 60">
        <path d="M30 5 L30 55 M5 30 L55 30 M15 15 L45 45 M45 15 L15 45" stroke="#60a5fa" strokeWidth="2"/>
        <circle cx="30" cy="30" r="8" fill="none" stroke="#60a5fa" strokeWidth="2"/>
      </svg>
    </div>
    <div className="absolute top-40 right-40 animate-float" style={{ animationDelay: '1.5s' }}>
      <svg width="40" height="40" viewBox="0 0 60 60">
        <path d="M30 5 L30 55 M5 30 L55 30 M15 15 L45 45 M45 15 L15 45" stroke="#93c5fd" strokeWidth="2"/>
      </svg>
    </div>
  </div>
);

const CognitiveReliefVisual = () => (
  <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
    {/* Brain icon */}
    <div className="absolute top-10 left-10 animate-pulse">
      <Brain className="w-28 h-28 text-furnace-primary" strokeWidth={1} />
    </div>
    {/* Checklist items with checkmarks */}
    <div className="absolute right-20 top-20 space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-slide-in" style={{ animationDelay: `${i * 0.2}s` }}>
          <div className="w-6 h-6 rounded border-2 border-furnace-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" className="animate-check-scale" style={{ animationDelay: `${i * 0.2 + 0.3}s` }}>
              <path d="M3 8 L6 11 L13 4" stroke="#C94A06" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="w-24 h-2 bg-furnace-primary/30 rounded"></div>
        </div>
      ))}
    </div>
    {/* Crossed out stress lines */}
    <div className="absolute bottom-20 left-20">
      <svg width="120" height="80" viewBox="0 0 120 80">
        <line x1="10" y1="20" x2="110" y2="20" stroke="#6b7280" strokeWidth="2" opacity="0.5"/>
        <line x1="10" y1="40" x2="110" y2="40" stroke="#6b7280" strokeWidth="2" opacity="0.5"/>
        <line x1="10" y1="60" x2="110" y2="60" stroke="#6b7280" strokeWidth="2" opacity="0.5"/>
        <line x1="0" y1="0" x2="120" y2="80" stroke="#C94A06" strokeWidth="3" strokeLinecap="round" className="animate-draw-line"/>
      </svg>
    </div>
  </div>
);

const NorthernBuiltVisual = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
    {/* Map pins */}
    <div className="absolute top-20 left-1/4 animate-bounce" style={{ animationDuration: '3s' }}>
      <MapPin className="w-16 h-16 text-furnace-primary" fill="#C94A06" />
    </div>
    <div className="absolute top-40 right-1/3 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
      <MapPin className="w-20 h-20 text-furnace-light" fill="#E55807" />
    </div>
    {/* Northern lights waves */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg width="100%" height="200" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 100 Q300 50 600 100 T1200 100 L1200 200 L0 200 Z" fill="url(#aurora1)" className="animate-aurora"/>
        <path d="M0 120 Q300 80 600 120 T1200 120 L1200 200 L0 200 Z" fill="url(#aurora2)" className="animate-aurora" style={{ animationDelay: '1s' }}/>
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="aurora2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    {/* Mountains */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg width="100%" height="150" viewBox="0 0 1200 150" preserveAspectRatio="none">
        <path d="M0 150 L200 50 L400 150 Z" fill="#1a1a1a" opacity="0.8"/>
        <path d="M300 150 L600 30 L900 150 Z" fill="#2a2a2a" opacity="0.8"/>
        <path d="M800 150 L1000 70 L1200 150 Z" fill="#1a1a1a" opacity="0.8"/>
      </svg>
    </div>
  </div>
);

const getSlideVisual = (slideId: string) => {
  switch (slideId) {
    case 'filter-question':
      return <FilterSlideVisual />;
    case 'cost-comparison':
      return <CostComparisonVisual />;
    case 'furnace-failure':
      return <FurnaceFailureVisual />;
    case 'cognitive-relief':
      return <CognitiveReliefVisual />;
    case 'northern-built':
      return <NorthernBuiltVisual />;
    default:
      return null;
  }
};

export function HeroCarouselImmersive({
  slides,
  autoAdvance = true,
  autoAdvanceInterval = 8000,
  className,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const currentSlide = slides[currentIndex];

  useEffect(() => {
    if (!autoAdvance || isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [autoAdvance, isPaused, currentIndex, autoAdvanceInterval, slides.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setDirection('right');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setDirection('left');
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide-specific visual background */}
      <div className="absolute inset-0 transition-opacity duration-600">
        {getSlideVisual(currentSlide.id)}
      </div>

      {/* Centered Content Container */}
      <div className="relative min-h-[400px] md:min-h-[450px] flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Content Wrapper with Slide Transition */}
        <div
          className={cn(
            'w-full transition-all duration-600 ease-in-out',
            isTransitioning
              ? direction === 'right'
                ? '-translate-x-full opacity-0'
                : 'translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'
          )}
        >
          {/* Headline */}
          <div className="text-center max-w-[900px] mx-auto mb-4 px-2 animate-fade-slide-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.25] tracking-tight mb-3 pb-2">
              {currentSlide.headline.normal}
              <span className="block bg-gradient-to-r from-furnace-primary to-furnace-light bg-clip-text text-transparent mt-2 pb-1">
                {currentSlide.headline.highlight}
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-center text-base md:text-lg lg:text-xl text-fl-text-secondary leading-relaxed max-w-[650px] mx-auto mb-6 px-2 animate-fade-slide-up animate-delay-100">
            {currentSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4 animate-fade-slide-up animate-delay-200">
            <button
              onClick={currentSlide.ctaPrimary.onClick}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-furnace-primary hover:bg-furnace-light text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40"
            >
              {currentSlide.ctaPrimary.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {currentSlide.ctaSecondary && (
              <a
                href={currentSlide.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-fl-card-bg hover:bg-fl-card-border border border-fl-card-border hover:border-furnace-primary/30 text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {currentSlide.ctaSecondary.text}
              </a>
            )}
          </div>

          {/* Dot Indicators */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-slide-up animate-delay-300">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleDotClick(idx)}
                  disabled={isTransitioning}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'w-8 bg-gradient-to-r from-furnace-primary to-furnace-light'
                      : 'w-2 bg-white/30 hover:bg-white/50',
                    'disabled:cursor-not-allowed'
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - Outside content, absolute positioned */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className={cn(
              'hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2',
              'w-12 h-12 rounded-full items-center justify-center',
              'bg-fl-card-bg/80 backdrop-blur-sm border border-fl-card-border',
              'text-white hover:border-furnace-primary/50 hover:bg-fl-card-border',
              'transition-all duration-300 hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'z-10'
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className={cn(
              'hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2',
              'w-12 h-12 rounded-full items-center justify-center',
              'bg-fl-card-bg/80 backdrop-blur-sm border border-fl-card-border',
              'text-white hover:border-furnace-primary/50 hover:bg-fl-card-border',
              'transition-all duration-300 hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'z-10'
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Additional animations CSS */}
      <style>{`
        @keyframes aurora {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-50px) scaleY(1.1); }
        }
        @keyframes draw-line {
          0% { stroke-dasharray: 0, 200; }
          100% { stroke-dasharray: 200, 0; }
        }
        .animate-aurora {
          animation: aurora 8s ease-in-out infinite;
        }
        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
