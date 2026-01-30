const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.fetch(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  patch(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
