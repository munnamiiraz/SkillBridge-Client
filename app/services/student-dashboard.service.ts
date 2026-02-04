import { apiClient } from '@/lib/api-client';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  image: string | null;
  role: 'STUDENT';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  scheduledAt: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  subject: string | null;
  price: number;
  tutor_profile: {
    user: {
      name: string;
      image: string | null;
    };
  };
  review?: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  };
}

export interface DashboardStats {
  totalBookings: number;
  completedSessions: number;
  upcomingSessions: number;
  totalSpent: number;
  averageRating: string;
}

export const StudentDashboardService = {
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get('/api/student/profile');
    return response.data;
  },

  async getBookings(): Promise<Booking[]> {
    const response = await apiClient.get('/api/student/bookings?limit=100');
    return response.data;
  },

  calculateStats(bookings: Booking[]): DashboardStats {
    const reviews = bookings
      .filter(b => b.review)
      .map(b => b.review!);

    return {
      totalBookings: bookings.length,
      completedSessions: bookings.filter(b => b.status === 'COMPLETED').length,
      upcomingSessions: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
      totalSpent: bookings
        .filter(b => b.status !== 'CANCELLED')
        .reduce((sum, b) => sum + b.price, 0),
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0',
    };
  }
};
