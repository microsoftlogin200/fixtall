# Microsoft-Style Authentication System - API Contracts & Implementation Plan

## Overview
This document defines the API contracts, mock data replacement strategy, and backend implementation plan for the Microsoft-style authentication system.

---

## 1. API Contracts

### 1.1 User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "That email address is already taken."
}
```

---

### 1.2 Check Email Exists
**Endpoint:** `POST /api/auth/check-email`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "exists": true,
  "email": "user@example.com"
}
```

---

### 1.3 User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Your account or password is incorrect. If you don't remember your password, reset it now."
}
```

---

### 1.4 Password Reset Request
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If that email address is in our database, we will send you an email to reset your password."
}
```

---

### 1.5 Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 2. Mock Data Currently in Frontend

### File: `/app/frontend/src/mock.js`

**Mock Users:**
```javascript
- mancando1000@gmail.com / Password123!
- demo@microsoft.com / Demo123!
```

**Mock Functions to Replace:**
1. `mockAuthenticate(email, password)` → API call to `/api/auth/login`
2. `mockCheckEmail(email)` → API call to `/api/auth/check-email`
3. `mockRegister(email, password, name)` → API call to `/api/auth/register`
4. `mockResetPassword(email)` → API call to `/api/auth/forgot-password`

---

## 3. Backend Implementation Plan

### 3.1 Database Models

**User Collection (MongoDB):**
```python
{
  "_id": ObjectId,
  "email": str (unique, indexed),
  "password_hash": str (bcrypt hashed),
  "name": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

### 3.2 Backend Structure

**Files to Create/Modify:**
1. `/app/backend/models/user.py` - User model with Pydantic schemas
2. `/app/backend/utils/auth.py` - Authentication utilities (JWT, password hashing)
3. `/app/backend/routes/auth.py` - Authentication endpoints
4. `/app/backend/server.py` - Import and include auth routes

### 3.3 Security Implementation
- Password hashing: bcrypt (via passlib)
- JWT tokens: python-jose library (already installed)
- Token expiration: 7 days
- Password requirements: min 8 characters

### 3.4 Environment Variables
```
JWT_SECRET_KEY=<random_secret_key>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
```

---

## 4. Frontend Integration Plan

### 4.1 Files to Update

**Create: `/app/frontend/src/services/authService.js`**
- Centralize all API calls
- Replace mock functions with real API calls
- Handle authentication headers
- Store/retrieve JWT tokens

**Update Pages:**
1. `/app/frontend/src/pages/SignIn.jsx` - Replace `mockCheckEmail` with API call
2. `/app/frontend/src/pages/Password.jsx` - Replace `mockAuthenticate` with API call
3. `/app/frontend/src/pages/CreateAccount.jsx` - Replace `mockRegister` with API call
4. `/app/frontend/src/pages/ForgotPassword.jsx` - Replace `mockResetPassword` with API call
5. `/app/frontend/src/pages/Dashboard.jsx` - Add API call to verify token/get user data

### 4.2 Integration Steps
1. Create `authService.js` with all API functions
2. Replace mock imports with authService imports
3. Update error handling to match backend responses
4. Add token refresh logic if needed
5. Test all authentication flows

---

## 5. Testing Checklist

### Backend Testing:
- [ ] User registration with valid data
- [ ] User registration with duplicate email
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Email check endpoint
- [ ] Password reset request
- [ ] JWT token validation
- [ ] Protected route access

### Frontend Integration Testing:
- [ ] Complete sign-in flow (email → password)
- [ ] Create account flow (email → name/password)
- [ ] Forgot password flow
- [ ] Dashboard displays user data
- [ ] Sign out clears token
- [ ] Protected routes redirect to sign-in

---

## 6. Implementation Order

1. **Backend Development** (Priority 1)
   - Create auth utilities (JWT, bcrypt)
   - Create User model
   - Implement auth endpoints
   - Test with curl/Postman

2. **Frontend Integration** (Priority 2)
   - Create authService
   - Replace mock calls
   - Test complete flows

3. **Testing** (Priority 3)
   - Backend API testing
   - Frontend integration testing
   - End-to-end user flows

---

## Notes
- Mock data in `mock.js` will remain for reference but won't be used after backend integration
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Password reset email functionality will be logged to console (no actual email sending in MVP)
- All API routes must use `/api` prefix for Kubernetes ingress routing
