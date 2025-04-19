# Tailwind CSS Usage Style Guide

## 1. Introduction

This guide explains how to effectively use the Tailwind CSS setup defined in your `tailwind.config.js` file. The configuration maps standard Tailwind utility classes (like `bg-primary`, `text-foreground`, `border-border`) to CSS custom properties (variables) defined in your themes (`:root`, `.dark`, `.theme-clinical-blue`, etc.). This enables components to adapt automatically to the currently active theme.

## 2. Core Concepts

### Applying Themes
Activate a theme by adding its class name (found in the safelist array in your config, e.g., `theme-clinical-blue`) to the `<html>` or `<body>` tag. The `dark` class activates the dark theme.

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

Your `tailwind.config.js` bridges your CSS theme variables with Tailwind’s utility-first workflow. Use semantic utility classes (`bg-primary`, `text-muted-foreground`, etc.) to create consistent, themeable, and accessible interfaces.

**Tip:** Always pair background utilities with their corresponding foreground utilities for proper contrast and accessibility.

For advanced customization and reusability, consider abstracting frequently used combinations into reusable Vue components or utility classes.

