"use client";

import React, { useState, useEffect } from 'react';
import CategoryModal from './CategoryModal';

const CategoryToolbar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Category Management
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Create and manage course categories for tutors
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="group inline-flex items-center gap-2 px-6 py-4 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CategoryModal mode="create" onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

export default CategoryToolbar;
