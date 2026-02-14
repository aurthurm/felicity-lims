# Felicity LIMS — Introduction

## Overview

**Felicity LIMS** is an enterprise-grade, open-source Laboratory Information Management System designed for clinical, medical, and research laboratory environments. It provides comprehensive sample lifecycle management, multi-tenant data isolation, and HIPAA-compliant security features.

## Architecture Summary

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | FastAPI, Strawberry GraphQL, SQLAlchemy 2.0+ (async), PostgreSQL |
| **Frontend** | Vue 3, Vite, Tailwind CSS v4, URQL (GraphQL), Pinia |
| **Databases** | PostgreSQL (primary), MongoDB (audit), DragonflyDB/Redis (cache), MinIO (storage) |
| **Instrument Integration** | ASTM E1381, HL7 v2.5+, async TCP/IP |

### Core Patterns

- **Repository-Service pattern**: Entities → Repositories → Services → GraphQL resolvers
- **Multi-tenancy**: Laboratory-level data isolation via `LabScopedEntity` and tenant context
- **Domain-driven design**: Modules under `felicity/apps/` (patient, sample, analysis, inventory, etc.)

### Key Modules

- **Patient Management**: Demographics, HIPAA-compliant search with encrypted fields and search indices
- **Sample Management**: Lifecycle (receipt → analysis → dispatch), worksheets, QC tracking
- **Analysis**: Test definitions, quality control, result workflows
- **Inventory**: Stock management, transactions, adjustments, orders
- **User Management**: JWT auth, RBAC, laboratory assignments
- **Document Management**: QMS documents with versioning
- **Billing**: Test pricing and billing workflows
- **Microbiology**: Antibiotic susceptibility testing, reflex rules, organism management

### GraphQL API

- Schema composed from domain modules in `felicity/api/gql/schema.py`
- Types and operations organized by domain (patient, sample, analysis, etc.)
- Frontend types generated via GraphQL Code Generator (`pnpm webapp:codegen`)

### Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm server:uv:watch` | Start API with hot reload |
| `pnpm webapp:dev` | Start Vite dev server |
| `pnpm standalone:build` | Build frontend and copy to backend templates |
| `pnpm db:upgrade` | Run database migrations |
| `docker compose -f docker-compose.dev.yml up -d` | Start full dev stack |

See [CLAUDE.md](../CLAUDE.md) and [AGENTS.md](../AGENTS.md) for full development guidance.
