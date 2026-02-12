import { Session } from './tutor-sessions.service';

export function filterTutorSessions(sessions: Session[], activeTab: 'upcoming' | 'in-progress' | 'past'): Session[] {
  return sessions.filter(session => {
      if (activeTab === 'upcoming') {
          const isUpcoming = new Date(session.date) > new Date();
          return (session.status === 'confirmed' || session.status === 'pending') && isUpcoming;
      }
      if (activeTab === 'in-progress') {
          if (session.status === 'ongoing') return true;
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
}

export function calculateTutorSessionStats(sessions: Session[]) {
  return {
      totalSessions: sessions.filter(s => s.status === 'completed').length,
      upcomingSessions: sessions.filter(
          s => (s.status === 'confirmed' || s.status === 'pending') && new Date(s.date) > new Date()
      ).length,
      totalEarnings: sessions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + s.price, 0),
      avgRating: sessions.filter(s => s.rating).length > 0 
        ? sessions.reduce((sum, s) => sum + (s.rating || 0), 0) / sessions.filter(s => s.rating).length
        : 0,
  };
}
