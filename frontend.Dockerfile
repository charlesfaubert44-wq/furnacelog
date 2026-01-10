# Frontend Dockerfile for FurnaceLog
# Multi-stage build for optimized production image

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy application code from frontend directory
COPY frontend/ .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_APP_NAME=FurnaceLog

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME

# Build the React app
RUN npm run build

# Stage 2: Production stage with unprivileged nginx
# SECURITY: Use nginx-unprivileged to run as non-root user
FROM nginxinc/nginx-unprivileged:alpine

# Switch to root temporarily to install packages and set permissions
USER root

# Install dumb-init and wget for health checks
RUN apk add --no-cache dumb-init wget

# Copy custom nginx config from root directory
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy PWA service worker and manifest
COPY --from=builder /app/dist/sw.js /usr/share/nginx/html/sw.js
COPY --from=builder /app/dist/manifest.json /usr/share/nginx/html/manifest.json

# Create nginx cache directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/run && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /etc/nginx && \
    chmod -R 755 /usr/share/nginx/html

# Switch back to non-root nginx user (uid 101)
USER nginx

# Expose port 8080 (unprivileged port)
EXPOSE 8080

# Health check on unprivileged port
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx as non-root user
CMD ["nginx", "-g", "daemon off;"]
