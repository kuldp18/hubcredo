# HubCredo Backend - Authentication API

A production-ready Node.js/Express authentication system with JWT tokens, MongoDB, and comprehensive security features.

## 🚀 Features

- **User Authentication**
  - User registration (signup) with validation
  - User login with secure password comparison
  - User logout with token invalidation
  - JWT-based authentication (access + refresh tokens)
- **Security**

  - Password hashing with bcrypt (10 salt rounds)
  - Strong password requirements (min 5 chars, 1 uppercase, 1 special char)
  - Email validation with regex
  - Secure token storage and validation
  - Production-ready CORS configuration
  - Minimal error exposure in production

- **Token Management**
  - Access tokens: 15 minutes (dev) / 1 day (production)
  - Refresh tokens: 7 days
  - Token refresh endpoint for seamless renewal

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js      # Authentication logic
│   ├── middlewares/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   └── User.js                # User schema with validation
│   ├── routes/
│   │   └── authRoutes.js          # Auth API routes
│   ├── utils/
│   │   ├── jwt.js                 # JWT token utilities
│   │   ├── validators.js          # Input validation
│   │   └── errorHandler.js        # Error handling utilities
│   └── server.js                  # Express app setup
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:

- express
- mongoose
- bcrypt
- jsonwebtoken
- cors
- dotenv

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hubcredo
JWT_ACCESS_SECRET=your_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters
CORS_ORIGIN_DEV=http://localhost:3000
CORS_ORIGIN_PROD=https://yourdomain.com
```

**Important:** Change JWT secrets in production to long, random strings (min 32 characters).

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

## 📚 API Endpoints

### Base URL

```
Development: http://localhost:5000
Production: Your domain
```

### Authentication Routes

#### 1. Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecureP@ss1"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecureP@ss1"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 3. Logout (Protected)

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### 4. Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### 5. Get Current User (Protected)

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-12-06T00:00:00.000Z"
    }
  }
}
```

## 🔒 Using Protected Routes

To access protected routes, include the access token in the Authorization header:

```javascript
fetch("http://localhost:5000/api/auth/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});
```

## 🔄 Token Refresh Flow

When an access token expires:

1. Call `/api/auth/refresh` with the refresh token
2. Receive a new access token
3. Use the new access token for subsequent requests
4. If refresh token is expired, user must login again

## ✅ Validation Rules

### Email

- Valid email format (regex validation)
- Converted to lowercase
- Must be unique

### Password

- Minimum 5 characters
- At least one uppercase letter
- At least one special character: `!@#$%^&*()_+-=[]{};':"\\|,.<>/?`

### Name

- Minimum 2 characters
- Maximum 50 characters

## 🛡️ Security Features

1. **Password Security**

   - Bcrypt hashing with 10 salt rounds
   - Passwords never returned in API responses

2. **Token Security**

   - Separate access and refresh tokens
   - Short-lived access tokens
   - Refresh tokens stored in database
   - Token invalidation on logout

3. **CORS Protection**

   - Configurable allowed origins
   - Different settings for dev/production
   - Credentials support

4. **Error Handling**

   - Generic error messages in production
   - Detailed errors only in development
   - No sensitive information leakage

5. **Input Validation**
   - Email format validation
   - Password strength requirements
   - Request sanitization

## 🧪 Testing with Postman/Thunder Client

1. **Sign Up**: Create a new user
2. **Login**: Get access and refresh tokens
3. **Access Protected Route**: Use access token in header
4. **Refresh Token**: Get new access token when expired
5. **Logout**: Invalidate refresh token

## 📝 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `403` - Forbidden (CORS error)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change `NODE_ENV` to `production`
- [ ] Generate strong JWT secrets (min 32 chars)
- [ ] Update `CORS_ORIGIN_PROD` with your domain
- [ ] Use a production MongoDB URI (MongoDB Atlas)
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform
- [ ] Review and test all endpoints
- [ ] Set up logging and monitoring

## 📦 Environment-Specific Token Expiry

| Environment | Access Token | Refresh Token |
| ----------- | ------------ | ------------- |
| Development | 15 minutes   | 7 days        |
| Production  | 1 day        | 7 days        |

## 🤝 Contributing

This is a production-ready authentication system. Feel free to extend it with additional features like:

- Email verification
- Password reset
- Social authentication
- Rate limiting
- Two-factor authentication

## 📄 License

ISC

---

Built with ❤️ for HubCredo
