"use client"
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Booking } from '@/app/services/booking.service';
import { RatingStars } from './RatingStars';

interface BookingCardProps {
  booking: Booking;
  isCancelling?: boolean;
  onCancel: (id: string) => void;
  onReview: (booking: Booking) => void;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
  getTimeUntilSession: (date: string, time: string) => string;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  isCancelling,
  onCancel, 
  onReview,
  formatDate,
  formatTime,
  getTimeUntilSession
}) => {
  return (
    <div className="group relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Section - Tutor & Course */}
        <div className="lg:col-span-5 space-y-4">
          {/* Booking Number & Time Until */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Booking Number</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                {booking.bookingNumber}
              </p>
            </div>
            {booking.status === 'upcoming' && (
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                {getTimeUntilSession(booking.session.date, booking.session.time)}
              </div>
            )}
            {booking.status === 'ongoing' && (
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold animate-pulse">
                Live Now
              </div>
            )}
          </div>

          {/* Tutor */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Your Tutor</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                {booking.tutor.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {booking.tutor.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {booking.tutor.expertise}
                </p>
              </div>
            </div>
          </div>

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
        </div>

        {/* Middle Section - Session Details */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Session Details</p>
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

          {/* Payment */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount Paid</p>
            <p className="text-2xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ${booking.payment.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {/* Review Section for Completed Sessions */}
          {booking.status === 'completed' && (
            <div className="mb-4">
              {booking.hasReview && booking.review ? (
                <div className="p-4 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Your Review</p>
                  <RatingStars rating={booking.review.rating} size="sm" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    {booking.review.comment}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                    📝 Review Pending
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    Share your experience with {booking.tutor.name.split(' ')[0]}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {booking.status === 'upcoming' && booking.session.meetingLink && (
              <a
                href={booking.session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Meeting
              </a>
            )}

            {booking.status === 'ongoing' && booking.session.meetingLink && (
              <a
                href={booking.session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-linear-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 animate-pulse"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Rejoin Session
              </a>
            )}

            {booking.status === 'completed' && !booking.hasReview && (
              <button
                type="button"
                onClick={() => onReview(booking)}
                className="w-full px-4 py-2 bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Leave Review
              </button>
            )}

            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>

            {(booking.status === 'upcoming' || booking.status === 'ongoing') && (
              <button
                type="button"
                onClick={() => onCancel(booking.id)}
                disabled={isCancelling}
                className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
