import { cookies } from "next/headers";

const AUTH_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  getSession: async function (cookieHeader?: string | null) {
    try {
      const cookieStore = await cookies();

      console.log(cookieStore.toString());
      const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

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
