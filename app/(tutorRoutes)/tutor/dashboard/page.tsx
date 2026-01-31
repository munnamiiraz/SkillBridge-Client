'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function TutorDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sessions as the default dashboard view for tutors
    router.replace('/tutor/dashboard/sessions');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );
}
