"use client"
import React from 'react';

interface MainStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  gradient: string;
}

const MainStatCard: React.FC<MainStatCardProps> = ({ icon, label, value, subValue, gradient }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" 
        style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
      />
      
      <div className="relative z-10">
        <div className={`inline-flex p-3 bg-linear-to-br ${gradient} rounded-xl text-white shadow-lg mb-4`}>
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {subValue}
        </p>
      </div>
    </div>
  );
};

export default MainStatCard;
