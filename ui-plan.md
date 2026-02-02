# UI Migration Plan (shadcn-vue)

Principles:
- Use shadcn-vue defaults as-is.
- Avoid custom styling except layout (rows/columns/grids/spacing).
- Preserve existing component APIs during adapter phase to avoid large view changes.

## Phase 0 — Inventory & Mapping
- [ ] Build component mapping table (Fel* → shadcn-vue primitives)
- [ ] Identify high-usage views and prioritize migration order
- [ ] Validate shadcn components are imported and available

## Phase 1 — Component Adapters (Fel* wrappers)
- [ ] FelButton → ui/button
- [ ] FelModal → ui/dialog
- [ ] FelDrawer → ui/sheet (or ui/drawer if required)
- [ ] FelTabs + FelTabsAside → ui/tabs
- [ ] FelSelect → ui/select
- [ ] FelLoader → ui/spinner
- [ ] FelBadge → ui/badge
- [ ] FelAccordion → ui/accordion
- [ ] FelInputTags → ui/tags-input
- [ ] FelAutoComplete → ui/command + ui/popover

## Phase 2 — Navigation & Layout
- [ ] NavigationMain → ui/sidebar + ui/navigation-menu (where applicable)
- [ ] Breadcrumbs → ui/breadcrumb
- [ ] Layout shells updated to use shadcn defaults

## Phase 3 — Tables & Lists
- [ ] FelDataTable → ui/table (preserve sorting/filter/pagination logic)
- [ ] Pagination → ui/pagination
- [ ] Replace ad-hoc tables where they bypass FelDataTable

## Phase 4 — Forms & Inputs
- [ ] EnhancedFormInput → ui/input
- [ ] EnhancedFormSelect → ui/select
- [ ] FelProtectedInput → ui/input (retain behavior)
- [ ] Switches → ui/switch
- [ ] Checkboxes → ui/checkbox
- [ ] Radio groups → ui/radio-group
- [ ] Form wrappers → ui/form (label, description, message)

## Phase 5 — Feedback & Overlays
- [ ] Alerts → ui/alert
- [ ] Confirm dialogs → ui/alert-dialog
- [ ] Toasts → ui/sonner
- [ ] Tooltips → ui/tooltip
- [ ] Popovers → ui/popover
- [ ] Empty states → ui/empty

## Phase 6 — Feature Screens
- [ ] Admin listings (users, labs, inventory, etc.)
- [ ] Dashboard views
- [ ] Reflex editor UI chrome (non-canvas)
- [ ] Inventory flows
- [ ] Patient & client flows
- [ ] Billing flows

## Phase 7 — Cleanup & QA
- [ ] Remove unused custom CSS
- [ ] Remove deprecated components
- [ ] Run lint + smoke checks
- [ ] Accessibility and focus state review
