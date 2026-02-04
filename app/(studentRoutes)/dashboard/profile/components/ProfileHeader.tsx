"use client"
import React from 'react';
import Link from 'next/link';
import { StudentProfile } from '@/app/services/student-dashboard.service';

interface ProfileHeaderProps {
  student: StudentProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ student }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden mb-8">
      {/* Cover Background */}
      <div className="h-32 bg-linear-to-br from-indigo-500 to-purple-500 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Profile Content */}
      <div className="px-6 sm:px-8 lg:px-10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-20 sm:-mt-16 gap-6">
          
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white dark:border-gray-900 overflow-hidden">
                {student.image ? (
                  <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(student.name)
                )}
              </div>
              {/* Verified Badge */}
              {student.emailVerified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name and Info */}
            <div className="text-center sm:text-left space-y-2">
              <div className='mt-[100px] sm:mt-0'>
                <h1 className="text-3xl lg:text-4xl mt-[85px] font-bold text-gray-900 dark:text-white">
                  {student.name || 'Student'}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full">
                    Student
                  </span>
                  <span className={`px-3 py-1 ${
                    student.status === 'ACTIVE'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                  } text-sm font-semibold rounded-full`}>
                    {student.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Member since {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Manage Profile Button */}
          <Link href='/dashboard/manage-profile' className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Manage Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
