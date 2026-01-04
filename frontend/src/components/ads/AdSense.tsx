import React from 'react';
import { cn } from '@/lib/utils';

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  responsive?: boolean;
}

/**
 * Google AdSense Placeholder Component
 * Will be replaced with actual AdSense code when ready
 */
export const AdSense: React.FC<AdSenseProps> = ({
  slot = 'placeholder',
  format = 'auto',
  className = '',
  responsive = true
}) => {
  // For now, show a placeholder that matches the Territorial Homestead theme
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border transition-all duration-300',
        'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#d4a373]/10',
        className
      )}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    >
      <div className="p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
          <div className="text-xs font-medium text-[#d4a373] uppercase tracking-wider">
            Advertisement
          </div>
          <div className="w-full max-w-xs h-24 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
            <span className="text-xs text-[#d4a373]/60">Ad Space</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSense;
