"use client"
import React from 'react';
import { Review, TutorReviewsService } from '@/app/services/tutor-reviews.service';
import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  review: Review;
  index: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  return (
    <div
      className="group relative p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Avatar & Student Info */}
        <div className="flex items-start gap-4 lg:w-64 shrink-0">
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
            {typeof review.studentAvatar === 'string' && review.studentAvatar.length > 2 ? (
                <img src={review.studentAvatar} alt={review.studentName} className="w-full h-full object-cover" />
            ) : (
                review.studentAvatar
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {review.studentName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {review.courseName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {TutorReviewsService.formatDate(review.date)}
            </p>
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <RatingStars rating={review.rating} />
            <span className="px-3 py-1 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {review.rating}.0
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {review.comment}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="group/btn flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-linear-to-br hover:from-indigo-500 hover:to-purple-500 hover:text-white text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span>Helpful ({review.helpful})</span>
            </button>

            <button
              type="button"
              className="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
