# Fixing "Cannot GET" Error on Koyeb Deployment

This guide explains how to fix the "Cannot GET" error that occurs when deploying SPAs (Single Page Applications) like EduMaster to Koyeb.

## 🎯 Problem Explanation

The "Cannot GET /" or "Cannot GET /some-route" error occurs because:

1. **SPA Routing**: React applications use client-side routing
2. **Server Misconfiguration**: Koyeb doesn't know how to handle routes - it tries to find server-side files that don't exist
3. **Missing Redirect Rules**: All routes need to be redirected to index.html for the SPA to handle

## 🔧 Solutions Applied

### 1. Updated koyeb.yaml
Added explicit routing rules:
```yaml
routes:
  - path: "/*"
    dest: "/"
  - path: "/"
    dest: "/index.html"
```

### 2. Enhanced koyeb.toml
Added comprehensive redirect rules:
```toml
[[redirects]]
  from = "/"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Updated Vite Configuration
Added base path configuration:
```javascript
export default defineConfig({
  base: './',
  // ... other config
});
```

## 📋 Files Modified

1. **koyeb.yaml** - Added proper routing configuration
2. **koyeb.toml** - Enhanced redirect rules
3. **vite.config.ts** - Added base path configuration

## 🚀 Redeployment Steps

1. **Push Changes to GitHub** (if using GitHub integration):
   ```bash
   git add .
   git commit -m "Fix Koyeb routing issues"
   git push origin main
   ```

2. **Manual Redeployment** (if uploading manually):
   - Run `npm run build`
   - Upload the contents of the `dist` folder
   - Ensure Koyeb is configured to use the routing rules

## 🔍 Verification Process

After redeployment:
1. Wait 2-3 minutes for Koyeb to process the changes
2. Visit your root URL (e.g., https://your-app.koyeb.app/)
3. Try navigating to different routes like /admin or /batches
4. Check that all pages load without "Cannot GET" errors

## 🛠️ Additional Troubleshooting

If the issue persists:

### 1. Check Koyeb Dashboard
- Verify deployment completed successfully
- Check logs for any errors
- Confirm routing rules are applied

### 2. Verify Build Output
- Ensure `dist` folder contains `index.html`
- Check that assets are properly bundled

### 3. Test Locally
- Run `npm run preview` to test the built version locally
- Verify routing works in the local preview

## 📞 Support Resources

If you continue to experience issues:
1. Check Koyeb documentation: https://www.koyeb.com/docs
2. Review deployment logs in Koyeb dashboard
3. Contact Koyeb support through your dashboard

## 🎉 Expected Outcome

After applying these fixes and redeploying, your EduMaster application should:
- Load the main page without "Cannot GET" errors
- Handle all client-side routes properly
- Maintain the token authentication system
- Work correctly on all pages and navigation paths

The fixes ensure that Koyeb properly redirects all requests to your index.html file, allowing your React application to handle routing client-side.