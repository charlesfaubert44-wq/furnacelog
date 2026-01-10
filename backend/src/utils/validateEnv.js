/**
 * Environment Variable Validation
 * SECURITY: Validates required environment variables on startup
 * Prevents deployment with insecure defaults
 */

import logger from './logger.js';

/**
 * List of required environment variables
 */
const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CSRF_SECRET',
  'MONGODB_URI'
];

/**
 * Weak/insecure values that should never be used in production
 */
const INSECURE_VALUES = [
  'changeme',
  'password',
  'admin',
  'secret',
  'test',
  'development',
  'minioadmin',
  'your-',
  'CHANGE_THIS',
  'example.com',
  'localhost',
  '123456'
];

/**
 * Minimum secret length for cryptographic keys
 */
const MIN_SECRET_LENGTH = 32;

/**
 * Check if a value contains any insecure patterns
 */
function containsInsecureValue(value) {
  if (!value) return true;

  const lowerValue = value.toLowerCase();
  return INSECURE_VALUES.some(insecure => lowerValue.includes(insecure.toLowerCase()));
}

/**
 * Validate NODE_ENV is set correctly
 */
function validateNodeEnv() {
  const nodeEnv = process.env.NODE_ENV;

  if (!nodeEnv) {
    throw new Error(
      'SECURITY ERROR: NODE_ENV is not set. Must be explicitly set to "production", "development", or "test"'
    );
  }

  const validEnvs = ['production', 'development', 'test'];
  if (!validEnvs.includes(nodeEnv)) {
    throw new Error(
      `SECURITY ERROR: NODE_ENV="${nodeEnv}" is invalid. Must be one of: ${validEnvs.join(', ')}`
    );
  }

  logger.info(`✓ NODE_ENV validated: ${nodeEnv}`);
  return nodeEnv;
}

/**
 * Validate secrets are strong enough
 */
function validateSecrets(nodeEnv) {
  const secrets = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    CSRF_SECRET: process.env.CSRF_SECRET
  };

  for (const [name, value] of Object.entries(secrets)) {
    if (!value) {
      throw new Error(`SECURITY ERROR: ${name} is not set`);
    }

    // In production, secrets must be strong
    if (nodeEnv === 'production') {
      if (value.length < MIN_SECRET_LENGTH) {
        throw new Error(
          `SECURITY ERROR: ${name} is too short (${value.length} chars). ` +
          `Minimum ${MIN_SECRET_LENGTH} characters required in production`
        );
      }

      if (containsInsecureValue(value)) {
        throw new Error(
          `SECURITY ERROR: ${name} contains insecure value or pattern. ` +
          `Generate a strong random secret using: node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"`
        );
      }
    }

    logger.info(`✓ ${name} validated (length: ${value.length})`);
  }
}

/**
 * Validate database connection string
 */
function validateDatabaseUri(nodeEnv) {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('SECURITY ERROR: MONGODB_URI is not set');
  }

  // In production, shouldn't use default passwords
  if (nodeEnv === 'production') {
    if (containsInsecureValue(mongoUri)) {
      throw new Error(
        'SECURITY ERROR: MONGODB_URI contains insecure credentials (changeme, admin, etc). ' +
        'Use strong passwords generated with: openssl rand -base64 32'
      );
    }

    // Should use proper authentication in production
    if (!mongoUri.includes('authSource=')) {
      logger.warn('WARNING: MONGODB_URI does not specify authSource. Ensure authentication is configured.');
    }
  }

  logger.info('✓ MONGODB_URI validated');
}

/**
 * Validate all required environment variables
 */
function validateRequiredVars() {
  const missing = [];

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `SECURITY ERROR: Required environment variables are missing:\n` +
      missing.map(v => `  - ${v}`).join('\n') +
      `\n\nCopy .env.example to .env and set all required values.`
    );
  }

  logger.info(`✓ All ${REQUIRED_ENV_VARS.length} required environment variables are present`);
}

/**
 * Validate production-specific requirements
 */
function validateProductionConfig() {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === 'production') {
    // HTTPS should be enabled in production
    if (process.env.ENABLE_HTTPS !== 'true') {
      logger.warn('WARNING: ENABLE_HTTPS is not set to true in production. HTTPS should be enabled.');
    }

    // Cookies should be secure in production
    if (process.env.COOKIE_SECURE !== 'true') {
      logger.warn('WARNING: COOKIE_SECURE is not set to true in production. Cookies should be secure.');
    }

    // Should have proper CORS origins (not localhost)
    const corsOrigin = process.env.CORS_ORIGIN || '';
    if (corsOrigin.includes('localhost') || corsOrigin.includes('127.0.0.1')) {
      logger.warn('WARNING: CORS_ORIGIN includes localhost in production. Use production domain.');
    }

    logger.info('✓ Production configuration validated');
  }
}

/**
 * Main validation function
 * Call this at application startup
 */
export function validateEnvironment() {
  logger.info('========================================');
  logger.info('Validating Environment Configuration...');
  logger.info('========================================');

  try {
    // 1. Validate NODE_ENV
    const nodeEnv = validateNodeEnv();

    // 2. Validate all required variables are present
    validateRequiredVars();

    // 3. Validate secrets are strong
    validateSecrets(nodeEnv);

    // 4. Validate database connection
    validateDatabaseUri(nodeEnv);

    // 5. Validate production-specific config
    validateProductionConfig();

    logger.info('========================================');
    logger.info('✓ Environment validation PASSED');
    logger.info('========================================');

    return true;

  } catch (error) {
    logger.error('========================================');
    logger.error('✗ Environment validation FAILED');
    logger.error('========================================');
    logger.error(error.message);
    logger.error('');
    logger.error('Application startup aborted for security reasons.');
    logger.error('Fix the errors above and restart.');
    logger.error('========================================');

    // Exit process - DO NOT start application with insecure config
    process.exit(1);
  }
}

export default validateEnvironment;
