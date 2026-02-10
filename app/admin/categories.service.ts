import { apiClient } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  tutorCount: number;
  courseCount: number;
  subjects?: { id: string; name: string }[];
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
      courseCount: c._count?.subject || 0,
      subjects: c.subject?.map((s: any) => ({ id: s.id, name: s.name })) || [],
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
  },

  // Subject Methods
  async createSubject(data: { name: string; categoryId: string }) {
    return apiClient.post('/api/admin/subjects', data);
  },

  async updateSubject(id: string, data: { name?: string; categoryId?: string }) {
    return apiClient.patch(`/api/admin/subjects/${id}`, data);
  },

  async deleteSubject(id: string) {
    return apiClient.delete(`/api/admin/subjects/${id}`);
  },

  async getAllSubjects(categoryId?: string) {
    const endpoint = categoryId ? `/api/admin/subjects?categoryId=${categoryId}` : '/api/admin/subjects';
    return apiClient.fetch(endpoint);
  }
};
