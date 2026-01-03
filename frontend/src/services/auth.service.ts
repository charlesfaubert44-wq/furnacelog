import axios, { AxiosInstance } from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AuthResponse
} from '../types/auth.types';

/**
 * Authentication API Service
 * Epic E2: Authentication & User Management
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('furnacelog_tokens');
    if (tokens) {
      try {
        const { accessToken } = JSON.parse(tokens);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing tokens:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('furnacelog_tokens');
        if (tokens) {
          const { refreshToken } = JSON.parse(tokens);

          // Try to refresh token
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refreshToken
          });

          if (response.data.success) {
            const newTokens = response.data.data.tokens;
            localStorage.setItem('furnacelog_tokens', JSON.stringify(newTokens));

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('furnacelog_tokens');
        localStorage.removeItem('furnacelog_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

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
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken
    });
    return response.data;
  }
};

export default authService;
