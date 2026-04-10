"use client";

import React, { useState, useEffect } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight, Award, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const SuccessStoriesSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const stories = [
    {
      student: "Aria Montgomery",
      achievement: "Score: 8.5/9.0 IELTS",
      quote: "The personalized coaching for my IELTS Speaking section was a game-changer. I went from a 6.5 to an 8.5 in just 4 weeks!",
      tutor: "Dr. Elena Rossi",
      tutorId: "elena-rossi",
      image: "🎓"
    },
    {
      student: "David Chen",
      achievement: "Landed Lead SWE Role",
      quote: "My mentor helped me navigate the complex System Design interviews at Top Tier tech firms. I couldn't have done it without the mock sessions.",
      tutor: "Marcus Thorne",
      tutorId: "marcus-thorne",
      image: "💻"
    },
    {
      student: "Sophia Patel",
      achievement: "AWS Solutions Architect Certified",
      quote: "Sarah broken down the most complex VPC and Security concepts into simple, visual mental models. Passed the exam with 92%!",
      tutor: "Sarah Williams",
      tutorId: "sarah-williams",
      image: "📱"
    }
  ];

  const next = () => setCurrent((prev) => (prev + 1) % stories.length);
  const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-24 bg-linear-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background Quotes */}
      <div className="absolute top-10 left-10 opacity-[0.05] dark:opacity-[0.1]">
        <Quote className="w-64 h-64 text-indigo-600" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-800 tracking-wide">
            <Award className="w-4 h-4" />
            REAL RESULTS
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            Our Students Don't Just Learn. <br />
            <span className="italic bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent underline decoration-indigo-500/30 underline-offset-8">They Succeed.</span>
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Carousel Card */}
          <div className="relative bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl p-8 sm:p-16 min-h-[400px] flex flex-col justify-center items-center text-center group">
            
            {/* Navigation Buttons */}
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white transition-all shadow-sm md:-left-6">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white transition-all shadow-sm md:-right-6">
              <ArrowRight className="w-6 h-6" />
            </button>

            <div key={current} className="space-y-8 animate-in fade-in zoom-in duration-700">
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                Verified Achievement
              </div>

              {/* Quote Area */}
              <div className="relative">
                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-gray-100 dark:text-gray-700 -z-10" />
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed italic">
                  "{stories[current].quote}"
                </h3>
              </div>

              {/* Student Metadata */}
              <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {stories[current].image}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-gray-900 dark:text-white">{stories[current].student}</div>
                    <div className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">{stories[current].achievement}</div>
                  </div>
                </div>

                {/* Tutor Link */}
                <Link 
                  href={`/tutors/${stories[current].tutorId}`}
                  className="mt-2 text-xs font-extrabold text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5 group/link"
                >
                  MENTORED BY <span className="text-gray-700 dark:text-gray-300 group-hover/link:underline">{stories[current].tutor}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {stories.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-500 ${current === i ? 'w-12 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-gray-800'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
