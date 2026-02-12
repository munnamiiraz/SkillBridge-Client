'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

export async function getStudentProfileData(providedCookies?: string) {
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

    const userData = result.data;
    const transformedProfile: StudentProfile = {
      id: userData.id,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      image: userData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'User'}`,
    };

    return { data: transformedProfile, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function updateStudentProfile(data: Partial<StudentProfile>, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/student/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        address: data.address
      }),
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to update profile' } };
  }
}