# Koyeb Deployment Troubleshooting Guide

This guide helps you resolve common issues when deploying the EduMaster educational platform to Koyeb.

## Common Koyeb Deployment Issues and Solutions

### 1. "No active service" Error

**Problem**: Your app shows "No active service" or "Your request landed on a Koyeb Edge location. The Koyeb serverless platform didn't find any active service to route the request to."

**Solutions**:
1. **Check deployment status**: Go to your Koyeb dashboard and verify that your app has finished deploying
2. **Wait for health checks**: It may take a few minutes for Koyeb to detect your service as healthy
3. **Verify configuration files**: Ensure your koyeb.yaml and koyeb.toml files are correctly configured
4. **Check build logs**: Review the build logs in your Koyeb dashboard for any errors
5. **Redeploy**: Try redeploying your application

### 2. Build Failures

**Problem**: Your deployment fails during the build process

**Solutions**:
1. **Check Node.js version**: Ensure you're using a compatible Node.js version (16+)
2. **Verify dependencies**: Make sure all dependencies in package.json are correct
3. **Check build command**: Ensure your build command is `npm run build`
4. **Review build logs**: Look for specific error messages in the build logs
5. **Test locally**: Run `npm run build` locally to verify it works

### 3. 404 Errors on Routes

**Problem**: Navigating to specific routes (like /admin) shows 404 errors

**Solutions**:
1. **SPA routing configuration**: Ensure your koyeb.toml includes proper redirect rules:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. **Rebuild and redeploy**: Make sure you've rebuilt the project with the correct routing configuration

### 4. Missing Static Assets

**Problem**: CSS, JavaScript, or image files are not loading

**Solutions**:
1. **Check dist folder**: Verify that your dist folder contains all necessary assets
2. **Base URL configuration**: Ensure your Vite configuration has the correct base URL
3. **Rebuild project**: Run `npm run build` again to regenerate assets

### 5. CORS Errors

**Problem**: API calls fail with CORS errors

**Solutions**:
1. **Add CORS headers**: Ensure your koyeb.toml includes CORS headers:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       Access-Control-Allow-Origin = "*"
   ```
2. **Check API endpoints**: Verify that your API endpoints are correctly configured in src/utils/auth.ts

## Step-by-Step Resolution Process

### Step 1: Check Deployment Status
1. Log in to your Koyeb dashboard
2. Navigate to your app
3. Check the deployment status (Building, Deploying, Healthy, Error)
4. If still deploying, wait a few minutes

### Step 2: Review Build Logs
1. In your Koyeb dashboard, click on the deployment
2. Check the build logs for any error messages
3. Look for dependency installation issues
4. Check for build script failures

### Step 3: Verify Configuration Files
1. Check that koyeb.yaml exists and is properly formatted
2. Verify that koyeb.toml includes proper routing and headers
3. Ensure package.json has correct build scripts

### Step 4: Test Locally
1. Run `npm run build` locally
2. Verify the dist folder is created correctly
3. Test the built version with `npm run preview`

### Step 5: Redeploy
1. Make any necessary fixes
2. Commit and push changes to GitHub (if using GitHub integration)
3. Or manually redeploy the dist folder

## Koyeb Dashboard Navigation

1. **View App Status**: Apps > [Your App Name]
2. **Check Deployments**: Apps > [Your App Name] > Deployments
3. **View Logs**: Apps > [Your App Name] > Deployments > [Deployment] > Logs
4. **Check Domains**: Apps > [Your App Name] > Domains
5. **View Settings**: Apps > [Your App Name] > Settings

## Common Configuration Issues

### Incorrect koyeb.yaml
```yaml
# Correct format
name: edumaster
service_type: static
routes:
  - path: "/*"
    dest: "/"
ports:
  - port: 80
    protocol: http
regions:
  - was
```

### Missing Redirect Rules in koyeb.toml
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Incorrect Build Command
- Correct: `npm run build`
- Incorrect: `npm build` or `vite build` (without npm run)

## Contact Support

If you're still experiencing issues:

1. **Koyeb Documentation**: https://www.koyeb.com/docs
2. **Koyeb Community**: https://community.koyeb.com/
3. **Support Ticket**: Through your Koyeb dashboard
4. **GitHub Issues**: In your repository

## Additional Tips

1. **Be Patient**: First deployments can take longer as Koyeb provisions resources
2. **Check Regions**: Ensure you're deploying to a region that's available to you
3. **Monitor Resources**: Check if your app is exceeding resource limits
4. **Use Environment Variables**: For sensitive configuration data
5. **Enable Health Checks**: Configure proper health check endpoints

## Emergency Actions

If your app is down and users are affected:

1. **Rollback**: Deploy a previous working version
2. **Check Incidents**: Look for any Koyeb service incidents
3. **Contact Support**: Reach out to Koyeb support immediately
4. **Have a Backup Plan**: Consider having a backup deployment on another platform