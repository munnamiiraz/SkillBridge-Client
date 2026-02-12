"use server"
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Session {
  id: string;
  student: Student;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled' | 'confirmed' | 'pending' | 'ongoing';
  duration: number; // in minutes
  meetingLink?: string;
  notes?: string;
  rating?: number;
  studentFeedback?: string;
  price: number;
}

function formatUTCTime(date: Date): string {
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function getTutorSessions(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/sessions`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      const mappedSessions = result.data.map((booking: any) => ({
        id: booking.id,
        student: {
          id: booking.user.id,
          name: booking.user.name,
          avatar: booking.user.image || `https://ui-avatars.com/api/?name=${booking.user.name}&background=random`,
          email: booking.user.email
        },
        subject: booking.subject || 'General Session',
        date: booking.scheduledAt, 
        startTime: formatUTCTime(new Date(booking.scheduledAt)),
        endTime: formatUTCTime(
          new Date(new Date(booking.scheduledAt).getTime() + (booking.duration || 60) * 60 * 1000)
        ),
        status: booking.status.toLowerCase(),
        duration: booking.duration,
        meetingLink: booking.meetingLink,
        notes: booking.notes,
        rating: booking.review?.rating,
        studentFeedback: booking.review?.comment,
        price: booking.price
      }));

      return { data: mappedSessions as Session[], error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch sessions' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function updateTutorSessionStatus(sessionId: string, newStatus: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/sessions/${sessionId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to update session status' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
