# UI Migration Plan (shadcn-vue) — Reassessment

Date: 2026-01-31

## Scope

Reassess the entire webapp for any remaining UI migration work to shadcn-vue. The focus is on legacy UI primitives and adapter coverage, not feature-level components.

## Findings

### 1) Adapter coverage is complete

All legacy Fel\* primitives are now wrappers over shadcn-vue components:

- FelButton → ui/button
- FelModal → ui/dialog
- FelDrawer → ui/sheet (drawer fallback)
- FelTabs / FelTabsAside → ui/tabs
- FelSelect → ui/select
- FelSwitch → ui/switch
- FelLoader → ui/spinner
- FelAccordion → ui/accordion
- FelBadge → ui/badge
- FelInputTags → ui/tags-input
- FelAutoComplete → ui/command + ui/popover
- FelDataTable → ui/table + ui/pagination
- FelProtectedInput → ui/input

### 2) No legacy primitives remain

Search for removed/legacy primitives found nothing:

- EnhancedFormInput / EnhancedFormSelect: none
- Base\* input/button/select patterns: none

### 3) Feature components still present (expected)

These are higher-level components that are not direct shadcn replacements, but they already rely on shadcn tokens or Fel\* adapters:

- FelNotification, FelAuditLog
- FelSampleListing, FelAnalyisRequestListing
- FelTreeItem, FelInbox, FelJsonPreViewer
- FelPageHeading, FelAdminBreadCrumb, FelLink, FelFooterMain
- FelTaskCard, FelBoardCard

## Remaining Migration Work

**None required for the base UI migration.** All primitives and shared adapters are aligned with shadcn-vue.

## Optional Follow-ups (if desired)

1. Adapter retirement: gradually replace Fel\* wrappers with direct shadcn usage in views to reduce indirection.
2. Form consistency: standardize on ui/form wrappers in newer or frequently modified forms for consistent validation and layout.
3. Visual QA sweep: verify spacing/typography for feature components that don’t directly map to shadcn primitives (e.g., FelInbox, FelTreeItem).

## Ongoing Guidance

- New screens should use shadcn-vue primitives directly.
- Existing views can keep Fel\* adapters unless we explicitly decide to deprecate them.
