# QUICK FIX - Bad Gateway Issue

## The Problem
The nginx configuration has a placeholder backend URL that needs to be updated for your Dokploy environment.

## Solution - Two Options:

### Option 1: Update nginx.conf (Recommended)

Before deploying, update line 114 in `nginx.conf`:

**Find this line:**
```nginx
proxy_pass http://backend:3000;
```

**Replace with YOUR backend service name from Dokploy:**
```nginx
proxy_pass http://YOUR-BACKEND-SERVICE-NAME:3000;
```

**Example:**
- If your backend service in Dokploy is named `furnacelog-backend-abc123`
- Change to: `proxy_pass http://furnacelog-backend-abc123:3000;`

**Then:**
1. Commit the change: `git add nginx.conf && git commit -m "fix: Update backend URL" && git push`
2. Redeploy frontend in Dokploy

### Option 2: Use Docker Network Link (Simpler)

In Dokploy, when creating your services:

1. **Deploy Backend First**
   - Name it exactly: `backend`
   - Note: Don't use any other name!

2. **Deploy Frontend**
   - Make sure it's in the same Docker network as backend
   - The nginx.conf already points to `http://backend:3000`
   - It will work automatically!

## How to Find Your Backend Service Name

In Dokploy:
1. Go to your backend application
2. Look at the container name or service name
3. It usually follows this pattern: `appname-randomid`

## Test After Fix

1. Open your frontend URL in browser
2. You should see the login page (no Bad Gateway)
3. Open DevTools → Network tab
4. Try to login
5. Check API calls go to `/api/v1/auth/login` and return 200

## If Still Not Working

Check:
- [ ] Backend is running (check logs in Dokploy)
- [ ] Both frontend and backend are in same Docker network
- [ ] Backend service name in nginx.conf matches actual service name
- [ ] Backend is listening on port 3000

## Quick Test Command

SSH into your frontend container and test:
```bash
# Inside frontend container
curl http://backend:3000/api/v1/health
# Should return: {"status":"ok"}
```

If this fails, the network configuration is wrong.
