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
    <div className="min-h-screen bg-[#1a1412] relative overflow-hidden">
      {/* Warm Background Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f7931e]/12 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c87941]/8 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-[#d4a373]/10 bg-[#1a1412]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                <Flame className="w-6 h-6 text-[#f4e8d8]" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#f4e8d8] tracking-tight">
                  FurnaceLog
                </h1>
                <p className="text-xs text-[#d4a373] font-medium">Northern Home Tracker</p>
              </div>
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:shadow-[0_6px_24px_rgba(255,107,53,0.45)] text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.3)]"
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-2xl shadow-[0_8px_24px_rgba(255,107,53,0.4)] mb-6">
              <Flame className="w-8 h-8 text-[#f4e8d8]" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-bold text-[#f4e8d8] mb-3">
              Welcome Home
            </h2>
            <p className="text-[#d4a373] text-lg">
              Step back into your warm sanctuary
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-[#2d1f1a] to-[#1a1412] border border-[#f4e8d8]/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-scale-in animate-delay-100">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Error Alert */}
              {error && (
                <div className="bg-gradient-to-br from-[#d45d4e]/20 to-[#d45d4e]/10 border-2 border-[#d45d4e]/40 rounded-xl p-4 animate-slide-down">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#d45d4e] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-[#d45d4e] mb-1">Login failed</h3>
                      <p className="text-xs text-[#d45d4e]/90">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 bg-[#3d3127]/60 border-b-2 ${
                    errors.email ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                  } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff6b35] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-[#d45d4e]">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className={`w-full px-4 py-3 bg-[#3d3127]/60 border-b-2 ${
                      errors.password ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                    } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff6b35] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300 pr-12`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#d4a373] hover:text-[#f4e8d8] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-[#d45d4e]">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="h-4 w-4 bg-[#3d3127] border-[#d4a373]/30 rounded text-[#ff6b35] focus:ring-[#ff6b35] focus:ring-offset-[#2d1f1a]"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#d4a373]">
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#d4a373] hover:text-[#f7931e] transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-[#f4e8d8] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)] text-lg"
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
              <div className="text-center pt-4 border-t border-[#f4e8d8]/10">
                <span className="text-sm text-[#d4a373]">Don't have an account? </span>
                <Link to="/register" className="text-sm font-semibold text-[#f7931e] hover:text-[#ff6b35] transition-colors duration-200">
                  Create one now
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-[#d4a373]/70">
              Built for Canada's North
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
