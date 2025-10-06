# Docker Deployment Guide

This guide explains how to deploy the EduMaster application using the provided Dockerfile, which is compatible with Koyeb, Netlify, and Vercel.

## Dockerfile Overview

The Dockerfile uses a multi-stage build process:

1. **Builder Stage**: Uses Node.js 20 Alpine to build the React application
2. **Runtime Stage**: Uses Nginx Alpine to serve the built application

This approach results in a smaller, more efficient Docker image.

## Deployment to Koyeb

Koyeb supports Docker deployments natively. To deploy using the Dockerfile:

1. Ensure the Dockerfile and nginx.conf are in your repository root
2. Connect your GitHub repository to Koyeb or upload your code manually
3. Select "Docker" as the deployment method
4. Koyeb will automatically detect and use the Dockerfile

The application will be available at port 80, which is configured in the koyeb.yaml file.

## Deployment to Netlify

Netlify primarily supports static site deployments, but you can use the Dockerfile with Netlify's compute functions or by using Netlify's build system directly:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# The dist folder can be deployed directly to Netlify
```

## Deployment to Vercel

Similar to Netlify, Vercel is primarily designed for static site deployments. You can deploy using Vercel's build system:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# The dist folder can be deployed directly to Vercel
```

## Manual Docker Build

If you want to build and run the Docker image locally:

```bash
# Build the Docker image
docker build -t edumaster .

# Run the container
docker run -p 8080:80 edumaster
```

The application will be available at http://localhost:8080

## Nginx Configuration

The nginx.conf file is optimized for Single Page Applications (SPAs) and includes:

1. Proper routing for React Router (all routes redirect to index.html)
2. Cache headers for static assets
3. Efficient file serving

## .dockerignore

The .dockerignore file excludes unnecessary files from the Docker build context, resulting in faster builds and smaller images.