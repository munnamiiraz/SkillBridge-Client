"use client"
import React from 'react';
import { Booking } from '@/app/services/booking.service';
import { BookingCard } from './BookingCard';

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onCancel: (id: string) => void;
  onReview: (booking: Booking) => void;
  isCancellingId: string | null;
  activeTab: string;
}

export const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  loading, 
  error, 
  onCancel, 
  onReview, 
  isCancellingId,
  activeTab
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
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

  const getTimeUntilSession = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = sessionDate.getTime() - now.getTime();
    
    if (diff < 0) return 'Session started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    // Error is handled in parent mostly, but can be shown here if needed
    return null; 
  }

  if (bookings.length === 0) {
    return (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No sessions found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {activeTab === 'upcoming' && "You don't have any upcoming sessions yet"}
          {activeTab === 'ongoing' && "No ongoing sessions at the moment"}
          {activeTab === 'past' && "You haven't completed any sessions yet"}
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse Tutors
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {bookings.map((booking, index) => (
        <BookingCard 
          key={booking.id} 
          booking={booking}
          isCancelling={isCancellingId === booking.id}
          onCancel={onCancel}
          onReview={onReview}
          formatDate={formatDate}
          formatTime={formatTime}
          getTimeUntilSession={getTimeUntilSession}
        />
      ))}
    </div>
  );
};
