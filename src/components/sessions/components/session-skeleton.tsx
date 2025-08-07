"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface SessionSkeletonProps {
  count?: number;
}

export function SessionSkeleton({ count = 5 }: SessionSkeletonProps) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-3 border rounded-lg w-full">
          <div className="flex items-center space-x-3 w-full">
            <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton className="h-4 w-1/3" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
