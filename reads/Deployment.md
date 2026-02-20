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

### Local Tenant Subdomains (Development)

Use tenant subdomains locally to mirror production behavior:

- `http://<tenant-slug>.localtest.me:5173` (frontend)
- `http://localhost:8000` (backend)

Example:

- `http://taddy.localtest.me:5173`

Requirements:

- Backend CORS must allow localtest subdomains (regex-based allowlist).
- Vite dev server must allow `.localtest.me` hosts.
- Tenant must be provisioned (`beak-lims tenant provision ...`) before use.

## Production Server

```bash
# Gunicorn with 5 workers
pnpm server:gu
# or
gunicorn beak.main:beak --workers 5 --worker-class uvicorn.workers.UvicornH11Worker --bind 0.0.0.0:8000
```

## Production Tenant Routing (Subdomain Model)

Use a single primary domain with per-tenant subdomains:

- `https://<tenant-slug>.yourdomain.com`

Operational checklist:

1. Create wildcard DNS record `*.yourdomain.com`.
2. Configure wildcard TLS certificate for `*.yourdomain.com`.
3. Route subdomains through your reverse proxy/ingress to Beak services.
4. Keep tenant middleware enforcement enabled for `/beak-gql` and `/api/v1`.
5. Provision and activate tenants before exposing their subdomains.

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
