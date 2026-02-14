# Worksheets

## Overview

Worksheets support batch processing of samples. They group analyses for efficient data entry and tracking.

## Architecture

- **Entities**: `felicity/apps/worksheet/entities.py` — WorkSheet, WorkSheetTemplate
- **Enums**: WorkSheetState in `felicity/apps/worksheet/enum.py`
- **GraphQL**: Worksheet operations in analytics and analysis modules

## Workflow

- Worksheets are created from templates
- Samples are assigned to worksheets for batch processing
- State transitions track worksheet progress

## See Also

- [SampleManagement.md](SampleManagement.md)
