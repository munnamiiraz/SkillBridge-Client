'use client';

export interface KBEntry {
  id: string;
  content: string;
  metadata?: any;
  createdAt: string;
}

export const kbService = {
  getAll: async (): Promise<KBEntry[]> => {
    try {
      const response = await fetch('/api/admin/kb', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.message);
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error);
      return [];
    }
  },

  add: async (content: string, metadata: any = {}): Promise<KBEntry | null> => {
    try {
      const response = await fetch('/api/admin/kb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content, metadata })
      });
      const result = await response.json();
      if (result.success) return result.data;
      throw new Error(result.message);
    } catch (error) {
      console.error('Failed to add knowledge:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/kb/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
       console.error('Failed to delete knowledge:', error);
       return false;
    }
  }
};
