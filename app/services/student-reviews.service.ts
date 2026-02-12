'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export async function getReviewableBookings(cookieString?: string) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieString || cookieStore.toString();
    const res = await fetch(`${env.API_URL}/api/student/reviewable-bookings`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      cache: 'no-store',
    });

    const result = await res.json();
    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch reviewable bookings' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function submitReview(bookingId: string, rating: number, comment?: string, cookieString?: string) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieString || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ bookingId, rating, comment }),
    });

    const result = await res.json();
    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to submit review' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}
