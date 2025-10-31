# All Ports Updated

## Changes Made

1. **Backend** (`backend/src/main.ts`):

   - Default port: 9000
   - CORS updated to include `http://localhost:9001`

2. **Frontend** (`frontend/vite.config.ts`):

   - Port: 9001

3. **Frontend Dockerfile**:

   - Port exposed: 9001
   - CMD updated to use port 9001

4. **Docker Compose**:
   - Backend port: 9000
   - Frontend port: 9001 (mapped to internal 5174)

## Port Configuration

- **PostgreSQL**: 5433
- **Backend**: 9000
- **Frontend**: 9001

## Restart Docker

```bash
docker compose down
docker compose up
```

Now everything will run on the new ports!
