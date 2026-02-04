"use client"
import React from 'react';
import { Booking } from '@/app/admin/bookings.service';
import CancelBookingTrigger from './CancelBookingTrigger';

interface BookingCardProps {
  booking: Booking;
  index: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, index }) => {
  const getStatusBadge = (status: Booking['status']) => {
    const badges = {
      upcoming: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      ongoing: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      completed: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      'no-show': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    };

    const icons = {
      upcoming: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      ongoing: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      completed: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      cancelled: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'no-show': (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badges[status]}`}
      >
        {icons[status]}
        {status
          .split('-')
          .map((word, index) => (
            <span key={index}>
              {word.charAt(0).toUpperCase() + word.slice(1)}
            </span>
          ))}
      </span>
    );

  };

  const getPaymentBadge = (status: Booking['payment']['status']) => {
    const badges = {
      paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      refunded: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div
      className="group relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Section - Booking Info */}
        <div className="lg:col-span-5 space-y-4">
          {/* Booking Number & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Booking Number</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                {booking.bookingNumber}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          {/* Student */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Student</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {booking.student.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {booking.student.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {booking.student.email}
                </p>
              </div>
            </div>
          </div>

          {/* Tutor */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tutor</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {booking.tutor.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {booking.tutor.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {booking.tutor.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Course & Session */}
        <div className="lg:col-span-4 space-y-4">
          {/* Course */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Course</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {booking.course.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {booking.course.category}
            </p>
          </div>

          {/* Session Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatDate(booking.session.date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatTime(booking.session.time)} ({booking.session.duration} min)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium capitalize">
                {booking.session.type}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Payment & Actions */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {/* Payment */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment</p>
              <p className="text-2xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ${booking.payment.amount.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {getPaymentBadge(booking.payment.status)}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {booking.payment.method}
                </span>
              </div>
            </div>
          </div>

          {/* Actions - Client Interactivity */}
          <div className="flex flex-col gap-2 mt-4">
            <CancelBookingTrigger booking={booking} />
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            {booking.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
