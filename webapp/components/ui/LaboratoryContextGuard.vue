<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useLaboratoryContextStore } from "@/stores/laboratory_context";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";

interface Props {
  requireLaboratory?: boolean;
  allowedLaboratories?: string[];
  redirectTo?: string;
  showFallback?: boolean;
  fallbackMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  requireLaboratory: true,
  allowedLaboratories: () => [],
  redirectTo: '/select-laboratory',
  showFallback: true,
  fallbackMessage: 'Please select a laboratory to continue.',
});

const contextStore = useLaboratoryContextStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isValidating = ref(true);
const validationError = ref<string | null>(null);

// Computed properties
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);
const hasValidContext = computed(() => Boolean(currentLaboratory.value));
const userIsAuthenticated = computed(() => authStore.auth.isAuthenticated);

const isContextAllowed = computed(() => {
  if (!currentLaboratory.value) return false;
  
  // If no specific laboratories are required, any laboratory is allowed
  if (props.allowedLaboratories.length === 0) return true;
  
  // Check if current laboratory is in allowed list
  return props.allowedLaboratories.includes(currentLaboratory.value.uid);
});

const shouldShowContent = computed(() => {
  if (!userIsAuthenticated.value) return false;
  if (!props.requireLaboratory) return true;
  if (!hasValidContext.value) return false;
  if (!isContextAllowed.value) return false;
  return true;
});

const errorMessage = computed(() => {
  if (!userIsAuthenticated.value) {
    return 'Authentication required to access this content.';
  }
  
  if (props.requireLaboratory && !hasValidContext.value) {
    return props.fallbackMessage;
  }
  
  if (!isContextAllowed.value) {
    return 'Access denied: Current laboratory context is not permitted for this content.';
  }
  
  return validationError.value;
});

// Methods
const validateContext = async () => {
  isValidating.value = true;
  validationError.value = null;

  try {
    // Wait for authentication to be ready
    if (!userIsAuthenticated.value) {
      await new Promise((resolve) => {
        const unwatch = watch(
          () => authStore.auth.isAuthenticated,
          (isAuth) => {
            if (isAuth) {
              unwatch();
              resolve(void 0);
            }
          },
          { immediate: true }
        );
        
        // Timeout after 5 seconds
        setTimeout(() => {
          unwatch();
          resolve(void 0);
        }, 5000);
      });
    }

    // If user is authenticated but no laboratory context required, we're good
    if (!props.requireLaboratory) {
      isValidating.value = false;
      return;
    }

    // Wait for laboratory context to be ready
    if (!currentLaboratory.value) {
      await new Promise((resolve) => {
        const unwatch = watch(
          currentLaboratory,
          (lab) => {
            if (lab) {
              unwatch();
              resolve(void 0);
            }
          },
          { immediate: true }
        );
        
        // Timeout after 10 seconds
        setTimeout(() => {
          unwatch();
          resolve(void 0);
        }, 10000);
      });
    }

    // Final validation
    if (props.requireLaboratory && !currentLaboratory.value) {
      validationError.value = 'No laboratory context available';
      return;
    }

    if (!isContextAllowed.value) {
      validationError.value = 'Laboratory context not permitted';
      return;
    }

  } catch (error) {
    console.error('Context validation error:', error);
    validationError.value = 'Context validation failed';
  } finally {
    isValidating.value = false;
  }
};

const handleContextSwitch = () => {
  // Re-validate when context changes
  validateContext();
};

const redirectToLaboratorySelection = () => {
  router.push(props.redirectTo);
};

const retryValidation = () => {
  validateContext();
};

// Lifecycle
onMounted(() => {
  validateContext();
  
  // Listen for context changes
  window.addEventListener('laboratoryContextChanged', handleContextSwitch);
});

// Watch for route changes that might require re-validation
watch(() => route.path, () => {
  if (props.requireLaboratory) {
    validateContext();
  }
});

// Watch for authentication changes
watch(() => authStore.auth.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    validateContext();
  }
});
</script>

