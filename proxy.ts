
export const ROUTE_CONFIG = {
  admin: {
    base: '/admin',
    pattern: /^\/admin(\/.*)?$/,
    allowedRoles: ['ADMIN'],
  },
  student: {
    base: '/dashboards',
    pattern: /^\/dashboards(\/.*)?$/,
    allowedRoles: ['STUDENT'],
  },
  tutor: {
    base: ['/dashboard', '/availability', '/manage-profile', '/profile', '/reviews', '/sessions'],
    // Pattern to match any of the tutor base paths
    pattern: /^\/(dashboard|availability|manage-profile|profile|reviews|sessions)(\/.*)?$/,
    allowedRoles: ['TUTOR'],
  },
};

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about',
  '/tutors',
  '/how-it-works',
  '/pricing',
  '/complete-profile',
  '/verify-email',
];

export function isPublicRoute(pathname: string) {
  // Check exact matches or dynamic tutor profile
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/tutors/')) return true;
  if (pathname.startsWith('/verify-email')) return true;
  return false;
}

export function getRequiredRole(pathname: string) {
  if (ROUTE_CONFIG.admin.pattern.test(pathname)) return ROUTE_CONFIG.admin.allowedRoles;
  if (ROUTE_CONFIG.student.pattern.test(pathname)) return ROUTE_CONFIG.student.allowedRoles;
  if (ROUTE_CONFIG.tutor.pattern.test(pathname)) return ROUTE_CONFIG.tutor.allowedRoles;
  return null;
}
