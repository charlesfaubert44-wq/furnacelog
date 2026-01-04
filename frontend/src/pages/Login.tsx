import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginValidationSchema, type LoginFormData } from '../utils/validation';

/**
 * Login Page Component
 * Epic E2-T6: Authentication UI - Login
 */

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Navigation */}
      <nav className="border-b border-amber-900/20 bg-stone-950">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-amber-100" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-50 tracking-tight">
                  FurnaceLog
                </h1>
                <p className="text-xs text-stone-400 font-medium">Northern Home Tracker</p>
              </div>
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-stone-50 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30"
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-stone-50 mb-3">
              Sign in to FurnaceLog
            </h2>
            <p className="text-stone-400">
              Welcome back! Manage your northern home maintenance.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Error Alert */}
              {error && (
                <div className="bg-gradient-to-br from-red-950/60 to-red-900/40 border-2 border-red-800/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-300 mb-1">Login failed</h3>
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 bg-stone-800 border ${
                    errors.email ? 'border-red-800/50' : 'border-stone-700'
                  } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className={`w-full px-4 py-3 bg-stone-800 border ${
                      errors.password ? 'border-red-800/50' : 'border-stone-700'
                    } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all pr-12`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="h-4 w-4 bg-stone-800 border-stone-700 rounded text-amber-600 focus:ring-amber-600 focus:ring-offset-stone-900"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-stone-300">
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700 disabled:cursor-not-allowed text-stone-50 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-stone-800">
                <span className="text-sm text-stone-400">Don't have an account? </span>
                <Link to="/register" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  Create one now
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-stone-500">
              Built for Canada's North
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
