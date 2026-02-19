# Worksheets

## Overview

Worksheets support batch processing of samples. They group analyses for efficient data entry and tracking.

## Architecture

- **Entities**: `beak/modules/core/worksheet/entities.py` — WorkSheet, WorkSheetTemplate
- **Enums**: WorkSheetState in `beak/modules/core/worksheet/enum.py`
- **GraphQL**: Worksheet operations in analytics and analysis modules

## Workflow

- Worksheets are created from templates
- Samples are assigned to worksheets for batch processing
- State transitions track worksheet progress

## See Also

- [SampleManagement.md](SampleManagement.md)
