# Reports

## Overview

Beak LIMS supports report generation and export. Reports include analysis results, billing summaries, and laboratory analytics.

## Features

- Report generation via GraphQL and backend services
- Impress.js integration for report rendering (meta size reduced in v0.2.3)
- Export formats: PDF, CSV where supported

## Architecture

- Report-related queries in `beak/api/gql/` (billing, analytics)
- Frontend report views and components
