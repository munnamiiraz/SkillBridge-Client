import { cookies } from 'next/headers';
import { getReviewableBookings } from '@/app/services/student-reviews.service';
import { ReviewsClient } from './components/ReviewsClient';

export const dynamic = 'force-dynamic';

const StudentReviewsPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const { data: bookings, error } = await getReviewableBookings(cookieString);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-md">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-red-600 mb-6 font-medium">
            {error.message || 'Failed to load reviewable sessions'}
          </div>
          <a href="/dashboard/reviews" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            Refresh Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leave Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400">Rate your completed tutoring sessions</p>
        </div>

        <ReviewsClient initialBookings={bookings || []} />
      </div>
    </div>
  );
};

export default StudentReviewsPage;
