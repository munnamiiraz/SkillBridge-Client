'use server';

import { env } from '@/env';

export async function getTutorReviews(tutorId: string, page: number = 1, limit: number = 10) {
  try {
    const url = new URL(`${env.API_URL}/api/public/reviews`);
    url.searchParams.append('tutorProfileId', tutorId);
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', String(limit));

    const res = await fetch(url.toString(), {
      cache: 'no-store',
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, meta: null, error: { message: result.message || 'Failed to fetch reviews' } };
    }

    return { data: result.data, meta: result.meta, error: null };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, meta: null, error: { message: 'Something Went Wrong' } };
  }
}

export async function getTutorBasicInfo(tutorId: string) {
  try {
    const res = await fetch(`${env.API_URL}/api/public/tutors/${tutorId}`, {
      cache: 'no-store',
    });

    const result = await res.json();

    if (!result.success) {
      return { data: null, error: { message: result.message || 'Failed to fetch tutor' } };
    }

    return { data: result.data, error: null };
  } catch (err) {
    console.error('Fetch error:', err);
    return { data: null, error: { message: 'Something Went Wrong' } };
  }
}
