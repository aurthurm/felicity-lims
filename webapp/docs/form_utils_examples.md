# Form Utils Usage Examples

The `useFormUtils` composable provides a comprehensive solution for form handling in Vue 3 applications. Here are various examples of how to use it effectively.

## Basic Form Setup

```typescript
import { useFormUtils } from '@/composables/form_utils';
import { useNotifyToast } from '@/composables/alert_toast';

interface ShipmentForm {
    courier: string;
    laboratory: {
        uid: string;
        name: string;
    } | null;
    comment: string;
    samples: Array<{
        uid: string;
        sampleId: string;
    }>;
}

const { toastSuccess, toastError } = useNotifyToast();

const form = useFormUtils<ShipmentForm>({
    initialValues: {
        courier: '',
        laboratory: null,
        comment: '',
        samples: []
    },
    validate: (values) => {
        const errors: Record<string, string> = {};
        
        if (!values.courier) {
            errors.courier = 'Courier is required';
        }
        
        if (!values.laboratory?.uid) {
            errors.laboratory = 'Laboratory is required';
        }
        
        if (values.samples.length === 0) {
            errors.samples = 'At least one sample is required';
        }
        
        if (values.comment && values.comment.length < 10) {
            errors.comment = 'Comment must be at least 10 characters';
        }
        
        return errors;
    },
    onSubmit: async (values) => {
        await createShipment(values);
    },
    onSuccess: () => {
        toastSuccess('Shipment created successfully');
    },
    onError: (error) => {
        toastError(error.message || 'Failed to create shipment');
    }
});
```

## Component Integration

```vue
<template>
    <form @submit="handleSubmit" class="space-y-4">
        <!-- Courier Field -->
        <div class="form-group">
            <label for="courier" class="form-label">Courier</label>
            <input
                id="courier"
                v-model="values.courier"
                type="text"
                class="form-input"
                :class="{ 'error': errors.courier && isFieldTouched('courier') }"
                @blur="setFieldTouched('courier')"
            />
            <span v-if="errors.courier && isFieldTouched('courier')" class="error-message">
                {{ errors.courier }}
            </span>
        </div>

        <!-- Laboratory Selection -->
        <div class="form-group">
            <label for="laboratory" class="form-label">Reference Laboratory</label>
            <select
                id="laboratory"
                v-model="values.laboratory"
                class="form-select"
                :class="{ 'error': errors.laboratory && isFieldTouched('laboratory') }"
                @change="setFieldTouched('laboratory')"
            >
                <option value="">Select Laboratory</option>
                <option v-for="lab in laboratories" :key="lab.uid" :value="lab">
                    {{ lab.name }}
                </option>
            </select>
            <span v-if="errors.laboratory && isFieldTouched('laboratory')" class="error-message">
                {{ errors.laboratory }}
            </span>
        </div>

        <!-- Comment Field -->
        <div class="form-group">
            <label for="comment" class="form-label">Comment</label>
            <textarea
                id="comment"
                v-model="values.comment"
                class="form-textarea"
                :class="{ 'error': errors.comment && isFieldTouched('comment') }"
                @blur="setFieldTouched('comment')"
            ></textarea>
            <span v-if="errors.comment && isFieldTouched('comment')" class="error-message">
                {{ errors.comment }}
            </span>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
            <button
                type="submit"
                class="btn btn-primary"
                :disabled="!isValid || isSubmitting"
            >
                {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useFormUtils } from '@/composables/form_utils';

const {
    values,
    errors,
    isValid,
    isSubmitting,
    handleSubmit,
    setFieldTouched,
    isFieldTouched
} = form;
</script>
```

## Advanced Usage

### Field Watching with Debounce

```typescript
// Watch courier field with debounce
const debouncedCourierUpdate = form.debounce((value: string) => {
    validateCourierAvailability(value);
}, 300);

form.watchField('courier', (newValue) => {
    debouncedCourierUpdate(newValue);
});
```

### Throttled API Calls

```typescript
// Throttle laboratory selection updates
const throttledLabUpdate = form.throttle((labId: string) => {
    fetchLabDetails(labId);
}, 1000);

form.watchField('laboratory', (newValue) => {
    if (newValue?.uid) {
        throttledLabUpdate(newValue.uid);
    }
});
```

### Dynamic Validation

```typescript
const validateField = (field: keyof ShipmentForm) => {
    const value = form.values[field];
    let error: string | null = null;

    switch (field) {
        case 'courier':
            if (!value) error = 'Courier is required';
            else if (value.length < 3) error = 'Courier name too short';
            break;
        case 'laboratory':
            if (!value?.uid) error = 'Laboratory is required';
            break;
        case 'samples':
            if (!value.length) error = 'At least one sample is required';
            break;
    }

    form.setFieldError(field, error);
};
```

### Form Reset with Confirmation

```typescript
const resetFormWithConfirmation = async () => {
    const { isConfirmed } = await swalConfirm(
        'Are you sure you want to reset the form?',
        'This will clear all entered data'
    );

    if (isConfirmed) {
        form.resetForm();
        toastSuccess('Form has been reset');
    }
};
```

### Handling File Uploads

```typescript
const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
        form.setSubmitting(true);
        const uploadedFile = await uploadFile(file);
        form.setFieldValue('attachment', uploadedFile);
        toastSuccess('File uploaded successfully');
    } catch (error) {
        toastError('Failed to upload file');
    } finally {
        form.setSubmitting(false);
    }
};
```

## Best Practices

1. **Type Safety**
   - Always define interfaces for your form values
   - Use TypeScript generics when creating the form
   - Validate all API responses against your types

2. **Error Handling**
   - Show field errors only after they've been touched
   - Provide clear error messages
   - Handle both validation and submission errors

3. **Performance**
   - Use debounce for search inputs
   - Use throttle for API calls
   - Avoid unnecessary re-renders

4. **User Experience**
   - Show loading states during submissions
   - Provide feedback for all user actions
   - Clear error messages when fields are corrected

5. **Validation**
   - Validate on blur for better UX
   - Provide immediate feedback for critical fields
   - Use async validation when needed

## CSS Classes

```css
.form-group {
    @apply mb-4;
}

.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input,
.form-select,
.form-textarea {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm 
           focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}

.error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

.error-message {
    @apply text-sm text-red-500 mt-1;
}

.btn {
    @apply px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
    @apply bg-indigo-600 text-white hover:bg-indigo-700 
           focus:ring-indigo-500 disabled:opacity-50;
}
```

This example demonstrates a complete implementation of form handling using the `useFormUtils` composable, including:
- Type-safe form handling
- Validation
- Error handling
- Field tracking
- Performance optimization
- User experience considerations
- Styling with Tailwind CSS 