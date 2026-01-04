# FurnaceLog Security Audit Checklist

Use this checklist before each deployment and quarterly security reviews.

## Authentication & Authorization

- [ ] Passwords hashed with bcrypt (cost factor 10+)
- [ ] JWT tokens stored in httpOnly cookies (not localStorage)
- [ ] Access tokens expire in ≤15 minutes
- [ ] Refresh tokens expire in ≤7 days
- [ ] CSRF protection enabled on all state-changing requests
- [ ] OAuth tokens never in URL parameters
- [ ] Rate limiting on login/register endpoints (5 attempts per 15 min)
- [ ] Password strength requirements enforced (8+ chars, complexity)
- [ ] Account lockout after 5 failed login attempts
- [ ] Session timeout after 15 minutes of inactivity

## Input Validation & Sanitization

- [ ] All user inputs validated with Zod schemas
- [ ] Email validation implemented
- [ ] Phone number validation with regex
- [ ] Name fields sanitized (max 50 chars, letters only)
- [ ] Community names validated (max 100 chars)
- [ ] No dangerouslySetInnerHTML without DOMPurify
- [ ] URL parameters validated before redirect
- [ ] File uploads validated (type, size, content)

## Data Protection

- [ ] All sensitive data encrypted at rest
- [ ] HTTPS enforced in production (HSTS enabled)
- [ ] Database credentials secured (not defaults)
- [ ] API keys in environment variables (not code)
- [ ] No secrets in git history
- [ ] .env files in .gitignore
- [ ] Secrets rotated every 90 days
- [ ] PII not logged to console or files

## API Security

- [ ] Request timeout configured (30s)
- [ ] Retry logic with exponential backoff
- [ ] CORS properly configured (specific origins)
- [ ] Content-Type validation on requests
- [ ] Error messages don't expose internals
- [ ] API versioning implemented (/api/v1)
- [ ] Rate limiting on all endpoints

## Dependencies

- [ ] No critical/high npm audit vulnerabilities
- [ ] Dependencies updated within last 30 days
- [ ] Dependabot enabled for automated updates
- [ ] No unused dependencies in production
- [ ] SRI (Subresource Integrity) for CDN resources

## Build & Deployment

- [ ] Source maps disabled in production
- [ ] console.log statements removed from production
- [ ] Code minified and obfuscated
- [ ] Environment variables properly configured
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] HTTPS certificates valid and up-to-date

## Security Headers

- [ ] Content-Security-Policy (no unsafe-inline)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security (HSTS)
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured

## Monitoring & Logging

- [ ] Error tracking service integrated (Sentry, LogRocket)
- [ ] Security events logged (failed logins, admin actions)
- [ ] Sensitive data sanitized in logs
- [ ] Log retention policy defined
- [ ] Alerts configured for suspicious activity

## Compliance

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance (if applicable)
- [ ] PIPEDA compliance (Canada)
- [ ] Data retention policy documented
- [ ] User data export functionality
- [ ] User data deletion functionality

## Incident Response

- [ ] Security incident response plan documented
- [ ] Contact information published (security@furnacelog.com)
- [ ] security.txt file published
- [ ] Backup and recovery procedures tested
- [ ] Team trained on incident response

## Testing

- [ ] Authentication flows tested
- [ ] CSRF protection tested
- [ ] Rate limiting tested
- [ ] Input validation tested
- [ ] Error handling tested
- [ ] OAuth flow tested (if applicable)

---

**Last Audit Date:** _____________

**Audited By:** _____________

**Next Audit Due:** _____________

**Critical Issues Found:** _____________

**Remediation Status:** _____________
