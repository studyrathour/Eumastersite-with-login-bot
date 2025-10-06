# Deployment Guide for EduMaster

This guide provides detailed instructions for deploying the EduMaster educational platform to various hosting platforms, with a focus on Koyeb.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Building the Project](#building-the-project)
3. [Deploying to Koyeb](#deploying-to-koyeb)
4. [Deploying to Other Platforms](#deploying-to-other-platforms)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v16 or higher) installed on your system
2. **Git** installed and configured
3. **npm** or **yarn** package manager
4. An account on your chosen deployment platform (Koyeb, Netlify, Vercel, etc.)
5. The EduMaster project repository cloned locally

## Building the Project

Before deploying to any platform, you need to build the project:

```bash
# Navigate to the project directory
cd edumaster40-main

# Install dependencies
npm install

# Build the project
npm run build
```

This will create a `dist` folder containing all the optimized static files ready for deployment.

## Deploying to Koyeb

### Method 1: Using Koyeb Dashboard (Recommended for first deployment)

1. **Create a Koyeb Account**
   - Go to [koyeb.com](https://www.koyeb.com/) and sign up for an account
   - Verify your email address

2. **Prepare Your Project**
   - Ensure you've built the project with `npm run build`
   - The `dist` folder should contain all the built files

3. **Deploy via Dashboard**
   - Log in to your Koyeb dashboard
   - Click on "Create App"
   - Select "Static Site" as the app type
   - Choose your deployment method:
     - **GitHub Integration**: Connect your GitHub repository
     - **Manual Upload**: Upload the contents of the `dist` folder
     - **Git Repository**: Provide the Git repository URL

4. **Configure Your App**
   - **App Name**: Choose a name for your app (e.g., "edumaster")
   - **Branch**: Select the branch to deploy (usually "main" or "master")
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add any required environment variables (if applicable)

5. **Deploy**
   - Click "Deploy" to start the deployment process
   - Wait for the build and deployment to complete
   - Your app will be available at the provided URL

### Method 2: Using Koyeb CLI (For subsequent deployments)

1. **Install Koyeb CLI**
   - Visit the [Koyeb CLI installation guide](https://www.koyeb.com/docs/cli/installation)
   - Follow the instructions for your operating system

2. **Login to Koyeb**
   ```bash
   koyeb login
   ```
   - Follow the prompts to authenticate with your Koyeb account

3. **Deploy Using the Provided Script**
   ```bash
   npm run deploy:koyeb
   ```

### Method 3: Manual Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Navigate to your Koyeb dashboard
   - Create a new Static Site app
   - Choose "Manual Upload"
   - Upload all files from the `dist` folder
   - Deploy the app

## Deploying to Other Platforms

### Netlify

The project already includes a `netlify.toml` configuration file:

1. Go to [netlify.com](https://www.netlify.com/) and sign up
2. Connect your GitHub repository or drag and drop the `dist` folder
3. Netlify will automatically detect the build settings
4. Click "Deploy"

### Vercel

1. Go to [vercel.com](https://vercel.com/) and sign up
2. Import your Git repository or upload the `dist` folder
3. Set the build command to `npm run build`
4. Set the output directory to `dist`
5. Deploy the project

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Update the firebase.json file:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are installed: `npm install`
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`

2. **Deployment Errors**
   - Verify all environment variables are set correctly
   - Check file permissions
   - Ensure the `dist` folder contains all necessary files

3. **Performance Issues**
   - Check the network tab in browser dev tools for slow-loading resources
   - Optimize images and assets
   - Consider code splitting for large bundles

4. **Routing Issues**
   - Ensure your hosting platform supports SPA routing
   - For Koyeb, configure redirects to index.html for client-side routing

### Koyeb-Specific Troubleshooting

1. **Static Files Not Loading**
   - Check that the publish directory is set to `dist`
   - Verify all assets are included in the build

2. **Environment Variables**
   - Set environment variables in the Koyeb dashboard under your app settings
   - Access them in your code using `process.env.VARIABLE_NAME`

3. **Custom Domain**
   - Add your custom domain in the Koyeb dashboard
   - Update DNS records as instructed

### Support

For additional help:
- Check the [Koyeb documentation](https://www.koyeb.com/docs)
- Review the project's [README.md](README.md) file
- Create an issue in the GitHub repository