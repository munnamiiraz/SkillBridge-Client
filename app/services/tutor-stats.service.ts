"use server";
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface EarningsStat {
  month: string;
  earnings: number;
}

export async function getEarningsStats() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/earnings-stats`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data as EarningsStat[], error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch earnings stats' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
