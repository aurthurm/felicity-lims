import typer

from beak.cli.libs import AsyncTyper
from beak.modules.platform.services import TenantProvisioningService, TenantRegistryService

app = AsyncTyper()


@app.command()
async def provision(
        name: str = typer.Option(..., help="Organization display name"),
        slug: str = typer.Option(..., help="Tenant slug (lowercase, underscore allowed)"),
        admin_email: str | None = typer.Option(None, help="Tenant admin email"),
        initial_lab_name: str | None = typer.Option(None, help="Initial laboratory name"),
        primary_industry: str = typer.Option(
            "clinical",
            "--industry",
            help="Primary industry: clinical|pharma|environment|industrial",
        ),
        enable_module: list[str] = typer.Option(
            None,
            "--enable-module",
            help="Extra modules to enable (repeat flag as needed)",
        ),
) -> None:
    """Provision a tenant schema and run tenant migration + baseline setup."""
    tenant = await TenantProvisioningService().provision(
        name=name,
        slug=slug,
        admin_email=admin_email,
        initial_lab_name=initial_lab_name,
        primary_industry=primary_industry,
        enabled_modules=enable_module or None,
    )
    typer.echo(f"Provisioned tenant: {tenant['slug']} -> {tenant['schema_name']}")


@app.command("list")
async def list_tenants(
        status: str = typer.Option(
            "all",
            help="Filter by status: all|active|provisioning|failed",
        ),
) -> None:
    """List tenants from the platform registry."""
    tenants = await TenantRegistryService().list(status=status)
    for tenant in tenants:
        typer.echo(f"{tenant['slug']}\t{tenant['schema_name']}\t{tenant['status']}")


@app.command()
async def migrate(
        slug: str = typer.Option(..., help="Tenant slug"),
        module: str | None = typer.Option(
            None,
            "--module",
            help="Limit migration intent to an enabled module id",
        ),
) -> None:
    """Run latest Alembic migrations for a single tenant schema and activate it."""
    tenant = await TenantProvisioningService().migrate(slug=slug, module_scope=module)
    typer.echo(f"Migrated tenant: {tenant['slug']} -> {tenant['schema_name']}")


@app.command()
async def activate(
        slug: str = typer.Option(..., help="Tenant slug"),
        force: bool = typer.Option(
            False,
            help="Activate even when readiness checks fail",
        ),
) -> None:
    """Mark a tenant as active after migration/seed recovery."""
    tenant = await TenantProvisioningService().activate(slug=slug, force=force)
    typer.echo(f"Activated tenant: {tenant['slug']} ({tenant['status']})")


@app.command("add-lab")
async def add_lab(
        slug: str = typer.Option(..., help="Tenant slug"),
        name: str = typer.Option(..., help="Laboratory name"),
        setup_name: str = typer.Option("beak", help="Organization setup_name"),
) -> None:
    """Add a laboratory to an existing tenant organization."""
    laboratory = await TenantProvisioningService().add_laboratory(
        slug=slug,
        laboratory_name=name,
        setup_name=setup_name,
    )
    state = "created" if laboratory["created"] else "already existed"
    typer.echo(
        f"Lab {state}: {laboratory['laboratory_name']} "
        f"({laboratory['laboratory_uid']}) in tenant {laboratory['tenant_slug']}"
    )


@app.command("cleanup")
async def cleanup_failed(
        slug: str | None = typer.Option(
            None,
            help="Failed tenant slug to clean. Omit to clean all failed tenants.",
        ),
        drop_schema: bool = typer.Option(
            True,
            "--drop-schema/--keep-schema",
            help="Drop tenant schema as part of cleanup",
        ),
) -> None:
    """Delete failed provisioning records (and optionally their schemas)."""
    cleaned = await TenantProvisioningService().cleanup_failed(
        slug=slug,
        drop_schema=drop_schema,
    )
    if not cleaned:
        typer.echo("No failed tenants found.")
        return
    for tenant in cleaned:
        typer.echo(
            f"Removed failed tenant: {tenant['slug']} -> {tenant['schema_name']}"
        )


@app.command("modules")
async def modules(
        slug: str = typer.Option(..., help="Tenant slug"),
) -> None:
    """List modules enabled for a tenant."""
    result = await TenantProvisioningService().list_modules(slug=slug)
    typer.echo(
        f"{result['tenant_slug']}\tindustry={result['primary_industry']}\tmodules={','.join(result['enabled_modules'])}"
    )


@app.command("module-enable")
async def module_enable(
        slug: str = typer.Option(..., help="Tenant slug"),
        module: str = typer.Option(..., "--module", help="Module id"),
) -> None:
    """Enable a module for a tenant."""
    tenant = await TenantProvisioningService().enable_module(slug=slug, module_id=module)
    typer.echo(
        f"Enabled module '{module}' for {tenant['slug']}: {','.join(tenant['enabled_modules'])}"
    )


@app.command("module-disable")
async def module_disable(
        slug: str = typer.Option(..., help="Tenant slug"),
        module: str = typer.Option(..., "--module", help="Module id"),
) -> None:
    """Disable a module for a tenant."""
    tenant = await TenantProvisioningService().disable_module(slug=slug, module_id=module)
    typer.echo(
        f"Disabled module '{module}' for {tenant['slug']}: {','.join(tenant['enabled_modules'])}"
    )
