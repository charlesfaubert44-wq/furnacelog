import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-lg border-2 border-aluminum-200 bg-white px-4 py-3 text-body transition-all duration-150',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-aluminum-400',
          'hover:border-aluminum-300',
          'focus-visible:outline-none focus-visible:border-tech-blue-500 focus-visible:ring-4 focus-visible:ring-tech-blue-100',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-flame-red-500 ring-4 ring-flame-red-100',
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
