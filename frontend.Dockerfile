# Frontend Dockerfile for FurnaceLog
# Multi-stage build for optimized production image

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_APP_NAME=FurnaceLog

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME

# Build the React app
RUN npm run build

# Stage 2: Production stage with nginx
FROM nginx:alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy PWA service worker and manifest
COPY --from=builder /app/dist/sw.js /usr/share/nginx/html/sw.js
COPY --from=builder /app/dist/manifest.json /usr/share/nginx/html/manifest.json

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
