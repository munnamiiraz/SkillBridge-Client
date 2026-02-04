"use client";

import React from 'react';
import Link from 'next/link';
import { Tutor } from '@/app/services/tutor-public.service';

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <Link href={`/tutors/${tutor.id}`} className="block">
      <article className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] h-full">
        {/* Card Header with Gradient Background */}
        <div className={`h-24 bg-linear-to-br ${tutor.bgGradient} relative overflow-hidden`}>
          {/* Abstract Pattern Overlay */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />
        </div>

        <div className="relative px-6 pb-6 -mt-12">
          {/* Avatar Section */}
          <div className="flex justify-between items-end mb-4">
            <div className="relative">
              <div className={`w-24 h-24 rounded-2xl bg-linear-to-br ${tutor.bgGradient} p-1 shadow-lg`}>
                <div className="w-full h-full rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white font-bold text-2xl border-2 border-white dark:border-gray-800 overflow-hidden">
                  {tutor.avatar.length > 2 ? (
                    <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`bg-linear-to-br ${tutor.bgGradient} bg-clip-text text-transparent`}>{tutor.avatar}</span>
                  )}
                </div>
              </div>
              {/* Status Indicator */}
              {tutor.isOnline && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 border-4 border-white dark:border-gray-800 shadow-sm"></span>
                </div>
              )}
              {/* Verified Badge */}
              {tutor.verified && (
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-800 shadow-sm z-10">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end pb-2">
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800 shadow-sm">
                <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{tutor.rating}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">({tutor.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Info Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 truncate">
                {tutor.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
                  {tutor.subject}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {tutor.totalStudents} Students
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 min-h-18">
              {tutor.bio}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-0.5">Session Price</p>
                <div className="text-2xl font-black bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  ${tutor.pricePerSession}<span className="text-xs font-medium text-gray-500 dark:text-gray-400">/hr</span>
                </div>
              </div>
              
              <div className="relative group/btn overflow-hidden px-5 py-2.5 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  View Profile
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TutorCard;
