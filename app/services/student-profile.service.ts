import { apiClient } from '@/lib/api-client';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

export const StudentProfileService = {
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get('/api/student/profile');
    const userData = response.data;
    
    return {
      id: userData.id,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      image: userData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'User'}`,
    };
  },

  async updateProfile(data: Partial<StudentProfile>): Promise<void> {
    await apiClient.patch('/api/student/profile', {
      name: data.name,
      phone: data.phone,
      address: data.address
    });
  },

  async deleteAccount(): Promise<void> {
    // Implementing placeholder for delete logic consistent with existing UI
    // In a real app, this would hit an endpoint like DELETE /api/student/profile
    // throw new Error('Delete functionality not yet implemented on backend');
  }
};
