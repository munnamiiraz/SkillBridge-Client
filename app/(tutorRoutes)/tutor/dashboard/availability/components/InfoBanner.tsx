"use client"
import React from 'react';

export const InfoBanner: React.FC = () => {
  return (
    <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            How it works
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Set your available time ranges for each day (e.g., 9:00 AM - 5:00 PM). These will automatically be split into 1-hour bookable slots for students. Navigate between weeks using the arrows above to manage your schedule for different weeks.
          </p>
        </div>
      </div>
    </div>
  );
};
