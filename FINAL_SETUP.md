# Final Docker Setup

## What's Running

Docker will now run all three services:

1. **PostgreSQL** - Database on port 5433
2. **Backend** - API on port 3002
3. **Frontend** - UI on port 5174

## How to Start

```bash
docker compose up
```

This will start everything in Docker!

## Access Points

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3002/api/v1
- **Swagger Docs**: http://localhost:3002/api/v1/docs
- **Database**: localhost:5433

## Everything is in Docker now!

No need to run anything locally - just `docker compose up`!
