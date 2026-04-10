"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Star, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { Tutor } from '@/app/services/tutor-public.service';

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <Link href={`/tutors/${tutor.id}`} className="block h-full group">
      <article className="relative h-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_100px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_30px_100px_rgba(79,70,229,0.25)] hover:border-indigo-500/20 dark:hover:border-indigo-500/30 flex flex-col">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Card Header / Banner */}
        <div className="relative h-32 shrink-0 overflow-hidden">
          {tutor.banner ? (
            <img 
              src={tutor.banner} 
              alt={`${tutor.name}'s banner`} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
          ) : (
            <div className={`absolute inset-0 bg-linear-to-br ${tutor.bgGradient} opacity-80 group-hover:scale-105 transition-transform duration-1000`} />
          )}
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-transparent" />
          
          {/* Verified Badge - Floating Top Right */}
          {tutor.role === 'VERIFIED_TUTOR' && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full text-white animate-in fade-in zoom-in duration-500">
              <CheckCircle2 size={12} className="fill-blue-400 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
            </div>
          )}
        </div>

        <div className="relative px-8 pb-8 flex-1 flex flex-col -mt-14">
          {/* Profile Section */}
          <div className="flex justify-between items-end mb-6">
            <div className="relative">
              <div className={`p-1 w-28 h-28 rounded-[2rem] bg-linear-to-br ${tutor.bgGradient} shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3`}>
                <div className="relative w-full h-full rounded-[1.75rem] bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-950 overflow-hidden flex items-center justify-center">
                  {tutor.avatar.length > 2 ? (
                    <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`text-3xl font-black bg-linear-to-br ${tutor.bgGradient} bg-clip-text text-transparent`}>{tutor.avatar}</span>
                  )}
                </div>
              </div>
              {/* Online Pulse */}
              {tutor.isOnline && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-950 rounded-full shadow-lg">
                  <span className="absolute inset-0 animate-ping bg-green-500 rounded-full opacity-75"></span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 pb-2">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400/10 dark:bg-yellow-400/5 backdrop-blur-md border border-yellow-400/20 dark:border-yellow-400/10 rounded-[1.25rem] text-yellow-600 dark:text-yellow-400 shadow-sm transition-colors group-hover:bg-yellow-400/20">
                <Star size={14} className="fill-current" />
                <span className="text-sm font-black tracking-tight">{tutor.rating.toFixed(1)}</span>
                <span className="text-xs font-bold opacity-60">({tutor.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Identity & Bio */}
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors">
                {tutor.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/10">
                  {tutor.subject}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                  <Users size={12} />
                  <span>{tutor.totalStudents} Learners</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 italic font-medium">
              &quot;{tutor.bio}&quot;
            </p>

            <div className="pt-6 mt-auto border-t border-gray-100/50 dark:border-gray-800/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-1">Session Rate</p>
                <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                  ${tutor.pricePerSession}<span className="text-xs text-gray-400 font-bold tracking-normal ml-0.5">/hr</span>
                </div>
              </div>

              <div className="relative group/btn h-12 px-6 flex items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl text-white font-black text-sm tracking-tight shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  View Profile
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
                {/* Glint Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TutorCard;
