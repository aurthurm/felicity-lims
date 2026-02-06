# Forms inside modals: current pattern

## Summary

The project no longer uses the deprecated `Form` component from `@/components/ui/form`.

Use this pattern for modal forms:

1. Create form state with `useForm(...)` in `<script setup>`.
2. Render a native `<form @submit.prevent="onSubmit">`.
3. Use `FormField` / `FormItem` / `FormControl` / `FormMessage` for fields.
4. Before opening the modal, call `resetForm({ values })` (or `setValues(values, false)`) so edit forms load correctly.

For pages with multiple sections/tabs and separate submit buttons:

5. Avoid one global `handleSubmit(...)` per section if the same `useForm` schema contains unrelated required fields.
6. Either:
    - create separate `useForm` instances per section, or
    - submit section actions from current `values` directly when appropriate.

## Why this avoids blank edit fields

Blank edit modals were caused by mismatched form instances when using separate form contexts.
With one `useForm` instance and a native `<form>`, the modal fields and submit handler share the same state.

## Checkbox rule

For boolean checkboxes in modal forms:

- On `FormField`, set:
    - `type="checkbox"`
    - `:checked-value="true"`
    - `:unchecked-value="false"`
- Bind checkbox with:
    - `<Checkbox v-bind="componentField" />`

This prevents `"on"` string values and keeps booleans typed correctly.

## Minimal example

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { object, boolean, string } from 'yup';

const schema = object({
    name: string().required(),
    active: boolean().nullable(),
});

const { handleSubmit, resetForm } = useForm({
    validationSchema: schema,
    initialValues: { name: '', active: false },
});

const onSubmit = handleSubmit(values => {
    // save values
});

function openEdit(item: { name: string; active: boolean }) {
    resetForm({ values: { name: item.name, active: item.active } });
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField name="name" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input v-bind="componentField" /></FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="active" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
                <FormControl><Checkbox v-bind="componentField" /></FormControl>
                <FormLabel>Active</FormLabel>
            </FormItem>
        </FormField>

        <Button type="submit">Save</Button>
    </form>
</template>
```
