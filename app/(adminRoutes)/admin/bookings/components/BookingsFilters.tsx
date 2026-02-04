"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const BookingsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    setSearchQuery(searchParams.get('search') || '');
    setStatusFilter(searchParams.get('status') || 'all');
    setPaymentFilter(searchParams.get('payment') || 'all');
    setSortBy(searchParams.get('sortBy') || 'date');
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      updateParams({ search: searchQuery });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, mounted]);

  const updateParams = (updates: Record<string, string>) => {
    if (!mounted) return;
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all' || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 on filter change
    if (!updates.page) {
      params.delete('page');
    }

    router.push(`?${params.toString()}`);
  };

  if (!mounted) {
    return <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
      {/* Search */}
      <div className="flex-1 relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
          placeholder="Search by booking number, student, tutor, or course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          updateParams({ status: e.target.value });
        }}
        className="px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
      >
        <option value="all">All Status</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="no-show">No Show</option>
      </select>

      {/* Payment Filter */}
      <select
        value={paymentFilter}
        onChange={(e) => {
          setPaymentFilter(e.target.value);
          updateParams({ payment: e.target.value });
        }}
        className="px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
      >
        <option value="all">All Payments</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="refunded">Refunded</option>
        <option value="failed">Failed</option>
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          updateParams({ sortBy: e.target.value });
        }}
        className="px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
        <option value="created">Sort by Created</option>
      </select>
    </div>
  );
};

export default BookingsFilters;
