# Makefile for Beak LIMS
# Quick commands for development and deployment

.PHONY: help build up down restart logs clean test

# Default target
help:
	@echo "Beak LIMS - Apple Silicon Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make build         - Build all containers with BuildKit optimization"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make logs          - Tail logs from all services"
	@echo "  make logs-api      - Tail API logs only"
	@echo "  make logs-webapp   - Tail webapp logs only"
	@echo "  make clean         - Remove all containers, volumes, and images"
	@echo "  make clean-cache   - Clean Docker build cache"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-shell      - Open PostgreSQL shell"
	@echo "  make test          - Run backend tests"
	@echo "  make stats         - Show Docker resource usage"
	@echo "  make health        - Check health of all services"
	@echo ""

# Build with BuildKit
build:
	@echo "Building with BuildKit optimizations..."
	DOCKER_BUILDKIT=1 docker compose -f docker-compose.dev.yml build

# Build with advanced BuildKit (docker-bake)
build-advanced:
	@echo "Building with docker-bake..."
	docker buildx bake -f docker-bake.hcl --load

# Start services
up:
	@echo "Starting services..."
	docker compose -f docker-compose.dev.yml up -d

# Stop services
down:
	@echo "Stopping services..."
	docker compose -f docker-compose.dev.yml down

# Restart services
restart: down up

# View logs
logs:
	docker compose -f docker-compose.dev.yml logs -f

# View API logs only
logs-api:
	docker compose -f docker-compose.dev.yml logs -f beak-api

# View webapp logs only
logs-webapp:
	docker compose -f docker-compose.dev.yml logs -f beak-webapp

# Clean everything
clean:
	@echo "Cleaning up..."
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	@echo "Removing dangling images..."
	docker image prune -f

# Clean build cache
clean-cache:
	@echo "Cleaning build cache..."
	docker builder prune -f
	@echo "Cleaning system..."
	docker system prune -f

# Database migrations
db-migrate:
	docker compose -f docker-compose.dev.yml exec beak-api alembic upgrade head

# Database shell
db-shell:
	docker exec -it beak-postgres psql -U beak -d beak_lims

# MongoDB shell
mongo-shell:
	docker exec -it beak-mongo mongosh -u beak -p beak

# Run tests
test:
	docker compose -f docker-compose.dev.yml exec beak-api pytest

# Show resource usage
stats:
	@echo "Docker resource usage:"
	docker stats --no-stream

# Check service health
health:
	@echo "Checking service health..."
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Quick setup (first time)
setup: build up db-migrate
	@echo ""
	@echo "Setup complete!"
	@echo "Access the application at: http://localhost:3000"
	@echo "Access the API at: http://localhost:8000"
	@echo ""

# Development workflow
dev: up logs

# Production build
prod-build:
	@echo "Building for production..."
	DOCKER_BUILDKIT=1 docker compose -f docker-compose.prod.yml build

# Show system info
info:
	@echo "System Information:"
	@echo "Docker version: $$(docker --version)"
	@echo "Docker Compose version: $$(docker compose version)"
	@echo "BuildKit enabled: $$(docker buildx version)"
	@echo ""
	@docker system df