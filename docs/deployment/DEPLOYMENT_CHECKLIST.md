# FurnaceLog Deployment Checklist

**Use this checklist to deploy FurnaceLog step by step**

---

## Pre-Deployment

- [ ] Code pushed to GitHub: ✅ **DONE** (https://github.com/charlesfaubert44-wq/furnacelog.git)
- [ ] Dokploy server is running and accessible
- [ ] You have admin access to Dokploy dashboard
- [ ] Domain name registered (optional but recommended)

---

## Step 1: MongoDB Setup

Choose ONE option:

### Option A: MongoDB Atlas (Recommended for production)

- [ ] Create MongoDB Atlas account at https://cloud.mongodb.com
- [ ] Create M0 Free Tier cluster
- [ ] Add database user: `furnacelog_admin` with strong password
- [ ] Configure network access: Allow 0.0.0.0/0
- [ ] Copy connection string:
  ```
  mongodb+srv://furnacelog_admin:PASSWORD@cluster.mongodb.net/furnacelog
  ```
- [ ] Save connection string securely

### Option B: Dokploy MongoDB

- [ ] In Dokploy: Databases → Create Database → MongoDB
- [ ] Name: `furnacelog-mongodb`, Version: 7
- [ ] Set root password (save it!)
- [ ] Note connection string:
  ```
  mongodb://root:PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin
  ```

**MongoDB Connection String:** _____________________

---

## Step 2: Redis Setup (Dokploy)

- [ ] In Dokploy: Databases → Create Database → Redis
- [ ] Name: `furnacelog-redis`, Version: 7-alpine
- [ ] Set password (save it!)
- [ ] Note connection string:
  ```
  redis://:PASSWORD@furnacelog-redis:6379
  ```

**Redis Password:** _____________________

---

## Step 3: MinIO Setup (Dokploy)

- [ ] In Dokploy: Applications → Create Application → Docker Compose
- [ ] Name: `furnacelog-minio`
- [ ] Use this docker-compose.yml:
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
        MINIO_ROOT_PASSWORD: YOUR_STRONG_PASSWORD_HERE
      command: server /data --console-address ":9001"
      volumes:
        - minio-data:/data
  volumes:
    minio-data:
  ```
- [ ] Replace `YOUR_STRONG_PASSWORD_HERE` with strong password
- [ ] Deploy MinIO

**MinIO Password:** _____________________

---

## Step 4: Generate JWT Secrets

Run these commands on your local machine:

```bash
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

- [ ] Generate JWT_SECRET
- [ ] Generate JWT_REFRESH_SECRET

**JWT_SECRET:** _____________________
**JWT_REFRESH_SECRET:** _____________________

---

## Step 5: Deploy Backend

- [ ] In Dokploy: Applications → Create Application
- [ ] Name: `furnacelog-backend`
- [ ] Type: Git Repository
- [ ] Repository: `https://github.com/charlesfaubert44-wq/furnacelog.git`
- [ ] Branch: `main`
- [ ] Build Path: `backend`
- [ ] Dockerfile: `backend.Dockerfile`
- [ ] Container Port: `3000`
- [ ] Add environment variables (see below)
- [ ] Click Deploy
- [ ] Wait for build to complete (check logs)

### Backend Environment Variables

Copy and fill in:

```env
NODE_ENV=production
PORT=3000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING_HERE

REDIS_URL=YOUR_REDIS_CONNECTION_STRING_HERE
REDIS_PASSWORD=YOUR_REDIS_PASSWORD_HERE

MINIO_ENDPOINT=furnacelog-minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=YOUR_MINIO_PASSWORD_HERE
MINIO_BUCKET_DOCUMENTS=furnacelog-documents
MINIO_BUCKET_IMAGES=furnacelog-images
MINIO_BUCKET_AVATARS=furnacelog-avatars

JWT_SECRET=YOUR_JWT_SECRET_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET_HERE
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

**Note:** Update FRONTEND_URL and CORS_ORIGIN after frontend is deployed with actual domain.

---

## Step 6: Test Backend

- [ ] Check backend logs in Dokploy (should see "FurnaceLog API Server Running")
- [ ] Get backend URL from Dokploy (e.g., http://YOUR_IP:3000)
- [ ] Test health endpoint:
  ```bash
  curl http://YOUR_BACKEND_URL/health
  ```
- [ ] Should return JSON with "status": "healthy"

**Backend URL:** _____________________

---

## Step 7: Deploy Frontend

- [ ] In Dokploy: Applications → Create Application
- [ ] Name: `furnacelog-frontend`
- [ ] Type: Git Repository
- [ ] Repository: `https://github.com/charlesfaubert44-wq/furnacelog.git`
- [ ] Branch: `main`
- [ ] Build Path: `frontend`
- [ ] Dockerfile: `frontend.Dockerfile`
- [ ] Container Port: `80`
- [ ] Add environment variables (see below)
- [ ] Click Deploy
- [ ] Wait for build to complete (check logs)

### Frontend Environment Variables

```env
VITE_API_URL=http://YOUR_BACKEND_URL/api/v1
VITE_APP_NAME=FurnaceLog
VITE_ENV=production
```

Replace `YOUR_BACKEND_URL` with actual backend URL from Step 6.

---

## Step 8: Test Frontend

- [ ] Get frontend URL from Dokploy (e.g., http://YOUR_IP:80)
- [ ] Open frontend URL in browser
- [ ] Should see FurnaceLog homepage
- [ ] Try to register a new account
- [ ] Try to login
- [ ] Check if dashboard loads

**Frontend URL:** _____________________

---

## Step 9: Configure Domains (Optional but Recommended)

### Backend Domain

- [ ] In Dokploy → Backend App → Domains
- [ ] Add domain: `api.furnacelog.yourdomain.com`
- [ ] Enable SSL (Let's Encrypt)

### Frontend Domain

- [ ] In Dokploy → Frontend App → Domains
- [ ] Add domain: `furnacelog.yourdomain.com`
- [ ] Enable SSL (Let's Encrypt)

### DNS Configuration

Add these records at your domain registrar:

- [ ] A Record: `@` → Your Dokploy server IP
- [ ] A Record: `api` → Your Dokploy server IP
- [ ] CNAME Record: `www` → `furnacelog.yourdomain.com`

### Update Environment Variables

- [ ] Update backend FRONTEND_URL to `https://furnacelog.yourdomain.com`
- [ ] Update backend CORS_ORIGIN to `https://furnacelog.yourdomain.com`
- [ ] Update frontend VITE_API_URL to `https://api.furnacelog.yourdomain.com/api/v1`
- [ ] Redeploy both applications

---

## Step 10: Final Verification

- [ ] Test backend health: `https://api.furnacelog.yourdomain.com/health`
- [ ] Test user registration via frontend
- [ ] Test user login
- [ ] Create a test home profile
- [ ] Add a test system
- [ ] Schedule test maintenance task
- [ ] Verify all features working

---

## Post-Deployment

### Security

- [ ] All passwords are strong and unique
- [ ] JWT secrets are random and secure
- [ ] HTTPS/SSL enabled on all domains
- [ ] CORS properly configured
- [ ] MongoDB network access configured

### Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor backend health endpoint
- [ ] Check application logs regularly
- [ ] Set up error alerts

### Backups

- [ ] MongoDB backups enabled (automatic in Atlas)
- [ ] Plan MinIO backup strategy
- [ ] Document backup recovery process

---

## Troubleshooting

### Backend won't start
- Check Dokploy logs for errors
- Verify MongoDB connection string
- Verify Redis connection
- Check all environment variables are set

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS_ORIGIN in backend matches frontend domain
- Test backend health endpoint directly

### Database connection failed
- MongoDB Atlas: Check IP whitelist (should include 0.0.0.0/0)
- Check username and password are correct
- Verify connection string format

---

## Success Criteria

- ✅ Backend running and responding to health checks
- ✅ Frontend loads in browser
- ✅ Users can register and login
- ✅ Dashboard displays correctly
- ✅ All API endpoints working
- ✅ HTTPS enabled (if using domains)
- ✅ No errors in logs

---

## Next Steps After Deployment

1. Create your first home profile
2. Add your heating system
3. Set up maintenance tasks
4. Configure seasonal checklists
5. Invite other users (if multi-user)
6. Set up email notifications (optional)

---

**Deployment Time Estimate:** 30-45 minutes
**Difficulty:** Intermediate
**Support:** Check DOKPLOY_SETUP_GUIDE.md for detailed instructions

🎉 **Ready to Deploy!**
