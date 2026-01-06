/**
 * API Service
 * Axios instance configured for FurnaceLog API
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Skip CSRF token for GET requests
    if (config.method !== 'get' && config.method !== 'head' && config.method !== 'options') {
      // Get CSRF token from localStorage or fetch it
      let csrfToken = localStorage.getItem('csrfToken');

      if (!csrfToken) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/v1/auth/csrf-token`, {
            withCredentials: true
          });
          csrfToken = response.data.csrfToken;
          if (csrfToken) {
            localStorage.setItem('csrfToken', csrfToken);
          }
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        }
      }

      if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('csrfToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // CSRF token invalid - clear and retry
      localStorage.removeItem('csrfToken');
    }

    return Promise.reject(error);
  }
);

export default api;
