"use client"
import React from 'react';
import { Category } from '@/app/admin/categories.service';

interface CategoryStatsProps {
  categories: Category[];
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ categories }) => {
  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter((c) => c.status === 'active').length,
    inactiveCategories: categories.filter((c) => c.status === 'inactive').length,
    totalTutors: categories.reduce((sum, c) => sum + c.tutorCount, 0),
    totalCourses: categories.reduce((sum, c) => sum + c.courseCount, 0),
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCategories}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeCategories}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-100 dark:border-red-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inactiveCategories}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tutors</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalTutors}</p>
      </div>

      <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
      </div>
    </div>
  );
};

export default CategoryStats;
