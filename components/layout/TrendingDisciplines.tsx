"use client";

import React from 'react';
import { Sparkles, Brain, Monitor, Globe, BarChart, Mic2, Palette, Terminal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const TrendingDisciplines: React.FC = () => {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/categories`);
        const result = await res.json();
        if (result.success) {
          // Map to match the UI structure
          const mapped = result.data.map((cat: any, i: number) => ({
            name: cat.name,
            icon: cat.name === 'Mathematics' ? <BarChart className="w-6 h-6" /> : 
                  cat.name === 'Science' ? <Brain className="w-6 h-6" /> :
                  cat.name === 'Programming' ? <Terminal className="w-6 h-6" /> :
                  cat.name === 'Business' ? <Globe className="w-6 h-6" /> : <Monitor className="w-6 h-6" />,
            color: cat.name === 'Mathematics' ? 'blue' : 
                   cat.name === 'Science' ? 'indigo' :
                   cat.name === 'Programming' ? 'pink' :
                   cat.name === 'Business' ? 'emerald' : 'orange',
            growth: i % 2 === 0 ? '+145%' : '+82%', // Mock growth for flair
            tutors: `${cat.subject?.reduce((acc: number, s: any) => acc + (s._count?.tutor_subject || 0), 0) || 0} Tutors`,
            desc: cat.subject?.slice(0, 3).map((s: any) => s.name).join(', ') || 'Various subjects'
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.error('Error fetching trending disciplines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] animate-pulse" />)}
      </div>
    );
  }

  return (
    <section className="relative w-full py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-full border border-indigo-100 dark:border-indigo-800 tracking-tighter uppercase">
              <Sparkles className="w-3 h-3" />
              Hot Right Now
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Trending <br />
              <span className="italic bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Disciplines.</span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm mb-2">
            Stay ahead of the curve with our most in-demand subjects this month.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((item, i) => (
            <Link 
              key={i} 
              href={`/tutors?category=${encodeURIComponent(item.name)}`}
              className="group relative p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 block overflow-hidden"
            >
              {/* Card Aura */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-500 opacity-[0.03] group-hover:opacity-[0.08] rounded-full -mr-12 -mt-12 transition-opacity`} />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-black italic">
                      <ArrowUpRight className="w-3 h-3" />
                      {item.growth}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate max-w-[80px]">Trending</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">{item.tutors}</span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-gray-900 dark:text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Explorer CTA */}
        <div className="mt-12 text-center">
          <Link href="/tutors" className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 group">
            Explore All Disciplines
            <div className="w-6 h-px bg-gray-300 dark:bg-gray-700 group-hover:w-12 group-hover:bg-indigo-500 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingDisciplines;
