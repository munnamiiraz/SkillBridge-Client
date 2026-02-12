import { cookies } from 'next/headers';
import { getStudentBookingsList } from '@/app/services/booking.service';
import { StatsOverview } from './components/StatsOverview';
import { BookingTabs } from './components/BookingTabs';
import { BookingFilters } from './components/BookingFilters';
import { BookingList } from './components/BookingList';
import { ClientWrapper } from './components/ClientWrapper';

interface PageProps {
  searchParams: Promise<{
    tab?: string;
    search?: string;
  }>;
}

export const dynamic = 'force-dynamic';

const StudentBookingsPage = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  const resolvedParams = await searchParams;
  const activeTab = (resolvedParams.tab || 'upcoming') as 'upcoming' | 'ongoing' | 'past' | 'needs-review';
  const searchQuery = resolvedParams.search || '';

  const { data: bookings, error } = await getStudentBookingsList(100, cookieString);

  if (error || !bookings) {
    return (
      <section className="relative w-full min-h-screen py-24 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl max-w-md mx-auto relative z-10">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-red-600 mb-6 font-medium">
            {error?.message || 'Failed to load your sessions'}
          </div>
          <a href="/dashboard/bookings" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            Refresh Page
          </a>
        </div>
      </section>
    );
  }

  // derived state
  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const ongoingBookings = bookings.filter((b) => b.status === 'ongoing');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const needsReviewBookings = bookings.filter((b) => b.status === 'completed' && !b.hasReview);

  const stats = {
    totalBookings: bookings.length,
    upcomingCount: upcomingBookings.length,
    ongoingCount: ongoingBookings.length,
    completedCount: bookings.filter((b) => b.status === 'completed').length,
    needsReviewCount: needsReviewBookings.length,
    totalSpent: bookings
      .filter((b) => b.payment.status === 'paid')
      .reduce((sum, b) => sum + b.payment.amount, 0),
    hoursLearned: bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + b.session.duration, 0) / 60,
  };

  const getFilteredBookings = () => {
    let filtered = bookings;
    
    if (activeTab === 'upcoming') {
      filtered = upcomingBookings;
    } else if (activeTab === 'ongoing') {
      filtered = ongoingBookings;
    } else if (activeTab === 'needs-review') {
      filtered = needsReviewBookings;
    } else {
      filtered = pastBookings;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((booking) =>
        booking.course.name.toLowerCase().includes(query) ||
        booking.tutor.name.toLowerCase().includes(query) ||
        booking.bookingNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  return (
    <section className="relative w-full min-h-screen py-24 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
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

      {/* Gradient Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg ring-4 ring-indigo-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                  My Sessions
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-medium">
                Track your learning journey and upcoming sessions
              </p>
            </div>
          </div>
        </div>

        <StatsOverview stats={stats} />

        <BookingTabs 
          activeTab={activeTab} 
          counts={{
            upcoming: stats.upcomingCount,
            ongoing: stats.ongoingCount,
            past: pastBookings.length,
            needsReview: stats.needsReviewCount
          }}
        />

        <BookingFilters 
          searchQuery={searchQuery} 
        />

        <ClientWrapper 
          bookings={getFilteredBookings()}
          activeTab={activeTab}
        />
      </div>
    </section>
  );
};

export default StudentBookingsPage;
