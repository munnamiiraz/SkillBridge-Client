'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  getMonday,
  formatDateString,
  getWeekDatesString,
  initializeWeekSchedule,
  splitSlotsIntoHourlyChunks,
  WeeklySchedule, 
  timeToMinutesString
} from '@/app/services/tutor-availability.helpers';
import { StatCard } from './StatCard';
import { InfoBanner } from './InfoBanner';
import { WeekNavigator } from './WeekNavigator';
import { QuickActions } from './QuickActions';
import { DayScheduleRow } from './DayScheduleRow';
import { SaveBar } from './SaveBar';

interface TutorAvailabilityClientProps {
  initialSchedule: WeeklySchedule;
  initialWeekStart: string;
}

export const TutorAvailabilityClient: React.FC<TutorAvailabilityClientProps> = ({ 
  initialSchedule, 
  initialWeekStart 
}) => {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date(initialWeekStart));
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const weekStartDate = formatDateString(currentWeekStart);
        const result = await apiClient.get(`/api/tutor/availability-slots?weekStartDate=${weekStartDate}`);
        
        if (result.success) {
          const slots = result.data?.slots || [];
          const newSchedule = initializeWeekSchedule(currentWeekStart);
          
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
          setSchedule(initializeWeekSchedule(currentWeekStart));
        }
      } catch (error) {
        toast.error('Failed to load availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [currentWeekStart]);

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
    
    // Calculate end time
    const [hours, minutes] = newStartTime.split(':').map(Number);
    let newEndHours = hours + (hours < 16 ? 8 : 1); 
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

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      let slotsToSave: any[] = [];
      Object.values(schedule).forEach(day => {
        if (day.isEnabled && day.slots.length > 0) {
          day.slots.forEach(slot => {
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
      
      slotsToSave = splitSlotsIntoHourlyChunks(slotsToSave);

      const nowInDhaka = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      
      const hasPastSlots = slotsToSave.some(slot => {
          const [h, m] = slot.startTime.split(':').map(Number);
          const [year, month, day] = slot.date.split('-').map(Number);
          // Create a date object representing the slot time in Dhaka numbers
          const slotInDhakaContext = new Date(year, month - 1, day, h, m);
          return slotInDhakaContext < nowInDhaka;
      });

      if (hasPastSlots) {
        toast.error("please dont set past dates");
        setIsSaving(false);
        return;
      }
      
      const result = await apiClient.put('/api/tutor/availability-slots', {
        weekStartDate: formatDateString(currentWeekStart),
        slots: slotsToSave
      });
      
      if (result.success) {
        toast.success('Availability saved successfully!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to save availability');
      }
    } catch (error: any) {
      console.error('[Save Availability] Error:', error);
      
      // Try to extract meaningful error message
      let errorMessage = 'An unexpected error occurred';
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      // Check for validation details
      if (error?.details && Array.isArray(error.details)) {
        const validationErrors = error.details.map((d: any) => `${d.path}: ${d.message}`).join(', ');
        errorMessage = `Validation Error: ${validationErrors}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToAll = (sourceDateKey: string) => {
    const sourceDaySchedule = schedule[sourceDateKey];
    const newSchedule = { ...schedule };
    const weekDates = getWeekDatesString(currentWeekStart);

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
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToCurrentWeek = () => {
    const nowInDhaka = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    setCurrentWeekStart(getMonday(nowInDhaka));
  };

  const totalHoursPerWeek = Object.values(schedule).reduce((total, day) => {
    if (!day.isEnabled) return total;
    const dayHours = day.slots.reduce((dayTotal, slot) => {
      const start = timeToMinutesString(slot.startTime);
      const end = timeToMinutesString(slot.endTime);
      return dayTotal + (end - start) / 60;
    }, 0);
    return total + dayHours;
  }, 0);

  const totalOneHourSlots = Math.floor(totalHoursPerWeek);

  return (
    <>
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
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-20 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
        <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Weekly Schedule
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Toggle days on/off and add time ranges for each active day.
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {getWeekDatesString(currentWeekStart).map((dateKey) => (
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
          getWeekDatesString(currentWeekStart).forEach(dateKey => {
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
          const weekDates = getWeekDatesString(currentWeekStart);
          weekDates.forEach((dateKey, index) => {
            const isWeekday = index < 5; 
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
          getWeekDatesString(currentWeekStart).forEach(dateKey => {
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
    </>
  );
};
