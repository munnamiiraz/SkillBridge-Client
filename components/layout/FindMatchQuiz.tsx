"use client";

import React, { useState } from 'react';
import { Target, ArrowRight, Check, Loader2, Star, Users } from 'lucide-react';
import Link from 'next/link';

const FindMatchQuiz: React.FC = () => {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const subjects = [
    { id: 'coding', name: 'Programming', icon: '💻' },
    { id: 'languages', name: 'Languages', icon: '🌍' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'design', name: 'Design', icon: '🎨' },
  ];

  const levels = [
    { id: 'beginner', name: 'Beginner', desc: 'Just starting out' },
    { id: 'intermediate', name: 'Intermediate', desc: 'Have basic knowledge' },
    { id: 'advanced', name: 'Advanced', desc: 'Looking for mastery' },
  ];

  // Simulated top tutors for the result
  const featuredTutors = [
    { name: 'Dr. Sarah Wilson', rating: 4.9, students: '1.2k', specialty: 'Advanced Algorithms', avatar: 'S' },
    { name: 'Marcus Chen', rating: 5.0, students: '850', specialty: 'Language Mastery', avatar: 'M' },
    { name: 'Jessica Lee', rating: 4.8, students: '2.1k', specialty: 'UX Design Systems', avatar: 'J' },
  ];

  const handleNext = () => {
    if (step === 1 && subject) setStep(2);
    if (step === 2 && level) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 1500);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSubject('');
    setLevel('');
    setShowResults(false);
  };

  return (
    <section className="relative w-full py-24 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-indigo-500/5">
          
          {!showResults ? (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <Target className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Find Your Perfect Match</h2>
                <p className="text-gray-500 dark:text-gray-400">Answer 2 quick questions to find the top mentors for your goals.</p>
              </div>

              {/* Step Progress */}
              <div className="flex items-center justify-center gap-4">
                <div className={`h-2 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-2 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              </div>

              {/* Step 1: Subject Selection */}
              {step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {subjects.map((s) => (
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
                  ))}
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
                    <><Loader2 className="w-5 h-5 animate-spin" /> Matching you with experts...</>
                  ) : (
                    <>
                      {step === 1 ? 'Next Step' : 'Find My Tutors'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in duration-500">
              <div className="text-center">
                <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4 border-2 border-emerald-500 rounded-full p-1" />
                <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">Your Top Matches!</h2>
                <p className="text-gray-500">Based on your goals, these 3 experts are your best fit.</p>
              </div>

              <div className="grid gap-4">
                {featuredTutors.map((t, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shrink-0">
                      {t.avatar}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                      <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-3 mt-1">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {t.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.students} students</span>
                        <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{t.specialty}</span>
                      </div>
                    </div>
                    <Link href="/tutors" className="px-6 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 transition-all">
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>

              <button onClick={handleReset} className="w-full text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                ← Start Over
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default FindMatchQuiz;
