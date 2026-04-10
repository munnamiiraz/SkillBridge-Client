"use client";

import React from 'react';
import { Compass, Code, Database, Languages, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const LearningPathsSection: React.FC = () => {
  const paths = [
    {
      title: "The Full-Stack Blueprint",
      description: "Master everything from modern UI design to scalable backend architecture.",
      icon: <Code className="w-8 h-8 text-indigo-600" />,
      subjects: ["React & Next.js", "Node.js & Express", "PostgreSQL", "Cloud Deployment"],
      color: "indigo",
      level: "Intermediate",
      duration: "6-8 Months"
    },
    {
      title: "Data Science Journey",
      description: "Harness the power of data through statistical analysis and machine learning.",
      icon: <Database className="w-8 h-8 text-emerald-600" />,
      subjects: ["Python for Data", "Statistical Models", "Machine Learning", "Neural Networks"],
      color: "emerald",
      level: "Advanced",
      duration: "10-12 Months"
    },
    {
      title: "Global Language Mastery",
      description: "Go beyond basic vocabulary to achieve native-level fluency and cultural depth.",
      icon: <Languages className="w-8 h-8 text-purple-600" />,
      subjects: ["Conversational Flow", "Business Etiquette", "Advanced Grammar", "Literature"],
      color: "purple",
      level: "Beginner to Pro",
      duration: "Flexible"
    }
  ];

  return (
    <section className="relative w-full py-24 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background Roadmap Lines (Abstract) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 150C200 150 400 350 720 350C1040 350 1240 150 1490 150" stroke="currentColor" strokeWidth="40" strokeLinecap="round" />
          <path d="M-50 450C200 450 400 650 720 650C1040 650 1240 450 1490 450" stroke="currentColor" strokeWidth="40" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-800 animate-bounce-subtle">
            <Compass className="w-4 h-4" />
            SkillBridge Learning Paths
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            Stop Random Learning. <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Start Your Journey.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose a curated roadmap designed by industry experts to take you from zero to job-ready, guided by the world's best mentors.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <div 
              key={index} 
              className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              {/* Top Accent Bar */}
              <div className={`h-3 w-full bg-linear-to-r from-${path.color}-500 to-${path.color}-600`} />
              
              <div className="p-8 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    {path.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">The Curriculum</span>
                  <div className="space-y-3">
                    {path.subjects.map((subject, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className={`w-5 h-5 text-${path.color}-500`} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between py-4 px-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-bold text-gray-500">Level</div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">{path.level}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                  <div className="text-center">
                    <div className="text-[10px] uppercase font-bold text-gray-500">Duration</div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">{path.duration}</div>
                  </div>
                </div>

                {/* CTA */}
                <Link 
                  href={`/tutors?path=${encodeURIComponent(path.title)}`}
                  className={`w-full py-4 bg-linear-to-r from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 group/btn hover:shadow-lg transition-all active:scale-95`}
                >
                  Explore Path
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>

              {/* Decorative Circle */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${path.color}-500 opacity-[0.03] rounded-full blur-3xl`} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Don't see what you're looking for? <Link href="/tutors" className="text-indigo-600 dark:text-indigo-400 hover:underline">Chat with an expert advisor</Link> to build a custom path.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default LearningPathsSection;
