'use client';

import React, { useState } from 'react';

const FeaturedTeachersSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'categories'>('teachers');

  const teachers = [
    {
      name: 'Sarah Johnson',
      specialty: 'Mathematics & Physics',
      avatar: 'SJ',
      rating: 5.0,
      reviews: 234,
      students: 450,
      experience: '8 years',
      hourlyRate: 45,
      skills: ['Calculus', 'Linear Algebra', 'Quantum Physics'],
      available: true,
      bgGradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Michael Rodriguez',
      specialty: 'Web Development',
      avatar: 'MR',
      rating: 4.9,
      reviews: 189,
      students: 380,
      experience: '10 years',
      hourlyRate: 60,
      skills: ['React', 'Node.js', 'TypeScript'],
      available: true,
      bgGradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Emily Chen',
      specialty: 'Language Arts & Writing',
      avatar: 'EC',
      rating: 5.0,
      reviews: 312,
      students: 520,
      experience: '12 years',
      hourlyRate: 50,
      skills: ['Creative Writing', 'English Literature', 'Essay Writing'],
      available: false,
      bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'David Park',
      specialty: 'Music Theory & Piano',
      avatar: 'DP',
      rating: 4.8,
      reviews: 156,
      students: 290,
      experience: '15 years',
      hourlyRate: 55,
      skills: ['Classical Piano', 'Jazz Theory', 'Music Composition'],
      available: true,
      bgGradient: 'from-orange-500 to-red-500',
    },
    {
      name: 'Sofia Martinez',
      specialty: 'Graphic Design',
      avatar: 'SM',
      rating: 4.9,
      reviews: 201,
      students: 340,
      experience: '7 years',
      hourlyRate: 48,
      skills: ['Adobe Suite', 'UI/UX Design', 'Brand Identity'],
      available: true,
      bgGradient: 'from-pink-500 to-rose-500',
    },
    {
      name: 'James Thompson',
      specialty: 'Data Science & ML',
      avatar: 'JT',
      rating: 5.0,
      reviews: 278,
      students: 410,
      experience: '9 years',
      hourlyRate: 65,
      skills: ['Python', 'Machine Learning', 'Data Visualization'],
      available: true,
      bgGradient: 'from-green-500 to-emerald-500',
    },
  ];

  const categories = [
    {
      name: 'Programming',
      icon: '💻',
      teacherCount: 342,
      studentCount: '12k+',
      bgGradient: 'from-indigo-500 to-purple-500',
      topics: ['Web Development', 'Mobile Apps', 'Data Science', 'AI/ML'],
    },
    {
      name: 'Mathematics',
      icon: '📊',
      teacherCount: 256,
      studentCount: '8k+',
      bgGradient: 'from-blue-500 to-cyan-500',
      topics: ['Calculus', 'Statistics', 'Algebra', 'Geometry'],
    },
    {
      name: 'Languages',
      icon: '🌍',
      teacherCount: 418,
      studentCount: '15k+',
      bgGradient: 'from-purple-500 to-pink-500',
      topics: ['English', 'Spanish', 'Mandarin', 'French'],
    },
    {
      name: 'Design',
      icon: '🎨',
      teacherCount: 189,
      studentCount: '6k+',
      bgGradient: 'from-pink-500 to-rose-500',
      topics: ['Graphic Design', 'UI/UX', 'Illustration', 'Animation'],
    },
    {
      name: 'Music',
      icon: '🎵',
      teacherCount: 201,
      studentCount: '7k+',
      bgGradient: 'from-orange-500 to-red-500',
      topics: ['Piano', 'Guitar', 'Vocals', 'Music Theory'],
    },
    {
      name: 'Business',
      icon: '💼',
      teacherCount: 167,
      studentCount: '5k+',
      bgGradient: 'from-green-500 to-emerald-500',
      topics: ['Marketing', 'Finance', 'Entrepreneurship', 'Management'],
    },
  ];

  return (
    <section className="relative w-full py-24 lg:py-32 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Explore & Discover
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Connect with expert teachers or explore our diverse skill categories
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'teachers'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Featured Teachers
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Skill Categories
            </button>
          </div>
        </div>

        {/* Teachers Grid */}
        {activeTab === 'teachers' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header with Avatar */}
                <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                  <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${teacher.bgGradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  {/* Avatar */}
                  <div className="absolute -bottom-12 left-6">
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${teacher.bgGradient} flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4 border-white dark:border-gray-900`}>
                      {teacher.avatar}
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    {teacher.available ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded-full">
                        Busy
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-16 p-6 space-y-4">
                  {/* Name & Specialty */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {teacher.specialty}
                    </p>
                  </div>

                  {/* Rating & Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span className="font-semibold text-gray-900 dark:text-white">{teacher.rating}</span>
                      <span className="text-gray-500 dark:text-gray-500">({teacher.reviews})</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {teacher.students} students
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {teacher.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Experience & Rate */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-500">Experience:</span>
                      <span className="ml-1 font-semibold text-gray-900 dark:text-white">{teacher.experience}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        ${teacher.hourlyRate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">per hour</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-3 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50">
                    View Profile
                  </button>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 dark:group-hover:from-indigo-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {activeTab === 'categories' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>

                <div className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.bgGradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {category.icon}
                  </div>

                  {/* Category Name */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{category.teacherCount} teachers</span>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                      <span>{category.studentCount} students</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {category.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Explore</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10H16M16 10L11 5M16 10L11 15" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 lg:mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            {activeTab === 'teachers' ? 'View All Teachers' : 'View All Categories'}
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10H16M16 10L11 5M16 10L11 15" />
            </svg>
          </button>
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

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out backwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturedTeachersSection;