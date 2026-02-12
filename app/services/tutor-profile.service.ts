"use server";
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string;
  headline?: string;
  hourlyRate: number;
  address?: string;
  experience: number;
  education?: string;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  totalSessions: number;
  isFeatured: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  tutor_subject?: {
    subject: {
      name: string;
      category: {
        name: string;
      };
    };
  }[];
  availability_slot?: {
    dayOfWeek: number;
    startTime: string;
  }[];
  ratingStats?: {
    averageRating: number;
    totalReviews: number;
    distribution: { stars: number; count: number; percentage: number }[] | Record<number, number>;
  };
}

export async function getTutorProfileDetail(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data as TutorProfile, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch tutor profile' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function updateTutorProfile(data: any, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to update tutor profile' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function createTutorProfile(data: any, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();
    const response = await fetch(`${env.API_URL}/api/tutor/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data as TutorProfile, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to create tutor profile' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
