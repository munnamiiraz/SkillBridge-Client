import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { userService } from "./lib/get-sessions";
import { UserRole } from "./constants/roles";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // Get session data for role-based access
  const { data } = await userService.getSession(request.headers.get("cookie"));
  
  const isAuthenticated = !!data?.session; 
  const role = data?.user?.role;

  const isPublicRoute = 
       pathName === "/" 
    || pathName.startsWith("/how-it-works")
    || pathName.startsWith("/about")
    || pathName.startsWith("/tutors")
    || pathName.startsWith("/verify-email")
    || pathName.startsWith("/complete-profile")
    || pathName.startsWith("/login") 
    || pathName.startsWith("/register");

  const isAdminRoute = pathName.startsWith("/admin");
  const isTutorRoute = pathName.startsWith("/tutor");
  const isStudentRoute = pathName.startsWith("/dashboard");

  // 1. Unauthenticated users trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    if (isAdminRoute || isTutorRoute || isStudentRoute) {
       return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Authenticated users Logic
  // Only check roles if we successfully fetched session data
  if (isAuthenticated && role) {
    // ADMIN
    if (role === UserRole.ADMIN) {
      if (isStudentRoute || isTutorRoute) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // TUTOR
    if (role === UserRole.TUTOR) {
      if (isAdminRoute || isStudentRoute) {
         // Note: Tutors have their own dashboard at /tutor/dashboard or /tutor
         return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // STUDENT
    if (role === UserRole.STUDENT) {
      if (isAdminRoute || isTutorRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  // Be specific to avoid running on static files/images
  matcher: [
    '/dashboard/:path*', 
    '/tutor/:path*', 
    '/admin/:path*',
    // We also want to protect "root" access if needed, but for now match paths
  ],
};
