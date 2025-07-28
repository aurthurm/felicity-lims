import { ref } from "vue";
import useApiUtil from "@/composables/api_util";

// GraphQL validation mutation
const ValidateUserDataDocument = `
  mutation ValidateUserData($payload: UserValidationInputType!) {
    validateUserData(payload: $payload) {
      ... on UserValidationResultType {
        emailAvailable
        usernameAvailable
        employeeIdAvailable
        suggestions
      }
      ... on OperationError {
        error
      }
    }
  }
`;

interface UserValidationResult {
  emailAvailable: boolean;
  usernameAvailable: boolean;
  employeeIdAvailable: boolean;
  suggestions: string[];
}

interface UserValidationInput {
  email?: string;
  userName?: string;
  employeeId?: string;
}

export function useUserValidation() {
  const { withClientMutation } = useApiUtil();
  const validating = ref(false);
  const validationCache = ref<Map<string, UserValidationResult>>(new Map());

  // Debounced validation
  let validationTimer: NodeJS.Timeout | null = null;

  const validateUserData = async (input: UserValidationInput): Promise<UserValidationResult | null> => {
    const cacheKey = JSON.stringify(input);
    
    // Check cache first
    if (validationCache.value.has(cacheKey)) {
      return validationCache.value.get(cacheKey)!;
    }

    validating.value = true;

    try {
      const result = await withClientMutation(
        ValidateUserDataDocument,
        { payload: input },
        "validateUserData"
      );

      if (result.__typename === "UserValidationResultType") {
        const validationResult: UserValidationResult = {
          emailAvailable: result.emailAvailable,
          usernameAvailable: result.usernameAvailable,
          employeeIdAvailable: result.employeeIdAvailable,
          suggestions: result.suggestions || [],
        };

        // Cache the result
        validationCache.value.set(cacheKey, validationResult);
        return validationResult;
      }
      
      return null;
    } catch (error) {
      console.error("Error validating user data:", error);
      return null;
    } finally {
      validating.value = false;
    }
  };

  const validateEmailWithDebounce = (email: string, callback: (available: boolean, suggestions: string[]) => void) => {
    if (validationTimer) {
      clearTimeout(validationTimer);
    }

    validationTimer = setTimeout(async () => {
      if (!email.trim()) return;

      const result = await validateUserData({ email });
      if (result) {
        callback(result.emailAvailable, result.suggestions);
      }
    }, 500); // 500ms debounce
  };

  const validateUsernameWithDebounce = (userName: string, callback: (available: boolean, suggestions: string[]) => void) => {
    if (validationTimer) {
      clearTimeout(validationTimer);
    }

    validationTimer = setTimeout(async () => {
      if (!userName.trim()) return;

      const result = await validateUserData({ userName });
      if (result) {
        callback(result.usernameAvailable, result.suggestions);
      }
    }, 500); // 500ms debounce
  };

  const validateEmployeeIdWithDebounce = (employeeId: string, callback: (available: boolean) => void) => {
    if (validationTimer) {
      clearTimeout(validationTimer);
    }

    validationTimer = setTimeout(async () => {
      if (!employeeId.trim()) return;

      const result = await validateUserData({ employeeId });
      if (result) {
        callback(result.employeeIdAvailable);
      }
    }, 500); // 500ms debounce
  };

  const clearCache = () => {
    validationCache.value.clear();
  };

  return {
    validating,
    validateUserData,
    validateEmailWithDebounce,
    validateUsernameWithDebounce,
    validateEmployeeIdWithDebounce,
    clearCache,
  };
}

// Password strength utilities
export function usePasswordUtilities() {
  const generateSecurePassword = (length: number = 12): string => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one character from each required category
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const estimatePasswordStrength = (password: string): {
    score: number;
    level: 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
  } => {
    if (!password) {
      return { score: 0, level: 'weak', feedback: ['Password is required'] };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length checks
    if (password.length >= 8) score += 2;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('Avoid repeated characters');

    if (!/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      score += 1;
    } else {
      feedback.push('Avoid sequential characters');
    }

    // Determine level
    let level: 'weak' | 'fair' | 'good' | 'strong';
    if (score <= 3) level = 'weak';
    else if (score <= 5) level = 'fair';
    else if (score <= 7) level = 'good';
    else level = 'strong';

    return { score, level, feedback };
  };

  return {
    generateSecurePassword,
    estimatePasswordStrength,
  };
}

// Username generation utilities
export function useUsernameUtilities() {
  const generateUsernameFromEmail = (email: string): string => {
    if (!email.includes('@')) return '';
    
    const localPart = email.split('@')[0];
    // Remove special characters and convert to lowercase
    return localPart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  };

  const generateUsernameFromName = (firstName: string, lastName: string): string => {
    const cleanFirst = firstName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const cleanLast = lastName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    if (!cleanFirst && !cleanLast) return '';
    
    // Try different combinations
    const combinations = [
      `${cleanFirst}${cleanLast}`,
      `${cleanFirst}.${cleanLast}`,
      `${cleanFirst}_${cleanLast}`,
      `${cleanFirst[0]}${cleanLast}`,
      `${cleanFirst}${cleanLast[0]}`,
    ];
    
    return combinations[0]; // Return the first combination for now
  };

  const validateUsernameFormat = (username: string): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (!username) {
      errors.push('Username is required');
      return { valid: false, errors };
    }
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 30) {
      errors.push('Username must be no more than 30 characters long');
    }
    
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, dots, hyphens, and underscores');
    }
    
    if (/^[._-]/.test(username) || /[._-]$/.test(username)) {
      errors.push('Username cannot start or end with dots, hyphens, or underscores');
    }
    
    if (/[._-]{2,}/.test(username)) {
      errors.push('Username cannot contain consecutive dots, hyphens, or underscores');
    }
    
    return { valid: errors.length === 0, errors };
  };

  return {
    generateUsernameFromEmail,
    generateUsernameFromName,
    validateUsernameFormat,
  };
}