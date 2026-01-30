'use client';

import React from 'react';

interface TutorAboutAndSubjectsProps {
  about: {
    bio: string;
    teachingStyle: {
      title: string;
      description: string;
      icon: React.ReactNode;
    }[];
    experience: {
      role: string;
      organization: string;
      year: string;
      icon: React.ReactNode;
    }[];
  };
  subjects: {
    category: string;
    skills: {
      name: string;
      level: string;
    }[];
  }[];
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Expert':
      return 'from-green-500 to-emerald-500 text-white';
    case 'Advanced':
      return 'from-blue-500 to-cyan-500 text-white';
    case 'Intermediate':
      return 'from-yellow-500 to-orange-500 text-white';
    default:
      return 'from-gray-500 to-gray-600 text-white';
  }
};

export const TutorAboutContent: React.FC<TutorAboutAndSubjectsProps> = ({ about, subjects }) => {
  return (
    <div className="space-y-12">
      {/* About Me Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            About Me
          </h2>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {about.bio}
          </p>
        </div>
      </div>

      {/* Teaching Style Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teaching Style
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {about.teachingStyle.map((style, index) => (
            <div
              key={index}
              className="group p-6 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 transition-transform duration-300 group-hover:scale-110">
                {style.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {style.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {style.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Experience & Credentials
          </h2>
        </div>

        <div className="space-y-4">
          {about.experience.map((exp, index) => (
            <div
              key={index}
              className="flex gap-4 p-5 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
            >
              <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {exp.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {exp.role}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {exp.organization}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                  {exp.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects & Expertise Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subjects & Expertise
          </h2>
        </div>

        <div className="space-y-8">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-linear-to-br from-orange-500 to-red-500"></span>
                {subject.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {subject.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="group relative"
                  >
                    <div className="px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-linear-to-br ${getLevelColor(skill.level)} shadow-sm`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TutorQuickStatsSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats Card */}
      <div className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Quick Stats
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Hours Taught</span>
            <span className="font-bold text-gray-900 dark:text-white">1,200+</span>
          </div>
          <div className="h-px bg-indigo-200 dark:bg-indigo-800"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
            <span className="font-bold text-green-600 dark:text-green-400">98%</span>
          </div>
          <div className="h-px bg-indigo-200 dark:bg-indigo-800"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Repeat Students</span>
            <span className="font-bold text-gray-900 dark:text-white">85%</span>
          </div>
          <div className="h-px bg-indigo-200 dark:bg-indigo-800"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Avg. Grade Improvement</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">+2 Grades</span>
          </div>
        </div>
      </div>

      {/* Certifications Card */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Certifications
        </h3>
        <div className="space-y-3">
          {['MIT Teaching Certificate', 'State Teaching License', 'SAT Prep Specialist'].map((cert, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
