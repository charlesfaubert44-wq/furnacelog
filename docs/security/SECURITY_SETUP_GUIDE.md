# FurnaceLog Security Setup Guide

This guide will help you set up and verify all security features for the FurnaceLog project.

## Quick Start

### 1. Install Dependencies

```bash
# In project root
npm install

# This will:
# - Install husky
# - Set up git hooks automatically
```

### 2. Set Up Environment Files

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and replace all CHANGE_ME values

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env and replace all values as needed
```

### 3. Generate Secure JWT Secrets

```bash
# Run this command twice to generate two different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy the output to:
# - JWT_SECRET in backend/.env
# - JWT_REFRESH_SECRET in backend/.env
```

### 4. Verify Pre-Commit Hook

```bash
# Try to commit a .env file (should be blocked)
git add backend/.env
git commit -m "test"

# Expected: Hook should prevent commit and show error message
# Then unstage the file:
git reset HEAD backend/.env
```

## Detailed Setup Instructions

### Environment Configuration

#### Backend (.env)

1. **Database Credentials**
   ```bash
   # Replace default passwords
   MONGODB_URI=mongodb://admin:YOUR_STRONG_PASSWORD@mongodb:27017/furnacelog?authSource=admin
   ```

2. **Redis Password**
   ```bash
   # Generate strong password
   REDIS_PASSWORD=YOUR_REDIS_PASSWORD
   REDIS_URL=redis://:YOUR_REDIS_PASSWORD@redis:6379
   ```

3. **MinIO Credentials**
   ```bash
   # Change from defaults (minioadmin is NOT secure)
   MINIO_ACCESS_KEY=YOUR_ACCESS_KEY_20_CHARS
   MINIO_SECRET_KEY=YOUR_SECRET_KEY_40_CHARS_MINIMUM
   ```

4. **JWT Secrets**
   ```bash
   # Generate with crypto
   JWT_SECRET=<output from crypto.randomBytes>
   JWT_REFRESH_SECRET=<different output from crypto.randomBytes>
   ```

5. **OAuth Credentials (Optional)**
   ```bash
   # Get from Google Cloud Console
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-actual-secret

   # Get from Facebook Developers
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-secret
   ```

#### Frontend (.env)

1. **API URL**
   ```bash
   # Development
   VITE_API_URL=http://localhost:3000/api/v1

   # Production
   VITE_API_URL=https://api.furnacelog.com/api/v1
   ```

2. **OAuth Client ID (Optional)**
   ```bash
   # Only client ID (public), NEVER client secret
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

### Security Checklist Verification

Use `SECURITY_CHECKLIST.md` to verify your setup:

```bash
# Open the checklist
cat SECURITY_CHECKLIST.md

# Review each section and check off completed items
```

### Pre-Commit Hook Testing

The pre-commit hook prevents committing secrets. Test it:

#### Test 1: Block .env files

```bash
# Try to commit .env file
echo "TEST=value" > test.env
git add test.env
git commit -m "test"

# Expected: ❌ ERROR: .env file detected in commit!

# Cleanup
git reset HEAD test.env
rm test.env
```

#### Test 2: Block secret patterns

```bash
# Create test file with secret
echo "JWT_SECRET=my-secret-key" > test-secret.txt
git add test-secret.txt
git commit -m "test"

# Expected: ❌ ERROR: Potential secrets detected!

# Cleanup
git reset HEAD test-secret.txt
rm test-secret.txt
```

#### Test 3: Allow .env.example

```bash
# This should work fine
git add backend/.env.example
git commit -m "Update .env.example"

# Expected: ✅ No secrets detected!
```

### Secret Rotation Procedure

#### When to Rotate

- **Immediately**: If a secret is compromised or committed to git
- **Regularly**: Every 90 days for production
- **After**: Team member departures
- **Following**: Security incidents

#### How to Rotate JWT Secrets

