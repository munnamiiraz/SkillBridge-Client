"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminBookings, Booking } from '@/app/admin/bookings.service';
import StatsOverview from './components/StatsOverview';
import BookingsFilters from './components/BookingsFilters';
import BookingCard from './components/BookingCard';
import Pagination from './components/Pagination';

export default function AdminBookingsContent() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const currentPage = parseInt(searchParams.get('page') || '1');
        const statusFilter = searchParams.get('status') || 'all';
        const paymentFilter = searchParams.get('payment') || 'all';
        const searchQuery = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'date';

        const result = await AdminBookings.getAll({
          page: currentPage,
          limit: 10,
          status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
          payment: paymentFilter !== 'all' ? paymentFilter.toUpperCase() : undefined,
          search: searchQuery,
          sortBy,
        });

        if (result && result.bookings) {
          setBookings(result.bookings as Booking[]);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setBookings([]);
        setPagination({ page: 1, totalPages: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Bookings Management
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View, manage, and track all session bookings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview totalBookings={pagination.total} bookings={bookings} />

      {/* Filters */}
      <BookingsFilters />

      {/* Bookings List */}
      <div className="grid gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <BookingCard key={index} booking={booking} index={index} />
          ))
        ) : (
          /* Empty State */
          <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <svg
              className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No bookings found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={bookings.length}
      />
    </div>
  );
}