# Docker Setup Complete

## What Changed

1. **Removed frontend from Docker** - Run frontend locally instead
2. **Updated backend port** to 3002 (matching your local setup)

## How to Run

### Docker (Backend + Database)

```bash
docker compose up
```

This will start:

- PostgreSQL on port 5433
- Backend on port 3002

### Frontend (Local)

Open a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on port 5174

## Frontend Proxy

The frontend proxy in `vite.config.ts` points to `http://localhost:3002`, so it will connect to the Docker backend!

## Summary

- **Docker**: Backend + PostgreSQL only
- **Local**: Frontend only
- **Ports**: Backend 3002, Frontend 5174

Try it now!
