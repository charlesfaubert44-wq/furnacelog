import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Territorial Homestead Typography System
 *
 * Uses Tailwind's default sans-serif font stack
 */

// Heading Components
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'text-h1 text-wool-cream tracking-tight',
      className
    )}
    {...props}
  />
));
H1.displayName = 'H1';

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-h2 text-wool-cream tracking-tight',
      className
    )}
    {...props}
  />
));
H2.displayName = 'H2';

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-h3 text-wool-cream tracking-tight',
      className
    )}
    {...props}
  />
));
H3.displayName = 'H3';

export const H4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'text-h4 text-wool-cream',
      className
    )}
    {...props}
  />
));
H4.displayName = 'H4';

// Body Text Components
export const Body = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sans text-body text-wool-cream/90 leading-relaxed',
      className
    )}
    {...props}
  />
));
Body.displayName = 'Body';

export const Small = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sans text-small text-honey/80',
      className
    )}
    {...props}
  />
));
Small.displayName = 'Small';

export const Micro = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'font-sans text-micro text-honey/70 uppercase tracking-wider',
      className
    )}
    {...props}
  />
));
Micro.displayName = 'Micro';

// Display Text (for hero sections, large numbers, etc.)
export const Display = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'text-display text-wool-cream tracking-tight',
      className
    )}
    {...props}
  />
));
Display.displayName = 'Display';

// Data/Mono Text (for numbers, codes, technical info)
export const Mono = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'font-sans text-sm text-honey tabular-nums',
      className
    )}
    {...props}
  />
));
Mono.displayName = 'Mono';

// Special gradient text variant
export const HearthText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'text-hearth-gradient font-semibold',
      className
    )}
    {...props}
  />
));
HearthText.displayName = 'HearthText';

// Link component with warm styling
export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'text-ember-glow hover:text-hearth-fire underline-offset-4 hover:underline transition-colors duration-200',
      className
    )}
    {...props}
  />
));
Link.displayName = 'Link';

// Muted text for secondary information
export const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'font-sans text-small text-honey/50',
      className
    )}
    {...props}
  />
));
Muted.displayName = 'Muted';

// Label text (for form labels, metadata, etc.)
export const LabelText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'font-sans text-sm font-medium text-honey',
      className
    )}
    {...props}
  />
));
LabelText.displayName = 'LabelText';
