# Production-ready Dockerfile - builds locally and copies dist
FROM node:20.12.2-alpine AS production

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9.4.0

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies (including serve)
RUN pnpm install --frozen-lockfile --prod

# Copy pre-built application from local build
# Note: Make sure to run 'pnpm run build' locally before building Docker image
COPY dist ./dist

# Copy serve configuration
COPY serve.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R astro:nodejs /app

# Switch to non-root user
USER astro

# Expose port
EXPOSE 4321

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application using serve with configuration
CMD ["pnpm", "run", "serve"]