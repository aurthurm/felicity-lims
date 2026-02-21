# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Backend Development

-   **Start development server**: `pnpm server:uv:watch` or `uvicorn beak.main:beak --reload`
-   **Production server**: `pnpm server:gu` (Gunicorn with 5 workers)
-   **Run tests**: `pnpm server:test` or `bash ./beak/scripts/test.sh` (supports "unit" or "integration" args)
-   **Lint code**: `pnpm server:lint` or `bash ./beak/scripts/lint.sh` (uses ruff)
-   **Format code**: `pnpm server:format` or `bash ./beak/scripts/format.sh` (uses ruff format)
-   **Upgrade platform schema**: `beak-lims db upgrade`
-   **Create platform migration**: `beak-lims db revision "message" --scope platform`
-   **Create tenant migration**: `beak-lims db revision "message" --scope tenant`

### Frontend Development

-   **Start development server**: `pnpm webapp:dev` (Vite dev server)
-   **Build for production**: `pnpm webapp:build:only` or `pnpm standalone:build` (copies to backend templates)
-   **Lint frontend**: `pnpm webapp:lint` (ESLint)
-   **Format frontend**: `pnpm webapp:prettier:format`
-   **Generate GraphQL types**: `pnpm webapp:codegen` (with --watch flag)
-   **Export GraphQL schema**: `pnpm server:schema:export:tofront`

### Docker Development

-   **Start dev environment**: `docker compose -f docker-compose.dev.yml up -d --build`
-   **Database setup**: `docker compose -f docker-compose.dev.yml exec beak-api beak-lims db upgrade`

## High-Level Architecture

### Technology Stack

**Backend**: FastAPI + Strawberry GraphQL + SQLAlchemy with PostgreSQL primary database
**Frontend**: Vue 3 + Vite + Tailwind CSS + URQL (GraphQL client) + Pinia (state management)
**Additional Services**: MongoDB (audit logs), MinIO (object storage), DragonflyDB/Redis (caching)

### Multi-Tenant Architecture

The system implements multi-tenancy with laboratory-level data isolation:

-   **Tenant Context**: `beak/core/tenant_context.py` manages user, laboratory, and organization context per request
-   **Middleware**: `beak/lims/middleware/tenant.py` extracts tenant context from JWT tokens
-   **Data Isolation**: Repository and service layers automatically filter data by laboratory_uid
-   **Entity Scoping**: Models inherit from `LabScopedEntity` to enforce tenant boundaries

### Core Architectural Patterns

#### Repository-Service Pattern

-   **Entities**: Domain models in `beak/apps/*/entities/` (SQLAlchemy models)
-   **Repositories**: Data access layer in `beak/apps/*/repository/` extending `BaseRepository`
-   **Services**: Business logic layer in `beak/apps/*/services/` extending `BaseService`
-   **GraphQL Layer**: Query/mutation resolvers in `beak/api/gql/*/`

#### Base Classes

-   **BaseRepository**: `beak/apps/abstract/repository.py` - Provides CRUD operations, pagination, tenant filtering
-   **BaseService**: `beak/apps/abstract/service.py` - Wraps repository with business logic, audit logging
-   **LabScopedEntity**: `beak/apps/abstract/entity/` - Base model with tenant awareness and audit fields

### Key Application Modules

-   **Patient Management**: Patient entities, search indices with HIPAA compliance
-   **Sample Management**: Sample lifecycle, worksheets, analysis results
-   **Analysis**: Test management, quality control, result workflows
-   **Inventory**: Stock management, transactions, adjustments
-   **User Management**: Authentication, RBAC, laboratory assignments
-   **Document Management**: QMS documents with versioning
-   **Billing**: Test pricing and billing workflows
-   **Microbiology**: Specialized microbiology workflows with antibiotic susceptibility testing

### GraphQL Schema Organization

The GraphQL API is organized by domain with centralized schema composition:

-   **Schema**: `beak/api/gql/schema.py` combines all domain types and operations
-   **Types**: Each module exports types list (e.g., `analysis_types`, `patient_types`)
-   **Operations**: Separate Query/Mutation classes per domain, combined in main schema
-   **Code Generation**: Frontend types generated from schema using GraphQL Code Generator

### Database Architecture

-   **Primary**: PostgreSQL with async SQLAlchemy for main application data
-   **Audit**: MongoDB for audit logs and document storage
-   **Cache**: DragonflyDB/Redis for session management and real-time features
-   **Storage**: MinIO for file uploads and report storage
-   **Migrations**: Alembic with dual-scope revision management (see Migration Strategy below)

### Security & Compliance

-   **Authentication**: JWT tokens with refresh mechanism
-   **Authorization**: Role-based access control with laboratory-scoped permissions
-   **HIPAA Compliance**: Field-level encryption for sensitive patient data
-   **Audit Logging**: Comprehensive audit trails for all data modifications
-   **Multi-tenancy**: Strict data isolation between laboratories

### Development Environment

The project uses Docker Compose for local development with:

-   Auto-reloading API server (uvicorn)
-   Hot-reload frontend (Vite)
-   Persistent volumes for all databases
-   DbGate for database administration
-   All services networked for seamless communication

### Migration Strategy

Migrations are split into two independent scopes with separate revision chains and version tracking:

#### Platform Migrations (`beak/migrations/platform/`)

-   Manage the `platform` PostgreSQL schema (tenant registry, platform users/roles, billing tables)
-   Models use `__table_args__ = {"schema": settings.PLATFORM_SCHEMA}` to target the platform schema
-   Tracked in `platform.alembic_version`
-   Upgraded directly via `beak-lims db upgrade` (runs without `TENANT_SCHEMA`)
-   Generate new revisions: `beak-lims db revision "description" --scope platform`

#### Tenant Migrations (`beak/migrations/versions/`)

-   Manage per-tenant schemas (e.g., `org_lab1`, `org_lab2`)
-   Models inherit from `BaseEntity`/`LabScopedEntity` without explicit schema (schema set at runtime)
-   Tracked in `{tenant_schema}.alembic_version` (one per tenant)
-   Upgraded per-tenant during provisioning via `beak-lims tenant provision` or `beak-lims tenant migrate`
-   Generate new revisions: `beak-lims db revision "description" --scope tenant`

#### How It Works

-   `env.py` uses the `TENANT_SCHEMA` environment variable to determine scope at runtime
-   `include_object` callbacks filter autogenerate to only detect tables belonging to the active scope
-   Each scope has its own `version_locations` directory so revision chains are fully independent
-   Platform tables are identified by `schema == "platform"` in `__table_args__`; everything else is tenant-scoped

### Testing Strategy

-   **Unit Tests**: `beak/tests/unit/` - Test individual components in isolation
-   **Integration Tests**: `beak/tests/integration/` - Test service interactions
-   **Test Configuration**: pytest with async support, separate test database
-   **Environment**: Set `TESTING=True` environment variable for test runs
