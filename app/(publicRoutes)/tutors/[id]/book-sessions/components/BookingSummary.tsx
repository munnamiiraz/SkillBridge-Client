import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { formatDisplayDateString } from '@/app/services/tutor-availability.helpers';

type SessionType = 'single' | 'package';

interface Package {
  id: string;
  name: string;
  sessions: number;
  price: number;
  savings: number;
}

interface DaySchedule {
  date: string;
  slots: Array<{ id: string; startTime: string }>;
}

interface BookingSummaryProps {
  tutor: {
    name: string;
    avatar: string;
    subject: string;
    pricePerHour: number;
    bgGradient: string;
  };
  sessionType: SessionType;
  selectedDay: string | null;
  selectedSlot: string | null;
  selectedPackage: string | null;
  schedule: DaySchedule[];
  session: any;
  isBooking: boolean;
  bookingError: string | null;
  packageNotice: boolean;
  onBook: () => void;
  onSwitchToSingle: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  tutor,
  sessionType,
  selectedDay,
  selectedSlot,
  selectedPackage,
  schedule,
  session,
  isBooking,
  bookingError,
  packageNotice,
  onBook,
  onSwitchToSingle,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl overflow-hidden">
        {sessionType === 'package' && (
          <div className="absolute top-0 right-0 h-16 w-16">
            <div className="absolute transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-purple-600 text-white text-[10px] font-bold py-1 px-10 shadow-lg">
              COMING SOON
            </div>
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Booking Summary
        </h3>

        {packageNotice && sessionType === 'package' && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/40 border-2 border-purple-200 dark:border-purple-700 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300 mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">Feature Restricted</span>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Session packages are coming soon! We're currently working on this feature. 
              <button 
                onClick={onSwitchToSingle}
                className="block mt-2 font-bold underline"
              >
                Switch to Single Session
              </button>
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200 dark:border-gray-800">
          <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${tutor.bgGradient} flex items-center justify-center text-white font-bold overflow-hidden`}>
            {tutor.avatar.length > 1 ? (
              <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
            ) : (
              tutor.avatar
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{tutor.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{tutor.subject}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {sessionType === 'single' ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Session Type:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Single Session</span>
              </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatDisplayDateString(new Date(selectedDay + "T00:00:00Z"))}
                  </span>
                </div>
              {selectedSlot && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {schedule.flatMap(d => d.slots).find(s => s.id === selectedSlot)?.startTime}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-semibold text-gray-900 dark:text-white">60 minutes</span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3 mb-6">
          {sessionType === 'single' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Session Fee:</span>
                <span className="font-semibold text-gray-900 dark:text-white">${tutor.pricePerHour}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Platform Fee:</span>
                <span className="font-semibold text-gray-900 dark:text-white">$5</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="text-2xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  ${tutor.pricePerHour + 5}
                </span>
              </div>
            </>
          ) : <></>}
        </div>

        {bookingError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-bold">Booking Error</p>
              <p>{bookingError}</p>
            </div>
          </div>
        )}

        {!session ? (
          <div className="mb-6 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 animate-pulse">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-200">Authentication Required</h4>
                <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                  Please login to your student account to proceed with this booking.
                </p>
              </div>
              <Link 
                href="/login"
                className="inline-flex items-center px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                Login Now
              </Link>
            </div>
          </div>
        ) : (
          <button
            onClick={onBook}
            disabled={isBooking || (sessionType === 'single' ? !selectedSlot : !selectedPackage)}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              (sessionType === 'single' && selectedSlot) || (sessionType === 'package' && selectedPackage)
                ? 'bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            {isBooking ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : (
              sessionType === 'single' ? 'Confirm Booking' : 'Packages Coming Soon'
            )}
          </button>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Money-back guarantee</span>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <span className="font-semibold">Cancellation Policy:</span> Free cancellation up to 24 hours before the session. Late cancellations may incur a fee.
          </p>
        </div>
      </div>
    </div>
  );
};
