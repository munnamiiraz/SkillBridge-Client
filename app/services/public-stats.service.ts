"use client";
import axios from 'axios';

export interface PlatformStats {
  totalTutors: number;
  totalStudents: number;
  totalSessions: number;
  growth: { month: string; count: number }[];
}

export const getPlatformStats = async (): Promise<PlatformStats | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await axios.get(`${baseUrl}/api/public/platform-stats`);
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return null;
  }
};
