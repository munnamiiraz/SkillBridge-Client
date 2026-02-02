"use client"
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { boolean } from 'better-auth';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}
type Slot = {
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
};


interface DayAvailability {
  date: string;
  dayName: string;
  displayDate: string;
  isEnabled: boolean;
  slots: TimeSlot[];
}

interface WeeklySchedule {
  [key: string]: DayAvailability;
}

const TutorAvailabilityPage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get Monday of the current week
  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };


  // Format date for display (e.g., "Mon, Feb 3")
  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get day name
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Initialize week schedule
  const initializeWeekSchedule = (weekStart: Date): WeeklySchedule => {
    const schedule: WeeklySchedule = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dateKey = formatDate(date);
      schedule[dateKey] = {
        date: dateKey,
        dayName: getDayName(date),
        displayDate: formatDisplayDate(date),
        isEnabled: false,
        slots: []
      };
    }
    
    return schedule;
  };

  // Get week dates array for display
  const getWeekDates = (): string[] => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(formatDate(date));
    }
    return dates;
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAvailability();
    } else if (!sessionPending) {
      setLoading(false);
    }
  }, [session?.user?.id, sessionPending, currentWeekStart]);

  const fetchAvailability = async () => {
    try {
      const weekStartDate = formatDate(currentWeekStart);
      const response = await apiClient.get(`/api/tutor/availability-slots?weekStartDate=${weekStartDate}`);
      if (response.success) {
        const slots = response.data.slots || [];
        const newSchedule = initializeWeekSchedule(currentWeekStart);
        
        // Populate slots from backend
        slots.forEach((slot: any) => {
          if (newSchedule[slot.date]) {
            newSchedule[slot.date].isEnabled = true;
            newSchedule[slot.date].slots.push({
              id: slot.id,
              date: slot.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isBooked: slot.isBooked
            });
          }
        });

        setSchedule(newSchedule);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
      // Initialize empty schedule on error
      setSchedule(initializeWeekSchedule(currentWeekStart));
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dateKey: string) => {
    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        isEnabled: !prev[dateKey].isEnabled,
        slots: !prev[dateKey].isEnabled && prev[dateKey].slots.length === 0 
          ? [{ 
              id: `temp-${Date.now()}`, 
              date: dateKey,
              startTime: '09:00', 
              endTime: '17:00' 
            }]
          : prev[dateKey].slots,
      },
    }));
  };

  const addTimeSlot = (dateKey: string) => {
    const dayData = schedule[dateKey];
    const lastSlot = dayData.slots[dayData.slots.length - 1];
    const newStartTime = lastSlot ? lastSlot.endTime : '09:00';
    
    // Calculate end time (at least 1 hour after start)
    const [hours, minutes] = newStartTime.split(':').map(Number);
    let newEndHours = hours + 8;
    if (newEndHours > 23) newEndHours = 23;
    const newEndTime = `${newEndHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        slots: [
          ...prev[dateKey].slots,
          {
            id: `temp-${Date.now()}`,
            date: dateKey,
            startTime: newStartTime,
            endTime: newEndTime,
          },
        ],
      },
    }));
  };

  const removeTimeSlot = (dateKey: string, slotId: string) => {
    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        slots: prev[dateKey].slots.filter(slot => slot.id !== slotId),
      },
    }));
  };

  const updateTimeSlot = (dateKey: string, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        slots: prev[dateKey].slots.map(slot =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const validateSchedule = (): { valid: boolean; error?: string } => {
    const weekDates = getWeekDates();
    
    for (const dateKey of weekDates) {
      const dayData = schedule[dateKey];
      if (!dayData.isEnabled) continue;
      
      for (const slot of dayData.slots) {
        const startMinutes = parseTimeToMinutes(slot.startTime);
        const endMinutes = parseTimeToMinutes(slot.endTime);
        
        // Validate end time is after start time
        if (endMinutes <= startMinutes) {
          return { valid: false, error: `${dayData.displayDate}: End time must be after start time` };
        }
        
        // Validate minimum duration is 1 hour
        if (endMinutes - startMinutes < 60) {
          return { valid: false, error: `${dayData.displayDate}: Minimum time slot duration is 1 hour` };
        }
        
        // Check time is in valid range
        if (startMinutes < 0 || startMinutes >= 1440 || endMinutes < 0 || endMinutes > 1440) {
          return { valid: false, error: `${dayData.displayDate}: Invalid time range` };
        }
      }
      
      // Check for overlapping slots on same day
      for (let i = 0; i < dayData.slots.length; i++) {
        for (let j = i + 1; j < dayData.slots.length; j++) {
          const slot1 = dayData.slots[i];
          const slot2 = dayData.slots[j];
          
          const start1 = parseTimeToMinutes(slot1.startTime);
          const end1 = parseTimeToMinutes(slot1.endTime);
          const start2 = parseTimeToMinutes(slot2.startTime);
          const end2 = parseTimeToMinutes(slot2.endTime);
          
          if (start1 < end2 && start2 < end1) {
            return { valid: false, error: `${dayData.displayDate}: Time slots cannot overlap` };
          }
        }
      }
    }
    
    return { valid: true };
  };

  const handleSaveSchedule = async () => {
    // Validate schedule first
    const validation = validateSchedule();
    // if (!validation.valid) {
    //   toast.error(validation.error || 'Invalid schedule');
    //   return;
    // }
    
    setIsSaving(true);
    try {
      // Prepare data for backend
      let slotsToSave: any[] = [];
      console.log("Schedule: ", schedule);
      
      Object.values(schedule).forEach(day => {
        if (day.isEnabled && day.slots.length > 0) {
          day.slots.forEach(slot => {
            // Only save slots that are NOT booked
            if (!slot.isBooked) {
              slotsToSave.push({
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime
              });
            }
          });
        }
      });
      
      
      const splitSlotsIntoHourly = (slots: Slot[]): Slot[] => {
        const result: Slot[] = [];

        for (const slot of slots) {
          let start = timeToMinutes(slot.startTime);
          const end = timeToMinutes(slot.endTime);

          while (start + 60 <= end) {
            result.push({
              date: slot.date,
              startTime: minutesToTime(start),
              endTime: minutesToTime(start + 60),
            });

            start += 60;
          }
        }

        return result;
      };

      slotsToSave = splitSlotsIntoHourly(slotsToSave)
      console.log(slotsToSave);

      const checkEveryDateIsInFuture = (slots: Slot[]) => {
        const today = new Date();
        return slots.every(slot => new Date(slot.date) > today);
      }

      const isEveryDateInFuture = checkEveryDateIsInFuture(slotsToSave);
      
      if(!isEveryDateInFuture){
        toast.error('All slots must be in the future');
        setIsSaving(false);
        return;
      }

      if (slotsToSave.length === 0) {
        toast.info('No new available slots to save');
        setIsSaving(false);
        return;
      }
      
      const response = await apiClient.put('/api/tutor/availability-slots', {
        weekStartDate: formatDate(currentWeekStart),
        slots: slotsToSave
      });
      console.log(response);
      
      if (response.success) {
        toast.success('Availability saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await fetchAvailability();
      }
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      toast.error(error.message || 'Failed to save availability');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToAll = (sourceDateKey: string) => {
    const sourceDaySchedule = schedule[sourceDateKey];
    const newSchedule = { ...schedule };
    const weekDates = getWeekDates();

    weekDates.forEach(dateKey => {
      if (dateKey !== sourceDateKey) {
        newSchedule[dateKey] = {
          ...newSchedule[dateKey],
          isEnabled: sourceDaySchedule.isEnabled,
          slots: sourceDaySchedule.slots.map(slot => ({
            ...slot,
            id: `temp-${dateKey}-${Date.now()}-${Math.random()}`,
            date: dateKey
          })),
        };
      }
    });

    setSchedule(newSchedule);
  };

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
    setLoading(true);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
    setLoading(true);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
    setLoading(true);
  };

  const totalHoursPerWeek = Object.values(schedule).reduce((total, day) => {
    if (!day.isEnabled) return total;
    const dayHours = day.slots.reduce((dayTotal, slot) => {
      const start = parseTimeToMinutes(slot.startTime);
      const end = parseTimeToMinutes(slot.endTime);
      return dayTotal + (end - start) / 60;
    }, 0);
    return total + dayHours;
  }, 0);

  const totalOneHourSlots = Math.floor(totalHoursPerWeek);

  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(currentWeekStart.getDate() + 6);

  // Loading state
  if (loading || sessionPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading availability...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to manage your availability.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Set Your Availability
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Define your weekly schedule. Students can book 1-hour sessions during your available times.
          </p>
        </div>

        {/* Week Navigator */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDisplayDate(currentWeekStart)} - {formatDisplayDate(weekEndDate)}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Week of {currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Previous week"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToCurrentWeek}
                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium rounded-lg transition-colors"
              >
                This Week
              </button>
              
              <button
                onClick={goToNextWeek}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Next week"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Hours/Week"
            value={`${totalHoursPerWeek.toFixed(1)} hrs`}
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Active Days"
            value={`${Object.values(schedule).filter(d => d.isEnabled).length} days`}
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Bookable Slots"
            value={`${totalOneHourSlots} slots`}
          />
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                How it works
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Set your available time ranges for each day (e.g., 9:00 AM - 5:00 PM). These will automatically be split into 1-hour bookable slots for students. Navigate between weeks using the arrows above to manage your schedule for different weeks.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Weekly Schedule
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Toggle days on/off and add time ranges for each active day.
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {getWeekDates().map((dateKey) => (
              <DayScheduleRow
                key={dateKey}
                dateKey={dateKey}
                dayData={schedule[dateKey]}
                onToggleDay={toggleDay}
                onAddSlot={addTimeSlot}
                onRemoveSlot={removeTimeSlot}
                onUpdateSlot={updateTimeSlot}
                onCopyToAll={handleCopyToAll}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const newSchedule = { ...schedule };
                getWeekDates().forEach(dateKey => {
                  newSchedule[dateKey] = {
                    ...newSchedule[dateKey],
                    isEnabled: true,
                    slots: [{ id: `temp-${dateKey}-${Date.now()}`, date: dateKey, startTime: '09:00', endTime: '17:00' }],
                  };
                });
                setSchedule(newSchedule);
              }}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
            >
              Set All Days 9 AM - 5 PM
            </button>
            <button
              type="button"
              onClick={() => {
                const newSchedule = { ...schedule };
                const weekDates = getWeekDates();
                weekDates.forEach((dateKey, index) => {
                  const isWeekday = index < 5; // Monday to Friday
                  newSchedule[dateKey] = {
                    ...newSchedule[dateKey],
                    isEnabled: isWeekday,
                    slots: isWeekday
                      ? [{ id: `temp-${dateKey}-${Date.now()}`, date: dateKey, startTime: '09:00', endTime: '17:00' }]
                      : [],
                  };
                });
                setSchedule(newSchedule);
              }}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
            >
              Weekdays Only
            </button>
            <button
              type="button"
              onClick={() => {
                const newSchedule = { ...schedule };
                getWeekDates().forEach(dateKey => {
                  newSchedule[dateKey] = { ...newSchedule[dateKey], isEnabled: false, slots: [] };
                });
                setSchedule(newSchedule);
              }}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your time ranges will be converted to 1-hour bookable slots automatically.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Saved successfully!</span>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleSaveSchedule}
              disabled={isSaving}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Availability</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
      
      <div className="relative z-10">
        <div className="inline-flex p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/40 mb-4">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

// Day Schedule Row Component
interface DayScheduleRowProps {
  dateKey: string;
  dayData: DayAvailability;
  onToggleDay: (dateKey: string) => void;
  onAddSlot: (dateKey: string) => void;
  onRemoveSlot: (dateKey: string, slotId: string) => void;
  onUpdateSlot: (dateKey: string, slotId: string, field: 'startTime' | 'endTime', value: string) => void;
  onCopyToAll: (dateKey: string) => void;
}

const DayScheduleRow: React.FC<DayScheduleRowProps> = ({
  dateKey,
  dayData,
  onToggleDay,
  onAddSlot,
  onRemoveSlot,
  onUpdateSlot,
  onCopyToAll,
}) => {
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);

  if (!dayData) return null;

  return (
    <div className={`p-6 lg:p-8 transition-all duration-200 ${
      dayData.isEnabled ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Day Toggle */}
        <div className="flex items-center justify-between lg:w-56 shrink-0">
          <div>
            <h3 className={`text-lg font-bold transition-colors ${
              dayData.isEnabled 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-400 dark:text-gray-600'
            }`}>
              {dayData.dayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {dayData.displayDate}
            </p>
            {dayData.isEnabled && dayData.slots.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dayData.slots.length} range{dayData.slots.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => onToggleDay(dateKey)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              dayData.isEnabled
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                dayData.isEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Time Slots */}
        <div className="flex-1">
          {dayData.isEnabled ? (
            <div className="space-y-4">
              {dayData.slots.map((slot, index) => (
                <div key={slot.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                      #{index + 1}
                    </span>
                    
                    <div className="flex items-center gap-2 flex-1 relative">
                      {slot.isBooked && (
                        <div className="absolute -top-6 left-0 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Booked Session
                        </div>
                      )}
                      
                      <input
                        type="time"
                        value={slot.startTime}
                        disabled={slot.isBooked}
                        onChange={(e) => onUpdateSlot(dateKey, slot.id, 'startTime', e.target.value)}
                        className={`flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          slot.isBooked ? 'opacity-60 cursor-not-allowed border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10' : ''
                        }`}
                      />
                      
                      <span className="text-gray-400 dark:text-gray-600 font-medium">
                        to
                      </span>
                      
                      <input
                        type="time"
                        value={slot.endTime}
                        disabled={slot.isBooked}
                        onChange={(e) => onUpdateSlot(dateKey, slot.id, 'endTime', e.target.value)}
                        className={`flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          slot.isBooked ? 'opacity-60 cursor-not-allowed border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {!slot.isBooked ? (
                    <button
                      type="button"
                      onClick={() => onRemoveSlot(dateKey, slot.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove time range"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  ) : (
                    <div className="p-2 text-amber-500 cursor-help" title="Booked slots cannot be removed">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onAddSlot(dateKey)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Time Range</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCopyConfirm(!showCopyConfirm)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy to All Days</span>
                  </button>

                  {showCopyConfirm && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCopyConfirm(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 z-20 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          This will overwrite all other days this week with {dayData.dayName}'s schedule. Continue?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onCopyToAll(dateKey);
                              setShowCopyConfirm(false);
                            }}
                            className="flex-1 px-3 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                          >
                            Yes, Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCopyConfirm(false)}
                            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Not available on this day
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export default TutorAvailabilityPage;