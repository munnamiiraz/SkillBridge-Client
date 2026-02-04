"use client"
import React from 'react';

interface BookingTabsProps {
  activeTab: 'upcoming' | 'ongoing' | 'past';
  setActiveTab: (tab: 'upcoming' | 'ongoing' | 'past') => void;
  counts: {
    upcoming: number;
    ongoing: number;
    past: number;
  };
}

export const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto">
      {[
        { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
        { key: 'ongoing', label: 'Ongoing', count: counts.ongoing },
        { key: 'past', label: 'Past Sessions', count: counts.past },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key as typeof activeTab)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
            activeTab === tab.key
              ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span>{tab.label}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};
