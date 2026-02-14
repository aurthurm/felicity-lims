# Performance

## Overview

Beak LIMS is built for high concurrency and efficient resource usage with async-first architecture.

## Architecture Considerations

- **Async I/O**: asyncio throughout backend; non-blocking database and instrument connections
- **Connection pooling**: SQLAlchemy async engine for PostgreSQL
- **Caching**: DragonflyDB/Redis for session management and real-time features
- **Instrument concurrency**: 100+ simultaneous instrument connections supported

## Key Performance Indicators (KPIs)

### Laboratory Operations

- Total number of urgent tests
- Critical results and critical results handled
- % critical results handled within target time
- TAT: % samples released within allowable profile TAT
- Instrument uptime
- Rejection rates (per week/month)
- Rejection reason analysis

### TAT Analytics

- Box/whisker by day of week, week of month, hour of day
- Order time buckets (e.g., &lt;9am, 9am, 10am, 11am, 12pm, 1pm, 2pm, 3pm)

## HIPAA Search Performance

For encrypted patient search:

- **Memory-based search**: O(n), suitable for small datasets (&lt;1,000 patients)
- **Index-based search**: O(log n), recommended for large datasets
- See [HIPAA_COMPLIANCE.md](HIPAA_COMPLIANCE.md) for benchmarks

## Monitoring

- **OpenTelemetry**: Application performance monitoring
- **SigNoz**: Metrics, traces, and logs visualization
- See `services/tracing/signoz.txt` for setup

## References

- [reference.txt](reference.txt) — KPI notes and state machine patterns
- [lab-etools.org maturity framework](https://www.lab-etools.org/maturity-framework/)
