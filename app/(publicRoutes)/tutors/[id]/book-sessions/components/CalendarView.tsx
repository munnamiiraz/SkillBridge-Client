import { Loader2 } from 'lucide-react';
import { formatDisplayDateString } from '@/app/services/tutor-availability.helpers';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  displayDate: string;
  slots: TimeSlot[];
}

interface CalendarViewProps {
  schedule: DaySchedule[];
  selectedDay: string | null;
  selectedSlot: string | null;
  currentWeekStart: Date;
  availabilityLoading: boolean;
  onSelectDay: (day: string) => void;
  onSelectSlot: (slotId: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedule,
  selectedDay,
  selectedSlot,
  currentWeekStart,
  availabilityLoading,
  onSelectDay,
  onSelectSlot,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Select Date & Time
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Timezone: EST (UTC+6)
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onCurrentWeek}
            className="px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            Today
          </button>
          <button
            onClick={onNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="font-bold text-gray-900 dark:text-white">
          Week of {currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Dhaka' })}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {schedule.map((day, index) => (
          <button
            key={index}
            onClick={() => onSelectDay(day.displayDate)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
              selectedDay === day.displayDate
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-500 mb-1">
              {day.dayName}
            </div>
            <div className={`text-lg font-bold ${
              selectedDay === day.displayDate
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-900 dark:text-white'
            }`}>
              {day.date}
            </div>
            <div className="text-[10px] text-gray-600 dark:text-gray-400">
              {day.slots.filter(s => !s.isBooked).length} slots
            </div>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Available times for {selectedDay ? formatDisplayDateString(new Date(selectedDay + "T00:00:00.000Z")) : ''}
          </h3>
          {availabilityLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : schedule.find(d => d.displayDate === selectedDay)?.slots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No available slots for this day.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {schedule
                .find(d => d.displayDate === selectedDay)
                ?.slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => !slot.isBooked && onSelectSlot(slot.id)}
                    disabled={slot.isBooked}
                    className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                      selectedSlot === slot.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-lg'
                        : !slot.isBooked
                        ? 'border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-green-300 dark:hover:border-green-600'
                        : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="text-sm">{slot.startTime}</div>
                    {slot.isBooked && (
                      <div className="text-[10px] mt-1">Booked</div>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
