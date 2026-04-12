"use client";

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles, Bell } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Fake success delay
    setTimeout(() => {
      setIsLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="relative w-full py-16 lg:py-20 overflow-hidden bg-white dark:bg-gray-950">
      {/* Abstract Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="relative group">
          {/* Main Card */}
          <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-8 md:p-12 lg:px-16 lg:py-14 shadow-2xl shadow-indigo-500/30">
            
            {/* Animated Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              {/* Content Side */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-100 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                  <Bell className="w-3.5 h-3.5 animate-swing" />
                  Weekly Insights
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  Elevate Your <br /> 
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-indigo-200">Knowledge.</span>
                </h2>
                
                <p className="text-lg text-indigo-100/80 max-w-lg leading-relaxed font-medium">
                  Join 10,000+ students receiving curated micro-lessons and expert tips Every Tuesday.
                </p>

                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-3 text-white/90 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Zero Spam
                  </div>
                  <div className="flex items-center gap-3 text-white/90 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Exclusive Content
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="relative">
                {!subscribed ? (
                  <form 
                    onSubmit={handleSubscribe}
                    className="relative p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-3xl animate-in fade-in zoom-in duration-500"
                  >
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-200" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          required
                          className="w-full h-14 pl-12 pr-4 bg-transparent border-none text-white placeholder:text-indigo-200/50 outline-none font-bold text-base"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="h-14 px-8 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/20 text-sm"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                        ) : (
                          <>
                            Subscribe
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-center space-y-4 animate-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-400/50">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white italic">Welcome!</h3>
                      <p className="text-indigo-100/80 text-sm font-medium">Check your inbox for your first guide.</p>
                    </div>
                  </div>
                )}

                {/* Decorative floating icon */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-linear-to-br from-amber-400 to-orange-500 rounded-3xl rotate-12 flex items-center justify-center text-4xl shadow-2xl animate-float pointer-events-none hidden md:flex">
                  ✉️
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default NewsletterSection;
