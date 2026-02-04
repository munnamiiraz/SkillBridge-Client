import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Session {
  id: string;
  student: Student;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled' | 'confirmed' | 'pending' | 'ongoing';
  duration: number; // in minutes
  meetingLink?: string;
  notes?: string;
  rating?: number;
  studentFeedback?: string;
  price: number;
}

export const TutorSessionsService = {
  formatUTCTime(date: Date): string {
    const h = date.getUTCHours();
    const m = date.getUTCMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  async getSessions(): Promise<Session[]> {
    try {
      const response = await apiClient.get('/api/tutor/sessions');
      
      if (response.success) {
        return response.data.map((booking: any) => ({
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
          startTime: this.formatUTCTime(new Date(booking.scheduledAt)),
          // Calculate end time based on duration
          endTime: this.formatUTCTime(
            new Date(new Date(booking.scheduledAt).getTime() + 1 * 60 * 60 * 1000)
          ),

          status: booking.status.toLowerCase(),
          duration: booking.duration,
          meetingLink: booking.meetingLink,
          notes: booking.notes,
          rating: booking.review?.rating,
          studentFeedback: booking.review?.comment,
          price: booking.price
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
      return [];
    }
  },

  async updateSessionStatus(sessionId: string, newStatus: string): Promise<boolean> {
    try {
      const response = await apiClient.patch(`/api/tutor/sessions/${sessionId}/status`, {
        status: newStatus
      });

      if (response.success) {
        toast.success(`Session status updated to ${newStatus}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating session status:', error);
      toast.error('Failed to update session status');
      return false;
    }
  },

  filterSessions(sessions: Session[], activeTab: 'upcoming' | 'in-progress' | 'past'): Session[] {
    return sessions.filter(session => {
        if (activeTab === 'upcoming') {
            const isUpcoming = new Date(session.date) > new Date();
            return (session.status === 'confirmed' || session.status === 'pending') && isUpcoming;
        }
        if (activeTab === 'in-progress') {
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
  },

  calculateStats(sessions: Session[]) {
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
};
