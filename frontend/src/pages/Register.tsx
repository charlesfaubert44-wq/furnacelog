import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { registerValidationSchema, type RegisterFormData, calculatePasswordStrength } from '../utils/validation';
import logger from '../utils/logger';

/**
 * Registration Page Component
 * Epic E2-T5: Authentication UI - Registration
 */

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof calculatePasswordStrength> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationSchema)
  });

  const password = watch('password');

  // Update password strength when password changes
  React.useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
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
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      logger.error('Registration failed', err, { action: 'register' });
    }
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak':
        return 'bg-[#d45d4e]';
      case 'fair':
        return 'bg-[#d4734e]';
      case 'good':
        return 'bg-[#f2a541]';
      case 'strong':
        return 'bg-[#6a994e]';
      default:
        return 'bg-[#3d3127]';
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1412] relative overflow-hidden">
      {/* Warm Background Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#f7931e]/12 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c87941]/8 rounded-full blur-3xl" />
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
              to="/login"
              className="px-5 py-2.5 bg-[#3d3127]/60 hover:bg-[#3d3127] border border-[#d4a373]/30 text-[#f4e8d8] text-sm font-semibold rounded-xl transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-2xl shadow-[0_8px_24px_rgba(255,107,53,0.4)] mb-6">
              <Flame className="w-8 h-8 text-[#f4e8d8]" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-bold text-[#f4e8d8] mb-3">
              Start Protecting Your Home
            </h2>
            <p className="text-[#d4a373] text-lg">
              Create your account to track and maintain your northern sanctuary
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
                      <h3 className="text-sm font-semibold text-[#d45d4e] mb-1">Registration failed</h3>
                      <p className="text-xs text-[#d45d4e]/90">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                  Email address <span className="text-[#d45d4e]">*</span>
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
                  Password <span className="text-[#d45d4e]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className={`w-full px-4 py-3 bg-[#3d3127]/60 border-b-2 ${
                      errors.password ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                    } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff6b35] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300 pr-12`}
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {passwordStrength && (
                  <div className="mt-3 p-4 bg-[#3d3127]/40 border border-[#d4a373]/20 rounded-xl animate-slide-down">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#d4a373]">Password strength:</span>
                      <span className={`text-xs font-semibold transition-colors duration-300 ${
                        passwordStrength.level === 'strong' ? 'text-[#6a994e]' :
                        passwordStrength.level === 'good' ? 'text-[#f2a541]' :
                        passwordStrength.level === 'fair' ? 'text-[#d4734e]' :
                        'text-[#d45d4e]'
                      }`}>
                        {passwordStrength.level.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-[#2d1f1a] rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${getStrengthColor(passwordStrength.level)}`}
                        style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-[#d4a373]/80">
                        {passwordStrength.feedback.map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                  Confirm password <span className="text-[#d45d4e]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={`w-full px-4 py-3 bg-[#3d3127]/60 border-b-2 ${
                      errors.confirmPassword ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                    } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff6b35] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300 pr-12`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#d4a373] hover:text-[#f4e8d8] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-[#d45d4e]">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Optional Profile Fields */}
              <div className="pt-6 border-t border-[#f4e8d8]/10">
                <p className="text-sm font-medium text-[#d4a373] mb-4">Optional profile information</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-[#d4a373]/80 mb-2">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className={`w-full px-4 py-3 bg-[#3d3127]/40 border ${
                        errors.firstName ? 'border-[#d45d4e]' : 'border-[#d4a373]/20'
                      } text-[#f4e8d8] placeholder-[#d4a373]/40 rounded-xl focus:outline-none focus:border-[#ff6b35]/50 focus:shadow-[0_2px_8px_rgba(255,107,53,0.1)] transition-all duration-300`}
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-[#d45d4e]">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm text-[#d4a373]/80 mb-2">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className={`w-full px-4 py-3 bg-[#3d3127]/40 border ${
                        errors.lastName ? 'border-[#d45d4e]' : 'border-[#d4a373]/20'
                      } text-[#f4e8d8] placeholder-[#d4a373]/40 rounded-xl focus:outline-none focus:border-[#ff6b35]/50 focus:shadow-[0_2px_8px_rgba(255,107,53,0.1)] transition-all duration-300`}
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-[#d45d4e]">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="community" className="block text-sm text-[#d4a373]/80 mb-2">
                    Community
                  </label>
                  <input
                    id="community"
                    type="text"
                    {...register('community')}
                    placeholder="e.g., Yellowknife, Iqaluit, Whitehorse"
                    className={`w-full px-4 py-3 bg-[#3d3127]/40 border ${
                      errors.community ? 'border-[#d45d4e]' : 'border-[#d4a373]/20'
                    } text-[#f4e8d8] placeholder-[#d4a373]/40 rounded-xl focus:outline-none focus:border-[#ff6b35]/50 focus:shadow-[0_2px_8px_rgba(255,107,53,0.1)] transition-all duration-300`}
                  />
                  {errors.community && (
                    <p className="mt-2 text-sm text-[#d45d4e]">{errors.community.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-[#d4a373]/80 mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="e.g., +1-867-555-0100"
                    className={`w-full px-4 py-3 bg-[#3d3127]/40 border ${
                      errors.phone ? 'border-[#d45d4e]' : 'border-[#d4a373]/20'
                    } text-[#f4e8d8] placeholder-[#d4a373]/40 rounded-xl focus:outline-none focus:border-[#ff6b35]/50 focus:shadow-[0_2px_8px_rgba(255,107,53,0.1)] transition-all duration-300`}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-[#d45d4e]">{errors.phone.message}</p>
                  )}
                </div>
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create account'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-[#f4e8d8]/10">
                <span className="text-sm text-[#d4a373]">Already have an account? </span>
                <Link to="/login" className="text-sm font-semibold text-[#f7931e] hover:text-[#ff6b35] transition-colors duration-200">
                  Sign in
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

export default Register;
