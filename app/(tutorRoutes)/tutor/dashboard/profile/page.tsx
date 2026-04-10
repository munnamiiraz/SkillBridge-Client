import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTutorProfileDetail } from '@/app/services/tutor-profile.service';
import { TutorProfileInfo, TutorBookingCard } from '../../../../../components/tutor-profile/TutorProfileHeader';
import { TutorAboutContent, TutorQuickStatsSidebar } from '../../../../../components/tutor-profile/TutorAboutAndSubjects';
import TutorAvailabilityReviewsCTA from '../../../../../components/tutor-profile/TutorAvailabilityReviewsCTA';

export const dynamic = 'force-dynamic';

const TutorProfilePage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const { data: profile, error } = await getTutorProfileDetail(cookieString);

  if (error || !profile) {
    if (error?.message?.includes('401')) {
      redirect('/');
    }
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error?.message || 'Profile could not be found.'}</p>
          <a href="/tutor/dashboard/profile" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold">Retry</a>
        </div>
      </div>
    );
  }

  // Map business subjects to categories
  const categoryMap: Record<string, any[]> = {};
  profile.tutor_subject?.forEach((ts) => {
    const catName = ts.subject.category.name;
    if (!categoryMap[catName]) {
      categoryMap[catName] = [];
    }
    categoryMap[catName].push({ name: ts.subject.name, level: 'Advanced' }); 
  });

  const subjects = Object.entries(categoryMap).map(([category, skills]) => ({
    category,
    skills,
  }));

  const initials = (profile.user.name || 'T')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  // Map availability slots
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekSchedule = dayNames.map((day, index) => {
    const dayInt = index + 1; // 1 = Monday, ..., 7 = Sunday
    const slots = profile.availability_slot
      ?.filter((s) => s.dayOfWeek === dayInt)
      .map((s) => s.startTime) || [];
    return {
      day,
      slots,
      available: slots.length > 0
    };
  });

  const tutorData = {
    header: {
      id: profile.id,
      name: profile.user.name,
      avatar: profile.user.image || initials,
      primarySubjects: profile.tutor_subject?.slice(0, 2).map((ts) => ts.subject.name) || [],
      tagline: profile.headline || 'SkillBridge Tutor',
      rating: profile.ratingStats?.averageRating || profile.averageRating || 0,
      reviewCount: profile.ratingStats?.totalReviews || profile.totalReviews || 0,
      totalStudents: profile.totalSessions || 0,
      responseTime: '< 2 hours',
      pricePerSession: profile.hourlyRate,
      sessionDuration: '60 min',
      availability: profile.isAvailable ? 'Available Today' : 'Unavailable',
      isAvailable: profile.isAvailable,
      verified: true,
      bgGradient: 'from-indigo-500 to-purple-500',
      banner: (profile as any).banner || '',
    },
    about: {
      bio: profile.bio || 'Welcome to my profile! I am looking forward to helping you learn.',
      teachingStyle: [
        {
          title: 'Student-Centered Learning',
          description: 'I adapt my teaching methods to match your learning style and pace.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          title: 'Interactive Methods',
          description: 'Engaging sessions with real-world examples and problems.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
        },
        {
          title: 'Goal Oriented',
          description: 'Focused on achieving your specific learning objectives.',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          ),
        },
      ],
      experience: [
        {
          role: 'Tutor',
          organization: 'SkillBridge',
          year: 'Present',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    subjects: subjects.length > 0 ? subjects : [{ category: 'General', skills: [{ name: 'Teaching', level: 'Expert' }] }],
    availability: {
      timezone: 'Auto-detected',
      weekSchedule,
    },
    reviews: {
      stats: {
        averageRating: profile.ratingStats?.averageRating || profile.averageRating || 0,
        totalReviews: profile.ratingStats?.totalReviews || profile.totalReviews || 0,
        breakdown: Array.isArray(profile.ratingStats?.distribution) 
          ? profile.ratingStats?.distribution 
          : [
            { stars: 5, count: 0, percentage: 0 },
            { stars: 4, count: 0, percentage: 0 },
            { stars: 3, count: 0, percentage: 0 },
            { stars: 2, count: 0, percentage: 0 },
            { stars: 1, count: 0, percentage: 0 },
          ],
      },
      recent: [],
    },
    summary: {
      id: profile.id,
      name: profile.user.name,
      subjects: profile.tutor_subject && profile.tutor_subject.length > 0 
        ? profile.tutor_subject[0].subject.name 
        : 'Various',
      experience: `${profile.experience} years`,
      students: profile.totalSessions || 0,
      rating: profile.ratingStats?.averageRating || profile.averageRating || 0,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Premium Banner Section */}
      <section className="relative h-[250px] lg:h-[350px] w-full overflow-hidden">
        {tutorData.header.banner ? (
          <img 
            src={tutorData.header.banner} 
            alt="Profile Banner" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${tutorData.header.bgGradient}`} />
        )}
        
        {/* Overlays for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-white dark:to-gray-950" />
        <div className="absolute inset-0 backdrop-blur-[1px] opacity-20" />
      </section>

      <section className="relative w-full -mt-20 lg:-mt-28 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column - Core Information */}
            <div className="lg:col-span-2 space-y-12">
              <TutorProfileInfo tutor={tutorData.header} />
              <TutorAboutContent 
                about={tutorData.about} 
                subjects={tutorData.subjects} 
              />
            </div>

            {/* Right Column - Unified Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <TutorBookingCard tutor={tutorData.header} />
                <TutorQuickStatsSidebar />
                
                {/* Quick Info Below Card */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 text-center">
                    🎉 <span className="font-semibold">Professional Profile</span> - Public View
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TutorAvailabilityReviewsCTA 
        availability={tutorData.availability}
        reviewStats={tutorData.reviews.stats}
        recentReviews={tutorData.reviews.recent}
        tutorSummary={tutorData.summary}
      />
    </div>
  );
};

export default TutorProfilePage;