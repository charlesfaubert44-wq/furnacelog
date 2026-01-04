import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Territorial Homestead - Primary warm gradient button
        default:
          'bg-gradient-hearth text-wool-cream shadow-glow-sm hover:shadow-glow-md hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-ember-glow',
        // Territorial Homestead - Secondary outline with warm glow on hover
        secondary:
          'border-2 border-honey/40 bg-transparent text-wool-cream hover:bg-warm-stone/30 hover:border-honey hover:shadow-glow-sm hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-honey',
        // Territorial Homestead - Tertiary text-only warm color
        tertiary:
          'text-ember-glow hover:text-hearth-fire hover:bg-warm-stone/20 hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-ember-glow',
        // Legacy variants (preserved for compatibility)
        outline:
          'border-2 border-aluminum-300 text-iron-600 bg-transparent hover:bg-aluminum-100 hover:border-aluminum-400 hover:text-graphite-900 hover:scale-[1.02] active:scale-[0.98] rounded-lg focus-visible:ring-tech-blue-500',
        destructive:
          'bg-brick-red/20 border-2 border-brick-red/40 text-brick-red hover:bg-brick-red/30 hover:border-brick-red hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-brick-red',
        ghost: 'hover:bg-warm-stone/30 hover:text-wool-cream hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-ember-glow',
        link: 'text-ember-glow underline-offset-4 hover:underline hover:text-hearth-fire focus-visible:ring-ember-glow',
        success:
          'bg-forest-green text-wool-cream shadow-md hover:bg-forest-green/90 hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-forest-green',
        warning:
          'bg-sunset-amber text-deep-charcoal shadow-md hover:bg-sunset-amber/90 hover:scale-[1.02] active:scale-[0.98] rounded-xl focus-visible:ring-sunset-amber',
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
