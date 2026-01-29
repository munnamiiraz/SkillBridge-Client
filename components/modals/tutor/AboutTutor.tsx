'use client';

import React from 'react';

const TutorAboutAndSubjects: React.FC = () => {
  // Sample data
  const about = {
    bio: `I'm a passionate educator with over 8 years of experience helping students unlock their potential in mathematics and physics. My approach is simple: break down complex concepts into digestible pieces, relate them to real-world applications, and build confidence through practice.

I believe that every student can excel in STEM subjects with the right guidance and support. Whether you're struggling with basic algebra or tackling advanced calculus, I'm here to help you succeed.`,
    
    teachingStyle: [
      {
        title: 'Student-Centered Learning',
        description: 'I adapt my teaching methods to match your learning style and pace, ensuring you truly understand rather than just memorize.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        title: 'Real-World Applications',
        description: 'I connect abstract concepts to practical examples, making learning more engaging and memorable.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'Interactive Problem-Solving',
        description: 'We work through problems together step-by-step, building your critical thinking and analytical skills.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
    ],

    experience: [
      {
        role: 'Ph.D. in Applied Mathematics',
        organization: 'MIT',
        year: '2015',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        ),
      },
      {
        role: 'High School Math Teacher',
        organization: 'Boston Latin School',
        year: '2015 - 2018',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        role: 'Private Tutor & Consultant',
        organization: 'SkillBridge',
        year: '2018 - Present',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  };

  const subjects = [
    {
      category: 'Mathematics',
      skills: [
        { name: 'Calculus I & II', level: 'Expert' },
        { name: 'Linear Algebra', level: 'Expert' },
        { name: 'Differential Equations', level: 'Expert' },
        { name: 'Statistics & Probability', level: 'Advanced' },
        { name: 'Discrete Mathematics', level: 'Advanced' },
        { name: 'Algebra & Trigonometry', level: 'Expert' },
      ],
    },
    {
      category: 'Physics',
      skills: [
        { name: 'Classical Mechanics', level: 'Expert' },
        { name: 'Quantum Physics', level: 'Advanced' },
        { name: 'Electromagnetism', level: 'Expert' },
        { name: 'Thermodynamics', level: 'Advanced' },
      ],
    },
    {
      category: 'Test Preparation',
      skills: [
        { name: 'SAT Math', level: 'Expert' },
        { name: 'ACT Math & Science', level: 'Expert' },
        { name: 'AP Calculus AB/BC', level: 'Expert' },
        { name: 'AP Physics 1 & 2', level: 'Advanced' },
        { name: 'GRE Quantitative', level: 'Advanced' },
      ],
    },
  ];

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

  return (
    <section className="relative w-full bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column - About Content */}
          <div className="lg:col-span-2 space-y-12">
            
            

            {/* Teaching Style Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
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
                    className="group p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transition-transform duration-300 group-hover:scale-110">
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
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
                    className="flex gap-4 p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
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
                      <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full">
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
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
                      <span className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></span>
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
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-br ${getLevelColor(skill.level)} shadow-sm`}>
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

          {/* Right Column - Quick Stats Sidebar (Optional) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats Card */}
            <div className="sticky top-24 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
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
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TutorAboutAndSubjects;