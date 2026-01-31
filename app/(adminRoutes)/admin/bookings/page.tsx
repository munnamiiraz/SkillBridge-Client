"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { getErrorMsg } from '@/lib/error-handler';

interface Booking {
  id: string;
  bookingNumber: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string;
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
  };
  payment: {
    amount: number;
    status: 'paid' | 'pending' | 'refunded' | 'failed';
    method: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  notes?: string;
}

const AdminBookingsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Booking['status']>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | Booking['payment']['status']>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'created'>('date');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, pagination.page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
      
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/admin/bookings?${queryString}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const { data, meta } = response.data;
        
        // Map backend bookings to frontend model
        const mappedBookings: Booking[] = data.map((b: any) => ({
          id: b.id,
          bookingNumber: `BK-${b.id.slice(0, 8)}`,
          student: {
            id: b.user.id,
            name: b.user.name,
            email: b.user.email,
            avatar: b.user.name.charAt(0).toUpperCase(),
          },
          tutor: {
            id: b.tutor_profile.userId,
            name: b.tutor_profile.user.name,
            email: b.tutor_profile.user.email,
            avatar: b.tutor_profile.user.name.charAt(0).toUpperCase(),
          },
          course: {
            id: b.id,
            name: b.subject || 'Session',
            category: 'Learning',
          },
          session: {
            date: b.scheduledAt.split('T')[0],
            time: new Date(b.scheduledAt).toTimeString().slice(0, 5),
            duration: b.duration,
            type: 'video',
          },
          payment: {
            amount: b.price,
            status: 'paid',
            method: 'Credit Card',
          },
          status: (b.status === 'PENDING' || b.status === 'CONFIRMED') ? 'upcoming' : b.status.toLowerCase(),
          createdAt: b.createdAt,
          notes: b.notes,
        }));

        setBookings(mappedBookings);
        setPagination({
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(getErrorMsg(error));
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalBookings: pagination.total,
    upcomingBookings: bookings.filter((b) => b.status === 'upcoming').length,
    ongoingBookings: bookings.filter((b) => b.status === 'ongoing').length,
    completedBookings: bookings.filter((b) => b.status === 'completed').length,
    cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter((b) => b.payment.status === 'paid')
      .reduce((sum, b) => sum + b.payment.amount, 0),
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.course.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.payment.status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
    setRefundAmount(booking.payment.amount.toString());
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (bookingToCancel) {
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/admin/bookings/${bookingToCancel.id}/cancel`,
          {
            reason: cancelReason,
            refundAmount: parseFloat(refundAmount)
          },
          { withCredentials: true }
        );
        if (response.data.success) {
          toast.success('Booking cancelled successfully');
          fetchBookings();
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error(getErrorMsg(error));
      } finally {
        setShowCancelModal(false);
        setBookingToCancel(null);
        setCancelReason('');
        setRefundAmount('');
      }
    }
  };

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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badges[status]}`}>
        {icons[status]}
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.upcomingBookings}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Ongoing</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.ongoingBookings}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedBookings}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-100 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.cancelledBookings}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      {/* Filters */}
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
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
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
          onChange={(e) => setPaymentFilter(e.target.value as typeof paymentFilter)}
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
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="created">Sort by Created</option>
        </select>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6">
        {filteredBookings.map((booking, index) => (
          <div
            key={booking.id}
            className="group relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
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
                    <p className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-4">
                  {(booking.status === 'upcoming' || booking.status === 'ongoing') && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(booking)}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cancel Booking
                    </button>
                  )}
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
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
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
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No bookings found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{bookings.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> bookings
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => {
                  // Logic to show: 1, current-1, current, current+1, last
                  // or just some window
                  const current = pagination.page;
                  const total = pagination.totalPages;
                  return p === 1 || p === total || (p >= current - 1 && p <= current + 1);
                })
                .map((p, i, arr) => {
                  const elements = [];
                  // Add ellipsis
                  if (i > 0 && p > arr[i - 1] + 1) {
                    elements.push(
                      <span key={`ellipsis-${p}`} className="px-2 text-gray-400">...</span>
                    );
                  }
                  elements.push(
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                        pagination.page === p
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                  return elements;
                })}
            </div>

            <button
              type="button"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Gradient Header */}
            <div className="relative p-6 bg-gradient-to-br from-red-500 to-orange-500 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Cancel Booking</h3>
                  <p className="text-sm text-white/80">This action requires confirmation</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Booking Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Booking Number</span>
                  <span className="font-semibold text-gray-900 dark:text-white font-mono">
                    {bookingToCancel.bookingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Course</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bookingToCancel.course.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Session Date</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(bookingToCancel.session.date)} at {formatTime(bookingToCancel.session.time)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="text-lg font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${bookingToCancel.payment.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Refund Amount */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Refund Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    max={bookingToCancel.payment.amount}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum refund: ${bookingToCancel.payment.amount.toFixed(2)}
                </p>
              </div>

              {/* Cancellation Reason */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Reason for cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this booking..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                />
              </div>

              {/* Warning Message */}
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">
                      Important Notice
                    </h4>
                    <p className="text-xs text-orange-800 dark:text-orange-400">
                      Both the student and tutor will be notified immediately. The specified refund amount will be processed within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setBookingToCancel(null);
                    setCancelReason('');
                    setRefundAmount('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={confirmCancelBooking}
                  disabled={!cancelReason.trim() || !refundAmount}
                  className="flex-1 px-6 py-3 bg-gradient-to-br from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsManagement;