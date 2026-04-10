import { env } from '@/env';

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

export async function getPublicCategories() {
  try {
    const response = await fetch(`${env.API_URL}/api/public/categories`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();
    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'Failed to fetch categories' } };
  }
}

export async function searchTutors(filters: TutorFilters) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${env.API_URL}/api/public/tutors/search?${params.toString()}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    const result = await response.json();
    
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
        banner: t.banner || '',
      }));

      return {
        data: {
          tutors: mappedTutors,
          meta: result.meta
        },
        error: null
      };
    }
    
    return { data: null, error: { message: result.message || 'Failed to fetch tutors' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message || 'An unexpected error occurred' } };
  }
}

// Deprecated: Keeping for compatibility while transitioning
export const TutorPublicService = {
  getCategories: getPublicCategories,
  searchTutors: searchTutors
};
