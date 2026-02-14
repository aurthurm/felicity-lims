# Felicity LIMS

Open-source, enterprise-ready Laboratory Information Management System (LIMS) for clinical, medical, and research laboratories.

![Felicity LIMS](https://github.com/user-attachments/assets/bd6af479-e0a0-4337-9a1d-632e139741a0)

## What This Project Includes

- FastAPI + Strawberry GraphQL backend (`felicity/`)
- Vue 3 + TypeScript + Tailwind webapp (`webapp/`)
- Tauri desktop packaging for cross-platform installable builds (`src-tauri/`)
- Docker Compose stacks for dev and production-style deployments
- Multi-tenant/laboratory-scoped architecture with RBAC and audit trail support

Current project version: `0.2.3`

## Deployment Modes

Felicity supports two practical runtime profiles.

### Lightweight Mode

Use this for compact installations and single-site deployments.

- Required: PostgreSQL
- Optional/disabled by omission:
  - Redis/Dragonfly (`REDIS_SERVER`)
  - MongoDB (`MONGODB_SERVER`)
  - MinIO (`MINIO_SERVER`)

Behavior when optional services are not configured:

- Broadcast channel falls back to in-memory implementation
- Document/audit storage uses PostgreSQL-backed paths where applicable
- File storage falls back to local filesystem (`MEDIA_DIR`)

### Heavyweight Mode

Use this for higher-scale or distributed setups.

- PostgreSQL + Redis/Dragonfly + MongoDB + MinIO
- Better fit for larger workloads, external object storage, and richer distributed behavior

Reference rationale: `future-plans.md`

## Architecture Snapshot

- Backend: FastAPI, async SQLAlchemy, Strawberry GraphQL
- Frontend: Vue 3, Pinia, URQL, Vite, Tailwind v4
- API endpoints:
  - GraphQL: `/felicity-gql`
  - REST: `/api/v1`
  - GraphQL docs: `/graphql-docs`
  - OpenAPI docs: `/docs`
- Static app serving can be enabled by backend via `SERVE_WEBAPP`

## Repository Layout

- `felicity/`: backend app, domain modules, GraphQL, migrations, seeds
- `webapp/`: frontend app (views, components, stores, graphql operations)
- `src-tauri/`: Tauri desktop wrapper and bundling config
- `docker-compose*.yml`: deployment presets
- `notes.txt`: release/publishing command notes
- `future-plans.md`: lightweight/heavyweight packaging direction

## Quick Start (Docker Dev)

1. Clone and configure environment:

```bash
git clone https://github.com/beak-insights/felicity-lims.git
cd felicity-lims
cp env.example .env
```

2. Build and run:

```bash
make build
make up
```

3. Run migrations:

```bash
docker compose -f docker-compose.dev.yml exec felicity-api felicity-lims db upgrade
```

4. Access services:

- Webapp (Vite): `http://localhost:3000`
- Backend: `http://localhost:8000`
- GraphQL Playground: `http://localhost:8000/felicity-gql`
- API docs: `http://localhost:8000/docs`

## Local Development (Without Docker)

Prerequisites:

- Python environment for backend dependencies
- Node + pnpm for webapp
- PostgreSQL instance

Useful commands:

```bash
# backend
pnpm server:uv:watch

# frontend
pnpm webapp:dev

# frontend + codegen watch
pnpm webapp:dev:watch
```

Database:

```bash
pnpm db:upgrade
```

## Desktop App (Tauri)

The project includes Tauri for installable cross-platform desktop packaging.

### Dev

```bash
pnpm tauri:dev
```

### Build installer bundles

```bash
pnpm tauri:build
```

Output is generated under `src-tauri/target/release/bundle/` for your platform.

Notes:

- Tauri frontend points at Vite dev server in dev and `dist` in build
- Backend URL is still controlled by webapp config/environment (`VITE_BASE_URL`)

## Building Standalone Web Assets

Build webapp and copy into backend static templates:

```bash
pnpm standalone:build
```

When backend `SERVE_WEBAPP=true`, FastAPI serves the bundled app from `/`.

## Environment Configuration

Start from `env.example`. High-impact variables:

- Core
  - `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
  - `SECRET_KEY`, `REFRESH_SECRET_KEY`
- Webapp
  - `VITE_BASE_URL` (API URL used by frontend)
  - `VITE_APP_TITLE`
- Mode control
  - `REDIS_SERVER` (omit for lightweight mode)
  - `MONGODB_SERVER` (omit for lightweight mode)
  - `MINIO_SERVER` (omit for lightweight mode)
  - `SERVE_WEBAPP` (serve built web assets from backend)
  - `LOAD_SETUP_DATA` (seed setup data on startup)

## Quality, Lint, and Tests

Backend:

```bash
pnpm server:lint
pnpm server:test
```

Frontend:

```bash
pnpm webapp:lint
pnpm webapp:prettier:check
```

## Production Compose Variants

- `docker-compose.prod.yml`
- `docker-compose.prod.native.yml`
- `docker-compose.alt.standard.yml`
- `docker-compose.alt.aio.yml`

Pick based on your topology (split services vs all-in-one and static serving flavor).

## Release Notes and Versioning

- App/web package version is tracked in `package.json`
- Backend version is tracked in `felicity/version/version.py`
- Release operations and image tags are documented in `notes.txt`

## Security and Compliance Notes

- Supports JWT-based auth and RBAC
- Includes audit logging flows and HIPAA-oriented key configuration options
- For production: set secrets explicitly in `.env`, do not rely on defaults

## Troubleshooting

- GraphQL endpoint mismatch:
  - Use `/felicity-gql` (not `/graphql`)
- Setup data unique constraint failures:
  - Usually indicates setup seed data already exists (`LOAD_SETUP_DATA` with existing DB)
- Desktop app cannot reach API:
  - Validate `VITE_BASE_URL` and backend availability

## License

Public (see repository metadata and legal files as applicable).
