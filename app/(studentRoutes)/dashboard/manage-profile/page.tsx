import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getStudentProfileData } from '@/app/services/student-profile.service';
import { ManageProfileClient } from './components/ManageProfileClient';

export const dynamic = 'force-dynamic';

const StudentManageProfilePage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const { data: profile, error } = await getStudentProfileData(cookieString);

  if (error || !profile) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            My Account Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Customize your learning profile and personal information.
          </p>
        </div>

        <ManageProfileClient initialProfile={profile} />
      </div>
    </div>
  );
};

export default StudentManageProfilePage;