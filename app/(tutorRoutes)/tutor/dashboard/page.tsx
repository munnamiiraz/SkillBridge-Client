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
  Search,
  Clock,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  BarChart3,
  Rocket
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export const dynamic = 'force-dynamic';

const TutorDashboardPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const [sessionsRes, earningsRes] = await Promise.all([
    getTutorSessions(cookieString),
    getEarningsStats()
  ]);

  // We need to check role to show the teaser
  const { data: sessionData } = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: cookieString
      }
    }
  });

  const isVerified = (sessionData?.user as any)?.role === 'VERIFIED_TUTOR';

  const sessions = sessionsRes.data;
  const earningsData = earningsRes.data || [];

  if (sessionsRes.error || !sessions) {
    return (
      <div className="p-10 text-center min-h-[60vh] flex flex-col items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800 text-red-600 mb-6 font-bold">
          {sessionsRes.error?.message || 'Failed to load dashboard data'}
        </div>
        <Link href="/tutor/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">Retry Access</Link>
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
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-linear-to-br from-indigo-900/5 to-purple-900/5 rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] mb-2">
            <Zap size={14} className="fill-current" />
            <span>Operational Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            Teaching Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Monitor your specialized teaching metrics and manage your student outreach.
          </p>
        </div>
        <Link 
          href="/tutor/dashboard/availability"
          className="relative group h-14 px-8 flex items-center gap-3 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-[1.25rem] font-black text-sm shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-tight">
            <PlusCircle size={20} />
            Configure Schedule
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-500/5', trend: '+12%' },
          { label: 'Upcoming', value: stats.upcomingSessions, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-500/5', trend: 'Next 7 days' },
          { label: 'Total Earnings', value: `$${stats.totalEarnings}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/5', trend: 'Gross' },
          { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-500/5', trend: 'Top 5%' },
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl p-8 rounded-4xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-gray-200/20 dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-6 transition-transform group-hover:scale-110`}>
              <stat.icon size={26} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
                <span className="text-[10px] font-black text-indigo-500/60 uppercase">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Earnings Analytics</h2>
            </div>
          </div>
          <EarningsChart data={earningsData} />
        </div>

        {/* Recent Sessions */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/30 dark:bg-gray-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-purple-600">
                <Calendar size={20} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Latest Bookings</h2>
            </div>
            <Link href="/tutor/dashboard/sessions" className="group flex items-center gap-1 text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tight hover:underline">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="p-8 flex-1">
            {recentSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Calendar size={32} />
                </div>
                <p className="font-bold text-gray-500">No active sessions currently</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-5 bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                          {session.student?.name?.[0] || 'S'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border-2 border-transparent">
                           <Award size={10} className="text-indigo-500 fill-current" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{session.subject || 'Tutoring Session'}</p>
                        <p className="text-xs font-bold text-gray-400 tracking-tight">S: {session.student?.name || 'Academic Learner'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${getStatusColor(session.status.toUpperCase())}`}>
                        {session.status}
                      </span>
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 mt-2 flex items-center justify-end gap-1">
                        <Clock size={10} />
                        {formatDate(session.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          {!isVerified && (
             <div className="bg-linear-to-br from-gray-900 to-gray-800 p-8 rounded-[2.5rem] text-white border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <BarChart3 size={100} />
                </div>
                <div className="relative z-10">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20 mb-4 inline-block">Pro Insight</span>
                  <h4 className="text-xl font-black mb-2 tracking-tight font-outfit">Authority Analytics Locked</h4>
                  <p className="text-gray-400 text-xs leading-relaxed font-medium mb-6">Gain structural insights into student retention and subject profitability. Verify your profile to unlock.</p>
                  <Link href="/tutor/dashboard/verification" className="flex items-center justify-center gap-2 py-3 bg-white text-gray-900 rounded-2xl text-xs font-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                    <Rocket size={14} />
                    Upgrade Dashboard
                  </Link>
                </div>
             </div>
          )}

          <div className="relative bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/30 overflow-hidden group">
            {/* Abstract Background Design */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mb-32 pointer-events-none" />
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-4">
                <Award size={14} />
                <span>Excellence Badge</span>
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tighter">Authority Status</h3>
              <p className="text-indigo-100 text-sm mb-8 leading-relaxed font-medium">Complete verification requirements to unlock high-visibility placement and verified status.</p>
              <Link href="/tutor/dashboard/verification" className="inline-flex items-center justify-center w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm hover:shadow-xl active:scale-95 transition-all">
                Check Requirements
              </Link>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <h3 className="text-sm font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-6">Management Control</h3>
            <div className="space-y-3">
              {[
                { label: 'Optimize Profile', href: '/tutor/dashboard/manage-profile', icon: Settings },
                { label: 'Student Reviews', href: '/tutor/dashboard/reviews', icon: Star },
                { label: 'Public Preview', href: '/tutors', icon: Search },
              ].map((link, idx) => (
                <Link 
                  key={idx}
                  href={link.href} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100/50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-indigo-500 group-hover:scale-110 transition-transform">
                      <link.icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{link.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboardPage;
