import { apiClient } from '@/lib/api-client';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export const UserService = {
  async getAll(params: Record<string, any> = {}, cookies?: string) {
    // Clean params: remove undefined or null values to prevent "?param=undefined" strings in URL
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/api/admin/users?${queryString}`;
    
    const result = await apiClient.fetch(endpoint, {
      headers: {
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch users');
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
      users: mappedUsers,
      pagination: {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages: meta.totalPages
      }
    };
  },

  async ban(id: string, reason: string) {
    return apiClient.patch(`/api/admin/users/${id}/ban`, { banReason: reason });
  },

  async unban(id: string) {
    return apiClient.patch(`/api/admin/users/${id}/unban`, {});
  }
};
