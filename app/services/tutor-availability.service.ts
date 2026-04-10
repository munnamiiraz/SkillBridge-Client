"use server";
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export interface DayAvailability {
  date: string;
  dayName: string;
  displayDate: string;
  isEnabled: boolean;
  slots: TimeSlot[];
}

export interface WeeklySchedule {
  [key: string]: DayAvailability;
}

export async function getTutorAvailability(weekStartDate: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString() || providedCookies || "";
    const response = await fetch(`${env.API_URL}/api/tutor/availability-slots?weekStartDate=${weekStartDate}`, {
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
    return { data: null, error: { message: result.message || 'Failed to fetch availability' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function saveTutorAvailability(weekStartDate: string, slots: any[], providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString() || providedCookies || "";
    const response = await fetch(`${env.API_URL}/api/tutor/availability-slots`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      body: JSON.stringify({
        weekStartDate,
        slots
      }),
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to save availability' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
