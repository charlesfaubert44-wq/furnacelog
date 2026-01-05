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
      {/* Centered Content Container */}
      <div className="relative min-h-[400px] md:min-h-[450px] flex flex-col items-center justify-center px-6 sm:px-8 md:px-10">
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
          <div className="text-center max-w-[1000px] mx-auto mb-6 px-6 sm:px-8 animate-fade-slide-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-charcoal leading-[1.2] tracking-tight">
              {currentSlide.headline.normal}
              <span className="block bg-gradient-to-r from-warm-orange to-soft-amber bg-clip-text text-transparent mt-1">
                {currentSlide.headline.highlight}
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-warm-gray leading-relaxed max-w-[800px] mx-auto mb-8 px-6 sm:px-8 animate-fade-slide-up animate-delay-100">
            {currentSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 animate-fade-slide-up animate-delay-200">
            <button
              onClick={currentSlide.ctaPrimary.onClick}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-fireplace hover:shadow-warm-glow text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-warm-sm"
            >
              {currentSlide.ctaPrimary.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {currentSlide.ctaSecondary && (
              <a
                href={currentSlide.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/60 hover:bg-white border border-soft-beige hover:border-soft-amber/50 text-charcoal text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-warm-sm"
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
                      ? 'w-8 bg-gradient-to-r from-warm-orange to-soft-amber shadow-warm-sm'
                      : 'w-2 bg-soft-beige/40 hover:bg-soft-beige/70',
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
              'bg-white/70 backdrop-blur-sm border border-soft-beige/60',
              'text-charcoal hover:border-soft-amber/50 hover:bg-white shadow-warm-sm',
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
              'bg-white/70 backdrop-blur-sm border border-soft-beige/60',
              'text-charcoal hover:border-soft-amber/50 hover:bg-white shadow-warm-sm',
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
