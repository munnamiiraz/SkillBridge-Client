'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Target, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Activity,
  Award,
  Globe,
  PieChart as PieIcon,
  BarChart3
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
  Bar
} from 'recharts';
import { adminService, DashboardStats } from '@/app/services/admin.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

const COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await adminService.getStats();
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Skeleton className="lg:col-span-2 h-[450px] rounded-3xl" />
             <Skeleton className="h-[450px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-10 text-center font-bold text-red-500">Failed to load platform analytics.</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-outfit">Platform Intelligence</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Real-time oversight of SkillBridge ecosystem performance</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all active:scale-95">
             Download Report
           </button>
           <button className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all active:scale-95">
             Export CSV
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Community" 
          value={stats.overview.totalUsers.toLocaleString()} 
          icon={<Users size={18} />} 
          trend="+12% from last month"
          trendUp={true}
          color="indigo"
        />
        <KpiCard 
          title="Gross Revenue" 
          value={`$${stats.overview.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={18} />} 
          trend="+8.4% growth"
          trendUp={true}
          color="emerald"
        />
        <KpiCard 
          title="Fulfilled Bookings" 
          value={stats.overview.totalBookings.toLocaleString()} 
          icon={<Target size={18} />} 
          trend="-2.1% decrease"
          trendUp={false}
          color="purple"
        />
        <KpiCard 
          title="Platform Success" 
          value={`${stats.overview.successRate}%`} 
          icon={<Activity size={18} />} 
          trend="Requirement Met"
          trendUp={true}
          color="amber"
        />
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                 <BarChart3 className="text-indigo-600" size={20} />
                 User Onboarding Growth
               </h3>
               <p className="text-sm text-gray-500 font-medium">Monthly registration trends for the last 6 months</p>
             </div>
             <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[10px] font-bold uppercase text-gray-500 px-3 py-1.5 focus:ring-0">
                <option>Monthly View</option>
                <option>Weekly View</option>
             </select>
           </div>
           
           <div className="h-[350px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.charts.userGrowth} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                 <XAxis 
                   dataKey="month" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                   dy={15}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                 />
                 <Tooltip 
                   cursor={{ fill: '#f1f5f9' }}
                   contentStyle={{ 
                     backgroundColor: '#ffffff', 
                     borderRadius: '24px', 
                     border: 'none', 
                     boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                     padding: '20px'
                   }}
                   itemStyle={{ color: '#4f46e5', fontWeight: '900', fontSize: '14px' }}
                   labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}
                 />
                 <Bar 
                   dataKey="count" 
                   fill="#4f46e5" 
                   radius={[8, 8, 0, 0]} 
                   barSize={40}
                   animationDuration={2000}
                 />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Role Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
           <div className="mb-8">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
               <PieIcon className="text-purple-600" size={20} />
               Community Split
             </h3>
             <p className="text-sm text-gray-500 font-medium">Distribution of platform stakeholders</p>
           </div>

            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {stats.charts.roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

           <div className="mt-6 space-y-3">
             {stats.charts.roleDistribution.map((role, i) => (
                <div key={role.name} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-100 transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{role.name}</span>
                   </div>
                   <span className="text-xs font-bold text-gray-900 dark:text-white">{role.value} Users</span>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Secondary Row: Revenue and Dynamic Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Signups</h3>
                <button className="text-xs font-bold text-indigo-600 hover:underline">View All Users</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                         <th className="pb-4 text-left text-[10px] font-bold uppercase text-gray-400 tracking-widest">User</th>
                         <th className="pb-4 text-left text-[10px] font-bold uppercase text-gray-400 tracking-widest">Status</th>
                         <th className="pb-4 text-right text-[10px] font-bold uppercase text-gray-400 tracking-widest">Joined</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {[1,2,3,4,5].map((u) => (
                        <tr key={u} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                           <td className="py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 font-bold text-white flex items-center justify-center text-xs">
                                    A
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">Sample User {u}</p>
                                    <p className="text-[10px] text-gray-400 font-medium tracking-tight">user_{u}@example.com</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4">
                              <span className="px-2 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase border border-green-100 dark:border-green-500/20">Active</span>
                           </td>
                           <td className="py-4 text-right">
                              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Apr 10, 2026</p>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Revenue Bar Chart */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
             <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <ArrowUpRight className="text-emerald-500" size={20} />
                  Revenue Influx
                </h3>
                <p className="text-sm text-gray-500 font-medium">Completed session earnings analysis</p>
             </div>
             <div className="h-[250px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.revenueGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                       <XAxis 
                         dataKey="month" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                         dy={10}
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                       />
                       <Tooltip 
                         cursor={{ fill: '#f1f5f9' }}
                         contentStyle={{ 
                           backgroundColor: '#ffffff', 
                           borderRadius: '16px', 
                           border: 'none', 
                           boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                         }}
                       />
                       <Bar 
                         dataKey="amount" 
                         fill="#10b981" 
                         radius={[6, 6, 0, 0]} 
                         barSize={32}
                       />
                    </BarChart>
                 </ResponsiveContainer>
             </div>
          </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend, trendUp, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-500/5 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-500/5 text-emerald-600 border-emerald-100",
    purple: "bg-purple-500/5 text-purple-600 border-purple-100",
    amber: "bg-amber-500/5 text-amber-600 border-amber-100",
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full blur-3xl opacity-20 ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'}`}></div>

      <div className="relative flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]} transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-lg ${trendUp ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
          {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </div>
      </div>
      
      <div className="relative">
        <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
