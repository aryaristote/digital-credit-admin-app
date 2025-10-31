# Frontend Dockerfile (Development)
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose the port
EXPOSE 9001

# Start the development server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "9001"]
