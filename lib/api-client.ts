const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
  }
  return "";
};

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const baseUrl = getBaseUrl();
    const url = baseUrl ? `${baseUrl}${normalizedEndpoint}` : normalizedEndpoint;

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      let errorDetails = null;
      
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || response.statusText;
        errorDetails = error.details || null;
      } catch (_) {}

      const err = new Error(errorMessage || "Request failed") as any;
      if (errorDetails) {
        err.details = errorDetails;
      }
      throw err;
    }

    return response.json();
  },

  get(endpoint: string, options: RequestInit = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint: string, data: any, options: RequestInit = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  patch(endpoint: string, data: any, options: RequestInit = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any, options: RequestInit = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string, options: RequestInit = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};
