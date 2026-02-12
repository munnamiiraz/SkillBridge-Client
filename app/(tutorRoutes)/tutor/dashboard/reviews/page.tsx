import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { 
  getTutorRatingStats, 
  getTutorReviews,
  RatingStats 
} from '@/app/services/tutor-reviews.service';
import { PageHeader } from './components/PageHeader';
import { RatingOverview } from './components/RatingOverview';
import { TutorReviewsClient } from './components/TutorReviewsClient';

export const dynamic = 'force-dynamic';

const TutorReviewsPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const [statsResult, reviewsResult] = await Promise.all([
    getTutorRatingStats(cookieString),
    getTutorReviews(1, 5, null, 'recent', cookieString)
  ]);

  if (statsResult.error || reviewsResult.error) {
    if (statsResult.error?.message?.includes('401') || reviewsResult.error?.message?.includes('401')) {
      redirect('/login');
    }
  }

  const ratingStats: RatingStats = statsResult.data || {
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  const reviewsData = reviewsResult.data || {
    reviews: [],
    meta: { page: 1, limit: 5, total: 0, totalPages: 1 }
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

        <TutorReviewsClient 
          initialReviews={reviewsData.reviews} 
          initialMeta={reviewsData.meta} 
        />
      </div>
    </section>
  );
};

export default TutorReviewsPage;