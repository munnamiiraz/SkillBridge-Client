import { apiClient } from '@/lib/api-client';

export interface Booking {
  id: string;
  bookingNumber: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string;
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
  };
  payment: {
    amount: number;
    status: 'paid' | 'pending' | 'refunded' | 'failed';
    method: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  notes?: string;
}

export const AdminBookings = {
  async getAll(params: Record<string, any> = {}, cookies?: string) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/api/admin/bookings?${queryString}`;
    
    const result = await apiClient.fetch(endpoint, {
      headers: {
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
    });
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch bookings');
    }

    const { data, meta } = result;

    const mappedBookings: Booking[] = data.map((b: any) => ({
      id: b.id,
      bookingNumber: `BK-${b.id.slice(0, 8)}`,
      student: {
        id: b.user.id,
        name: b.user.name,
        email: b.user.email,
        avatar: b.user.name.charAt(0).toUpperCase(),
      },
      tutor: {
        id: b.tutor_profile.userId,
        name: b.tutor_profile.user.name,
        email: b.tutor_profile.user.email,
        avatar: b.tutor_profile.user.name.charAt(0).toUpperCase(),
      },
      course: {
        id: b.id,
        name: b.subject || 'Session',
        category: 'Learning',
      },
      session: {
        date: b.scheduledAt.split('T')[0],
        time: new Date(b.scheduledAt).toTimeString().slice(0, 5),
        duration: b.duration,
        type: 'video',
      },
      payment: {
        amount: b.price,
        status: 'paid',
        method: 'Credit Card',
      },
      status: (b.status === 'PENDING' || b.status === 'CONFIRMED') ? 'upcoming' : b.status.toLowerCase(),
      createdAt: b.createdAt,
      notes: b.notes,
    }));

    return {
      bookings: mappedBookings,
      pagination: {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages: meta.totalPages
      }
    };
  },

  async cancel(id: string, reason: string, refundAmount: number) {
    return apiClient.patch(`/api/admin/bookings/${id}/cancel`, { reason, refundAmount });
  }
}