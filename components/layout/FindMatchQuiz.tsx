"use client";

import React, { useState } from 'react';
import { Target, ArrowRight, Check, Loader2, Star, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

const FindMatchQuiz: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string>('');

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/categories`);
        const result = await res.json();
        if (result.success) {
          setCategories(result.data.map((c: any) => ({
            id: c.name,
            name: c.name,
            icon: c.name === 'Mathematics' ? '📊' : 
                  c.name === 'Science' ? '🧪' :
                  c.name === 'Programming' ? '💻' :
                  c.name === 'Business' ? '💼' : '📚'
          })));
        }
      } catch (err) {
        console.error('Error fetching categories for quiz:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleNext = async () => {
    if (step === 1 && subject) setStep(2);
    if (step === 2 && level) {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: `I am looking for a tutor in ${subject}. My current level is ${level}. 
              Please suggest the top 3 tutors from your database and explain why they are a good match. 
              Be brief and focus on expertise and results.`
            }]
          })
        });

        const result = await response.json();
        if (result.success) {
          setRecommendations(result.data.content);
          setShowResults(true);
        } else {
          throw new Error('Matching failed');
        }
      } catch (error) {
        console.error("AI MATCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setSubject('');
    setLevel('');
    setShowResults(false);
    setRecommendations('');
  };

  return (
    <section className="relative w-full py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-indigo-500/5">
          
          {!showResults ? (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="relative inline-block mb-4">
                  <Target className="w-12 h-12 text-indigo-600 mx-auto" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Find Your Perfect Match</h2>
                <p className="text-gray-500 dark:text-gray-400">Our AI analyzes 50+ experts to find your ideal mentor in seconds.</p>
              </div>

              {/* Step Progress */}
              <div className="flex items-center justify-center gap-4">
                <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              </div>

              {/* Step 1: Subject Selection */}
              {step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {categories.length > 0 ? categories.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSubject(s.id)}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        subject === s.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md ring-2 ring-indigo-500/20' 
                        : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                      }`}
                    >
                      <span className="text-4xl">{s.icon}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
                    </button>
                  )) : (
                    [...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />)
                  )}
                </div>
              )}

              {/* Step 2: Level Selection */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  {levels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        level === l.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' 
                        : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{l.name}</div>
                        <div className="text-sm text-gray-500">{l.desc}</div>
                      </div>
                      {level === l.id && <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                    </button>
                  ))}
                </div>
              )}

              {/* Footer Button */}
              <div className="pt-4">
                <button
                  onClick={handleNext}
                  disabled={loading || (step === 1 && !subject) || (step === 2 && !level)}
                  className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing 50+ Profiles...</>
                  ) : (
                    <>
                      {step === 1 ? 'Next Step' : 'Get AI Recommendations'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">AI Analysis Complete!</h2>
                <p className="text-gray-500 italic">Here are your context-aware matches for {subject}:</p>
              </div>

              <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  {recommendations.split(/(\s+)/).map((part, i) => {
                    const urlPattern = /(https?:\/\/[^\s]+)/g;
                    if (part.match(urlPattern)) {
                      return (
                        <Link 
                          key={i} 
                          href={part} 
                          target="_blank" 
                          className="text-indigo-600 dark:text-indigo-400 font-black underline decoration-2 underline-offset-4 hover:text-indigo-500 transition-colors"
                        >
                          {part}
                        </Link>
                      );
                    }
                    return part;
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <button onClick={handleReset} className="w-full py-4 border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  ← Need something else? Try again
                </button>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                   <Link href="/match-assistant" className="text-sm font-bold text-indigo-600 group inline-flex items-center gap-2">
                     Want a 4-week learning roadmap? Try the Match Assistant
                     <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default FindMatchQuiz;
