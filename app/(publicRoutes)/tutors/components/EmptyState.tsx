"use client";

import React from 'react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        No tutors found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
        We couldn't find any tutors matching your current filters. Try adjusting your search criteria.
      </p>
      
      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Clear all filters</span>
      </button>
    </div>
  );
};

export default EmptyState;
