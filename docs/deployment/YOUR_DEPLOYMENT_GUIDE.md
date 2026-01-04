# FurnaceLog Deployment Guide
**Your Server: 54.39.131.33 | Your Domain: furnacelog.com**

---

## Your Specific Configuration

**Server IP:** `54.39.131.33`
**Domain:** `furnacelog.com`
**Repository:** https://github.com/charlesfaubert44-wq/furnacelog.git

**Planned URLs:**
- Frontend: `https://furnacelog.com` or `https://app.furnacelog.com`
- Backend API: `https://api.furnacelog.com`
- MinIO Console: `http://54.39.131.33:9001` (internal use)

---

## Step 1: DNS Configuration (Do this FIRST)

Before deploying, configure your DNS at your domain registrar:

### Add These DNS Records:

```
Type    Name    Value               TTL
────────────────────────────────────────────
A       @       54.39.131.33        300
A       api     54.39.131.33        300
A       app     54.39.131.33        300
CNAME   www     furnacelog.com      300
```

**What this does:**
- `furnacelog.com` → Your server
- `api.furnacelog.com` → Your server (for backend)
- `app.furnacelog.com` → Your server (for frontend)
- `www.furnacelog.com` → Redirects to furnacelog.com

**Wait 5-10 minutes** for DNS to propagate, then test:
```bash
ping furnacelog.com
ping api.furnacelog.com
```

Both should resolve to `54.39.131.33`

---

## Step 2: Deploy Databases on Dokploy

### 2.1 Create MongoDB

1. Login to Dokploy at `http://54.39.131.33:3000` (or your Dokploy port)

2. **Databases → Create Database**
   - Type: MongoDB
   - Name: `furnacelog-mongodb`
   - Version: `7`
   - Root Password: Generate strong password
   ```bash
   openssl rand -base64 24
   ```
   Save it here: **MongoDB Password:** `_________________________`

3. Click "Create"

**Connection String:**
```
mongodb://root:YOUR_MONGODB_PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin
```

### 2.2 Create Redis

1. **Databases → Create Database**
   - Type: Redis
   - Name: `furnacelog-redis`
   - Version: `7-alpine`
   - Password: Generate strong password
   ```bash
   openssl rand -base64 24
   ```
   Save it here: **Redis Password:** `_________________________`

2. Click "Create"

**Connection String:**
```
redis://:YOUR_REDIS_PASSWORD@furnacelog-redis:6379
```

### 2.3 Create MinIO (File Storage)

1. **Applications → Create Application → Docker Compose**
   - Name: `furnacelog-minio`

2. **Paste this configuration:**
```yaml
version: '3.9'

services:
  minio:
    image: minio/minio:latest
    container_name: furnacelog-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: GENERATE_STRONG_PASSWORD_HERE
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data
    restart: unless-stopped

volumes:
  minio-data:
```

3. **Replace password:**
```bash
openssl rand -base64 24
```
Save it here: **MinIO Password:** `_________________________`

4. Click "Deploy"

---

## Step 3: Generate JWT Secrets

Run these commands:

```bash
openssl rand -base64 32
openssl rand -base64 32
```

Save the outputs:
- **JWT_SECRET:** `_________________________`
- **JWT_REFRESH_SECRET:** `_________________________`

---

## Step 4: Deploy Backend API

1. **Applications → Create Application → Git Repository**
   - Name: `furnacelog-backend`
   - Repository: `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - Branch: `main`
   - Build Path: `backend`
   - Dockerfile: `backend.Dockerfile`
   - Container Port: `3000`

2. **Environment Variables** (copy and fill in YOUR passwords):

```env
NODE_ENV=production
PORT=3000

# MongoDB - Use YOUR password from Step 2.1
MONGODB_URI=mongodb://root:YOUR_MONGODB_PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin

# Redis - Use YOUR password from Step 2.2
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@furnacelog-redis:6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD

# MinIO - Use YOUR password from Step 2.3
MINIO_ENDPOINT=furnacelog-minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=YOUR_MINIO_PASSWORD
MINIO_BUCKET_DOCUMENTS=furnacelog-documents
MINIO_BUCKET_IMAGES=furnacelog-images
MINIO_BUCKET_AVATARS=furnacelog-avatars

# JWT - Use YOUR secrets from Step 3
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN=7d

# Your Domain URLs
FRONTEND_URL=https://furnacelog.com
CORS_ORIGIN=https://furnacelog.com

# Email (Optional - configure later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@furnacelog.com
```

3. Click "Deploy" and wait for build (~3-5 minutes)

4. **Configure Domain & SSL:**
   - Go to backend app → "Domains"
   - Add domain: `api.furnacelog.com`
   - Enable SSL (Let's Encrypt) ✅
   - Click "Add Domain"

5. **Test Backend:**
```bash
curl https://api.furnacelog.com/health
```

Expected: `{"status": "healthy", ...}`

---

## Step 5: Deploy Frontend

1. **Applications → Create Application → Git Repository**
   - Name: `furnacelog-frontend`
   - Repository: `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - Branch: `main`
   - Build Path: `frontend`
   - Dockerfile: `frontend.Dockerfile`
   - Container Port: `80`

2. **Environment Variables:**

```env
VITE_API_URL=https://api.furnacelog.com/api/v1
VITE_APP_NAME=FurnaceLog
VITE_ENV=production
```

3. Click "Deploy" and wait for build (~3-5 minutes)

