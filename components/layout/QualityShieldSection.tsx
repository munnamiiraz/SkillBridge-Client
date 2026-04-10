"use client";

import React from 'react';
import { ShieldCheck, UserCheck, GraduationCap, Award, RefreshCcw } from 'lucide-react';

const QualityShieldSection: React.FC = () => {
  const steps = [
    {
      icon: <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Identity Verified",
      description: "Every tutor must pass a rigorous identity and background check to ensure safety."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      title: "Credential Audit",
      description: "Our team manually verifies degrees, certificates, and professional history."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      title: "Subject Mastery",
      description: "Tutors undergo proficiency tests to prove their expertise in their chosen fields."
    }
  ];

  return (
    <section className="relative w-full py-24 bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Side: The Shield */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-[3rem] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" />
              
              {/* Main Card */}
              <div className="relative bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl flex flex-col items-center text-center max-w-md">
                <div className="w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/40 mb-8 transform group-hover:rotate-6 transition-transform duration-500">
                  <ShieldCheck className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 italic">
                  The SkillBridge Shield
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Our high-authority verification protocol ensures you only learn from the best. Less than 5% of applicants pass our rigorous vetting.
                </p>
                
                {/* Guarantee Tag */}
                <div className="w-full p-6 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-4">
                  <RefreshCcw className="w-8 h-8 text-emerald-600" />
                  <div className="text-left">
                    <div className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-tighter">100% Satisfaction</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">Not happy with your first session? It's on us.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side: The Process */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Our Verification <br />
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gold Standard.</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We believe trust is the foundation of education. Every tutor on SkillBridge is manually vetted through our 4-step verification funnel.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <span className="group-hover:hidden">{step.icon}</span>
                    <ShieldCheck className="hidden group-hover:block w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="px-8 py-4 bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
              Start Learning with Confidence
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QualityShieldSection;
