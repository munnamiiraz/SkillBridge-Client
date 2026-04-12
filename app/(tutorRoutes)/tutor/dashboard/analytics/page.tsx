'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  PieChart as PieIcon,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { getTutorAnalytics, TutorAnalytics } from '@/app/services/tutor-stats.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

export default function VerifiedTutorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<TutorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && (session.user as any).role !== 'VERIFIED_TUTOR') {
        router.push('/tutor/dashboard');
        return;
    }

    const fetchAnalytics = async () => {
      const { data, error } = await getTutorAnalytics();
      if (data) setAnalytics(data);
      setLoading(false);
    };
    fetchAnalytics();
  }, [session, router]);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <Skeleton className="h-64 rounded-[3rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Skeleton className="h-[400px] rounded-[2.5rem]" />
           <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!analytics) return (
     <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-6 bg-red-50 dark:bg-red-500/10 rounded-full text-red-500">
           <BarChart3 size={48} />
        </div>
        <p className="font-black text-gray-500 uppercase tracking-widest text-xs">Failed to load advanced analytics engine</p>
     </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Header with Verified Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <div className="flex items-center gap-3 mb-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
              <ShieldCheck className="text-indigo-600 dark:text-indigo-400 fill-current" size={14} />
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-[0.2em]">Verified Authority Suite</span>
           </div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1">Advanced Business Intelligence</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight max-w-2xl">
             Granular performance forensics and earnings velocity analysis reserved for premium Verified Tutors.
           </p>
        </div>
        <div className="flex items-center gap-6 bg-white dark:bg-gray-950 p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
           <div className="text-right">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                <TrendingUp size={10} />
                Peak Performance
              </p>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">SUCCESS ORIENTED</p>
           </div>
           <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <Sparkles size={24} className="animate-spin-slow" />
           </div>
        </div>
      </div>

      {/* Revenue Velocity Card */}
      <Card className="rounded-[3.5rem] border-none shadow-2xl bg-indigo-900 dark:bg-indigo-950 overflow-hidden relative group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
         <CardContent className="p-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
               <div className="lg:w-1/3 space-y-10">
                  <div>
                     <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase leading-none">Earnings Velocity</h3>
                     <p className="text-indigo-200/70 text-sm font-medium leading-relaxed">System-wide earnings trajectory over the last 6 months. This reflects your monetary authority on the platform.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="p-8 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
                        <div>
                           <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Platform Revenue</p>
                           <p className="text-4xl font-black text-white tracking-tighter">${analytics.overview.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl">
                           <DollarSign size={24} className="text-emerald-400" />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex-1 h-[400px] w-full bg-black/20 rounded-[3rem] p-10 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={analytics.earningsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#818cf8', fontSize: 11, fontWeight: 900 }}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.85)', 
                            borderRadius: '24px', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(12px)',
                            padding: '15px'
                          }}
                          itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '14px' }}
                          labelStyle={{ color: '#818cf8', marginBottom: '4px', fontWeight: 'bold' }}
                          formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#818cf8" 
                          strokeWidth={5}
                          fillOpacity={1} 
                          fill="url(#earningsGradient)" 
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Student Loyalty (Retention) */}
         <Card className="rounded-[3rem] p-10 shadow-2xl border-none bg-white dark:bg-gray-950 overflow-hidden group">
            <CardHeader className="px-0 pt-0">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                        <Users size={24} />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Student Loyalty</CardTitle>
                        <CardDescription>Retention metrics and student acquisition</CardDescription>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black text-indigo-600 tracking-tighter">
                        {Math.round((analytics.retention.find(r => r.name === 'Returning Students')?.value || 0) / (analytics.retention.reduce((a,b) => a+b.value, 0) || 1) * 100)}%
                     </p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Loyalty Index</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
               <div className="h-[320px] w-full flex items-center">
                  <ResponsiveContainer width="55%" height="100%">
                     <PieChart>
                        <Pie
                           data={analytics.retention}
                           innerRadius={80}
                           outerRadius={110}
                           paddingAngle={10}
                           dataKey="value"
                        >
                           {analytics.retention.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="w-[45%] space-y-6">
                     {analytics.retention.map((item, i) => (
                        <div key={item.name} className="space-y-2">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                 <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{item.name}</span>
                              </div>
                              <span className="text-sm font-black text-gray-900 dark:text-white">{item.value}</span>
                           </div>
                           <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${Math.round((item.value / analytics.retention.reduce((a,b) => a+b.value, 0)) * 100)}%`, 
                                  backgroundColor: COLORS[i % COLORS.length] 
                                }} 
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Subject Yield */}
         <Card className="rounded-[3rem] p-10 shadow-2xl border-none bg-white dark:bg-gray-950 overflow-hidden relative">
            <CardHeader className="px-0 pt-0">
               <div className="flex items-center gap-4 mb-2">
                  <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl">
                     <Briefcase size={24} />
                  </div>
                  <div>
                     <CardTitle className="text-xl font-black uppercase tracking-tighter">Market Penetration</CardTitle>
                     <CardDescription>Subject-level revenue and session yield</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
               <div className="h-[320px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={analytics.subjects} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
                          width={80}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                          dataKey="sessions" 
                          fill="#818cf8" 
                          radius={[0, 10, 10, 0]} 
                          barSize={20} 
                        />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Strategic Insight Table */}
      <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-gray-950 p-12 overflow-hidden">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-6">
               <div className="flex items-center gap-3">
                   <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                      <TrendingUp size={20} />
                   </div>
                  <h4 className="text-lg font-black uppercase tracking-tighter">Market Position Insight</h4>
               </div>
               <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                 Your retention rate of <span className="text-indigo-600 font-bold">{Math.round((analytics.retention.find(r => r.name === 'Returning Students')?.value || 0) / (analytics.retention.reduce((a,b) => a+b.value, 0) || 1) * 100)}%</span> suggests strong pedagogical consistency. 
                 To maximize earnings, consider re-orienting your availability toward your highest yielding subject: 
                 <span className="text-gray-900 dark:text-white font-black"> {analytics.subjects.sort((a,b) => b.revenue - a.revenue)[0]?.name || 'primary subject'}</span>.
               </p>
               <Link 
                 href="/tutor/dashboard/availability"
                 className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group"
               >
                 Optimize Calendar
                 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               <InsightGridItem label="Avg Rating" value={analytics.overview.averageRating.toFixed(1)} icon={<Award className="text-amber-500" />} />
               <InsightGridItem label="Sessions" value={analytics.overview.totalSessions.toString()} icon={<Calendar className="text-indigo-500" />} />
               <InsightGridItem label="Market Rank" value="TOP 5%" icon={<ShieldCheck className="text-emerald-500" />} />
               <InsightGridItem label="Velocity" value="+12%" icon={<TrendingUp className="text-purple-500" />} />
            </div>
         </div>
      </Card>
    </div>
  );
}

function InsightGridItem({ label, value, icon }: any) {
  return (
    <div className="p-8 rounded-4xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all text-center">
       <div className="flex justify-center mb-4">{icon}</div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
    </div>
  )
}
