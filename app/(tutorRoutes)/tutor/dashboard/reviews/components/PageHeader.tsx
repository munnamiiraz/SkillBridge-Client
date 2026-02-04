"use client"
import React from 'react';

export const PageHeader: React.FC = () => {
  return (
    <div className="mb-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Reviews & Ratings
        </span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        See what your students are saying about their learning experience with you.
      </p>
    </div>
  );
};
