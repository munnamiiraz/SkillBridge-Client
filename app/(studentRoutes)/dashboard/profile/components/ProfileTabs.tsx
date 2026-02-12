"use client"
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ProfileTabsProps {
  activeTab: 'overview' | 'bookings' | 'reviews';
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-1 p-2">
        {(['overview', 'bookings', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-bold transition-all duration-300 capitalize active:scale-95 ${
              activeTab === tab
                ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/10'
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
