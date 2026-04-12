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
    <section className="relative w-full py-32 lg:py-48 bg-white dark:bg-gray-950 overflow-hidden border-y border-gray-100 dark:border-gray-800/50">
      {/* Editorial Decorative Background */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] bg-indigo-50/50 dark:bg-indigo-950/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[600px] h-[600px] bg-purple-50/50 dark:bg-purple-950/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Brand Storytelling & Metrics (Span 7) */}
          <div className="lg:col-span-7 space-y-12 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Proven Impact
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                Empowering Minds, <br />
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-black tracking-tight">
                  One Session at a Time.
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed font-medium">
                We believe in the power of human connection to unlock potential. 
                Our platform isn't just about bookings—it's about building bridges to academic excellence.
              </p>
            </div>

            {/* Structured Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {statCards.map((card, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -inset-2 bg-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-gray-700/50 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3">
                      {card.icon}
                    </div>
                    <div>
                      <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {card.value}<span className="text-indigo-600 text-2xl">+</span>
                      </div>
                      <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                        {card.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-8">
               <button className="px-10 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-2xl hover:bg-gray-50 active:scale-95 transition-all duration-300 border border-gray-100 shrink-0">
                  Join the Community
               </button>
                  <div className="flex -space-x-4">
                    {[
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                    ].map((src, i) => (
                      <div key={i} className="w-11 h-11 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 overflow-hidden shadow-lg transition-transform hover:translate-y-[-4px] hover:z-30 cursor-pointer">
                        <img src={src} alt="Mentor Avatar" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white">12k+</span> Mentors
                  </div>
               </div>
            </div>

          {/* Right Column: Hero Social Proof (Span 5) */}
          <div className="lg:col-span-5 relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-10 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Success Spotlight Editorial Card */}
            <div className="relative bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
              <div className="aspect-[4/5] w-full relative">
                <img 
                  src="/student_success_story.png" 
                  alt="Student Success Story" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent" />
                
                {/* Confidence Badge */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Student Success Story</span>
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-indigo-600/90 backdrop-blur-md rounded-full border border-indigo-400/50 shadow-xl">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white">Verified Excellence</span>
                    </div>
                </div>

                {/* Testimonial Overlay */}
                <div className="absolute bottom-8 inset-x-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-white leading-tight tracking-tight">
                      "SkillBridge mentored me to excellence. From a C to an A+ in three months."
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white font-black overflow-hidden relative group/avatar">
                         <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 opacity-20" />
                         SM
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">Sarah Mitchell</div>
                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Physics Student</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-right">
                      <div className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Mentor</div>
                      <div className="text-xs font-bold text-white">Dr. Aris Thorne</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Momentum Pill - Adjusted position to prevent overlap */}
            <div className="absolute -left-16 bottom-20 p-6 bg-gray-900 dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-800 transform -rotate-6 group-hover:rotate-0 transition-transform duration-700 hidden xl:block z-30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-black text-white italic">98%</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
      `}</style>
    </section>
  );
};

export default PlatformStatsSection;
