# Docker Setup for Digital Credit & Savings Platform

This document provides instructions for running the Digital Credit & Savings Platform using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 4GB RAM available for Docker

## Quick Start

### Production Mode

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Development Mode

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build
```

## Services

### 1. PostgreSQL Database

- **Port**: 5432
- **Database**: digital_credit_client
- **Username**: postgres
- **Password**: postgres
- **Health Check**: Built-in PostgreSQL health check

### 2. Redis Cache

- **Port**: 6379
- **Purpose**: Caching and background job queues
- **Health Check**: Redis ping command

### 3. Backend API

- **Port**: 3005
- **Environment**: Production/Development
- **Health Check**: HTTP endpoint `/api/v1/health`
- **Features**:
  - REST API
  - GraphQL API
  - Swagger Documentation
  - JWT Authentication

### 4. Frontend React App

- **Port**: 3000
- **Environment**: Production/Development
- **Features**:
  - React with Vite
  - Hot reload (development)
  - Nginx serving (production)

### 5. Nginx Reverse Proxy (Production only)

- **Port**: 80 (HTTP), 443 (HTTPS)
- **Purpose**: Load balancing and SSL termination

## Environment Variables

### Backend Environment Variables

| Variable                 | Description              | Default                         |
| ------------------------ | ------------------------ | ------------------------------- |
| `NODE_ENV`               | Environment mode         | `production`                    |
| `PORT`                   | Backend port             | `3005`                          |
| `DB_HOST`                | Database host            | `postgres`                      |
| `DB_PORT`                | Database port            | `5432`                          |
| `DB_USERNAME`            | Database username        | `postgres`                      |
| `DB_PASSWORD`            | Database password        | `postgres`                      |
| `DB_DATABASE`            | Database name            | `digital_credit_client`         |
| `REDIS_HOST`             | Redis host               | `redis`                         |
| `REDIS_PORT`             | Redis port               | `6379`                          |
| `JWT_SECRET`             | JWT secret key           | `your-super-secret-jwt-key`     |
| `JWT_EXPIRES_IN`         | JWT expiration           | `1h`                            |
| `JWT_REFRESH_SECRET`     | Refresh token secret     | `your-super-secret-refresh-key` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d`                            |
| `API_PREFIX`             | API prefix               | `api/v1`                        |
| `FRONTEND_URL`           | Frontend URL             | `http://localhost:3000`         |

### Frontend Environment Variables

| Variable           | Description      | Default                         |
| ------------------ | ---------------- | ------------------------------- |
| `VITE_API_URL`     | Backend API URL  | `http://localhost:3005/api/v1`  |
| `VITE_GRAPHQL_URL` | GraphQL endpoint | `http://localhost:3005/graphql` |

## Docker Commands

### Basic Commands

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up postgres

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend

# Follow logs
docker-compose logs -f backend
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Rebuild specific service
docker-compose -f docker-compose.dev.yml up --build backend

# Execute command in running container
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed

# Access database
docker-compose exec postgres psql -U postgres -d digital_credit_client
```

### Production Commands

```bash
# Build production images
docker-compose build

# Start production environment
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3

# Update services
docker-compose pull
docker-compose up -d
```

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Check specific service health
docker inspect digital-credit-backend | grep -A 10 Health
```

## Data Persistence

### Volumes

- `postgres_data`: PostgreSQL data
- `redis_data`: Redis data
- `postgres_data_dev`: Development PostgreSQL data
- `redis_data_dev`: Development Redis data

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres digital_credit_client > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres digital_credit_client < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3005, 5432, and 6379 are available
2. **Permission issues**: On Linux, you may need to run with `sudo`
3. **Memory issues**: Ensure Docker has at least 4GB RAM allocated
4. **Database connection**: Wait for PostgreSQL to be ready before starting backend

### Debugging

```bash
# Check container logs
docker-compose logs backend

# Access container shell
docker-compose exec backend sh

# Check database connection
docker-compose exec backend npm run test:db

# Restart specific service
docker-compose restart backend
```

### Clean Up

```bash
# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean up everything
docker system prune -a
```

## Security Considerations

1. **Change default passwords** in production
2. **Use environment files** for sensitive data
3. **Enable SSL/TLS** for production
4. **Regular security updates** for base images
5. **Network isolation** using Docker networks

## Performance Optimization

1. **Multi-stage builds** for smaller images
2. **Layer caching** for faster builds
3. **Resource limits** for containers
4. **Health checks** for better monitoring
5. **Volume optimization** for data persistence

## Monitoring

### Logs

```bash
# Centralized logging
docker-compose logs -f

# Log aggregation (with external tools)
docker-compose logs | grep ERROR
```

### Metrics

- Backend health: `http://localhost:3005/api/v1/health`
- Frontend: `http://localhost:3000`
- Database: Connect to `localhost:5432`
- Redis: Connect to `localhost:6379`

## API Endpoints

- **REST API**: `http://localhost:3005/api/v1`
- **GraphQL Playground**: `http://localhost:3005/graphql`
- **Swagger Documentation**: `http://localhost:3005/api/v1/docs`
- **Health Check**: `http://localhost:3005/api/v1/health`
- **Frontend**: `http://localhost:3000`

## Development Workflow

1. **Start development environment**: `docker-compose -f docker-compose.dev.yml up`
2. **Make changes** to source code
3. **Hot reload** will automatically update the application
4. **Run tests**: `docker-compose exec backend npm test`
5. **Run migrations**: `docker-compose exec backend npm run migration:run`
6. **Seed data**: `docker-compose exec backend npm run seed`
