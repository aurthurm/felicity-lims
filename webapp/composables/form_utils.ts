import { ref, computed, watch, UnwrapRef } from 'vue';

export interface FormState<T = any> {
    values: UnwrapRef<T>;
    errors: Record<string, string>;
    touched: Set<string>;
    isDirty: boolean;
    isSubmitting: boolean;
    submitCount: number;
    lastSubmitted: Date | null;
}

export interface FormOptions<T = any> {
    initialValues: T;
    validate?: (values: T) => Record<string, string> | Promise<Record<string, string>>;
    onSubmit?: (values: T) => Promise<void> | void;
    onChange?: (values: T) => void;
    onError?: (error: any) => void;
    onSuccess?: (result: any) => void;
}

export default function useFormUtils<T extends Record<string, any>>(options: FormOptions<T>) {
    const {
        initialValues,
        validate,
        onSubmit,
        onChange,
        onError,
        onSuccess
    } = options;

    // Form state
    const state = ref<FormState<T>>({
        values: { ...initialValues } as UnwrapRef<T>,
        errors: {},
        touched: new Set(),
        isDirty: false,
        isSubmitting: false,
        submitCount: 0,
        lastSubmitted: null
    });

    // Computed properties
    const isDirty = computed(() => state.value.isDirty);
    const isSubmitting = computed(() => state.value.isSubmitting);
    const submitCount = computed(() => state.value.submitCount);
    const hasErrors = computed(() => Object.keys(state.value.errors).length > 0);
    const isValid = computed(() => !hasErrors.value);

    // Watch for changes in form values
    watch(
        () => state.value.values,
        (newValues) => {
            state.value.isDirty = true;
            onChange?.(newValues as T);
        },
        { deep: true }
    );

    // Field operations
    const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
        (state.value.values as T)[field] = value;
    };

    const setFieldTouched = (field: keyof T) => {
        state.value.touched.add(field as string);
    };

    const setFieldError = (field: keyof T, error: string | null) => {
        if (error) {
            state.value.errors[field as string] = error;
        } else {
            delete state.value.errors[field as string];
        }
    };

    const isFieldTouched = (field: keyof T): boolean => {
        return state.value.touched.has(field as string);
    };

    const getFieldError = (field: keyof T): string | null => {
        return state.value.errors[field as string] || null;
    };

    // Form operations
    const resetForm = () => {
        state.value = {
            values: { ...initialValues } as UnwrapRef<T>,
            errors: {},
            touched: new Set(),
            isDirty: false,
            isSubmitting: false,
            submitCount: 0,
            lastSubmitted: null
        };
    };

    const setSubmitting = (isSubmitting: boolean) => {
        state.value.isSubmitting = isSubmitting;
    };

    const validateForm = async (): Promise<boolean> => {
        if (!validate) return true;

        try {
            const errors = await validate(state.value.values as T);
            state.value.errors = errors;
            return Object.keys(errors).length === 0;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    };

    const handleSubmit = async (event?: Event) => {
        if (event) {
            event.preventDefault();
        }

        try {
            setSubmitting(true);
            state.value.submitCount++;
            state.value.lastSubmitted = new Date();

            const isValid = await validateForm();
            if (!isValid) {
                throw new Error('Form validation failed');
            }

            if (onSubmit) {
                await onSubmit(state.value.values as T);
                onSuccess?.(state.value.values as T);
            }
        } catch (error) {
            onError?.(error);
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // Utility functions
    const debounce = <F extends (...args: any[]) => any>(
        fn: F,
        delay: number
    ): ((...args: Parameters<F>) => void) => {
        let timeoutId: ReturnType<typeof setTimeout>;

        return (...args: Parameters<F>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const throttle = <F extends (...args: any[]) => any>(
        fn: F,
        limit: number
    ): ((...args: Parameters<F>) => void) => {
        let inThrottle: boolean;
        let lastResult: ReturnType<F>;

        return (...args: Parameters<F>) => {
            if (!inThrottle) {
                lastResult = fn(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
            return lastResult;
        };
    };

    // Form field watchers
    const watchField = <K extends keyof T>(
        field: K,
        callback: (value: T[K], oldValue: T[K]) => void
    ) => {
        watch(
            () => state.value.values,
            (newValues, oldValues) => {
                const newValue = (newValues as T)[field];
                const oldValue = (oldValues as T)[field];
                if (newValue !== oldValue) {
                    callback(newValue, oldValue);
                }
            },
            { deep: true, immediate: true }
        );
    };

    return {
        // State
        state,
        values: computed(() => state.value.values as T),
        errors: computed(() => state.value.errors),
        touched: computed(() => state.value.touched),
        isDirty,
        isSubmitting,
        submitCount,
        hasErrors,
        isValid,

        // Field operations
        setFieldValue,
        setFieldTouched,
        setFieldError,
        isFieldTouched,
        getFieldError,

        // Form operations
        resetForm,
        setSubmitting,
        validateForm,
        handleSubmit,

        // Utility functions
        debounce,
        throttle,
        watchField
    };
} 