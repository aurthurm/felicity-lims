## Felicity LIMS v0.2.3

Release date: 2026-02-14

### Highlights

- UI/UX refresh across webapp navigation and admin flows.
- Major webapp design-system consistency updates (typography, spacing, classes, and theme token alignment).
- Tailwind v4 migration and styling modernization.
- Improved tenant/laboratory context validation and security middleware behavior.
- Dashboard and analytics improvements, including inventory KPI enhancements and CSV export.
- Sample and billing workflow improvements (cost visibility, save-blocking overlays, and derived sample workflows).
- Reflex editor reliability fixes and broader component stability updates.
- Python 3.14 compatibility and dependency updates.

### Detailed Changelog (since v0.2.2)

- `bf228205` chore(release): bump version to 0.2.3
- `5f6237cd` feat(nav): redesign user display, mega menu, and nav item styling
- `14fa7285` chore: webapp design fixes and component updates
- `c01c3fed` feat(webapp): admin UX, sidebar, preferences, dashboard cards
- `4f320f09` chore(main): sync workspace changes
- `19a1fac4` style uniformity
- `3a1872c6` updated to remove coneole logs that are not necessary
- `c35bcaa4` fix: use VueFlow updateNodeData for reliable node data sync in reflex canvas
- `91bc5c9a` removed syncfusion for UMO only
- `a96bc2bb` extend fhir resources
- `8ebe93fe` fixing tests
- `9f6d33d1` updated loggers to debug
- `cd4b43d1` update items
- `afe88518` feat: enhance tenant context validation and middleware security
- `ff9bb01d` Add derived sample workflows, genealogy, and inventory KPIs
- `5c001803` fix(analytics): use ANY for department filters
- `f97d4901` feat(dashboard): add inventory KPI CSV export
- `964792b2` feat: apply department filters across views
- `8bf17e7a` updated user preferences to save departmental toggles
- `4e7f22bf` added sample overlay when saving so a user cannot interact with the form during save
- `ad9664a1` Add cost display to sample registration form with billing module integration
- `53d726d6` fix Vue component lifecycle error in grind Board view
- `4858c1dc` updated navigations, user preferences
- `d4a64f6b` updated report impress meta to reduce size
- `a0bcf4e5` fixed python 2.14.0 issues
- `888d8a42` successfull resolve dependencies for py 3.14.0
- `dac06b4d` Migrate to Tailwind CSS v4 - CSS-first configuration
- `1e64f524` upgrading tw to v4
- `ad0053df` updated db names matching, removed redundancies

