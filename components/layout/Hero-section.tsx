'use client';

import Link from 'next/link';
import React from 'react';
import { authClient } from '@/lib/auth-client';

const HeroSection: React.FC = () => {
  const sessionResponse = authClient.useSession();
  const session = sessionResponse?.data;
  const userRole = (session?.user as any)?.role;

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Narrative & Elite Entry */}
          <div className="flex flex-col gap-14 animate-fade-in-up">
            <div className="space-y-8">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-indigo-500/5 dark:bg-indigo-400/10 rounded-full border border-indigo-500/10 dark:border-indigo-400/20 shadow-sm animate-fade-in-up">
                 <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                 <span className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-400">Elite Learning Network</span>
              </div>

              {/* Ultra-Modern Headline */}
              <h1 className="flex flex-col gap-3 font-bold leading-[1.05] tracking-tight">
                <span className="text-6xl md:text-7xl lg:text-8xl bg-linear-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent font-black tracking-tighter">
                  Elevate your skill,
                </span>
                <span className="text-5xl md:text-6xl lg:text-7xl bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  with local experts
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed font-medium">
                SkillBridge connects you with the world's most elite educators for deeply personalized, 1-on-1 intellectual growth. Focus on what matters.
              </p>
            </div>

            {/* Premium Multi-State CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href="/tutors"
                className="w-full sm:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Discover Experts</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              {(!session || userRole === 'STUDENT') && (
                <Link href="/become-tutor" className="w-full sm:w-auto">
                   <div className="px-10 py-5 bg-transparent text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all duration-300 text-center">
                      Join as Mentor
                   </div>
                </Link>
              )}
            </div>

            {/* Strategic Metrics Floor */}
            <div className="flex flex-wrap items-center gap-12 pt-6">
               <div className="space-y-1">
                  <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">12k<span className="text-indigo-600 italic">+</span></div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">Learners</div>
               </div>
               <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
               <div className="space-y-1">
                  <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">3.5k<span className="text-purple-600 italic">+</span></div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">Mentors</div>
               </div>
               <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
               <div className="space-y-1">
                  <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">4.9<span className="text-amber-500 italic">/5</span></div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">Avg. Satisfaction</div>
               </div>
            </div>
          </div>


          {/* Right Visual - Premium Dynamic Cluster */}
          <div className="relative hidden lg:flex h-[700px] items-center justify-center group">
            {/* Ambient Background Depth */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-[4rem] blur-3xl opacity-50 transition-opacity duration-1000 group-hover:opacity-100"></div>
            
            {/* The Main Stage: Perspective Session Card */}
            <div className="relative w-full max-w-[500px] h-[600px] perspective-1000">
               <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-gray-800 overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg] group-hover:rotate-0 transition-all duration-1000 ease-out">
                  <img 
                    src="/hero_premium.png" 
                    alt="Expert Session" 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                  />
                  
                  {/* Glassmorphic Controls Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg animate-pulse">
                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">Live Connection</div>
                        <div className="text-white/60 text-[10px] uppercase font-black tracking-widest leading-none">High Fidelity</div>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 bg-gray-400" />
                       ))}
                    </div>
                  </div>
               </div>

               {/* Orbital Expert Pill: Physics */}
               <div className="absolute -top-6 -right-12 p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transform rotate-12 group-hover:rotate-0 transition-transform duration-700 delay-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">🚀</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">Success Ratio: 99%</div>
                  </div>
               </div>

               {/* Orbital Expert Pill: Coding */}
               <div className="absolute top-1/2 -left-20 p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transform -rotate-12 translate-y-[-50%] group-hover:rotate-0 transition-transform duration-1000">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-2xl">💻</div>
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-tighter">Coding Sessions</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">Expert Verified</div>
                    </div>
                  </div>
               </div>

               {/* Performance Badge */}
               <div className="absolute -bottom-12 -right-6 p-6 bg-linear-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 text-white transform rotate-3 group-hover:rotate-0 transition-all duration-700">
                  <div className="text-center">
                    <div className="text-3xl font-black leading-none mb-1">5s</div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Av. Match Time</div>
                  </div>
               </div>
            </div>

            {/* Subtle Texture Overlays */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
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