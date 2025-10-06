#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
  }
};

// Log functions
const log = {
  info: (msg) => console.log(`${colors.fg.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.fg.green}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.fg.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.fg.red}${msg}${colors.reset}`)
};

// Main deployment function
async function deploy() {
  try {
    log.info('🚀 Starting EduMaster deployment process...\n');
    
    // Check if we're in the correct directory
    if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      log.error('❌ package.json not found. Please run this script from the project root directory.');
      process.exit(1);
    }
    
    // Step 1: Install dependencies
    log.info('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    log.success('✅ Dependencies installed successfully!\n');
    
    // Step 2: Build the project
    log.info('🏗️  Building the project...');
    execSync('npm run build', { stdio: 'inherit' });
    log.success('✅ Project built successfully!\n');
    
    // Step 3: Check if dist folder exists
    if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
      log.error('❌ Dist folder not found. Build may have failed.');
      process.exit(1);
    }
    
    log.success('🎉 Build completed successfully!');
    log.info('📁 The dist folder is ready for deployment.');
    log.info('📋 To deploy to Koyeb:');
    log.info('   1. Go to your Koyeb dashboard');
    log.info('   2. Create a new Static Site app');
    log.info('   3. Upload the contents of the dist folder');
    log.info('   4. Or connect your GitHub repository\n');
    
    log.success('✅ Deployment preparation completed!');
    log.info('📝 For detailed deployment instructions, check the DEPLOYMENT.md file.');
    
  } catch (error) {
    log.error('❌ Deployment process failed:');
    log.error(error.message);
    process.exit(1);
  }
}

// Run the deployment
deploy();