<template>
  <div class="laboratory-context-guard">
    <!-- Loading State -->
    <div v-if="isValidating" class="flex items-center justify-center py-12">
      <div class="text-center space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="text-muted-foreground">Validating laboratory context...</p>
      </div>
    </div>

    <!-- Content (when context is valid) -->
    <div v-else-if="shouldShowContent">
      <slot></slot>
    </div>

    <!-- Error/Fallback States -->
    <div v-else class="py-12">
      <!-- Authentication Required -->
      <div v-if="!userIsAuthenticated" class="text-center space-y-6 max-w-md mx-auto">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-lock text-2xl text-yellow-600"></i>
        </div>
        <div>
          <h3 class="text-lg font-medium text-foreground mb-2">Authentication Required</h3>
          <p class="text-muted-foreground">
            You must be signed in to access this content.
          </p>
        </div>
        <div class="flex justify-center space-x-4">
          <button 
            @click="router.push('/auth/login')"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            Sign In
          </button>
        </div>
      </div>

      <!-- Laboratory Context Required -->
      <div v-else-if="props.requireLaboratory && !hasValidContext" class="text-center space-y-6 max-w-md mx-auto">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-building text-2xl text-blue-600"></i>
        </div>
        <div>
          <h3 class="text-lg font-medium text-foreground mb-2">Laboratory Context Required</h3>
          <p class="text-muted-foreground">{{ errorMessage }}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button 
            @click="redirectToLaboratorySelection"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <i class="fas fa-building mr-2"></i>
            Select Laboratory
          </button>
          <button 
            @click="retryValidation"
            class="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <i class="fas fa-refresh mr-2"></i>
            Retry
          </button>
        </div>
      </div>

      <!-- Laboratory Access Denied -->
      <div v-else-if="!isContextAllowed" class="text-center space-y-6 max-w-md mx-auto">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-ban text-2xl text-red-600"></i>
        </div>
        <div>
          <h3 class="text-lg font-medium text-foreground mb-2">Access Denied</h3>
          <p class="text-muted-foreground">{{ errorMessage }}</p>
          <div v-if="currentLaboratory" class="mt-4 p-3 bg-muted rounded-md">
            <div class="text-sm">
              <strong>Current Laboratory:</strong> {{ currentLaboratory.name }} ({{ currentLaboratory.code }})
            </div>
            <div v-if="props.allowedLaboratories.length > 0" class="text-sm mt-2">
              <strong>Required Laboratories:</strong> {{ props.allowedLaboratories.join(', ') }}
            </div>
          </div>
        </div>
        <div class="flex justify-center space-x-4">
          <button 
            @click="redirectToLaboratorySelection"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <i class="fas fa-exchange-alt mr-2"></i>
            Switch Laboratory
          </button>
          <button 
            @click="router.back()"
            class="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Go Back
          </button>
        </div>
      </div>

      <!-- Generic Error -->
      <div v-else class="text-center space-y-6 max-w-md mx-auto">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-exclamation-triangle text-2xl text-red-600"></i>
        </div>
        <div>
          <h3 class="text-lg font-medium text-foreground mb-2">Context Validation Error</h3>
          <p class="text-muted-foreground">{{ errorMessage || 'An unexpected error occurred while validating your laboratory context.' }}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button 
            @click="retryValidation"
            class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <i class="fas fa-refresh mr-2"></i>
            Retry Validation
          </button>
          <button 
            @click="router.push('/')"
            class="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <i class="fas fa-home mr-2"></i>
            Go Home
          </button>
        </div>
      </div>
    </div>

    <!-- Development Debug Info (only in development) -->
    <div v-if="import.meta.env.DEV" class="fixed bottom-4 right-4 p-3 bg-gray-900 text-white text-xs rounded-md max-w-xs">
      <div><strong>Context Guard Debug:</strong></div>
      <div>Authenticated: {{ userIsAuthenticated ? 'Yes' : 'No' }}</div>
      <div>Has Context: {{ hasValidContext ? 'Yes' : 'No' }}</div>
      <div>Context Allowed: {{ isContextAllowed ? 'Yes' : 'No' }}</div>
      <div>Should Show: {{ shouldShowContent ? 'Yes' : 'No' }}</div>
      <div v-if="currentLaboratory">Current Lab: {{ currentLaboratory.name }}</div>
      <div v-if="validationError">Error: {{ validationError }}</div>
    </div>
  </div>
</template>

<style scoped>
.laboratory-context-guard {
  min-height: 200px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>