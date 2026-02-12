import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTutorProfileDetail } from '@/app/services/tutor-profile.service';
import { TutorManageProfileClient } from './components/TutorManageProfileClient';

export const dynamic = 'force-dynamic';

const TutorManageProfilePage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const { data: profile, error } = await getTutorProfileDetail(cookieString);

  if (error?.message?.includes('401')) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Manage Your Profile
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium max-w-2xl">
            Update your expertise, rates, and personal details to attract more students.
          </p>
        </div>

        <TutorManageProfileClient initialProfile={profile} userRole="TUTOR" />
      </div>
    </div>
  );
};

export default TutorManageProfilePage;