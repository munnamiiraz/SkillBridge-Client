"use client";

import React from 'react';
import { Sparkles, Brain, Monitor, Globe, BarChart, Mic2, Palette, Terminal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const TrendingDisciplines: React.FC = () => {
  const disciplines = [
    { 
      name: "AI Engineering", 
      icon: <Brain className="w-6 h-6" />, 
      color: "blue", 
      growth: "+145%", 
      tutors: "128 Active",
      desc: "LLMs, PyTorch, Neural Networks"
    },
    { 
      name: "IELTS Mastery", 
      icon: <Globe className="w-6 h-6" />, 
      color: "indigo", 
      growth: "+82%", 
      tutors: "340 Active",
      desc: "Speaking, Writing, Academic Prep"
    },
    { 
      name: "UI/UX Design", 
      icon: <Palette className="w-6 h-6" />, 
      color: "pink", 
      growth: "+65%", 
      tutors: "215 Active",
      desc: "Figma, Design Systems, Prototypes"
    },
    { 
      name: "Digital Marketing", 
      icon: <BarChart className="w-6 h-6" />, 
      color: "emerald", 
      growth: "+95%", 
      tutors: "189 Active",
      desc: "SEO, Meta Ads, Growth Hacking"
    },
    { 
      name: "Full-Stack Dev", 
      icon: <Terminal className="w-6 h-6" />, 
      color: "orange", 
      growth: "+110%", 
      tutors: "420 Active",
      desc: "Next.js, Node.js, Prisma"
    },
    { 
      name: "Public Speaking", 
      icon: <Mic2 className="w-6 h-6" />, 
      color: "purple", 
      growth: "+40%", 
      tutors: "95 Active",
      desc: "Confidence, Storytelling, Pitching"
    }
  ];

  return (
    <section className="relative w-full py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-black rounded-full border border-orange-100 dark:border-orange-800 tracking-tighter uppercase">
              <Sparkles className="w-3 h-3" />
              Hot Right Now
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Trending <br />
              <span className="italic bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Disciplines.</span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm mb-2">
            Stay ahead of the curve with our most in-demand subjects this month.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map((item, i) => (
            <Link 
              key={i} 
              href={`/tutors?query=${encodeURIComponent(item.name)}`}
              className="group relative p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 block overflow-hidden"
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
                  <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
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
          <Link href="/tutors" className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2 group">
            Explore All 50+ Disciplines
            <div className="w-6 h-px bg-gray-300 dark:bg-gray-700 group-hover:w-12 group-hover:bg-orange-500 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingDisciplines;
