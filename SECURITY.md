# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in FurnaceLog, please email us at **security@furnacelog.com**.

**Please do NOT open a public issue for security vulnerabilities.**

We will respond within 48 hours and work with you to:
- Confirm the vulnerability
- Determine the impact and severity
- Develop and test a fix
- Release a security update
- Credit you for the discovery (if desired)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables for all secrets
2. **Review before committing** - Check for sensitive data in code
3. **Use strong passwords** - Minimum 12 characters with complexity
4. **Enable 2FA** - On GitHub, email, and all critical services
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Follow principle of least privilege** - Only grant necessary permissions

### For Deployments

1. **Rotate secrets regularly** - At least every 90 days
2. **Use environment-specific secrets** - Different for dev/staging/production
3. **Secure secret storage** - Use secret managers (AWS Secrets, Azure Key Vault, etc.)
4. **Enable HTTPS only** - Force SSL/TLS in production
5. **Monitor logs** - Set up alerts for suspicious activity
6. **Regular security audits** - Quarterly security reviews

## Secret Rotation Guide

### When to Rotate Secrets

- **Immediately**: If a secret is compromised or committed to version control
- **Regularly**: Every 90 days for production secrets
- **After**: Team member departures or role changes
- **Following**: Security incidents or breaches

### How to Rotate Secrets

#### 1. JWT Secrets

```bash
# Generate new secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Update .env files
JWT_SECRET=<new_secret>
JWT_REFRESH_SECRET=<new_refresh_secret>

# Restart application
# All users will be logged out and need to re-authenticate
```

#### 2. Database Credentials

```bash
# 1. Create new database user with strong password
# 2. Grant same permissions as old user
# 3. Update MONGODB_URI in .env
# 4. Test connection
# 5. Revoke old user after verification
# 6. Restart application
```

#### 3. API Keys & OAuth Secrets

```bash
# 1. Generate new keys in provider dashboard
# 2. Update .env files
# 3. Test integration
# 4. Revoke old keys
# 5. Restart application
```

## Secrets Checklist

Before deploying to production, verify:

- [ ] All secrets in `.env` files (never in code)
- [ ] `.env` files in `.gitignore`
- [ ] No secrets in git history
- [ ] Unique secrets for each environment (dev/staging/prod)
- [ ] Secrets stored in secure secret manager
- [ ] Database passwords are strong (20+ chars, random)
- [ ] JWT secrets are random (32+ bytes)
- [ ] OAuth secrets configured correctly
- [ ] SMTP credentials secured
- [ ] Redis password set (not default)
- [ ] MinIO credentials changed from defaults

## Security Headers

Ensure these headers are configured in production:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy` (see nginx.conf)
- `Referrer-Policy: strict-origin-when-cross-origin`

## Incident Response

If a security incident occurs:

1. **Isolate** - Take affected systems offline
2. **Assess** - Determine scope and impact
3. **Contain** - Stop the breach from spreading
4. **Eradicate** - Remove threat from systems
5. **Recover** - Restore normal operations
6. **Review** - Post-mortem and improvements

Contact: security@furnacelog.com

## Vulnerability Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 1-2**: Acknowledge receipt, begin investigation
- **Day 3-7**: Confirm vulnerability and severity
- **Day 8-30**: Develop and test fix
- **Day 30-60**: Release security update
- **Day 60+**: Public disclosure (if appropriate)

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security](https://reactjs.org/docs/security.html)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
