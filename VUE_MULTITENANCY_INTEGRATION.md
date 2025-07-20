# 🌐 **Vue.js Multi-Tenancy Integration Guide**

## 🎯 **Overview**

This guide shows how to enhance your existing Vue.js frontend in Felicity LIMS to support multi-tenancy with laboratory context headers and tenant-aware functionality.

## 📂 **Current Frontend Structure**

Based on your codebase analysis:
- **Frontend Framework**: Vue.js SPA 
- **Build Output**: `/felicity/templates/static/` (served by FastAPI)
- **Source Code**: `/webapp/` directory
- **HTTP Client**: Axios with JWT authentication (`webapp/composables/axios.ts`)
- **Serving**: FastAPI serves the built Vue.js app

## 🔄 **Step 1: Enhance Axios Configuration**

### **Current Implementation** (`webapp/composables/axios.ts`):
```typescript
// ✅ Already has JWT authentication
// ✅ Already has request/response interceptors  
// ❌ Missing laboratory context headers
```

### **Enhanced Implementation**:

Update your existing `webapp/composables/axios.ts` file:

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { REST_BASE_URL, GQL_BASE_URL } from '@/conf';
import useNotifyToast from './alert_toast';
import { authToStorage, getAuthData } from '@/auth';
import { AuthenticatedData } from '@/types/gql';

// 🆕 Enhanced TypeScript interfaces for multi-tenancy
interface AuthData {
  auth?: {
    token?: string;
    refresh?: string;
  };
}

// 🆕 Add tenant context interfaces
interface TenantContext {
  currentLab?: string;
  accessibleLabs?: Array<{
    uid: string;
    name: string;
  }>;
  organization?: {
    uid: string;
    name: string;
  };
}

interface RefreshTokenResponse {
  data: {
    refresh: {
      token: string;
      tokenType: string;
      user: {
        uid: string;
        firstName: string;
        lastName: string;
        // 🆕 Add accessible labs to user data
        accessibleLabs?: Array<{
          uid: string;
          name: string;
        }>;
        groups: Array<{
          uid: string;
          name: string;
          keyword: string;
          pages: string[];
          // 🆕 Add laboratory_uid to groups
          laboratory_uid?: string;
          permissions: Array<{
            uid: string;
            action: string;
            target: string;
          }>;
        }>;
        preference: {
          uid: string;
          expandedMenu: boolean;
          theme: string;
          departments: Array<{
            uid: string;
            name: string;
          }>;
        };
      };
    };
  };
}

const { toastError } = useNotifyToast();

// 🆕 Tenant context management functions
export const getTenantContext = (): TenantContext => {
  return {
    currentLab: localStorage.getItem('currentLab') || undefined,
    accessibleLabs: JSON.parse(localStorage.getItem('accessibleLabs') || '[]'),
    organization: JSON.parse(localStorage.getItem('organization') || 'null'),
  };
};

export const setCurrentLab = (labId: string): void => {
  localStorage.setItem('currentLab', labId);
};

export const setAccessibleLabs = (labs: Array<{ uid: string; name: string }>): void => {
  localStorage.setItem('accessibleLabs', JSON.stringify(labs));
};

export const setOrganization = (org: { uid: string; name: string }): void => {
  localStorage.setItem('organization', JSON.stringify(org));
};

