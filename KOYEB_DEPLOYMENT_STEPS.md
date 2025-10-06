# How to Deploy EduMaster to Koyeb

This document provides step-by-step instructions for deploying the EduMaster educational platform to Koyeb.

## Prerequisites

1. A Koyeb account (sign up at [koyeb.com](https://www.koyeb.com/))
2. Git installed on your system
3. Node.js (v16 or higher) installed on your system
4. This EduMaster project repository

## Deployment Steps

### Step 1: Prepare the Project

1. Navigate to the project directory:
   ```bash
   cd edumaster40-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

   This creates a `dist` folder with all the optimized static files.

### Step 2: Deploy Using Koyeb Dashboard

1. **Log in to Koyeb**
   - Go to [koyeb.com](https://www.koyeb.com/) and log in to your account

2. **Create a New App**
   - Click on the "Create App" button in your dashboard
   - Select "Static Site" as the app type

3. **Choose Deployment Method**
   You have two options:
   
   **Option A: GitHub Integration (Recommended for automatic deployments)**
   - Click on "GitHub" as the deployment method
   - Connect your GitHub account if not already connected
   - Select the repository containing your EduMaster project
   - Select the branch you want to deploy (usually "main")
   
   **Option B: Manual Upload (For one-time deployment)**
   - Click on "Manual" as the deployment method
   - Upload the contents of the `dist` folder from your project

4. **Configure Your App**
   - **App Name**: Enter a name for your app (e.g., "edumaster")
   - **Region**: Select the region closest to your users
   - **Environment Variables**: Leave empty for EduMaster (not required)
   - **Build Command**: `npm run build` (if using GitHub integration)
   - **Publish Directory**: `dist`

5. **Deploy**
   - Click the "Deploy" button
   - Wait for the build process to complete (this may take a few minutes)
   - Once completed, your app will be available at the provided URL

### Step 3: Verify Deployment

1. Visit your deployed application URL
2. Test the token authentication system
3. Verify that all pages load correctly
4. Check that the navigation works properly

## Updating Your Deployment

### For GitHub Integration

1. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. Koyeb will automatically detect the changes and start a new deployment

### For Manual Upload

1. Rebuild the project:
   ```bash
   npm run build
   ```

2. Upload the new contents of the `dist` folder through the Koyeb dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are correctly installed
   - Check that the Node.js version is compatible
   - Clear npm cache: `npm cache clean --force`

2. **Deployment Errors**
   - Verify that the publish directory is set to `dist`
   - Check that all required files are included in the build

3. **Token Authentication Not Working**
   - Verify that the API endpoints in `src/utils/auth.ts` are correctly configured
   - Check the browser console for any error messages
   - Ensure that CORS is properly configured on your backend

### Koyeb-Specific Issues

1. **Custom Domain**
   - Add your custom domain in the Koyeb dashboard under your app settings
   - Update DNS records as instructed by Koyeb

2. **Environment Variables**
   - Set environment variables in the Koyeb dashboard under your app settings
   - Access them in your code using `import.meta.env.VARIABLE_NAME`

## Support

For additional help with deployment:
- Check the [Koyeb documentation](https://www.koyeb.com/docs)
- Review the project's [README.md](README.md) file
- Check the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) guide
- Create an issue in the GitHub repository