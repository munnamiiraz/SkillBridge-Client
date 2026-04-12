import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, Home, MessageCircle } from 'lucide-react';

export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-flex">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-500/10"></div>
          <div className="relative w-24 h-24 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-2xl">
            <XCircle className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Booking Cancelled
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Your booking process has been cancelled and no payment was processed. If you had trouble with the checkout, please try again or contact us.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/tutors"
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tutors
          </Link>
          <div className="flex gap-3">
            <Link 
              href="/"
              className="flex-1 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link 
              href="/how-it-works"
              className="flex-1 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
