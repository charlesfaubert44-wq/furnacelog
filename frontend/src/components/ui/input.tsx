import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Territorial Homestead - Warm dark background with warm accents
          'flex h-12 w-full rounded-xl bg-warm-stone/40 backdrop-blur-sm px-4 py-3 text-body text-wool-cream transition-all duration-300',
          'border-b-2 border-honey/30',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-wool-cream',
          'placeholder:text-honey/50',
          'hover:border-honey/50 hover:bg-warm-stone/50',
          // Ember glow on focus
          'focus-visible:outline-none focus-visible:border-ember-glow focus-visible:ring-2 focus-visible:ring-ember-glow/50 focus-visible:shadow-glow-sm',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Error state - brick red
          error && 'border-brick-red ring-2 ring-brick-red/50 animate-shake',
          // Success state - forest green
          success && 'border-forest-green ring-2 ring-forest-green/50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
