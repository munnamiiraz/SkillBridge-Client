import { createAuthClient } from "better-auth/react";

const getAuthBaseURL = () => {
  // SSR: call the server directly
  if (typeof window === "undefined") {
    return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000") + "/api/auth";
  }
  // Browser: go through the Next.js proxy (/api/* → Render server)
  // This keeps the state cookie first-party (same domain) so OAuth works
  return window.location.origin + "/api/auth";
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      phone: {
        type: "string",
      },
      status: {
        type: "string",
      },
    },
  },
});