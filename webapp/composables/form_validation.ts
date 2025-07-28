import { ref, reactive, computed } from "vue";

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  password?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | boolean;
  match?: string; // Field name to match against
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
  form: T,
  rules: ValidationRules
) {
  const errors = reactive<ValidationErrors>({});
  const touched = reactive<Record<string, boolean>>({});

  // Clear all errors
  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      delete errors[key];
    });
  };

  // Clear error for specific field
  const clearError = (field: string) => {
    delete errors[field];
  };

  // Mark field as touched
  const touch = (field: string) => {
    touched[field] = true;
  };

  // Validate single field
  const validateField = (field: string, value: any): string => {
    const rule = rules[field];
    if (!rule) return "";

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return "";
    }

    // Email validation
    if (rule.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    // Password validation
    if (rule.password && typeof value === 'string') {
      if (value.length < 8) {
        return "Password must be at least 8 characters long";
      }
      if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter";
      }
      if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter";
      }
      if (!/\d/.test(value)) {
        return "Password must contain at least one number";
      }
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters long`;
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters long`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return "Invalid format";
    }

    // Match validation (for password confirmation)
    if (rule.match && form[rule.match] !== value) {
      return "Values do not match";
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value);
      if (typeof result === 'string') {
        return result;
      }
      if (result === false) {
        return "Invalid value";
      }
    }

    return "";
  };

  // Validate all fields
  const validate = (): boolean => {
    clearErrors();
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    return isValid;
  };

  // Validate and set error for specific field
  const validateAndSetError = (field: string) => {
    const error = validateField(field, form[field]);
    if (error) {
      errors[field] = error;
    } else {
      clearError(field);
    }
    return !error;
  };

  // Check if form is valid
  const isValid = computed(() => {
    return Object.keys(rules).every(field => {
      return !validateField(field, form[field]);
    });
  });

  // Check if field has error
  const hasError = (field: string) => {
    return !!errors[field];
  };

  // Get error for field
  const getError = (field: string) => {
    return errors[field] || "";
  };

  // Check if field is touched
  const isTouched = (field: string) => {
    return !!touched[field];
  };

  return {
    errors,
    touched,
    clearErrors,
    clearError,
    touch,
    validateField,
    validate,
    validateAndSetError,
    isValid,
    hasError,
    getError,
    isTouched,
  };
}

// Password strength checker
export function usePasswordStrength() {
  const getPasswordStrength = (password: string): {
    score: number;
    label: string;
    color: string;
  } => {
    if (!password) {
      return { score: 0, label: "No password", color: "gray" };
    }

    let score = 0;
    
    // Length checks
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    
    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
    if (!/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) score += 1; // No sequential characters

    if (score <= 2) {
      return { score, label: "Weak", color: "red" };
    } else if (score <= 4) {
      return { score, label: "Fair", color: "orange" };
    } else if (score <= 6) {
      return { score, label: "Good", color: "yellow" };
    } else {
      return { score, label: "Strong", color: "green" };
    }
  };

  return { getPasswordStrength };
}

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    password: true,
  },
  passwordConfirm: {
    required: true,
    match: "password",
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  userName: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  phoneNumber: {
    pattern: /^[\+]?[\d\s\-\(\)]+$/,
  },
  employeeId: {
    pattern: /^[a-zA-Z0-9\-]+$/,
  },
} satisfies ValidationRules;

// Real-time validation composable
export function useRealTimeValidation<T extends Record<string, any>>(
  form: T,
  rules: ValidationRules
) {
  const { errors, validateAndSetError, touch, isValid, hasError, getError } = useFormValidation(form, rules);

  // Create reactive validation for each field
  const createFieldValidator = (field: string) => ({
    onBlur: () => {
      touch(field);
      validateAndSetError(field);
    },
    onInput: () => {
      if (errors[field]) {
        validateAndSetError(field);
      }
    },
  });

  return {
    errors,
    isValid,
    hasError,
    getError,
    createFieldValidator,
    touch,
    validateAndSetError,
  };
}