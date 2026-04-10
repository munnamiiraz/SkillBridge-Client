'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getTutorReviews, 
  Review, 
  ReviewsResponse 
} from '@/app/services/tutor-reviews.service';
import { ReviewsFilter } from './ReviewsFilter';
import { ReviewsList } from './ReviewsList';

interface TutorReviewsClientProps {
  initialReviews: Review[];
  initialMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const TutorReviewsClient: React.FC<TutorReviewsClientProps> = ({ initialReviews, initialMeta }) => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialMeta.page);
  const [hasMore, setHasMore] = useState(initialMeta.page < initialMeta.totalPages);


  useEffect(() => {
    fetchInitialData();
  }, [sortBy, filterRating]);

  const fetchInitialData = async () => {
      setPage(1);
      setLoading(true);
      try {
          const result = await getTutorReviews(1, 5, filterRating, sortBy);
          if (result.data) {
              setReviews(result.data.reviews);
              setHasMore(result.data.meta.page < result.data.meta.totalPages);
          } else {
              toast.error(result.error?.message || 'Failed to load reviews');
          }
      } catch (error) {
          toast.error('An unexpected error occurred');
      } finally {
          setLoading(false);
      }
  }

  const loadMore = async () => {
    if (hasMore && !loading) {
        try {
            const nextPage = page + 1;
            const result = await getTutorReviews(nextPage, 5, filterRating, sortBy);
            if (result.data) {
                setReviews(prev => [...prev, ...result.data!.reviews]);
                setHasMore(result.data.meta.page < result.data.meta.totalPages);
                setPage(nextPage);
            }
        } catch (error) {
            toast.error('Failed to load more reviews');
        }
    }
  };

  return (
    <>
      <ReviewsFilter 
        filterRating={filterRating} 
        setFilterRating={setFilterRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <ReviewsList 
        reviews={reviews} 
        loading={loading} 
        hasMore={hasMore} 
        onLoadMore={loadMore} 
      />
    </>
  );
};
