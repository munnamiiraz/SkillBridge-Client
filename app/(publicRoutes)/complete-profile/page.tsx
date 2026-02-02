'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CompleteProfilePage: React.FC = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [role, setRole] = useState<'STUDENT' | 'TUTOR' | null>(null);
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
      return;
    }

    // If session is already complete (has role and phone), redirect home
    if (session?.user?.role && session?.user?.phone && session?.user?.phone !== 'N/A') {
        router.push('/');
    }
  }, [session, isPending, router]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 5) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!role) {
      toast.error('Please select how you want to use SkillBridge');
      return;
    }

    setIsUpdating(true);
    try {
      // Step 1: Update basic profile (including role if student)
      // Actually we keep role as STUDENT here. If they chose TUTOR, we'll redirect.
      await authClient.updateUser({
        phone: phone,
      } as any, {
        onSuccess: () => {
          if (role === 'TUTOR') {
            toast.success('Basic info saved! Now tell us about your teaching skills.');
            router.push('/become-tutor');
          } else {
            toast.success('Profile completed! Welcome to SkillBridge.');
            router.push('/');
          }
          router.refresh();
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message || 'Failed to update profile');
        }
      });
    } catch (err) {
      console.error('Update error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            SB
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome!</h1>
          <p className="text-gray-600 dark:text-gray-400">Let's finish setting up your account</p>
        </div>

        <form onSubmit={handleComplete} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              What brings you to SkillBridge? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  role === 'STUDENT'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                    : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className={`p-3 rounded-xl ${role === 'STUDENT' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className={`font-bold ${role === 'STUDENT' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'}`}>I want to Learn</div>
                  <div className="text-xs text-gray-500">Access thousands of experts</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('TUTOR')}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                  role === 'TUTOR'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                    : 'border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className={`p-3 rounded-xl ${role === 'TUTOR' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className={`font-bold ${role === 'TUTOR' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-700 dark:text-gray-300'}`}>I want to Teach</div>
                  <div className="text-xs text-gray-500">Share knowledge & earn money</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-white">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+1 (555) 000-0000"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating || !role || !phone}
            className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isUpdating ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
