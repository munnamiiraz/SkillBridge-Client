import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { 
  getTutorAvailability,
} from '@/app/services/tutor-availability.service';
import {
  getMonday,
  formatDateString,
  initializeWeekSchedule,
} from '@/app/services/tutor-availability.helpers';
import { TutorAvailabilityClient } from './components/TutorAvailabilityClient';

export const dynamic = 'force-dynamic';

const TutorAvailabilityPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // Get current date in Dhaka timezone (UTC+6)
  const now = new Date();
  const dhakaOffset = 6 * 60; // UTC+6 in minutes
  const nowInDhaka = new Date(now.getTime() + (dhakaOffset + now.getTimezoneOffset()) * 60000);
  const currentWeekStart = getMonday(nowInDhaka);
  const weekStartDate = formatDateString(currentWeekStart);

  const { data: availability, error } = await getTutorAvailability(weekStartDate, cookieString);

  if (error) {
    if (error.message?.includes('401')) {
      redirect('/');
    }
  }

  const schedule = initializeWeekSchedule(currentWeekStart);
  if (availability?.slots) {
    availability.slots.forEach((slot: any) => {
      if (schedule[slot.date]) {
        schedule[slot.date].isEnabled = true;
        schedule[slot.date].slots.push({
          id: slot.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: slot.isBooked
        });
      }
    });
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99, 102, 241) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Gradient Orbs */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-linear-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              Set Your Availability
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium max-w-3xl">
            Define your weekly schedule. Students can book 1-hour sessions during your available times.
          </p>
        </div>

        <TutorAvailabilityClient 
          initialSchedule={schedule} 
          initialWeekStart={currentWeekStart.toISOString()} 
        />
      </div>
    </div>
  );
};

export default TutorAvailabilityPage;