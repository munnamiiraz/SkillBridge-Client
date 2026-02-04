"use client"
import React from 'react';
import { Review } from '@/app/services/tutor-reviews.service';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ 
  reviews, 
  loading, 
  hasMore, 
  onLoadMore 
}) => {
  return (
    <>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={onLoadMore}
          disabled={!hasMore || loading}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-indigo-600 hover:to-purple-600 text-gray-700 dark:text-gray-300 hover:text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Loading...' : hasMore ? 'Load More Reviews' : 'No More Reviews'}</span>
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </>
  );
};
