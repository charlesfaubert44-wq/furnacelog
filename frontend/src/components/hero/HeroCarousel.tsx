import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDisplay, type AlertItem } from './AlertDisplay';

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
  alerts: AlertItem[];
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
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Centered Content Container */}
      <div className="relative min-h-[600px] flex flex-col items-center justify-center">
        {/* Content Wrapper with Fade Transition */}
        <div
          className={cn(
            'w-full transition-all duration-700 ease-out',
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
        >
          {/* Headline */}
          <div className="text-center max-w-[900px] mx-auto mb-6 animate-fade-slide-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#f4e8d8] leading-[1.1] tracking-tight mb-4">
              {currentSlide.headline.normal}
              <span className="block bg-gradient-to-r from-[#ff4500] to-[#ff6a00] bg-clip-text text-transparent mt-3">
                {currentSlide.headline.highlight}
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-center text-lg md:text-xl lg:text-2xl text-[#d4a373] leading-relaxed max-w-[700px] mx-auto mb-10 animate-fade-slide-up animate-delay-100">
            {currentSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-slide-up animate-delay-200">
            <button
              onClick={currentSlide.ctaPrimary.onClick}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#ff4500]/30"
            >
              {currentSlide.ctaPrimary.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {currentSlide.ctaSecondary && (
              <a
                href={currentSlide.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#2a2a2a] hover:to-[#2a2a2a] border border-[#f4e8d8]/20 text-[#f4e8d8] text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {currentSlide.ctaSecondary.text}
              </a>
            )}
          </div>

          {/* Dot Indicators */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-3 mb-12 animate-fade-slide-up animate-delay-300">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleDotClick(idx)}
                  disabled={isTransitioning}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'w-8 bg-gradient-to-r from-[#ff4500] to-[#ff6a00]'
                      : 'w-2 bg-[#f4e8d8]/30 hover:bg-[#f4e8d8]/50',
                    'disabled:cursor-not-allowed'
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}

          {/* Featured Alert Card */}
          <div className="max-w-[600px] mx-auto animate-fade-slide-up animate-delay-400">
            <AlertDisplay
              alerts={currentSlide.alerts}
              autoAdvance={false}
            />
          </div>
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
              'bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#f4e8d8]/20',
              'text-[#f4e8d8] hover:border-[#ff4500]/50 hover:bg-[#2a2a2a]/90',
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
              'bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#f4e8d8]/20',
              'text-[#f4e8d8] hover:border-[#ff4500]/50 hover:bg-[#2a2a2a]/90',
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
