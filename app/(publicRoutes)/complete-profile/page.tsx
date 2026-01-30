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

    const pendingRole = sessionStorage.getItem('pendingRole');
    if (pendingRole === 'STUDENT' || pendingRole === 'TUTOR') {
      setRole(pendingRole);
    }

    if (session?.user?.role && session?.user?.phone && session?.user?.phone !== 'N/A') {
        router.push('/');
    }
  }, [session, isPending, router]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    if (!phone || phone.length < 5) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsUpdating(true);
    try {
      await authClient.updateUser({
        role: role,
        phone: phone,
      } as any, {
        onSuccess: () => {
          toast.success('Profile completed! Welcome to SkillBridge.');
          sessionStorage.removeItem('pendingRole');
          router.push('/');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            SB
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Almost there!</h1>
          <p className="text-gray-600 dark:text-gray-400">Please complete your profile to continue</p>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Join as a <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === 'STUDENT'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('TUTOR')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === 'TUTOR'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                Tutor
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
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating || !role || !phone}
            className="w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
