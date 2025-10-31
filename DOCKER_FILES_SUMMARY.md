# Docker Configuration Files Summary

## 📁 Root Directory

### `docker-compose.yml`

Main Docker Compose configuration for development environment.

- PostgreSQL database service
- Backend NestJS service (with hot-reload)
- Frontend React/Vite service (with hot-reload)
- Network configuration
- Volume configuration for data persistence

### `docker-compose.prod.yml`

Production override file for Docker Compose.

- Optimized production builds
- Nginx for frontend serving
- Production environment settings

### `.dockerignore`

Root-level Docker ignore file to exclude unnecessary files from builds.

### `DOCKER_SETUP.md`

Comprehensive guide for Docker setup and usage.

### `DOCKER_QUICK_START.md`

Quick reference guide for common Docker commands.

---

## 📁 Backend Directory (`backend/`)

### `Dockerfile`

Production Dockerfile for the backend.

- Multi-stage build (builder + production)
- Optimized for production
- Only production dependencies
- Runs built application

### `Dockerfile.dev`

Development Dockerfile for the backend.

- Includes all dependencies (dev + prod)
- Supports hot-reload
- Uses `npm run dev` for auto-restart on changes

### `.dockerignore`

Backend-specific Docker ignore file.

### `.env.example` (to be created)

Example environment variables for backend configuration.

---

## 📁 Frontend Directory (`frontend/`)

### `Dockerfile`

Development Dockerfile for the frontend.

- Vite development server
- Hot module replacement (HMR)
- Exposed on port 5174

### `Dockerfile.prod`

Production Dockerfile for the frontend.

- Multi-stage build (builder + nginx)
- Nginx for serving static files
- Optimized production build
- API proxy configuration

### `nginx.conf`

Nginx configuration for production frontend.

- Serves React application
- Proxies API requests to backend
- Caching and security headers
- Gzip compression

### `.dockerignore`

Frontend-specific Docker ignore file.

### `.env.example` (to be created)

Example environment variables for frontend configuration.

---

## 🚀 Quick Start

### Development

```bash
docker-compose up --build
```

### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

### Stop Services

```bash
docker-compose down
```

---

## 📋 Services Overview

1. **PostgreSQL** (port 5432)

   - Database service
   - Persistent data storage
   - Health checks configured

2. **Backend** (port 3002)

   - NestJS API
   - Swagger documentation at `/api/v1/docs`
   - JWT authentication
   - TypeORM for database

3. **Frontend** (port 5174)
   - React application
   - Vite for development
   - Nginx for production
   - API proxy configuration

---

## 🔧 Environment Variables

### Backend

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3002)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `JWT_SECRET` - JWT secret key
- `API_PREFIX` - API prefix (default: api/v1)

### Frontend

- `VITE_API_URL` - Backend API URL

---

## 📝 Notes

- All services are connected via Docker network
- Volume mounts enable hot-reload in development
- Database data persists in Docker volume
- Production frontend serves via Nginx on port 80
- Backend health depends on PostgreSQL readiness
