import { z } from 'zod';

/**
 * Frontend Validation Schemas
 * Epic E2: Authentication & User Management
 * Mirrors backend validation for client-side validation
 */

/**
 * Password validation rules
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Email validation
 */
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

/**
 * Registration form validation schema
 * E2-T5: Authentication UI - Registration
 */
export const registerValidationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    community: z.string().optional(),
    phone: z.string().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type RegisterFormData = z.infer<typeof registerValidationSchema>;

/**
 * Login form validation schema
 * E2-T6: Authentication UI - Login
 */
export const loginValidationSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginValidationSchema>;

/**
 * Update profile validation schema
 */
export const updateProfileValidationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  community: z.string().optional(),
  timezone: z.string().optional(),
  preferredUnits: z.enum(['metric', 'imperial']).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  digestFrequency: z.enum(['daily', 'weekly', 'none']).optional()
});

export type UpdateProfileFormData = z.infer<typeof updateProfileValidationSchema>;

/**
 * Change password validation schema
 */
export const changePasswordValidationSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password')
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword']
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordValidationSchema>;

/**
 * Password strength calculator
 * Returns strength level: weak, fair, good, strong
 */
export const calculatePasswordStrength = (password: string): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Feedback
  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters');

  // Determine level
  let level: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'fair';
  else if (score <= 6) level = 'good';
  else level = 'strong';

  return { score, level, feedback };
};
