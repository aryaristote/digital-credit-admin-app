# Rebuild Docker Containers

## Problem

The backend is still showing port 3002 even though we changed it to 9000. This is because Docker is using cached images.

## Solution: Rebuild Containers

You need to **rebuild** the containers to apply the changes:

```bash
# Stop and remove containers
docker compose down

# Rebuild and start (no cache to ensure fresh build)
docker compose up --build --force-recreate
```

This will:

1. Rebuild all containers from scratch
2. Use the updated code with new ports
3. Start everything fresh

## Alternative: Just Rebuild Backend

If you only want to rebuild the backend:

```bash
docker compose up --build backend
```

## After Rebuild

You should see:

- Backend on port 9000
- Frontend on port 9001
- PostgreSQL on port 5433
