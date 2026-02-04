import 'server-only'; // ⬅️ IMPORTANT

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:9000",

  secret: process.env.BETTER_AUTH_SECRET!,

  database: {
    provider: "external",
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
