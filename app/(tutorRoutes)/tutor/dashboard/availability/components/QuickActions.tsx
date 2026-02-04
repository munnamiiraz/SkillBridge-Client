"use client"
import React from 'react';

interface QuickActionsProps {
  onSet9to5: () => void;
  onSetWeekdays: () => void;
  onClearAll: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSet9to5,
  onSetWeekdays,
  onClearAll
}) => {
  return (
    <div className="mt-8 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSet9to5}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
        >
          Set All Days 9 AM - 5 PM
        </button>
        <button
          type="button"
          onClick={onSetWeekdays}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
        >
          Weekdays Only
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
