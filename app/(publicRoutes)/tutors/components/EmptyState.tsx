"use client";

import React from 'react';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 animate-in fade-in zoom-in duration-700">
      <div className="relative w-56 h-56 mb-10 flex items-center justify-center">
        {/* Animated Glow Rings */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-10 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-700" />
        
        <div className="relative p-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-3xl rounded-[3rem] border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
          <SearchX size={80} className="text-gray-300 dark:text-gray-700" />
          <div className="absolute -top-2 -right-2 p-2 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3 mb-10">
        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
          No matches found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed font-medium">
          We couldn&apos;t find any tutors matching your specific criteria. Try widening your search for more results.
        </p>
      </div>
      
      <button
        type="button"
        onClick={onClearFilters}
        className="group relative h-14 px-8 flex items-center gap-3 bg-linear-to-br from-indigo-600 to-purple-600 font-black text-sm text-white rounded-[1.25rem] shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all duration-300 overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <RotateCcw size={18} className="group-hover:-rotate-45 transition-transform duration-500" />
          Reset All Filters
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </div>
  );
};

export default EmptyState;
