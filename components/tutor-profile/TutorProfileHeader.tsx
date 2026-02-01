'use client';

import Link from 'next/link';

interface TutorProfileHeaderProps {
  tutor: {
    id: string;
    name: string;
    avatar: string;
    primarySubjects: string[];
    tagline: string;
    rating: number;
    reviewCount: number;
    totalStudents: number;
    responseTime: string;
    pricePerSession: number;
    sessionDuration: string;
    availability: string;
    isAvailable: boolean;
    verified: boolean;
    bgGradient: string;
  };
}

export const TutorProfileInfo: React.FC<TutorProfileHeaderProps> = ({ tutor }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-linear-to-br ${tutor.bgGradient} flex items-center justify-center text-white font-bold text-4xl sm:text-5xl shadow-2xl border-4 border-white dark:border-gray-900 overflow-hidden`}>
          {tutor.avatar?.startsWith('http') || tutor.avatar?.startsWith('/') ? (
            <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
          ) : (
            tutor.avatar
          )}
        </div>
        {/* Verified Badge */}
        {tutor.verified && (
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        {/* Name and Subjects */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {tutor.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-3">
            {tutor.primarySubjects.map((subject, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 font-semibold text-sm rounded-full border border-indigo-100 dark:border-indigo-800"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          {tutor.tagline}
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{tutor.rating}</span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              ({tutor.reviewCount} reviews)
            </span>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

          {/* Students */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-semibold text-gray-900 dark:text-white">{tutor.totalStudents}</span>
            <span>students</span>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>

          {/* Response Time */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-gray-900 dark:text-white">{tutor.responseTime}</span>
            <span>response</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TutorBookingCard: React.FC<TutorProfileHeaderProps> = ({ tutor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
      {/* Availability Banner */}
      {tutor.isAvailable && (
        <div className="bg-linear-to-r from-green-500 to-emerald-500 px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-white font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            {tutor.availability}
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Pricing */}
        <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-5xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              ${tutor.pricePerSession}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-lg mb-2">/ session</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tutor.sessionDuration} sessions
          </p>
        </div>

        {/* Session Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Duration</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{tutor.sessionDuration}</span>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Format</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">1-on-1 Online</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <Link 
            href={`/tutors/${tutor.id}/book-sessions`}
            className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a Session
          </Link>

          <button className="w-full py-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Message
          </button>
        </div>

        {/* Trust Badge */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Money-Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
