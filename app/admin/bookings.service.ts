'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

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

export async function getAllBookings(params: Record<string, any> = {}, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();
    console.log('Fetching bookings with params:', params, 'and cookies:', cookieString);

    const url = new URL(`${env.API_URL}/api/admin/bookings`);
    
    // Clean and append params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });

    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      cache: 'no-store',
    });

    const result = await res.json();
    
    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch bookings' } };
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
      data: {
        bookings: mappedBookings,
        pagination: {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages
        }
      },
      error: null
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function cancelBooking(id: string, reason: string, refundAmount: number, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify({ reason, refundAmount }),
    });

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to cancel booking' } };
  }
}
