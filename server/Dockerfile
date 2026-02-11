# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Dependencies stage
FROM base AS dependencies

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Production dependencies stage
FROM base AS production-dependencies

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Build stage (optional, for TypeScript projects)
FROM dependencies AS build

COPY . .

# If you have a build step, uncomment:
# RUN npm run build

# Production stage
FROM base AS production

# Set NODE_ENV
ENV NODE_ENV=production

WORKDIR /app

# Copy production dependencies
COPY --from=production-dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads && \
    chown -R nodejs:nodejs uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "server.js"]
