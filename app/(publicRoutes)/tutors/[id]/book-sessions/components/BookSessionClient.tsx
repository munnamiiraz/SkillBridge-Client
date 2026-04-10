'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { getTutorAvailability, createCheckoutSession } from '@/app/services/book-session.service';
import { getMonday, getDayNameString, formatDateString } from '@/app/services/tutor-availability.helpers';
import { Header } from './Header';
import { SessionTypeSelector } from './SessionTypeSelector';
import { CalendarView } from './CalendarView';
import { BookingSummary } from './BookingSummary';

type SessionType = 'single' | 'package';

interface DaySchedule {
  date: string;
  dayName: string;
  displayDate: string;
  slots: Array<{ id: string; startTime: string; endTime: string; isBooked: boolean; price: number }>;
}

interface BookSessionClientProps {
  tutorId: string;
  initialTutorData: any;
}

export const BookSessionClient: React.FC<BookSessionClientProps> = ({ tutorId, initialTutorData }) => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  
  const [sessionType, setSessionType] = useState<SessionType>('single');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [packageNotice, setPackageNotice] = useState(false);

  const tutor = {
    name: initialTutorData.user.name,
    avatar: initialTutorData.user.image || initialTutorData.user.name?.charAt(0).toUpperCase() || '?',
    subject: initialTutorData.tutor_subject?.map((ts: any) => ts.subject.name).join(' & ') || 'Experienced Tutor',
    rating: initialTutorData.averageRating || 0,
    pricePerHour: initialTutorData.hourlyRate,
    bgGradient: 'from-indigo-500 to-purple-500',
  };


  useEffect(() => {
    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      try {
        const weekStartDate = formatDateString(currentWeekStart);
        const result = await getTutorAvailability(tutorId, weekStartDate);

        if (!result.data) return;

        // Match the fetch pattern: use 'slots' from API
        const apiSlots = result.data.slots ?? [];
        const slotsByDate: Record<string, any[]> = {};
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentWeekStart);
          date.setDate(currentWeekStart.getDate() + i);
          slotsByDate[formatDateString(date)] = [];
        }

        apiSlots.forEach((slot: any) => {
          const dateKey = slot.date; 
          if (!slotsByDate[dateKey]) return;
          
          const [startH, startM] = slot.startTime.split(':').map(Number);
          const [endH, endM] = slot.endTime.split(':').map(Number);
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;
          
          if (endMinutes - startMinutes <= 60) {
            slotsByDate[dateKey].push(slot);
          } else {
            let cur = startMinutes;
            while (cur + 60 <= endMinutes) {
              const nextCur = cur + 60;
              const chunkStart = `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
              const chunkEnd = `${String(Math.floor(nextCur / 60)).padStart(2, '0')}:${String(nextCur % 60).padStart(2, '0')}`;
              slotsByDate[dateKey].push({
                ...slot,
                id: `${dateKey}-${chunkStart}-${chunkEnd}`,
                startTime: chunkStart,
                endTime: chunkEnd,
              });
              cur = nextCur;
            }
          }
        });

        const generatedSchedule = Object.entries(slotsByDate).sort().map(([dateKey, slots]) => {
          const date = new Date(`${dateKey}T00:00:00Z`);
          return {
            date: date.getUTCDate().toString(),
            dayName: getDayNameString(date),
            displayDate: dateKey,
            slots: slots.map(slot => ({ ...slot, price: tutor.pricePerHour }))
          };
        });


        setSchedule(generatedSchedule);

        if (!selectedDay && generatedSchedule.length > 0) {
          const firstAvailableDay = generatedSchedule.find(day => day.slots.some(slot => !slot.isBooked));
          if (firstAvailableDay) setSelectedDay(firstAvailableDay.displayDate);
          else setSelectedDay(generatedSchedule[0].displayDate);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [tutorId, currentWeekStart]);

  const handleBooking = async () => {
    setBookingError(null);
    if (!session) {
      toast.error('Please login to book a session');
      router.push('/login');
      return;
    }

    if (sessionType === 'single' && selectedSlot) {
      try {
        setIsBooking(true);
        const dayInfo = schedule.find(d => d.slots.some(s => s.id === selectedSlot));
        const slotInfo = dayInfo?.slots.find(s => s.id === selectedSlot);
        
        if (!dayInfo || !slotInfo) {
          toast.error('Selection info missing');
          return;
        }

        const datePart = new Date(dayInfo.displayDate + "T00:00:00.000Z");
        const [hours, minutes] = slotInfo.startTime.split(':');
        datePart.setUTCHours(parseInt(hours || '0'), parseInt(minutes || '0'), 0, 0);

        if (datePart <= new Date()) {
          toast.error('This slot has already passed. Please select a future time.');
          return;
        }

        const result = await createCheckoutSession({
          tutorProfileId: initialTutorData.id,
          scheduledAt: datePart.toISOString(),
          duration: 60,
          subject: initialTutorData.tutor_subject?.[0]?.subject?.name || 'General Session',
          notes: 'Session booked via SkillBridge profile'
        });

        if (result.data?.checkoutUrl) {
          toast.success('Redirecting to secure payment...');
          window.location.href = result.data.checkoutUrl;
        } else {
          toast.error(result.error?.message || 'Failed to initiate payment');
        }
      } catch (err: any) {
        toast.error(err.message || 'Booking failed');
      } finally {
        setIsBooking(false);
      }
    } else if (sessionType === 'package') {
      setPackageNotice(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Header tutorId={tutorId} tutor={tutor} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!session ? (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-12 shadow-2xl flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-inner">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Login to Book a Session</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-10 text-lg">
                  Join SkillBridge to start learning with expert tutors like {tutor.name}. 
                  It only takes a minute to create an account!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Link href="/login" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 text-center">
                    Login
                  </Link>
                  <Link href="/register" className="flex-1 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 font-bold rounded-xl transition-all hover:-translate-y-1 text-center">
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <SessionTypeSelector sessionType={sessionType} setSessionType={setSessionType} />
                {sessionType === 'single' ? (
                  <CalendarView
                    schedule={schedule}
                    selectedDay={selectedDay}
                    selectedSlot={selectedSlot}
                    currentWeekStart={currentWeekStart}
                    availabilityLoading={availabilityLoading}
                    onSelectDay={setSelectedDay}
                    onSelectSlot={setSelectedSlot}
                    onPreviousWeek={() => {
                      const newWeekStart = new Date(currentWeekStart);
                      newWeekStart.setDate(currentWeekStart.getDate() - 7);
                      setCurrentWeekStart(newWeekStart);
                      setSelectedSlot(null);
                    }}
                    onNextWeek={() => {
                      const newWeekStart = new Date(currentWeekStart);
                      newWeekStart.setDate(currentWeekStart.getDate() + 7);
                      setCurrentWeekStart(newWeekStart);
                      setSelectedSlot(null);
                    }}
                    onCurrentWeek={() => {
                      setCurrentWeekStart(getMonday(new Date()));
                      setSelectedSlot(null);
                    }}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </div>

          <BookingSummary
            tutor={tutor}
            sessionType={sessionType}
            selectedDay={selectedDay}
            selectedSlot={selectedSlot}
            selectedPackage={selectedPackage}
            schedule={schedule}
            session={session}
            isBooking={isBooking}
            bookingError={bookingError}
            packageNotice={packageNotice}
            onBook={handleBooking}
            onSwitchToSingle={() => {
              setSessionType('single');
              setPackageNotice(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
