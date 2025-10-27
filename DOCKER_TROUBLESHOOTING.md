# Docker Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "nest: not found" Error

**Error Message:**

```
sh: nest: not found, exit code 127
```

**Cause:** NestJS CLI not installed in Docker container.

**Solution:** Already fixed in the Dockerfiles. Both `Dockerfile` and `Dockerfile.dev` now include:

```dockerfile
RUN npm install -g @nestjs/cli
```

**Verification:**

```bash
docker-compose build backend
```

### Issue 2: Wrong Directory Context

**Error Message:**

```
Error response from daemon: failed to create task for container
```

**Cause:** Running Docker Compose from the wrong directory (`client-app` instead of `admin-app`).

**Solution:** Always run commands from the `admin-app` directory:

```bash
# Make sure you're in the correct directory
cd "C:\Users\AriKa\OneDrive - IST\Desktop\Jambo-test\admin-app"

# Verify you're in the right place
pwd  # Should show: /c/Users/AriKa/OneDrive - IST/Desktop/Jambo-test/admin-app

# Now run Docker Compose
docker-compose up --build
```

### Issue 3: Cached Containers Causing Issues

**Symptoms:** Changes not reflected, old errors persisting.

**Solution:** Clean rebuild:

```bash
# Stop and remove containers
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Start fresh
docker-compose up
```

### Issue 4: Port Already in Use

**Error Message:**

```
Bind for 0.0.0.0:3002 failed: port is already allocated
```

**Solution:**

```bash
# Stop all Docker containers
docker stop $(docker ps -aq)

# Or stop specific service
docker stop admin-app-backend

# Verify ports are free
netstat -ano | findstr :3002
netstat -ano | findstr :5174
netstat -ano | findstr :5432
```

### Issue 5: Node Modules Not Installed

**Symptoms:** Module not found errors.

**Solution:**

```bash
# Access the container
docker-compose exec backend sh

# Inside container, reinstall
npm ci
```

## Quick Fix Commands

### Complete Clean Rebuild

```bash
# 1. Stop and remove everything
docker-compose down -v

# 2. Remove all related images
docker images | grep admin-app | awk '{print $3}' | xargs docker rmi -f

# 3. Clean build cache
docker builder prune -f

# 4. Rebuild from scratch
docker-compose build --no-cache

# 5. Start services
docker-compose up
```

### View Logs for Debugging

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 50 lines
docker-compose logs --tail=50
```

### Access Container Shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Database
docker-compose exec postgres psql -U postgres -d digital_credit_client
```

## Verification Checklist

Before reporting issues, verify:

- [ ] Running from correct directory (`admin-app`)
- [ ] Docker Desktop is running
- [ ] Ports 3002, 5174, 5432 are available
- [ ] No old containers running (`docker ps -a`)
- [ ] Using correct Docker Compose file (`docker-compose.yml`)
- [ ] Environment variables are set correctly

## Getting Help

If issues persist:

1. **Check logs:**

   ```bash
   docker-compose logs backend
   ```

2. **Verify Docker setup:**

   ```bash
   docker --version
   docker-compose --version
   ```

3. **Test backend build:**

   ```bash
   docker-compose build backend
   ```

4. **Verify PostgreSQL connection:**
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

## Success Indicators

Your Docker setup is working correctly when you see:

```
✅ Backend: "Listening on port 3002"
✅ Frontend: "Local: http://localhost:5174"
✅ Database: "database system is ready to accept connections"
```

## Recommended Development Workflow

1. **Initial setup:**

   ```bash
   docker-compose up --build
   ```

2. **During development:**

   - Files are automatically synced via volumes
   - Backend auto-restarts on code changes
   - Frontend hot-reloads on changes

3. **When adding dependencies:**

   ```bash
   # Stop containers
   docker-compose down

   # Rebuild with new dependencies
   docker-compose up --build
   ```

4. **Before committing:**

   ```bash
   # Clean up
   docker-compose down

   # Verify build works
   docker-compose up --build
   ```
