import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AuthResponse
} from '../types/auth.types';
import logger from '../utils/logger';
import { getCsrfToken, fetchCsrfToken } from '../utils/csrf';

/**
 * Authentication API Service
 * Epic E2: Authentication & User Management
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with timeout
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  timeoutErrorMessage: 'Request timed out. Please check your connection and try again.'
});

// Configure retry logic with exponential backoff
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors and 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.code === 'ECONNABORTED' ||
           (error.response?.status !== undefined && error.response.status >= 500 && error.response.status < 600);
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(`Retrying request (attempt ${retryCount})`, {
      url: requestConfig.url,
      method: requestConfig.method,
      error: error.message
    });
  }
});

// SECURITY FIX: Add CSRF token to non-GET requests
api.interceptors.request.use(
  async (config) => {
    // Add CSRF token for state-changing requests
    if (config.method && config.method.toUpperCase() !== 'GET') {
      let token = getCsrfToken();

      // Fetch token if not available
      if (!token) {
        try {
          token = await fetchCsrfToken();
        } catch (error) {
          logger.warn('Failed to fetch CSRF token', error as Record<string, any>);
        }
      }

      if (token) {
        config.headers['x-csrf-token'] = token;
      }
    }

    // Cookies (including auth tokens) are sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// SECURITY FIX: Response interceptor updated for cookie-based auth
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        logger.info('Access token expired, attempting refresh');

        // SECURITY FIX: Call refresh endpoint - refresh token is in httpOnly cookie
        const response = await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          {}, // Empty body - refresh token is in cookie
          { withCredentials: true, timeout: 10000 }
        );

        if (response.data.success) {
          logger.info('Token refresh successful');

          // New access token is now in httpOnly cookie
          // Retry original request - cookie will be sent automatically
          return api(originalRequest);
        }
      } catch (refreshError: any) {
        logger.warn('Token refresh failed', {
          error: refreshError.message,
          status: refreshError.response?.status
        });

        // Store logout reason for user feedback
        sessionStorage.setItem('logout_reason', 'session_expired');

        // Redirect to login with clear message
        const currentPath = window.location.pathname;
        const redirectUrl = currentPath !== '/login' ? `?redirect=${encodeURIComponent(currentPath)}` : '';

        window.location.href = `/login${redirectUrl}&session_expired=true`;

        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      logger.error('Request timeout', error, { url: originalRequest?.url });
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

/**
 * Auth Service
 */
export const authService = {
  /**
   * Register new user
   * E2-T5: Authentication UI - Registration
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * E2-T6: Authentication UI - Login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   * E2-T4: User Profile Management
   */
  async updateProfile(data: UpdateProfileRequest): Promise<AuthResponse> {
    const response = await api.patch<AuthResponse>('/users/me', data);
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/me/change-password', data);
    return response.data;
  },

  /**
   * Refresh access token
   * SECURITY FIX: Refresh token is in httpOnly cookie, no need to pass it
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', {});
    return response.data;
  }
};

export default authService;
