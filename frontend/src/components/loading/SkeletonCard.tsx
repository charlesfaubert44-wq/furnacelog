import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  lines?: number;
  showImage?: boolean;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showImage = false,
  className,
}) => {
  return (
    <Card className={cn('p-6', className)}>
      <div className="space-y-3">
        {showImage && <Skeleton className="h-32 w-full rounded-lg" />}
        <Skeleton className="h-6 w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4', i === lines - 1 && 'w-2/3')}
          />
        ))}
      </div>
    </Card>
  );
};
