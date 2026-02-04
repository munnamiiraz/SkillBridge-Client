"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Category, CategoryService } from '@/app/admin/categories.service';
import { useRouter } from 'next/navigation';
import CategoryModal from './CategoryModal';
import DeleteModal from './DeleteModal';

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    setIsToggling(true);
    const newStatus = category.status === 'active' ? 'INACTIVE' : 'ACTIVE';
    try {
      const result = await CategoryService.update(category.id, { status: newStatus });
      if (result.success) {
        toast.success(`Category ${newStatus.toLowerCase()} successfully`);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to toggle status');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsToggling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl shadow-lg">
          📚
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              category.status === 'active'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {category.description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {category.tutorCount}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">tutors</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {category.courseCount}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">courses</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={isToggling}
          className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all duration-200 ${
            category.status === 'active'
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              : 'bg-linear-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
          }`}
        >
          {isToggling ? 'Wait...' : category.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
        <button
          type="button"
          onClick={() => setShowEditModal(true)}
          className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-all"
          title="Edit"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-all"
          title="Delete"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Updated {formatDate(category.updatedAt)}
      </p>

      {/* Modals */}
      {showEditModal && (
        <CategoryModal 
          category={category} 
          mode="edit" 
          onClose={() => setShowEditModal(false)} 
        />
      )}
      {showDeleteModal && (
        <DeleteModal 
          category={category} 
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
};

export default CategoryCard;
