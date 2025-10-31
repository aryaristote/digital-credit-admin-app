# Docker Troubleshooting Guide

## Common Docker Build Issues

### 1. NestJS CLI Not Found Error

**Error**: `sh: nest: not found, exit code 127`

**Cause**: The NestJS CLI is not available in the production container because only production dependencies are installed.

**Solution**:

- Use the simple Dockerfiles (`Dockerfile.simple`) which install all dependencies during build
- Or ensure dev dependencies are installed in the builder stage

**Files to use**:

- `backend/Dockerfile.simple` - Simple backend Dockerfile
- `frontend/Dockerfile.simple` - Simple frontend Dockerfile

### 2. Vite Build Issues

**Error**: Vite build fails in Docker container

**Cause**: Missing configuration files or incorrect file copying

**Solution**:

- Ensure all config files are copied: `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
- Copy source files in correct order: config files first, then source code

### 3. Port Conflicts

**Error**: Port already in use

**Solution**:

```bash
# Check what's using the port
netstat -tulpn | grep :3005
netstat -tulpn | grep :3000

# Kill processes using the ports
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

### 4. Database Connection Issues

**Error**: Backend can't connect to database

**Solution**:

```bash
# Ensure database is ready before backend starts
docker-compose up postgres
# Wait for "database system is ready to accept connections"
# Then start backend
docker-compose up backend
```

### 5. Permission Issues

**Error**: Permission denied errors

**Solution**:

```bash
# On Linux, run with sudo
sudo docker-compose up

# Or add user to docker group
sudo usermod -aG docker $USER
# Then logout and login again
```

## Testing Docker Builds

### Test Backend Build

```bash
# Test backend build
docker build -f backend/Dockerfile.simple -t digital-credit-backend-test ./backend

# Test backend run
docker run -p 3005:3005 --env-file docker.env digital-credit-backend-test
```

### Test Frontend Build

```bash
# Test frontend build
docker build -f frontend/Dockerfile.simple -t digital-credit-frontend-test ./frontend

# Test frontend run
docker run -p 3000:3000 digital-credit-frontend-test
```

### Test Full Stack

```bash
# Start only database and redis
docker-compose up postgres redis

# Start backend
docker-compose up backend

# Start frontend
docker-compose up frontend
```

## Debugging Commands

### Check Container Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f backend
```

### Access Container Shell

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# Database container
docker-compose exec postgres psql -U postgres -d digital_credit_client
```

### Check Container Status

```bash
# List running containers
docker-compose ps

# Check container health
docker inspect digital-credit-backend | grep -A 10 Health
```

### Rebuild Specific Service

```bash
# Rebuild backend
docker-compose build backend
docker-compose up backend

# Rebuild frontend
docker-compose build frontend
docker-compose up frontend

# Force rebuild (no cache)
docker-compose build --no-cache backend
```

## Environment Variables

### Check Environment Variables

```bash
# Check backend environment
docker-compose exec backend env | grep DB_

# Check frontend environment
docker-compose exec frontend env | grep VITE_
```

### Override Environment Variables

```bash
# Override specific variables
docker-compose up -e DB_HOST=localhost backend
```

## Clean Up

### Remove All Containers and Volumes

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean up everything
docker system prune -a
```

### Reset Everything

```bash
# Stop all containers
docker-compose down -v

# Remove all images
docker rmi $(docker images -q)

# Clean up system
docker system prune -a --volumes
```

## Performance Issues

### Increase Docker Resources

1. Open Docker Desktop
2. Go to Settings > Resources
3. Increase Memory to at least 4GB
4. Increase CPU to at least 2 cores

### Optimize Build Process

```bash
# Use build cache
docker-compose build --parallel

# Use .dockerignore files
# Ensure .dockerignore excludes node_modules, .git, etc.
```

## Health Checks

### Test Health Endpoints

```bash
# Backend health
curl http://localhost:3005/api/v1/health

# Frontend
curl http://localhost:3000

# Database
docker-compose exec postgres pg_isready -U postgres

# Redis
docker-compose exec redis redis-cli ping
```

## Common Solutions

### 1. Complete Reset

```bash
# Stop everything
docker-compose down -v

# Remove all images
docker rmi $(docker images -q)

# Clean system
docker system prune -a

# Rebuild and start
docker-compose up --build
```

### 2. Development Mode

```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up --build
```

### 3. Single Service Debug

```bash
# Start only database
docker-compose up postgres

# Start only backend
docker-compose up backend

# Start only frontend
docker-compose up frontend
```

## File Structure Issues

### Ensure Required Files Exist

```
backend/
├── Dockerfile.simple
├── package.json
├── tsconfig.json
├── nest-cli.json
└── src/

frontend/
├── Dockerfile.simple
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
└── public/
```

### Check .dockerignore Files

Ensure `.dockerignore` files exclude:

- `node_modules`
- `.git`
- `dist`
- `*.log`
- `.env*`
- `coverage`
