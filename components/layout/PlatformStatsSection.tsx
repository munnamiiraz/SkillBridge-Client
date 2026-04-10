"use client";

import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getPlatformStats, PlatformStats } from '@/app/services/public-stats.service';
import { Users, GraduationCap, CheckCircle } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

const PlatformStatsSection: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getPlatformStats();
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-3xl" />
                ))}
              </div>
            </div>
            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
          </div>
        </div>
      </section>
    );
  }

  const statCards = [
    { 
      label: 'Expert Tutors', 
      value: stats?.totalTutors || 0, 
      icon: <CheckCircle className="w-6 h-6 text-indigo-600" />,
      color: 'indigo' 
    },
    { 
      label: 'Active Students', 
      value: stats?.totalStudents || 0, 
      icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
      color: 'purple' 
    },
    { 
      label: 'Sessions Completed', 
      value: stats?.totalSessions || 0, 
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      color: 'emerald' 
    },
  ];

  return (
    <section className="relative w-full py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Empowering Minds, <br />
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">
                  One Session at a Time.
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join our rapidly growing community of passionate educators and ambitious learners. 
                Our platform momentum is driven by quality and real-world results.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {statCards.map((card, i) => (
                <div key={i} className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group">
                  <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {card.icon}
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {card.value}
                    <span className="text-indigo-600">+</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-tr from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-2xl" />
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Monthly Growth
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Activity</span>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.growth || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111827', 
                        borderRadius: '12px', 
                        border: 'none', 
                        color: '#fff' 
                      }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#4f46e5" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PlatformStatsSection;
