'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/app/services/tutor-reviews-public.helpers';
import { Header } from './Header';
import { ReviewList } from './ReviewList';
import { Pagination } from './Pagination';

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

interface TutorReviewsClientProps {
  tutorId: string;
  tutorName: string;
  initialReviews: Review[];
  initialMeta: Meta;
}

export const TutorReviewsClient: React.FC<TutorReviewsClientProps> = ({
  tutorId,
  tutorName,
  initialReviews,
  initialMeta,
}) => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const result = await apiClient.get(`/api/public/reviews?tutorProfileId=${tutorId}&page=${page}&limit=10`);

      if (result.success) {
        setReviews(result.data);
        setMeta(result.meta);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchReviews(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header tutorId={tutorId} tutorName={tutorName} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <ReviewList reviews={reviews} formatDate={formatDate} />
        )}

        {meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
