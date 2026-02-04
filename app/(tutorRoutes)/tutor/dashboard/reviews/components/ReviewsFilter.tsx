"use client"
import React from 'react';

interface ReviewsFilterProps {
  filterRating: number | null;
  setFilterRating: (rating: number | null) => void;
  sortBy: 'recent' | 'highest' | 'lowest';
  setSortBy: (sort: 'recent' | 'highest' | 'lowest') => void;
}

export const ReviewsFilter: React.FC<ReviewsFilterProps> = ({ 
  filterRating, 
  setFilterRating,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filterRating === null
                ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setFilterRating(rating)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                filterRating === rating
                  ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {rating}
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
          className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>
    </div>
  );
};
