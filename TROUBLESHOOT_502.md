# Troubleshooting 502 Bad Gateway on Main Page

## The Issue

Getting 502 on `GET /` (homepage) means the frontend container is **not responding**. This is different from API 502 errors.

## Immediate Steps - Check Dokploy Logs

### Step 1: Check Container Status

In Dokploy:

1. Go to your **frontend application** (furnacelog-frontend-jtvgfz)
2. Look at the **Status** indicator
3. Check if it says:
   - 🟢 **Running** (good)
   - 🔴 **Stopped/Error** (container crashed)
   - 🟡 **Starting** (still deploying)

### Step 2: View Build Logs

1. In Dokploy, go to **Deployments** tab
2. Click on the latest deployment
3. Check **Build Logs** for errors

**Look for these common errors:**

```
ERROR: failed to solve: process "/bin/sh -c npm run build" did not complete successfully
```
→ Build failed, TypeScript errors

```
nginx: [emerg] unknown directive
nginx: configuration file /etc/nginx/nginx.conf test failed
```
→ nginx config syntax error

### Step 3: View Runtime Logs

1. In Dokploy, go to **Logs** tab
2. Select **Runtime Logs**
3. Look at the most recent logs

**What to look for:**

✅ **Good logs** (container is healthy):
```
/docker-entrypoint.sh: Configuration complete; ready for start up
nginx: [notice] start worker processes
```

❌ **Bad logs** (container crashed):
```
nginx: [emerg] bind() to 0.0.0.0:8080 failed (98: Address already in use)
nginx: [emerg] still could not bind()
```
→ Port already in use

```
nginx: [emerg] cannot load certificate
```
→ SSL/certificate issue

```
nginx: [emerg] "server" directive is not allowed here
```
→ nginx config syntax error

## Common Issues and Solutions

### Issue 1: Container Keeps Restarting

**Symptoms:**
- Container status flips between Starting → Running → Stopped
- Logs show nginx starting then dying

**Solution:**
Check for port conflicts or nginx config errors in logs

### Issue 2: Build Succeeded but Container Won't Start

**Symptoms:**
- Build logs look clean
- Runtime logs show errors

**Possible causes:**
1. nginx configuration syntax error
2. Missing files in the build
3. Permission issues

**Fix:**
1. Check runtime logs for specific nginx errors
2. Try SSH into the container:
   ```bash
   docker exec -it <container-id> sh
   nginx -t
   ```
3. This will test nginx config

### Issue 3: "Bad Gateway" from Reverse Proxy

**Symptoms:**
- Container shows as Running
- Still getting 502

**Possible causes:**
- Dokploy reverse proxy can't reach container
- Port mapping issue
- Health check failing

**Fix:**
1. Check **Port** setting in Dokploy is `8080`
2. Check **Health Check** settings
3. Verify reverse proxy configuration

### Issue 4: Build is Still Using Old Code

**Symptoms:**
- Logs look fine but behavior hasn't changed

**Fix:**
1. In Dokploy, click **Clean Build Cache**
2. Redeploy

## Debug Commands (If You Can SSH)

If you can SSH into your Dokploy server:

### Check if container is running:
```bash
docker ps | grep furnacelog-frontend
```

### Check container logs:
```bash
docker logs <container-id> --tail 100
```

### Test nginx config inside container:
```bash
docker exec -it <container-id> nginx -t
```

### Check if nginx is listening on port 8080:
```bash
docker exec -it <container-id> netstat -tlnp | grep 8080
```

### Manually test the app:
```bash
docker exec -it <container-id> wget -O- http://localhost:8080
```
Should return HTML, not error

## Quick Fix: Force Rebuild

Sometimes the easiest fix:

1. In Dokploy, go to Settings
2. Click **Delete Build Cache**
3. Go back to Deployments
4. Click **Redeploy**
5. Watch the build logs carefully

## What to Report

If still stuck, provide these details:

1. **Container Status**: Running / Stopped / Error
2. **Build Logs**: Last 50 lines
3. **Runtime Logs**: Last 50 lines
4. **Dokploy Version**: Check in Dokploy settings
5. **Screenshot**: Of the error in Dokploy

## Expected Healthy State

When everything works:

```
✅ Build Logs (end):
✓ built in 8.97s
PWA v1.2.0
mode      generateSW
Successfully built image

✅ Runtime Logs:
/docker-entrypoint.sh: Configuration complete
nginx: [notice] start worker processes

✅ Status: 🟢 Running

✅ Browser: Shows login page (not 502)
```

## Emergency Rollback

If you need to rollback:

1. In Dokploy, go to **Deployments**
2. Find a previous successful deployment
3. Click **Redeploy** on that deployment
4. This will revert to the working version

---

**Next Steps:**
1. Check Dokploy logs as described above
2. Look for the specific error message
3. Share the error message for specific help
