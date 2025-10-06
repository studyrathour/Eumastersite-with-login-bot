// Telegram Bot Configuration
export const BOT_CONFIG = {
  // Mandatory channels that users must join
  MANDATORY_CHANNELS: [
    '@Team_Masters_TM',
    'https://t.me/+uMpwtK3Bu8w0MzU1',
    'https://t.me/+rs2CiB7YDbJlM2M1',
    '@EduMaster2008',
    '@masters_chat_official'
  ],
  
  // Log channels
  ACTIVITY_LOG_CHANNEL: 'https://t.me/+5-7cx0BE8hM3OGY1',
  LOGIN_LOG_CHANNEL: 'https://t.me/+h57vp-QEMlM2ZTM9',
  
  // Session expiration time (1 hour in milliseconds)
  SESSION_EXPIRATION: 60 * 60 * 1000,
  
  // Messages
  WELCOME_MESSAGE: 'Welcome to EduMaster Telegram Authentication Bot!\n\nPlease login from the website to continue.',
  CHANNEL_VERIFICATION_MESSAGE: 'Please join all the mandatory channels before proceeding:',
  VERIFICATION_SUCCESS_MESSAGE: '✅ Verification successful! You can now access EduMaster content.',
  VERIFICATION_FAILED_MESSAGE: '❌ Please join all the mandatory channels and try again.',
  
  // Button labels
  VERIFY_MEMBERSHIP_BUTTON: 'Verify Membership',
  TRY_AGAIN_BUTTON: 'Try Again'
};