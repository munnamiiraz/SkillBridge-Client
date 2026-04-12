'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-2.5 transition-all duration-300 ${className}`}>
      {/* Human-Centric Bridge Icon */}
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg transform rotate-6 scale-90 opacity-20 transition-transform duration-500"></div>
        <div className="relative w-full h-full bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-5 h-5 text-white" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 19C4 19 5 13 12 13C19 13 20 19 20 19" />
            <path d="M12 13V8" />
            <circle cx="12" cy="5" r="1.5" />
          </svg>
        </div>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Skill<span className="text-indigo-600">Bridge</span>
          </span>
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-none">
            Learn Together
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
