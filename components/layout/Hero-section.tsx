'use client';

import Link from 'next/link';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-12 animate-fade-in-up">
            {/* Headline */}
            <div className="flex flex-col gap-6">
              <h1 className="flex flex-col gap-2 font-bold leading-tight tracking-tight">
                <span className="text-5xl md:text-6xl lg:text-7xl bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent animate-fade-in-up">
                  Learn from the best,
                </span>
                <span className="text-5xl md:text-6xl lg:text-7xl bg-linear-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent animate-fade-in-up-delay-1">
                  on your own terms
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed animate-fade-in-up-delay-2">
                Connect with expert teachers for personalized 1-on-1 sessions. 
                Build skills that matter, at a pace that works for you.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-3">
              <Link 
                href="/tutors"
                className="group relative px-8 py-4 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Find a Teacher
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 20 20">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <button className="group px-8 py-4 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5">
                <span className="flex items-center gap-2">
                  Become a Teacher
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 20 20">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4 animate-fade-in-up-delay-4">
              <div className="flex flex-col gap-1">
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  12,000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-500">Active Students</div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex flex-col gap-1">
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  3,500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-500">Expert Teachers</div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex flex-col gap-1">
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-500">Subject Areas</div>
              </div>
            </div>
          </div>


          {/* Right Visual - Simple and Clean */}
          <div className="relative hidden lg:flex h-[600px] items-center justify-center">
            {/* Simple Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl"></div>
            
            {/* Central Illustration Area */}
            <div className="relative w-full h-full flex items-center justify-center p-12">
              {/* Simple Icon Grid */}
              <div className="grid grid-cols-3 gap-8">
                {/* Subject Icons */}
                <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl">
                    📚
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Literature</span>
                </div>

                <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
                    💻
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Coding</span>
                </div>

                <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                    🎨
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Design</span>
                </div>

                <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl">
                    🔬
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Science</span>
                </div>

                <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl">
                    📊
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Math</span>
                </div>

                <div className="flex flex-col items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center text-3xl">
                    🎵
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Music</span>
                </div>
              </div>
            </div>

            {/* Subtle Corner Accents */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
        }

        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-20px) rotate(0deg);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translateY(-50%) rotate(2deg);
          }
          50% {
            transform: translateY(calc(-50% - 25px)) rotate(0deg);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-15px) rotate(1deg);
          }
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translateY(0) rotate(3deg);
          }
          50% {
            transform: translateY(-10px) rotate(-3deg);
          }
        }

        @keyframes float-5 {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }

        @keyframes float-6 {
          0%, 100% {
            transform: translateY(0) rotate(1deg);
          }
          50% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-up-delay-1 {
          animation: fade-in-up 0.8s ease-out 0.1s backwards;
        }

        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.2s backwards;
        }

        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.8s ease-out 0.3s backwards;
        }

        .animate-fade-in-up-delay-4 {
          animation: fade-in-up 0.8s ease-out 0.4s backwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 5s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 7s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 4s ease-in-out infinite;
        }

        .animate-float-5 {
          animation: float-5 5.5s ease-in-out infinite 0.5s;
        }

        .animate-float-6 {
          animation: float-6 4.5s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;