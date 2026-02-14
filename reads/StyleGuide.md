# Tailwind CSS Usage Style Guide

## 1. Introduction

Felicity LIMS uses **Tailwind CSS v4** with a CSS-first configuration. Theme variables are defined in `webapp/assets/css/style.css` using `@theme` and `@layer theme`. Utility classes like `bg-primary`, `text-foreground`, and `border-border` map to CSS custom properties, enabling components to adapt automatically to the active theme.

## 2. Core Concepts

### Applying Themes
Activate a theme by setting `data-theme` on the `<html>` element (e.g., `data-theme="dark"`, `data-theme="clinical-blue"`). Available themes: `dark`, `black-and-white`, `sterile`, `clinical-blue`, `emergency-red`, `sterile-green`, `warm-neutral`, `cool-slate`, `corporate-navy`.

### Using Utility Classes
Leverage the mapped utility classes in your HTML/JSX. These classes resolve to CSS variables from the active theme:

- `bg-primary` → `--primary`
- `text-foreground` → `--foreground`
- `border-border` → `--border`
- `rounded-lg` → `--radius`

Always pair background and foreground utilities correctly to ensure readability across themes (e.g., `bg-primary` with `text-primary-foreground`).

## 3. Variable Mapping and Usage (via Utilities)

### Layout
- `bg-background`: Main page background
- `text-foreground`: Default text color on `bg-background`

### Cards/Modals
- `bg-card`: Elevated surface background
- `text-card-foreground`: Text color on `bg-card`

### Popovers/Menus
- `bg-popover`: Background for floating elements
- `text-popover-foreground`: Text color on `bg-popover`

### Primary Actions
- `bg-primary`, `text-primary`, `border-primary`: Main action color
- `text-primary-foreground`: Text/icon color on `bg-primary`

### Secondary Actions
- `bg-secondary`, `text-secondary`, `border-secondary`
- `text-secondary-foreground`

### Muted Elements
- `bg-muted`
- `text-muted-foreground`

### Accent / Hover / Focus
- `bg-accent`, `text-accent`, `border-accent`
- `text-accent-foreground`

### Destructive / Errors
- `bg-destructive`, `text-destructive`, `border-destructive`
- `text-destructive-foreground`

### Success / Confirmation
- `bg-success`, `text-success`, `border-success`
- `text-success-foreground`

### Warning State
- `bg-warning`, `text-warning`, `border-warning`
- `text-warning-foreground`

### Information State
- `bg-info`, `text-info`, `border-info`
- `text-info-foreground`

### Borders
- `border-border`: Default border color
- `border-input`: For form input borders

### Focus Ring
- `ring-ring`: Color for focus outlines (used with `focus:ring-2`, etc.)

### Border Radius
- `rounded-lg`: Applies the radius defined by `--radius`

## 4. Component Styling Examples

### Buttons
```html
<!-- Primary -->
<button class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg ...">Submit</button>

<!-- Secondary -->
<button class="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg ...">Cancel</button>

<!-- Destructive -->
<button class="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg ...">Delete</button>
```

### Cards
```html
<div class="bg-card text-card-foreground border border-border rounded-lg shadow-sm ...">
  <!-- content -->
</div>
```

### Inputs
```html
<input class="border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-primary rounded-lg ..." />
```

### Alerts
```html
<!-- Success (strong) -->
<div class="bg-success text-success-foreground p-4 rounded-lg">Success message</div>

<!-- Success (subtle) -->
<div class="bg-success/10 border border-success/20 text-success p-4 rounded-lg">Success message</div>

<!-- Warning -->
<div class="bg-warning text-warning-foreground p-4 rounded-lg">Warning message</div>

<!-- Info -->
<div class="bg-info text-info-foreground p-4 rounded-lg">Info message</div>

<!-- Error -->
<div class="bg-destructive text-destructive-foreground p-4 rounded-lg">Error message</div>
```

### Tables
```html
<thead class="bg-muted text-muted-foreground">
<tbody class="border-b border-border hover:bg-secondary/50">
```

### Menus
```html
<ul class="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg">
  <li class="hover:bg-accent hover:text-accent-foreground">Menu Item</li>
</ul>
```

## 5. Conclusion

Your `webapp/assets/css/style.css` bridges your CSS theme variables with Tailwind’s utility-first workflow. Use semantic utility classes (`bg-primary`, `text-muted-foreground`, etc.) to create consistent, themeable, and accessible interfaces.

**Tip:** Always pair background utilities with their corresponding foreground utilities for proper contrast and accessibility.

For advanced customization, use `@layer components` classes (e.g., `.fel-table`, `.btn-primary`) or reusable Vue components. Theme definitions: `webapp/assets/css/style.css` — `@layer theme` block.

