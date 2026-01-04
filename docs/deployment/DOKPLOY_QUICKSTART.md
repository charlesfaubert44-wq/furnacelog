# FurnaceLog Dokploy Quick Start
**Deploy FurnaceLog with MongoDB on Dokploy - 30 Minutes**

---

## Overview

This guide deploys the complete FurnaceLog stack on Dokploy:
- ✅ MongoDB (database)
- ✅ Redis (sessions/cache)
- ✅ MinIO (file storage)
- ✅ Backend API
- ✅ Frontend App

**Repository:** https://github.com/charlesfaubert44-wq/furnacelog.git

---

## Prerequisites

- Dokploy server running and accessible
- Admin access to Dokploy dashboard
- 15-30 minutes of time

---

## Step 1: Create MongoDB Database (5 minutes)

1. **Login to Dokploy Dashboard**

2. **Navigate to Databases**
   - Click "Databases" in the sidebar

3. **Create MongoDB**
   - Click "Create Database"
   - **Type:** MongoDB
   - **Name:** `furnacelog-mongodb`
   - **Version:** `7` (or latest)
   - **Root Username:** `root` (default)
   - **Root Password:** Generate strong password
     ```bash
     # Example: Use this to generate a password
     openssl rand -base64 24
     ```
   - **Port:** 27017 (default)
   - Click "Create"

4. **Save Your Credentials**
   ```
   MongoDB Root Password: ___________________________
   ```

5. **Note the Connection Details**
   - Internal hostname: `furnacelog-mongodb`
   - Port: `27017`
   - Database name: `furnacelog`
   - Connection string:
     ```
     mongodb://root:YOUR_PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin
     ```

---

## Step 2: Create Redis Database (3 minutes)

1. **In Dokploy Dashboard → Databases**

2. **Create Redis**
   - Click "Create Database"
   - **Type:** Redis
   - **Name:** `furnacelog-redis`
   - **Version:** `7-alpine` (or latest)
   - **Password:** Generate strong password
     ```bash
     openssl rand -base64 24
     ```
   - Click "Create"

3. **Save Your Credentials**
   ```
   Redis Password: ___________________________
   ```

4. **Note the Connection Details**
   - Internal hostname: `furnacelog-redis`
   - Port: `6379`
   - Connection string:
     ```
     redis://:YOUR_PASSWORD@furnacelog-redis:6379
     ```

---

## Step 3: Create MinIO Storage (5 minutes)

1. **In Dokploy Dashboard → Applications**

2. **Create Application**
   - Click "Create Application"
   - **Type:** Docker Compose
   - **Name:** `furnacelog-minio`

3. **Docker Compose Configuration**

   Paste this configuration:
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
         MINIO_ROOT_PASSWORD: REPLACE_WITH_STRONG_PASSWORD
       command: server /data --console-address ":9001"
       volumes:
         - minio-data:/data
       restart: unless-stopped

   volumes:
     minio-data:
       driver: local
   ```

4. **Update Configuration**
   - Replace `REPLACE_WITH_STRONG_PASSWORD` with a strong password
     ```bash
     openssl rand -base64 24
     ```

5. **Save Credentials**
   ```
   MinIO Root User: minioadmin
   MinIO Root Password: ___________________________
   ```

6. **Deploy MinIO**
   - Click "Deploy"
   - Wait for deployment to complete (~30 seconds)

---

## Step 4: Generate JWT Secrets (2 minutes)

**Run these commands on your local machine:**

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate JWT Refresh Secret
openssl rand -base64 32
```

**Save the outputs:**
```
JWT_SECRET: ___________________________
JWT_REFRESH_SECRET: ___________________________
```

---

## Step 5: Deploy Backend API (10 minutes)

1. **In Dokploy Dashboard → Applications**

2. **Create Application**
   - Click "Create Application"
   - **Type:** Git Repository
   - **Name:** `furnacelog-backend`

