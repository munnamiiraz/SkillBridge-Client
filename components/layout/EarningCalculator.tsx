"use client";

import React, { useState } from 'react';
import { BadgeDollarSign, TrendingUp, Calendar, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const EarningCalculator: React.FC = () => {
  const [hours, setHours] = useState(15);
  const [rate, setRate] = useState(40);

  const monthlyEarnings = Math.round(hours * rate * 4.33);
  const yearlyEarnings = Math.round(monthlyEarnings * 12);

  return (
    <section className="relative w-full py-24 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-800">
                <BadgeDollarSign className="w-4 h-4" />
                Teach & Earn
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                Turn Your Expertise <br />
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">
                  into Significant Income.
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join a global network of elite educators. Set your own schedule, define your own rates, and share your passion with students worldwide.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <Calendar className="w-5 h-5" />, title: "Full Flexibility", desc: "Choose when you work." },
                { icon: <Zap className="w-5 h-5" />, title: "Steady Demand", desc: "Constant stream of students." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/register?role=TUTOR"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              Apply to Teach
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Calculator Visual Side */}
          <div className="relative">
            <div className="relative bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden group">
              {/* Internal Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -mr-16 -mt-16" />
              
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    Income Calculator
                  </h3>
                  <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-xs font-black rounded-full">ESTIMATED</div>
                </div>

                {/* Hours Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Hours per week</label>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{hours} hrs</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    value={hours} 
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Rate Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Your Hourly Rate</label>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">${rate}/hr</span>
                  </div>
                  <input 
                    type="range" 
                    min="15" 
                    max="150" 
                    step="5"
                    value={rate} 
                    onChange={(e) => setRate(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Results Visual */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-500 mb-1">Monthly</div>
                    <div className="text-3xl font-black text-indigo-800 dark:text-indigo-300">
                      ${monthlyEarnings.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 text-center">
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Yearly Plan</div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                      ${yearlyEarnings.toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">
                  *Based on average tutor performance and 4.33 weeks per month.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EarningCalculator;
