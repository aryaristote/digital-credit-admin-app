# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install NestJS CLI globally for build
RUN npm install -g @nestjs/cli

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3002

# Start the application
CMD ["node", "dist/main"]