3. **Git Configuration**
   - **Repository URL:** `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - **Branch:** `main`
   - **Build Path:** `backend`

4. **Build Settings**
   - **Build Type:** Dockerfile
   - **Dockerfile Path:** `backend.Dockerfile`
   - **Context Path:** `.`

5. **Port Configuration**
   - **Container Port:** `3000`
   - **Publish Port:** `3000` (or your preferred external port)

6. **Environment Variables**

   Click "Environment Variables" and add these (fill in your values from Steps 1-4):

   ```env
   # Server
   NODE_ENV=production
   PORT=3000

   # MongoDB - Use YOUR password from Step 1
   MONGODB_URI=mongodb://root:YOUR_MONGODB_PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin

   # Redis - Use YOUR password from Step 2
   REDIS_URL=redis://:YOUR_REDIS_PASSWORD@furnacelog-redis:6379
   REDIS_PASSWORD=YOUR_REDIS_PASSWORD

   # MinIO - Use YOUR password from Step 3
   MINIO_ENDPOINT=furnacelog-minio
   MINIO_PORT=9000
   MINIO_USE_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=YOUR_MINIO_PASSWORD
   MINIO_BUCKET_DOCUMENTS=furnacelog-documents
   MINIO_BUCKET_IMAGES=furnacelog-images
   MINIO_BUCKET_AVATARS=furnacelog-avatars

   # JWT - Use YOUR secrets from Step 4
   JWT_SECRET=YOUR_JWT_SECRET_HERE
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET_HERE
   JWT_REFRESH_EXPIRES_IN=7d

   # Frontend (update after frontend deployment)
   FRONTEND_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173

   # Email (optional - leave as is for now)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=true
   SMTP_USER=
   SMTP_PASSWORD=
   SMTP_FROM=noreply@furnacelog.com
   ```

7. **Deploy Backend**
   - Click "Deploy"
   - Wait for build (~3-5 minutes)
   - Monitor logs for "FurnaceLog API Server Running"

8. **Get Backend URL**
   - Note the URL (e.g., `http://YOUR_IP:3000`)
   ```
   Backend URL: ___________________________
   ```

9. **Test Backend**
   ```bash
   curl http://YOUR_BACKEND_URL/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "...",
     "uptime": 123,
     "environment": "production"
   }
   ```

---

## Step 6: Deploy Frontend App (10 minutes)

1. **In Dokploy Dashboard → Applications**

2. **Create Application**
   - Click "Create Application"
   - **Type:** Git Repository
   - **Name:** `furnacelog-frontend`

3. **Git Configuration**
   - **Repository URL:** `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - **Branch:** `main`
   - **Build Path:** `frontend`

4. **Build Settings**
   - **Build Type:** Dockerfile
   - **Dockerfile Path:** `frontend.Dockerfile`
   - **Context Path:** `.`

5. **Port Configuration**
   - **Container Port:** `80`
   - **Publish Port:** `80` (or `8080` if 80 is taken)

6. **Environment Variables**

   Use your Backend URL from Step 5:

   ```env
   VITE_API_URL=http://YOUR_BACKEND_URL/api/v1
   VITE_APP_NAME=FurnaceLog
   VITE_ENV=production
   ```

   **Example:**
   ```env
   VITE_API_URL=http://192.168.1.100:3000/api/v1
   VITE_APP_NAME=FurnaceLog
   VITE_ENV=production
   ```

7. **Deploy Frontend**
   - Click "Deploy"
   - Wait for build (~3-5 minutes)
   - Monitor logs for successful build

8. **Get Frontend URL**
   - Note the URL (e.g., `http://YOUR_IP:80`)
   ```
   Frontend URL: ___________________________
   ```

---

## Step 7: Update CORS Settings (5 minutes)

Now that frontend is deployed, update backend environment variables:

1. **Go to Backend Application in Dokploy**

2. **Edit Environment Variables**
   - Update `FRONTEND_URL` to your frontend URL
   - Update `CORS_ORIGIN` to your frontend URL

   **Example:**
   ```env
   FRONTEND_URL=http://192.168.1.100:80
   CORS_ORIGIN=http://192.168.1.100:80
   ```

3. **Redeploy Backend**
   - Click "Redeploy" or "Restart"
   - Wait for restart (~30 seconds)

---

## Step 8: Test Full Application (5 minutes)

### 1. Test Backend Health

```bash
curl http://YOUR_BACKEND_URL/health
```

Should return: `{"status": "healthy", ...}`

### 2. Test User Registration

```bash
curl -X POST http://YOUR_BACKEND_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#"
  }'
```

Should return: 201 Created with user data and tokens

### 3. Test Frontend

1. Open frontend URL in browser: `http://YOUR_FRONTEND_URL`
2. Click "Register" in top right
3. Create a new account
4. Login with your credentials
5. Verify dashboard loads

### 4. Test Features

- ✅ Create a home profile
- ✅ Add a system (e.g., furnace)
- ✅ Schedule maintenance task
- ✅ View dashboard widgets

---

## Deployment Complete! 🎉

### Your FurnaceLog Deployment

```
Backend API:  http://YOUR_BACKEND_URL
Frontend:     http://YOUR_FRONTEND_URL
MongoDB:      furnacelog-mongodb:27017
Redis:        furnacelog-redis:6379
MinIO:        furnacelog-minio:9000
MinIO Console: http://YOUR_IP:9001
```

### Services Running

- ✅ MongoDB (database)
- ✅ Redis (sessions)
- ✅ MinIO (file storage)
- ✅ Backend API
- ✅ Frontend App

---

