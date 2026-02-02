'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Link from 'next/link';

const VerifyEmailContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        if (!token) {
            setStatus('invalid');
            setMessage('Invalid or missing verification token.');
            return;
        }

        const verify = async () => {
            try {
                await authClient.verifyEmail({
                    query: {
                        token: token
                    }
                }, {
                    onSuccess: () => {
                        setStatus('success');
                        setMessage('Your email has been successfully verified! You can now log in.');
                        toast.success('Email verified successfully!');
                        // Auto redirect after 3 seconds
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    },
                    onError: (ctx) => {
                        setStatus('error');
                        setMessage(ctx.error.message || 'Failed to verify email. The link may have expired.');
                        toast.error(ctx.error.message || 'Verification failed');
                    }
                });
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
                setMessage('An unexpected error occurred during verification.');
                toast.error('Something went wrong');
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-24 -mt-24"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-24 -mb-24"></div>

            <div className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <svg className={`w-10 h-10 ${status === 'loading' ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {status === 'loading' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        )}
                        {status === 'success' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        )}
                        {(status === 'error' || status === 'invalid') && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {status === 'loading' && 'Verifying Email'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                    {status === 'invalid' && 'Invalid Link'}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link
                        href="/login"
                        className="inline-block w-full py-4 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Go to Login
                    </Link>
                )}

                {status === 'loading' && (
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4 mx-auto animate-pulse"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

const VerifyEmailPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmailPage;
