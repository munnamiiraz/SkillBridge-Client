import { apiClient } from '@/lib/api-client';

export interface UserStats {
  total: number;
  byRole: {
    admin: number;
    tutor: number;
    student: number;
  };
  newThisWeek: number;
}

export interface BookingStats {
  total: number;
  byStatus: {
    completed: number;
    cancelled: number;
    pending: number;
    confirmed: number;
  };
  newThisWeek: number;
}

export interface RevenueStats {
  total: number;
  completedBookings: number;
}

export interface PlatformStats {
  users: UserStats;
  bookings: BookingStats;
  revenue: RevenueStats;
}

export const StatsService = {
  async getPlatformStats(cookies?: string) {
    const result = await apiClient.fetch('/api/admin/stats', {
      headers: {
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch stats');
    }

    return result.data as PlatformStats;
  }
};
