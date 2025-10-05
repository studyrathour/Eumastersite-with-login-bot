# EduMaster Token Authentication System

## Overview

This document explains how the token-based authentication system works in the EduMaster platform. The system integrates with a Telegram bot that generates 12-character access tokens for users.

## How It Works

1. **Get a Token**: Users request an access token from the Telegram bot (@Acess_EduMaster_bot)
2. **Verify Token**: Users enter their token on the verification page (/verify-token)
3. **Access Granted**: Valid tokens grant 24-hour access to all platform content
4. **Automatic Expiration**: Access automatically expires after 24 hours

## User Flow

### 1. Getting a Token
- Visit the Telegram bot: https://t.me/Acess_EduMaster_bot
- Follow the bot's instructions to verify your membership in required Telegram channels
- The bot will generate a unique 12-character token for you
- Tokens are valid for 5 minutes after generation

### 2. Verifying Your Token
- Navigate to the verification page: /verify-token
- Enter your 12-character token in the input field
- Click "Verify Token"
- If valid, you'll be granted 24-hour access to all content

### 3. Accessing Content
- Once verified, you can access all platform features:
  - Browse batches
  - Join live classes
  - Use the video player demo
- Your access status is displayed in the bottom-right corner
- You can renew your access at any time by clicking "Renew"

## Technical Implementation

### Authentication Utilities
The system uses functions in `src/utils/auth.ts`:
- `verifyToken()`: Calls the Telegram bot's /verify-token endpoint using GET method
- `checkAccess()`: Calls the Telegram bot's /check-access endpoint using GET method
- `isUserAuthenticated()`: Checks if the user has valid access
- `setUserToken()`: Stores user access data in localStorage
- `clearUserToken()`: Removes user access data

### Session Management
- User access data is stored in localStorage
- Includes userId and expiration timestamp
- Sessions last for 24 hours
- Automatic expiration checking on page load
- Server-provided expiration time is used when available

### Protected Routes
- All content routes are protected by the ProtectedRoute component
- Only the verification page is accessible without authentication
- Unauthenticated users are redirected to /verify-token

## Security Features

- Tokens can only be used once
- All API communications use HTTPS
- Token format validation before API requests
- Automatic session cleanup on expiration
- Protection against token manipulation

## API Endpoints

### Token Verification
```
GET https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app/verify-token?token=A1b2C3d4E5f6
Response: { "valid": true, "message": "Token verified successfully", "userId": 123456789 }
```

### Access Check
```
GET https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app/check-access?userId=123456789
Response: { "hasAccess": true, "message": "User has access", "expiresAt": 1764987654321 }
```

## Token Format

Valid tokens must:
- Be exactly 12 characters long
- Contain uppercase letters (A-Z)
- Contain lowercase letters (a-z)
- Contain numbers (0-9)
- Contain special characters (@#$?:/)
- Example: A1b2C3d4@#E5

## Troubleshooting

### Token Not Working
- Ensure the token is exactly 12 characters
- Check that all characters are valid (letters, numbers, @#$?:/)
- Verify the token hasn't expired (5-minute window)
- Make sure you haven't already used the token

### Access Expired
- Visit /verify-token to get a new token
- Click "Renew" in the access timer notification
- Your previous session will be automatically cleared

### Technical Issues
- Clear your browser's localStorage for this site
- Try using a different browser
- Check your internet connection
- Contact support if problems persist