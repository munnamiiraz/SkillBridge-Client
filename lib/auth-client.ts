import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
  fetchOptions: {
    credentials: 'include',
  },
  session: {
    fields: {
      user: {
        role: true,
        phone: true,
      },
    },
  },
});