"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Category, CategoryService } from '@/app/admin/categories.service';
import { useRouter } from 'next/navigation';

interface CategoryModalProps {
  category?: Category | null;
  onClose: () => void;
  mode: 'create' | 'edit';
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onClose, mode }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    status: (category?.status || 'active') as 'active' | 'inactive',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status.toUpperCase(),
      };

      const result = mode === 'create' 
        ? await CategoryService.create(payload)
        : await CategoryService.update(category!.id, payload);

      if (result.success) {
        toast.success(`Category ${mode === 'create' ? 'created' : 'updated'} successfully`);
        onClose();
        router.refresh();
      } else {
        toast.error(result.message || 'Action failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Gradient Header */}
        <div className="relative p-6 bg-linear-to-br from-indigo-500 to-purple-500 text-white overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {mode === 'create' ? 'Create New Category' : 'Edit Category'}
              </h3>
              <p className="text-sm text-white/80">
                {mode === 'create' ? 'Add a new category for tutors to use' : 'Update category information'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 ml-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Web Development"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 ml-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this category is about..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 ml-1">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={`flex-1 px-4 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                  formData.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'inactive' })}
                className={`flex-1 px-4 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                  formData.status === 'inactive'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-500 shadow-md scale-102'
                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${formData.status === 'inactive' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.description.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              {isSubmitting ? 'Processing...' : mode === 'create' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CategoryModal;
