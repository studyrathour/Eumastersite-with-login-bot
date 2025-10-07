#!/usr/bin/env python3

import os
import sys

def check_files():
    """Check if bot files exist and are accessible"""
    bot_dir = '/app/bot'
    
    print(f"Current working directory: {os.getcwd()}")
    print(f"Checking bot directory: {bot_dir}")
    
    # Check if directory exists
    if not os.path.exists(bot_dir):
        print(f"ERROR: Bot directory {bot_dir} does not exist")
        return False
    
    # List files in directory
    try:
        files = os.listdir(bot_dir)
        print(f"Files in {bot_dir}: {files}")
    except Exception as e:
        print(f"ERROR: Cannot list files in {bot_dir}: {e}")
        return False
    
    # Check specific files
    required_files = ['bot.py', 'api.py', 'requirements.txt']
    for file in required_files:
        file_path = os.path.join(bot_dir, file)
        if os.path.exists(file_path):
            print(f"✓ {file} exists")
        else:
            print(f"✗ {file} does not exist")
            return False
    
    # Try to import bot module
    try:
        sys.path.insert(0, bot_dir)
        import bot
        print("✓ bot module can be imported")
    except Exception as e:
        print(f"✗ Cannot import bot module: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("Verifying bot files...")
    if check_files():
        print("All checks passed!")
        sys.exit(0)
    else:
        print("Some checks failed!")
        sys.exit(1)