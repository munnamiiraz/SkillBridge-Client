"use client"
import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, count, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold rounded-full ${
        active
          ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}>
        {count}
      </span>
    </button>
  );
};
