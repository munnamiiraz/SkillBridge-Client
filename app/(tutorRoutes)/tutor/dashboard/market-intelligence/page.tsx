'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Activity, 
  DollarSign, 
  Users, 
  Clock, 
  Search,
  Zap,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { getMarketIntelligence } from '@/app/services/tutor-stats.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];

export default function MarketIntelligencePage() {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user.role !== 'VERIFIED_TUTOR') {
        router.push('/tutor/dashboard');
        return;
    }

    const fetchIntel = async () => {
      const { data, error } = await getMarketIntelligence();
      if (data) setIntel(data);
      setLoading(false);
    };
    fetchIntel();
  }, [session, router]);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-40 rounded-[2rem]" />
           <Skeleton className="h-40 rounded-[2rem]" />
           <Skeleton className="h-40 rounded-[2rem]" />
        </div>
        <Skeleton className="h-[500px] rounded-[3rem]" />
      </div>
    );
  }

  if (!intel) return (
     <div className="text-center py-20">
        <p className="text-gray-500 font-bold">Failed to load market forensics.</p>
     </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
           <div className="flex items-center gap-3 mb-1 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
              <Globe className="text-indigo-600 dark:text-indigo-400 animate-pulse" size={14} />
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-[0.2em]">Global Platform Forensics</span>
           </div>
           <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2 leading-none">Market Intelligence</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight max-w-2xl">
              Platform-wide strategic data providing Verified Tutors with a competitive edge in pricing and subject demand.
           </p>
        </div>
        <div className="flex items-center gap-4 p-5 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-600/30">
           <div className="p-3 bg-white/10 rounded-xl">
              <Target size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Global Status</p>
              <p className="text-xl font-black tracking-tight">STRATEGIC LEAD</p>
           </div>
        </div>
      </div>

      {/* Snapshot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <IntelligenceSnapCard 
           label="Market Demand" 
           value="HIGH" 
           sub="Across 8 subjects" 
           icon={<Zap className="text-amber-500" />} 
           trend="+15.4%" 
         />
         <IntelligenceSnapCard 
           label="Global Avg Rate" 
           value={`$${Math.round(intel.pricing.avg)}/hr`} 
           sub="In your niche" 
           icon={<DollarSign className="text-emerald-500" />} 
         />
         <IntelligenceSnapCard 
           label="Competitive Edge" 
           value="TOP 10%" 
           sub="Priority search" 
           icon={<ShieldCheck className="text-indigo-500" />} 
         />
      </div>

      {/* Demand Radar & Competitive Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Demand Radar */}
         <Card className="rounded-[3.5rem] p-10 shadow-2xl border-none bg-white dark:bg-gray-950 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
            <CardHeader className="px-0 pt-0 mb-8">
               <div className="flex items-center gap-4 mb-2">
                  <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                     <TrendingUp size={24} />
                  </div>
                  <div>
                     <CardTitle className="text-xl font-black uppercase tracking-tighter leading-none">Demand Radar</CardTitle>
                     <CardDescription>Subject popularity across the platform</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={intel.demandRadar}>
                        <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#6b7280', fontSize: 10, fontWeight: '900' }} 
                        />
                        <PolarRadiusAxis hide />
                        <Radar
                           name="Demand"
                           dataKey="demand"
                           stroke="#6366f1"
                           strokeWidth={4}
                           fill="#6366f1"
                           fillOpacity={0.15}
                        />
                        <Tooltip />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         {/* Pricing Index */}
         <Card className="rounded-[3.5rem] p-10 shadow-2xl border-none bg-indigo-600 text-white overflow-hidden relative group">
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/30 rounded-full blur-[120px] pointer-events-none" />
            <CardHeader className="px-0 pt-0 mb-4 relative z-10">
               <div className="flex items-center gap-4 mb-2">
                  <div className="p-4 bg-white/10 text-white rounded-2xl">
                     <DollarSign size={24} />
                  </div>
                  <div>
                     <CardTitle className="text-xl font-black uppercase tracking-tighter leading-none">Pricing Benchmark</CardTitle>
                     <CardDescription className="text-indigo-100/70">Your rate vs market distribution</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 relative z-10">
               <div className="space-y-12 mt-10">
                  <div className="relative pt-10 px-4">
                     <div className="h-3 w-full bg-white/10 rounded-full relative">
                        {/* Current Marker */}
                        <div 
                           className="absolute top-1/2 -translate-y-1/2 -mt-10 flex flex-col items-center group/marker transition-all duration-1000"
                           style={{ left: `${Math.min(100, (intel.pricing.current / intel.pricing.max) * 100)}%` }}
                        >
                           <span className="text-[10px] font-black uppercase mb-1 whitespace-nowrap bg-white text-indigo-600 px-3 py-1 rounded-full shadow-xl">FOR YOU: ${intel.pricing.current}</span>
                           <div className="w-5 h-5 rounded-full bg-white border-4 border-indigo-400 shadow-xl" />
                        </div>
                        {/* Avg Marker */}
                        <div 
                           className="absolute top-1/2 -translate-y-1/2 mt-4 flex flex-col items-center opacity-70"
                           style={{ left: `${Math.min(100, (intel.pricing.avg / intel.pricing.max) * 100)}%` }}
                        >
                           <div className="w-1 h-6 bg-white/40" />
                           <span className="text-[9px] font-black uppercase mt-1 whitespace-nowrap">Market Avg: ${Math.round(intel.pricing.avg)}</span>
                        </div>
                        {/* Range Filling */}
                        <div 
                          className="h-full bg-linear-to-r from-emerald-400 to-amber-400 rounded-full opacity-40 transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (intel.pricing.current / intel.pricing.max) * 100)}%` }}
                        />
                     </div>
                     <div className="flex justify-between mt-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">${intel.pricing.min} Low</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">${intel.pricing.max} Peak</span>
                     </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-black/10 border border-white/5 backdrop-blur-md">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                           <BarChart3 size={18} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest">Market Status</p>
                     </div>
                     <p className="text-sm font-medium leading-relaxed text-indigo-50/80">
                        {intel.pricing.current > intel.pricing.avg 
                           ? "Your premium pricing reflects high status. Ensure your profile headline highlights verified credentials to justify the index."
                           : "Your rate is highly competitive. This increases your booking probability but may under-represent your verified authority."}
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Peak Activity Heatmap */}
      <Card className="rounded-[4rem] p-12 shadow-2xl border-none bg-white dark:bg-gray-950 overflow-hidden group">
         <CardHeader className="px-0 pt-0 mb-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="p-5 bg-amber-500/10 text-amber-500 rounded-3xl group-hover:rotate-12 transition-transform duration-500">
                     <Clock size={28} />
                  </div>
                  <div>
                     <CardTitle className="text-2xl font-black uppercase tracking-tighter">Peak Booking Forensics</CardTitle>
                     <CardDescription>Hourly distribution of student activity (Last 30 days)</CardDescription>
                  </div>
               </div>
            </div>
         </CardHeader>
         <CardContent className="px-0 pb-0">
            <div className="h-[300px] w-full mt-6">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={intel.peakActivity} margin={{ left: -20 }}>
                     <defs>
                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis 
                       dataKey="hour" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }} 
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', background: 'rgba(0,0,0,0.85)', color: '#fff' }}
                        cursor={{ stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 5' }}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="count" 
                       stroke="#f59e0b" 
                       strokeWidth={4} 
                       fillOpacity={1} 
                       fill="url(#activityGradient)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                     <Search size={20} />
                  </div>
                  <div>
                     <p className="font-black text-sm uppercase tracking-tight mb-1 text-gray-900 dark:text-white">Gold Opportunity</p>
                     <p className="text-xs font-medium text-gray-500 leading-relaxed">Most bookings occur between <span className="text-indigo-600 font-black">16:00 - 21:00</span>. Increasing availability during this window correlates with a 40% higher session yield.</p>
                  </div>
               </div>
               <div className="flex justify-end">
                  <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl group">
                     Optimize My Calendar
                     <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

function IntelligenceSnapCard({ label, value, sub, icon, trend }: any) {
  return (
    <Card className="rounded-[2.5rem] p-8 bg-white dark:bg-gray-950 border-none shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-120 transition-transform duration-500">
          {icon}
       </div>
       <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{label}</p>
             <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-1 uppercase">{value}</p>
             <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-tight">{sub}</p>
          </div>
          {trend && (
             <div className="mt-6 flex items-center gap-2 text-emerald-500">
                <div className="p-1 px-2 rounded-lg bg-emerald-500/10 text-[10px] font-black tracking-widest">{trend}</div>
                <span className="text-[9px] font-black uppercase tracking-widest">Global Trend</span>
             </div>
          )}
       </div>
    </Card>
  )
}
