# Deployment

## Overview

Beak LIMS can be deployed via Docker Compose or standalone. Production typically uses Gunicorn with Uvicorn workers.

## Docker Development

```bash
# Start full dev stack
docker compose -f docker-compose.dev.yml up -d --build

# Run migrations
docker compose -f docker-compose.dev.yml exec beak-api beak-lims db upgrade
```

## Production Server

```bash
# Gunicorn with 5 workers
pnpm server:gu
# or
gunicorn beak.main:beak --workers 5 --worker-class uvicorn.workers.UvicornH11Worker --bind 0.0.0.0:8000
```

## Frontend Build

```bash
# Build and copy to backend templates
pnpm standalone:build
```

## Services

- **PostgreSQL**: Primary database (required)
- **MongoDB**: Audit logs (optional; falls back to PostgreSQL if not configured)
- **Redis/DragonflyDB**: Cache and sessions (optional; in-memory fallback)
- **MinIO**: Object storage (optional; local MEDIA_DIR fallback)

## HIPAA Migration

For HIPAA-compliant encryption deployment, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Standalone Windows

See [future-plans.md](../future-plans.md) for Tauri packaging and Windows standalone options.
