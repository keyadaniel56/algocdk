# SuperAdmin Setup Guide

## Overview
The SuperAdmin signup functionality provides a secure way to create superadmin accounts with restricted access.

## Setup Instructions

### 1. Environment Configuration
Add the following to your `.env` file:
```
SUPER_ADMIN_SECRET=your-super-admin-secret-key-here
```

**Important**: Choose a strong, unique secret key that only authorized personnel know.

### 2. Access the Signup Page
Navigate to: `http://your-domain/superadmin/signup`

### 3. Required Information
- **Full Name**: SuperAdmin's full name
- **Email**: Valid email address (must be unique)
- **Password**: Strong password (minimum 8 characters)
- **Secret Key**: The value set in `SUPER_ADMIN_SECRET` environment variable

### 4. After Signup
- SuperAdmin account is created with role "superadmin"
- User is automatically logged in and redirected to the superadmin dashboard
- JWT token is stored for authentication

## Login Process
SuperAdmins use the regular login page at `/auth` with their email and password. No secret key is required for login.

## Security Features
- Secret key validation using constant-time comparison
- Password hashing using bcrypt
- Input sanitization and validation
- Email uniqueness check
- JWT token authentication

## API Endpoint
- **POST** `/api/superadmin/auth/signup`
- **POST** `/api/superadmin/auth/login` (uses regular auth page)

## Access Control
- Only users with the correct secret key can create superadmin accounts
- SuperAdmin role provides access to all platform management features
- Protected routes require JWT authentication

## Troubleshooting
- **"Unauthorized" error**: Check that the secret key matches the environment variable
- **"Email already exists"**: Use a different email address
- **"Invalid email format"**: Ensure email is properly formatted
- **"Password must be at least 8 characters"**: Use a longer password