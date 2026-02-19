# User Management

## Overview

User management provides authentication, role-based access control (RBAC), and laboratory-scoped permissions. Users can be assigned to multiple laboratories with context switching.

## Authentication

- **JWT tokens**: Access and refresh tokens
- **Username-based login**: Email not used for authentication (use username)
- **Password policy**: Enforced on create/update
- **Login retry**: Blocked after 3 failed attempts; reset password to regain access

## User-Laboratory Association

- **laboratory_user** table: Many-to-many between User and Laboratory
- **active_laboratory_uid**: Current laboratory context for the user
- Users can switch active laboratory via GraphQL mutation

## Groups and Permissions

- **user_groups**: Many-to-many User ↔ Group
- **permission_groups**: Many-to-many Permission ↔ Group
- Permissions checked via `HasPermission(FAction, FObject)` in GraphQL resolvers

## Architecture

- **Entities**: `beak/modules/core/identity/entities.py` — User, Group, Permission, UserPreference
- **Repository**: `beak/modules/core/identity/repository.py` — get_users_by_laboratory, assign_user_to_laboratory
- **Services**: `beak/modules/core/identity/services.py` — UserService (create, update, authenticate, has_access)

## User Preferences

- Stored in UserPreference entity
- Cached via `get_current_user_preferences()`
- Includes theme, departmental toggles, and other UI preferences

## Tenant Context

- JWT carries user_uid, laboratory_uid, organization_uid
- Middleware: `beak/lims/middleware/tenant.py` extracts tenant context
- All data access filtered by laboratory_uid
