import typer

from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.cli.libs import AsyncTyper

app = AsyncTyper()


@app.command()
async def refresh() -> None:
    """Update samples and results with latest changes in metadata"""
    typer.echo(f"Refreshing sample snapshots...")
    filters = {"status__exact": SampleState.RECEIVED}
    samples = await SampleService().get_all(**filters)
    typer.echo(f"{len(samples)} samples found for refreshing")
    for sample in samples:
        await SampleService().snapshot(sample)
        typer.echo(f"Refreshing associated results...")
        await AnalysisResultService().snapshot(sample.analysis_results)
    typer.echo("Done refreshing :)")
