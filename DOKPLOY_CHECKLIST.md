# Dokploy Configuration Checklist

## Critical Settings to Check

### Frontend Application Settings

#### ⚠️ IMPORTANT: Build Arguments (Build Args)

**DO NOT SET** these build arguments:
- ❌ `VITE_API_URL` - Leave this EMPTY or DELETE it
- ❌ Any other `VITE_*` variables

**Why?**
The app auto-detects the correct URL in production. Setting `VITE_API_URL` will override this and cause CORS errors.

**Where to check:**
1. Go to your frontend app in Dokploy
2. Click **Settings** or **Configuration**
3. Look for **Build Arguments** or **Build Env Variables**
4. **Delete** any `VITE_API_URL` entry

#### ✅ Required Settings

**Port:**
- Set to: `8080`
- Type: HTTP

**Health Check Path:**
- Set to: `/health`
- (Optional but recommended)

**Domain:**
- Add your domain (e.g., `furnacelog.com`)
- Enable SSL/HTTPS (recommended)

#### ⚠️ Runtime Environment Variables

**DO NOT SET** these at runtime either:
- ❌ `VITE_API_URL`
- ❌ `BACKEND_URL` (not needed for frontend)

The nginx config hardcodes the backend URL already.

### Backend Application Settings

#### ✅ Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://user:pass@host:27017/furnacelog

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-random-secret-here
JWT_REFRESH_SECRET=your-random-refresh-secret-here

# CSRF Protection
CSRF_SECRET=your-random-csrf-secret-here

# Frontend URL (for CORS)
FRONTEND_URL=https://furnacelog.com

# Environment
NODE_ENV=production
PORT=3000
```

#### ⚠️ Service Name

Your backend service name should match what's in `nginx.conf`:
- Current: `furnacelog-backend-oepp8k`

If you recreate the backend with a different name, you must update `nginx.conf` line 111.

### Networking

#### ✅ Docker Network

Both frontend and backend MUST be in the **same Docker network**.

**To check:**
1. In Dokploy, go to each application
2. Check **Network** settings
3. Ensure both use the same network (usually `dokploy-network` or similar)

#### ✅ DNS Resolution

Containers should be able to resolve each other by service name.

**To test (SSH into frontend):**
```bash
docker exec -it <frontend-container-id> sh
ping furnacelog-backend-oepp8k
# Should respond, not "unknown host"
```

### Common Mistakes

#### ❌ Mistake 1: Setting VITE_API_URL in Build Args

**Result:** App tries to reach external URL, gets CORS errors

**Fix:** Delete `VITE_API_URL` from Build Arguments

#### ❌ Mistake 2: Wrong Backend Service Name

**Result:** 502 Bad Gateway on API calls

**Fix:** Update `nginx.conf` line 111 with correct service name

#### ❌ Mistake 3: Different Docker Networks

**Result:** Frontend can't reach backend

**Fix:** Put both in same network

#### ❌ Mistake 4: Using Port 80 Instead of 8080

**Result:** Container fails to start (permission denied)

**Fix:** Set port to `8080` (unprivileged nginx)

### Deployment Order

For first-time deployment:

1. **Deploy Backend First**
   - Set all environment variables
   - Wait for it to be Running
   - Note the service name

2. **Update nginx.conf**
   - Set backend service name on line 111
   - Commit and push

3. **Deploy Frontend**
   - Ensure no `VITE_API_URL` in build args
   - Set port to `8080`
   - Deploy

4. **Configure Domain**
   - Add domain to frontend app
   - Enable SSL/HTTPS
   - Test

### Verification Steps

After deployment, verify:

1. ✅ Frontend container is **Running**
2. ✅ Backend container is **Running**
3. ✅ Frontend logs show: `nginx: [notice] start worker processes`
4. ✅ Backend logs show: `Server started on port 3000`
5. ✅ Browser shows login page (not 502)
6. ✅ Browser console shows: `[API] Production mode - using nginx proxy at: https://furnacelog.com`
7. ✅ Login attempt reaches backend (check Network tab)

### Troubleshooting

**502 on main page:**
- Check [TROUBLESHOOT_502.md](TROUBLESHOOT_502.md)

**502 on API calls:**
- Backend not running
- Wrong service name in nginx.conf
- Different Docker networks

**CORS errors:**
- `VITE_API_URL` is set somewhere (check build args!)
- Service worker cache (clear browser cache)

**Login fails after all above work:**
- Check backend environment variables
- Check database connection
- Check backend logs

---

## Quick Reference

| Setting | Location | Value |
|---------|----------|-------|
| Frontend Port | App Settings | `8080` |
| Backend Port | App Settings | `3000` |
| Backend Service Name | nginx.conf:111 | `furnacelog-backend-oepp8k` |
| VITE_API_URL | Build Args | **DELETE THIS** |
| Health Check | Frontend | `/health` |
| Docker Network | Both Apps | Same network |

---

**Last Updated:** After fixing 502 issues
**Version:** Frontend v1.1.0
