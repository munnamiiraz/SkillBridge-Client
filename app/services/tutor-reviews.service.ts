import { apiClient } from '@/lib/api-client';

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

export const TutorReviewsService = {
  async getRatingStats(): Promise<RatingStats | null> {
    const response = await apiClient.get('/api/tutor/rating-stats');
    if (response.success) {
      const data = response.data;
      const distMap: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      if (data.distribution) {
        data.distribution.forEach((d: any) => {
            distMap[d.rating] = d.count;
        });
      }
      
      return {
        average: Number(data.averageRating) || 0,
        total: Number(data.totalReviews) || 0,
        distribution: distMap
      };
    }
    return null;
  },

  async getReviews(page = 1, limit = 5, rating?: number | null, sortBy?: string): Promise<ReviewsResponse | null> {
    const params: any = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (rating) {
      params.rating = rating.toString();
    }
    
    // Note: The original code had sortBy in state but didn't pass it to API.
    // We include it here for future proofing if the backend supports it.
    if (sortBy) {
        params.sortBy = sortBy;
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/tutor/reviews?${queryString}`);

    if (response.success) {
      const reviews = response.data.map((r: any) => ({
        id: r.id,
        studentName: r.user?.name || 'Anonymous',
        studentAvatar: r.user?.image || (r.user?.name || 'A').toUpperCase().charAt(0),
        rating: r.rating,
        date: r.createdAt,
        courseName: r.booking?.subject || 'Session',
        comment: r.comment,
        helpful: 0 // Backend doesn't seem to return helpful count yet
      }));

      return {
        reviews,
        meta: response.meta
      };
    }
    
    return null;
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
};
