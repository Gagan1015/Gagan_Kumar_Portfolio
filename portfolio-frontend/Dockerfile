# Multi-stage build for React Frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Add a script to substitute environment variables at runtime
COPY docker/env-config.sh /docker-entrypoint.d/env-config.sh
RUN chmod +x /docker-entrypoint.d/env-config.sh

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start with script that handles PORT
CMD ["/start.sh"]
