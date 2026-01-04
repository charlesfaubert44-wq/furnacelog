# FurnaceLog Dokploy Deployment Guide

**Quick Setup Guide for Deploying FurnaceLog to Dokploy**

---

## Prerequisites

- ✅ Dokploy server running
- ✅ GitHub repository: https://github.com/charlesfaubert44-wq/furnacelog.git
- ✅ Domain name configured (optional but recommended)

---

## Part 1: MongoDB Atlas Setup (Recommended)

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com
   - Sign in or create account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select region closest to your Dokploy server
   - Cluster name: `furnacelog-cluster`

3. **Configure Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `furnacelog_admin`
   - Password: Generate strong password (save this!)
   - Database User Privileges: "Atlas admin"

4. **Configure Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Driver: Node.js
   - Copy connection string:
   ```
   mongodb+srv://furnacelog_admin:<password>@furnacelog-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `furnacelog`
   ```
   mongodb+srv://furnacelog_admin:YOUR_PASSWORD@furnacelog-cluster.xxxxx.mongodb.net/furnacelog?retryWrites=true&w=majority
   ```

### Option B: MongoDB on Dokploy Server

1. **In Dokploy Dashboard**
   - Go to "Databases"
   - Click "Create Database"
   - Type: MongoDB
   - Name: `furnacelog-mongodb`
   - Version: 7 (latest)
   - Root password: Generate strong password
   - Click "Create"

2. **Get Connection String**
   ```
   mongodb://root:YOUR_PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin
   ```

---

## Part 2: Redis Setup (Dokploy)

1. **In Dokploy Dashboard**
   - Go to "Databases"
   - Click "Create Database"
   - Type: Redis
   - Name: `furnacelog-redis`
   - Version: 7-alpine
   - Password: Generate strong password (save this!)
   - Click "Create"

2. **Get Connection String**
   ```
   redis://:YOUR_PASSWORD@furnacelog-redis:6379
   ```

---

## Part 3: MinIO Setup (Dokploy)

1. **In Dokploy Dashboard**
   - Go to "Services" or "Applications"
   - Click "Create Application"
   - Type: Docker Compose
   - Name: `furnacelog-minio`

2. **Docker Compose Configuration**
   ```yaml
   version: '3.9'
   services:
     minio:
       image: minio/minio:latest
       ports:
         - "9000:9000"
         - "9001:9001"
       environment:
         MINIO_ROOT_USER: minioadmin
         MINIO_ROOT_PASSWORD: CHANGE_THIS_PASSWORD
       command: server /data --console-address ":9001"
       volumes:
         - minio-data:/data

   volumes:
     minio-data:
   ```

3. **Generate Strong MinIO Password**
   - Replace `CHANGE_THIS_PASSWORD` with a strong password
   - Click "Deploy"

---

## Part 4: Deploy FurnaceLog Backend

### Step 1: Create Backend Application

1. **In Dokploy Dashboard**
   - Go to "Applications"
   - Click "Create Application"
   - Type: Git Repository
   - Name: `furnacelog-backend`

2. **Git Configuration**
   - Repository URL: `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - Branch: `main`
   - Build Path: `backend`

3. **Build Configuration**
   - Build Type: Dockerfile
   - Dockerfile Path: `backend.Dockerfile`
   - Context: `.`

4. **Port Configuration**
   - Container Port: `3000`
   - Public Port: `3000` (or your preferred port)

### Step 2: Environment Variables

Click "Environment Variables" and add:

```env
# Server
NODE_ENV=production
PORT=3000

# MongoDB (Use your actual connection string from Part 1)
MONGODB_URI=mongodb+srv://furnacelog_admin:YOUR_PASSWORD@furnacelog-cluster.xxxxx.mongodb.net/furnacelog?retryWrites=true&w=majority

# Redis (Use your actual connection from Part 2)
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@furnacelog-redis:6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD

# MinIO (Use your actual MinIO password from Part 3)
MINIO_ENDPOINT=furnacelog-minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=YOUR_MINIO_PASSWORD
MINIO_BUCKET_DOCUMENTS=furnacelog-documents
MINIO_BUCKET_IMAGES=furnacelog-images
MINIO_BUCKET_AVATARS=furnacelog-avatars

# JWT Secrets (GENERATE NEW ONES!)
JWT_SECRET=YOUR_NEW_JWT_SECRET_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=YOUR_NEW_REFRESH_SECRET_HERE
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (Update with your actual domain)
FRONTEND_URL=https://furnacelog.yourdomain.com
CORS_ORIGIN=https://furnacelog.yourdomain.com

# Email (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@furnacelog.com
```

### Step 3: Generate JWT Secrets

Run these commands locally to generate secrets:
```bash
# JWT Secret
openssl rand -base64 32

# JWT Refresh Secret
openssl rand -base64 32
```

Copy the outputs and paste into environment variables above.

### Step 4: Deploy Backend

1. Click "Deploy"
2. Wait for build to complete
3. Check logs for any errors

---

## Part 5: Deploy FurnaceLog Frontend

### Step 1: Create Frontend Application

1. **In Dokploy Dashboard**
   - Go to "Applications"
   - Click "Create Application"
   - Type: Git Repository
   - Name: `furnacelog-frontend`

