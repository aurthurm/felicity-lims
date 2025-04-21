import { ref, computed } from 'vue';

// Basic validation rules
export const required = (value: any): boolean | string => {
    if (value === null || value === undefined) return 'This field is required';
    if (typeof value === 'string' && !value.trim()) return 'This field is required';
    if (Array.isArray(value) && !value.length) return 'Please select at least one item';
    return true;
};

export const email = (value: string): boolean | string => {
    if (!value) return true; // Allow empty values unless combined with required
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) || 'Invalid email address';
};

export const minLength = (min: number) => (value: string): boolean | string => {
    if (!value) return true; // Allow empty values unless combined with required
    return value.length >= min || `Must be at least ${min} characters`;
};

export const maxLength = (max: number) => (value: string): boolean | string => {
    if (!value) return true;
    return value.length <= max || `Must not exceed ${max} characters`;
};

export const numeric = (value: string): boolean | string => {
    if (!value) return true;
    return !isNaN(Number(value)) || 'Must be a number';
};

export const phone = (value: string): boolean | string => {
    if (!value) return true;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(value) || 'Invalid phone number';
};

export const url = (value: string): boolean | string => {
    if (!value) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return 'Invalid URL';
    }
};


// Form validation composable
export default function useFormValidation() {
    const errors = ref<Record<string, string>>({});
    const isValid = computed(() => Object.keys(errors.value).length === 0);

    const validate = (rules: Record<string, Function[]>, values: Record<string, any>): boolean => {
        errors.value = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            for (const rule of fieldRules) {
                const result = rule(values[field]);
                if (result !== true) {
                    errors.value[field] = result as string;
                    break;
                }
            }
        }

        return isValid.value;
    };

    const validateField = (value: any, rules: Function[]): string | null => {
        for (const rule of rules) {
            const result = rule(value);
            if (result !== true) {
                return result as string;
            }
        }
        return null;
    };

    return {
        errors,
        isValid,
        validate,
        validateField,
        // Export individual validators
        required,
        email,
        minLength,
        maxLength,
        numeric,
        phone,
        url,
    };
}
