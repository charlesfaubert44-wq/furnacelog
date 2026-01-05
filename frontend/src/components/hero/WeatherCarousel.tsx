import { useState, useEffect } from 'react';
import { Thermometer, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type CityWeather } from '@/services/weather.service';
import { getTemperatureQuote } from '@/utils/weatherQuotes';

interface WeatherCarouselProps {
  weather: CityWeather[];
  className?: string;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
}

export function WeatherCarousel({
  weather,
  className,
  autoAdvance = false,
  autoAdvanceInterval = 8000,
}: WeatherCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentWeather = weather[currentIndex];

  useEffect(() => {
    if (!autoAdvance || isPaused || weather.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [autoAdvance, isPaused, currentIndex, autoAdvanceInterval, weather.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % weather.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + weather.length) % weather.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < -35) return 'text-[#c4d7e0]';
    if (temp >= -35 && temp < -20) return 'text-[#5b8fa3]';
    return 'text-[#7ea88f]';
  };

  const getTemperatureGradient = (temp: number) => {
    if (temp < -35) return 'from-[#c4d7e0]/20 to-[#5b8fa3]/10';
    if (temp >= -35 && temp < -20) return 'from-[#5b8fa3]/20 to-[#7ea88f]/10';
    return 'from-[#7ea88f]/20 to-[#6a994e]/10';
  };

  if (!weather.length) {
    return (
      <div className={cn('animate-pulse space-y-3', className)}>
        <div className="h-6 bg-[#2a2a2a]/50 rounded w-32"></div>
        <div className="h-16 bg-[#2a2a2a]/50 rounded w-24"></div>
        <div className="h-4 bg-[#2a2a2a]/50 rounded w-48"></div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Weather Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-all duration-500',
          'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]',
          getTemperatureGradient(currentWeather.temp),
          'border-[#5b8fa3]/30 hover:border-[#5b8fa3]/50',
          isTransitioning && 'scale-[0.98]'
        )}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              'absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 transition-opacity duration-700',
              currentWeather.temp < -35 && 'bg-[#c4d7e0]',
              currentWeather.temp >= -35 && currentWeather.temp < -20 && 'bg-[#5b8fa3]',
              currentWeather.temp >= -20 && 'bg-[#7ea88f]'
            )}
          />
        </div>

        <div className="relative p-6 space-y-4">
          {/* Location Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#5b8fa3]">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{currentWeather.city}</span>
            </div>
            {weather.length > 1 && (
              <div className="flex items-center gap-1">
                {weather.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(idx);
                        setTimeout(() => setIsTransitioning(false), 300);
                      }
                    }}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all duration-300',
                      idx === currentIndex
                        ? 'bg-[#5b8fa3] w-4'
                        : 'bg-[#5b8fa3]/30 hover:bg-[#5b8fa3]/50'
                    )}
                    aria-label={`View ${weather[idx].city}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Temperature Display */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="flex items-baseline gap-1">
                <Thermometer className={cn('w-8 h-8', getTemperatureColor(currentWeather.temp))} />
                <span
                  className={cn(
                    'text-6xl font-bold transition-all duration-500',
                    getTemperatureColor(currentWeather.temp)
                  )}
                >
                  {currentWeather.temp}°
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-sm text-[#d4a373]/70">
                  feels like
                </span>
                <span className={cn('block text-xl font-semibold', getTemperatureColor(currentWeather.feelsLike))}>
                  {currentWeather.feelsLike}°
                </span>
              </div>
            </div>

            {/* Weather Description */}
            {currentWeather.description && (
              <div className="flex items-center gap-2 text-sm text-[#d4a373]">
                <span className="capitalize">{currentWeather.description}</span>
              </div>
            )}
          </div>

          {/* Temperature Quote */}
          <div className="pt-3 border-t border-[#f4e8d8]/10">
            <p className="text-sm text-[#d4a373]/80 italic leading-relaxed">
              {getTemperatureQuote(currentWeather.temp)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {weather.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4',
              'w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#5b8fa3]/30',
              'flex items-center justify-center',
              'text-[#5b8fa3] hover:text-[#f4e8d8] hover:border-[#5b8fa3]/50',
              'transition-all duration-300 hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'opacity-0 group-hover:opacity-100'
            )}
            aria-label="Previous location"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4',
              'w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#5b8fa3]/30',
              'flex items-center justify-center',
              'text-[#5b8fa3] hover:text-[#f4e8d8] hover:border-[#5b8fa3]/50',
              'transition-all duration-300 hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'opacity-0 group-hover:opacity-100'
            )}
            aria-label="Next location"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Location Counter */}
      {weather.length > 1 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-[#d4a373]/50">
            {currentIndex + 1} of {weather.length} locations
          </span>
        </div>
      )}
    </div>
  );
}
