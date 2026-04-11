'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  image: string | null;
  role: 'STUDENT';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  scheduledAt: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  subject: string | null;
  price: number;
  tutor_profile: {
    user: {
      name: string;
      image: string | null;
    };
  };
  review?: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  };
}

export interface DashboardStats {
  totalBookings: number;
  completedSessions: number;
  upcomingSessions: number;
  totalSpent: number;
  averageRating: string;
}

export async function getStudentProfile(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/profile`, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      cache: 'no-store',
    });

    const result = await res.json();
    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch profile' } };
    }

    return { data: result.data as StudentProfile, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function getStudentBookings(limit = 10, providedCookies?: string) {
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

    return { data: result.data as Booking[], error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function getStudentStats(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/stats`, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      cache: 'no-store',
    });

    const result = await res.json();
    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch statistics' } };
    }

    return { data: result.data as DashboardStats, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function calculateDashboardStats(bookings: Booking[]): Promise<DashboardStats> {
  const reviews = bookings
    .filter(b => b.review)
    .map(b => b.review!);

  return {
    totalBookings: bookings.length,
    completedSessions: bookings.filter(b => b.status === 'COMPLETED').length,
    upcomingSessions: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
    totalSpent: bookings
      .filter(b => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + b.price, 0),
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };
}
