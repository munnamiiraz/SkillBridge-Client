"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Category, CategoryService } from '@/app/admin/categories.service';
import { useRouter } from 'next/navigation';

interface DeleteModalProps {
  category: Category;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ category, onClose }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await CategoryService.delete(category.id);
      if (result.success) {
        toast.success('Category deleted successfully');
        onClose();
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Gradient Header */}
        <div className="relative p-6 bg-linear-to-br from-red-500 to-orange-500 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Delete Category</h3>
              <p className="text-sm text-white/80">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Category Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex items-center gap-4 border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg shrink-0">
              📚
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {category.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.tutorCount} tutors · {category.courseCount} courses
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                  Warning: Permanent Action
                </h4>
                <p className="text-xs text-red-800 dark:text-red-400">
                  Deleting this category will affect {category.tutorCount} tutors. 
                  All associated data will need to be reassigned or removed.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-linear-to-br from-red-600 to-orange-600 text-white font-bold rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all shadow-lg shadow-red-500/30 disabled:opacity-50 active:scale-95"
            >
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
