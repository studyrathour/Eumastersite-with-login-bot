# Netlify Deployment Guide for EduMaster

This guide provides step-by-step instructions for deploying your EduMaster educational platform to Netlify.

## 📋 Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com/))
2. The `edumaster-deploy.zip` file (already created in your project directory)

## 🚀 Deployment Methods

### Method 1: Drag and Drop Deployment (Easiest)

1. **Visit Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Sign in to your account

2. **Create a New Site**
   - Click the "Sites" tab in the top navigation
   - Drag and drop the `edumaster-deploy.zip` file from your project directory onto the deployment area
   - Netlify will automatically deploy your site

3. **Configure Site Settings**
   - After deployment, click on your new site
   - Go to "Site settings" > "Domain management" to set a custom domain (optional)
   - Your site will be available at a URL like `https://your-site-name.netlify.app`

### Method 2: GitHub Integration (Recommended for automatic deployments)

1. **Push Your Code to GitHub**
   - Create a new repository on GitHub
   - Push your local code to the repository:
     ```bash
     git add .
     git commit -m "Prepare for Netlify deployment"
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git push -u origin main
     ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Click "New site from Git"
   - Select "GitHub" and authorize Netlify to access your repositories
   - Select your EduMaster repository

3. **Configure Build Settings**
   - Netlify should automatically detect your settings from `netlify.toml`:
     - Build command: `npm install && npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **Monitor Deployment**
   - Watch the build logs in the "Deploys" tab
   - Your site will be available at a URL like `https://your-site-name.netlify.app`

## ⚙️ Configuration Details

### Netlify.toml Configuration
Your project already includes a `netlify.toml` file with the correct settings:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

This configuration:
- Sets Node.js version to 20
- Uses `npm install && npm run build` as the build command
- Publishes the `dist` directory
- Sets up SPA routing with redirect rules
- Adds CORS headers for API calls

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to your site in the Netlify dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your domain

### Environment Variables (If Needed)
1. Go to your site in the Netlify dashboard
2. Click "Site settings" > "Environment variables"
3. Add any required environment variables

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure Node.js version 20 is specified in netlify.toml
   - Check that all dependencies are listed in package.json
   - Verify the build command is correct

2. **Routing Issues**
   - The redirect rule in netlify.toml should handle SPA routing
   - If you still have issues, check that the redirect rule is applied

3. **Asset Loading Problems**
   - Verify that the `base: './'` setting is in vite.config.ts
   - Check that assets are correctly referenced in index.html

### Checking Deployment Logs
1. Go to your site in the Netlify dashboard
2. Click the "Deploys" tab
3. Click on the latest deployment
4. Review the build logs for any errors

## 🔄 Redeployment

### For Drag and Drop Method
1. Rebuild your project locally:
   ```bash
   npm run build
   ```
2. Create a new zip file of the dist folder
3. Drag and drop the new zip file to your Netlify site

### For GitHub Integration
1. Push changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
2. Netlify will automatically detect changes and redeploy

## 🎉 Success!

After deployment, your EduMaster application should be accessible at your Netlify URL. The application includes:

- Token-based authentication system
- Admin panel access
- Course management features
- Live class integration
- Responsive design for all devices

## 📞 Support

If you encounter any issues:

1. Check the Netlify documentation: https://docs.netlify.com/
2. Review the deployment logs in your Netlify dashboard
3. Verify your netlify.toml configuration
4. Contact Netlify support through their website

Your EduMaster platform is now ready to be deployed to Netlify using either the drag-and-drop method or GitHub integration!# Netlify Deployment Guide for EduMaster

This guide provides step-by-step instructions for deploying your EduMaster educational platform to Netlify.

## 📋 Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com/))
2. The `edumaster-deploy.zip` file (already created in your project directory)

## 🚀 Deployment Methods

### Method 1: Drag and Drop Deployment (Easiest)

1. **Visit Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Sign in to your account

2. **Create a New Site**
   - Click the "Sites" tab in the top navigation
   - Drag and drop the `edumaster-deploy.zip` file from your project directory onto the deployment area
   - Netlify will automatically deploy your site

3. **Configure Site Settings**
   - After deployment, click on your new site
   - Go to "Site settings" > "Domain management" to set a custom domain (optional)
   - Your site will be available at a URL like `https://your-site-name.netlify.app`

### Method 2: GitHub Integration (Recommended for automatic deployments)

1. **Push Your Code to GitHub**
   - Create a new repository on GitHub
   - Push your local code to the repository:
     ```bash
     git add .
     git commit -m "Prepare for Netlify deployment"
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git push -u origin main
     ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Click "New site from Git"
   - Select "GitHub" and authorize Netlify to access your repositories
   - Select your EduMaster repository

3. **Configure Build Settings**
   - Netlify should automatically detect your settings from `netlify.toml`:
     - Build command: `npm install && npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **Monitor Deployment**
   - Watch the build logs in the "Deploys" tab
   - Your site will be available at a URL like `https://your-site-name.netlify.app`

## ⚙️ Configuration Details

### Netlify.toml Configuration
Your project already includes a `netlify.toml` file with the correct settings:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

This configuration:
- Sets Node.js version to 20
- Uses `npm install && npm run build` as the build command
- Publishes the `dist` directory
- Sets up SPA routing with redirect rules
- Adds CORS headers for API calls

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to your site in the Netlify dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your domain

### Environment Variables (If Needed)
1. Go to your site in the Netlify dashboard
2. Click "Site settings" > "Environment variables"
3. Add any required environment variables

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure Node.js version 20 is specified in netlify.toml
   - Check that all dependencies are listed in package.json
   - Verify the build command is correct

2. **Routing Issues**
   - The redirect rule in netlify.toml should handle SPA routing
   - If you still have issues, check that the redirect rule is applied

3. **Asset Loading Problems**
   - Verify that the `base: './'` setting is in vite.config.ts
   - Check that assets are correctly referenced in index.html

### Checking Deployment Logs
1. Go to your site in the Netlify dashboard
2. Click the "Deploys" tab
3. Click on the latest deployment
4. Review the build logs for any errors

## 🔄 Redeployment

### For Drag and Drop Method
1. Rebuild your project locally:
   ```bash
   npm run build
   ```
2. Create a new zip file of the dist folder
3. Drag and drop the new zip file to your Netlify site

### For GitHub Integration
1. Push changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
2. Netlify will automatically detect changes and redeploy

## 🎉 Success!

After deployment, your EduMaster application should be accessible at your Netlify URL. The application includes:

- Token-based authentication system
- Admin panel access
- Course management features
- Live class integration
- Responsive design for all devices

## 📞 Support

If you encounter any issues:

1. Check the Netlify documentation: https://docs.netlify.com/
2. Review the deployment logs in your Netlify dashboard
3. Verify your netlify.toml configuration
4. Contact Netlify support through their website

Your EduMaster platform is now ready to be deployed to Netlify using either the drag-and-drop method or GitHub integration!