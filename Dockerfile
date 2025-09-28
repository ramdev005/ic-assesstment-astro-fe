# Multi-stage build for production optimization
FROM node:20.12.2-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.4.0

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Accept all environment variables at build time and expose to the build process
ARG PUBLIC_API_URL
ARG PUBLIC_APP_NAME
ARG PUBLIC_APP_VERSION
ARG PUBLIC_ANALYTICS_ID
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_APP_NAME=${PUBLIC_APP_NAME}
ENV PUBLIC_APP_VERSION=${PUBLIC_APP_VERSION}
ENV PUBLIC_ANALYTICS_ID=${PUBLIC_ANALYTICS_ID}

# Build the application (Astro/Vite will read PUBLIC_* from env at build time)
RUN pnpm run build

# Production stage
FROM node:20.12.2-alpine AS production

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.4.0

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S astro -u 1001

# Change ownership of the app directory
RUN chown -R astro:nodejs /app
USER astro

# Expose port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
