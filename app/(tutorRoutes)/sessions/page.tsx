"use client"
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface Session {
  id: string;
  student: Student;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled' | 'confirmed' | 'pending';
  duration: number; // in minutes
  meetingLink?: string;
  notes?: string;
  rating?: number;
  studentFeedback?: string;
  price: number;
}

type TabType = 'upcoming' | 'in-progress' | 'past';

const TutorSessionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await apiClient.get('/api/tutor/sessions');
      
      if (response.success) {
        // Map backend data to frontend model
        const mappedSessions: Session[] = response.data.map((booking: any) => ({
          id: booking.id,
          student: {
            id: booking.user.id,
            name: booking.user.name,
            avatar: booking.user.image || `https://ui-avatars.com/api/?name=${booking.user.name}&background=random`,
            email: booking.user.email
          },
          subject: booking.subject || 'General Session',
          date: booking.scheduledAt, 
          // Extract time from scheduledAt date object
          startTime: new Date(booking.scheduledAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          // Calculate end time based on duration
          endTime: new Date(new Date(booking.scheduledAt).getTime() + booking.duration * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          status: booking.status.toLowerCase(),
          duration: booking.duration,
          meetingLink: booking.meetingLink,
          notes: booking.notes,
          rating: booking.review?.rating,
          studentFeedback: booking.review?.comment,
          price: booking.price
        }));
        setSessions(mappedSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    // Map backend status to tab logic
    // Backend statuses: PENDING, CONFIRMED, CANCELLED, COMPLETED, IN_PROGRESS (if added)
    // Assuming 'CONFIRMED' implies upcoming. 'PENDING' might also be upcoming or separate.
    
    if (activeTab === 'upcoming') {
        const isUpcoming = new Date(session.date) > new Date();
        return (session.status === 'confirmed' || session.status === 'pending') && isUpcoming;
    }
    if (activeTab === 'in-progress') {
        // Backend might not strictly have 'in-progress', usually determined by time
        const now = new Date();
        const start = new Date(session.date);
        const end = new Date(start.getTime() + session.duration * 60000);
        return session.status === 'confirmed' && now >= start && now <= end;
    }
    if (activeTab === 'past') {
        return session.status === 'completed' || session.status === 'cancelled' || (session.status === 'confirmed' && new Date(session.date) < new Date());
    }
    return false;
  });

  const handleMarkAsComplete = async (sessionId: string) => {
    setIsMarkingComplete(true);
    
    try {
      const response = await apiClient.patch(`/api/tutor/sessions/${sessionId}/status`, {
        status: 'COMPLETED'
      });

      if (response.success) {
        toast.success('Session marked as complete');
        // Refresh sessions to show update
        fetchSessions();
      }
    } catch (error) {
      console.error('Error marking session as complete:', error);
      toast.error('Failed to update session status');
    } finally {
      setIsMarkingComplete(false);
      setSelectedSession(null);
    }
  };

  const stats = {
    totalSessions: sessions.filter(s => s.status === 'completed').length,
    upcomingSessions: sessions.filter(s => (s.status === 'confirmed' || s.status === 'pending') && new Date(s.date) > new Date()).length,
    totalEarnings: sessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.price, 0),
    avgRating: sessions.filter(s => s.rating).length > 0 
      ? sessions.reduce((sum, s) => sum + (s.rating || 0), 0) / sessions.filter(s => s.rating).length
      : 0,
  };

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
              Teaching Sessions
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Manage your current, upcoming, and past tutoring sessions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Completed Sessions"
            value={stats.totalSessions.toString()}
            trend="+12% this month"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Upcoming Sessions"
            value={stats.upcomingSessions.toString()}
            trend="Next in 2 hours"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total Earnings"
            value={`$${stats.totalEarnings}`}
            trend="This month"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
            label="Average Rating"
            value={stats.avgRating.toFixed(1)}
            trend="From students"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <TabButton
              active={activeTab === 'in-progress'}
              onClick={() => setActiveTab('in-progress')}
              label="In Progress"
              count={sessions.filter(s => {
                  const now = new Date();
                  const start = new Date(s.date);
                  const end = new Date(start.getTime() + s.duration * 60000);
                  return s.status === 'confirmed' && now >= start && now <= end;
              }).length}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <TabButton
              active={activeTab === 'upcoming'}
              onClick={() => setActiveTab('upcoming')}
              label="Upcoming"
              count={sessions.filter(s => (s.status === 'confirmed' || s.status === 'pending') && new Date(s.date) > new Date()).length}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <TabButton
              active={activeTab === 'past'}
              onClick={() => setActiveTab('past')}
              label="Past Sessions"
              count={sessions.filter(s => s.status === 'completed' || s.status === 'cancelled' || (s.status === 'confirmed' && new Date(s.date) < new Date())).length}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onMarkComplete={handleMarkAsComplete}
                onViewDetails={setSelectedSession}
                isMarkingComplete={isMarkingComplete}
              />
            ))
          ) : (
            <EmptyState activeTab={activeTab} />
          )}
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onMarkComplete={handleMarkAsComplete}
          isMarkingComplete={isMarkingComplete}
        />
      )}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend }) => {
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
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        {trend && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, count, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold rounded-full ${
        active
          ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}>
        {count}
      </span>
    </button>
  );
};

