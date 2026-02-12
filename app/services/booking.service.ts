'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

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

export async function getStudentBookingsList(limit = 100, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/bookings?limit=${limit}`, {
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

    const transformedData = result.data.map((booking: any) => transformBookingData(booking));
    return { data: transformedData as Booking[], error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function cancelStudentBooking(bookingId: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to cancel booking' } };
  }
}

export async function submitStudentReview(bookingId: string, rating: number, comment?: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify({ bookingId, rating, comment }),
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to submit review' } };
  }
}

function formatUTCDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatUTCTime(date: Date): string {
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function transformBookingData(booking: any): Booking {
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
      date: formatUTCDate(scheduledDate),
      time: formatUTCTime(scheduledDate),
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
