# FurnaceLog API Examples - Quick Reference

## Base URLs

- **Development Backend:** `http://localhost:5000`
- **Development Frontend:** `http://localhost:5173`
- **API Base:** `http://localhost:5000/api/v1`

---

## Authentication Endpoints

### 1. Register New User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "confirmPassword": "SecureP@ss123",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "867-555-0123",
    "community": "Yellowknife"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecureP@ss123","confirmPassword":"SecureP@ss123","profile":{"firstName":"John","lastName":"Doe","community":"Yellowknife"}}'
```

---

### 2. Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "rememberMe": true
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecureP@ss123","rememberMe":true}'
```

**Response (save the tokens):**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "15m"
    }
  }
}
```

---

### 3. Get Current User

```bash
GET /api/v1/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 4. Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGc..."}'
```

---

### 5. Logout

```bash
POST /api/v1/auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## User Profile Endpoints

### 6. Get Profile

```bash
GET /api/v1/users/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**cURL:**
```bash
curl -X GET http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 7. Update Profile

```bash
PATCH /api/v1/users/me
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "profile": {
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "867-555-0124",
    "community": "Inuvik",
    "preferredUnits": "imperial"
  },
  "preferences": {
    "notifications": {
      "email": true,
      "push": true,
      "digestFrequency": "daily"
    }
  }
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"profile":{"firstName":"Jane","community":"Inuvik"}}'
```

---

### 8. Change Password

```bash
POST /api/v1/users/me/change-password
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "currentPassword": "OldP@ss123",
  "newPassword": "NewSecureP@ss123",
  "confirmNewPassword": "NewSecureP@ss123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/users/me/change-password \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"OldP@ss123","newPassword":"NewSecureP@ss123","confirmNewPassword":"NewSecureP@ss123"}'
```

---

### 9. Delete Account

```bash
DELETE /api/v1/users/me
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "password": "SecureP@ss123"
}
```

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"password":"SecureP@ss123"}'
```

---

## Health Check

### 10. Server Health

```bash
GET /health
```

**cURL:**
```bash
curl -X GET http://localhost:5000/health
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "FurnaceLog API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"SecureP@ss123\",\n  \"confirmPassword\": \"SecureP@ss123\",\n  \"profile\": {\n    \"firstName\": \"Test\",\n    \"lastName\": \"User\",\n    \"community\": \"Yellowknife\"\n  }\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"SecureP@ss123\",\n  \"rememberMe\": true\n}"
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/auth/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ]
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/logout",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "User",
      "item": [
        {
          "name": "Update Profile",
          "request": {
            "method": "PATCH",
            "url": "{{baseUrl}}/users/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"profile\": {\n    \"firstName\": \"Updated\",\n    \"community\": \"Inuvik\"\n  }\n}"
            }
          }
        },
        {
          "name": "Change Password",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/users/me/change-password",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"currentPassword\": \"OldP@ss123\",\n  \"newPassword\": \"NewSecureP@ss123\",\n  \"confirmNewPassword\": \"NewSecureP@ss123\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Testing Workflow

### Quick Test Sequence

1. **Start Services:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev

   # Terminal 3: Check MongoDB and Redis
   docker-compose ps
   ```

2. **Register a User:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"SecureP@ss123","confirmPassword":"SecureP@ss123"}'
   ```

3. **Save the Access Token:**
   ```bash
   # From response, copy accessToken value
   export TOKEN="eyJhbGc..."
   ```

4. **Test Protected Endpoint:**
   ```bash
   curl -X GET http://localhost:5000/api/v1/users/me \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Test Frontend:**
   - Navigate to `http://localhost:5173/register`
   - Fill form and submit
   - Should redirect to `/dashboard`

---

## Common Errors

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```
**Solution:** Include Authorization header with Bearer token

### 400 Validation Failed
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{"field": "email", "message": "Please provide a valid email address"}]
}
```
**Solution:** Fix validation errors in request body

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again in 15 minutes."
}
```
**Solution:** Wait 15 minutes or clear Redis with `redis-cli FLUSHDB`

### 500 Internal Server Error
**Solution:** Check backend logs, verify MongoDB and Redis are running

---

## Redis Inspection

### Check Sessions
```bash
# Connect to Redis
redis-cli

# List all session keys
KEYS session:*

# View specific session
GET session:USER_ID:SESSION_ID

# View login attempts
KEYS login_attempts:*
GET login_attempts:user@example.com

# Clear all sessions (for testing)
FLUSHDB
```

---

## MongoDB Inspection

### Check Users
```bash
# Connect to MongoDB
mongosh furnacelog

# List users
db.users.find().pretty()

# Find specific user
db.users.findOne({email: "test@example.com"})

# Count users
db.users.countDocuments()

# Delete test user
db.users.deleteOne({email: "test@example.com"})
```

---

**Quick Reference Created:** January 2, 2026
**For:** FurnaceLog Authentication System
