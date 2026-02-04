import { apiClient } from '@/lib/api-client';

export interface Booking {
  id: string;
  bookingNumber: string;
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string; // Initials or URL
    expertise: string;
  };
  course: {
    id: string;
    name: string;
    category: string;
  };
  session: {
    date: string;
    time: string;
    duration: number;
    type: 'video' | 'audio' | 'in-person';
    meetingLink?: string;
  };
  payment: {
    amount: number;
    status: 'paid' | 'pending' | 'refunded';
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  hasReview: boolean;
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export const BookingService = {
  async getBookings(limit = 100): Promise<Booking[]> {
    const response = await apiClient.get(`/api/student/bookings?limit=${limit}`);
    return response.data.map((booking: any) => this.transformBooking(booking));
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await apiClient.patch(`/api/student/bookings/${bookingId}/cancel`, {});
  },

  async submitReview(bookingId: string, rating: number, comment?: string): Promise<void> {
    await apiClient.post('/api/student/reviews', {
      bookingId,
      rating,
      comment,
    });
  },

  formatUTCDate(date: Date): string {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  },

  formatUTCTime(date: Date): string {
    const h = date.getUTCHours();
    const m = date.getUTCMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  transformBooking(booking: any): Booking {
    const scheduledDate = new Date(booking.scheduledAt); // UTC
    const sessionEndTime = new Date(
      scheduledDate.getTime() + booking.duration * 60000
    );

    const now = new Date(); // current time (UTC internally)

    let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';

    if (booking.status === 'CANCELLED') {
      status = 'cancelled';
    } else if (booking.status === 'COMPLETED') {
      status = 'completed';
    } else if (scheduledDate <= now && now <= sessionEndTime) {
      status = 'ongoing';
    } else if (scheduledDate > now) {
      status = 'upcoming';
    } else {
      status = 'completed';
    }

    const tutorName = booking.tutor_profile?.user?.name || 'Unknown Tutor';
    const initials = tutorName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();

    return {
      id: booking.id,
      bookingNumber: `BK-${booking.id.slice(0, 8)}`,
      tutor: {
        id: booking.tutor_profile?.userId || '',
        name: tutorName,
        email: booking.tutor_profile?.user?.email || '',
        avatar: initials,
        expertise: booking.subject || 'General',
      },
      course: {
        id: booking.id,
        name: booking.subject || 'Session',
        category: 'Learning',
      },
      session: {
        date: this.formatUTCDate(scheduledDate),
        time: this.formatUTCTime(scheduledDate),
        duration: booking.duration,
        type: 'video',
        meetingLink: booking.meetingLink,
      },
      payment: {
        amount: booking.price,
        status: 'paid',
      },
      status,
      createdAt: booking.createdAt,
      completedAt:
        booking.status === 'COMPLETED' ? booking.updatedAt : undefined,
      hasReview: !!booking.review,
      review: booking.review
        ? {
            id: booking.review.id,
            rating: booking.review.rating,
            comment: booking.review.comment || '',
            createdAt: booking.review.createdAt,
          }
        : undefined,
    };
  }
};
