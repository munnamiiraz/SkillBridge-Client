import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  getTutorSessions,
} from '@/app/services/tutor-sessions.service';
import { getEarningsStats } from '@/app/services/tutor-stats.service';
import { calculateTutorSessionStats } from "@/app/services/tutor-sessions.helpers";
import EarningsChart from './components/EarningsChart';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  ArrowRight,
  PlusCircle,
  Settings,
  ShieldCheck,
  Search
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const TutorDashboardPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const [sessionsRes, earningsRes] = await Promise.all([
    getTutorSessions(cookieString),
    getEarningsStats()
  ]);

  const sessions = sessionsRes.data;
  const earningsData = earningsRes.data || [];

  if (sessionsRes.error || !sessions) {
    return (
      <div className="p-6 lg:p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 text-red-600 mb-4">
          {sessionsRes.error?.message || 'Failed to load dashboard data'}
        </div>
        <Link href="/tutor/dashboard" className="text-indigo-600 hover:underline">Retry</Link>
      </div>
    );
  }

  const stats = await calculateTutorSessionStats(sessions);
  const recentSessions = sessions.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ONGOING': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Tutor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Monitor your teaching performance and manage sessions.
          </p>
        </div>
        <Link 
          href="/tutor/dashboard/availability"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all text-sm"
        >
          <PlusCircle size={18} />
          Set Availability
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Upcoming', value: stats.upcomingSessions, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Total Earnings', value: `$${stats.totalEarnings}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Earnings Chart - New! */}
        <div className="lg:col-span-3">
          <EarningsChart data={earningsData} />
        </div>

        {/* Recent Sessions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Sessions</h2>
            <Link href="/tutor/dashboard/sessions" className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1">
              All Sessions <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-6">
            {recentSessions.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No sessions recently</div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {session.user?.name?.[0] || 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{session.subject || 'Tutoring Session'}</p>
                        <p className="text-xs text-gray-500">Student: {session.user?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{formatDate(session.scheduledAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck size={120} />
            </div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Tutor Verification</h3>
            <p className="text-indigo-100 text-sm mb-6 relative z-10">Complete 10 sessions to unlock the verified badge and increase your visibility!</p>
            <Link href="/tutor/dashboard/verification" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:shadow-lg transition-all relative z-10">
              Check Status
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/tutor/dashboard/manage-profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm text-gray-600 dark:text-gray-400">
                <Settings size={18} /> Edit Profile
              </Link>
              <Link href="/tutor/dashboard/reviews" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm text-gray-600 dark:text-gray-400">
                <Star size={18} /> View Reviews
              </Link>
              <Link href="/tutors" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm text-gray-600 dark:text-gray-400">
                <Search size={18} /> Browse Other Tutors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboardPage;
