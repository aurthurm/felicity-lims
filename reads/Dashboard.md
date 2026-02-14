# Dashboard

## Overview

The dashboard provides analytics, KPIs, and performance metrics for laboratory operations. It includes instrument load, user matrix, process performance, and inventory KPIs.

## Dashboard Components

### Resource Dashboard

- **Instrument Matrix / Load**: Percentage of analyses run per instrument within date range
- **User Matrix / Load**: Workload by registration, submission, verification, publication
- **Custom date range filter**: Apply filter for analytics period

### Process Performance

- **received_to_published**: Full cycle turnaround
- **received_to_submitted**: Time to first result entry
- **submitted_to_verified**: Verification lag
- **verified_to_published**: Publication lag

Metrics include: total samples, late vs not late, process average, avg extra days.

### Inventory KPIs

- Inventory dashboard cards
- CSV export for inventory KPIs (v0.2.3+)

### Department Filters

- Department filters applied across views
- User preferences save departmental toggles

## Architecture

- **GraphQL**: `felicity/api/gql/analytics/query/dashboard.py`
- **Analytics**: `felicity/apps/analytics/` — EntityAnalyticsInit
- **Permissions**: Requires `IsAuthenticated` and `HasPermission(FAction.READ, FObject.ANALYTICS)`

## Frontend

- Dashboard views in `webapp/views/dashboard/`
- StatCard components for KPI display
- Charts via @antv/g2, @antv/g2plot
