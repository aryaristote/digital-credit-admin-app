# New Port Configuration

## Updated Ports

I've changed the ports to avoid conflicts:

1. **PostgreSQL**: 5433 (unchanged)
2. **Backend**: 9000 (changed from 3002)
3. **Frontend**: 9001 (changed from 5174)

## Access Points

- **Frontend**: http://localhost:9001
- **Backend API**: http://localhost:9000/api/v1
- **Backend Swagger**: http://localhost:9000/api/v1/docs
- **Database**: localhost:5433

## Changes Made

1. Updated `docker-compose.yml`:

   - Backend PORT environment variable: 9000
   - Backend port mapping: `9000:9000`
   - Frontend port mapping: `9001:5174`
   - Frontend VITE_API_URL: `http://backend:9000/api/v1`

2. Updated `frontend/vite.config.ts`:
   - Proxy target: `http://backend:9000`

## Run Docker

```bash
docker compose up
```

These ports (9000, 9001) are much less likely to conflict with other services!
