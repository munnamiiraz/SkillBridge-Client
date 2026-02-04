"use client";

import React from 'react';
import FilterPanel from './FilterPanel';

interface FilterState {
  searchQuery: string;
  selectedSubjects: string[];
  priceRange: [number, number];
  minRating: number | null;
  minTotalReviews: number | null;
  category: string | null;
}

interface MobileFilterDrawerProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  subjects: string[];
  toggleSubject: (subject: string) => void;
  handleClearFilters: () => void;
  activeFilterCount: number;
  onClose: () => void;
  categories: any[];
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  filters,
  setFilters,
  subjects,
  toggleSubject,
  handleClearFilters,
  activeFilterCount,
  onClose,
  categories,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            subjects={subjects}
            toggleSubject={toggleSubject}
            handleClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
            categories={categories}
          />
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterDrawer;
