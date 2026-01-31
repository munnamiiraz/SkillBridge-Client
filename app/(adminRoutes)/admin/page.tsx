"use client"
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { getErrorMsg } from '@/lib/error-handler';

interface UserStats {
  total: number;
  byRole: {
    admin: number;
    tutor: number;
    student: number;
  };
  newThisWeek: number;
}

interface BookingStats {
  total: number;
  byStatus: {
    completed: number;
    cancelled: number;
    pending: number;
    confirmed: number;
  };
  newThisWeek: number;
}

interface RevenueStats {
  total: number;
  completedBookings: number;
}

interface PlatformStats {
  users: UserStats;
  bookings: BookingStats;
  revenue: RevenueStats;
}

const AdminStatsPage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats();
    } else if (!sessionPending) {
      setLoading(false);
    }
  }, [session?.user?.id, sessionPending]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/admin/stats');
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(getErrorMsg(error));
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentages for bookings
  const getBookingPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Calculate percentages for users
  const getUserPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Calculate average revenue per booking
  const avgRevenuePerBooking = stats 
    ? stats.revenue.completedBookings > 0 
      ? (stats.revenue.total / stats.revenue.completedBookings).toFixed(2)
      : '0.00'
    : '0.00';

  // Loading state
  if (loading || sessionPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin
  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No statistics available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
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
        className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Platform Statistics
              </span>
            </h1>
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Overview of platform performance and key metrics.
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MainStatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            label="Total Users"
            value={stats.users.total.toLocaleString()}
            subValue={`+${stats.users.newThisWeek.toLocaleString()} this week`}
            gradient="from-blue-500 to-cyan-500"
          />
          <MainStatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Total Bookings"
            value={stats.bookings.total.toLocaleString()}
            subValue={`+${stats.bookings.newThisWeek.toLocaleString()} this week`}
            gradient="from-purple-500 to-pink-500"
          />
          <MainStatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Revenue"
            value={`$${stats.revenue.total.toLocaleString()}`}
            subValue={`${stats.revenue.completedBookings.toLocaleString()} completed`}
            gradient="from-green-500 to-emerald-500"
          />
          <MainStatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Avg per Booking"
            value={`$${avgRevenuePerBooking}`}
            subValue="Average revenue"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Users Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden mb-8">
          <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              Users by Role
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Distribution of users across different roles
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <RoleStatCard
                role="Students"
                count={stats.users.byRole.student}
                total={stats.users.total}
                percentage={getUserPercentage(stats.users.byRole.student, stats.users.total)}
                color="blue"
              />
              <RoleStatCard
                role="Tutors"
                count={stats.users.byRole.tutor}
                total={stats.users.total}
                percentage={getUserPercentage(stats.users.byRole.tutor, stats.users.total)}
                color="purple"
              />
              <RoleStatCard
                role="Admins"
                count={stats.users.byRole.admin}
                total={stats.users.total}
                percentage={getUserPercentage(stats.users.byRole.admin, stats.users.total)}
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Bookings Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Bookings by Status
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Current status distribution of all bookings
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatusStatCard
                status="Completed"
                count={stats.bookings.byStatus.completed}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.completed, stats.bookings.total)}
                color="green"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatusStatCard
                status="Confirmed"
                count={stats.bookings.byStatus.confirmed}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.confirmed, stats.bookings.total)}
                color="blue"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
              <StatusStatCard
                status="Pending"
                count={stats.bookings.byStatus.pending}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.pending, stats.bookings.total)}
                color="yellow"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatusStatCard
                status="Cancelled"
                count={stats.bookings.byStatus.cancelled}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.cancelled, stats.bookings.total)}
                color="red"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Stat Card Component
interface MainStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  gradient: string;
}

const MainStatCard: React.FC<MainStatCardProps> = ({ icon, label, value, subValue, gradient }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" 
        style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
      />
      
      <div className="relative z-10">
        <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl text-white shadow-lg mb-4`}>
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {subValue}
        </p>
      </div>
    </div>
  );
};

// Role Stat Card Component
interface RoleStatCardProps {
  role: string;
  count: number;
  total: number;
  percentage: number;
  color: 'blue' | 'purple' | 'green';
}

const RoleStatCard: React.FC<RoleStatCardProps> = ({ role, count, total, percentage, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {role}
        </h3>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {count.toLocaleString()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {percentage}% of total users
      </p>
    </div>
  );
};

// Status Stat Card Component
interface StatusStatCardProps {
  status: string;
  count: number;
  total: number;
  percentage: number;
  color: 'green' | 'blue' | 'yellow' | 'red';
  icon: React.ReactNode;
}

const StatusStatCard: React.FC<StatusStatCardProps> = ({ status, count, total, percentage, color, icon }) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      bar: 'bg-green-500'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      bar: 'bg-blue-500'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
      bar: 'bg-yellow-500'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      bar: 'bg-red-500'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-xl p-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${classes.bg} rounded-lg ${classes.text}`}>
          {icon}
        </div>
        <span className={`text-2xl font-bold ${classes.text}`}>
          {count.toLocaleString()}
        </span>
      </div>
      
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {status}
      </h3>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${classes.bar} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {percentage}% of total
      </p>
    </div>
  );
};

export default AdminStatsPage;