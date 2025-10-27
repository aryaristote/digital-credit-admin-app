# Docker Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- Ports 3002, 5174, and 5432 available

## Quick Start (3 Commands)

1. **Build and start all services**:

   ```bash
   docker-compose up --build
   ```

2. **Access the application**:

   - Frontend: http://localhost:5432
   - Backend API: http://localhost:5430/api/v1
   - API Docs: http://localhost:5430/api/v1/docs

3. **Stop services**:
   ```bash
   docker-compose down
   ```

## Services

The Docker setup includes:

- **PostgreSQL** - Database (port 5433, internal 5432)
- **Backend** - NestJS API (port 5430)
- **Frontend** - React + Vite (port 5432, internal 5174)

## Development Features

- ✅ Hot-reload for both frontend and backend
- ✅ Code changes reflected automatically
- ✅ Database persistence with volumes
- ✅ All services run in isolated containers

## Common Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Remove containers and volumes
docker-compose down -v

# Execute commands in containers
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed:admin
```

## Troubleshooting

**Port already in use?**

- Stop any running services on ports 5430, 5432, or 5433
- Or modify ports in `docker-compose.yml`

**Container won't start?**

```bash
# Clean rebuild
docker-compose down -v
docker-compose up --build
```

**Need to reset database?**

```bash
docker-compose down -v
docker-compose up
```

## Production Deployment

For production, use:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

For more details, see `DOCKER_SETUP.md`.
