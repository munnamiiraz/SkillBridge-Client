'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  updateTutorSessionStatus,
  Session 
} from '@/app/services/tutor-sessions.service';
import { filterTutorSessions } from '@/app/services/tutor-sessions.helpers';
import { TabButton } from './TabButton';
import { SessionCard } from './SessionCard';
import { EmptyState } from './EmptyState';
import { SessionDetailsModal } from './SessionDetailsModal';

interface TutorSessionsClientProps {
  initialSessions: Session[];
  activeTab: 'upcoming' | 'in-progress' | 'past';
}

export const TutorSessionsClient: React.FC<TutorSessionsClientProps> = ({ initialSessions, activeTab: initialTab }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const filteredSessions = filterTutorSessions(initialSessions, activeTab);

  const handleUpdateStatus = async (sessionId: string, newStatus: string) => {
    if (isMarkingComplete) return;
    
    setIsMarkingComplete(true);
    try {
      const result = await updateTutorSessionStatus(sessionId, newStatus);
      
      if (result.data) {
        toast.success(`Session status updated to ${newStatus}`);
        router.refresh();
        if (selectedSession && selectedSession.id === sessionId) {
          setSelectedSession(prev => prev ? { ...prev, status: newStatus.toLowerCase() as any } : null);
        }
      } else {
        toast.error(result.error?.message || 'Failed to update session status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleMarkAsComplete = async (sessionId: string) => {
    await handleUpdateStatus(sessionId, 'COMPLETED');
  };

  return (
    <>
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <TabButton
            active={activeTab === 'in-progress'}
            onClick={() => setActiveTab('in-progress')}
            label="In Progress"
            count={filterTutorSessions(initialSessions, 'in-progress').length}
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
            count={filterTutorSessions(initialSessions, 'upcoming').length}
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
            count={filterTutorSessions(initialSessions, 'past').length}
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
    </>
  );
};
