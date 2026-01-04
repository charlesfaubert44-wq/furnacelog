# FurnaceLog Security Quick Reference

**Quick commands and checklists for secure development**

## Setup (One-Time)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copy output to JWT_SECRET

node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copy output to JWT_REFRESH_SECRET

# 4. Update all CHANGE_ME values in both .env files
```

## Pre-Commit Checklist

Before every commit:

- [ ] No .env files staged (only .env.example)
- [ ] No secrets in code (JWT_SECRET, passwords, API keys)
- [ ] No credential files (.pem, .key, credentials.json)
- [ ] CHANGE_ME placeholders in .env.example
- [ ] Review `git diff` for sensitive data

## Secret Patterns to NEVER Commit

- `JWT_SECRET=actual-secret`
- `password=actual-password`
- `api_key=actual-key`
- `client_secret=actual-secret`
- `MONGODB_URI=mongodb://user:password@host`
- `REDIS_PASSWORD=actual-password`
- `MINIO_SECRET_KEY=actual-key`

## Files That Should NEVER Be Committed

- `.env` (any environment file without .example)
- `credentials.json`
- `secrets.json`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- Any file with real passwords or API keys

## Quick Commands

### Generate Secure Password
```bash
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Test Pre-Commit Hook
```bash
# Should FAIL (hook blocks it)
echo "JWT_SECRET=test" > test.txt
git add test.txt
git commit -m "test"

# Clean up
git reset HEAD test.txt
rm test.txt
```

### Check for Secrets in Staged Files
```bash
git diff --cached | grep -iE "(secret|password|api[_-]?key)"
```

### View Environment Template
```bash
# Backend
cat backend/.env.example

# Frontend
cat frontend/.env.example
```

## Environment Variables Quick Guide

### Backend (30+ variables)
- Database: `MONGODB_URI`
- Cache: `REDIS_URL`, `REDIS_PASSWORD`
- Storage: `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
- Auth: `JWT_SECRET`, `JWT_REFRESH_SECRET`
- Email: `SMTP_PASSWORD`
- OAuth: `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_SECRET`

### Frontend (10+ variables)
- API: `VITE_API_URL`
- OAuth: `VITE_GOOGLE_CLIENT_ID` (public only!)
- Analytics: `VITE_SENTRY_DSN`, `VITE_GA_TRACKING_ID`

## Common Mistakes

### DON'T ❌
```bash
# Don't commit .env files
git add .env

# Don't put secrets in code
const secret = "my-jwt-secret";

# Don't use weak passwords
MONGODB_URI=mongodb://admin:password@localhost

# Don't use default credentials
MINIO_ACCESS_KEY=minioadmin
```

### DO ✅
```bash
# Commit only .env.example
git add .env.example

# Use environment variables
const secret = process.env.JWT_SECRET;

# Use strong, random passwords
MONGODB_URI=mongodb://admin:Xk9$mP2#vL8nQ5wR@localhost

# Generate strong credentials
MINIO_ACCESS_KEY=Xy8kL3mN9pQ2rS5tV7wZ
```

## Quick Security Audit

Run before deployment:

```bash
# 1. Check for secrets in git history
git log --all --full-history --source -- '*env*'

# 2. Check npm vulnerabilities
cd backend && npm audit
cd ../frontend && npm audit

# 3. Review .env files
diff backend/.env.example backend/.env | grep "CHANGE_ME"
# Should show all changed values

# 4. Test pre-commit hook
# (see "Test Pre-Commit Hook" above)
```

## Emergency: Secret Leaked to Git

If you accidentally committed a secret:

```bash
# 1. IMMEDIATELY rotate the secret
# Follow SECURITY.md rotation guide

# 2. Remove from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (coordinate with team first!)
git push origin --force --all

# 4. Verify secret is rotated
# Check all environments
```

## Documentation Links

- **Full Security Policy**: `SECURITY.md`
- **Audit Checklist**: `SECURITY_CHECKLIST.md`
- **Setup Guide**: `SECURITY_SETUP_GUIDE.md`
- **Implementation Report**: `SECURITY_IMPLEMENTATION_REPORT.md`

## Support

**Security Issues**: security@furnacelog.com
**Do NOT open public issues for vulnerabilities**

---

**Keep this reference handy during development!**
