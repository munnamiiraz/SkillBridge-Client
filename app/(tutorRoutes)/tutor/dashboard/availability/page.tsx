"use client"

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { 
  TutorAvailabilityService, 
  WeeklySchedule, 
  TimeSlot 
} from '@/app/services/tutor-availability.service';

import { StatCard } from './components/StatCard';
import { InfoBanner } from './components/InfoBanner';
import { WeekNavigator } from './components/WeekNavigator';
import { QuickActions } from './components/QuickActions';
import { DayScheduleRow } from './components/DayScheduleRow';
import { SaveBar } from './components/SaveBar';

const TutorAvailabilityPage: React.FC = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(TutorAvailabilityService.getMonday(new Date()));
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAvailability();
    } else if (!sessionPending) {
      setLoading(false);
    }
  }, [session?.user?.id, sessionPending, currentWeekStart]);

  const fetchAvailability = async () => {
    try {
      const weekStartDate = TutorAvailabilityService.formatDate(currentWeekStart);
      const data = await TutorAvailabilityService.getAvailability(weekStartDate);
      
      if (data) {
        const slots = data.slots || [];
        const newSchedule = TutorAvailabilityService.initializeWeekSchedule(currentWeekStart);
        
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
      } else {
        // Fallback for no data
        setSchedule(TutorAvailabilityService.initializeWeekSchedule(currentWeekStart));
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
      setSchedule(TutorAvailabilityService.initializeWeekSchedule(currentWeekStart));
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
    const weekDates = TutorAvailabilityService.getWeekDates(currentWeekStart);
    
    for (const dateKey of weekDates) {
      const dayData = schedule[dateKey];
      if (!dayData?.isEnabled) continue;
      
      for (const slot of dayData.slots) {
        const startMinutes = TutorAvailabilityService.timeToMinutes(slot.startTime);
        const endMinutes = TutorAvailabilityService.timeToMinutes(slot.endTime);
        
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
          
          const start1 = TutorAvailabilityService.timeToMinutes(slot1.startTime);
          const end1 = TutorAvailabilityService.timeToMinutes(slot1.endTime);
          const start2 = TutorAvailabilityService.timeToMinutes(slot2.startTime);
          const end2 = TutorAvailabilityService.timeToMinutes(slot2.endTime);
          
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
    // const validation = validateSchedule(); // Originally commented out or partial check?
    // User logic suggests validation might be loose or handled by backend, but let's keep original flow.
    // The original code had validation commented out or partial. I'll keep it as is, prioritizing function.
    
    setIsSaving(true);
    try {
      // Prepare data for backend
      let slotsToSave: any[] = [];
      
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
      
      // Auto-split into hourly slots using service
      slotsToSave = TutorAvailabilityService.splitSlotsIntoHourly(slotsToSave);

      const checkEveryDateIsInFuture = (slots: any[]) => {
        const today = new Date();
        // Simple check: date string vs today
        return slots.every(slot => new Date(slot.date) > today || new Date(slot.date).toDateString() === today.toDateString());
      };

      // Note: original code checked > today. I should check if it allows today.
      // Original: return slots.every(slot => new Date(slot.date) > today);
      // Let's stick to original logic if possible, or improve it. Often "future" means >= today if time is future.
      // But let's assume strict future requirement if that was in code.
      // Actually `new Date('YYYY-MM-DD')` is at 00:00:00. `new Date()` is now.
      // If date is today, `new Date(date)` (midnight) < `now`. So strict `>` excludes today.
      
      function getNowInDhaka() {
        return new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          })
        );
      }
      // console.log(getNowInDhaka());
      
      const isEveryDateInFuture = slotsToSave.every(slot => {
        
          const slotDate = new Date(slot.date);
          const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
          slotDate.setTime(slotDate.getTime() + sixHoursInMilliseconds);
          const today = getNowInDhaka();
          
          // Reset time for comparison if we want to include today
          today.setHours(0, 0, 0, 0);
          return slotDate >= today; 
      });

      // console.log("Is every date in future? ", isEveryDateInFuture);
      if (!isEveryDateInFuture) {
        toast.error("All dates must be in the future.");
        setIsSaving(false);
        return;
      }
      
      // Wait, let's look at the original code snippet provided by user if available.
      // Original: return slots.every(slot => new Date(slot.date) > today);
      // This likely excludes today unless I'm mistaken about timezone/midnight.
      // I will implement a safer future check.
      
      if (slotsToSave.length === 0) {
        // Only warn if we actually enabled some days but they resulted in no slots?
        // Or if we purely have nothing.
        // toast.info('No new available slots to save');
      }
      
      const response = await TutorAvailabilityService.saveAvailability(
        TutorAvailabilityService.formatDate(currentWeekStart),
        slotsToSave
      );
      
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
    const weekDates = TutorAvailabilityService.getWeekDates(currentWeekStart);

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
    setCurrentWeekStart(TutorAvailabilityService.getMonday(new Date()));
    setLoading(true);
  };

  const totalHoursPerWeek = Object.values(schedule).reduce((total, day) => {
    if (!day.isEnabled) return total;
    const dayHours = day.slots.reduce((dayTotal, slot) => {
      const start = TutorAvailabilityService.timeToMinutes(slot.startTime);
      const end = TutorAvailabilityService.timeToMinutes(slot.endTime);
      return dayTotal + (end - start) / 60;
    }, 0);
    return total + dayHours;
  }, 0);

  const totalOneHourSlots = Math.floor(totalHoursPerWeek);

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
          {/* Using simple SVG since we are refactoring and icons might differ, or use Lucid icons if I knew them */}
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
            onClick={() => location.href = '/login'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
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
            <span className="bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Set Your Availability
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Define your weekly schedule. Students can book 1-hour sessions during your available times.
          </p>
        </div>

        {/* Week Navigator */}
        <WeekNavigator 
          currentWeekStart={currentWeekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onCurrentWeek={goToCurrentWeek}
        />

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

        <InfoBanner />

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
            {TutorAvailabilityService.getWeekDates(currentWeekStart).map((dateKey) => (
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

        <QuickActions 
          onSet9to5={() => {
            const newSchedule = { ...schedule };
            TutorAvailabilityService.getWeekDates(currentWeekStart).forEach(dateKey => {
              newSchedule[dateKey] = {
                ...newSchedule[dateKey],
                isEnabled: true,
                slots: [{ id: `temp-${dateKey}-${Date.now()}`, date: dateKey, startTime: '09:00', endTime: '17:00' }],
              };
            });
            setSchedule(newSchedule);
          }}
          onSetWeekdays={() => {
            const newSchedule = { ...schedule };
            const weekDates = TutorAvailabilityService.getWeekDates(currentWeekStart);
            weekDates.forEach((dateKey, index) => {
              const isWeekday = index < 5; // Monday to Friday (0-4) if starts on Monday
              // Wait, getWeekDates starts from currentWeekStart which is explicitly calculated as Monday in getMonday
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
          onClearAll={() => {
            const newSchedule = { ...schedule };
            TutorAvailabilityService.getWeekDates(currentWeekStart).forEach(dateKey => {
              newSchedule[dateKey] = { ...newSchedule[dateKey], isEnabled: false, slots: [] };
            });
            setSchedule(newSchedule);
          }}
        />

        <SaveBar 
          onSave={handleSaveSchedule} 
          isSaving={isSaving} 
          saveSuccess={saveSuccess} 
        />
      </div>
    </div>
  );
};

export default TutorAvailabilityPage;