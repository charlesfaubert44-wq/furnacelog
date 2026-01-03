import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tech-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-tech-blue-600 text-white shadow-md hover:bg-tech-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:bg-tech-blue-800',
        destructive:
          'bg-flame-red-50 border-2 border-flame-red-200 text-flame-red-600 hover:bg-flame-red-100 hover:border-flame-red-300',
        outline:
          'border-2 border-aluminum-300 text-iron-600 bg-transparent hover:bg-aluminum-100 hover:border-aluminum-400 hover:text-graphite-900',
        secondary:
          'bg-steel-700 text-white hover:bg-steel-800 shadow-sm',
        ghost: 'hover:bg-aluminum-100 hover:text-graphite-900',
        link: 'text-tech-blue-600 underline-offset-4 hover:underline',
        success:
          'bg-system-green-600 text-white shadow-md hover:bg-system-green-700 hover:-translate-y-0.5',
        warning:
          'bg-caution-yellow-500 text-graphite-900 shadow-md hover:bg-caution-yellow-600',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
