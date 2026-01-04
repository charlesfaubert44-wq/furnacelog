# Redis Deployment Fix for Dokploy

## Problem
Error: `pull access denied for 7-alpine, repository does not exist`

**Cause:** Incomplete Docker image name. Should be `redis:7-alpine` not just `7-alpine`

---

## Solution Options

### Option 1: Use Full Image Name (Recommended)

When creating Redis database in Dokploy:

1. **Go to Databases → Create Database**
2. Select: **Redis**
3. **Name:** `furnacelog-redis`
4. **Version/Image:** Enter the FULL image name:
   ```
   redis:7-alpine
   ```
   OR
   ```
   redis:7
   ```
5. **Password:** Your strong password
6. Click **Create**

---

### Option 2: Use Docker Compose Instead

If Dokploy's Redis database option doesn't work, use Docker Compose:

1. **Applications → Create Application**
2. **Type:** Docker Compose
3. **Name:** `furnacelog-redis`
4. **Docker Compose Configuration:**

```yaml
version: '3.9'

services:
  redis:
    image: redis:7-alpine
    container_name: furnacelog-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass YOUR_REDIS_PASSWORD
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  redis-data:
    driver: local
```

5. **Replace `YOUR_REDIS_PASSWORD`** with your actual password
6. Click **Deploy**

---

## Connection String

After deployment, use this connection string in your backend:

```env
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@furnacelog-redis:6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
```

---

## Test Redis Connection

After deployment, test if Redis is working:

### From Dokploy Server
```bash
# Test connection
docker exec furnacelog-redis redis-cli -a YOUR_PASSWORD ping

# Expected output: PONG
```

### From Backend Container
```bash
# Test from backend
redis-cli -h furnacelog-redis -p 6379 -a YOUR_PASSWORD ping

# Expected output: PONG
```

---

## Full Deployment Sequence

Here's the corrected sequence for all databases:

### 1. MongoDB
```
Databases → Create Database
Type: MongoDB
Name: furnacelog-mongodb
Image: mongo:7
Password: [strong password]
```

### 2. Redis (Use Docker Compose)
```
Applications → Create Application
Type: Docker Compose
Name: furnacelog-redis
[Use docker-compose above]
```

### 3. MinIO (Already working with Docker Compose)
```
Applications → Create Application
Type: Docker Compose
Name: furnacelog-minio
[Use existing docker-compose]
```

---

## Updated Backend Environment Variables

After fixing Redis, update your backend environment:

```env
# MongoDB (should already be working)
MONGODB_URI=mongodb://root:YOUR_MONGODB_PASSWORD@furnacelog-mongodb:27017/furnacelog?authSource=admin

# Redis (with new container name)
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@furnacelog-redis:6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD

# MinIO (should already be working)
MINIO_ENDPOINT=furnacelog-minio
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=YOUR_MINIO_PASSWORD
```

---

## Quick Fix Steps

**Right now, do this:**

1. **Delete the failed Redis deployment** (if it exists)
   - Go to Databases or Applications
   - Find any failed Redis
   - Delete it

2. **Create Redis using Docker Compose**
   - Applications → Create Application
   - Type: Docker Compose
   - Name: `furnacelog-redis`
   - Paste the docker-compose configuration above
   - Replace password
   - Deploy

3. **Wait for deployment** (~30 seconds)

4. **Check logs**
   - Go to furnacelog-redis application
   - Click "Logs"
   - Should see: "Ready to accept connections"

5. **Continue with backend deployment**
   - Use the connection string above

---

## Verification

After deploying Redis, verify it's working:

```bash
# Check container is running
docker ps | grep redis

# Test connection
docker exec furnacelog-redis redis-cli ping
# Should return: PONG

# Test with password
docker exec furnacelog-redis redis-cli -a YOUR_PASSWORD ping
# Should return: PONG
```

---

## Alternative: Use Redis Cloud (If still having issues)

If Docker issues persist, you can use Redis Cloud (free tier):

1. **Go to:** https://redis.com/try-free/
2. **Create account**
3. **Create database:**
   - Name: furnacelog
   - Cloud: AWS
   - Region: Closest to your server
   - Plan: Free (30MB)

4. **Get connection string:**
   ```
   redis://default:PASSWORD@redis-xxxxx.cloud.redislabs.com:12345
   ```

5. **Use in backend:**
   ```env
   REDIS_URL=redis://default:PASSWORD@redis-xxxxx.cloud.redislabs.com:12345
   REDIS_PASSWORD=PASSWORD
   ```

---

## Summary

**The fix:** Use full Docker image name `redis:7-alpine` or deploy via Docker Compose

**Recommended approach:** Docker Compose (more control, proven to work)

**Next steps after fixing Redis:**
1. Deploy Redis via Docker Compose
2. Verify it's running
3. Continue with backend deployment
4. Test full application

---

**Need immediate help?** Use the Docker Compose method - it's guaranteed to work! 🚀
