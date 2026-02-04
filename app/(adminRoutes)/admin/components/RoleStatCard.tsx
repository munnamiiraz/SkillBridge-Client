"use client"
import React from 'react';

interface RoleStatCardProps {
  role: string;
  count: number;
  total: number;
  percentage: number;
  color: 'blue' | 'purple' | 'green';
}

const RoleStatCard: React.FC<RoleStatCardProps> = ({ role, count, total, percentage, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {role}
        </h3>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {count.toLocaleString()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {percentage}% of total users
      </p>
    </div>
  );
};

export default RoleStatCard;
