import { apiClient } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  tutorCount: number;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}

export const CategoryService = {
  async getAll(cookies?: string) {
    const result = await apiClient.fetch('/api/admin/categories', {
      headers: {
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
    });

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch categories');
    }

    const mappedCategories: Category[] = result.data.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      status: c.status?.toLowerCase() || 'active',
      tutorCount: c._count?.tutor_profiles || 0,
      courseCount: 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return mappedCategories;
  },

  async create(data: { name: string; description: string; status: string }) {
    return apiClient.post('/api/admin/categories', data);
  },

  async update(id: string, data: { name?: string; description?: string; status?: string }) {
    return apiClient.patch(`/api/admin/categories/${id}`, data);
  },

  async delete(id: string) {
    return apiClient.delete(`/api/admin/categories/${id}`);
  }
};
