"use client"
import React from 'react';
import { RatingStats } from '@/app/services/tutor-reviews.service';
import { RatingStars } from './RatingStars';

interface RatingOverviewProps {
  stats: RatingStats;
}

export const RatingOverview: React.FC<RatingOverviewProps> = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* Overall Rating Card */}
      <div className="relative p-8 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-3xl"
          aria-hidden="true"
        ></div>
        
        <div className="relative z-10">
          <div className="flex items-end gap-4 mb-6">
            <div className="text-6xl md:text-7xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {stats.average.toFixed(1)}
            </div>
            <div className="pb-2">
              <RatingStars rating={Math.floor(stats.average)} size="lg" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on {stats.total} reviews
              </p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as keyof typeof stats.distribution];
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {star}
                    </span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - Using static data for now as per original design or placeholders */}
      <div className="grid grid-cols-2 gap-4">
        <StatsTile 
          label="Response Rate" 
          value="98%" 
          gradientFrom="from-indigo-50 dark:from-indigo-900/20" 
          gradientTo="to-purple-50 dark:to-purple-900/20"
          iconBg="bg-linear-to-br from-indigo-500 to-purple-500"
          iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatsTile 
          label="Avg Response" 
          value="2.3h" 
          gradientFrom="from-purple-50 dark:from-purple-900/20" 
          gradientTo="to-pink-50 dark:to-pink-900/20"
          iconBg="bg-linear-to-br from-purple-500 to-pink-500"
          iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatsTile 
          label="Return Rate" 
          value="87%" 
          gradientFrom="from-indigo-50 dark:from-indigo-900/20" 
          gradientTo="to-blue-50 dark:to-blue-900/20"
          iconBg="bg-linear-to-br from-indigo-500 to-blue-500"
          iconPath="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
        <StatsTile 
          label="This Month" 
          value="+23" 
          gradientFrom="from-purple-50 dark:from-purple-900/20" 
          gradientTo="to-indigo-50 dark:to-indigo-900/20"
          iconBg="bg-linear-to-br from-purple-500 to-indigo-500"
          iconPath="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </div>
    </div>
  );
};

// Helper component for the small tiles
const StatsTile: React.FC<{
  label: string;
  value: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  iconPath: string;
}> = ({ label, value, gradientFrom, gradientTo, iconBg, iconPath }) => (
  <div className={`p-6 bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-2xl border border-indigo-100 dark:border-indigo-800`}>
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 ${iconBg} rounded-lg`}>
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</h3>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);
