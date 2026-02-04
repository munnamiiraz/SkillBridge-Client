"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  TutorReviewsService, 
  Review, 
  RatingStats 
} from '@/app/services/tutor-reviews.service';

import { PageHeader } from './components/PageHeader';
import { RatingOverview } from './components/RatingOverview';
import { ReviewsFilter } from './components/ReviewsFilter';
import { ReviewsList } from './components/ReviewsList';

const TutorReviewsPage: React.FC = () => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, [sortBy, filterRating]);

  const fetchData = async () => {
      // Reset reviews when filter/sort changes
      setPage(1);
      setLoading(true);
      await Promise.all([
          fetchRatingStats(),
          fetchReviews(1)
      ]);
      setLoading(false);
  }

  const loadMore = () => {
    if (hasMore && !loading) {
        fetchReviews(page + 1);
    }
  };

  const fetchRatingStats = async () => {
    try {
      const stats = await TutorReviewsService.getRatingStats();
      if (stats) {
        setRatingStats(stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchReviews = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true); // Only show full loader on first page/filter change

      const response = await TutorReviewsService.getReviews(pageNum, 5, filterRating, sortBy);

      if (response) {
        if (pageNum === 1) {
            setReviews(response.reviews);
        } else {
            setReviews(prev => [...prev, ...response.reviews]);
        }
        
        setHasMore(response.meta.page < response.meta.totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      if (pageNum === 1) setLoading(false);
    }
  };

  return (
    <section className="relative w-full py-24 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <PageHeader />

        <RatingOverview stats={ratingStats} />

        <ReviewsFilter 
          filterRating={filterRating} 
          setFilterRating={setFilterRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ReviewsList 
          reviews={reviews} 
          loading={loading && page === 1} // Only show skeleton/loading state if refreshing list
          hasMore={hasMore} 
          onLoadMore={loadMore} 
        />
      </div>
    </section>
  );
};

export default TutorReviewsPage;