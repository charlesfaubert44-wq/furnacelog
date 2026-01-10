# How to Clear Service Worker Cache

## The Problem

The old service worker cached API requests to `https://api.furnacelog.com`, which caused CORS errors. After deploying the fix, you need to clear your browser's cache to force the new service worker to load.

## Solution - Clear Browser Cache

### Method 1: Hard Refresh (Quickest)

**Windows/Linux:**
1. Press `Ctrl + Shift + R` or `Ctrl + F5`
2. Wait for page to reload

**Mac:**
1. Press `Cmd + Shift + R` or `Cmd + Option + E`
2. Wait for page to reload

### Method 2: Clear Cache in DevTools (Most Reliable)

**Chrome/Edge:**
1. Open your site
2. Press `F12` to open DevTools
3. Go to **Application** tab
4. In left sidebar, click **Service Workers**
5. Find the service worker and click **Unregister**
6. Click **Clear storage** in left sidebar
7. Check "Unregister service workers" and "Cache storage"
8. Click **Clear site data**
9. Close DevTools
10. Hard refresh page (`Ctrl+Shift+R`)

**Firefox:**
1. Open your site
2. Press `F12` to open DevTools
3. Go to **Storage** tab
4. Right-click on your domain under **Service Workers**
5. Click **Unregister**
6. Right-click on **Cache Storage**
7. Click **Delete All**
8. Close DevTools
9. Hard refresh page (`Ctrl+Shift+R`)

### Method 3: Clear All Browser Cache (Nuclear Option)

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select **Cached images and files**
3. Select **Time range: All time**
4. Click **Clear data**
5. Reload your site

**Firefox:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Check **Cache**
3. Select **Time range: Everything**
4. Click **Clear Now**
5. Reload your site

## Verify It's Fixed

After clearing cache and reloading:

1. Open DevTools (`F12`)
2. Go to **Console** tab
3. Look for this message:
   ```
   [API] Production mode - using nginx proxy at: https://yourdomain.com
   ```
4. If you see this, the fix worked! ✅

5. Try to login:
   - Open **Network** tab in DevTools
   - Attempt login
   - Check requests go to `https://yourdomain.com/api/v1/auth/login` (NOT `https://api.furnacelog.com`)
   - Request should return **200 OK** (not 502)

## What Changed

**Before (Broken):**
- Service worker cached API calls
- Requests went to: `https://api.furnacelog.com/api/v1/...`
- Result: CORS errors, 502 Bad Gateway

**After (Fixed):**
- Service worker ignores API calls
- Requests go to: `https://yourdomain.com/api/v1/...`
- nginx proxies to backend: `http://furnacelog-backend-oepp8k:3000`
- Result: Login works! ✅

## Troubleshooting

### Still seeing CORS errors?

Check console for the API base URL log:
- Should say: `[API] Production mode - using nginx proxy at: https://yourdomain.com`
- If it says something else, cache wasn't cleared properly

### Still seeing 502 Bad Gateway on API calls?

This means nginx can't reach the backend:
1. Check backend is running in Dokploy
2. Verify backend service name is `furnacelog-backend-oepp8k`
3. Ensure both containers are in same Docker network
4. Check backend logs for errors

### Login page loads but login fails?

This is different from cache issues. Check:
1. Backend environment variables (JWT_SECRET, MONGODB_URI, etc.)
2. Database connection
3. Backend logs in Dokploy

## For Other Users

If other users visited your site before the fix, they also need to clear their cache. Options:

1. **Send them this link** to clear cache instructions
2. **Ask them to hard refresh** (`Ctrl+Shift+R`)
3. **Wait 24-48 hours** - old service worker will eventually expire

## Prevent This in Future

The fix ensures:
- API calls are never cached by service worker
- Production always uses same-origin (nginx proxy)
- No hardcoded external API URLs

Your app should work smoothly after this cache clear! 🎉
