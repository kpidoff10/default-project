"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <Card className="border-l-4 border-l-primary/20 h-full overflow-hidden w-full">
      <CardContent className="px-4 pb-2 h-full overflow-hidden">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-1 h-2 w-2 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