// Session Card Component
interface SessionCardProps {
  session: Session;
  onMarkComplete: (sessionId: string) => void;
  onViewDetails: (session: Session) => void;
  isMarkingComplete: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onMarkComplete, onViewDetails, isMarkingComplete }) => {
  const isInProgress = session.status === 'in-progress';
  const isCompleted = session.status === 'completed';
  const isUpcoming = session.status === 'upcoming';

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
              className="w-16 h-16 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
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

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            {isInProgress && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                In Progress
              </span>
            )}
            
            {isCompleted && session.rating && (
              <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {session.rating.toFixed(1)}
                </span>
              </div>
            )}

            <div className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-lg shadow-sm">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
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

// Empty State Component
interface EmptyStateProps {
  activeTab: TabType;
}

const EmptyState: React.FC<EmptyStateProps> = ({ activeTab }) => {
  const messages = {
    'upcoming': {
      title: 'No upcoming sessions',
      description: 'You don\'t have any sessions scheduled yet. Students will be able to book sessions based on your availability.',
    },
    'in-progress': {
      title: 'No sessions in progress',
      description: 'You don\'t have any active sessions right now. Check your upcoming sessions.',
    },
    'past': {
      title: 'No past sessions',
      description: 'You haven\'t completed any sessions yet. Your session history will appear here.',
    },
  };

  const message = messages[activeTab];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
        <svg
          className="relative w-full h-full text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {message.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {message.description}
      </p>
    </div>
  );
};

// Session Details Modal Component
interface SessionDetailsModalProps {
  session: Session;
  onClose: () => void;
  onMarkComplete: (sessionId: string) => void;
  isMarkingComplete: boolean;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ 
  session, 
  onClose, 
  onMarkComplete,
  isMarkingComplete 
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Session Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Student Info */}
            <div className="flex items-start gap-6">
              <img
                src={session.student.avatar}
                alt={session.student.name}
                className="w-20 h-20 rounded-full ring-4 ring-gray-200 dark:ring-gray-700"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {session.student.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {session.student.email}
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-lg">
                  {session.subject}
                </span>
              </div>
            </div>

            {/* Session Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <InfoCard
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                label="Date"
                value={formatDate(session.date)}
              />
              <InfoCard
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Time"
                value={`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`}
              />
              <InfoCard
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Duration"
                value={`${session.duration} minutes`}
              />
              <InfoCard
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label="Session Fee"
                value={`$${session.price}`}
              />
            </div>

            {/* Meeting Link */}
            {session.meetingLink && session.status !== 'completed' && (
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Meeting Link
                </p>
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium break-all"
                >
                  {session.meetingLink}
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Notes */}
            {session.notes && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Session Notes
                </p>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    {session.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Student Feedback */}
            {session.rating && session.studentFeedback && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Student Feedback
                </p>
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < session.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{session.studentFeedback}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {session.status === 'in-progress' && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-8 py-6">
              <button
                type="button"
                onClick={() => onMarkComplete(session.id)}
                disabled={isMarkingComplete}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isMarkingComplete ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Marking as Complete...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark Session as Complete</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Info Card Component (for modal)
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-gray-900 dark:text-white font-semibold">
        {value}
      </p>
    </div>
  );
};

export default TutorSessionsPage;