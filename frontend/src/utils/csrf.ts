/**
 * CSRF Token Management
 * SECURITY FIX: Handles CSRF token fetching and storage
 */

let csrfToken: string | null = null;

/**
 * Fetch CSRF token from backend
 * Call this on app initialization or when token is missing
 */
export const fetchCsrfToken = async (): Promise<string> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/v1/auth/csrf-token`, {
      credentials: 'include' // Send cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};

/**
 * Get current CSRF token from memory
 * Returns null if token hasn't been fetched yet
 */
export const getCsrfToken = (): string | null => csrfToken;

/**
 * Clear CSRF token from memory
 * Call this on logout
 */
export const clearCsrfToken = (): void => {
  csrfToken = null;
};
