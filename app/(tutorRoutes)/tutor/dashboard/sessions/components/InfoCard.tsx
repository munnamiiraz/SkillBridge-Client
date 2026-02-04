"use client"
import React from 'react';

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
  }
  
export const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="text-gray-900 dark:text-white font-semibold">
          {value}
        </p>
      </div>
    );
  };
