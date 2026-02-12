'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'tutor';
  status: 'active' | 'banned' | 'pending';
  joinDate: string;
  lastActive: string;
  stats: {
    courses?: number;
    students?: number;
    rating?: number;
    revenue?: number;
    completedCourses?: number;
    hoursLearned?: number;
  };
  verification?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
}

export async function getAllUsers(params: Record<string, any> = {}, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const url = new URL(`${env.API_URL}/api/admin/users`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });

    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      cache: 'no-store',
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch users' } };
    }

    const { data, meta } = result;

    const mappedUsers: User[] = data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.name ? u.name.charAt(0).toUpperCase() : '?',
      role: u.role.toLowerCase(),
      status: u.status.toLowerCase(),
      joinDate: u.createdAt,
      lastActive: u.updatedAt,
      stats: u.role === 'TUTOR' ? {
         rating: u.tutor_profile?.averageRating || 0,
         students: 0,
         revenue: 0,
         courses: 0
      } : {
         completedCourses: 0,
         hoursLearned: 0
      },
      verification: {
         email: u.emailVerified || true,
         phone: false,
         identity: false
      }
    }));

    return {
      data: {
        users: mappedUsers,
        pagination: {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages
        }
      },
      error: null
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function banUser(id: string, reason: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/users/${id}/ban`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify({ banReason: reason }),
    });

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to ban user' } };
  }
}

export async function unbanUser(id: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/users/${id}/unban`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to unban user' } };
  }
}
