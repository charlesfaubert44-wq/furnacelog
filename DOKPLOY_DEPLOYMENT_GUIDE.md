# Dokploy Deployment Guide for FurnaceLog

This guide explains how to deploy FurnaceLog on Dokploy with proper frontend-backend connectivity.

## Architecture Overview

```
User Browser
    ↓
Frontend Container (nginx on port 8080)
    ↓ (proxies /api requests)
Backend Container (Node.js on port 3000)
    ↓
Database Container
```

## Required Services in Dokploy

You need to deploy **two applications**:

### 1. Backend Service
- **Name**: `furnacelog-backend` (or your preferred name)
- **Type**: Application
- **Repository**: `https://github.com/charlesfaubert44-wq/furnacelog.git`
- **Dockerfile Path**: `backend.Dockerfile`
- **Port**: `3000`

### 2. Frontend Service
- **Name**: `furnacelog-frontend` (or your preferred name)
- **Type**: Application
- **Repository**: `https://github.com/charlesfaubert44-wq/furnacelog.git`
- **Dockerfile Path**: `frontend.Dockerfile`
- **Port**: `8080`

## Environment Variables Configuration

### Backend Environment Variables

In Dokploy, configure these environment variables for the **backend** service:

```env
# Database
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/furnacelog

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# CSRF Protection
CSRF_SECRET=your-super-secret-csrf-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com

# Environment
NODE_ENV=production
PORT=3000
```

### Frontend Runtime Environment Variables

For the **frontend** service, set these as **runtime** environment variables (not build args):

```env
# Backend URL (for nginx proxy)
# Use the internal Docker service name if both containers are in the same network
BACKEND_URL=http://furnacelog-backend:3000

# Or use external URL if backend is separate
# BACKEND_URL=https://api.yourdomain.com
```

**Important**: The frontend now uses nginx proxy, so you **do NOT** need to set `VITE_API_URL` as a build argument. The frontend will automatically use the same origin and nginx will proxy to the backend.

## Networking Setup

### Option 1: Same Docker Network (Recommended)

If both frontend and backend are deployed in Dokploy on the same server:

1. Create a Docker network in Dokploy (or use default)
2. Add both services to the same network
3. Use internal service name for `BACKEND_URL`:
   ```env
   BACKEND_URL=http://furnacelog-backend:3000
   ```

### Option 2: External Backend

If backend is on a different server or domain:

1. Set `BACKEND_URL` to the full external URL:
   ```env
   BACKEND_URL=https://api.yourdomain.com
   ```

## Domain Configuration

### Frontend Domain

In Dokploy, configure your domain for the frontend service:
- **Domain**: `yourdomain.com` or `app.yourdomain.com`
- **Port**: `8080`
- **SSL/TLS**: Enable Let's Encrypt (recommended)

### Backend Domain (Optional)

If you want direct backend access:
- **Domain**: `api.yourdomain.com`
- **Port**: `3000`
- **SSL/TLS**: Enable Let's Encrypt

**Note**: Direct backend access is optional since the frontend proxies all requests.

## Deployment Steps

### Step 1: Deploy Backend

1. Create new application in Dokploy
2. Connect to your GitHub repository
3. Set Dockerfile path to `backend.Dockerfile`
4. Configure environment variables (see above)
5. Deploy and wait for completion
6. Note the service name (e.g., `furnacelog-backend`)

### Step 2: Deploy Frontend

1. Create new application in Dokploy
2. Connect to your GitHub repository
3. Set Dockerfile path to `frontend.Dockerfile`
4. Configure environment variables:
   - Set `BACKEND_URL=http://furnacelog-backend:3000` (use actual backend service name)
5. Deploy and wait for completion

### Step 3: Configure Domain

1. In frontend service settings, add your domain
2. Enable SSL/TLS (Let's Encrypt)
3. Wait for certificate generation
4. Access your application at `https://yourdomain.com`

### Step 4: Verify Backend Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login or make an API call
4. Check that requests to `/api/*` return 200 (not 502 Bad Gateway)
5. If you see errors, check the backend logs in Dokploy

## Troubleshooting

### 502 Bad Gateway Errors

**Symptoms**: Login fails with "bad gateway" error

**Causes & Solutions**:

1. **Backend not running**
   - Check backend container status in Dokploy
   - Check backend logs for errors
   - Ensure all environment variables are set

2. **Wrong BACKEND_URL**
   - Verify service name matches actual backend service
   - Check both containers are in same Docker network
   - Try using IP address instead: `http://172.17.0.x:3000`

3. **Backend not listening on port 3000**
   - Check backend logs
   - Verify `PORT=3000` environment variable

4. **DNS resolution issues**
   - In frontend service, try running: `docker exec -it <container-id> ping furnacelog-backend`
   - If ping fails, check network configuration

### CORS Errors

If you see CORS errors in browser console:

1. Check `FRONTEND_URL` in backend environment variables
2. Make sure it matches your actual frontend domain
3. Ensure backend CORS middleware is configured correctly

### WebSocket Connection Fails

If real-time alerts don't work:

1. Check browser console for WebSocket errors
2. Verify nginx proxy configuration includes WebSocket support (already configured)
3. Check backend WebSocket server is running

### SSL/HTTPS Issues

1. Make sure SSL is enabled in Dokploy for your domain
2. Wait for Let's Encrypt certificate to generate (can take a few minutes)
3. Once HTTPS is working, uncomment HSTS header in `nginx.conf` (line 86)

## Testing Locally

To test the production configuration locally:

```bash
# Build and run backend
docker build -f backend.Dockerfile -t furnacelog-backend .
docker run -p 3000:3000 --env-file backend/.env furnacelog-backend

# Build and run frontend (in separate terminal)
docker build -f frontend.Dockerfile -t furnacelog-frontend .
docker run -p 8080:8080 -e BACKEND_URL=http://host.docker.internal:3000 furnacelog-frontend

# Access at http://localhost:8080
```

## Security Checklist

Before going to production:

- [ ] Change all secret keys in backend environment variables
- [ ] Enable HTTPS/SSL for frontend domain
- [ ] Uncomment HSTS header in `nginx.conf` after SSL is working
- [ ] Set strong MongoDB password
- [ ] Enable MongoDB authentication
- [ ] Review and restrict CORS origins in backend
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable Dokploy authentication
- [ ] Set up monitoring/logging

## Getting Help

If you encounter issues:

1. Check Dokploy logs for both frontend and backend
2. Check browser DevTools console for errors
3. Verify all environment variables are set correctly
4. Ensure both containers can communicate
5. Check this repository's Issues page

## Additional Resources

- [Dokploy Documentation](https://docs.dokploy.com)
- [nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Docker Networking](https://docs.docker.com/network/)
