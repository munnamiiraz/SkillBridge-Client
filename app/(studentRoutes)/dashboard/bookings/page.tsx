"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getErrorMsg } from '@/lib/error-handler';
import { BookingService, Booking } from '@/app/services/booking.service';

import { StatsOverview } from './components/StatsOverview';
import { BookingTabs } from './components/BookingTabs';
import { BookingFilters } from './components/BookingFilters';
import { BookingList } from './components/BookingList';
import { ReviewModal } from './components/ReviewModal';

const StudentBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancellingId, setIsCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getBookings();
      setBookings(data);
      setError(null);
    } catch (err: any) {
      const msg = getErrorMsg(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setIsCancellingId(bookingId);
      await BookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      await fetchBookings();
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast.error(getErrorMsg(err));
    } finally {
      setIsCancellingId(null);
    }
  };

  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (selectedBooking) {
      try {
        await BookingService.submitReview(selectedBooking.id, rating, comment);
        await fetchBookings();
        setShowReviewModal(false);
        setSelectedBooking(null);
        toast.success("Review submitted successfully!");
      } catch (err: any) {
        console.error('Error submitting review:', err);
        toast.error(getErrorMsg(err));
        throw err; // Re-throw to let modal handle state if needed
      }
    }
  };

  // derived state
  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const ongoingBookings = bookings.filter((b) => b.status === 'ongoing');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const stats = {
    totalBookings: bookings.length,
    upcomingCount: upcomingBookings.length,
    ongoingCount: ongoingBookings.length,
    completedCount: bookings.filter((b) => b.status === 'completed').length,
    totalSpent: bookings
      .filter((b) => b.payment.status === 'paid')
      .reduce((sum, b) => sum + b.payment.amount, 0),
    hoursLearned: bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + b.session.duration, 0) / 60,
  };

  const getFilteredBookings = () => {
    let filtered = bookings;
    
    if (activeTab === 'upcoming') {
      filtered = upcomingBookings;
    } else if (activeTab === 'ongoing') {
      filtered = ongoingBookings;
    } else {
      filtered = pastBookings;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((booking) =>
        booking.course.name.toLowerCase().includes(query) ||
        booking.tutor.name.toLowerCase().includes(query) ||
        booking.bookingNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  return (
    <section className="relative w-full min-h-screen py-24 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Gradient Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  My Sessions
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Track your learning journey and upcoming sessions
              </p>
            </div>
          </div>
        </div>

        <StatsOverview stats={stats} />

        <BookingTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          counts={{
            upcoming: stats.upcomingCount,
            ongoing: stats.ongoingCount,
            past: pastBookings.length
          }}
        />

        <BookingFilters 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <BookingList 
          bookings={getFilteredBookings()} 
          loading={loading}
          error={error}
          onCancel={handleCancelBooking}
          onReview={handleLeaveReview}
          isCancellingId={isCancellingId}
          activeTab={activeTab}
        />
      </div>

      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        booking={selectedBooking}
      />
    </section>
  );
};

export default StudentBookingsPage;