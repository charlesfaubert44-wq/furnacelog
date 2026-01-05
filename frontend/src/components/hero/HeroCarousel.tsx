import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
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

export function HeroCarousel({
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
      {/* Centered Content Container */}
      <div className="relative min-h-[400px] md:min-h-[450px] flex flex-col items-center justify-center">
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
          <div className="text-center max-w-[900px] mx-auto mb-4 animate-fade-slide-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-3">
              {currentSlide.headline.normal}
              <span className="block bg-gradient-to-r from-furnace-primary to-furnace-light bg-clip-text text-transparent mt-2">
                {currentSlide.headline.highlight}
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-center text-lg md:text-xl lg:text-2xl text-fl-text-secondary leading-relaxed max-w-[700px] mx-auto mb-6 animate-fade-slide-up animate-delay-100">
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

    </div>
  );
}
