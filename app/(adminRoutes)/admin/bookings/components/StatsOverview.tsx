"use client"
import React from 'react';
import { Booking } from '@/app/admin/bookings.service';

interface StatsOverviewProps {
  totalBookings: number;
  bookings: Booking[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ totalBookings, bookings }) => {
  const stats = {
    totalBookings,
    upcomingBookings: bookings.filter((b) => b.status === 'upcoming').length,
    ongoingBookings: bookings.filter((b) => b.status === 'ongoing').length,
    completedBookings: bookings.filter((b) => b.status === 'completed').length,
    cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter((b) => b.payment.status === 'paid')
      .reduce((sum, b) => sum + b.payment.amount, 0),
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.upcomingBookings}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Ongoing</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.ongoingBookings}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedBookings}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-100 dark:border-red-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.cancelledBookings}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(0)}</p>
      </div>
    </div>
  );
};

export default StatsOverview;
