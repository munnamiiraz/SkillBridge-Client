"use client"
import React from 'react';
import { Session } from '@/app/services/tutor-sessions.service';

interface SessionCardProps {
  session: Session;
  onMarkComplete: (sessionId: string) => void;
  onUpdateStatus: (sessionId: string, status: string) => void;
  onViewDetails: (session: Session) => void;
  isMarkingComplete: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onMarkComplete, 
  onUpdateStatus, 
  onViewDetails, 
  isMarkingComplete 
}) => {
  const isInProgress = session.status === 'in-progress' || session.status === 'ongoing'; // Check both backend might use ONGOING
  const isCompleted = session.status === 'completed';
  const isUpcoming = session.status === 'upcoming' || session.status === 'confirmed';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <article className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Status Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        isInProgress 
          ? 'bg-gradient-to-b from-green-500 to-emerald-500'
          : isCompleted
          ? 'bg-gradient-to-b from-gray-400 to-gray-500'
          : 'bg-gradient-to-b from-indigo-500 to-purple-500'
      }`} />

      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Student Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={session.student.avatar}
              alt={session.student.name}
              className="w-16 h-16 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {session.student.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {session.subject}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(session.date)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={session.status.toUpperCase()}
                onChange={(e) => onUpdateStatus(session.id, e.target.value)}
                disabled={isMarkingComplete}
                className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isInProgress 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : isCompleted
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    : session.status === 'cancelled'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {isCompleted && session.rating && (
              <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {session.rating.toFixed(1)}
                </span>
              </div>
            )}

            <div className="px-4 py-2 bg-linear-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-lg shadow-sm">
              ${session.price}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 lg:ml-auto">
            {isInProgress && (
              <button
                type="button"
                onClick={() => onMarkComplete(session.id)}
                disabled={isMarkingComplete}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isMarkingComplete ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark as Done</span>
                  </>
                )}
              </button>
            )}

            {(isInProgress || isUpcoming) && session.meetingLink && (
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Join Meeting</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => onViewDetails(session)}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              title="View details"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Feedback Preview (for completed sessions) */}
        {isCompleted && session.studentFeedback && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Student Feedback:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "{session.studentFeedback}"
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
