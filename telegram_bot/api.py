from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import threading
from datetime import datetime
import time
import logging

# Add the telegram_bot directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import bot functions with error handling
try:
    from bot import (
        generate_login_url, 
        check_login_status, 
        health_check,
        sessions,
        activity_logs,
        login_logs
    )
    BOT_IMPORT_SUCCESS = True
except ImportError as e:
    BOT_IMPORT_SUCCESS = False
    print(f"Failed to import bot functions: {e}")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/generate_login_url', methods=['POST'])
def generate_login_url_endpoint():
    """Generate login URL endpoint"""
    if not BOT_IMPORT_SUCCESS:
        return jsonify({
            'status': 'error',
            'message': 'Bot functions not available'
        }), 500
    
    try:
        result = generate_login_url()
        logger.info("Generated login URL successfully")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f'Failed to generate login URL: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': f'Failed to generate login URL: {str(e)}'
        }), 500

@app.route('/check_login_status', methods=['GET'])
def check_login_status_endpoint():
    """Check login status endpoint"""
    if not BOT_IMPORT_SUCCESS:
        return jsonify({
            'status': 'error',
            'message': 'Bot functions not available'
        }), 500
    
    try:
        session_id = request.args.get('session_id')
        
        if not session_id:
            return jsonify({
                'status': 'error',
                'message': 'session_id is required'
            }), 400
        
        result = check_login_status(session_id)
        logger.info(f"Checked login status for session {session_id}")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f'Failed to check login status: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': f'Failed to check login status: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_endpoint():
    """Health check endpoint"""
    if not BOT_IMPORT_SUCCESS:
        return jsonify({
            'status': 'error',
            'message': 'Bot functions not available'
        }), 500
    
    try:
        result = health_check()
        logger.info("Health check successful")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f'Health check failed: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': f'Health check failed: {str(e)}'
        }), 500

@app.route('/logs/activity', methods=['GET'])
def activity_logs_endpoint():
    """Get activity logs endpoint"""
    if not BOT_IMPORT_SUCCESS:
        return jsonify({
            'status': 'error',
            'message': 'Bot functions not available'
        }), 500
    
    try:
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        # Get logs with pagination
        paginated_logs = activity_logs[offset:offset+limit]
        
        logger.info(f"Retrieved {len(paginated_logs)} activity logs")
        return jsonify({
            'status': 'success',
            'logs': paginated_logs,
            'count': len(paginated_logs)
        }), 200
    except Exception as e:
        logger.error(f'Failed to retrieve activity logs: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': f'Failed to retrieve activity logs: {str(e)}'
        }), 500

@app.route('/logs/login', methods=['GET'])
def login_logs_endpoint():
    """Get login logs endpoint"""
    if not BOT_IMPORT_SUCCESS:
        return jsonify({
            'status': 'error',
            'message': 'Bot functions not available'
        }), 500
    
    try:
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        # Get logs with pagination
        paginated_logs = login_logs[offset:offset+limit]
        
        logger.info(f"Retrieved {len(paginated_logs)} login logs")
        return jsonify({
            'status': 'success',
            'logs': paginated_logs,
            'count': len(paginated_logs)
        }), 200
    except Exception as e:
        logger.error(f'Failed to retrieve login logs: {str(e)}')
        return jsonify({
            'status': 'error',
            'message': f'Failed to retrieve login logs: {str(e)}'
        }), 500

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    logger.info("Home endpoint accessed")
    return jsonify({
        'message': 'EduMaster Telegram Bot API',
        'timestamp': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    bot_token = os.environ.get('BOT_TOKEN', '')
    
    if not bot_token:
        logger.warning("BOT_TOKEN environment variable not set")
    
    logger.info(f"Starting Telegram Bot API on port {port}")
    
    try:
        app.run(host='0.0.0.0', port=port, debug=False)
    except Exception as e:
        logger.error(f"Failed to start Flask app: {e}")
        sys.exit(1)