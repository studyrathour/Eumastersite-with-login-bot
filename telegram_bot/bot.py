import logging
import os
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any
import threading
import time

# Import telegram libraries with error handling
try:
    from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
    from telegram.ext import Updater, CommandHandler, CallbackQueryHandler, CallbackContext
    TELEGRAM_AVAILABLE = True
except ImportError:
    TELEGRAM_AVAILABLE = False
    print("Telegram libraries not available, running in API-only mode")

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Configuration
MANDATORY_CHANNELS = [
    '@Team_Masters_TM',
    'https://t.me/+uMpwtK3Bu8w0MzU1',
    'https://t.me/+rs2CiB7YDbJlM2M1',
    '@EduMaster2008',
    '@masters_chat_official'
]

# In-memory storage (in production, use a proper database)
sessions = {}
users = {}
activity_logs = []
login_logs = []

# Session expiration time (1 hour)
SESSION_EXPIRATION = 3600

def generate_session_id():
    """Generate a unique session ID"""
    return str(uuid.uuid4())

def cleanup_expired_sessions():
    """Remove expired sessions"""
    now = time.time()
    expired_sessions = [
        session_id for session_id, session in sessions.items()
        if session.get('created_at', 0) + SESSION_EXPIRATION < now
    ]
    for session_id in expired_sessions:
        if session_id in sessions:
            sessions[session_id]['status'] = 'expired'
    return len(expired_sessions)

def log_activity(user_data: Dict[str, Any], action: str, session_id: str = None):
    """Log user activity"""
    log_entry = {
        'user_id': user_data.get('id'),
        'username': user_data.get('username'),
        'first_name': user_data.get('first_name'),
        'last_name': user_data.get('last_name'),
        'language_code': user_data.get('language_code'),
        'is_premium': user_data.get('is_premium', False),
        'action': action,
        'timestamp': time.time(),
        'session_id': session_id
    }
    activity_logs.append(log_entry)
    logger.info(f"Activity logged: {action} for user {user_data.get('id')}")

def log_login(user_data: Dict[str, Any], session_id: str):
    """Log user login"""
    log_entry = {
        'user_id': user_data.get('id'),
        'username': user_data.get('username'),
        'first_name': user_data.get('first_name'),
        'last_name': user_data.get('last_name'),
        'language_code': user_data.get('language_code'),
        'login_time': time.time(),
        'session_id': session_id
    }
    login_logs.append(log_entry)
    logger.info(f"Login logged for user {user_data.get('id')}")

def is_user_in_channels(bot, user_id: int) -> bool:
    """Check if user is in all mandatory channels"""
    try:
        for channel in MANDATORY_CHANNELS:
            # Extract channel username from URL if needed
            if channel.startswith('https://t.me/+'):
                # For private channels, we can't check membership directly
                # In a real implementation, you would need to use invite links
                # or have the bot as admin in the channel
                continue
            elif channel.startswith('@'):
                # For public channels
                try:
                    member = bot.get_chat_member(channel, user_id)
                    if member.status not in ['member', 'administrator', 'creator']:
                        return False
                except Exception as e:
                    logger.warning(f"Could not check membership for {channel}: {e}")
                    return False
        return True
    except Exception as e:
        logger.error(f"Error checking channel membership: {e}")
        return False

def start(update: Update, context: CallbackContext) -> None:
    """Handle /start command"""
    user = update.effective_user
    user_data = {
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'language_code': user.language_code,
        'is_premium': getattr(user, 'is_premium', False)
    }
    
    # Store user data
    users[user.id] = user_data
    
    # Check for session ID in command parameters
    session_id = None
    if context.args:
        session_id = context.args[0]
    
    # Log activity
    log_activity(user_data, 'Bot Started', session_id)
    
    if session_id:
        # Validate session
        if session_id in sessions:
            session = sessions[session_id]
            if session['status'] != 'expired':
                # Store user data in session
                session['user_id'] = user.id
                session['user_data'] = user_data
                sessions[session_id] = session
                
                # Present channel verification interface
                channels_text = "\n".join([f"• {channel}" for channel in MANDATORY_CHANNELS])
                message = (
                    f"Hello {user.first_name}!\n\n"
                    "To access EduMaster content, you need to join all our mandatory channels:\n\n"
                    f"{channels_text}\n\n"
                    "Click the button below to verify your membership:"
                )
                
                keyboard = [[InlineKeyboardButton("Verify Membership", callback_data=f"verify_{session_id}")]]
                reply_markup = InlineKeyboardMarkup(keyboard)
                
                update.message.reply_text(message, reply_markup=reply_markup)
            else:
                update.message.reply_text(
                    "❌ Your session has expired. Please login again from the website."
                )
        else:
            update.message.reply_text(
                "❌ Invalid session. Please login from the website to get a valid session."
            )
    else:
        # Show general welcome message
        message = (
            f"Hello {user.first_name}!\n\n"
            "Welcome to the EduMaster Telegram Authentication Bot!\n\n"
            "To access EduMaster content, please login from the website first. "
            "You will be redirected here to verify your Telegram membership."
        )
        update.message.reply_text(message)

