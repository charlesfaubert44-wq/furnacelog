/**
 * Authentication Types
 * Epic E2: Authentication & User Management
 */

export interface User {
  _id: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    community?: string;
    timezone?: string;
    preferredUnits?: 'metric' | 'imperial';
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      digestFrequency: 'daily' | 'weekly' | 'none';
    };
    defaultHome?: string;
  };
  role: 'user' | 'admin' | 'super-admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    community?: string;
    timezone?: string;
    preferredUnits?: 'metric' | 'imperial';
  };
}

export interface UpdateProfileRequest {
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    community?: string;
    timezone?: string;
    preferredUnits?: 'metric' | 'imperial';
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      digestFrequency?: 'daily' | 'weekly' | 'none';
    };
    defaultHome?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    tokens: AuthTokens;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  refreshToken: () => Promise<void>;
}
