"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserTabsProps {
  total: number;
}

const UserTabs: React.FC<UserTabsProps> = ({ total }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('role') || 'all';

  const handleTabChange = (role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (role === 'all') params.delete('role');
    else params.set('role', role);
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto">
      {[
        { key: 'all', label: 'All Users' },
        { key: 'student', label: 'Students' },
        { key: 'tutor', label: 'Tutors' },
      ].map((tab, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleTabChange(tab.key)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
            activeTab === tab.key
              ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default UserTabs;
