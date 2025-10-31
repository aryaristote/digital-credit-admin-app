# Docker Frontend Debugging Guide

## Step 1: Check if containers are running

```bash
# Check all containers
docker ps -a

# Check specific containers
docker ps -a | grep digital-credit
```

## Step 2: Check container logs

```bash
# Check frontend logs
docker logs digital-credit-frontend

# Check backend logs
docker logs digital-credit-backend

# Follow logs in real-time
docker logs -f digital-credit-frontend
```

## Step 3: Test container connectivity

```bash
# Test if frontend container is responding
docker exec digital-credit-frontend wget -qO- http://localhost:3000

# Test if nginx is running inside container
docker exec digital-credit-frontend nginx -t

# Check nginx status
docker exec digital-credit-frontend ps aux | grep nginx
```

## Step 4: Check port binding

```bash
# Check what's listening on port 3000
netstat -tulpn | grep :3000

# On Windows
netstat -an | findstr :3000
```

## Step 5: Test direct container access

```bash
# Get container IP
docker inspect digital-credit-frontend | grep IPAddress

# Test direct container IP (replace with actual IP)
curl http://<container-ip>:3000
```

## Step 6: Rebuild and restart

```bash
# Stop all containers
docker-compose down

# Rebuild frontend only
docker-compose build frontend

# Start only frontend
docker-compose up frontend

# Or start everything
docker-compose up --build
```

## Common Issues and Solutions

### Issue 1: Container exits immediately

- Check logs: `docker logs digital-credit-frontend`
- Usually means nginx config is invalid or missing files

### Issue 2: Port already in use

- Check what's using port 3000: `netstat -tulpn | grep :3000`
- Kill the process or change port in docker-compose.yml

### Issue 3: Nginx not starting

- Check nginx config: `docker exec digital-credit-frontend nginx -t`
- Check if files exist: `docker exec digital-credit-frontend ls -la /usr/share/nginx/html`

### Issue 4: Wrong nginx config

- The nginx.conf should listen on port 3000
- Make sure it's copied correctly in Dockerfile

## Quick Fix Commands

```bash
# Complete reset
docker-compose down -v
docker system prune -f
docker-compose up --build

# Test individual services
docker-compose up postgres redis
docker-compose up backend
docker-compose up frontend
```
