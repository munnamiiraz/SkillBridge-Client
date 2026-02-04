"use client"
import React from 'react';

interface ProfileTabsProps {
  activeTab: 'overview' | 'bookings' | 'reviews';
  setActiveTab: (tab: 'overview' | 'bookings' | 'reviews') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-1 p-2">
        {(['overview', 'bookings', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-semibold transition-all duration-300 capitalize ${
              activeTab === tab
                ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
