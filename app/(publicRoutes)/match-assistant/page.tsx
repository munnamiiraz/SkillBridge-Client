"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Target, Rocket, Clock, Wallet, CheckCircle2, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { Zap, BookOpen, Trophy, Compass, Star, ExternalLink } from 'lucide-react';

const MatchAssistantPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: '',
    experience: 'beginner',
    timeframe: 'immediately',
    budget: 'any'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const steps = [
    {
      title: "What is your primary learning goal?",
      subtitle: "Tell us exactly what you want to build or learn.",
      field: "goal",
      placeholder: "e.g., I want to build a data scraper with Python by next week...",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "What is your current experience level?",
      subtitle: "This helps us find a tutor who speaks your language.",
      field: "experience",
      options: [
        { value: 'beginner', label: 'Beginner', desc: 'I am just starting out' },
        { value: 'intermediate', label: 'Intermediate', desc: 'I have some basic knowledge' },
        { value: 'advanced', label: 'Advanced', desc: 'I want to master complex topics' }
      ],
      icon: <Rocket className="w-6 h-6" />
    },
    {
      title: "How soon do you want to start?",
      subtitle: "Timeline is key for the perfect matching.",
      field: "timeframe",
      options: [
        { value: 'immediately', label: 'Immediately', desc: 'Within the next 24-48 hours' },
        { value: 'this-week', label: 'This Week', desc: 'I have a deadline coming up' },
        { value: 'flexible', label: 'Flexible', desc: 'I am planning for the future' }
      ],
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: "Do you have a budget preference?",
      subtitle: "We'll match you with experts in your range.",
      field: "budget",
      options: [
        { value: 'budget', label: 'Budget-Friendly', desc: 'Under $30/hr' },
        { value: 'mid', label: 'Standard', desc: '$30 - $60/hr' },
        { value: 'premium', label: 'Executive', desc: '$60+/hr expert level' },
        { value: 'any', label: 'Any Range', desc: 'Show me the best quality available' }
      ],
      icon: <Wallet className="w-6 h-6" />
    }
  ];

  const handleNext = () => {
    // Basic Validation
    const currentField = steps[step].field as keyof typeof answers;
    if (!answers[currentField] || (typeof answers[currentField] === 'string' && !answers[currentField].trim())) {
      toast.error(`Please provide an answer for: ${steps[step].title}`);
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      performMatching();
    }
  };

  const performMatching = async () => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/ai/chat`, {
        messages: [{
          role: "user",
          content: `I am looking for a tutor. 
          GOAL: ${answers.goal}
          MY LEVEL: ${answers.experience}
          TIMEFRAME: ${answers.timeframe}
          BUDGET: ${answers.budget}.
          Please suggest the top 3 tutors and give me a personalized recommendation note for each.`
        }]
      });

      if (response.data.success) {
        setRecommendations(response.data.data.content);
        setStep(steps.length); // Final step
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("AI MATCH ERROR:", error);
      toast.error(error.response?.data?.message || "Matching failed. Is the server running at :9000?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/ai/roadmap`, {
        goal: answers.goal,
        level: answers.experience
      });

      if (response.data.success) {
        setRoadmap(response.data.data);
        toast.success("Your personal roadmap is ready!");
      }
    } catch (error: any) {
      console.error("ROADMAP ERROR:", error);
      toast.error("Failed to generate roadmap.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-8"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl relative z-10">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-50 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black dark:text-white">Analyzing 100+ Tutor Profiles...</h2>
                <p className="text-gray-600 dark:text-gray-400">Our AI is comparing your goals with tutor expertise, reviews, and availability.</p>
              </div>
            </motion.div>
          ) : step < steps.length ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-500/5"
            >
              <div className="space-y-8">
                {/* Progress */}
                <div className="flex items-center gap-2 mb-10">
                  {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-12 bg-indigo-600' : 'w-4 bg-gray-200 dark:bg-gray-800'}`} />
                  ))}
                  <span className="ml-auto text-xs font-black text-gray-400 uppercase tracking-widest">Step {step + 1} of {steps.length}</span>
                </div>

                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center shadow-sm">
                    {steps[step].icon}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                    {steps[step].title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {steps[step].subtitle}
                  </p>
                </div>

                <div className="pt-6">
                  {steps[step].options ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {steps[step].options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setAnswers({ ...answers, [steps[step].field]: opt.value })}
                          className={`p-6 rounded-3xl text-left transition-all duration-300 border-2 ${
                            answers[steps[step].field as keyof typeof answers] === opt.value
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                            : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900'
                          }`}
                        >
                          <div className="font-bold text-gray-900 dark:text-white mb-1">{opt.label}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      autoFocus
                      value={answers.goal}
                      onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}
                      placeholder={steps[step].placeholder}
                      className="w-full h-40 p-6 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-gray-900 rounded-3xl text-lg transition-all outline-none dark:text-white shadow-inner"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between pt-10">
                  <button
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 p-4 text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-colors disabled:opacity-0"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-10 py-5 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all"
                  >
                    {step === steps.length - 1 ? 'Get My Matches' : 'Continue'}
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                {/* Header Decoration */}
                <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                
                <div className="flex items-center gap-4 mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                      {recommendations?.toLowerCase().includes("couldn't find") || recommendations?.toLowerCase().includes("no tutors") 
                        ? "We're almost there..." 
                        : "Your Perfect Matches"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium pb-2">
                      {recommendations?.toLowerCase().includes("couldn't find") || recommendations?.toLowerCase().includes("no tutors")
                        ? "We couldn't find a direct match for this specific request."
                        : "AI-Selected based on your specific goals."}
                    </p>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed space-y-6 font-medium">
                    {recommendations?.split(/(\s+)/).map((part: string, i: number) => {
                      const urlPattern = /(https?:\/\/[^\s]+)/g;
                      if (part.match(urlPattern)) {
                        return (
                          <a 
                            key={i} 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-black underline decoration-2 underline-offset-4 hover:text-indigo-500 transition-colors"
                          >
                            {part}
                          </a>
                        );
                      }
                      return part;
                    })}
                  </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  {!(recommendations?.toLowerCase().includes("couldn't find") || recommendations?.toLowerCase().includes("no tutors")) && (
                    <button 
                      onClick={generateRoadmap}
                      disabled={isGeneratingRoadmap || roadmap}
                      className="flex-1 flex items-center justify-center gap-2 py-5 bg-linear-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100"
                    >
                      {isGeneratingRoadmap ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating Roadmap...</>
                      ) : roadmap ? (
                        <><CheckCircle2 className="w-5 h-5" /> Roadmap Generated</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> Generate 4-Week Roadmap</>
                      )}
                    </button>
                  )}
                  <Link 
                    href="/tutors"
                    className="flex-1 flex items-center justify-center gap-2 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all text-center"
                  >
                    {recommendations?.toLowerCase().includes("couldn't find") || recommendations?.toLowerCase().includes("no tutors") 
                      ? "Browse All Tutors" 
                      : "Visit Tutor Marketplace"}
                  </Link>
                  <button 
                    onClick={() => {
                      setStep(0);
                      setRecommendations(null);
                      setRoadmap(null);
                    }}
                    className="px-10 py-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Adjust Search
                  </button>
                </div>
              </div>

              {/* Roadmap Display */}
              {roadmap && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  className="space-y-12 pb-20"
                >
                  {/* Premium Header */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    className="text-center space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-900/50">
                      <Sparkles size={14} />
                      AI-Crafted Curriculum
                    </div>
                    <h3 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter">
                      {roadmap.title.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i % 2 === 1 ? "text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" : ""}>
                          {word}{' '}
                        </span>
                      ))}
                    </h3>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                      {roadmap.overview}
                    </p>
                  </motion.div>

                  {/* Vertical Roadmap Journey */}
                  <div className="relative max-w-4xl mx-auto px-4">
                    {/* The Journey Line */}
                    <div className="absolute left-[34px] md:left-1/2 top-10 bottom-10 w-1 bg-linear-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-[1px]" />
                    
                    <div className="space-y-16">
                      {roadmap.phases.map((phase: any, i: number) => (
                        <motion.div
                          key={i}
                          variants={{
                            hidden: { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className={`relative flex flex-col md:flex-row items-center gap-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                          {/* Week Bubble */}
                          <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-18 h-18 rounded-[2rem] bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800 shadow-2xl flex items-center justify-center z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${
                              i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-purple-600' : i === 2 ? 'bg-pink-600' : 'bg-orange-600'
                            }`}>
                              {phase.week}
                            </div>
                          </div>

                          {/* Phase Content */}
                          <div className="w-full md:w-[45%]">
                            <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100 dark:border-white/5 shadow-2xl hover:border-indigo-500/30 transition-all duration-500">
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  i === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <BookOpen size={16} />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white capitalize">{phase.title}</h4>
                              </div>

                              <ul className="space-y-3 mb-6">
                                {phase.objectives.map((obj: string, j: number) => (
                                  <li key={j} className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shrink-0">
                                      <CheckCircle2 size={10} />
                                    </div>
                                    {obj}
                                  </li>
                                ))}
                              </ul>

                              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-500/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap size={14} className="text-indigo-600" />
                                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Tutor Session Focus</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">
                                  {phase.tutorSessions}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Spacer for desktop */}
                          <div className="hidden md:block w-[45%]" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Final Achievement Card */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="relative p-12 rounded-[3rem] bg-indigo-600 overflow-hidden shadow-2xl shadow-indigo-500/40">
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
                      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-400/20 rounded-full blur-[60px]" />
                      
                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest text-indigo-100 border border-white/10">
                            <Trophy size={16} />
                            Capstone Achievement
                          </div>
                          <h4 className="text-4xl font-black text-white leading-tight">
                            {roadmap.milestoneProject}
                          </h4>
                          <Link href="/tutors" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                            Book Session to Start
                            <ArrowRight size={20} />
                          </Link>
                        </div>

                        <div className="space-y-6">
                          <h5 className="text-sm font-black text-indigo-100 uppercase tracking-widest flex items-center gap-2">
                            <Compass size={18} />
                            Golden Resources
                          </h5>
                          <div className="space-y-3">
                            {roadmap.recommendedResources.map((res: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 text-sm text-indigo-50">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                  <Star size={14} className="text-amber-300" />
                                </div>
                                {res}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              <div className="flex items-center justify-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Context-Aware Matching
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                <CheckCircle2 size={16} className="text-emerald-500" />
                Personalized Notes
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MatchAssistantPage;
