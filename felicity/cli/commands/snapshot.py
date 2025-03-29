import typer

from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import SampleService, AnalysisRequestService
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.patient.services import PatientService
from felicity.cli.libs import AsyncTyper

app = AsyncTyper()


@app.command()
async def patients() -> None:
    """Update all patients metadata: Dangerous - Are you sure? """
    typer.echo(f"Refreshing patient snapshots...")
    _patients = await PatientService().all()
    typer.echo(f"{len(_patients)} samples found for patients refreshing")
    for patient in _patients:
        await PatientService().snapshot(patient)
    typer.echo("Done refreshing patients:)")


@app.command()
async def analysis_requests() -> None:
    """Update analysis requests metadata for samples in received state"""
    typer.echo(f"Refreshing analysis requests snapshots...")
    filters = {"status__exact": SampleState.RECEIVED}
    samples = await SampleService().get_all(**filters)
    typer.echo(f"{len(samples)} samples found for analysis requests refreshing")
    for sample in samples:
        ar = await AnalysisRequestService().get(uid=sample.analysis_request_uid)
        await AnalysisRequestService().snapshot(ar)
    typer.echo("Done refreshing analysis-requests:)")


@app.command()
async def samples() -> None:
    """Update sample metadata for samples in received state"""
    typer.echo(f"Refreshing sample snapshots...")
    filters = {"status__exact": SampleState.RECEIVED}
    samples = await SampleService().get_all(**filters)
    typer.echo(f"{len(samples)} samples found for refreshing")
    for sample in samples:
        await SampleService().snapshot(sample)
        typer.echo(f"Refreshing associated results...")
        await AnalysisResultService().snapshot(sample.analysis_results)
    typer.echo("Done refreshing :)")


@app.command()
async def analyses() -> None:
    """Update results metadata for samples in received state"""
    typer.echo(f"Refreshing analyses snapshots...")
    filters = {"status__exact": SampleState.RECEIVED}
    samples = await SampleService().get_all(**filters)
    typer.echo(f"{len(samples)} samples found for analysis refreshing")
    for sample in samples:
        typer.echo(f"Refreshing associated results for sample {sample.sample_id}")
        await AnalysisResultService().snapshot(sample.analysis_results)
    typer.echo("Done refreshing :)")


@app.command()
async def refresh_all() -> None:
    """Update samples, analysis requests and results metadata for samples in received state"""
    typer.echo(f"Refreshing all snapshots...")
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
async def hard_refresh() -> None:
    """Rewrite all snapshots affecting everything!!! -- dangerous -- do you know what you are doing?"""
    typer.echo(f"Refreshing all snapshots...")
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
