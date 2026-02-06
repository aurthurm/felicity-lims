# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Backend Development

- **Start development server**: `pnpm server:uv:watch` or `uvicorn felicity.main:felicity --reload`
- **Production server**: `pnpm server:gu` (Gunicorn with 5 workers)
- **Run tests**: `pnpm server:test` or `bash ./felicity/scripts/test.sh` (supports "unit" or "integration" args)
- **Lint code**: `pnpm server:lint` or `bash ./felicity/scripts/lint.sh` (uses ruff)
- **Format code**: `pnpm server:format` or `bash ./felicity/scripts/format.sh` (uses ruff format)
- **Database migration**: `pnpm db:upgrade` or `felicity-lims db upgrade`
- **Create migration**: `pnpm db:revision` or `felicity-lims revision`

### Frontend Development

- **Start development server**: `pnpm webapp:dev` (Vite dev server)
- **Build for production**: `pnpm webapp:build:only` or `pnpm standalone:build` (copies to backend templates)
- **Lint frontend**: `pnpm webapp:lint` (ESLint)
- **Format frontend**: `pnpm webapp:prettier:format`
- **Generate GraphQL types**: `pnpm webapp:codegen` (with --watch flag)
- **Export GraphQL schema**: `pnpm server:schema:export:tofront`

### Docker Development

- **Start dev environment**: `docker compose -f docker-compose.dev.yml up -d --build`
- **Database setup**: `docker compose -f docker-compose.dev.yml exec felicity-api felicity-lims db upgrade`

## High-Level Architecture

### Technology Stack

**Backend**: FastAPI + Strawberry GraphQL + SQLAlchemy with PostgreSQL primary database
**Frontend**: Vue 3 + Vite + Tailwind CSS + URQL (GraphQL client) + Pinia (state management)
**Additional Services**: MongoDB (audit logs), MinIO (object storage), DragonflyDB/Redis (caching)

### Multi-Tenant Architecture

The system implements multi-tenancy with laboratory-level data isolation:

- **Tenant Context**: `felicity/core/tenant_context.py` manages user, laboratory, and organization context per request
- **Middleware**: `felicity/lims/middleware/tenant.py` extracts tenant context from JWT tokens
- **Data Isolation**: Repository and service layers automatically filter data by laboratory_uid
- **Entity Scoping**: Models inherit from `LabScopedEntity` to enforce tenant boundaries

### Core Architectural Patterns

#### Repository-Service Pattern

- **Entities**: Domain models in `felicity/apps/*/entities/` (SQLAlchemy models)
- **Repositories**: Data access layer in `felicity/apps/*/repository/` extending `BaseRepository`
- **Services**: Business logic layer in `felicity/apps/*/services/` extending `BaseService`
- **GraphQL Layer**: Query/mutation resolvers in `felicity/api/gql/*/`

#### Base Classes

- **BaseRepository**: `felicity/apps/abstract/repository.py` - Provides CRUD operations, pagination, tenant filtering
- **BaseService**: `felicity/apps/abstract/service.py` - Wraps repository with business logic, audit logging
- **LabScopedEntity**: `felicity/apps/abstract/entity/` - Base model with tenant awareness and audit fields

### Key Application Modules

- **Patient Management**: Patient entities, search indices with HIPAA compliance
- **Sample Management**: Sample lifecycle, worksheets, analysis results
- **Analysis**: Test management, quality control, result workflows
- **Inventory**: Stock management, transactions, adjustments
- **User Management**: Authentication, RBAC, laboratory assignments
- **Document Management**: QMS documents with versioning
- **Billing**: Test pricing and billing workflows
- **Microbiology**: Specialized microbiology workflows with antibiotic susceptibility testing

### GraphQL Schema Organization

The GraphQL API is organized by domain with centralized schema composition:

- **Schema**: `felicity/api/gql/schema.py` combines all domain types and operations
- **Types**: Each module exports types list (e.g., `analysis_types`, `patient_types`)
- **Operations**: Separate Query/Mutation classes per domain, combined in main schema
- **Code Generation**: Frontend types generated from schema using GraphQL Code Generator

### Database Architecture

- **Primary**: PostgreSQL with async SQLAlchemy for main application data
- **Audit**: MongoDB for audit logs and document storage
- **Cache**: DragonflyDB/Redis for session management and real-time features
- **Storage**: MinIO for file uploads and report storage
- **Migrations**: Alembic for database schema versioning

### Security & Compliance

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control with laboratory-scoped permissions
- **HIPAA Compliance**: Field-level encryption for sensitive patient data
- **Audit Logging**: Comprehensive audit trails for all data modifications
- **Multi-tenancy**: Strict data isolation between laboratories

### Development Environment

The project uses Docker Compose for local development with:

- Auto-reloading API server (uvicorn)
- Hot-reload frontend (Vite)
- Persistent volumes for all databases
- DbGate for database administration
- All services networked for seamless communication

### Testing Strategy

- **Unit Tests**: `felicity/tests/unit/` - Test individual components in isolation
- **Integration Tests**: `felicity/tests/integration/` - Test service interactions
- **Test Configuration**: pytest with async support, separate test database
- **Environment**: Set `TESTING=True` environment variable for test runs

## Frontend Component Patterns

### Checkbox with vee-validate FormField

When using the `Checkbox` component from `@/components/ui/checkbox` with vee-validate's `FormField`, bind `componentField` directly on the checkbox:

```vue
<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
</script>

<template>
    <FormField name="myBooleanField" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
        <FormItem class="flex items-center space-x-2">
            <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
            </FormControl>
            <FormLabel>My checkbox label</FormLabel>
            <FormMessage />
        </FormItem>
    </FormField>
</template>
```

**Important**:

- Use `v-slot="{ componentField }"` with `<Checkbox v-bind="componentField" />`.
- Add `type="checkbox"` with `:checked-value="true"` and `:unchecked-value="false"` on checkbox `FormField`s.
- Avoid `v-slot="{ value, handleChange }"` for checkbox form fields in this codebase.
- Avoid deprecated `Form` component usage from `@/components/ui/form`.
- Use the current form pattern: `useForm` + native `<form @submit.prevent="handleSubmit(...)">` + `FormField`.
- For pages with multiple submit actions or tabbed sections sharing one form state, avoid wrapping every action in `handleSubmit(...)`; either use separate `useForm` instances per section or submit the current `values` directly for section-specific actions.
- If checkbox UI renders but values do not bind, check for stale references to removed form instances (for example, `setSettingValues`) and ensure all rendered fields come from the active `useForm` context.
- For laboratory settings mutation payloads, include `laboratoryUid` when the GraphQL input requires it.
