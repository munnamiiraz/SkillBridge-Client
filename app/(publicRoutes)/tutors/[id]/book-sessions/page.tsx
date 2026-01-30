'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

type SessionType = 'single' | 'package';
type FilterType = 'all' | 'today' | 'week' | 'month';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface DaySchedule {
  date: string;
  day: string;
  fullDate: string;
  slots: TimeSlot[];
}

const BookSessionPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  // Auth Session
  const { data: session, isPending: sessionPending } = authClient.useSession();
  
  const [sessionType, setSessionType] = useState<SessionType>('single');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('week');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  
  const [tutorData, setTutorData] = useState<any>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/public/tutors/${id}`);
        
        if (response.data.success) {
          const tutor = response.data.data;
          setTutorData(tutor);
          
          // Generate schedule for the next 7 days
          const generatedSchedule: DaySchedule[] = [];
          const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          const today = new Date();
          
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayIdx = date.getDay(); // 0-6 (Sun-Sat)
            const dayOfWeekInt = dayIdx === 0 ? 7 : dayIdx; // Adjust to 1=Mon, 7=Sun
            
            const dayName = shortDays[dayIdx];
            const fullDateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
            
            // Find slots for this day of week
            const daySlots = tutor.availability_slot
              .filter((slot: any) => slot.dayOfWeek === dayOfWeekInt)
              .map((slot: any) => ({
                id: slot.id,
                time: slot.startTime,
                available: true,
                price: tutor.hourlyRate,
              }));
              
            generatedSchedule.push({
              date: date.getDate().toString(),
              day: dayName,
              fullDate: fullDateStr,
              slots: daySlots,
            });
          }
          
          setSchedule(generatedSchedule);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching tutor data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [id]);

  if (loading || sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !tutorData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4">Tutor not found</h1>
        <Link href="/tutors" className="text-indigo-600 hover:underline">Return to browse tutors</Link>
      </div>
    );
  }

  const tutor = {
    name: tutorData.user.name,
    avatar: tutorData.user.image || (tutorData.user.name ? tutorData.user.name.charAt(0).toUpperCase() : '?'),
    subject: tutorData.tutor_subject?.map((ts: any) => ts.subject.name).join(' & ') || 'Experienced Tutor',
    rating: tutorData.averageRating || 0,
    reviews: tutorData.totalReviews || 0,
    pricePerHour: tutorData.hourlyRate,
    bgGradient: 'from-indigo-500 to-purple-500',
  };

  // Session packages
  const packages = [
    {
      id: 'pkg-4',
      name: '4 Sessions',
      sessions: 4,
      price: Math.round(tutor.pricePerHour * 4 * 0.95), // 5% discount
      savings: Math.round(tutor.pricePerHour * 4 * 0.05),
      popular: false,
    },
    {
      id: 'pkg-8',
      name: '8 Sessions',
      sessions: 8,
      price: Math.round(tutor.pricePerHour * 8 * 0.90), // 10% discount
      savings: Math.round(tutor.pricePerHour * 8 * 0.10),
      popular: true,
    },
    {
      id: 'pkg-12',
      name: '12 Sessions',
      sessions: 12,
      price: Math.round(tutor.pricePerHour * 12 * 0.85), // 15% discount
      savings: Math.round(tutor.pricePerHour * 12 * 0.15),
      popular: false,
    },
  ];

  const handleBooking = async () => {
    if (!session) {
      toast.error('Please login to book a session');
      router.push('/login');
      return;
    }

    if (sessionType === 'single' && selectedSlot) {
      try {
        setIsBooking(true);
        // Find the slot and day info
        const dayInfo = schedule.find(d => d.slots.some(s => s.id === selectedSlot));
        const slotInfo = dayInfo?.slots.find(s => s.id === selectedSlot);
        
        if (!dayInfo || !slotInfo) {
          toast.error('Selection info missing');
          return;
        }

        // Construct date: dayInfo.fullDate is "Friday, Jan 15, 2026"
        // slotInfo.time is "09:00"
        const datePart = new Date(dayInfo.fullDate);
        const [hours, minutes] = slotInfo.time.split(':');
        datePart.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const bookingData = {
          tutorProfileId: tutorData.id,
          scheduledAt: datePart.toISOString(),
          duration: 60,
          subject: tutorData.tutor_subject?.[0]?.subject?.name || 'General Session',
          notes: 'Session booked via SkillBridge profile'
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/api/student/bookings`,
          bookingData,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success('Booking confirmed successfully!');
          router.push('/student/sessions'); // Or wherever bookings are listed
        } else {
          toast.error(response.data.message || 'Booking failed');
        }
      } catch (err: any) {
        console.error('Booking error:', err);
        toast.error(err.response?.data?.message || 'Failed to confirm booking');
      } finally {
        setIsBooking(false);
      }
    } else if (sessionType === 'package' && selectedPackage) {
      toast.info('Session packages coming soon! For now, please book single sessions.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/tutors/${id}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </Link>

          <div className="flex items-center gap-6">
            {/* Tutor Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tutor.bgGradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
              {tutor.avatar}
            </div>

            {/* Tutor Info */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Book a Session with {tutor.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{tutor.subject}</span>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span className="font-semibold text-gray-900 dark:text-white">{tutor.rating}</span>
                  <span>({tutor.reviews})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Booking Interface */}
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
                  <Link 
                    href="/login"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="flex-1 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 font-bold rounded-xl transition-all hover:-translate-y-1 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Session Type Selector */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Choose Session Type
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSessionType('single')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        sessionType === 'single'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                        sessionType === 'single'
                          ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className={`font-bold text-center ${
                        sessionType === 'single'
                          ? 'text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Single Session
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1">
                        Book one session
                      </p>
                    </button>

                    <button
                      onClick={() => setSessionType('package')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        sessionType === 'package'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                        sessionType === 'package'
                          ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className={`font-bold text-center ${
                        sessionType === 'package'
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Session Package
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1">
                        Save with bundles
                      </p>
                    </button>
                  </div>
                </div>

                {/* Single Session Booking */}
                {sessionType === 'single' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Calendar View */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          Select Date & Time
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Timezone: EST (UTC-5)
                        </div>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-5 gap-3 mb-6">
                        {schedule.map((day) => (
                          <button
                            key={day.date}
                            onClick={() => setSelectedDay(day.fullDate)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedDay === day.fullDate
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                            }`}
                          >
                            <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                              {day.day}
                            </div>
                            <div className={`text-2xl font-bold mb-2 ${
                              selectedDay === day.fullDate
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {day.date}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {day.slots.filter(s => s.available).length} slots
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Time Slots */}
                      {selectedDay && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Available times for {selectedDay}
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {schedule
                              .find(d => d.fullDate === selectedDay)
                              ?.slots.map((slot) => (
                                <button
                                  key={slot.id}
                                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                                  disabled={!slot.available}
                                  className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                                    selectedSlot === slot.id
                                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-lg'
                                      : slot.available
                                      ? 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-green-300 dark:hover:border-green-600'
                                      : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <div className="text-sm">{slot.time}</div>
                                  {!slot.available && (
                                    <div className="text-xs mt-1">Booked</div>
                                  )}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Package Booking */}
                {sessionType === 'package' && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Choose Your Package
                    </h2>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedPackage === pkg.id
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-xl'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg'
                          }`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                              Most Popular
                            </div>
                          )}

                          <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {pkg.name}
                            </h3>
                            <div className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
                              ${pkg.price}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ${(pkg.price / pkg.sessions).toFixed(0)}/session
                            </p>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{pkg.sessions} sessions included</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Valid for 3 months</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Flexible scheduling</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">You save:</span>
                              <span className="font-bold text-green-600 dark:text-green-400">
                                ${pkg.savings}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
                        💡 <span className="font-semibold">Pro tip:</span> Packages offer better value and help maintain learning momentum
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Booking Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Booking Summary
              </h3>

              {/* Tutor Info */}
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200 dark:border-gray-800">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tutor.bgGradient} flex items-center justify-center text-white font-bold`}>
                  {tutor.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{tutor.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tutor.subject}</p>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4 mb-6">
                {sessionType === 'single' ? (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Session Type:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Single Session</span>
                    </div>
                    {selectedDay && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{selectedDay}</span>
                      </div>
                    )}
                    {selectedSlot && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {schedule
                            .flatMap(d => d.slots)
                            .find(s => s.id === selectedSlot)?.time}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">60 minutes</span>
                    </div>
                  </>
                ) : (
                  selectedPackage && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Package:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {packages.find(p => p.id === selectedPackage)?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {packages.find(p => p.id === selectedPackage)?.sessions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Validity:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">3 months</span>
                      </div>
                    </>
                  )
                )}
              </div>

              {/* Pricing */}
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
                      <span className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        ${tutor.pricePerHour + 5}
                      </span>
                    </div>
                  </>
                ) : (
                  selectedPackage && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Package Price:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${packages.find(p => p.id === selectedPackage)?.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                        <span>Savings:</span>
                        <span className="font-semibold">
                          -${packages.find(p => p.id === selectedPackage)?.savings}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                        <span className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                          ${packages.find(p => p.id === selectedPackage)?.price}
                        </span>
                      </div>
                    </>
                  )
                )}
              </div>

              {/* Booking Action Buttons */}
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
                  onClick={handleBooking}
                  disabled={isBooking || (sessionType === 'single' ? !selectedSlot : !selectedPackage)}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                    (sessionType === 'single' && selectedSlot) || (sessionType === 'package' && selectedPackage)
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40'
                      : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isBooking ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    sessionType === 'single' ? 'Confirm Booking' : 'Purchase Package'
                  )}
                </button>
              )}

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Money-back guarantee</span>
              </div>

              {/* Cancellation Policy */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="font-semibold">Cancellation Policy:</span> Free cancellation up to 24 hours before the session. Late cancellations may incur a fee.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default BookSessionPage;