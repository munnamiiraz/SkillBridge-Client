'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';

interface Tutor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  reviews: number;
  students: number;
  experience: string;
  hourlyRate: number;
  skills: string[];
  available: boolean;
  bgGradient: string;
  banner?: string;
}

const FeaturedTeachersSection: React.FC = () => {
  const [teachers, setTeachers] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-green-500 to-emerald-500',
  ];

  const categoryIcons: Record<string, string> = {
    'Programming': '💻',
    'Mathematics': '📊',
    'Languages': '🌍',
    'Design': '🎨',
    'Music': '🎵',
    'Business': '💼',
    'Science': '🔬',
    'Arts': '🎭',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tutorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/tutors/featured`);
        const tutorsResult = await tutorsRes.json();
        
        if (tutorsResult.success) {
          const mappedTutors = tutorsResult.data.map((t: any, index: number) => ({
            id: t.id,
            name: t.user.name,
            specialty: t.headline || 'Expert Educator',
            avatar: t.user.image || (t.user.name?.[0].toUpperCase() || 'U'),
            rating: t.averageRating || 0,
            reviews: t.totalReviews || 0,
            students: t.totalSessions || 0,
            experience: `${t.experience || 0} years`,
            hourlyRate: t.hourlyRate,
            skills: t.tutor_subject?.map((ts: any) => ts.subject.name) || [],
            available: t.isAvailable,
            bgGradient: gradients[index % gradients.length],
            banner: t.banner || '',
          }));
          setTeachers(mappedTutors.slice(0, 8));
        }
      } catch (err) {
        setError('Failed to connect to the server');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="relative w-full py-24 lg:py-32 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Explore & Discover
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Connect with expert teachers who match your learning goals
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
                  <Skeleton className="h-32 w-full rounded-none" />
                  <div className="pt-14 p-6 space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-16" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 auto-rows-fr">
              {teachers.map((teacher, index) => (
                <Link
                  key={teacher.id}
                  href={`/tutors/${teacher.id}`}
                  className={`group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 hover:-translate-y-2 animate-fade-in-up flex flex-col ${index >= 4 ? 'hidden xl:flex' : 'flex'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header with Banner or Gradient */}
                  <div className="relative h-32 shrink-0 overflow-hidden">
                    {teacher.banner ? (
                      <img 
                        src={teacher.banner} 
                        alt="Banner" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-linear-to-br ${teacher.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />
                    <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-linear-to-br ${teacher.bgGradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                    
                    {/* Availability Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      {teacher.available ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100/90 dark:bg-green-900/40 backdrop-blur-md text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Available
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100/90 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Busy
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col px-6 pb-6 pt-12 relative h-full">
                    {/* Avatar - Fixed position and visibility */}
                    <div className="absolute -top-12 left-6 z-10">
                      <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${teacher.bgGradient} p-1 shadow-2xl`}>
                        <div className="w-full h-full rounded-[0.8rem] bg-white dark:bg-gray-800 overflow-hidden">
                          {teacher.avatar.length > 2 ? (
                            <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-black bg-gray-50 dark:bg-gray-800 text-gray-400">
                              {teacher.avatar}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Name & Specialty */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium line-clamp-1">
                        {teacher.specialty}
                      </p>
                    </div>

                    {/* Rating & Stats */}
                    <div className="flex items-center gap-4 text-xs font-bold mb-5">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className="text-gray-900 dark:text-white">{Number(teacher.rating).toFixed(1)}</span>
                        <span className="text-gray-400 dark:text-gray-500">({teacher.reviews})</span>
                      </div>
                      <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {teacher.students} students
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {teacher.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-tight border border-gray-200/50 dark:border-gray-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Spacer to push content down */}
                    <div className="flex-1" />

                    {/* Experience & Rate */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-800 mb-6">
                      <div className="text-xs font-bold">
                        <span className="text-gray-400 uppercase tracking-tighter">Exp:</span>
                        <span className="ml-1.5 text-gray-900 dark:text-white">{teacher.experience}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                          ${teacher.hourlyRate}
                        </div>
                        <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">per hour</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full py-3.5 bg-linear-to-br from-indigo-600 to-purple-600 text-white text-center text-sm font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/20 group-hover:scale-[1.02] active:scale-[0.98]">
                      View Profile
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 dark:group-hover:from-indigo-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 lg:mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link 
            href="/tutors"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            View All Teachers
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10H16M16 10L11 5M16 10L11 15" />
            </svg>
          </Link>
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