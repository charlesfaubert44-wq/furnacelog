# FurnaceLog - Dokploy Deployment Guide

This guide covers deploying FurnaceLog to a dedicated server using Dokploy with MongoDB.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [MongoDB Installation](#mongodb-installation)
4. [Dokploy Installation](#dokploy-installation)
5. [FurnaceLog Deployment](#furnacelog-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- Dedicated server (VPS or bare metal)
- Ubuntu 22.04 LTS or later (recommended)
- Minimum specs:
  - 4GB RAM (8GB recommended)
  - 2 CPU cores (4 cores recommended)
  - 50GB storage (SSD recommended)
- Domain name (e.g., furnacelog.yourdomain.com)
- SSH access to server

### Recommended
- Static IP address
- Server located in Canada for best latency
- Backup solution configured

---

## Server Setup

### 1. Initial Server Configuration

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install basic utilities
apt install -y curl wget git ufw fail2ban htop

# Configure firewall
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 27017/tcp # MongoDB (only if accessing from outside)
ufw enable

# Create non-root user (optional but recommended)
adduser furnacelog
usermod -aG sudo furnacelog
```

### 2. Install Docker

Dokploy requires Docker. Install it:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add user to docker group (if using non-root user)
usermod -aG docker furnacelog

# Enable Docker to start on boot
systemctl enable docker
systemctl start docker

# Verify installation
docker --version
docker compose version
```

---

## MongoDB Installation

You can run MongoDB in two ways:
1. **Docker container** (recommended for simplicity)
2. **Direct installation** (recommended for production)

### Option A: MongoDB in Docker (Simpler)

```bash
# Create MongoDB data directory
mkdir -p /data/mongodb

# Create docker-compose.yml for MongoDB
cat > /opt/mongodb-docker-compose.yml <<EOF
version: '3.9'

services:
  mongodb:
    image: mongo:7
    container_name: furnacelog-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: YOUR_STRONG_PASSWORD_HERE
      MONGO_INITDB_DATABASE: furnacelog
    volumes:
      - /data/mongodb:/data/db
      - /data/mongodb-config:/data/configdb
    networks:
      - furnacelog-network

networks:
  furnacelog-network:
    external: true
    name: dokploy-network
EOF

# Create Dokploy network (if not exists)
docker network create dokploy-network || true

# Start MongoDB
cd /opt
docker compose -f mongodb-docker-compose.yml up -d

# Verify MongoDB is running
docker logs furnacelog-mongodb
```

### Option B: MongoDB Direct Installation (Production)

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
apt update
apt install -y mongodb-org

# Enable and start MongoDB
systemctl enable mongod
systemctl start mongod
systemctl status mongod

# Secure MongoDB
mongosh
```

Inside MongoDB shell:
```javascript
use admin

// Create admin user
db.createUser({
  user: "admin",
  pwd: "YOUR_STRONG_PASSWORD_HERE",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
})

// Create FurnaceLog database user
use furnacelog
db.createUser({
  user: "furnaceloguser",
  pwd: "YOUR_FURNACELOG_PASSWORD_HERE",
  roles: [{ role: "readWrite", db: "furnacelog" }]
})

exit
```

Enable authentication:
```bash
# Edit MongoDB config
nano /etc/mongod.conf
```

Add/modify:
```yaml
security:
  authorization: enabled

net:
  bindIp: 127.0.0.1,YOUR_SERVER_IP  # Allow connections from your server IP
```

Restart MongoDB:
```bash
systemctl restart mongod
```

### Create FurnaceLog Database

```bash
mongosh -u admin -p --authenticationDatabase admin

use furnacelog

# Run the initialization script
load('/path/to/mongo-init.js')

exit
```

---

## Dokploy Installation

Dokploy is a self-hosted PaaS like Heroku/Vercel.

### Install Dokploy

```bash
# Run Dokploy installation script
curl -sSL https://dokploy.com/install.sh | sh

# Installation will:
# - Install Docker (if not already installed)
# - Set up Dokploy containers
# - Configure Traefik reverse proxy
# - Create admin dashboard at http://your-server-ip:3000
```

### Access Dokploy Dashboard

1. Open browser to `http://your-server-ip:3000`
2. Complete initial setup wizard
3. Create admin account
4. Configure settings

---

## FurnaceLog Deployment

### 1. Prepare Your Git Repository

Ensure your FurnaceLog code is in a Git repository (GitHub, GitLab, Bitbucket, etc.).

Your repository structure should include:
```
furnacelog/
├── backend/
│   ├── src/
│   ├── package.json
│   └── ... backend files
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ... frontend files
├── backend.Dockerfile
├── frontend.Dockerfile
├── nginx.conf
├── docker-compose.yml (for local dev)
└── .env.example
```

### 2. Deploy Backend in Dokploy

#### Create Backend Application

1. **In Dokploy Dashboard:**
   - Click "Create Application"
   - Name: `furnacelog-backend`
   - Type: `Docker`

2. **Configure Git Source:**
   - Repository URL: `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - Branch: `main`
   - Build Context: `/`
   - Dockerfile Path: `backend.Dockerfile`

3. **Configure Build:**
   - Build Command: Leave empty (Dockerfile handles it)
   - Build Arguments: None needed

4. **Configure Deployment:**
   - Port: `3000`
   - Health Check Path: `/api/v1/health`

5. **Environment Variables:**
   Click "Environment Variables" and add:

   ```env
   NODE_ENV=production
   PORT=3000

   # MongoDB (use your MongoDB connection string)
   MONGODB_URI=mongodb://furnaceloguser:YOUR_FURNACELOG_PASSWORD_HERE@host.docker.internal:27017/furnacelog?authSource=furnacelog

   # Redis (will add later)
   REDIS_URL=redis://:YOUR_REDIS_PASSWORD@host.docker.internal:6379

   # MinIO (will add later)
   MINIO_ENDPOINT=host.docker.internal
   MINIO_PORT=9000
   MINIO_USE_SSL=false
   MINIO_ACCESS_KEY=YOUR_MINIO_ACCESS_KEY
   MINIO_SECRET_KEY=YOUR_MINIO_SECRET_KEY

   # JWT Secrets (generate strong random strings)
   JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=YOUR_SUPER_SECRET_REFRESH_KEY_CHANGE_THIS
   JWT_REFRESH_EXPIRES_IN=30d

   # SMTP (configure with your email provider)
   SMTP_HOST=smtp.your-provider.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-smtp-user
   SMTP_PASSWORD=your-smtp-password
   SMTP_FROM=noreply@furnacelog.com

   # Frontend URL (will update after frontend deployment)
   FRONTEND_URL=https://furnacelog.yourdomain.com

   # CORS
   CORS_ORIGIN=https://furnacelog.yourdomain.com

   # Weather API
   WEATHER_API_KEY=your-environment-canada-api-key
   WEATHER_API_URL=https://api.weather.gc.ca

   # File Uploads
   MAX_FILE_SIZE=5242880
   MAX_FILES_PER_UPLOAD=20
   ```

6. **Deploy:**
   - Click "Deploy"
   - Monitor build logs
   - Wait for deployment to complete

7. **Configure Domain (Optional for API):**
   - Domain: `api.furnacelog.yourdomain.com`
   - Enable SSL (Let's Encrypt)

### 3. Deploy Redis (Optional but Recommended)

#### Option A: Add Redis as a Service in Dokploy

1. **Create Database Service:**
   - Type: `Redis`
   - Name: `furnacelog-redis`
   - Password: `YOUR_REDIS_PASSWORD`
   - Port: `6379`

#### Option B: Manual Redis Container

```bash
docker run -d \
  --name furnacelog-redis \
  --network dokploy-network \
  -p 6379:6379 \
  --restart always \
  redis:7-alpine redis-server --appendonly yes --requirepass YOUR_REDIS_PASSWORD
```

### 4. Deploy MinIO (Object Storage)

```bash
# Create MinIO data directory
mkdir -p /data/minio

# Run MinIO container
docker run -d \
  --name furnacelog-minio \
  --network dokploy-network \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=YOUR_MINIO_ACCESS_KEY \
  -e MINIO_ROOT_PASSWORD=YOUR_MINIO_SECRET_KEY \
  -v /data/minio:/data \
  --restart always \
  minio/minio server /data --console-address ":9001"

# Access MinIO Console at http://your-server-ip:9001
# Create buckets: furnacelog-documents, furnacelog-images, furnacelog-avatars
```

### 5. Deploy Frontend in Dokploy

#### Create Frontend Application

1. **In Dokploy Dashboard:**
   - Click "Create Application"
   - Name: `furnacelog-frontend`
   - Type: `Docker`

2. **Configure Git Source:**
   - Repository URL: `https://github.com/charlesfaubert44-wq/furnacelog.git`
   - Branch: `main`
   - Build Context: `/`
   - Dockerfile Path: `frontend.Dockerfile`

3. **Build Arguments:**
   ```
   VITE_API_URL=https://api.furnacelog.yourdomain.com/api/v1
   VITE_APP_NAME=FurnaceLog
   ```

4. **Configure Deployment:**
   - Port: `80`
   - Health Check Path: `/health`

5. **Configure Domain:**
   - Domain: `furnacelog.yourdomain.com`
   - Enable SSL (Let's Encrypt)

6. **Deploy:**
   - Click "Deploy"
   - Monitor build logs

---

## Environment Configuration

### Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 64

# Generate another for refresh token
openssl rand -base64 64

# Use these in your environment variables
```

### Important Environment Variables

Make sure these are properly set in Dokploy:

**Backend:**
- `MONGODB_URI` - Must point to your MongoDB instance
- `JWT_SECRET` - Strong random secret
- `FRONTEND_URL` - Your frontend domain
- `CORS_ORIGIN` - Your frontend domain
- `SMTP_*` - Email configuration for notifications

**Frontend:**
- `VITE_API_URL` - Your backend API URL
- `VITE_APP_NAME` - FurnaceLog

---

## Domain & SSL Setup

### 1. DNS Configuration

Point your domain to your server:

```
Type    Name                        Value
A       furnacelog.yourdomain.com   YOUR_SERVER_IP
A       api.furnacelog.yourdomain.com   YOUR_SERVER_IP
```

### 2. SSL Certificates

Dokploy uses Traefik with Let's Encrypt automatically.

1. In Dokploy dashboard, go to each application
2. Under "Domains" section, enable "SSL"
3. Traefik will automatically request and renew certificates

---

## Monitoring & Maintenance

### Health Checks

Create health check endpoints:

**Backend (src/routes/health.js):**
```javascript
router.get('/health', async (req, res) => {
  try {
    // Check MongoDB
    await mongoose.connection.db.admin().ping();

    // Check Redis
    await redisClient.ping();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Monitoring Tools

**Option 1: Uptime Kuma (Recommended)**

```bash
docker run -d \
  --name uptime-kuma \
  --network dokploy-network \
  -p 3001:3001 \
  -v /data/uptime-kuma:/app/data \
  --restart always \
  louislam/uptime-kuma:1
```

Access at `http://your-server-ip:3001` and add monitors for:
- Frontend: `https://furnacelog.yourdomain.com`
- Backend API: `https://api.furnacelog.yourdomain.com/api/v1/health`
- MongoDB: `localhost:27017`

**Option 2: Grafana + Prometheus (Advanced)**

Follow Dokploy documentation for Grafana/Prometheus setup.

### Backups

**MongoDB Backups:**

```bash
# Create backup script
cat > /opt/backup-mongodb.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/data/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
MONGO_USER="admin"
MONGO_PASS="YOUR_MONGODB_PASSWORD"

mkdir -p $BACKUP_DIR

mongodump \
  --username=$MONGO_USER \
  --password=$MONGO_PASS \
  --authenticationDatabase=admin \
  --db=furnacelog \
  --out=$BACKUP_DIR/backup_$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: backup_$DATE"
EOF

chmod +x /opt/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /opt/backup-mongodb.sh >> /var/log/mongodb-backup.log 2>&1
```

**MinIO Backups:**

MinIO data is in `/data/minio` - include in your server backup strategy.

### Log Management

**View Dokploy Application Logs:**

```bash
# Backend logs
docker logs -f furnacelog-backend

# Frontend logs
docker logs -f furnacelog-frontend

# MongoDB logs
docker logs -f furnacelog-mongodb
```

**Set up Log Rotation:**

Dokploy handles log rotation automatically, but verify:

```bash
docker inspect furnacelog-backend | grep -A 5 "LogConfig"
```

---

## Troubleshooting

### Common Issues

#### 1. Backend can't connect to MongoDB

**Error:** `MongooseError: connection refused`

**Solution:**
- If MongoDB is in Docker, use `host.docker.internal` in connection string
- Check MongoDB is running: `docker ps | grep mongodb`
- Verify MongoDB allows connections: check `bindIp` in `/etc/mongod.conf`
- Test connection: `mongosh -u admin -p --host YOUR_SERVER_IP`

#### 2. CORS errors in browser

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Ensure `CORS_ORIGIN` in backend matches frontend domain exactly
- Include protocol: `https://furnacelog.yourdomain.com` (not `furnacelog.yourdomain.com`)
- Restart backend after changing environment variables

#### 3. SSL certificate not working

**Solution:**
- Verify DNS is pointing to correct IP: `dig furnacelog.yourdomain.com`
- Check Traefik logs: `docker logs dokploy-traefik`
- Ensure ports 80 and 443 are open in firewall
- Wait 5-10 minutes for Let's Encrypt provisioning

#### 4. File uploads failing

**Solution:**
- Check MinIO is running: `docker ps | grep minio`
- Verify buckets exist: Access MinIO Console at `http://your-server-ip:9001`
- Check `MINIO_ENDPOINT` environment variable
- Verify `MAX_FILE_SIZE` is sufficient

#### 5. Email notifications not sending

**Solution:**
- Test SMTP connection: Use telnet or SMTP testing tool
- Check SMTP credentials are correct
- Verify SMTP port is not blocked by firewall
- Check email logs in backend application

### Debugging Commands

```bash
# Check all running containers
docker ps -a

# Check Dokploy network
docker network inspect dokploy-network

# Test MongoDB connection from host
mongosh -u admin -p --host localhost

# Test Redis connection
docker exec -it furnacelog-redis redis-cli -a YOUR_REDIS_PASSWORD ping

# Check disk space
df -h

# Check memory usage
free -m

# Check container resource usage
docker stats

# View backend environment variables
docker exec furnacelog-backend env | grep -i mongo
```

### Performance Optimization

**MongoDB:**
```bash
# Enable MongoDB profiling
mongosh -u admin -p
use furnacelog
db.setProfilingLevel(1, { slowms: 100 })
```

**Node.js Backend:**
- Set `NODE_ENV=production`
- Use PM2 or clustering for multiple processes
- Enable compression middleware
- Implement Redis caching

**Nginx Frontend:**
- Already configured in `nginx.conf` with gzip compression
- Static asset caching enabled
- CDN for global distribution (optional)

---

## Updating FurnaceLog

### Update Backend

```bash
# In Dokploy dashboard:
1. Go to "furnacelog-backend" application
2. Click "Redeploy"
3. Dokploy will pull latest code and rebuild

# Or manually:
docker pull your-registry/furnacelog-backend:latest
docker restart furnacelog-backend
```

### Update Frontend

```bash
# In Dokploy dashboard:
1. Go to "furnacelog-frontend" application
2. Click "Redeploy"

# New build will be created with latest code
```

### Database Migrations

If you have database schema changes:

```bash
# SSH into server
ssh user@your-server-ip

# Run migration script
mongosh -u admin -p
use furnacelog
load('/path/to/migration-script.js')
```

---

## Production Checklist

Before going live, ensure:

- [ ] MongoDB authentication enabled
- [ ] Strong passwords for all services
- [ ] Firewall configured (only necessary ports open)
- [ ] SSL certificates working
- [ ] Backups configured and tested
- [ ] Monitoring set up (Uptime Kuma)
- [ ] Email notifications working
- [ ] Health checks responding
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Environment variables set for production
- [ ] DNS records configured
- [ ] Domain pointing to server
- [ ] Fail2ban configured for SSH protection
- [ ] Server timezone set correctly
- [ ] NTP time synchronization enabled

---

## Support & Resources

- **Dokploy Docs:** https://docs.dokploy.com
- **MongoDB Docs:** https://www.mongodb.com/docs/manual/
- **Docker Docs:** https://docs.docker.com/
- **Traefik Docs:** https://doc.traefik.io/traefik/

---

## Security Best Practices

1. **Regular Updates:**
   ```bash
   apt update && apt upgrade -y
   docker system prune -a  # Clean up old images
   ```

2. **SSH Hardening:**
   - Disable root login
   - Use SSH keys instead of passwords
   - Change default SSH port
   - Configure fail2ban

3. **Database Security:**
   - MongoDB authentication enabled
   - Strong passwords
   - Regular backups
   - Limit network access

4. **Application Security:**
   - Keep dependencies updated
   - Use environment variables for secrets
   - Enable rate limiting
   - Implement CSRF protection
   - Sanitize user inputs

5. **Monitoring:**
   - Set up alerts for downtime
   - Monitor disk space
   - Track error rates
   - Review logs regularly

---

**End of Dokploy Deployment Guide**
