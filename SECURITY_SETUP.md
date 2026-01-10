# Security Setup Guide - FurnaceLog

This guide covers the security tools and practices required for developing and deploying FurnaceLog safely.

---

## Table of Contents

1. [Pre-commit Hooks Setup](#pre-commit-hooks-setup)
2. [Secret Scanning](#secret-scanning)
3. [Environment Variables](#environment-variables)
4. [Dependency Management](#dependency-management)
5. [Docker Security](#docker-security)
6. [HTTPS/TLS Setup](#httpstls-setup)

---

## Pre-commit Hooks Setup

Pre-commit hooks prevent committing secrets, credentials, and insecure code.

### Installation

1. **Install pre-commit framework:**

```bash
# Using pip
pip install pre-commit

# Using Homebrew (macOS)
brew install pre-commit

# Using npm (cross-platform)
npm install -g @pre-commit/pre-commit
```

2. **Install the hooks:**

```bash
# In the project root directory
pre-commit install
```

3. **Verify installation:**

```bash
pre-commit --version
# Should output: pre-commit 3.x.x
```

### Usage

**Automatic:** Hooks run automatically on `git commit`

```bash
git add .
git commit -m "Your commit message"
# Pre-commit hooks will run automatically
```

**Manual run on all files:**

```bash
pre-commit run --all-files
```

**Manual run on specific files:**

```bash
pre-commit run --files backend/src/app.js
```

**Skip hooks (emergency only - NOT recommended):**

```bash
git commit --no-verify -m "Emergency fix"
# WARNING: Only use in critical situations
```

### Hooks Enabled

1. **detect-secrets** - Scans for credentials, API keys, passwords
2. **check-added-large-files** - Prevents committing large files (>500KB)
3. **no-commit-to-branch** - Prevents direct commits to main/master
4. **check-merge-conflict** - Detects unresolved merge conflicts
5. **check-yaml** - Validates YAML syntax
6. **check-json** - Validates JSON syntax
7. **trailing-whitespace** - Removes trailing whitespace
8. **end-of-file-fixer** - Ensures files end with newline
9. **detect-private-key** - Detects private key files
10. **eslint** - Lints JavaScript/TypeScript code
11. **npm-audit** - Checks for vulnerable dependencies
12. **check-env-files** - Prevents .env files from being committed
13. **check-docker-compose** - Validates no default passwords in docker-compose.yml

---

## Secret Scanning

### Initial Baseline Scan

Create a baseline of existing "secrets" (which are actually safe placeholders):

```bash
# Install detect-secrets
pip install detect-secrets

# Generate baseline
detect-secrets scan > .secrets.baseline

# Audit the baseline to mark false positives
detect-secrets audit .secrets.baseline
```

### Update Baseline After Changes

When you add new environment variables or configuration:

```bash
# Update the baseline
detect-secrets scan --baseline .secrets.baseline

# Audit new findings
detect-secrets audit .secrets.baseline
```

### Scan Git History for Secrets

Check if secrets were previously committed:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# Or download from: https://github.com/awslabs/git-secrets

# Initialize
git secrets --install
git secrets --register-aws

# Scan entire history
git secrets --scan-history

# If secrets found, use BFG Repo Cleaner to remove them:
# https://rtyley.github.io/bfg-repo-cleaner/
```

---

## Environment Variables

### Required Variables

All required environment variables are documented in `.env.example`.

### Setup for Development

1. **Copy the example file:**

```bash
cp .env.example .env
```

2. **Generate secure secrets:**

```bash
# JWT Secret (64 bytes, base64)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# JWT Refresh Secret (64 bytes, base64)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# CSRF Secret (32 bytes, base64)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# MongoDB/Redis/MinIO passwords (32 bytes, base64)
openssl rand -base64 32
```

3. **Update .env with generated secrets**

4. **Verify .env is in .gitignore:**

```bash
# Check that .env is listed in .gitignore
grep "^\.env$" .gitignore
# Should output: .env
```

### Production Secrets Management

**DO NOT** use .env files in production. Instead:

1. **Use a secrets manager:**
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Cloud Secret Manager
   - HashiCorp Vault

2. **Or use platform environment variables:**
   - Kubernetes Secrets
   - Docker Swarm Secrets
   - Cloud Run/App Engine environment config

3. **Rotate secrets regularly:**
   - JWT secrets: Every 90 days
   - Database passwords: Every 180 days
   - API keys: Every 90 days

---

## Dependency Management

### Automated Vulnerability Scanning

#### GitHub Dependabot

1. **Create `.github/dependabot.yml`:**

```yaml
version: 2
updates:
  # Backend dependencies
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-github-username"

  # Frontend dependencies
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-github-username"

  # Docker base images
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

2. **Commit and push:**

```bash
git add .github/dependabot.yml
git commit -m "Enable Dependabot for dependency updates"
git push
```

3. **Dependabot will:**
   - Scan weekly for vulnerable dependencies
   - Create pull requests with updates
   - Run your test suite on PRs

#### Manual npm audit

Run regularly during development:

```bash
# Check for vulnerabilities
cd backend && npm audit
cd frontend && npm audit

# Fix automatically (may introduce breaking changes)
npm audit fix

# Fix forcing semver updates (CAUTION: breaking changes)
npm audit fix --force
```

### Dependency Review Checklist

Before adding new dependencies:

- [ ] Check npm download count (>100k/week preferred)
- [ ] Check last publish date (active within 6 months)
- [ ] Check GitHub stars and activity
- [ ] Review open issues and security advisories
- [ ] Check bundle size impact
- [ ] Verify license compatibility
- [ ] Review dependency tree (avoid large nested dependencies)

---

## Docker Security

### Resource Limits (Already Configured)

All services in `docker-compose.yml` now have CPU and memory limits to prevent resource exhaustion attacks.

### Running Containers as Non-Root

- Frontend nginx: Runs as user `nginx` (UID 101)
- Backend: Runs as user `node`
- Databases: Run with default secure users

### Network Isolation

- All services communicate via `furnacelog-network` (bridge network)
- Database ports bound to `127.0.0.1` (localhost only)
- No direct internet exposure for databases

### Docker Security Scanning

```bash
# Scan images for vulnerabilities using Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image furnacelog-backend:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image furnacelog-frontend:latest
```

### Best Practices

1. **Use specific base image versions:**
   ```dockerfile
   FROM node:20-alpine3.18
   # NOT: FROM node:latest
   ```

2. **Multi-stage builds:**
   - Build stage: Install dev dependencies
   - Production stage: Only runtime dependencies

3. **Minimize layers:**
   - Combine RUN commands with `&&`
   - Clean up in same layer: `RUN apt-get update && apt-get install && rm -rf /var/lib/apt/lists/*`

4. **Security scanning in CI:**
   ```yaml
   # .github/workflows/security.yml
   - name: Run Trivy vulnerability scanner
     uses: aquasecurity/trivy-action@master
   ```

---

## HTTPS/TLS Setup

### Development (localhost)

Use mkcert for local HTTPS:

```bash
# Install mkcert
brew install mkcert  # macOS
# Or: https://github.com/FiloSottile/mkcert

# Create local CA
mkcert -install

# Generate certificate for localhost
mkcert localhost 127.0.0.1 ::1

# Update nginx.conf to use certificates
```

### Production

#### Option 1: Let's Encrypt (Recommended for most deployments)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate (nginx must be running)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

#### Option 2: Cloud Provider Certificates

- **AWS**: Use ACM (AWS Certificate Manager) with ALB/CloudFront
- **Azure**: Use App Service Certificates or Application Gateway
- **GCP**: Use Google-managed SSL certificates with Load Balancer

#### Option 3: Custom CA Certificate

For internal/enterprise deployments:

```bash
# Generate private key
openssl genrsa -out server.key 2048

# Generate CSR (Certificate Signing Request)
openssl req -new -key server.key -out server.csr

# Send CSR to your CA for signing
# Receive signed certificate: server.crt

# Configure in nginx.conf:
ssl_certificate /etc/nginx/ssl/server.crt;
ssl_certificate_key /etc/nginx/ssl/server.key;
```

### TLS Configuration (Already Configured)

The `nginx.conf` already includes:

- **TLS 1.2/1.3 only** (TLS 1.0/1.1 disabled)
- **Strong cipher suites** (PFS enabled)
- **HSTS enabled** (1 year max-age, preload)
- **OCSP stapling** (certificate status checking)

### Verify HTTPS Setup

```bash
# Test SSL/TLS configuration
curl -vI https://yourdomain.com

# Grade your SSL configuration
# Visit: https://www.ssllabs.com/ssltest/
# Should achieve A or A+ rating
```

---

## Security Checklist for Deployment

### Pre-Deployment

- [ ] All environment variables set with strong secrets
- [ ] Database ports bound to localhost only
- [ ] HTTPS/TLS certificates configured
- [ ] Resource limits applied to all containers
- [ ] Pre-commit hooks installed and working
- [ ] All dependencies updated (`npm audit` clean)
- [ ] Docker images scanned for vulnerabilities
- [ ] Firewall rules configured (only ports 80/443 exposed)
- [ ] Backups configured for database
- [ ] Monitoring and logging configured

### Post-Deployment

- [ ] Test authentication and authorization
- [ ] Verify HSTS header present
- [ ] Test CSP (Content Security Policy)
- [ ] Verify database connections use TLS
- [ ] Test rate limiting on API endpoints
- [ ] Review logs for errors or security warnings
- [ ] Set up intrusion detection (fail2ban, etc.)
- [ ] Document incident response procedures

---

## Getting Help

### Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead:
- Email: security@furnacelog.com (if configured)
- Or create a private security advisory on GitHub

### Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated:** 2026-01-09
