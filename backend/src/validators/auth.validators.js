import { z } from 'zod';

/**
 * Zod validation schemas for authentication
 * Epic E2-T1: Add input validation with Zod
 */

/**
 * Password validation rules
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
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
  .email('Please provide a valid email address')
  .toLowerCase()
  .trim();

/**
 * Registration validation schema
 * E2-T1: User Registration API
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  profile: z.object({
    firstName: z.string().min(1, 'First name is required').trim().optional(),
    lastName: z.string().min(1, 'Last name is required').trim().optional(),
    phone: z.string().trim().optional(),
    community: z.string().trim().optional(),
    timezone: z.string().optional(),
    preferredUnits: z.enum(['metric', 'imperial']).default('metric').optional()
  }).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Login validation schema
 * E2-T2: User Login API
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

/**
 * Update profile validation schema
 * E2-T4: User Profile Management API
 */
export const updateProfileSchema = z.object({
  profile: z.object({
    firstName: z.string().min(1).trim().optional(),
    lastName: z.string().min(1).trim().optional(),
    phone: z.string().trim().optional(),
    community: z.string().trim().optional(),
    timezone: z.string().optional(),
    preferredUnits: z.enum(['metric', 'imperial']).optional()
  }).optional(),
  preferences: z.object({
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      digestFrequency: z.enum(['daily', 'weekly', 'none']).optional()
    }).optional(),
    defaultHome: z.string().optional() // ObjectId as string
  }).optional()
});

/**
 * Change password validation schema
 * E2-T4: Implement password change functionality
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword']
});

/**
 * Forgot password validation schema
 * E2-T7: Password Reset Flow
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

/**
 * Reset password validation schema
 * E2-T7: Password Reset Flow
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Validation middleware factory
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
      next(error);
    }
  };
};
