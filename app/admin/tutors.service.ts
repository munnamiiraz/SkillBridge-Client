"use server";
import { env } from '@/env';
import { cookies } from 'next/headers';

export async function getUnverifiedTutors(cookieString?: string) {
  try {
    const cookieStore = await cookies();
    const finalCookie = cookieString || cookieStore.toString();

    // Reusing the search API but filtering by verification status would be best
    // For now, let's assume we have an admin endpoint or use the general users list
    const response = await fetch(`${env.API_URL}/api/admin/users?role=TUTOR`, {
      headers: {
        'Cookie': finalCookie,
      },
      cache: 'no-store'
    });
    
    const result = await response.json();
    if (result.success) {
      // Filter for unverified tutors with sessions >= 10
      // In a real app, you'd have a specific list for pending requests
      return { data: result.data.users, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch tutors' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function verifyTutor(tutorProfileId: string, cookieString?: string) {
  try {
    const cookieStore = await cookies();
    const finalCookie = cookieString || cookieStore.toString();

    const response = await fetch(`${env.API_URL}/api/admin/verify-tutor/${tutorProfileId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': finalCookie,
      },
    });
    
    const result = await response.json();
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to verify tutor' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
