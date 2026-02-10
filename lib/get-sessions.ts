import { cookies } from "next/headers";

const AUTH_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  getSession: async function (cookieHeader?: string | null) {
    try {
      const headers: Record<string, string> = {};
      
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader;
      } else {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          headers['Cookie'] = cookieStore.toString();
        } catch (e) {

        }
      }

      const isServer = typeof window === 'undefined';
      const baseUrl = isServer && process.env.INTERNAL_API_URL 
        ? process.env.INTERNAL_API_URL 
        : AUTH_URL;

      const res = await fetch(`${baseUrl}/api/auth/get-session`, {
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        return { data: null, error: { message: "Failed to fetch session" } };
      }

      const session = await res.json();

      if (session === null) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error("Session fetch error:", err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
