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
  autoAdvanceInterval = 10000,
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
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Content */}
      <div className="relative overflow-hidden">
        <div
          className={cn(
            'transition-all duration-600 ease-out',
            isTransitioning && direction === 'right' && '-translate-x-8 opacity-0',
            isTransitioning && direction === 'left' && 'translate-x-8 opacity-0',
            !isTransitioning && 'translate-x-0 opacity-100'
          )}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Headline & CTAs */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#f4e8d8] leading-[1.05] tracking-tight">
                  {currentSlide.headline.normal}
                  <span className="block bg-gradient-to-r from-[#ff4500] to-[#ff6a00] bg-clip-text text-transparent mt-2">
                    {currentSlide.headline.highlight}
                  </span>
                </h2>
                <p className="text-xl text-[#d4a373] leading-relaxed max-w-xl">
                  {currentSlide.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={currentSlide.ctaPrimary.onClick}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#ff4500]/20"
                >
                  {currentSlide.ctaPrimary.text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {currentSlide.ctaSecondary && (
                  <a
                    href={currentSlide.ctaSecondary.href}
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] hover:from-[#2a2a2a] hover:to-[#2a2a2a] border border-[#f4e8d8]/20 text-[#f4e8d8] font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {currentSlide.ctaSecondary.text}
                  </a>
                )}
              </div>
            </div>

            {/* Right Column - Alert Display */}
            <div className="relative lg:pt-12">
              <AlertDisplay
                alerts={currentSlide.alerts}
                autoAdvance={false}
                autoAdvanceInterval={6000}
              />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#ff4500]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-[#6a994e]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8',
              'w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#f4e8d8]/30',
              'flex items-center justify-center z-10',
              'text-[#f4e8d8] hover:border-[#ff4500]/50 hover:bg-[#2a2a2a]',
              'transition-all duration-300 hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'opacity-0 lg:opacity-100 hover:opacity-100'
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8',
              'w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#f4e8d8]/30',
              'flex items-center justify-center z-10',
              'text-[#f4e8d8] hover:border-[#ff4500]/50 hover:bg-[#2a2a2a]',
              'transition-all duration-300 hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'opacity-0 lg:opacity-100 hover:opacity-100'
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
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
              />
            ))}
          </div>

          {/* Progress Bar (for auto-advance) */}
          {autoAdvance && !isPaused && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2a2a2a]/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff4500] to-[#ff6a00]"
                style={{
                  animation: `progressBar ${autoAdvanceInterval}ms linear`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              />
            </div>
          )}
        </>
      )}

      {/* CSS Animation for Progress Bar */}
      <style>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
