import React from 'react';
import Link from 'next/link';
import { getSessionDetails } from '@/app/services/book-session.service';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Home, 
  LayoutDashboard,
  Video,
  CreditCard,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { formatDisplayDateString } from '@/app/services/tutor-availability.helpers';

interface PageProps {
  searchParams: Promise<{ session_id: string }>;
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid Session</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find a valid checkout session. If you believe this is an error, please contact support.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { data, error } = await getSessionDetails(session_id);

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error?.message || "We encountered an error while retrieving your booking details."}
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { booking, session } = data;
  const tutor = booking.tutor_profile;
  const bookingDate = new Date(booking.scheduledAt);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Animated Checkmark Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative inline-flex">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20"></div>
            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
              Your session with <span className="text-indigo-600 dark:text-indigo-400 font-bold">{tutor.user.name}</span> has been successfully scheduled.
            </p>
          </div>
        </div>

        {/* glassmorphic Details Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Session Info Header */}
            <div className="px-8 py-6 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                    {booking.subject} Session
                  </span>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold uppercase tracking-widest">
                  Paid
                </div>
              </div>
            </div>

            {/* Grid Details */}
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Tutor Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden shadow-lg border-2 border-white dark:border-gray-800">
                    {tutor.user.image ? (
                        <img src={tutor.user.image} alt={tutor.user.name} className="w-full h-full object-cover" />
                    ) : (
                        tutor.user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Tutor</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{tutor.user.name}</div>
                  </div>
                </div>

                {/* Date/Time */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-60">Date</div>
                      <div className="text-gray-900 dark:text-white font-semibold">
                        {formatDisplayDateString(bookingDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-60">Time</div>
                      <div className="text-gray-900 dark:text-white font-semibold">
                        {bookingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka' })}
                        <span className="text-xs ml-2 opacity-50">(60 Min Session)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 md:pl-8">
                {/* Next Steps */}
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs mb-4">What's Next?</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">1</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Check your email for the session link and invitation.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">2</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      The session will appear in your <span className="font-bold">Student Dashboard</span>.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">3</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      You can message <span className="font-bold">{tutor.user.name.split(' ')[0]}</span> anytime to discuss goals.
                    </p>
                  </li>
                </ul>

                <div className="pt-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Total Paid</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    ${booking.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard"
                className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
              </Link>
              <Link 
                href="/"
                className="flex-1 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 font-bold rounded-2xl hover:border-indigo-500 flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer help */}
        <p className="text-center mt-12 text-sm text-gray-500 dark:text-gray-500">
          Booking ID: <span className="font-mono">{booking.id}</span> · Need help? <Link href="/contact" className="text-indigo-600 underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
