"use client"
import React from 'react';

interface EmptyStateProps {
  activeTab: 'upcoming' | 'in-progress' | 'past';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ activeTab }) => {
  const messages = {
    'upcoming': {
      title: 'No upcoming sessions',
      description: 'You don\'t have any sessions scheduled yet. Students will be able to book sessions based on your availability.',
    },
    'in-progress': {
      title: 'No sessions in progress',
      description: 'You don\'t have any active sessions right now. Check your upcoming sessions.',
    },
    'past': {
      title: 'No past sessions',
      description: 'You haven\'t completed any sessions yet. Your session history will appear here.',
    },
  };

  const message = messages[activeTab];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
        <svg
          className="relative w-full h-full text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {message.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {message.description}
      </p>
    </div>
  );
};
