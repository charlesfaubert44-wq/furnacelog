import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Flame, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { registerValidationSchema, type RegisterFormData, calculatePasswordStrength } from '../utils/validation';

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
      console.error('Registration error:', err);
    }
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-orange-500';
      case 'good':
        return 'bg-amber-500';
      case 'strong':
        return 'bg-emerald-500';
      default:
        return 'bg-stone-600';
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
              to="/login"
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-100 text-sm font-semibold rounded-lg transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-stone-50 mb-3">
              Create your FurnaceLog account
            </h2>
            <p className="text-stone-400">
              Track and maintain your northern home with confidence
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
                      <h3 className="text-sm font-semibold text-red-300 mb-1">Registration failed</h3>
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                  Email address <span className="text-red-400">*</span>
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
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className={`w-full px-4 py-3 bg-stone-800 border ${
                      errors.password ? 'border-red-800/50' : 'border-stone-700'
                    } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all pr-12`}
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
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
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-stone-400">
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-2">
                  Confirm password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={`w-full px-4 py-3 bg-stone-800 border ${
                      errors.confirmPassword ? 'border-red-800/50' : 'border-stone-700'
                    } text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all pr-12`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Optional Profile Fields */}
              <div className="pt-6 border-t border-stone-800">
                <p className="text-sm font-medium text-stone-300 mb-4">Optional profile information</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-stone-400 mb-2">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm text-stone-400 mb-2">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="community" className="block text-sm text-stone-400 mb-2">
                    Community
                  </label>
                  <input
                    id="community"
                    type="text"
                    {...register('community')}
                    placeholder="e.g., Yellowknife, Iqaluit, Whitehorse"
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-stone-400 mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all"
                  />
                </div>
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create account'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-stone-800">
                <span className="text-sm text-stone-400">Already have an account? </span>
                <Link to="/login" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  Sign in
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

export default Register;
