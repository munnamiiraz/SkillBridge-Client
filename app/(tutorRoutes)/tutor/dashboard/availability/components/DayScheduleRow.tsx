"use client"
import React, { useState } from 'react';
import { DayAvailability } from '@/app/services/tutor-availability.service';

interface DayScheduleRowProps {
  dateKey: string;
  dayData: DayAvailability;
  onToggleDay: (dateKey: string) => void;
  onAddSlot: (dateKey: string) => void;
  onRemoveSlot: (dateKey: string, slotId: string) => void;
  onUpdateSlot: (dateKey: string, slotId: string, field: 'startTime' | 'endTime', value: string) => void;
  onCopyToAll: (dateKey: string) => void;
}

export const DayScheduleRow: React.FC<DayScheduleRowProps> = ({
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
                ? 'bg-linear-to-r from-indigo-600 to-purple-600'
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
                            className="flex-1 px-3 py-2 bg-linear-to-br from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
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
