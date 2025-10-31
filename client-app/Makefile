# Digital Credit & Savings Platform - Docker Management

.PHONY: help build up down restart logs clean dev prod test migrate seed

# Default target
help:
	@echo "Digital Credit & Savings Platform - Docker Commands"
	@echo ""
	@echo "Development Commands:"
	@echo "  dev          Start development environment"
	@echo "  dev-build    Build and start development environment"
	@echo "  dev-logs     Show development logs"
	@echo "  dev-down     Stop development environment"
	@echo ""
	@echo "Production Commands:"
	@echo "  prod         Start production environment"
	@echo "  prod-build   Build and start production environment"
	@echo "  prod-logs    Show production logs"
	@echo "  prod-down    Stop production environment"
	@echo ""
	@echo "Database Commands:"
	@echo "  migrate      Run database migrations"
	@echo "  seed         Seed database with sample data"
	@echo "  db-backup    Backup database"
	@echo "  db-restore   Restore database from backup"
	@echo ""
	@echo "Utility Commands:"
	@echo "  build        Build all images"
	@echo "  logs         Show logs for all services"
	@echo "  clean        Clean up containers and volumes"
	@echo "  test         Run tests"
	@echo "  status       Show service status"

# Development Environment
dev:
	docker-compose -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.dev.yml up --build

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-down:
	docker-compose -f docker-compose.dev.yml down

# Production Environment
prod:
	docker-compose up -d

prod-build:
	docker-compose up -d --build

prod-logs:
	docker-compose logs -f

prod-down:
	docker-compose down

# Database Operations
migrate:
	docker-compose exec backend npm run migration:run

seed:
	docker-compose exec backend npm run seed

db-backup:
	docker-compose exec postgres pg_dump -U postgres digital_credit_client > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	@read -p "Enter backup file name: " file; \
	docker-compose exec -T postgres psql -U postgres digital_credit_client < $$file

# Utility Commands
build:
	docker-compose build

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

test:
	docker-compose exec backend npm test

status:
	docker-compose ps

# Quick start for development
start: dev-build

# Quick start for production
deploy: prod-build
