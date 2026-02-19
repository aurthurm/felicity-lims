# Sample Management

## Overview

Sample management covers the complete sample lifecycle from receipt through analysis to dispatch, including worksheets, QC tracking, and result management.

## Sample Lifecycle

Typical states and transitions:

- **Received** → date_received
- **Submitted** → date_submitted (results entered)
- **Verified** → date_verified (reviewed)
- **Published** → date_published (released)

Process performance metrics track transitions such as:

- received_to_published
- received_to_submitted
- submitted_to_verified
- verified_to_published

## Architecture

- **Entities**: `beak/modules/core/analysis/entities/` — Sample, Analysis, AnalysisResult
- **Worksheets**: `beak/modules/core/worksheet/` — WorkSheet, WorkSheetTemplate
- **Enums**: SampleState, ResultState in `beak/modules/core/analysis/enum.py`

## Derived Samples

- Derived sample workflows and genealogy
- Cost visibility and billing integration on sample registration

## Worksheets

- Batch processing of samples
- WorkSheetState for tracking worksheet status
- See [WorkSheets.md](WorkSheets.md) for details

## Quality Control

- QC tracking integrated with analysis results
- QC levels, QC sets, QC templates

## GraphQL

Sample and analysis operations are in `beak/api/gql/analysis/` and related modules.
