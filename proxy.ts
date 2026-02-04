import { NextRequest, NextResponse } from "next/server";
import { userService } from "./lib/get-sessions";
import { UserRole } from "./constants/roles";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const { data } = await userService.getSession();
  

  const isAuthenticated = !!data;
  const role = data?.user?.role;

  const isPublicRoute = pathName.startsWith("/how-it-works")
    || pathName.startsWith("/about")
    || pathName.startsWith("/tutors")
    || pathName.startsWith("/verify-email")
    || pathName.startsWith("/complete-profile")
    || pathName === "/";

  const isAdminRoute = pathName.startsWith("/admin");
  const isStudentRoute = pathName.startsWith("/dashboard");
  const isTutorRoute = pathName.startsWith("/tutor");

  // Not logged in → only public routes allowed
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ADMIN logic
  if (role === UserRole.ADMIN) {
    if (isStudentRoute || isTutorRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // STUDENT logic
  if (role === UserRole.STUDENT) {
    if (isAdminRoute || isTutorRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // TUTOR logic
  if (role === UserRole.TUTOR) {
    if (isAdminRoute || isStudentRoute) {
      return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/tutor/:path*', '/admin/:path*'],
};
