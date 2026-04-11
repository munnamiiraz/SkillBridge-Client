"use server";
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface EarningsStat {
  month: string;
  earnings: number;
}

export interface TutorAnalytics {
  earningsTrend: EarningsStat[];
  sessionStatus: { name: string; value: number }[];
  subjects: { name: string; sessions: number; revenue: number }[];
  retention: { name: string; value: number }[];
  overview: {
    totalRevenue: number;
    averageRating: number;
    totalSessions: number;
  };
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

export async function getTutorAnalytics() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/analytics`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data as TutorAnalytics, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch analytics' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function getMarketIntelligence() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/market-intelligence`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch market intelligence' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
