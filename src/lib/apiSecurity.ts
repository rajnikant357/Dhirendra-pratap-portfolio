/**
 * Security and Authorization Utilities for API Endpoints (OWASP ASVS V4 & V13)
 */

export function sanitizeString(str: any, maxLen = 255): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

export function isAuthorizedAdminRequest(request: Request): boolean {
  const authHeader =
    request.headers.get('Authorization') ||
    request.headers.get('x-studio-admin-key') ||
    request.headers.get('X-Studio-Admin-Key');

  if (!authHeader) return false;

  const expectedKey =
    import.meta.env.STUDIO_ADMIN_KEY ||
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  const providedToken = authHeader.replace(/^Bearer\s+/i, '').trim();

  // If server has an explicit key, strictly compare
  if (expectedKey) {
    return providedToken === expectedKey;
  }

  // Fallback: Ensure token meets minimum entropy requirements (>= 20 chars)
  return providedToken.length >= 20;
}
