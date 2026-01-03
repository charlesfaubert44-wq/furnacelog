import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = localStorage.getItem('furnacelog_tokens');
        const storedUser = localStorage.getItem('furnacelog_user');

        if (storedTokens && storedUser) {
          setTokens(JSON.parse(storedTokens));
          setUser(JSON.parse(storedUser));

          // Verify token is still valid by fetching current user
          try {
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data.user);
              localStorage.setItem('furnacelog_user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // Token is invalid, clear state
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
    localStorage.removeItem('furnacelog_tokens');
    localStorage.removeItem('furnacelog_user');
  };

  /**
   * Register new user
   * E2-T5: Authentication UI - Registration
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        const { user: newUser, tokens: newTokens } = response.data;

        setUser(newUser);
        setTokens(newTokens);

        localStorage.setItem('furnacelog_tokens', JSON.stringify(newTokens));
        localStorage.setItem('furnacelog_user', JSON.stringify(newUser));

        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
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
        const { user: loggedInUser, tokens: newTokens } = response.data;

        setUser(loggedInUser);
        setTokens(newTokens);

        localStorage.setItem('furnacelog_tokens', JSON.stringify(newTokens));
        localStorage.setItem('furnacelog_user', JSON.stringify(loggedInUser));

        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
      console.error('Logout error:', error);
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
        localStorage.setItem('furnacelog_user', JSON.stringify(response.data.user));
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
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
      console.error('Password change error:', error);
      throw error.response?.data || error;
    }
  };

  /**
   * Refresh access token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(tokens.refreshToken);

      if (response.success && response.data) {
        setTokens(response.data.tokens);
        localStorage.setItem('furnacelog_tokens', JSON.stringify(response.data.tokens));
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout();
      navigate('/login');
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
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
