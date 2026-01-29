'use client';

import React from 'react';
import { TutorProfileInfo, TutorBookingCard } from '@/components/tutor-profile/TutorProfileHeader';
import { TutorAboutContent, TutorQuickStatsSidebar } from '@/components/tutor-profile/TutorAboutAndSubjects';
import TutorAvailabilityReviewsCTA from '@/components/tutor-profile/TutorAvailabilityReviewsCTA';

const TutorProfilePage: React.FC = () => {
  // Centralized Tutor Data
  const tutorData = {
    header: {
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ',
      primarySubjects: ['Advanced Mathematics', 'Physics'],
      tagline: 'Helping students master complex concepts through clarity and patience',
      rating: 4.9,
      reviewCount: 234,
      totalStudents: 450,
      responseTime: '< 2 hours',
      pricePerSession: 65,
      sessionDuration: '60 min',
      availability: 'Available Today',
      isAvailable: true,
      verified: true,
      bgGradient: 'from-indigo-500 to-purple-500',
    },
    about: {
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
    },
    subjects: [
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
    ],
    availability: {
      timezone: 'EST (UTC-5)',
      weekSchedule: [
        { day: 'Mon', slots: ['9:00 AM', '2:00 PM', '4:00 PM'], available: true },
        { day: 'Tue', slots: ['10:00 AM', '3:00 PM'], available: true },
        { day: 'Wed', slots: ['9:00 AM', '1:00 PM', '4:00 PM'], available: true },
        { day: 'Thu', slots: ['11:00 AM', '3:00 PM'], available: true },
        { day: 'Fri', slots: ['9:00 AM', '2:00 PM'], available: true },
        { day: 'Sat', slots: ['10:00 AM'], available: true },
        { day: 'Sun', slots: [], available: false },
      ],
    },
    reviews: {
      stats: {
        averageRating: 4.9,
        totalReviews: 234,
        breakdown: [
          { stars: 5, count: 198, percentage: 85 },
          { stars: 4, count: 28, percentage: 12 },
          { stars: 3, count: 6, percentage: 2 },
          { stars: 2, count: 2, percentage: 1 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      },
      recent: [
        {
          name: 'Emily Rodriguez',
          avatar: 'ER',
          rating: 5,
          date: '2 weeks ago',
          subject: 'Calculus II',
          review: 'Dr. Johnson is an exceptional tutor! She explained complex derivative concepts in a way that finally made sense to me. My exam scores improved dramatically after just 3 sessions.',
          verified: true,
        },
        {
          name: 'Michael Chen',
          avatar: 'MC',
          rating: 5,
          date: '1 month ago',
          subject: 'AP Physics',
          review: 'Patient, knowledgeable, and genuinely cares about student success. The real-world examples she uses make physics actually interesting. Highly recommend!',
          verified: true,
        },
        {
          name: 'Jessica Williams',
          avatar: 'JW',
          rating: 4,
          date: '1 month ago',
          subject: 'Linear Algebra',
          review: 'Very helpful sessions. She breaks down problems step-by-step and ensures I understand before moving on. Would have given 5 stars but scheduling was a bit tricky.',
          verified: true,
        },
        {
          name: 'David Park',
          avatar: 'DP',
          rating: 5,
          date: '2 months ago',
          subject: 'SAT Math',
          review: 'Raised my SAT math score by 140 points! Her test-taking strategies and focused practice materials were game-changers. Worth every penny.',
          verified: true,
        },
      ],
    },
    summary: {
      name: 'Dr. Sarah Johnson',
      subjects: 'Mathematics & Physics',
      experience: '8 years',
      students: 450,
      rating: 4.9,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column - Core Information */}
            <div className="lg:col-span-2 space-y-12">
              <TutorProfileInfo tutor={tutorData.header} />
              <TutorAboutContent 
                about={tutorData.about} 
                subjects={tutorData.subjects} 
              />
            </div>

            {/* Right Column - Unified Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <TutorBookingCard tutor={tutorData.header} />
                <TutorQuickStatsSidebar />
                
                {/* Quick Info Below Card */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 text-center">
                    🎉 <span className="font-semibold">First session 50% off</span> for new students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TutorAvailabilityReviewsCTA 
        availability={tutorData.availability}
        reviewStats={tutorData.reviews.stats}
        recentReviews={tutorData.reviews.recent}
        tutorSummary={tutorData.summary}
      />
    </div>
  );
};

export default TutorProfilePage;