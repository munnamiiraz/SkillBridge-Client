"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BookingFiltersProps {
  searchQuery: string;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({ searchQuery }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [internalSearch, setInternalSearch] = useState(searchQuery);

  // Sync internal search with prop (URL) when it changes externally (like back button)
  useEffect(() => {
    setInternalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // If the internal search is already what's in the URL, don't do anything
    if (internalSearch === searchQuery) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (internalSearch) {
        params.set('search', internalSearch);
      } else {
        params.delete('search');
      }

      // Final check: if the generated string is same as current string, don't push
      const newQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (newQuery === currentQuery) return;

      router.push(`?${newQuery}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [internalSearch, router, searchParams, searchQuery]);

  return (
    <div className="mb-8">
      <div className="relative group">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by course, tutor, or booking ID..."
          value={internalSearch}
          onChange={(e) => setInternalSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};
