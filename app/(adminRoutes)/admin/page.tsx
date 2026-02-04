import { cookies } from 'next/headers';
import Link from 'next/link';
import { StatsService } from '@/app/admin/stats.service';
import { UserService } from '@/app/admin/users.service';
import { AdminBookings } from '@/app/admin/bookings.service';
import MainStatCard from './components/MainStatCard';
import RoleStatCard from './components/RoleStatCard';
import StatusStatCard from './components/StatusStatCard';
import RefreshButton from './components/RefreshButton';

export const dynamic = 'force-dynamic';



export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // Fetch all necessary data for a comprehensive dashboard
  const [stats, recentUsersData, recentBookingsData] = await Promise.all([
    StatsService.getPlatformStats(cookieString).catch(() => null),
    UserService.getAll({ limit: 5 }, cookieString).catch(() => ({ users: [] })),
    AdminBookings.getAll({ limit: 5 }, cookieString).catch(() => ({ bookings: [] })),
  ]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 mb-4">
             <p className="text-red-600 dark:text-red-400 font-semibold">Failed to load platform statistics.</p>
          </div>
          <RefreshButton />
        </div>
      </div>
    );
  }

  const avgRevenuePerBooking = stats.revenue.completedBookings > 0 
    ? (stats.revenue.total / stats.revenue.completedBookings).toFixed(2)
    : '0.00';

  const getUserPercentage = (count: number, total: number) => 
    total > 0 ? Math.round((count / total) * 100) : 0;

  const getBookingPercentage = (count: number, total: number) => 
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="relative p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-linear-to-br from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Platform Overview
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshButton />
          <Link 
            href="/admin/users"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MainStatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          label="Total Users"
          value={stats.users.total.toLocaleString()}
          subValue={`+${stats.users.newThisWeek} this week`}
          gradient="from-blue-500 to-indigo-600"
        />
        <MainStatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Total Bookings"
          value={stats.bookings.total.toLocaleString()}
          subValue={`+${stats.bookings.newThisWeek} this week`}
          gradient="from-purple-500 to-pink-600"
        />
        <MainStatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Total Revenue"
          value={`$${stats.revenue.total.toLocaleString()}`}
          subValue={`${stats.revenue.completedBookings} completed`}
          gradient="from-emerald-500 to-teal-600"
        />
        <MainStatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          label="Avg. Revenue"
          value={`$${avgRevenuePerBooking}`}
          subValue="Per booking"
          gradient="from-orange-500 to-rose-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Breakdown Charts */}
        <div className="lg:col-span-1 space-y-8">
          {/* Role Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                User Breakdown
              </h2>
            </div>
            <div className="p-6 space-y-6">
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

          {/* Booking Status */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                Booking Status
              </h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              <StatusStatCard
                status="Completed"
                count={stats.bookings.byStatus.completed}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.completed, stats.bookings.total)}
                color="green"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
              />
              <StatusStatCard
                status="Confirmed"
                count={stats.bookings.byStatus.confirmed}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.confirmed, stats.bookings.total)}
                color="blue"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>}
              />
              <StatusStatCard
                status="Pending"
                count={stats.bookings.byStatus.pending}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.pending, stats.bookings.total)}
                color="yellow"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatusStatCard
                status="Cancelled"
                count={stats.bookings.byStatus.cancelled}
                total={stats.bookings.total}
                percentage={getBookingPercentage(stats.bookings.byStatus.cancelled, stats.bookings.total)}
                color="red"
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold text-white">Platform Control Centre</h2>
                <p className="text-indigo-100/80 text-lg">
                  Direct access to critical platform management tools and configurations.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/admin/make-category" className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all font-semibold">
                    Manage Categories
                  </Link>
                  <Link href="/admin/bookings" className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all font-semibold">
                    View All Bookings
                  </Link>
                </div>
              </div>
              <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
                <svg className="w-16 h-16 md:w-24 md:h-24 text-white opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Recent Users List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Users</h2>
                <Link href="/admin/users" className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentUsersData.users.length > 0 ? (
                  recentUsersData.users.map((user, index) => (
                    <div key={index} className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">No recent users.</div>
                )}
              </div>
            </div>

            {/* Recent Bookings List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">Latest Bookings</h2>
                <Link href="/admin/bookings" className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentBookingsData.bookings.length > 0 ? (
                  recentBookingsData.bookings.map((booking, index) => (
                    <div key={index} className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                        🔖
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{booking.student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{booking.course.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">${booking.payment.amount}</p>
                        <span className="text-[10px] text-gray-500 uppercase">{booking.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">No recent bookings.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}