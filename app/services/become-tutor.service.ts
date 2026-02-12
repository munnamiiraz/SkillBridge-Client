"use server";
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface Category {
  id: string;
  name: string;
  subject: Array<{
    id: string;
    name: string;
  }>;
}

export async function getCategories() {
  try {
    const response = await fetch(`${env.API_URL}/api/public/categories`, {
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data as Category[], error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch categories' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function createTutorProfile(formData: {
  headline: string;
  bio: string;
  hourlyRate: number;
  experience: number;
  education: string;
  subjectIds: string[];
}) {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    
    const response = await fetch(`${env.API_URL}/api/tutor/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString,
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to create profile' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