4. **Configure Domain & SSL:**
   - Go to frontend app → "Domains"
   - Add domain: `furnacelog.com`
   - Enable SSL (Let's Encrypt) ✅
   - Click "Add Domain"

5. **Optional: Add www redirect**
   - Add second domain: `www.furnacelog.com`
   - Enable redirect to `furnacelog.com`

---

## Step 6: Test Your Deployment

### 1. Test Backend API

```bash
# Health check
curl https://api.furnacelog.com/health

# Register a test user
curl -X POST https://api.furnacelog.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#"
  }'
```

### 2. Test Frontend

1. Open: **https://furnacelog.com**
2. Click "Register"
3. Create your account
4. Login
5. Verify dashboard loads

### 3. Test Full Flow

- ✅ Create a home profile
- ✅ Add a heating system
- ✅ Schedule maintenance task
- ✅ View dashboard widgets

---

## Your Live URLs

```
Frontend:      https://furnacelog.com
Backend API:   https://api.furnacelog.com
API Health:    https://api.furnacelog.com/health

MinIO Console: http://54.39.131.33:9001 (login with minioadmin / your-password)
```

---

## Troubleshooting

### DNS not resolving

```bash
# Check if DNS is propagated
nslookup furnacelog.com
nslookup api.furnacelog.com

# Should show: 54.39.131.33
```

If not:
- Wait 10-30 minutes for DNS propagation
- Check DNS records at your registrar
- Use `https://dnschecker.org` to check global propagation

### SSL Certificate Issues

In Dokploy:
- Make sure DNS is pointing to correct IP BEFORE enabling SSL
- Let's Encrypt requires DNS to be correct
- If SSL fails, try again after DNS propagates

### Backend Connection Errors

Check Dokploy logs:
1. Go to backend application
2. Click "Logs"
3. Look for MongoDB/Redis connection errors

Common fixes:
- Verify passwords in environment variables
- Check service names (furnacelog-mongodb, furnacelog-redis)
- Restart backend application

### Frontend Can't Connect to Backend

Check:
1. `VITE_API_URL=https://api.furnacelog.com/api/v1` (includes /api/v1)
2. `CORS_ORIGIN=https://furnacelog.com` in backend (matches frontend exactly)
3. Backend is running: `curl https://api.furnacelog.com/health`

---

## Post-Deployment Checklist

### Security

- [ ] Strong passwords for all services
- [ ] JWT secrets are random (32+ chars)
- [ ] HTTPS/SSL enabled on both domains
- [ ] CORS configured correctly
- [ ] MongoDB only accessible internally
- [ ] Redis only accessible internally

### Functionality

- [ ] Backend health check passes
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads
- [ ] Can create home profile
- [ ] Can add systems
- [ ] Can schedule maintenance

### Optional Enhancements

- [ ] Configure email (SMTP settings)
- [ ] Set up backups (MongoDB, MinIO)
- [ ] Configure monitoring (UptimeRobot)
- [ ] Add analytics (optional)

---

## Backup Your Credentials

**SAVE THESE SECURELY:**

```
Server IP:            54.39.131.33
Domain:               furnacelog.com
GitHub Repo:          https://github.com/charlesfaubert44-wq/furnacelog

MongoDB Password:     _________________________
Redis Password:       _________________________
MinIO Password:       _________________________
JWT Secret:           _________________________
JWT Refresh Secret:   _________________________

Frontend URL:         https://furnacelog.com
Backend URL:          https://api.furnacelog.com
```

---

## Updating the Application

When you make code changes:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

2. **Redeploy in Dokploy:**
   - Go to backend/frontend application
   - Click "Redeploy"
   - Wait for new build

---

## Accessing Services

### Dokploy Dashboard
```
http://54.39.131.33:3000 (or your Dokploy port)
```

### MinIO Console
```
http://54.39.131.33:9001
Username: minioadmin
Password: Your MinIO password
```

### MongoDB (from server)
```bash
docker exec -it furnacelog-mongodb mongosh \
  "mongodb://root:YOUR_PASSWORD@localhost:27017/furnacelog?authSource=admin"
```

---

## Next Steps

1. **Create Your First Home**
   - Login to https://furnacelog.com
   - Add your home details
   - Configure your heating system

2. **Set Up Maintenance**
   - Add systems
   - Schedule maintenance tasks
   - Set up seasonal checklists

3. **Configure Email (Optional)**
   - Update SMTP settings in backend
   - Enable password reset emails
   - Enable warranty alerts

4. **Invite Users**
   - Share https://furnacelog.com
   - Users can register and create accounts

---

## Support

- **GitHub Issues:** https://github.com/charlesfaubert44-wq/furnacelog/issues
- **Documentation:** See PRODUCTION_READINESS_REPORT.md
- **API Reference:** See API_EXAMPLES.md

---

## Quick Commands

### Generate Passwords
```bash
openssl rand -base64 24  # Passwords
openssl rand -base64 32  # JWT secrets
```

### Test Backend
```bash
curl https://api.furnacelog.com/health
```

### Test DNS
```bash
nslookup furnacelog.com
nslookup api.furnacelog.com
```

### Check SSL
```bash
curl -I https://furnacelog.com
curl -I https://api.furnacelog.com
```

---

**Ready to Deploy!** 🚀

Follow the steps above in order, and you'll have FurnaceLog running at:
- **https://furnacelog.com** (your northern home maintenance tracker)
- **https://api.furnacelog.com** (your API)

**Estimated Time:** 30-45 minutes

Good luck! 🏠❄️