## Optional: Add Custom Domains

### If you have a domain:

1. **Point DNS to your Dokploy server**
   ```
   A Record: api.yourdomain.com → YOUR_SERVER_IP
   A Record: app.yourdomain.com → YOUR_SERVER_IP
   ```

2. **Configure Backend Domain**
   - Dokploy → Backend App → Domains
   - Add: `api.yourdomain.com`
   - Enable SSL (Let's Encrypt)

3. **Configure Frontend Domain**
   - Dokploy → Frontend App → Domains
   - Add: `app.yourdomain.com`
   - Enable SSL (Let's Encrypt)

4. **Update Environment Variables**
   - Backend: Update `FRONTEND_URL` and `CORS_ORIGIN` to `https://app.yourdomain.com`
   - Frontend: Update `VITE_API_URL` to `https://api.yourdomain.com/api/v1`
   - Redeploy both apps

---

## Troubleshooting

### Backend won't start

**Check logs in Dokploy:**
- Common issue: MongoDB connection failed
- Solution: Verify MONGODB_URI password is correct
- Verify service name is `furnacelog-mongodb`

### Frontend can't connect to backend

**Check:**
1. VITE_API_URL is correct (include /api/v1)
2. CORS_ORIGIN in backend matches frontend URL exactly
3. Backend is running (check health endpoint)

### Database connection error

**MongoDB:**
```bash
# Test connection from backend container
mongosh "mongodb://root:PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin"
```

**Redis:**
```bash
# Test connection
redis-cli -h furnacelog-redis -p 6379 -a PASSWORD ping
```

### MinIO not working

**Check:**
- MinIO is running (check Dokploy logs)
- Port 9000 is accessible
- Credentials are correct

---

## Accessing MinIO Console

To manage files directly:

1. Open: `http://YOUR_IP:9001`
2. Login:
   - Username: `minioadmin`
   - Password: Your MinIO password from Step 3
3. Buckets will be created automatically by the backend

---

## Maintenance

### View Logs

**In Dokploy:**
- Go to each application
- Click "Logs"
- Real-time logs displayed

### Restart Services

**To restart any service:**
- Go to application in Dokploy
- Click "Restart"

### Update Application

**To deploy latest code:**
1. Push changes to GitHub
2. In Dokploy → Application
3. Click "Redeploy"
4. Latest code will be pulled and rebuilt

---

## Security Checklist

Before going live:

- [ ] All passwords are strong and unique
- [ ] JWT secrets are random (32+ characters)
- [ ] MongoDB only accessible from Dokploy network
- [ ] Redis only accessible from Dokploy network
- [ ] CORS properly configured
- [ ] HTTPS enabled (if using domains)
- [ ] Regular backups configured

---

## Backup Strategy

### MongoDB Backups

**Option 1: Manual backup**
```bash
# From Dokploy server
docker exec furnacelog-mongodb mongodump \
  --uri="mongodb://root:PASSWORD@localhost:27017/furnacelog?authSource=admin" \
  --out=/backup
```

**Option 2: Automated backups**
- Set up cron job on Dokploy server
- Export to external storage

### Application Backups

- Code is in GitHub (already backed up)
- Environment variables documented
- Configuration files saved

---

## Next Steps

1. **Configure Email (Optional)**
   - Update SMTP settings in backend env vars
   - Enable password reset emails
   - Enable warranty expiration emails

2. **Customize Settings**
   - Update company/user information
   - Configure maintenance task library
   - Set up seasonal checklists

3. **Invite Users**
   - Share registration link
   - Create accounts for team members

4. **Start Tracking**
   - Add your homes
   - Configure systems
   - Schedule maintenance

---

## Support Resources

- **Deployment Issues:** Check DOKPLOY_SETUP_GUIDE.md
- **Application Issues:** Check PRODUCTION_READINESS_REPORT.md
- **API Reference:** Check API_EXAMPLES.md
- **GitHub:** https://github.com/charlesfaubert44-wq/furnacelog

---

## Quick Reference

### Service URLs
```
Backend Health:   http://YOUR_IP:3000/health
Frontend:         http://YOUR_IP:80
MinIO Console:    http://YOUR_IP:9001
```

### Connection Strings
```
MongoDB:  mongodb://root:PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin
Redis:    redis://:PASSWORD@furnacelog-redis:6379
MinIO:    furnacelog-minio:9000
```

### Generate Secrets
```bash
# Password (24 chars)
openssl rand -base64 24

# JWT Secret (32 chars)
openssl rand -base64 32
```

---

**Deployment Time:** ~30 minutes
**Difficulty:** Easy to Intermediate
**Status:** Production Ready ✅

🏠 **Welcome to FurnaceLog - Northern Home Maintenance Tracking!** ❄️
