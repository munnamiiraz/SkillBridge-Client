'use server';

import { cookies } from 'next/headers';
import { env } from '@/env';

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  tutorCount: number;
  courseCount: number;
  subjects?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export async function getAllCategories(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/categories`, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      cache: 'no-store',
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch categories' } };
    }

    const mappedCategories: Category[] = result.data.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      status: c.status?.toLowerCase() || 'active',
      tutorCount: c._count?.tutor_profiles || 0,
      courseCount: c._count?.subject || 0,
      subjects: c.subject?.map((s: any) => ({ id: s.id, name: s.name })) || [],
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return { data: mappedCategories, error: null };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function createCategory(data: { name: string; description: string; status: string }, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to create category' } };
  }
}

export async function updateCategory(id: string, data: { name?: string; description?: string; status?: string }, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to update category' } };
  }
}

export async function deleteCategory(id: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to delete category' } };
  }
}

// Subject Methods
export async function createSubject(data: { name: string; categoryId: string }, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to create subject' } };
  }
}

export async function updateSubject(id: string, data: { name?: string; categoryId?: string }, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/subjects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to update subject' } };
  }
}

export async function deleteSubject(id: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const res = await fetch(`${env.API_URL}/api/admin/subjects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
    });

    const result = await res.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to delete subject' } };
  }
}

export async function getAllSubjects(categoryId?: string, providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = providedCookies || cookieStore.toString();

    const url = new URL(`${env.API_URL}/api/admin/subjects`);
    if (categoryId) url.searchParams.append('categoryId', categoryId);

    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString ? { 'Cookie': cookieString } : {}),
      },
      cache: 'no-store',
    });

    const result = await res.json();
    return { data: result.data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch subjects' } };
  }
}
