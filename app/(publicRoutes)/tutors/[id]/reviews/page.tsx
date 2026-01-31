'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
  booking: {
    scheduledAt: string;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const TutorReviewsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const tutorId = params?.id as string;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [tutorName, setTutorName] = useState<string>('Tutor');

  useEffect(() => {
    if (!tutorId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tutor basic info for the header
        const tutorRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/tutors/${tutorId}`);
        if (tutorRes.data.success) {
            setTutorName(tutorRes.data.data.user.name);
        }

        // Fetch reviews
        await fetchReviews(1);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId]);

  const fetchReviews = async (page: number) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/reviews`, {
        params: {
          tutorProfileId: tutorId,
          page,
          limit: 10,
        },
      });

      if (response.data.success) {
        setReviews(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= meta.totalPages) {
          fetchReviews(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={`/tutors/${tutorId}`}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 mb-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reviews for {tutorName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              See what students are saying about their learning experience.
            </p>
          </div>
          <div className="hidden sm:block">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
              </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {review.user.image ? (
                        <img 
                            src={review.user.image} 
                            alt={review.user.name} 
                            className="w-12 h-12 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {review.user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {review.user.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(review.createdAt)}
                          {review.booking?.scheduledAt && (
                              <> • Session on {formatDate(review.booking.scheduledAt)}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-800">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                        <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews yet for this tutor.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center pt-4 pb-8">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-1">
                  {[...Array(meta.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Simple pagination logic to show limited range could be added here if many pages
                      return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                meta.page === pageNum
                                    ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {pageNum}
                        </button>
                      );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorReviewsPage;
