import { ref, computed } from 'vue';
import { useLaboratoryContextStore } from '@/stores/laboratory_context';
import { useAuthStore } from '@/stores/auth';

// Context header names for different API calls
const CONTEXT_HEADERS = {
  LABORATORY_UID: 'X-Laboratory-UID',
  LABORATORY_CODE: 'X-Laboratory-Code',
  USER_UID: 'X-User-UID',
  CONTEXT_TIMESTAMP: 'X-Context-Timestamp',
  CONTEXT_VERSION: 'X-Context-Version',
} as const;

const CONTEXT_VERSION = '1.0';

interface ContextAwareRequest {
  headers?: Record<string, string>;
  variables?: Record<string, any>;
  skipContextValidation?: boolean;
  requireLaboratoryContext?: boolean;
}

interface ContextValidationResult {
  valid: boolean;
  error?: string;
  laboratoryUid?: string;
  userUid?: string;
}

export function useLaboratoryContextMiddleware() {
  const contextStore = useLaboratoryContextStore();
  const authStore = useAuthStore();

  // Current context information
  const currentLaboratoryUid = computed(() => 
    contextStore.context.activeLaboratory?.uid
  );
  
  const currentUserUid = computed(() => 
    authStore.auth.user?.uid
  );

  const isContextValid = computed(() => 
    Boolean(currentLaboratoryUid.value && currentUserUid.value)
  );

  // Validate context for request
  const validateContext = (requireLaboratoryContext = true): ContextValidationResult => {
    const userUid = currentUserUid.value;
    const laboratoryUid = currentLaboratoryUid.value;

    if (!userUid) {
      return {
        valid: false,
        error: 'User not authenticated',
      };
    }

    if (requireLaboratoryContext && !laboratoryUid) {
      return {
        valid: false,
        error: 'No active laboratory context',
      };
    }

    // Validate user has access to laboratory
    if (laboratoryUid && !contextStore.isLaboratoryAccessible(laboratoryUid)) {
      return {
        valid: false,
        error: 'User does not have access to current laboratory',
      };
    }

    return {
      valid: true,
      laboratoryUid,
      userUid,
    };
  };

  // Add context headers to request
  const addContextHeaders = (
    request: ContextAwareRequest = {},
    requireLaboratoryContext = true
  ): ContextAwareRequest => {
    const validation = validateContext(requireLaboratoryContext);
    
    if (!validation.valid && !request.skipContextValidation) {
      throw new Error(`Context validation failed: ${validation.error}`);
    }

    const headers = {
      ...request.headers,
      [CONTEXT_HEADERS.CONTEXT_VERSION]: CONTEXT_VERSION,
      [CONTEXT_HEADERS.CONTEXT_TIMESTAMP]: new Date().toISOString(),
    };

    if (validation.userUid) {
      headers[CONTEXT_HEADERS.USER_UID] = validation.userUid;
    }

    if (validation.laboratoryUid) {
      headers[CONTEXT_HEADERS.LABORATORY_UID] = validation.laboratoryUid;
      
      const laboratory = contextStore.getLaboratoryByUid(validation.laboratoryUid);
      if (laboratory?.code) {
        headers[CONTEXT_HEADERS.LABORATORY_CODE] = laboratory.code;
      }
    }

    return {
      ...request,
      headers,
    };
  };

  // Add context variables to GraphQL request
  const addContextVariables = (
    request: ContextAwareRequest = {},
    requireLaboratoryContext = true
  ): ContextAwareRequest => {
    const validation = validateContext(requireLaboratoryContext);
    
    if (!validation.valid && !request.skipContextValidation) {
      throw new Error(`Context validation failed: ${validation.error}`);
    }

    const variables = {
      ...request.variables,
    };

    // Add laboratory context to variables if available
    if (validation.laboratoryUid) {
      variables.laboratoryUid = validation.laboratoryUid;
    }

    if (validation.userUid) {
      variables.userUid = validation.userUid;
    }

    return {
      ...request,
      variables,
    };
  };

  // Enhanced GraphQL request wrapper with context
  const withLaboratoryContext = <TResult = any, TVariables = any>(
    document: string,
    variables?: TVariables,
    options: {
      requireLaboratoryContext?: boolean;
      skipContextValidation?: boolean;
      operationName?: string;
    } = {}
  ) => {
    const {
      requireLaboratoryContext = true,
      skipContextValidation = false,
      operationName,
    } = options;

    try {
      const contextRequest = addContextHeaders(
        addContextVariables(
          {
            variables: variables as Record<string, any>,
            skipContextValidation,
            requireLaboratoryContext,
          },
          requireLaboratoryContext
        ),
        requireLaboratoryContext
      );

      return {
        document,
        variables: contextRequest.variables as TVariables,
        headers: contextRequest.headers,
        operationName,
        context: {
          laboratoryUid: currentLaboratoryUid.value,
          userUid: currentUserUid.value,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Context middleware error:', error);
      throw error;
    }
  };

  // Context-aware fetch wrapper
  const fetchWithContext = async (
    url: string,
    options: RequestInit = {},
    requireLaboratoryContext = true
  ): Promise<Response> => {
    try {
      const contextRequest = addContextHeaders(
        {
          headers: options.headers as Record<string, string>,
          requireLaboratoryContext,
        },
        requireLaboratoryContext
      );

      const enhancedOptions: RequestInit = {
        ...options,
        headers: {
          ...options.headers,
          ...contextRequest.headers,
        },
      };

      return fetch(url, enhancedOptions);
    } catch (error) {
      console.error('Context-aware fetch error:', error);
      throw error;
    }
  };

  // Check if operation requires laboratory context
  const operationRequiresLaboratoryContext = (operationName?: string): boolean => {
    if (!operationName) return true;

    // Operations that don't require laboratory context
    const globalOperations = [
      'authenticate',
      'refresh',
      'logout',
      'getUser',
      'getUserLaboratories',
      'setActiveLaboratory',
      'validatePasswordResetToken',
      'resetPassword',
      'requestPasswordReset',
    ];

    return !globalOperations.some(op => 
      operationName.toLowerCase().includes(op.toLowerCase())
    );
  };

  // Context change listener for automatic request retry
  const retryRequestOnContextChange = (
    originalRequest: () => Promise<any>,
    maxRetries = 3
  ) => {
    let retryCount = 0;

    const executeWithRetry = async (): Promise<any> => {
      try {
        return await originalRequest();
      } catch (error: any) {
        if (
          retryCount < maxRetries &&
          error.message?.includes('Context validation failed') &&
          contextStore.context.contextSwitching
        ) {
          retryCount++;
          
          // Wait for context switching to complete
          await new Promise(resolve => {
            const checkContext = () => {
              if (!contextStore.context.contextSwitching) {
                resolve(void 0);
              } else {
                setTimeout(checkContext, 100);
              }
            };
            checkContext();
          });

          return executeWithRetry();
        }
        throw error;
      }
    };

    return executeWithRetry();
  };

  // Setup automatic context injection for global error handling
  const setupContextErrorHandling = () => {
    // Listen for context change events
    window.addEventListener('laboratoryContextChanged', (event: any) => {
      console.log('Laboratory context changed:', event.detail);
      
      // Could trigger cache invalidation or other context-dependent updates
      const customEvent = new CustomEvent('contextDependentDataRefresh', {
        detail: {
          newLaboratoryUid: event.detail.newLaboratory?.uid,
          previousLaboratoryUid: event.detail.previousLaboratory?.uid,
          timestamp: event.detail.timestamp,
        },
      });
      window.dispatchEvent(customEvent);
    });
  };

  // Get context summary for debugging
  const getContextSummary = () => {
    return {
      isValid: isContextValid.value,
      laboratoryUid: currentLaboratoryUid.value,
      laboratoryName: contextStore.context.activeLaboratory?.name,
      laboratoryCode: contextStore.context.activeLaboratory?.code,
      userUid: currentUserUid.value,
      userName: authStore.auth.user?.userName,
      isContextSwitching: contextStore.context.contextSwitching,
      hasMultipleLaboratories: contextStore.hasMultipleLaboratories,
      availableLaboratories: contextStore.context.availableLaboratories.length,
      lastSwitchTime: contextStore.context.lastSwitchTime,
    };
  };

  return {
    // Context state
    currentLaboratoryUid,
    currentUserUid,
    isContextValid,
    
    // Validation
    validateContext,
    
    // Request enhancement
    addContextHeaders,
    addContextVariables,
    withLaboratoryContext,
    fetchWithContext,
    
    // Utilities
    operationRequiresLaboratoryContext,
    retryRequestOnContextChange,
    setupContextErrorHandling,
    getContextSummary,
    
    // Constants
    CONTEXT_HEADERS,
    CONTEXT_VERSION,
  };
}

// Global context middleware instance
let globalContextMiddleware: ReturnType<typeof useLaboratoryContextMiddleware> | null = null;

export const getGlobalContextMiddleware = () => {
  if (!globalContextMiddleware) {
    globalContextMiddleware = useLaboratoryContextMiddleware();
    globalContextMiddleware.setupContextErrorHandling();
  }
  return globalContextMiddleware;
};

// Automatic setup when module is imported
if (typeof window !== 'undefined') {
  // Initialize global middleware
  getGlobalContextMiddleware();
}