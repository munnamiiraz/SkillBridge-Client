'use client';

import { env } from '@/env';

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalRevenue: number;
    totalBookings: number;
    successRate: number;
  };
  charts: {
    userGrowth: Array<{ month: string; count: number }>;
    revenueGrowth: Array<{ month: string; amount: number }>;
    roleDistribution: Array<{ name: string; value: number }>;
    bookingDistribution: Array<{ name: string; value: number }>;
    categoryRevenue: Array<{ name: string; value: number }>;
  };
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
}

export const adminService = {
  getStats: async () => {
    try {
      // Note: In client components we use axios or fetch with credentials
      // Since this is likely a client component calling this, we use the standard fetch
      // Use relative path to leverage Next.js rewrites and automatic cookie forwarding
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Content-Type': 'application/json',
        },
        // Ensure cookies are sent with the request
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) return result.data as DashboardStats;
      throw new Error(result.message);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      return null;
    }
  },

  getProfile: async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.message);
    } catch (error) {
       console.error('Failed to fetch admin profile:', error);
       return null;
    }
  },

  getUsers: async (page = 1, limit = 10, search = '', role = '', status = '') => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        role,
        status
      });
      const response = await fetch(`/api/admin/users?${query}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) return result;
      throw new Error(result.message);
    } catch (error) {
       console.error('Failed to fetch users:', error);
       return null;
    }
  },

  updateUserStatus: async (userId: string, data: { status: string, banReason?: string }) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.message);
    } catch (error) {
       console.error('Failed to update user status:', error);
       toast.error(error instanceof Error ? error.message : 'Unknown error');
       return null;
    }
  },

  verifyTutor: async (tutorProfileId: string) => {
    try {
      const response = await fetch(`/api/admin/verify-tutor/${tutorProfileId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.message);
    } catch (error) {
       console.error('Failed to verify tutor:', error);
       toast.error(error instanceof Error ? error.message : 'Unknown error');
       return null;
    }
  },

  getBookings: async (page = 1, limit = 10, search = '', status = '') => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status
      });
      const response = await fetch(`/api/admin/bookings?${query}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) return result;
      throw new Error(result.message);
    } catch (error) {
       console.error('Failed to fetch bookings:', error);
       return null;
    }
  },

  cancelBooking: async (bookingId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reason })
      });
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.message);
    } catch (error) {
       console.error('Failed to cancel booking:', error);
       toast.error(error instanceof Error ? error.message : 'Unknown error');
       return null;
    }
  }
};
