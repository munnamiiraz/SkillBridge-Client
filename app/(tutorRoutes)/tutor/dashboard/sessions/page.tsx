"use client"
import React, { useState, useEffect } from 'react';
import { 
  TutorSessionsService, 
  Session 
} from '@/app/services/tutor-sessions.service';

import { StatCard } from './components/StatCard';
import { TabButton } from './components/TabButton';
import { SessionCard } from './components/SessionCard';
import { EmptyState } from './components/EmptyState';
import { SessionDetailsModal } from './components/SessionDetailsModal';

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
    setLoading(true);
    const data = await TutorSessionsService.getSessions();
    setSessions(data);
    setLoading(false);
  };

  // Derived state for stats
  const stats = TutorSessionsService.calculateStats(sessions);

  // Derived state for filtered sessions
  const filteredSessions = TutorSessionsService.filterSessions(sessions, activeTab);

  const handleUpdateStatus = async (sessionId: string, newStatus: string) => {
    if (isMarkingComplete) return;
    
    setIsMarkingComplete(true);
    const success = await TutorSessionsService.updateSessionStatus(sessionId, newStatus);
    
    if (success) {
      await fetchSessions(); // Refresh list
      if (selectedSession && selectedSession.id === sessionId) {
          // Update modal as well
          setSelectedSession(prev => prev ? { ...prev, status: newStatus.toLowerCase() as any } : null);
      }
    }
    setIsMarkingComplete(false);
  };

  const handleMarkAsComplete = async (sessionId: string) => {
      await handleUpdateStatus(sessionId, 'COMPLETED');
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading sessions...</p>
            </div>
        </div>
     )
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
              count={TutorSessionsService.filterSessions(sessions, 'in-progress').length}
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
              count={TutorSessionsService.filterSessions(sessions, 'upcoming').length}
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
              count={TutorSessionsService.filterSessions(sessions, 'past').length}
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
                onUpdateStatus={handleUpdateStatus}
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
          onUpdateStatus={handleUpdateStatus}
          isMarkingComplete={isMarkingComplete}
        />
      )}
    </div>
  );
};

export default TutorSessionsPage;