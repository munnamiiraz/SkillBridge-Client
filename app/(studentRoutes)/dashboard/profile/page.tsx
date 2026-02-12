import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStudentProfile, getStudentBookings, calculateDashboardStats } from '@/app/services/student-dashboard.service';
import { ProfileHeader } from './components/ProfileHeader';
import { StatsCards } from './components/StatsCards';
import { ProfileTabs } from './components/ProfileTabs';
import { OverviewTab } from './components/OverviewTab';
import { BookingsTab } from './components/BookingsTab';
import { ReviewsTab } from './components/ReviewsTab';

interface PageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export const dynamic = 'force-dynamic';

const StudentProfilePage = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  const resolvedParams = await searchParams;
  const activeTab = (resolvedParams.tab || 'overview') as 'overview' | 'bookings' | 'reviews';

  const [profileResult, bookingsResult] = await Promise.all([
    getStudentProfile(),
    getStudentBookings(100, cookieString)
  ]);

  if (profileResult.error || !profileResult.data) {
    redirect('/');
  }

  const student = profileResult.data;
  const bookings = bookingsResult.data || [];
  const stats = await calculateDashboardStats(bookings);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <ProfileHeader student={student} />
        
        <StatsCards stats={stats} />

        {/* Tabbed Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          <ProfileTabs activeTab={activeTab} />

          <div className="p-6 lg:p-8">
            {activeTab === 'overview' && (
              <OverviewTab student={student} stats={stats} />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab bookings={bookings} />
            )}

            {activeTab === 'reviews' && (
              <ReviewsTab bookings={bookings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;