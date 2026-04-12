import { authClient } from "@/lib/auth-client";

declare module "@/lib/auth-client" {
    interface User {
        role: 'STUDENT' | 'TUTOR' | 'VERIFIED_TUTOR' | 'ADMIN' | 'SUPER_ADMIN';
        phone?: string | null;
        status?: string;
    }
}
