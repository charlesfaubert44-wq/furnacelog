#!/usr/bin/env node

/**
 * Endpoint Authorization Audit Tool
 * SECURITY: Scans all API routes to verify authentication and authorization middleware
 *
 * Usage:
 *   node backend/scripts/audit-endpoints.js
 *   npm run audit:endpoints
 *
 * Checks:
 * - All routes have authentication middleware
 * - Admin routes have role-based access control
 * - Sensitive operations have proper authorization
 * - No public routes that should be protected
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes directory
const ROUTES_DIR = path.join(__dirname, '../src/routes');

// Expected middleware patterns
const MIDDLEWARE_PATTERNS = {
  authenticate: /authenticate|isAuthenticated|requireAuth/,
  authorize: /authorize|requireRole|requirePermission|checkRole/,
  rateLimit: /rateLimit|limiter/,
  validate: /validate\(/,
  sanitize: /allowOnly|sanitize/
};

// Routes that should be public (allowlist)
const PUBLIC_ROUTES_ALLOWLIST = [
  '/api/v1/auth/register',
  '/api/v1/auth/login',
  '/api/v1/auth/refresh',
  '/api/v1/auth/verify-email',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/api/v1/health',
  '/api/v1/healthcheck'
];

// Routes that require admin/elevated privileges
const ADMIN_ROUTE_PATTERNS = [
  /\/admin\//,
  /\/users\/\w+/,  // Operations on other users
  /DELETE.*users/,  // Delete user endpoints
  /\/analytics/,
  /\/reports\//,
  /\/export/
];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Results accumulator
 */
const results = {
  totalRoutes: 0,
  protectedRoutes: 0,
  publicRoutes: 0,
  adminRoutes: 0,
  issues: [],
  warnings: [],
  recommendations: []
};

/**
 * Scan a route file for security middleware
 */
function scanRouteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const relativePath = path.relative(process.cwd(), filePath);

  console.log(`${colors.cyan}Scanning: ${relativePath}${colors.reset}`);

  // Extract route definitions
  const routeMatches = content.matchAll(/router\.(get|post|put|patch|delete|use)\s*\(\s*['"`]([^'"`]+)['"`]/g);

  // Check for global middleware on router
  const hasGlobalAuth = MIDDLEWARE_PATTERNS.authenticate.test(content.match(/router\.use\([^)]+\)/g)?.[0] || '');

  for (const match of routeMatches) {
    const [fullMatch, method, routePath] = match;
    const routeMethod = method.toUpperCase();
    const fullRoute = `/api/v1${routePath.startsWith('/') ? routePath : '/' + routePath}`;

    results.totalRoutes++;

    // Get the full route definition (everything between the matched line and the semicolon)
    const routeStartIndex = content.indexOf(fullMatch);
    const routeEndIndex = content.indexOf(';', routeStartIndex);
    const routeDefinition = content.substring(routeStartIndex, routeEndIndex);

    // Check for middleware in route definition
    const hasAuthenticate = hasGlobalAuth || MIDDLEWARE_PATTERNS.authenticate.test(routeDefinition);
    const hasAuthorize = MIDDLEWARE_PATTERNS.authorize.test(routeDefinition);
    const hasRateLimit = MIDDLEWARE_PATTERNS.rateLimit.test(routeDefinition);
    const hasValidation = MIDDLEWARE_PATTERNS.validate.test(routeDefinition);
    const hasSanitization = MIDDLEWARE_PATTERNS.sanitize.test(routeDefinition);

    // Check if route should be public
    const isPublicRoute = PUBLIC_ROUTES_ALLOWLIST.some(allowed => {
      return fullRoute.includes(allowed) || routePath.includes(allowed);
    });

    // Check if route requires admin access
    const isAdminRoute = ADMIN_ROUTE_PATTERNS.some(pattern => pattern.test(fullRoute));

    // Security checks
    if (isPublicRoute) {
      results.publicRoutes++;
      console.log(`  ${colors.green}✓${colors.reset} ${routeMethod} ${routePath} - Public (allowed)`);
    } else {
      results.protectedRoutes++;

      // Check for authentication
      if (!hasAuthenticate) {
        results.issues.push({
          severity: 'HIGH',
          file: relativePath,
          route: `${routeMethod} ${fullRoute}`,
          issue: 'Missing authentication middleware',
          recommendation: 'Add authenticate() middleware or router.use(authenticate) at top of file'
        });
        console.log(`  ${colors.red}✗${colors.reset} ${routeMethod} ${routePath} - ${colors.red}Missing authentication${colors.reset}`);
      } else {
        console.log(`  ${colors.green}✓${colors.reset} ${routeMethod} ${routePath} - Authenticated`);
      }

      // Check for authorization on admin routes
      if (isAdminRoute && !hasAuthorize) {
        results.issues.push({
          severity: 'HIGH',
          file: relativePath,
          route: `${routeMethod} ${fullRoute}`,
          issue: 'Admin route missing authorization middleware',
          recommendation: 'Add requireRole("admin") or authorize() middleware'
        });
        console.log(`    ${colors.red}⚠${colors.reset}  Admin route without authorization`);
      } else if (isAdminRoute) {
        results.adminRoutes++;
        console.log(`    ${colors.cyan}i${colors.reset}  Admin route with authorization`);
      }

      // Check for input validation on POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(routeMethod) && !hasValidation) {
        results.warnings.push({
          severity: 'MEDIUM',
          file: relativePath,
          route: `${routeMethod} ${fullRoute}`,
          issue: 'Missing input validation',
          recommendation: 'Add validate() middleware with schema'
        });
        console.log(`    ${colors.yellow}⚠${colors.reset}  No input validation detected`);
      }

      // Check for input sanitization on POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(routeMethod) && !hasSanitization) {
        results.warnings.push({
          severity: 'MEDIUM',
          file: relativePath,
          route: `${routeMethod} ${fullRoute}`,
          issue: 'Missing input sanitization',
          recommendation: 'Add allowOnly() or sanitizeBody() middleware'
        });
        console.log(`    ${colors.yellow}⚠${colors.reset}  No input sanitization detected`);
      }

      // Check for rate limiting on sensitive operations
      if (['POST', 'DELETE'].includes(routeMethod) && !hasRateLimit) {
        results.recommendations.push({
          severity: 'LOW',
          file: relativePath,
          route: `${routeMethod} ${fullRoute}`,
          issue: 'Consider adding rate limiting',
          recommendation: 'Add rateLimit() middleware for brute force protection'
        });
      }
    }
  }

  console.log('');
}

/**
 * Recursively scan routes directory
 */
function scanRoutesDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanRoutesDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name.includes('route')) {
      scanRouteFile(fullPath);
    }
  }
}

/**
 * Generate security report
 */
function generateReport() {
  console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}Endpoint Security Audit Report${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

  console.log(`${colors.bold}Summary:${colors.reset}`);
  console.log(`  Total Routes: ${results.totalRoutes}`);
  console.log(`  Protected Routes: ${results.protectedRoutes}`);
  console.log(`  Public Routes: ${results.publicRoutes}`);
  console.log(`  Admin Routes: ${results.adminRoutes}`);
  console.log(`  Issues Found: ${results.issues.length}`);
  console.log(`  Warnings: ${results.warnings.length}`);
  console.log(`  Recommendations: ${results.recommendations.length}\n`);

  // Critical Issues
  if (results.issues.length > 0) {
    console.log(`${colors.bold}${colors.red}CRITICAL ISSUES (${results.issues.length}):${colors.reset}`);
    results.issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${colors.red}${issue.severity}${colors.reset} - ${issue.route}`);
      console.log(`   File: ${issue.file}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Fix: ${issue.recommendation}`);
    });
    console.log('');
  }

  // Warnings
  if (results.warnings.length > 0) {
    console.log(`${colors.bold}${colors.yellow}WARNINGS (${results.warnings.length}):${colors.reset}`);
    results.warnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. ${colors.yellow}${warning.severity}${colors.reset} - ${warning.route}`);
      console.log(`   File: ${warning.file}`);
      console.log(`   Issue: ${warning.issue}`);
      console.log(`   Recommendation: ${warning.recommendation}`);
    });
    console.log('');
  }

  // Recommendations
  if (results.recommendations.length > 0 && process.env.VERBOSE === 'true') {
    console.log(`${colors.bold}RECOMMENDATIONS (${results.recommendations.length}):${colors.reset}`);
    results.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.route}`);
      console.log(`   ${rec.recommendation}`);
    });
    console.log('');
  }

  // Final verdict
  console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}`);
  if (results.issues.length === 0) {
    console.log(`${colors.bold}${colors.green}✓ AUDIT PASSED${colors.reset}`);
    console.log(`${colors.green}No critical security issues found.${colors.reset}`);
  } else {
    console.log(`${colors.bold}${colors.red}✗ AUDIT FAILED${colors.reset}`);
    console.log(`${colors.red}${results.issues.length} critical issue(s) must be fixed.${colors.reset}`);
  }
  console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

  // Exit with error code if issues found
  if (results.issues.length > 0) {
    process.exit(1);
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}Starting endpoint security audit...${colors.reset}\n`);

  if (!fs.existsSync(ROUTES_DIR)) {
    console.error(`${colors.red}Error: Routes directory not found: ${ROUTES_DIR}${colors.reset}`);
    process.exit(1);
  }

  scanRoutesDirectory(ROUTES_DIR);
  generateReport();
}

// Run the audit
main();