```bash
# 1. Generate new secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 2. Update backend/.env
JWT_SECRET=<new_secret>
JWT_REFRESH_SECRET=<new_refresh_secret>

# 3. Restart backend
cd backend
npm restart

# Note: All users will be logged out
```

#### How to Rotate Database Password

```bash
# 1. Connect to MongoDB
docker exec -it furnacelog-mongodb mongosh -u admin -p

# 2. Create new user
use admin
db.createUser({
  user: "admin_new",
  pwd: "NEW_STRONG_PASSWORD",
  roles: ["root"]
})

# 3. Update backend/.env
MONGODB_URI=mongodb://admin_new:NEW_STRONG_PASSWORD@mongodb:27017/furnacelog?authSource=admin

# 4. Restart backend and test

# 5. Remove old user (after verification)
use admin
db.dropUser("admin")
```

## Security Best Practices

### Development

1. **Never commit secrets**
   - Use `.env` files (gitignored)
   - Keep `.env.example` updated with placeholders

2. **Use strong passwords**
   - Minimum 20 characters for production
   - Use random generators

3. **Review before committing**
   - Check git diff before commit
   - Watch for secret patterns

### Production Deployment

1. **Use secret managers**
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager
   - HashiCorp Vault

2. **Enable HTTPS**
   ```bash
   # Backend .env
   ENABLE_HTTPS=true
   COOKIE_SECURE=true
   ```

3. **Use production-grade passwords**
   - Database: 32+ random characters
   - Redis: 32+ random characters
   - MinIO: 40+ random characters
   - JWT: 32 bytes (base64 encoded)

4. **Configure CORS properly**
   ```bash
   # Backend .env (production)
   CORS_ORIGIN=https://furnacelog.com,https://www.furnacelog.com
   ```

### Monitoring

1. **Enable error tracking**
   ```bash
   # Frontend .env (production)
   VITE_SENTRY_DSN=your-sentry-dsn
   VITE_SENTRY_ENVIRONMENT=production
   ```

2. **Review logs regularly**
   - Check for failed login attempts
   - Monitor API errors
   - Watch for suspicious patterns

3. **Set up alerts**
   - Failed login threshold exceeded
   - Rate limit violations
   - Database connection errors

## Troubleshooting

### Pre-Commit Hook Not Running

```bash
# Reinstall husky
npm install
npx husky install

# Make hook executable
chmod +x .husky/pre-commit

# Test
git add .
git commit -m "test"
```

### Hook Blocking Valid Commits

If the hook incorrectly blocks a commit:

```bash
# Option 1: Fix the issue (recommended)
# - Remove the secret pattern
# - Use placeholders in .env.example

# Option 2: Bypass hook (use with caution)
git commit -m "message" --no-verify
```

### Environment Variables Not Loading

```bash
# Backend: Ensure dotenv is configured
# Check backend/src/config/env.js or server.js

# Frontend: Ensure variables are prefixed with VITE_
# Check frontend/.env
```

## Security Audit Schedule

### Daily
- [ ] Review git commits for secrets
- [ ] Check error logs

### Weekly
- [ ] Run npm audit
- [ ] Review failed login attempts
- [ ] Check rate limiting logs

### Monthly
- [ ] Update dependencies
- [ ] Review access logs
- [ ] Test backup restoration

### Quarterly
- [ ] Full security audit (use SECURITY_CHECKLIST.md)
- [ ] Rotate production secrets
- [ ] Review and update security policies
- [ ] Penetration testing

## Resources

- **Security Policy**: `SECURITY.md`
- **Audit Checklist**: `SECURITY_CHECKLIST.md`
- **Backend .env Template**: `backend/.env.example`
- **Frontend .env Template**: `frontend/.env.example`
- **Pre-Commit Hook**: `.husky/pre-commit`

## Support

For security issues, contact: **security@furnacelog.com**

**Do NOT open public issues for security vulnerabilities!**
