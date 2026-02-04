"use client";

import React, { useState } from 'react';

interface FilterState {
  searchQuery: string;
  selectedSubjects: string[];
  priceRange: [number, number];
  minRating: number | null;
  minTotalReviews: number | null;
  category: string | null;
}

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  subjects: string[];
  toggleSubject: (subject: string) => void;
  handleClearFilters: () => void;
  activeFilterCount: number;
  categories: any[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  subjects,
  toggleSubject,
  handleClearFilters,
  activeFilterCount,
  categories,
}) => {
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Search by name
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Enter tutor name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, category: prev.category === category.name ? null : category.name }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.category === category.name
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Subject
          </label>
          <div className="flex flex-wrap gap-2">
            {displayedSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.selectedSubjects.includes(subject)
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
          {subjects.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {showAllSubjects ? 'Show less' : `Show ${subjects.length - 6} more`}
            </button>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Price per session
          </label>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                ${filters.priceRange[0]}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ${filters.priceRange[1]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex gap-2">
              {[
                { label: 'Budget', max: 30 },
                { label: 'Mid-range', max: 60 },
                { label: 'Premium', max: 200 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, preset.max] }))}
                  className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Minimum rating
          </label>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? null : rating }))}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  filters.minRating === rating
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{rating}.0 & up</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Minimum reviews
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[0, 10, 20, 50].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, minTotalReviews: count || null }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  (filters.minTotalReviews === count || (!filters.minTotalReviews && count === 0))
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {count === 0 ? 'Any reviews' : `${count}+ reviews`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
