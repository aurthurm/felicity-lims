# Table design guide

## Summary

All data tables in the webapp share a consistent visual design: card-style container with border, subtle shadow, and uniform typography and spacing. This guide defines the standard pattern.

## Standard structure

```html
<div class="border border-border bg-card rounded-lg shadow-md">
  <div class="relative w-full overflow-auto">
    <Table class="w-full caption-bottom text-sm">
      <TableHeader class="[&_tr]:border-b">
        <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
            Column 1
          </TableHead>
          <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody class="[&_tr:last-child]:border-0">
        <TableRow v-for="item in items" :key="item.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <TableCell class="px-4 py-3 align-middle text-sm">{{ item.name }}</TableCell>
          <TableCell class="px-4 py-3 align-middle text-right">
            <Button variant="outline" size="sm">Edit</Button>
          </TableCell>
        </TableRow>
        <TableEmpty v-if="!items?.length" :colspan="2">
          <Empty class="border-0 bg-transparent p-0">
            <EmptyContent>
              <EmptyHeader>
                <EmptyTitle>No items found</EmptyTitle>
                <EmptyDescription>Add an item to get started.</EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>
</div>
```

## Class reference

| Element | Classes | Notes |
|---------|---------|-------|
| **Outer wrapper** | `border border-border bg-card rounded-lg shadow-md` | Use `overflow-hidden` when the table scrolls vertically and you want to clip rounded corners. |
| **Inner scroll container** | `relative w-full overflow-auto` | Use `overflow-y-auto max-h-[Npx]` for fixed-height scrollable tables (e.g. permissions matrix). |
| **Table** | `w-full caption-bottom text-sm` | Add `table-fixed` for fixed column widths (e.g. permission matrix). |
| **TableHeader** | `[&_tr]:border-b` | |
| **Header row** | `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted` | |
| **TableHead** | `h-12 px-4 align-middle font-medium text-muted-foreground` | Add `text-left` or `text-right`; right-align the Actions column. |
| **TableBody** | `[&_tr:last-child]:border-0` | |
| **Body row** | `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted` | Use `bg-muted/50` for category/section header rows. |
| **TableCell** | `px-4 py-3 align-middle text-sm` | Use `py-2` for denser tables. Add `whitespace-nowrap` for cells that must not wrap. Use `text-right` for action cells. |

## Variations

### Scrollable table with max height

For tables that scroll vertically (e.g. permission matrix):

```html
<div class="border border-border bg-card rounded-lg shadow-md overflow-hidden">
  <div class="relative w-full overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
    <Table class="w-full table-fixed caption-bottom text-sm">
      ...
    </Table>
  </div>
</div>
```

### Sticky header

For tables with sticky headers during vertical scroll:

```html
<TableHead class="sticky top-0 z-10 h-12 px-4 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 text-left align-middle font-medium text-muted-foreground">
  Column
</TableHead>
```

### Empty state

Always provide a meaningful empty state via `TableEmpty`:

```html
<TableEmpty v-if="!items?.length" :colspan="N">
  <Empty class="border-0 bg-transparent p-0">
    <EmptyContent>
      <EmptyHeader>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>Add an item to get started.</EmptyDescription>
      </EmptyHeader>
    </EmptyContent>
  </Empty>
</TableEmpty>
```

## Avoid

- `divide-y divide-border` on Table or TableBody (use `border-b` on rows instead)
- `bg-background` on TableBody (inherits from card)
- `rounded-md` (use `rounded-lg`)
- `shadow-sm` (use `shadow-md` for visible drop shadow)
- `p-6` on the outer wrapper (table cells provide spacing via `px-4 py-3`)
- Inconsistent cell padding: prefer `px-4 py-3` for body cells
