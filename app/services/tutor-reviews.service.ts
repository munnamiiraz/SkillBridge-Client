"use server"
import { env } from '@/env';
import { cookies } from 'next/headers';

export interface Review {
  id: string;
  studentName: string;
  studentAvatar: string; // URL or Initials char
  rating: number;
  date: string;
  courseName: string;
  comment: string;
  helpful: number;
}

export interface RatingStats {
  average: number;
  total: number;
  responseRate: number;
  avgResponseTime: string;
  retentionRate: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getTutorRatingStats(providedCookies?: string) {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString() || providedCookies || "";
    const response = await fetch(`${env.API_URL}/api/tutor/rating-stats`, {
      headers: {
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();
    
    if (result.success) {
      const data = result.data;
      const distMap: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      if (data.distribution) {
        data.distribution.forEach((d: any) => {
            distMap[d.rating] = d.count;
        });
      }
      
      const stats: RatingStats = {
        average: Number(data.averageRating) || 0,
        total: Number(data.totalReviews) || 0,
        responseRate: data.responseRate || 100,
        avgResponseTime: data.avgResponseTime || "15m",
        retentionRate: data.retentionRate || 0,
        distribution: distMap
      };
      return { data: stats, error: null };
    }
    return { data: null, error: { message: result.message || 'Failed to fetch rating stats' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

export async function getTutorReviews(page = 1, limit = 5, rating: number | null = null, sortBy: string | null = null, providedCookies?: string) {
  try {
    const params: any = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (rating) {
      params.rating = rating.toString();
    }
    
    if (sortBy) {
        params.sortBy = sortBy;
    }

    const cookieStore = await cookies();
    const cookieString = cookieStore.toString() || providedCookies || "";

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${env.API_URL}/api/tutor/reviews?${queryString}`, {
      headers: {
        'Cookie': cookieString,
      },
      cache: 'no-store'
    });
    const result = await response.json();

    if (result.success) {
      const reviews = result.data.map((r: any) => ({
        id: r.id,
        studentName: r.user?.name || 'Anonymous',
        studentAvatar: r.user?.image || (r.user?.name || 'A').toUpperCase().charAt(0),
        rating: r.rating,
        date: r.createdAt,
        courseName: r.booking?.subject || 'Session',
        comment: r.comment,
        helpful: 0 
      }));

      return {
        data: {
          reviews,
          meta: result.meta
        } as ReviewsResponse,
        error: null
      };
    }
    
    return { data: null, error: { message: result.message || 'Failed to fetch reviews' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}
