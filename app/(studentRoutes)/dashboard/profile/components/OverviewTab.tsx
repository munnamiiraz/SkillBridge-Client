"use client"
import React from 'react';
import { StudentProfile, DashboardStats } from '@/app/services/student-dashboard.service';

interface OverviewTabProps {
  student: StudentProfile;
  stats: DashboardStats;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ student, stats }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'INACTIVE':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'BANNED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Personal Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 dark:text-white font-medium">{student.email}</p>
              {student.emailVerified && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Phone Number
            </label>
            <p className="text-gray-900 dark:text-white font-medium">{student.phone}</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Address
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {student.address || 'Not provided'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Account Status
            </label>
            <span className={`inline-block px-3 py-1 ${getStatusColor(student.status)} text-sm font-semibold rounded-full`}>
              {student.status}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Member Since
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Learning Journey
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Total Investment</h3>
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              ${stats.totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Invested in learning
            </p>
          </div>

          <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Learning Sessions</h3>
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold bg-linear-to-br from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {stats.completedSessions}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Completed sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