// 🆕 Generate request ID for correlation
const generateRequestId = (): string => {
  return 'req_' + Math.random().toString(36).substr(2, 9);
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${REST_BASE_URL}/api/v1/`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Laboratory-ID',
  },
});

// 🆕 Enhanced Request Interceptor with tenant headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const auth = getAuthData();
    const tenantContext = getTenantContext();

    if (config.headers) {
      // 1. Add JWT token (existing)
      if (auth?.token) {
        config.headers['Authorization'] = `Bearer ${auth.token}`;
      }

      // 🆕 2. Add laboratory context header
      if (tenantContext.currentLab) {
        config.headers['X-Laboratory-ID'] = tenantContext.currentLab;
      }

      // 🆕 3. Add request correlation ID
      config.headers['X-Request-ID'] = generateRequestId();

      // 🆕 4. Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🔍 Outgoing Request Headers');
        console.log('URL:', config.url);
        console.log('Method:', config.method?.toUpperCase());
        console.log('Headers:', {
          'Authorization': config.headers['Authorization'] ? '***REDACTED***' : 'Missing',
          'X-Laboratory-ID': config.headers['X-Laboratory-ID'] || 'Missing',
          'X-Request-ID': config.headers['X-Request-ID'] || 'Missing',
        });
        console.groupEnd();
      }
    }

    return config;
  },
  (error) => {
    toastError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return Promise.reject(error);
  }
);

// 🆕 Enhanced Response Interceptor with rate limit headers
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    // 🆕 Log rate limit headers in development
    if (process.env.NODE_ENV === 'development') {
      const rateLimitHeaders = {
        'User-Remaining': res.headers['x-ratelimit-user-remaining-minute'],
        'Lab-ID': res.headers['x-ratelimit-lab-id'],
        'Org-ID': res.headers['x-ratelimit-org-id'],
      };
      
      if (Object.values(rateLimitHeaders).some(v => v !== undefined)) {
        console.group('📥 Rate Limit Headers');
        console.log('Rate Limits:', rateLimitHeaders);
        console.groupEnd();
      }
    }
    
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    
    // Handle 401 (existing logic)
    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const auth = getAuthData();
        const response: RefreshTokenResponse = await axiosInstance.post(
          '',
          {
            query: `
              mutation refresh($refreshToken: String!) {
                refresh(refreshToken: $refreshToken) {
                  token
                  tokenType
                  user {
                    uid
                    firstName
                    lastName
                    accessibleLabs {
                      uid
                      name
                    }
                    groups {
                      permissions {
                        uid
                        action
                        target
                      }
                      uid
                      name
                      keyword
                      pages
                      laboratory_uid
                    }
                    preference {
                      uid
                      expandedMenu
                      theme
                      departments {
                        uid
                        name
                      }
                    }
                  }
                }
              }
            `,
            variables: { refreshToken: auth?.refresh }
          },
          {
            baseURL: GQL_BASE_URL
          }
        );

        // 🆕 Update tenant context from refreshed token
        const user = response.data.refresh.user;
        if (user.accessibleLabs) {
          setAccessibleLabs(user.accessibleLabs);
          
          // Set current lab if not already set
          const currentLab = getTenantContext().currentLab;
          if (!currentLab && user.accessibleLabs.length > 0) {
            setCurrentLab(user.accessibleLabs[0].uid);
          }
        }

        // Update localStorage with new auth data
        authToStorage(response.data as unknown as AuthenticatedData);
        
        // Retry the original request with new token
        return axiosInstance(originalConfig);
      } catch (error) {
        toastError('Session expired. Please log in again.');
        // 🆕 Clear tenant context on logout
        localStorage.removeItem('currentLab');
        localStorage.removeItem('accessibleLabs');
        localStorage.removeItem('organization');
        return Promise.reject(error);
      }
    }
    
    // 🆕 Handle 403 (Lab access denied)
    if (err.response && err.response.status === 403) {
      const message = err.response.data?.message || 'Access denied to laboratory';
      toastError(`Lab Access Denied: ${message}`);
      
      // Clear invalid lab context
      localStorage.removeItem('currentLab');
      return Promise.reject(err);
    }
    
    // 🆕 Handle 429 (Rate limit exceeded)
    if (err.response && err.response.status === 429) {
      const retryAfter = err.response.headers['retry-after'];
      const message = retryAfter 
        ? `Rate limit exceeded. Try again in ${retryAfter} seconds.`
        : 'Rate limit exceeded. Please slow down.';
      toastError(message);
      return Promise.reject(err);
    }
    
    // Handle other errors
    const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
    toastError(errorMessage);
    return Promise.reject(err);
  }
);

export default axiosInstance;
```

## 🔧 **Step 2: Create Tenant Context Composable**

Create `webapp/composables/tenant.ts`:

```typescript
import { ref, computed, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { getAuthData } from '@/auth';
import { setCurrentLab, setAccessibleLabs, setOrganization, getTenantContext } from './axios';

interface Laboratory {
  uid: string;
  name: string;
}

interface Organization {
  uid: string;
  name: string;
}

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface TenantState {
  user: User | null;
  currentLab: string | null;
  accessibleLabs: Laboratory[];
  organization: Organization | null;
  isAuthenticated: boolean;
  hasLabAccess: boolean;
}

// Global reactive state
const user = ref<User | null>(null);
const currentLab = ref<string | null>(null);
const accessibleLabs = ref<Laboratory[]>([]);
const organization = ref<Organization | null>(null);

export const useTenant = () => {
  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const hasLabAccess = computed(() => accessibleLabs.value.length > 0);
  const currentLabInfo = computed(() => 
    accessibleLabs.value.find(lab => lab.uid === currentLab.value)
  );

  // Initialize tenant context from localStorage and JWT
  const initializeTenantContext = () => {
    try {
      const auth = getAuthData();
      const tenantContext = getTenantContext();

      if (auth?.token) {
        // Decode JWT to get user info
        const decoded: any = jwtDecode(auth.token);
        
        user.value = {
          uid: decoded.user_uid || decoded.sub,
          firstName: decoded.firstName || '',
          lastName: decoded.lastName || '',
          email: decoded.email || '',
        };

        // Set organization from JWT
        if (decoded.organization_uid && decoded.organization_name) {
          const org = {
            uid: decoded.organization_uid,
            name: decoded.organization_name,
          };
          organization.value = org;
          setOrganization(org);
        }

        // Set accessible labs from JWT or localStorage
        if (decoded.accessible_labs) {
          accessibleLabs.value = decoded.accessible_labs;
          setAccessibleLabs(decoded.accessible_labs);
        } else if (tenantContext.accessibleLabs) {
          accessibleLabs.value = tenantContext.accessibleLabs;
        }

        // Set current lab
        if (tenantContext.currentLab && 
            accessibleLabs.value.some(lab => lab.uid === tenantContext.currentLab)) {
          currentLab.value = tenantContext.currentLab;
        } else if (accessibleLabs.value.length > 0) {
          // Default to first lab
          currentLab.value = accessibleLabs.value[0].uid;
          setCurrentLab(accessibleLabs.value[0].uid);
        }
      }
    } catch (error) {
      console.error('Error initializing tenant context:', error);
      logout();
    }
  };

  // Switch laboratory context
  const switchLab = async (labId: string): Promise<boolean> => {
    const lab = accessibleLabs.value.find(l => l.uid === labId);
    if (!lab) {
      console.error('Lab not found in accessible labs:', labId);
      return false;
    }

    try {
      // Validate lab access (optional API call)
      // const hasAccess = await validateLabAccess(labId);
      // if (!hasAccess) {
      //   throw new Error('Access denied to laboratory');
      // }

      currentLab.value = labId;
      setCurrentLab(labId);
      
      console.log(`Switched to lab: ${lab.name} (${labId})`);
      return true;
    } catch (error) {
      console.error('Failed to switch lab:', error);
      return false;
    }
  };

  // Logout and clear all tenant context
  const logout = () => {
    user.value = null;
    currentLab.value = null;
    accessibleLabs.value = [];
    organization.value = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentLab');
    localStorage.removeItem('accessibleLabs');
    localStorage.removeItem('organization');
  };

  // Optional: Validate lab access via API
  const validateLabAccess = async (labId: string): Promise<boolean> => {
    try {
      // Implement API call to validate lab access
      // const response = await axiosInstance.get(`/api/user/lab-access/${labId}`);
      // return response.data.hasAccess;
      return true; // Placeholder
    } catch (error) {
      console.error('Lab access validation failed:', error);
      return false;
    }
  };

  // Initialize on mount
  onMounted(() => {
    initializeTenantContext();
  });

  return {
    // State
    user: readonly(user),
    currentLab: readonly(currentLab),
    accessibleLabs: readonly(accessibleLabs),
    organization: readonly(organization),
    
    // Computed
    isAuthenticated,
    hasLabAccess,
    currentLabInfo,
    
    // Methods
    initializeTenantContext,
    switchLab,
    logout,
    validateLabAccess,
  };
};

// Export for use in other composables
export { user, currentLab, accessibleLabs, organization };
```

## 🎨 **Step 3: Create Lab Selector Component**

Create `webapp/components/LabSelector.vue`:

```vue
<template>
  <div v-if="hasLabAccess && accessibleLabs.length > 1" class="lab-selector">
    <div class="flex items-center space-x-2">
      <label for="lab-select" class="text-sm font-medium text-gray-700">
        Laboratory:
      </label>
      <select
        id="lab-select"
        v-model="selectedLab"
        @change="handleLabChange"
        class="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Select Laboratory</option>
        <option
          v-for="lab in accessibleLabs"
          :key="lab.uid"
          :value="lab.uid"
        >
          {{ lab.name }}
        </option>
      </select>
    </div>
    
    <!-- Current lab indicator -->
    <div v-if="currentLabInfo" class="mt-2 text-xs text-gray-500">
      Current: {{ currentLabInfo.name }}
    </div>
  </div>
  
  <!-- Single lab display -->
  <div v-else-if="hasLabAccess && accessibleLabs.length === 1" class="lab-indicator">
    <div class="flex items-center space-x-2">
      <span class="text-sm font-medium text-gray-700">Laboratory:</span>
      <span class="text-sm text-blue-600">{{ accessibleLabs[0].name }}</span>
    </div>
  </div>
  
  <!-- No lab access -->
  <div v-else class="lab-warning">
    <div class="text-sm text-red-600">
      ⚠️ No laboratory access
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTenant } from '@/composables/tenant';
import { useNotifyToast } from '@/composables/alert_toast';

const { 
  currentLab, 
  accessibleLabs, 
  hasLabAccess, 
  currentLabInfo, 
  switchLab 
} = useTenant();

const { toastSuccess, toastError } = useNotifyToast();

const selectedLab = ref(currentLab.value || '');

// Watch for external lab changes
watch(currentLab, (newLab) => {
  selectedLab.value = newLab || '';
});

// Handle lab selection change
const handleLabChange = async () => {
  if (!selectedLab.value) return;
  
  const success = await switchLab(selectedLab.value);
  if (success) {
    const lab = accessibleLabs.value.find(l => l.uid === selectedLab.value);
    toastSuccess(`Switched to ${lab?.name}`);
    
    // Optional: Reload page to reset state
    // window.location.reload();
  } else {
    toastError('Failed to switch laboratory');
    selectedLab.value = currentLab.value || '';
  }
};
</script>

<style scoped>
.lab-selector {
  @apply bg-white p-3 rounded-lg border border-gray-200 shadow-sm;
}

.lab-indicator {
  @apply bg-blue-50 p-2 rounded border border-blue-200;
}

.lab-warning {
  @apply bg-red-50 p-2 rounded border border-red-200;
}
</style>
```

## 🔧 **Step 4: Update Authentication Flow**

Update your authentication logic to handle tenant context:

```typescript
// In your login/auth composable or store
export const useAuth = () => {
  const { initializeTenantContext, logout } = useTenant();

  const login = async (credentials: LoginCredentials) => {
    try {
      // Your existing login logic
      const response = await authService.login(credentials);
      
      // Store auth data (existing)
      authToStorage(response.data);
      
      // 🆕 Initialize tenant context after login
      initializeTenantContext();
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    // Use tenant-aware logout
    logout();
    
    // Redirect to login page
    router.push('/login');
  };

  return {
    login,
    logout: handleLogout,
  };
};
```

## 📱 **Step 5: Update Your Main Layout**

Add the lab selector to your main layout:

```vue
<!-- In your main layout component -->
<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-content">
        <!-- Existing header content -->
        <div class="logo">Felicity LIMS</div>
        
        <!-- 🆕 Add lab selector -->
        <LabSelector />
        
        <!-- Existing user menu -->
        <div class="user-menu">
          <!-- ... existing user menu ... -->
        </div>
      </div>
    </header>
    
    <!-- Rest of your layout -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import LabSelector from '@/components/LabSelector.vue';
import { useTenant } from '@/composables/tenant';

// Initialize tenant context when app loads
const { initializeTenantContext } = useTenant();
initializeTenantContext();
</script>
```

## 🎯 **Step 6: Enhanced URQL GraphQL Client**

I see you're using URQL! Let's enhance your existing `webapp/urql.ts` with multi-tenancy support:

### **Enhanced URQL Configuration:**

Update your `webapp/urql.ts` file:

```typescript
import {
    createClient,
    cacheExchange,
    fetchExchange,
    errorExchange,
    subscriptionExchange,
    Exchange,
} from '@urql/vue';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { pipe, tap } from 'wonka';

import { getAuthData, authLogout } from '@/auth';
import { GQL_BASE_URL, WS_BASE_URL } from '@/conf';
import useNotifyToast from '@/composables/alert_toast';
// 🆕 Import tenant context functions
import { getTenantContext } from '@/composables/axios';

const { toastError } = useNotifyToast();

// 🆕 Generate request ID for correlation
const generateRequestId = (): string => {
  return 'req_' + Math.random().toString(36).substr(2, 9);
};

// 🆕 Enhanced subscription client with tenant context
const subscriptionClient = new SubscriptionClient(WS_BASE_URL, {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
        const authData = getAuthData();
        const tenantContext = getTenantContext();
        
        return {
            headers: {
                ...(authData?.token && {
                    'x-felicity-user-id': 'felicity-user-x',
                    'x-felicity-role': 'felicity-role-x',
                    Authorization: `Bearer ${authData?.token}`,
                }),
                // 🆕 Add laboratory context to WebSocket
                ...(tenantContext.currentLab && {
                    'X-Laboratory-ID': tenantContext.currentLab,
                }),
                // 🆕 Add request correlation
                'X-Request-ID': generateRequestId(),
            },
        };
    },
});

// 🆕 Enhanced result interceptor with tenant context logging
const resultInterceptorExchange: Exchange =
    ({ forward }) =>
    ops$ =>
        pipe(
            ops$,
            forward,
            tap(operationResult => {
                // 🆕 Debug logging in development
                if (process.env.NODE_ENV === 'development' && operationResult.data) {
                    const tenantContext = getTenantContext();
                    console.group('🔍 GraphQL Operation Result');
                    console.log('Operation:', operationResult.operation.query.definitions[0]?.name?.value || 'Anonymous');
                    console.log('Lab Context:', tenantContext.currentLab || 'No lab selected');
                    console.log('Data Items:', Array.isArray(operationResult.data) ? operationResult.data.length : 'Single item');
                    console.groupEnd();
                }

                // 🆕 Check for rate limit extensions in GraphQL response
                if (operationResult.extensions?.rateLimit) {
                    const rateLimit = operationResult.extensions.rateLimit;
                    console.log('📊 GraphQL Rate Limit Info:', rateLimit);
                }
            })
        );

export const urqlClient = createClient({
    url: GQL_BASE_URL,
    exchanges: [
        cacheExchange,
        // 🆕 Enhanced error handling with tenant awareness
        errorExchange({
            onError: (error, operation) => {
                const { graphQLErrors, networkError } = error;
              
                if (graphQLErrors?.length) {
                  for (const err of graphQLErrors) {
                    switch (err.extensions?.code) {
                      case 'FORBIDDEN':
                        // 🆕 Check if it's a lab access error
                        if (err.message.includes('laboratory') || err.message.includes('lab')) {
                          toastError('Lab access denied: ' + err.message);
                          // Clear invalid lab context
                          localStorage.removeItem('currentLab');
                        } else {
                          toastError('Access forbidden: ' + err.message);
                        }
                        break;
                      case 'UNAUTHENTICATED':
                        toastError('Session expired, logging out...');
                        authLogout();
                        // 🆕 Clear tenant context on logout
                        localStorage.removeItem('currentLab');
                        localStorage.removeItem('accessibleLabs');
                        localStorage.removeItem('organization');
                        break;
                      case 'BAD_USER_INPUT':
                        toastError(err.message);
                        break;
                      // 🆕 Handle tenant-specific errors
                      case 'TENANT_CONTEXT_MISSING':
                        toastError('Laboratory context required. Please select a laboratory.');
                        break;
                      case 'LAB_ACCESS_DENIED':
                        toastError('Access denied to selected laboratory.');
                        localStorage.removeItem('currentLab');
                        break;
                      default:
                        toastError('Server error: ' + err.message);
                    }
                  }
                }
              
                if (networkError) {
                  // 🆕 Enhanced network error handling
                  if (networkError.statusCode === 429) {
                    toastError('Rate limit exceeded. Please slow down your requests.');
                  } else if (networkError.statusCode === 403) {
                    toastError('Laboratory access denied. Please check your permissions.');
                  } else {
                    toastError('Network error: ' + networkError.message);
                  }
                }
            }
        }),
        resultInterceptorExchange,
        fetchExchange,
        subscriptionExchange({
            forwardSubscription: operation => subscriptionClient.request(operation) as any,
        }),
    ],
    // 🆕 Enhanced fetch options with tenant headers
    fetchOptions: () => {
        const authData = getAuthData();
        const tenantContext = getTenantContext();
        
        const headers: Record<string, string> = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Laboratory-ID',
        };

        // Add JWT token
        if (authData?.token) {
            headers.Authorization = `Bearer ${authData.token}`;
        }

        // 🆕 Add laboratory context
        if (tenantContext.currentLab) {
            headers['X-Laboratory-ID'] = tenantContext.currentLab;
        }

        // 🆕 Add request correlation ID
        headers['X-Request-ID'] = generateRequestId();

        // 🆕 Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🔍 URQL Request Headers');
            console.log('Authorization:', headers.Authorization ? '***REDACTED***' : 'Missing');
            console.log('X-Laboratory-ID:', headers['X-Laboratory-ID'] || 'Missing');
            console.log('X-Request-ID:', headers['X-Request-ID']);
            console.groupEnd();
        }

        return { headers };
    },
});
```

### **Optional: URQL Tenant-Aware Composables**

Since URQL automatically injects tenant headers, these composables are **optional**. Use them only if you need additional client-side tenant validation or UI behavior:

<details>
<summary>🔧 <strong>Optional Advanced Composables</strong> (Click to expand)</summary>

Create `webapp/composables/urql-tenant.ts` for enhanced tenant-aware behavior:

```typescript
import { useQuery, useMutation, UseQueryArgs, UseMutationArgs } from '@urql/vue';
import { useTenant } from './tenant';
import { computed, watchEffect, ref } from 'vue';

// ⚠️ OPTIONAL: Use only if you need client-side lab validation
export function useTenantQuery<T = any, V = object>(
  args: UseQueryArgs<T, V>
) {
  const { currentLab, hasLabAccess } = useTenant();
  
  // Pause query if no lab context (useful for UI that shouldn't show without lab)
  const queryArgs = computed(() => ({
    ...args,
    pause: !hasLabAccess.value || args.pause
  }));
  
  const result = useQuery(queryArgs);
  
  return {
    ...result,
    hasLabContext: hasLabAccess,
    currentLab,
  };
}

// ⚠️ OPTIONAL: Use only if you need client-side validation before mutations
export function useTenantMutation<T = any, V = object>(
  args: UseMutationArgs<T, V>
) {
  const { currentLab, hasLabAccess } = useTenant();
  
  const [mutationResult, executeMutation] = useMutation(args);
  
  // Client-side validation before sending to server
  const executeWithTenantValidation = (variables?: V) => {
    if (!hasLabAccess.value) {
      throw new Error('No laboratory context available');
    }
    
    if (!currentLab.value) {
      throw new Error('No laboratory selected');
    }
    
    return executeMutation(variables);
  };
  
  return [
    {
      ...mutationResult,
      hasLabContext: hasLabAccess,
      currentLab,
    },
    executeWithTenantValidation
  ] as const;
}

// ⚠️ OPTIONAL: Use only if you need automatic refetch on lab change
export function useLabSensitiveQuery<T = any, V = object>(
  args: UseQueryArgs<T, V>
) {
  const { currentLab } = useTenant();
  const queryArgs = ref(args);
  
  // Force refetch when lab changes
  watchEffect(() => {
    if (currentLab.value) {
      queryArgs.value = {
        ...args,
        requestPolicy: 'cache-and-network', // Force refetch
      };
    }
  });
  
  return useQuery(queryArgs.value);
}
```

**When to use these:**
- ✅ **Use `useTenantQuery`** if you want to prevent UI from loading without lab context
- ✅ **Use `useTenantMutation`** if you want client-side validation before server calls  
- ✅ **Use `useLabSensitiveQuery`** if you need automatic refetch when switching labs
- ❌ **Skip these** if you're fine with server-side tenant enforcement (which you already have)

</details>

### **Recommended Simple Approach:**

Since URQL automatically handles tenant headers, you can use regular URQL composables:

```vue
<!-- PatientsList.vue - Simple Approach (Recommended) -->
<template>
  <div class="patients-list">
    <div v-if="!currentLab" class="no-lab-warning">
      ⚠️ Please select a laboratory to view patients
    </div>
    
    <div v-else-if="fetching" class="loading">
      Loading patients...
    </div>
    
    <div v-else-if="error" class="error">
      Error loading patients: {{ error.message }}
    </div>
    
    <div v-else class="patients-grid">
      <div 
        v-for="patient in data?.patientsAll" 
        :key="patient.uid"
        class="patient-card"
      >
        <h3>{{ patient.firstName }} {{ patient.lastName }}</h3>
        <p>ID: {{ patient.patientId }}</p>
        <p>Lab: {{ currentLab }}</p>
      </div>
    </div>

    <button @click="createTestPatient" :disabled="creatingPatient || !currentLab">
      {{ creatingPatient ? 'Creating...' : 'Create Test Patient' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { gql, useQuery, useMutation } from '@urql/vue';
import { useTenant } from '@/composables/tenant';

const { currentLab } = useTenant();

// GraphQL queries
const GET_PATIENTS = gql`
  query GetPatients($limit: Int) {
    patientsAll(limit: $limit) {
      uid
      firstName
      lastName
      patientId
      laboratory_uid
    }
  }
`;

const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      uid
      firstName
      lastName
      patientId
    }
  }
`;

// ✅ Use regular URQL composables - headers are automatically injected
const { data, fetching, error } = useQuery({
  query: GET_PATIENTS,
  variables: { limit: 10 },
  // Optional: pause query if no lab selected
  pause: !currentLab.value
});

const [{ fetching: creatingPatient }, executeCreatePatient] = useMutation(CREATE_PATIENT);

const createTestPatient = async () => {
  if (!currentLab.value) {
    console.warn('No laboratory selected');
    return;
  }

  try {
    await executeCreatePatient({
      input: {
        firstName: 'Test',
        lastName: 'Patient',
        // ✅ laboratory_uid is automatically handled by backend tenant context
      }
    });
    // ✅ URQL will automatically refetch due to cache updates
  } catch (error) {
    console.error('Failed to create patient:', error);
  }
};
</script>
```

**Why this simple approach works:**
- ✅ **URQL client automatically adds `X-Laboratory-ID` header** to every request
- ✅ **Backend `TenantContextMiddleware` handles all tenant filtering**
- ✅ **Server returns only lab-specific data** - no client-side filtering needed
- ✅ **GraphQL errors** (like lab access denied) are handled by enhanced error exchange
- ✅ **Simpler code** - just use standard URQL composables

## 🧪 **Step 7: Testing Your Integration**

Create a comprehensive test component to verify multi-tenancy:

```vue
<!-- TestMultiTenancy.vue -->
<template>
  <div class="test-panel">
    <h3>Multi-Tenancy Test Panel</h3>
    
    <div class="tenant-info">
      <h4>Current Context:</h4>
      <pre>{{ JSON.stringify(tenantInfo, null, 2) }}</pre>
    </div>
    
    <div class="actions">
      <button @click="testRestAPI" class="btn btn-primary">
        Test REST API
      </button>
      <button @click="testAxiosGraphQL" class="btn btn-secondary">
        Test Axios GraphQL
      </button>
      <button @click="testURQLGraphQL" class="btn btn-success">
        Test URQL GraphQL
      </button>
      <button @click="testSubscription" class="btn btn-warning">
        Test WebSocket Subscription
      </button>
    </div>
    
    <div v-if="testResults.length" class="results">
      <h4>Test Results:</h4>
      <div v-for="(result, index) in testResults" :key="index" class="result-item">
        <h5>{{ result.type }}</h5>
        <div class="result-status" :class="result.success ? 'success' : 'error'">
          {{ result.success ? '✅ Success' : '❌ Error' }}
        </div>
        <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { gql } from '@urql/vue';
import { useTenant } from '@/composables/tenant';
import { useTenantQuery } from '@/composables/urql-tenant';
import axiosInstance from '@/composables/axios';
import { urqlClient } from '@/urql';

const { user, currentLab, accessibleLabs, organization } = useTenant();
const testResults = ref([]);

const tenantInfo = computed(() => ({
  user: user.value,
  currentLab: currentLab.value,
  accessibleLabs: accessibleLabs.value,
  organization: organization.value,
}));

// 🆕 Test REST API with tenant headers
const testRestAPI = async () => {
  try {
    const response = await axiosInstance.get('/api/patients');
    testResults.value.unshift({
      type: 'REST API',
      success: true,
      data: {
        status: response.status,
        headers: {
          'X-Laboratory-ID': response.config.headers['X-Laboratory-ID'],
          'Authorization': response.config.headers['Authorization'] ? 'Present' : 'Missing'
        },
        dataCount: Array.isArray(response.data) ? response.data.length : 'Single item',
        rateLimit: {
          userRemaining: response.headers['x-ratelimit-user-remaining-minute'],
          labId: response.headers['x-ratelimit-lab-id']
        }
      }
    });
  } catch (error) {
    testResults.value.unshift({
      type: 'REST API',
      success: false,
      data: { error: error.message, status: error.response?.status }
    });
  }
};

// 🆕 Test GraphQL via Axios
const testAxiosGraphQL = async () => {
  try {
    const response = await axiosInstance.post('/felicity-gql', {
      query: `
        query GetPatients {
          patientsAll(limit: 3) {
            uid
            firstName
            lastName
            laboratory_uid
          }
        }
      `
    });
    testResults.value.unshift({
      type: 'Axios GraphQL',
      success: true,
      data: {
        patients: response.data.data?.patientsAll || [],
        headers: {
          'X-Laboratory-ID': response.config.headers['X-Laboratory-ID'],
          'X-Request-ID': response.config.headers['X-Request-ID']
        }
      }
    });
  } catch (error) {
    testResults.value.unshift({
      type: 'Axios GraphQL',
      success: false,
      data: { error: error.message }
    });
  }
};

// 🆕 Test URQL GraphQL
const testURQLGraphQL = async () => {
  try {
    const TEST_QUERY = gql`
      query TestQuery {
        patientsAll(limit: 3) {
          uid
          firstName
          lastName
          laboratory_uid
        }
      }
    `;

    const result = await urqlClient.query(TEST_QUERY, {}).toPromise();
    
    testResults.value.unshift({
      type: 'URQL GraphQL',
      success: !result.error,
      data: {
        patients: result.data?.patientsAll || [],
        extensions: result.extensions,
        error: result.error?.message
      }
    });
  } catch (error) {
    testResults.value.unshift({
      type: 'URQL GraphQL',
      success: false,
      data: { error: error.message }
    });
  }
};

// 🆕 Test WebSocket subscription
const testSubscription = async () => {
  try {
    const SUBSCRIPTION = gql`
      subscription OnPatientCreated {
        patientCreated {
          uid
          firstName
          lastName
          laboratory_uid
        }
      }
    `;

    const subscription = urqlClient.subscription(SUBSCRIPTION, {});
    
    // Test if subscription can be created (headers are sent)
    let subscriptionStarted = false;
    const unsubscribe = subscription.subscribe(result => {
      subscriptionStarted = true;
      console.log('Subscription result:', result);
    });

    // Wait a bit and check
    setTimeout(() => {
      testResults.value.unshift({
        type: 'WebSocket Subscription',
        success: subscriptionStarted,
        data: { 
          subscriptionCreated: subscriptionStarted,
          currentLab: currentLab.value,
          note: 'Check browser network tab for WebSocket headers'
        }
      });
      unsubscribe();
    }, 1000);

  } catch (error) {
    testResults.value.unshift({
      type: 'WebSocket Subscription',
      success: false,
      data: { error: error.message }
    });
  }
};
</script>

<style scoped>
.test-panel {
  @apply max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg;
}

.tenant-info {
  @apply bg-gray-50 p-4 rounded mb-4;
}

.actions {
  @apply flex flex-wrap gap-2 mb-4;
}

.btn {
  @apply px-4 py-2 rounded font-medium;
}

.btn-primary { @apply bg-blue-500 text-white hover:bg-blue-600; }
.btn-secondary { @apply bg-gray-500 text-white hover:bg-gray-600; }
.btn-success { @apply bg-green-500 text-white hover:bg-green-600; }
.btn-warning { @apply bg-yellow-500 text-white hover:bg-yellow-600; }

.results {
  @apply space-y-4;
}

.result-item {
  @apply border rounded p-4;
}

.result-status.success {
  @apply text-green-600 font-bold;
}

.result-status.error {
  @apply text-red-600 font-bold;
}

pre {
  @apply bg-gray-100 p-2 rounded text-sm overflow-auto;
}
</style>
```

## 📋 **Migration Checklist**

### ✅ **Backend Prerequisites:**
- [ ] TenantContextMiddleware is installed and configured
- [ ] Database has Organization and Laboratory entities
- [ ] JWT tokens include accessible_labs and organization context

### ✅ **Frontend Updates:**
- [ ] Enhanced axios.ts with tenant headers
- [ ] Created tenant.ts composable  
- [ ] Enhanced urql.ts with tenant context
- [ ] Created urql-tenant.ts composable
- [ ] Added LabSelector.vue component
- [ ] Updated authentication flow
- [ ] Added lab selector to main layout

### ✅ **GraphQL Integration:**
- [ ] URQL client sends X-Laboratory-ID headers
- [ ] WebSocket subscriptions include tenant headers
- [ ] GraphQL error handling for lab access denied  
- [ ] Tenant-aware query/mutation composables
- [ ] Lab-sensitive queries that refetch on lab change

### ✅ **Testing:**
- [ ] Lab switching works correctly
- [ ] REST API requests include X-Laboratory-ID header
- [ ] GraphQL queries include X-Laboratory-ID header
- [ ] WebSocket subscriptions include tenant headers
- [ ] Rate limit headers are displayed
- [ ] Error handling for lab access denied
- [ ] JWT refresh preserves tenant context
- [ ] Test panel shows all integrations working

### ✅ **Optional Enhancements:**
- [ ] Tenant-aware routing
- [ ] Lab-specific theming
- [ ] Usage analytics tracking
- [ ] Real-time lab switching in subscriptions

## 🚀 **Ready to Deploy**

Your Vue.js frontend now supports:

✅ **Automatic tenant headers** on all API requests  
✅ **Lab switching** with persistent context  
✅ **JWT integration** with tenant information  
✅ **Error handling** for rate limits and access denied  
✅ **Development debugging** with request/response logging  

**Your Vue.js frontend is now multi-tenant ready!** 🎉

### **Quick Start:**
1. Update `webapp/composables/axios.ts` with the enhanced version
2. Add `webapp/composables/tenant.ts` 
3. Add `webapp/components/LabSelector.vue`
4. Include `<LabSelector />` in your main layout
5. Test with the debug panel

The frontend will automatically send `X-Laboratory-ID` headers and handle multi-lab scenarios seamlessly.