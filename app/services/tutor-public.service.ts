import { apiClient } from '@/lib/api-client';

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  isOnline: boolean;
  verified: boolean;
  bgGradient: string;
  totalStudents: number;
  bio: string;
}

export interface TutorFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  searchTerm?: string;
  subject?: string;
  category?: string;
  minRating?: number;
  minTotalReviews?: number;
  minPrice?: number;
  maxPrice?: number;
}

const gradients = [
  'from-indigo-600 to-purple-600',
  'from-blue-600 to-cyan-600',
  'from-rose-600 to-orange-600',
  'from-emerald-600 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-slate-600 to-zinc-700',
];

export const TutorPublicService = {
  async getCategories() {
    const result = await apiClient.get('/api/public/categories');
    return result.data;
  },

  async searchTutors(filters: TutorFilters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const result = await apiClient.get(`/api/public/tutors/search?${params.toString()}`);
    
    if (result.success) {
      const mappedTutors = result.data.map((t: any, index: number) => ({
        id: t.id,
        name: t.user.name,
        avatar: t.user.image || (t.user.name?.[0]?.toUpperCase() || 'T'),
        subject: t.tutor_subject?.[0]?.subject?.name || 'General',
        rating: t.averageRating || 0,
        reviewCount: t.totalReviews || 0,
        pricePerSession: t.hourlyRate,
        isOnline: t.isAvailable,
        verified: t.user.emailVerified,
        bgGradient: gradients[index % gradients.length],
        totalStudents: t.totalSessions || 0,
        bio: t.bio || 'No bio available',
      }));

      return {
        tutors: mappedTutors,
        meta: result.meta
      };
    }
    
    throw new Error(result.message || 'Failed to fetch tutors');
  }
};
