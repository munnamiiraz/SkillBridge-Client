'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Types based on Prisma schema
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  image: string | null;
  role: 'STUDENT';
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Booking {
  id: string;
  scheduledAt: Date;
  duration: number;
  status: BookingStatus;
  subject: string | null;
  price: number;
  tutor_profile: {
    user: {
      name: string;
      image: string | null;
    };
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  booking: {
    tutorProfile: {
      user: {
        name: string;
      };
    };
  };
}

const StudentProfilePage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'reviews'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/student/profile`,
          { withCredentials: true }
        );
        
        if (profileResponse.data.success) {
          const userData = profileResponse.data.data;
          setStudent({
            ...userData,
            createdAt: new Date(userData.createdAt),
            updatedAt: new Date(userData.updatedAt)
          });
        }
        
        // Fetch bookings
        const bookingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/student/bookings`,
          { withCredentials: true }
        );
        
        if (bookingsResponse.data.success) {
          setBookings(bookingsResponse.data.data.map((booking: any) => ({
            ...booking,
            scheduledAt: new Date(booking.scheduledAt)
          })));
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) {
      fetchData();
    } else if (!sessionPending) {
      setIsLoading(false);
    }
  }, [session?.user?.id, sessionPending]);

  if (isLoading || sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
      </div>
    );
  }

  const stats = {
    totalBookings: bookings.length,
    completedSessions: bookings.filter(b => b.status === 'COMPLETED').length,
    upcomingSessions: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
    totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'COMPLETED':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden mb-8">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 lg:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-20 sm:-mt-16 gap-6">
              
              {/* Avatar and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white dark:border-gray-900">
                    {student.image ? (
                      <img src={student.image} alt={student.name} className="w-full h-full rounded-3xl object-cover" />
                    ) : (
                      getInitials(student.name)
                    )}
                  </div>
                  {/* Verified Badge */}
                  {student.emailVerified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name and Info */}
                <div className="text-center sm:text-left space-y-2">
                  <div className='mt-[85px]'>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      {student.name || 'Student'}
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full">
                        Student
                      </span>
                      <span className={`px-3 py-1 ${
                        student.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                      } text-sm font-semibold rounded-full`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Member since {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(student.createdAt)}
                  </p>
                </div>
              </div>

              {/* Manage Profile Button */}
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <Link href='/dashboard/manage-profile'>
                Manage Profile
                </Link>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalBookings}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedSessions}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.upcomingSessions}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageRating}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating Given</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'bookings'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 dark:text-white font-medium">{student.email}</p>
                        {student.emailVerified && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Phone Number
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{student.phone}</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Address
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {student.address || 'Not provided'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Account Status
                      </label>
                      <span className={`inline-block px-3 py-1 ${getStatusColor(student.status as any)} text-sm font-semibold rounded-full`}>
                        {student.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Member Since
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(student.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Learning Stats */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Learning Journey
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Total Investment</h3>
                        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        ${stats.totalSpent}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Invested in learning
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Learning Hours</h3>
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        {stats.completedSessions} hrs
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Total hours learned
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  My Bookings
                </h2>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Tutor Avatar */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {booking.tutor_profile.user.image ? (
                                <img src={booking.tutor_profile.user.image} alt={booking.tutor_profile.user.name} className="w-full h-full rounded-xl object-cover" />
                              ) : (
                                getInitials(booking.tutor_profile.user.name)
                              )}
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                {booking.subject || 'Session'}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                with {booking.tutor_profile.user.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{formatDate(booking.scheduledAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{booking.duration} min</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status and Price */}
                          <div className="text-right space-y-2 flex-shrink-0">
                            <span className={`inline-block px-3 py-1 ${getStatusColor(booking.status)} text-xs font-semibold rounded-full`}>
                              {booking.status}
                            </span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${booking.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  My Reviews
                </h2>
                
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                              {review.booking.tutorProfile.user.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(review.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentProfilePage;