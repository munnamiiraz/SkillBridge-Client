"use client"
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
      
      <div className="relative z-10">
        <div className="inline-flex p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/40 mb-4">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};
