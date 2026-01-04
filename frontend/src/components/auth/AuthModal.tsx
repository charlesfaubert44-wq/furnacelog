import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loginValidationSchema, registerValidationSchema, type LoginFormData, type RegisterFormData, calculatePasswordStrength } from '@/utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof calculatePasswordStrength> | null>(null);

  const { login, register: registerUser } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema)
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationSchema)
  });

  const password = registerForm.watch('password');

  React.useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const onLoginSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          community: data.community
        }
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/v1/auth/google`;
  };

  const handleFacebookLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/v1/auth/facebook`;
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-amber-500';
      case 'strong': return 'bg-emerald-500';
      default: return 'bg-stone-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform transition-all">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-300 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tabs */}
            <div className="border-b border-stone-800 px-6 pt-6">
              <div className="flex gap-1 bg-stone-800 rounded-lg p-1">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setError(null);
                  }}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    activeTab === 'login'
                      ? 'bg-amber-700 text-stone-50 shadow-lg'
                      : 'text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setError(null);
                  }}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    activeTab === 'register'
                      ? 'bg-amber-700 text-stone-50 shadow-lg'
                      : 'text-stone-400 hover:text-stone-300'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Error Alert */}
              {error && (
                <div className="mb-4 bg-gradient-to-br from-red-950/60 to-red-900/40 border-2 border-red-800/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-300 mb-1">
                        {activeTab === 'login' ? 'Login failed' : 'Registration failed'}
                      </h3>
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={handleFacebookLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-stone-900 text-stone-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-stone-300 mb-2">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      {...loginForm.register('email')}
                      className={`w-full px-4 py-3 bg-stone-800 border ${
                        loginForm.formState.errors.email ? 'border-red-800/50' : 'border-stone-700'
                      } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all`}
                      placeholder="you@example.com"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="mt-2 text-sm text-red-400">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-stone-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        {...loginForm.register('password')}
                        className={`w-full px-4 py-3 bg-stone-800 border ${
                          loginForm.formState.errors.password ? 'border-red-800/50' : 'border-stone-700'
                        } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all pr-12`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="mt-2 text-sm text-red-400">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        {...loginForm.register('rememberMe')}
                        className="h-4 w-4 bg-stone-800 border-stone-700 rounded text-amber-600 focus:ring-amber-600 focus:ring-offset-stone-900"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-300">
                        Remember me
                      </label>
                    </div>
                    <button type="button" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-50 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
                  >
                    {loginForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-stone-300 mb-2">
                      Email address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      {...registerForm.register('email')}
                      className={`w-full px-4 py-3 bg-stone-800 border ${
                        registerForm.formState.errors.email ? 'border-red-800/50' : 'border-stone-700'
                      } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all`}
                      placeholder="you@example.com"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-stone-300 mb-2">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...registerForm.register('password')}
                        className={`w-full px-4 py-3 bg-stone-800 border ${
                          registerForm.formState.errors.password ? 'border-red-800/50' : 'border-stone-700'
                        } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all pr-12`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.formState.errors.password.message}</p>
                    )}

                    {passwordStrength && (
                      <div className="mt-3 p-3 bg-stone-800 border border-stone-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-stone-400">Password strength:</span>
                          <span className={`text-xs font-semibold ${
                            passwordStrength.level === 'strong' ? 'text-emerald-400' :
                            passwordStrength.level === 'good' ? 'text-amber-400' :
                            passwordStrength.level === 'fair' ? 'text-orange-400' :
                            'text-red-400'
                          }`}>
                            {passwordStrength.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="w-full bg-stone-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength.level)}`}
                            style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium text-stone-300 mb-2">
                      Confirm password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...registerForm.register('confirmPassword')}
                        className={`w-full px-4 py-3 bg-stone-800 border ${
                          registerForm.formState.errors.confirmPassword ? 'border-red-800/50' : 'border-stone-700'
                        } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all pr-12`}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={registerForm.formState.isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-50 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
                  >
                    {registerForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
