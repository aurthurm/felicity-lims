# System Settings

## Overview

System settings control application configuration, laboratory defaults, and feature flags. Configuration is managed via environment variables and database-backed settings.

## Configuration

- **Environment**: Copy `env.example` to `.env` for local development
- **Core config**: `beak/core/config.py` — database URLs, Redis, MongoDB, MinIO, etc.
- **Lightweight mode**: When REDIS_SERVER, MONGODB_SERVER, MINIO_SERVER are not set:
  - Redis: In-memory BeakBroadcast
  - MongoDB: Audit logs and documents use PostgreSQL
  - MinIO: Local MEDIA_DIR for files

## User Preferences

- Stored per user in UserPreference
- Theme (data-theme), departmental toggles, and other UI preferences
- See [UserManagement.md](UserManagement.md)
