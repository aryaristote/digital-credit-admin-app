# Docker Setup Guide

This guide explains how to run the admin application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd admin-app
   ```

2. **Start all services**:

   ```bash
   docker-compose up
   ```

   This will start:

   - PostgreSQL database on port 5432
   - Backend API on port 3002
   - Frontend application on port 5174

3. **Access the application**:
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3002/api/v1
   - API Documentation: http://localhost:3002/api/v1/docs

## Available Commands

### Start services

```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Start and rebuild images
docker-compose up --build
```

### Stop services

```bash
# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (removes database data)
docker-compose down -v
```

### View logs

```bash
# View all logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f
```

### Execute commands in containers

```bash
# Access backend container shell
docker-compose exec backend sh

# Run npm commands in backend
docker-compose exec backend npm run <command>

# Access database
docker-compose exec postgres psql -U postgres -d digital_credit_client
```

## Development Workflow

### Using Docker for Development

The current setup mounts local code directories into the containers, allowing for hot-reload during development.

1. **Start services**:

   ```bash
   docker-compose up
   ```

2. **Make changes** to your code in the `backend` or `frontend` directories

3. Changes will be automatically reflected:
   - Backend: NestJS watch mode will restart automatically
   - Frontend: Vite will hot-reload the page

### Running Migrations and Seeds

Run database migrations from the backend container:

```bash
docker-compose exec backend npm run migration:run
```

Create an admin user:

```bash
docker-compose exec backend npm run seed:admin
```

## Production Deployment

For production deployment, you should:

1. **Create `.env` file** in the root directory with production values:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Update environment variables** in `docker-compose.yml` for production

3. **Build production images**:

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
   ```

4. **Use a reverse proxy** (nginx) for production

## Troubleshooting

### Database connection issues

- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify database credentials in `.env` files

### Port conflicts

If ports 3002, 5174, or 5432 are already in use:

1. Stop the conflicting service, or
2. Modify port mappings in `docker-compose.yml`

### Container won't start

1. Check logs: `docker-compose logs <service-name>`
2. Rebuild images: `docker-compose build --no-cache`
3. Remove old containers: `docker-compose down && docker-compose up`

### Permission issues (Linux/Mac)

If you encounter permission issues:

```bash
sudo docker-compose up
# or add your user to docker group
sudo usermod -aG docker $USER
```

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. To completely reset:

```bash
docker-compose down -v
```

## Environment Variables

### Backend Environment Variables

Create `backend/.env` file:

```env
NODE_ENV=development
PORT=3002
API_PREFIX=api/v1
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=digital_credit_client
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=15m
```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:3002/api/v1
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vite Documentation](https://vitejs.dev/)
