import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:9000",
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                },
                phone: {
                    type: "string",
                }
            }
        })
    ]
})