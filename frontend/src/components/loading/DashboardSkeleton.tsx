import React from 'react';
import { SkeletonCard } from './SkeletonCard';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="skeleton h-10 w-48 rounded-lg" />
        <div className="skeleton h-4 w-96 rounded-lg" />
      </div>

      {/* Dashboard Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SkeletonCard lines={5} />
        </div>
        <SkeletonCard lines={4} />
        <div className="lg:col-span-2">
          <SkeletonCard lines={4} />
        </div>
        <SkeletonCard lines={5} />
      </div>
    </div>
  );
};
