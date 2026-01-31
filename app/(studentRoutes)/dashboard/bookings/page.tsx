"use client"

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { getErrorMsg } from '@/lib/error-handler';

interface Booking {
  id: string;
  bookingNumber: string;
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    expertise: string;
  };
  course: {
    id: string;
    name: string;
    category: string;
  };
  session: {
    date: string;
    time: string;
    duration: number;
    type: 'video' | 'audio' | 'in-person';
    meetingLink?: string;
  };
  payment: {
    amount: number;
    status: 'paid' | 'pending' | 'refunded';
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  hasReview: boolean;
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

const StudentBookingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/student/bookings?limit=100');
      const transformedBookings = response.data.map((booking: any) => transformBooking(booking));
      setBookings(transformedBookings);
      setError(null);
    } catch (err: any) {
      const msg = getErrorMsg(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const transformBooking = (booking: any): Booking => {
    const scheduledDate = new Date(booking.scheduledAt);
    const now = new Date();
    const sessionEndTime = new Date(scheduledDate.getTime() + booking.duration * 60000);
    
    let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
    if (booking.status === 'CANCELLED') {
      status = 'cancelled';
    } else if (booking.status === 'COMPLETED') {
      status = 'completed';
    } else if (scheduledDate <= now && now <= sessionEndTime) {
      status = 'ongoing';
    } else if (scheduledDate > now) {
      status = 'upcoming';
    } else {
      status = 'completed';
    }

    const tutorName = booking.tutor_profile?.user?.name || 'Unknown Tutor';
    const initials = tutorName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

    return {
      id: booking.id,
      bookingNumber: `BK-${booking.id.slice(0, 8)}`,
      tutor: {
        id: booking.tutor_profile?.userId || '',
        name: tutorName,
        email: booking.tutor_profile?.user?.email || '',
        avatar: initials,
        expertise: booking.subject || 'General',
      },
      course: {
        id: booking.id,
        name: booking.subject || 'Session',
        category: 'Learning',
      },
      session: {
        date: scheduledDate.toISOString().split('T')[0],
        time: scheduledDate.toTimeString().slice(0, 5),
        duration: booking.duration,
        type: 'video',
        meetingLink: booking.meetingLink,
      },
      payment: {
        amount: booking.price,
        status: 'paid',
      },
      status,
      createdAt: booking.createdAt,
      completedAt: booking.status === 'COMPLETED' ? booking.updatedAt : undefined,
      hasReview: !!booking.review,
      review: booking.review ? {
        id: booking.review.id,
        rating: booking.review.rating,
        comment: booking.review.comment || '',
        createdAt: booking.review.createdAt,
      } : undefined,
    };
  };

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

  const getCurrentBookings = () => {
    let filtered = bookings;
    
    if (activeTab === 'upcoming') {
      filtered = upcomingBookings;
    } else if (activeTab === 'ongoing') {
      filtered = ongoingBookings;
    } else {
      filtered = pastBookings;
    }

    if (searchQuery) {
      filtered = filtered.filter((booking) =>
        booking.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setIsCancelling(bookingId);
      
      await apiClient.patch(`/api/student/bookings/${bookingId}/cancel`, {});
      toast.success('Booking cancelled successfully');
      await fetchBookings();
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast.error(getErrorMsg(err));
    } finally {
      setIsCancelling(null);
    }
  };

  const handleSubmitReview = async () => {
    if (selectedBooking && rating > 0) {
      try {
        await apiClient.post('/api/student/reviews', {
          bookingId: selectedBooking.id,
          rating,
          comment: reviewComment || undefined,
        });
        
        await fetchBookings();
        setShowReviewModal(false);
        setSelectedBooking(null);
        setRating(0);
        setReviewComment('');
        toast.success("Review submitted successfully!");
      } catch (err: any) {
        console.error('Error submitting review:', err);
        toast.error(getErrorMsg(err));
      }
    }
  };

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

  const RatingStars: React.FC<{ 
    rating: number; 
    interactive?: boolean; 
    size?: 'sm' | 'md' | 'lg';
    onRate?: (rating: number) => void;
  }> = ({ rating, interactive = false, size = 'md', onRate }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform ${
              interactive ? 'hover:scale-110' : ''
            }`}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= (interactive ? (hoveredRating || rating) : rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
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

        {/* Stats Overview */}
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
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.upcomingCount}</p>
          </div>

          <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Ongoing</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.ongoingCount}</p>
          </div>

          <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedCount}</p>
          </div>

          <div className="p-6 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Hours</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.hoursLearned.toFixed(1)}</p>
          </div>

          <div className="p-6 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Spent</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(0)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {[
            { key: 'upcoming', label: 'Upcoming', count: stats.upcomingCount },
            { key: 'ongoing', label: 'Ongoing', count: stats.ongoingCount },
            { key: 'past', label: 'Past Sessions', count: pastBookings.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
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
              placeholder="Search by course, tutor, or booking number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && (
        <div className="grid gap-6">
          {getCurrentBookings().map((booking, index) => (
            <div
              key={booking.id}
              className="group relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
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
                        onClick={() => handleLeaveReview(booking)}
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
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={isCancelling === booking.id}
                        className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isCancelling === booking.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {isCancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && !error && getCurrentBookings().length === 0 && (
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
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Gradient Header */}
            <div className="relative p-6 bg-linear-to-br from-purple-500 to-pink-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Leave a Review</h3>
                  <p className="text-sm text-white/80">Share your learning experience</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Session Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {selectedBooking.tutor.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Session with</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedBooking.tutor.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBooking.course.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  How would you rate this session? <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <RatingStars
                    rating={rating}
                    interactive={true}
                    size="lg"
                    onRate={setRating}
                  />
                  {rating > 0 && (
                    <span className="text-2xl font-bold bg-linear-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {rating}.0
                    </span>
                  )}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {rating === 5 && '🌟 Excellent!'}
                    {rating === 4 && '👍 Very Good!'}
                    {rating === 3 && '😊 Good!'}
                    {rating === 2 && '😐 Fair'}
                    {rating === 1 && '😞 Needs Improvement'}
                  </p>
                )}
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Share your experience <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you like? What could be improved? Your feedback helps other students and tutors..."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {reviewComment.length} / 500 characters
                </p>
              </div>

              {/* Tips */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  💡 Tips for a helpful review:
                </p>
                <ul className="text-xs text-purple-800 dark:text-purple-400 space-y-1 list-disc list-inside">
                  <li>Mention specific topics or concepts covered</li>
                  <li>Share what you learned or achieved</li>
                  <li>Comment on the tutor's teaching style</li>
                  <li>Be honest and constructive</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedBooking(null);
                    setRating(0);
                    setReviewComment('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className="flex-1 px-6 py-3 bg-linear-to-br from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentBookingsView;