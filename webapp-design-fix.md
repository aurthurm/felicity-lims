# Webapp Design Fixes

Design, typography, and styling issues identified across the Beak LIMS webapp, with recommended fixes.

---

## 1. Font & Typography Issues

### 1.1 Conflicting Font Families

| Location | Font Used | Issue |
|---------|-----------|-------|
| `webapp/index.css` | `Avenir, Helvetica, Arial, sans-serif` | Avenir is not loaded; falls back to system fonts |
| `webapp/layouts/LayoutDashboard.vue` | `font-roboto` | Roboto is not loaded; `font-roboto` may not exist in Tailwind by default |
| `webapp/assets/css/ckeditor.css` | Lato (Google Fonts) | Only Lato is actually loaded |
| `webapp/assets/css/style.css` (UMO vars) | `helvetica neue, helvetica, pingfang sc...` | Different stack for editor only |

**Recommendation:** Pick one primary font (e.g., Lato or Inter), load it, and use it consistently. Remove `font-roboto` or add Roboto if intended.

### 1.2 Invalid Tailwind Typography Classes

`text-md` is **not** a valid Tailwind class. Tailwind uses `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.

**Files using `text-md`:**

- `webapp/components/nav/NavigationMain.vue` (line 443)
- `webapp/views/admin/users/UsersListing.vue` (line 191)
- `webapp/views/admin/analyses/services/ServicesAdmin.vue` (lines 274, 280, 301–336)
- `webapp/views/admin/users/EnhancedUserRegistration.vue` (lines 975, 1000)
- `webapp/views/storage/ContainerView.tsx` (lines 33–53)
- `webapp/views/client/_id/Client.vue` (lines 92, 98, 110–129)
- `webapp/views/qcontrol/_id/QCSet.vue` (line 353)
- `webapp/components/person/PatientInfo.vue` (lines 37–145)
- `webapp/components/IIMapper.vue` (lines 479, 558, 609)

**Fix:** Replace `text-md` with `text-base` (or another valid Tailwind size).

### 1.3 Typography / Text Typos

- `webapp/views/admin/analyses/services/ServicesAdmin.vue` line 302: `'un-categprised'` → `'uncategorised'`
- `webapp/views/qcontrol/_id/QCSet.vue` line 353: `italics` → `italic` (Tailwind class)

---

## 2. Invalid Tailwind Classes

### 2.1 Malformed Class Strings

- `webapp/views/qcontrol/QualityControlListing.vue` line 93:
  - Current: `"text-gray-500rounded-smtransition duration-300"`
  - Fix: Add spaces: `"text-gray-500 rounded-sm transition duration-300"`

### 2.2 Invalid / Deprecated Tailwind Utilities

- `whitespace-no-wrap` → should be `whitespace-nowrap` (used in many files)
- `bg-linear-to-br` → should be `bg-gradient-to-br` (Login.vue, PasswordReset.vue)

### 2.3 Non-Standard Breakpoints

- `2lg:w-3/5` in ServicesAdmin.vue — `2lg` is not a standard Tailwind breakpoint. Use `xl` or `2xl` if needed.

---

## 3. Theme Token Deviations

Per `reads/StyleGuide.md`, use semantic tokens (`bg-primary`, `text-foreground`, etc.) instead of raw colors.

### 3.1 Hardcoded Colors (Bypass Theme)

| File | Pattern | Recommendation |
|------|---------|----------------|
| `NavigationSidebar.vue` | `text-gray-100`, `bg-gray-800`, `border-gray-100` | Use `text-primary-foreground`, `bg-primary`, etc. |
| `style.css` | `.btn-primary` uses `border-sky-800`, `text-gray-800` | Use `border-primary`, `text-foreground` |
| `style.css` | `.btn-secondary` uses `bg-gray-200`, `text-gray-800` | Use `bg-secondary`, `text-secondary-foreground` |
| `style.css` | `.card` uses `bg-white` | Use `bg-card` |
| `BillingListing.vue` | `bg-green-100`, `bg-gray-100`, `text-gray-800` | Use `bg-success/10`, `bg-muted`, `text-foreground` |
| `Sample.vue` | `bg-gray-100`, `text-gray-700` | Use semantic tokens |
| `IIMapper.vue` | Many `bg-gray-*`, `text-gray-*` | Use `bg-muted`, `text-muted-foreground`, etc. |
| `LaboratoryContextSwitcher.vue` | `bg-green-500`, `bg-gray-400` | Use `bg-success`, `bg-muted` |
| `LayoutMobile.vue` | `bg-gray-100`, `bg-white`, `text-gray-800` | Use `bg-muted`, `bg-card`, `text-foreground` |
| `RuleNode.vue` | `bg-amber-50`, `border-amber-200` | Consider theme tokens or intentional accent |

### 3.2 Non-Theme Focus Rings

- `Login.vue`, `PasswordReset.vue`: `focus:ring-indigo-200`, `hover:text-indigo-800` — use `focus:ring-ring`, `hover:text-accent` per Style Guide.

---

## 4. Component Styling Inconsistencies

### 4.1 Table Padding

- `fel-table`: `th` uses `px-3 py-3`, `td` uses `px-3 py-2`
- Some tables: `px-6 py-4` (e.g., UsersListing)
- Others: `px-3 py-3.5` (th), `px-3 py-4` (td)

**Recommendation:** Standardize on `.fel-table` or a shared table component.

### 4.2 Form Input Styles

- `LocationAdmin.vue` uses a shared `inputClass` string
- Many views repeat long inline `class` strings for inputs

**Recommendation:** Extract shared form input classes into a composable or component.

### 4.3 Heading Hierarchy

- `FelPageHeading`: `h1` with `text-2xl font-bold text-card-foreground`
- `UsersListing`: `h1` with `text-2xl font-semibold` (no `text-card-foreground`)
- `Groups`: `h2` with `text-2xl font-semibold` for page title
- `AnalysesProfiles`: mix of `h2`, `h3` with `text-xl`, `text-lg`, `text-sm`

**Recommendation:** Define a typography scale (e.g., h1 → `text-2xl`, h2 → `text-xl`, h3 → `text-lg`) and apply consistently.

---

## 5. Summary: Priority Fixes

| Priority | Issue | Action |
|----------|-------|--------|
| High | `text-md` invalid | Replace with `text-base` |
| High | `whitespace-no-wrap` → `whitespace-nowrap` | Fix all occurrences |
| High | `bg-linear-to-br` → `bg-gradient-to-br` | Fix in Login.vue, PasswordReset.vue |
| High | `text-gray-500rounded-smtransition` malformed | Add spaces |
| High | `font-roboto` without Roboto loaded | Remove or add Roboto |
| Medium | Hardcoded colors | Migrate to semantic tokens |
| Medium | `italics` → `italic` | Fix in QCSet.vue |
| Medium | `un-categprised` typo | Fix in ServicesAdmin.vue |
| Low | `focus:ring-indigo-*` | Switch to theme tokens |
| Low | Table padding | Standardize across tables |

---

## 6. Suggested Implementation Order

1. Fix invalid Tailwind classes and typos (quick wins).
2. Consolidate font loading and usage.
3. Migrate hardcoded colors to semantic tokens.
4. Standardize table and form input styles.
5. Define and apply a typography scale.
