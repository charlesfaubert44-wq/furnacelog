import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import logger from '../utils/logger';
import type {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AuthContextType
} from '../types/auth.types';

/**
 * Authentication Context
 * Epic E2: Authentication & User Management
 * State management for authentication
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // SECURITY FIX: Initialize auth state from backend (cookies) instead of localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated via httpOnly cookie
        // No need to check localStorage - tokens are in httpOnly cookies
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data.user);
            // No localStorage for tokens anymore - they're in httpOnly cookies
          }
        } catch (error) {
          // Not authenticated or token expired
          handleLogout();
        }
      } catch (error) {
        logger.error('Authentication initialization failed', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    setUser(null);
    setTokens(null);
    // SECURITY FIX: No need to remove tokens from localStorage - they're in httpOnly cookies
    // Cookies are cleared by backend on logout
  };

  /**
   * Register new user
   * E2-T5: Authentication UI - Registration
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        // SECURITY FIX: Tokens are now in httpOnly cookies, not in response body
        const { user: newUser } = response.data;

        setUser(newUser);
        // No need to set tokens - they're in httpOnly cookies

        // No localStorage - tokens are in httpOnly cookies

        navigate('/');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      logger.error('Registration failed', error, { action: 'register' });
      throw error.response?.data || error;
    }
  };

  /**
   * Login user
   * E2-T6: Authentication UI - Login
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // SECURITY FIX: Tokens are now in httpOnly cookies, not in response body
        const { user: loggedInUser } = response.data;

        setUser(loggedInUser);
        // No need to set tokens - they're in httpOnly cookies

        // No localStorage - tokens are in httpOnly cookies

        navigate('/');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      logger.error('Login failed', error, { action: 'login' });
      throw error.response?.data || error;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      logger.error('Logout failed', error);
    } finally {
      handleLogout();
      navigate('/login');
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    try {
      const response = await authService.updateProfile(data);

      if (response.success && response.data) {
        setUser(response.data.user);
        // No localStorage - user state is managed in memory
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error: any) {
      logger.error('Profile update failed', error);
      throw error.response?.data || error;
    }
  };

  /**
   * Change password
   */
  const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    try {
      const response = await authService.changePassword(data);

      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error: any) {
      logger.error('Password change failed', error);
      throw error.response?.data || error;
    }
  };

  /**
   * Refresh access token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      // SECURITY FIX: Refresh token is in httpOnly cookie, backend handles it
      const response = await authService.refreshToken();

      if (response.success) {
        // New tokens are now in httpOnly cookies
        // No need to update state - tokens are managed by cookies
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      logger.error('Token refresh failed', error);
      handleLogout();
      navigate('/login');
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user, // SECURITY FIX: Auth based on user presence, not tokens
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    refreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