def verify_membership(update: Update, context: CallbackContext) -> None:
    """Handle membership verification"""
    query = update.callback_query
    query.answer()
    
    # Extract session ID from callback data
    session_id = query.data.split('_')[1] if '_' in query.data else None
    
    if not session_id or session_id not in sessions:
        query.edit_message_text("❌ Invalid session. Please login from the website.")
        return
    
    session = sessions[session_id]
    if session['status'] == 'expired':
        query.edit_message_text("❌ Your session has expired. Please login again from the website.")
        return
    
    user_id = query.from_user.id
    user_data = {
        'id': query.from_user.id,
        'username': query.from_user.username,
        'first_name': query.from_user.first_name,
        'last_name': query.from_user.last_name,
        'language_code': query.from_user.language_code,
        'is_premium': getattr(query.from_user, 'is_premium', False)
    }
    
    # Check if user is in all mandatory channels
    if is_user_in_channels(context.bot, user_id):
        # Update session status to verified
        session['status'] = 'verified'
        session['verified_at'] = time.time()
        session['user_id'] = user_id
        session['user_data'] = user_data
        sessions[session_id] = session
        
        # Log the login
        log_login(user_data, session_id)
        
        # Log activity
        log_activity(user_data, 'Verification Successful', session_id)
        
        # Send confirmation message
        query.edit_message_text(
            "✅ Verification successful!\n\n"
            "You can now access EduMaster content. "
            "Return to the website to continue."
        )
    else:
        # Show channels user needs to join
        channels_text = "\n".join([f"• {channel}" for channel in MANDATORY_CHANNELS])
        message = (
            "❌ Please join all the mandatory channels and try again:\n\n"
            f"{channels_text}"
        )
        
        keyboard = [[InlineKeyboardButton("Try Again", callback_data=f"verify_{session_id}")]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        # Log activity
        log_activity(user_data, 'Verification Failed', session_id)
        
        query.edit_message_text(message, reply_markup=reply_markup)

def health_check():
    """Health check endpoint"""
    return {
        'status': 'ok',
        'timestamp': time.time(),
        'bot_username': 'EduMasterBot'
    }

def generate_login_url():
    """Generate login URL for Telegram"""
    session_id = generate_session_id()
    sessions[session_id] = {
        'session_id': session_id,
        'status': 'pending',
        'created_at': time.time()
    }
    
    # In a real implementation, this would be a Telegram bot URL
    bot_url = f"https://t.me/YourBotUsername?start={session_id}"
    
    return {
        'session_id': session_id,
        'bot_url': bot_url,
        'status': 'success'
    }

def check_login_status(session_id: str):
    """Check login status"""
    if session_id not in sessions:
        return {
            'status': 'error',
            'login_status': 'invalid_session'
        }
    
    session = sessions[session_id]
    if session['status'] == 'expired':
        return {
            'status': 'error',
            'login_status': 'session_expired'
        }
    
    return {
        'status': 'success',
        'login_status': session['status'],
        'user_id': session.get('user_id'),
        'user_info': session.get('user_data')
    }

def main():
    """Start the bot"""
    # Check if telegram libraries are available
    if not TELEGRAM_AVAILABLE:
        logger.error("Telegram libraries not available. Please install python-telegram-bot")
        return
    
    # Get bot token from environment variable
    token = os.environ.get('BOT_TOKEN')
    if not token:
        logger.error("BOT_TOKEN environment variable not set")
        return
    
    try:
        # Create the Updater and pass it your bot's token
        updater = Updater(token)
        
        # Get the dispatcher to register handlers
        dispatcher = updater.dispatcher
        
        # Register handlers
        dispatcher.add_handler(CommandHandler("start", start))
        dispatcher.add_handler(CallbackQueryHandler(verify_membership))
        
        # Start the Bot
        updater.start_polling()
        
        # Start session cleanup thread
        def cleanup_thread():
            while True:
                time.sleep(300)  # Run every 5 minutes
                cleaned = cleanup_expired_sessions()
                if cleaned > 0:
                    logger.info(f"Cleaned up {cleaned} expired sessions")
        
        cleanup_daemon = threading.Thread(target=cleanup_thread, daemon=True)
        cleanup_daemon.start()
        
        logger.info("Bot started successfully")
        
        # Run the bot until you press Ctrl-C
        updater.idle()
    except Exception as e:
        logger.error(f"Failed to start bot: {e}")
        return

if __name__ == '__main__':
    main()