2. **Git Configuration**
   - Repository URL: `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - Branch: `main`
   - Build Path: `frontend`

3. **Build Configuration**
   - Build Type: Dockerfile
   - Dockerfile Path: `frontend.Dockerfile`
   - Context: `.`

4. **Port Configuration**
   - Container Port: `80`
   - Public Port: `80` (or `443` for HTTPS)

### Step 2: Environment Variables

```env
VITE_API_URL=https://api.furnacelog.yourdomain.com/api/v1
VITE_APP_NAME=FurnaceLog
VITE_ENV=production
```

**Important:** Replace `api.furnacelog.yourdomain.com` with your actual backend domain/URL.

### Step 3: Deploy Frontend

1. Click "Deploy"
2. Wait for build to complete
3. Check logs for any errors

---

## Part 6: Domain & SSL Configuration

### Backend Domain

1. **In Dokploy**
   - Go to your backend application
   - Click "Domains"
   - Add domain: `api.furnacelog.yourdomain.com`
   - Enable SSL (Let's Encrypt)

### Frontend Domain

1. **In Dokploy**
   - Go to your frontend application
   - Click "Domains"
   - Add domain: `furnacelog.yourdomain.com`
   - Enable SSL (Let's Encrypt)

### DNS Configuration

Add these DNS records at your domain registrar:

```
Type    Name    Value                           TTL
A       @       YOUR_DOKPLOY_SERVER_IP          300
A       api     YOUR_DOKPLOY_SERVER_IP          300
CNAME   www     furnacelog.yourdomain.com       300
```

---

## Part 7: Verification & Testing

### 1. Test Backend Health

```bash
curl https://api.furnacelog.yourdomain.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-02T...",
  "uptime": 123,
  "environment": "production"
}
```

### 2. Test User Registration

```bash
curl -X POST https://api.furnacelog.yourdomain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#"
  }'
```

Expected: 201 Created with user data and tokens

### 3. Test Frontend

1. Open: `https://furnacelog.yourdomain.com`
2. You should see the FurnaceLog homepage
3. Click "Register" and create an account
4. Login and verify dashboard loads

---

## Troubleshooting

### Backend Won't Start

**Check logs:**
```bash
# In Dokploy, go to backend app → Logs
```

**Common issues:**
- MongoDB connection failed → Check MONGODB_URI
- Redis connection failed → Check REDIS_URL
- Environment variables missing → Verify all required vars set

### Frontend Can't Connect to Backend

**Check:**
1. CORS_ORIGIN in backend matches frontend URL
2. VITE_API_URL in frontend is correct
3. Backend is actually running (check health endpoint)

### Database Connection Issues

**MongoDB Atlas:**
- Verify IP whitelist includes 0.0.0.0/0
- Check password has no special characters that need encoding
- Ensure username and password are correct

**Redis:**
- Verify password matches
- Check service name is correct (`furnacelog-redis`)

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Generate new JWT secrets (don't use the ones from .env.example)
- [ ] Update CORS_ORIGIN to your actual domain
- [ ] Enable HTTPS/SSL on all domains
- [ ] Set up MongoDB backups (Atlas does this automatically)
- [ ] Configure firewall rules if using Dokploy MongoDB
- [ ] Review environment variables for any hardcoded secrets
- [ ] Set up monitoring and alerts
- [ ] Configure log retention

---

## Monitoring & Maintenance

### Application Logs

Access logs in Dokploy:
1. Go to application
2. Click "Logs"
3. Real-time logs displayed

### Database Monitoring

**MongoDB Atlas:**
- Dashboard shows metrics, queries, performance
- Automatic backups configured

**Dokploy MongoDB:**
- Monitor via Dokploy metrics
- Set up manual backup schedule

### Health Checks

Set up uptime monitoring:
- Use services like UptimeRobot or Pingdom
- Monitor: `https://api.furnacelog.yourdomain.com/health`
- Alert on downtime

---

## Scaling Considerations

### Backend Scaling

If traffic increases:
1. Increase container resources in Dokploy
2. Consider horizontal scaling (multiple instances)
3. Add load balancer

### Database Scaling

**MongoDB Atlas:**
- Upgrade cluster tier (M10, M20, etc.)
- Enable sharding for large datasets

**Redis:**
- Increase memory allocation
- Consider Redis Cluster for high availability

---

## Backup Strategy

### MongoDB Atlas
- Automatic daily backups
- Point-in-time recovery available
- Download backups manually if needed

### Application Files (MinIO)
- Set up periodic backups of MinIO data
- Export to external storage (S3, Google Cloud Storage)

---

## Support

**FurnaceLog Repository:** https://github.com/charlesfaubert44-wq/furnacelog
**Dokploy Docs:** https://docs.dokploy.com
**MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

## Quick Reference

### Connection Strings Template

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/furnacelog

# Redis (Dokploy)
REDIS_URL=redis://:PASSWORD@furnacelog-redis:6379

# MinIO (Dokploy)
MINIO_ENDPOINT=furnacelog-minio
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=PASSWORD
```

### Generate Secrets

```bash
# JWT Secret
openssl rand -base64 32

# JWT Refresh Secret
openssl rand -base64 32

# Random password
openssl rand -base64 24
```

---

**Deployment Status:** Ready to Deploy
**Estimated Setup Time:** 30-45 minutes
**Difficulty:** Intermediate

Good luck with your deployment! 🚀
