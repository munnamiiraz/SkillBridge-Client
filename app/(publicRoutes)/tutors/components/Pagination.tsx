"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages <= 1 ? [1] : getVisiblePages();

  return (
    <nav className="flex items-center justify-center space-x-2 py-10 animate-in fade-in-up duration-700">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-90"
        title="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="w-10 text-center text-xs font-black text-gray-300 dark:text-gray-700 tracking-widest">
                •••
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 flex items-center justify-center rounded-[1rem] text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-90"
        title="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
