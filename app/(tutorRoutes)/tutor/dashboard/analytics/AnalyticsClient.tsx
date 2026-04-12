'use client';

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  Target,
  Rocket
} from 'lucide-react';

const COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
const STATUS_COLORS: any = {
  'COMPLETED': '#10b981',
  'CONFIRMED': '#4f46e5',
  'PENDING': '#f59e0b',
  'CANCELLED': '#ef4444',
  'ONGOING': '#8b5cf6'
};

export default function AnalyticsClient({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Premium Header */}
      <div className="relative p-10 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full w-fit">
              <ShieldCheck size={14} className="text-amber-400 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Verified Authority Insights</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight font-outfit">
              Advanced Performance <br/> Masterclass
            </h2>
            <p className="text-indigo-100/80 text-lg font-medium">
              You are currently utilizing structural data intelligence. Monitor your teaching trajectory with high-precision metrics.
            </p>
          </div>
          <div className="hidden lg:flex w-40 h-40 items-center justify-center bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl">
            <Rocket size={64} className="text-white/40" />
          </div>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<DollarSign size={20} />} 
          label="Total Potential Revenue" 
          value={`$${data.overview.totalRevenue.toLocaleString()}`} 
          color="indigo" 
        />
        <StatCard 
          icon={<Target size={20} />} 
          label="Conversion Integrity" 
          value={`${data.overview.averageRating}/5.0`} 
          color="purple" 
        />
        <StatCard 
          icon={<Users size={20} />} 
          label="Knowledge Transfer Counts" 
          value={data.overview.totalSessions.toLocaleString()} 
          color="emerald" 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subject Mastery Pie */}
        <div className="bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 font-outfit">
              <BarChart3 className="text-indigo-600" size={20} />
              Teaching Vertical Split
            </h3>
            <p className="text-sm text-gray-500 font-medium">Distribution of demand across your specialized subjects</p>
          </div>
          
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.subjects}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="sessions"
                >
                  {data.subjects.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Retention Donut */}
        <div className="bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 font-outfit">
              <Users className="text-purple-600" size={20} />
              Educational Retention
            </h3>
            <p className="text-sm text-gray-500 font-medium">Comparison of New Learners vs. Recurring Academic Relationships</p>
          </div>

          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.retention}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#4f46e5" stroke="transparent" />
                  <Cell fill="#f1f5f9" stroke="transparent" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Status Bar */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
           <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 font-outfit">
              <TrendingUp className="text-emerald-500" size={20} />
              Operational Lifecycle
            </h3>
            <p className="text-sm text-gray-500 font-medium">Aggregated status of all teaching interventions</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sessionStatus}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                  {data.sessionStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-200/50",
    purple: "bg-purple-500/10 text-purple-600 border-purple-200/50",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-8 rounded-4xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all hover:shadow-md">
      <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center mb-6 border`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
    </div>
  );
}
