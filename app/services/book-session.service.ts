'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export async function getTutorForBooking(tutorId: string) {
  try {
    const res = await fetch(`${env.API_URL}/api/public/tutors/${tutorId}`, {
      cache: 'no-store',
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch tutor' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function getTutorAvailability(tutorId: string, weekStartDate: string) {
  try {
    const res = await fetch(`${env.API_URL}/api/public/tutors/${tutorId}/availability?weekStartDate=${weekStartDate}`, {

      cache: 'no-store',
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch availability' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function createBooking(bookingData: {
  tutorProfileId: string;
  scheduledAt: string;
  duration: number;
  subject: string;
  notes: string;
}) {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify(bookingData),
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to create booking' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    console.error('Booking error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function createCheckoutSession(bookingData: {
  tutorProfileId: string;
  scheduledAt: string;
  duration: number;
  subject: string;
  notes: string;
}) {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify(bookingData),
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to initiate payment' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    console.error('Payment error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}
