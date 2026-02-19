import typer

from beak.modules.core.analysis.enum import SampleState
from beak.modules.core.analysis.services.analysis import (
    SampleService,
    AnalysisRequestService,
)
from beak.modules.core.analysis.services.result import AnalysisResultService
from beak.modules.clinical.patient.services import PatientService
from beak.cli.libs import AsyncTyper
from beak.cli.commands._tenant import tenant_context_from_slug

app = AsyncTyper()


@app.command()
async def patients(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Update all patients metadata: Dangerous - Are you sure?"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Refreshing patient snapshots...")
        _patients = await PatientService().all()
        typer.echo(f"{len(_patients)} samples found for patients refreshing")
        for patient in _patients:
            await PatientService().snapshot(patient)
        typer.echo("Done refreshing patients:)")


@app.command()
async def analysis_requests(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Update analysis requests metadata for samples in received state"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Refreshing analysis requests snapshots...")
        filters = {"status__exact": SampleState.RECEIVED}
        samples = await SampleService().get_all(**filters)
        typer.echo(f"{len(samples)} samples found for analysis requests refreshing")
        for sample in samples:
            ar = await AnalysisRequestService().get(uid=sample.analysis_request_uid)
            await AnalysisRequestService().snapshot(ar)
        typer.echo("Done refreshing analysis-requests:)")


@app.command()
async def samples(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Update sample metadata for samples in received state"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Refreshing sample snapshots...")
        filters = {"status__exact": SampleState.RECEIVED}
        samples = await SampleService().get_all(**filters)
        typer.echo(f"{len(samples)} samples found for refreshing")
        for sample in samples:
            await SampleService().snapshot(sample)
            typer.echo("Refreshing associated results...")
            await AnalysisResultService().snapshot(sample.analysis_results)
        typer.echo("Done refreshing :)")


@app.command()
async def analyses(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Update results metadata for samples in received state"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Refreshing analyses snapshots...")
        filters = {"status__exact": SampleState.RECEIVED}
        samples = await SampleService().get_all(**filters)
        typer.echo(f"{len(samples)} samples found for analysis refreshing")
        for sample in samples:
            typer.echo(f"Refreshing associated results for sample {sample.sample_id}")
            await AnalysisResultService().snapshot(sample.analysis_results)
        typer.echo("Done refreshing :)")


@app.command()
async def refresh_all(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Update samples, analysis requests and results metadata for samples in received state"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Refreshing all snapshots...")
        filters = {"status__exact": SampleState.RECEIVED}
        samples = await SampleService().get_all(**filters)
        typer.echo(f"{len(samples)} samples refreshing")
        for sample in samples:
            # Refresh AnalysisRequest
            ar = await AnalysisRequestService().get(uid=sample.analysis_request_uid)
            await AnalysisRequestService().snapshot(ar)
            # Refresh Sample
            await SampleService().snapshot(sample)
            # Refresh Sample
            await AnalysisResultService().snapshot(sample.analysis_results)
        typer.echo("Done refreshing :)")


@app.command()
async def hard_refresh(
        tenant_slug: str | None = typer.Option(None, "--tenant-slug", help="Target tenant slug"),
) -> None:
    """Rewrite all snapshots affecting everything!!! -- dangerous -- do you know what you are doing?"""
    async with tenant_context_from_slug(tenant_slug):
        typer.echo("Refreshing all snapshots...")
        samples = await SampleService().all()
        typer.echo(f"{len(samples)} samples refreshing")
        for sample in samples:
            # Refresh AnalysisRequest
            ar = await AnalysisRequestService().get(uid=sample.analysis_request_uid)
            await AnalysisRequestService().snapshot(ar)
            # Refresh Sample
            await SampleService().snapshot(sample)
            # Refresh Sample
            await AnalysisResultService().snapshot(sample.analysis_results)
        typer.echo("Done refreshing :)")
