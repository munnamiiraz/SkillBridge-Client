'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Globe,
  Zap
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
import { adminService, DashboardStats } from '@/app/services/admin.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function PlatformAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user.role !== 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
        return;
    }

    const fetchStats = async () => {
      const data = await adminService.getStats();
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, [session, router]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-64 rounded-[3rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Skeleton className="h-[450px] rounded-3xl" />
           <Skeleton className="h-[450px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!stats) return <div>Failed to load deep analytics.</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
              <ShieldAlert className="text-amber-500" size={14} />
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em]">Super Admin Exclusive View</span>
           </div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-1">Structural Intelligence</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Financial forensics and platform growth trajectory analysis</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Integrity</p>
              <p className="text-xl font-black text-indigo-600">Stable (99.9%)</p>
           </div>
           <Award className="text-indigo-600 animate-bounce" size={40} />
        </div>
      </div>

      {/* Financial Growth Section */}
      <Card className="rounded-[3rem] border-none shadow-2xl bg-indigo-900 dark:bg-indigo-950 overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
         <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
         <CardContent className="p-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
               <div className="lg:w-1/3 space-y-8">
                  <div>
                     <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">Revenue Influx</h3>
                     <p className="text-indigo-200/70 text-sm font-medium leading-relaxed">System-wide earnings based on fulfilled pedagogical slots. This reflects the platform's ability to monetize educational demand.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">YTD Earnings</p>
                        <p className="text-2xl font-black text-white tracking-tight">${stats.overview.totalRevenue.toLocaleString()}</p>
                     </div>
                     <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Avg Session</p>
                        <p className="text-2xl font-black text-white tracking-tight">$42.50</p>
                     </div>
                  </div>
               </div>
               <div className="flex-1 h-[350px] w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-sm">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={stats.charts.revenueGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="revenueGrowthColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
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
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            borderRadius: '24px', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropBlur: '10px'
                          }}
                          itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                          labelStyle={{ color: '#818cf8' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#818cf8" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#revenueGrowthColor)" 
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Booking Operations */}
         <Card className="rounded-[3rem] p-4 shadow-xl border-gray-100 dark:border-gray-800">
            <CardHeader>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                     <Zap size={20} />
                  </div>
                  <div>
                     <CardTitle className="text-lg">Operational Fidelity</CardTitle>
                     <CardDescription>Booking status distribution across platform</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="h-[300px] w-full mt-4 flex">
                  <ResponsiveContainer width="60%" height="100%">
                     <PieChart>
                        <Pie
                           data={stats.charts.bookingDistribution}
                           cx="50%"
                           cy="50%"
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {stats.charts.bookingDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="w-[40%] flex flex-col justify-center space-y-4 pr-4">
                      {stats.charts.bookingDistribution.map((item, i) => (
                         <div key={item.name} className="flex flex-col">
                            <div className="flex items-center justify-between group cursor-default">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter group-hover:text-gray-900 transition-colors">{item.name}</span>
                               </div>
                               <span className="text-xs font-black text-gray-900 dark:text-white">{item.value}</span>
                            </div>
                            <div className="w-full bg-gray-50 dark:bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                               <div 
                                 className="h-full rounded-full transition-all duration-1000" 
                                 style={{ width: `${Math.round((item.value / stats.overview.totalBookings) * 100)}%`, backgroundColor: COLORS[i % COLORS.length] }}
                               />
                            </div>
                         </div>
                      ))}
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Platform Integrity Card */}
         <Card className="rounded-[3rem] p-4 shadow-xl border-gray-100 dark:border-gray-800 bg-linear-to-br from-white to-indigo-50/20">
            <CardHeader>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                     <TrendingUp size={20} />
                  </div>
                  <div>
                     <CardTitle className="text-lg">KPI Forecast</CardTitle>
                     <CardDescription>Predicted platform performance indices</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <PredictiveKpi icon={<Globe size={18} />} title="Global Reach" value="24 Countries" trend="+3 New" />
                <PredictiveKpi icon={<Activity size={18} />} title="System Latency" value="128ms Avg" trend="-12ms" />
                <PredictiveKpi icon={<DollarSign size={18} />} title="Conversion" value="3.4%" trend="+0.2%" />
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function PredictiveKpi({ icon, title, value, trend }: any) {
   return (
      <div className="p-6 rounded-[2rem] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/5 text-indigo-500 group-hover:scale-110 transition-transform duration-500 border border-indigo-500/5">
                {icon}
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
               <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-tighter inline-flex items-center gap-1">
               <ArrowUpRight size={10} />
               {trend}
            </p>
         </div>
      </div>
   )
}
