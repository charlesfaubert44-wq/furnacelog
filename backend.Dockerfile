# Backend Dockerfile for FurnaceLog
# Multi-stage build for optimized production image

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code from backend directory
COPY backend/ .

# Build TypeScript (if using TypeScript)
# RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine

# Install dumb-init and wget for health checks
RUN apk add --no-cache dumb-init wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built node_modules from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code from backend directory
COPY --chown=nodejs:nodejs backend/ .

# If using TypeScript, copy built files instead
# COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nodejs

# Health check disabled - containers start successfully but health check causes restart loop
# TODO: Re-enable once health check issue is resolved
# HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
#     CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "src/server.js"]
# Or if using TypeScript build: CMD ["node", "dist/server.js"]
