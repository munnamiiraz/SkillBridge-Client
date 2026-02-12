import { createAuthClient } from "better-auth/react";

const getAuthBaseURL = () => {
  if (typeof window === "undefined") {
    return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000") + "/api/auth";
  }
  return window.location.origin + "/api/auth";
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    credentials: 'include',
  },
});