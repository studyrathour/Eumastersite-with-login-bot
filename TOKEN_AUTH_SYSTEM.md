# EduMaster Access System

## Overview

This document explains how the access system works in the EduMaster platform. The token-based authentication system has been enhanced with a Telegram bot authentication option.

## How It Works

1. **Get Access**: Users can choose between two methods:
   - Quick Access: Immediate access grant
   - Telegram Authentication: Authenticate through our Telegram bot by joining mandatory channels
2. **Access Granted**: Access is granted to all platform content
3. **Persistent Access**: Access persists until the user clears their browser data

## User Flow

### 1. Getting Access
- Navigate to the verification page: /verify-token
- Choose between Quick Access or Telegram Authentication
- For Quick Access: Click "Grant Access"
- For Telegram Authentication: Click "Login with Telegram" and complete the channel verification

### 2. Accessing Content
- Once granted access, you can access all platform features:
  - Browse batches
  - Join live classes
  - Use the video player demo
- Your access will persist until you clear your browser data

## Technical Implementation

### Authentication Utilities
The system uses functions in `src/utils/auth.ts`:
- `isUserAuthenticated()`: Checks if the user has been granted access (either method)
- `grantUserAccess()`: Grants quick access to the user
- `grantTelegramUserAccess()`: Grants Telegram-based access to the user
- `removeUserAccess()`: Removes user access
- `isAdminAuthenticated()`: Checks if the user is an admin
- `adminLogin()`: Authenticates an admin user
- `adminLogout()`: Logs out an admin user

### Session Management
- User access data is stored in localStorage
- Access persists until localStorage is cleared
- No automatic expiration

### Protected Routes
- All content routes are protected by the ProtectedRoute component
- Only the verification page is accessible without authentication
- Unauthenticated users are redirected to /verify-token

## Admin Access

Admin users can still log in using the admin credentials:
- Username: ravi
- Password: 2008

Admin access allows full control over the platform content.

## Telegram Bot Authentication

### Features
- Channel membership verification
- Session-based authentication
- Activity and login logging
- User-friendly interface

### Mandatory Channels
Users must join all of the following channels:
- @Team_Masters_TM
- https://t.me/+uMpwtK3Bu8w0MzU1
- https://t.me/+rs2CiB7YDbJlM2M1
- @EduMaster2008
- @masters_chat_official

### Implementation Details
The Telegram bot implementation includes:
- Configuration module for bot settings
- TypeScript types for data structures
- Local storage-based database
- Simulated bot logic
- Frontend component for user interaction

## Troubleshooting

### Access Issues
- Clear your browser's localStorage for this site
- Try using a different browser
- Check your internet connection
- Contact support if problems persist

### Telegram Authentication Issues
- Ensure you've joined all mandatory channels
- Check that the Telegram bot is functioning
- Verify your Telegram account is not restricted
- Try the Quick Access method instead