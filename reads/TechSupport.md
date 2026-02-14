# Technical Support

## Overview

Technical support resources for Beak LIMS deployment, troubleshooting, and operations.

## Common Issues

### Authentication

- **Blocked account**: Reset password to regain access after 3 failed login attempts
- **Use username**: Email is not accepted for login; use username

### Database

- **Migrations**: Run `pnpm db:upgrade` or `beak-lims db upgrade`
- **Create migration**: `pnpm db:revision` or `beak-lims revision`

### Development

- **API not starting**: Check PostgreSQL, Redis, MongoDB connectivity
- **Frontend build**: Ensure `pnpm webapp:build:only` or `pnpm standalone:build` completes
- **GraphQL schema**: Export with `pnpm server:schema:export:tofront` for codegen

## Logs and Monitoring

- Application logs: Check uvicorn/gunicorn output
- OpenTelemetry + SigNoz for APM
- See `services/tracing/signoz.txt`

## References

- [CLAUDE.md](../CLAUDE.md) — Development commands
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — HIPAA migration deployment
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines
