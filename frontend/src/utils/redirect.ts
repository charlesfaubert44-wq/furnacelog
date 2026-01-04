/**
 * Secure redirect utilities to prevent open redirect vulnerabilities
 */

import logger from './logger';

// Whitelist of allowed redirect paths
const ALLOWED_REDIRECT_PATHS = [
  '/',
  '/dashboard',
  '/login',
  '/register',
  '/profile',
  '/settings',
  '/maintenance',
  '/systems',
  '/checklist'
];

/**
 * Validate and sanitize redirect URL
 * Only allows same-origin redirects to whitelisted paths
 */
export const validateRedirectUrl = (url: string): string => {
  try {
    // If empty, default to home
    if (!url || url.trim() === '') {
      return '/';
    }

    // Parse the URL
    const parsed = new URL(url, window.location.origin);

    // SECURITY: Only allow same-origin redirects
    if (parsed.origin !== window.location.origin) {
      logger.warn('Blocked cross-origin redirect attempt', {
        attempted: url,
        origin: parsed.origin
      });
      return '/';
    }

    // SECURITY: Check against whitelist
    const isAllowed = ALLOWED_REDIRECT_PATHS.some(allowedPath => {
      return parsed.pathname === allowedPath || parsed.pathname.startsWith(allowedPath + '/');
    });

    if (!isAllowed) {
      logger.warn('Blocked redirect to non-whitelisted path', {
        attempted: parsed.pathname
      });
      return '/';
    }

    // Return safe pathname + search params (no hash for security)
    return parsed.pathname + parsed.search;

  } catch (error) {
    // If URL parsing fails, default to home
    logger.warn('Invalid redirect URL format', { attempted: url });
    return '/';
  }
};

/**
 * Get redirect URL from query parameter with validation
 */
export const getRedirectFromQuery = (searchParams: URLSearchParams, paramName: string = 'redirect'): string => {
  const redirect = searchParams.get(paramName);
  return redirect ? validateRedirectUrl(redirect) : '/';
};

/**
 * Create safe redirect URL with error parameter
 */
export const createErrorRedirect = (path: string, errorMessage: string): string => {
  const safePath = validateRedirectUrl(path);
  const params = new URLSearchParams({ error: errorMessage });
  return `${safePath}?${params.toString()}`;
};
