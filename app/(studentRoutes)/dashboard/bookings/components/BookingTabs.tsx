"use client"
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BookingTabsProps {
  activeTab: 'upcoming' | 'ongoing' | 'past' | 'needs-review';
  counts: {
    upcoming: number;
    ongoing: number;
    past: number;
    needsReview: number;
  };
}

export const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, counts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
      {[
        { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
        { key: 'ongoing', label: 'Ongoing', count: counts.ongoing },
        { key: 'past', label: 'Past Sessions', count: counts.past },
        { key: 'needs-review', label: 'Review Pending', count: counts.needsReview },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => handleTabChange(tab.key)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap active:scale-95 ${
            activeTab === tab.key
              ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 ring-2 ring-indigo-500/20'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
          }`}
        >
          <span>{tab.label}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};
