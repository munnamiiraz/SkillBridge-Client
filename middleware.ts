import { NextResponse, type NextRequest } from 'next/server';
import { isPublicRoute, getRequiredRole } from './proxy';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Build the request to our backend to check session
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:9000';
  
  try {
    const sessionResponse = await fetch(`${authUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    const session = await sessionResponse.json();

    // 3. If no session and route is not public, redirect to login
    if (!session || !session.user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // 4. CHECK FOR INCOMPLETE PROFILE (Missing Role or Phone)
    // If the user's phone is still the default 'N/A', we force them to complete it.
    const isIncomplete = !session.user.role || !session.user.phone || session.user.phone === 'N/A';
    
    if (isIncomplete && pathname !== '/complete-profile' && pathname !== '/logout') {
      return NextResponse.redirect(new URL('/complete-profile', request.url));
    }

    // 5. Check for role-based access
    const requiredRoles = getRequiredRole(pathname);
    if (requiredRoles && !requiredRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
