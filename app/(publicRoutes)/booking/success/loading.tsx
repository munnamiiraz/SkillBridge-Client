import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center space-y-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-3 flex flex-col items-center">
            <Skeleton className="h-10 w-64 lg:w-96" />
            <Skeleton className="h-6 w-48 lg:w-64" />
          </div>
        </div>

        {/* Card Skeleton */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 flex justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
          
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
