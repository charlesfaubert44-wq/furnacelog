import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-micro font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-aluminum-100 text-aluminum-700',
        success:
          'border-transparent bg-system-green-100 text-system-green-700',
        warning:
          'border-transparent bg-caution-yellow-100 text-caution-yellow-700',
        error: 'border-transparent bg-flame-red-100 text-flame-red-700',
        info: 'border-transparent bg-tech-blue-100 text-tech-blue-700',
        outline: 'text-foreground border-aluminum-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
