# Tenant Provisioning and Tenant-Scoped CLI

This guide documents how to provision tenants, run tenant migrations, add laboratories, and run maintenance commands against a specific tenant schema.

## Prerequisites

- Run platform bootstrap first (no tenant schema in env):
  - `beak-lims db upgrade`
- Confirm tenant registry table exists in platform schema.
- Seed platform admin login user:
  - `beak-lims seed platform-superuser`

## Platform IAM

Platform management uses dedicated platform users stored in the `platform` schema.

Platform roles:

- `billing`
- `provisioner`
- `support`
- `administrator`

Platform auth routes:

- `POST /api/v1/platform/auth/login`
- `GET /api/v1/platform/auth/me`

Platform management routes mirror CLI tenant operations:

- `POST /api/v1/platform/tenants`
- `GET /api/v1/platform/tenants`
- `POST /api/v1/platform/tenants/{slug}/migrate`
- `POST /api/v1/platform/tenants/{slug}/activate`
- `POST /api/v1/platform/tenants/{slug}/laboratories`
- `DELETE /api/v1/platform/tenants/failed`

## Tenant Provisioning

Provision a new tenant schema and baseline setup:

```bash
beak-lims tenant provision \
  --name "Ultralytics Damegio" \
  --slug ultral12 \
  --admin-email ultralytics@gmail.com \
  --initial-lab-name "Dato Laboratory 1"
```

What it does:

- Creates a platform tenant registry record.
- Creates schema `org_<slug>` (based on `TENANT_SCHEMA_PREFIX`).
- Runs all Alembic migrations for that tenant schema.
- Seeds initial organization + initial laboratory setup.

## Manage Existing Tenants

List active tenants:

```bash
beak-lims tenant list
beak-lims tenant list --status active
beak-lims tenant list --status provisioning
beak-lims tenant list --status failed
```

Run latest migrations for one tenant:

```bash
beak-lims tenant migrate --slug ultral12
```

`tenant migrate` will create the tenant schema first if it is missing, run migrations, and mark the tenant `active` when successful.

Manually activate a tenant (for recovery workflows):

```bash
beak-lims tenant activate --slug ultral12
```

Force activation without readiness checks:

```bash
beak-lims tenant activate --slug ultral12 --force
```

Clean failed provisionings:

```bash
# one failed tenant
beak-lims tenant cleanup --slug ultral11 --drop-schema

# all failed tenants
beak-lims tenant cleanup --drop-schema
```

Add a laboratory to an existing tenant organization:

```bash
beak-lims tenant add-lab --slug ultral12 --name "Dato Laboratory 2"
```

Optional organization selector:

```bash
beak-lims tenant add-lab --slug ultral12 --name "Dato Laboratory 2" --setup-name beak
```

## Tenant-Scoped Seed Commands

Seed commands support `--tenant-slug`:

```bash
beak-lims seed all --tenant-slug ultral12
beak-lims seed microbiology --tenant-slug ultral12
```

If `--tenant-slug` is omitted, commands run in default/global context.

## Tenant-Scoped Snapshot Commands

Snapshot commands support `--tenant-slug`:

```bash
beak-lims snapshot patients --tenant-slug ultral12
beak-lims snapshot analysis-requests --tenant-slug ultral12
beak-lims snapshot samples --tenant-slug ultral12
beak-lims snapshot analyses --tenant-slug ultral12
beak-lims snapshot refresh-all --tenant-slug ultral12
beak-lims snapshot hard-refresh --tenant-slug ultral12
```

## Troubleshooting

- `Tenant slug '<slug>' not found`
  - Check `beak-lims tenant list` and confirm slug.
- `Tenant '<slug>' is not active`
  - Provision may have failed; inspect logs and run `beak-lims tenant migrate --slug <slug>`.
- `Tenant migration completed but org_<slug>.organization was not created`
  - Migration ran but schema targeting failed; re-run with latest code and check migration logs.
