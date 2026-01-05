import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    elevation?: 'surface' | 'elevated' | 'floating';
    interactive?: boolean;
    selected?: boolean;
    critical?: boolean;
  }
>(
  (
    {
      className,
      elevation = 'elevated',
      interactive = false,
      selected = false,
      critical = false,
      ...props
    },
    ref
  ) => {
    // Territorial Homestead - Warm gradient backgrounds with organic feel
    const elevationClasses = {
      surface: 'bg-gradient-to-br from-rich-umber to-deep-charcoal border border-wool-cream/8 shadow-sm rounded-[20px]',
      elevated: 'bg-gradient-to-br from-rich-umber to-deep-charcoal border border-wool-cream/8 shadow-md shadow-black/20 rounded-[20px]',
      floating: 'bg-gradient-to-br from-rich-umber to-deep-charcoal shadow-lg shadow-black/30 rounded-[20px]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          elevationClasses[elevation],
          // Add subtle inset highlight for depth
          'relative before:absolute before:inset-0 before:rounded-[20px] before:p-[1px] before:bg-gradient-to-b before:from-wool-cream/10 before:to-transparent before:pointer-events-none',
          interactive && 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-sm',
          selected && 'ring-2 ring-ember-glow shadow-glow-md',
          critical && 'ring-2 ring-brick-red animate-pulse-critical',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-h3 leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-small text-honey/70', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
