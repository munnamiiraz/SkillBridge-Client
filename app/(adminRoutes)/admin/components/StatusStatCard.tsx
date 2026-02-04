"use client"
import React from 'react';

interface StatusStatCardProps {
  status: string;
  count: number;
  total: number;
  percentage: number;
  color: 'green' | 'blue' | 'yellow' | 'red';
  icon: React.ReactNode;
}

const StatusStatCard: React.FC<StatusStatCardProps> = ({ status, count, total, percentage, color, icon }) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      bar: 'bg-green-500'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      bar: 'bg-blue-500'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      bar: 'bg-yellow-500'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      bar: 'bg-red-500'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-xl p-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${classes.bg} rounded-lg ${classes.text}`}>
          {icon}
        </div>
        <span className={`text-2xl font-bold ${classes.text}`}>
          {count.toLocaleString()}
        </span>
      </div>
      
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {status}
      </h3>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${classes.bar} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {percentage}% of total
      </p>
    </div>
  );
};

export default StatusStatCard;
