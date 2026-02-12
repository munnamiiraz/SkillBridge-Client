'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export interface UserStats {
  total: number;
  byRole: {
    admin: number;
    tutor: number;
    student: number;
  };
  newThisWeek: number;
}

export interface BookingStats {
  total: number;
  byStatus: {
    completed: number;
    cancelled: number;
    pending: number;
    confirmed: number;
  };
  newThisWeek: number;
}

export interface RevenueStats {
  total: number;
  completedBookings: number;
}

export interface PlatformStats {
  users: UserStats;
  bookings: BookingStats;
  revenue: RevenueStats;
}

export async function getPlatformStats(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/stats`, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch platform stats' } };
    }

    return { data: result.data as PlatformStats, error: null };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}
