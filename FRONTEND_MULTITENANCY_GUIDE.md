# 🌐 **Frontend Multi-Tenancy Integration Guide**

## 🎯 **Overview**

This guide shows how to update your frontend application to support multi-tenancy by sending the required headers for laboratory context and user authentication.

## 🔑 **Required Headers**

Your frontend must send these headers with every API request:

| **Header** | **Purpose** | **Example** | **Required** |
|------------|-------------|-------------|--------------|
| `Authorization` | JWT token with user/org context | `Bearer eyJ0eXAi...` | ✅ Always |
| `X-Laboratory-ID` | Current lab selection | `lab_12345` | ✅ When user has lab context |
| `Content-Type` | Request content type | `application/json` | ✅ For POST/PUT |
| `X-Request-ID` | Request correlation (optional) | `req_abc123` | ⚠️ Recommended |

## 🔄 **JWT Token vs Lab Context Strategy**

### **Why Both Are Needed:**

```javascript
// JWT Token contains (decoded):
{
  "user_uid": "user_123",
  "organization_uid": "org_456", 
  "accessible_labs": ["lab_1", "lab_2", "lab_3"],  // User can access multiple labs
  "exp": 1234567890
}

// X-Laboratory-ID Header contains:
"lab_2"  // Current lab selection from dropdown/context
```

### **JWT Limitations:**
- ❌ JWT is stateless - can't change without re-authentication
- ❌ Can't store "current lab" selection in JWT 
- ❌ User might have access to multiple labs

### **Header Solution:**
- ✅ Dynamic lab switching without re-authentication
- ✅ Stateless lab context per request
- ✅ Works with JWT validation

## 🛠️ **Implementation Examples**

### **1. JavaScript/TypeScript (Generic)**

#### **HTTP Client Setup:**
```javascript
// api.js - HTTP client configuration
import axios from 'axios';

class APIClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.currentLab = localStorage.getItem('currentLab') || null;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Add request interceptor for automatic headers
    this.client.interceptors.request.use(
      (config) => this.addTenantHeaders(config),
      (error) => Promise.reject(error)
    );
  }
  
  addTenantHeaders(config) {
    // 1. Add JWT token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 2. Add lab context
    if (this.currentLab) {
      config.headers['X-Laboratory-ID'] = this.currentLab;
    }
    
    // 3. Add request ID for correlation (optional)
    config.headers['X-Request-ID'] = this.generateRequestId();
    
    return config;
  }
  
  generateRequestId() {
    return 'req_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Lab switching
  setCurrentLab(labId) {
    this.currentLab = labId;
    localStorage.setItem('currentLab', labId);
  }
  
  getCurrentLab() {
    return this.currentLab;
  }
}

export const apiClient = new APIClient();
```

#### **Usage in Components:**
```javascript
// UserService.js - Example service
import { apiClient } from './api.js';

export class UserService {
  async getPatients() {
    // Headers automatically added by interceptor
    const response = await apiClient.client.get('/api/patients');
    return response.data;
  }
  
  async createPatient(patientData) {
    // Headers automatically added by interceptor  
    const response = await apiClient.client.post('/api/patients', patientData);
    return response.data;
  }
}
```

### **2. React Implementation**

#### **Context Provider:**
```jsx
// TenantContext.jsx - React context for tenant management
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentLab, setCurrentLab] = useState(null);
  const [accessibleLabs, setAccessibleLabs] = useState([]);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    initializeTenantContext();
  }, []);

  const initializeTenantContext = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        
        setUser({
          uid: decoded.user_uid,
          email: decoded.email,
          // ... other user fields
        });
        
        setOrganization({
          uid: decoded.organization_uid,
          name: decoded.organization_name
        });
        
        // Get accessible labs from JWT or API
        const labs = decoded.accessible_labs || [];
        setAccessibleLabs(labs);
        
        // Restore current lab selection
        const savedLab = localStorage.getItem('currentLab');
        if (savedLab && labs.some(lab => lab.uid === savedLab)) {
          setCurrentLab(savedLab);
        } else if (labs.length > 0) {
          // Default to first lab if no saved selection
          setCurrentLab(labs[0].uid);
          localStorage.setItem('currentLab', labs[0].uid);
        }
      }
    } catch (error) {
      console.error('Error initializing tenant context:', error);
      logout();
    }
  };

  const switchLab = (labId) => {
    const lab = accessibleLabs.find(l => l.uid === labId);
    if (lab) {
      setCurrentLab(labId);
      localStorage.setItem('currentLab', labId);
      
      // Update API client
      apiClient.setCurrentLab(labId);
      
      // Optional: Trigger page refresh or state reset
      // window.location.reload();
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentLab(null);
    setAccessibleLabs([]);
    setOrganization(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentLab');
  };

  return (
    <TenantContext.Provider value={{
      user,
      currentLab,
      accessibleLabs,
      organization,
      switchLab,
      logout,
      isAuthenticated: !!user,
      hasLabAccess: accessibleLabs.length > 0
    }}>
      {children}
    </TenantContext.Provider>
  );
};
```

#### **Lab Selector Component:**
```jsx
// LabSelector.jsx - Lab switching component
import React from 'react';
import { useTenant } from './TenantContext';

export const LabSelector = () => {
  const { currentLab, accessibleLabs, switchLab } = useTenant();

  if (accessibleLabs.length <= 1) {
    // Don't show selector if user has access to only one lab
    return null;
  }

  return (
    <div className="lab-selector">
      <label htmlFor="lab-select">Current Laboratory:</label>
      <select 
        id="lab-select"
        value={currentLab || ''} 
        onChange={(e) => switchLab(e.target.value)}
        className="lab-dropdown"
      >
        <option value="">Select Laboratory</option>
        {accessibleLabs.map(lab => (
          <option key={lab.uid} value={lab.uid}>
            {lab.name}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### **3. GraphQL Integration**

#### **Apollo Client Setup:**
```javascript
// apolloClient.js - GraphQL client with tenant headers
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:8000/felicity-gql',
});

const authLink = setContext((_, { headers }) => {
  // Get authentication token
  const token = localStorage.getItem('accessToken');
  
  // Get current lab context
  const currentLab = localStorage.getItem('currentLab');
  
  // Generate request ID
  const requestId = 'req_' + Math.random().toString(36).substr(2, 9);

  return {
    headers: {
      ...headers,
      // Authentication
      ...(token && { authorization: `Bearer ${token}` }),
      
      // 🆕 Tenant context
      ...(currentLab && { 'X-Laboratory-ID': currentLab }),
      
      // Request correlation
      'X-Request-ID': requestId,
      
      // Content type
      'Content-Type': 'application/json',
    }
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
  },
});
```

#### **GraphQL Queries with Context:**
```javascript
// patientQueries.js - GraphQL operations
import { gql } from '@apollo/client';

export const GET_PATIENTS = gql`
  query GetPatients($limit: Int, $offset: Int) {
    patientsAll(limit: $limit, offset: $offset) {
      uid
      firstName
      lastName
      patientId
      # Headers automatically added by authLink
      # - Authorization: Bearer <token>
      # - X-Laboratory-ID: <current_lab>
    }
  }
`;

export const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      uid
      firstName
      lastName
      patientId
    }
  }
`;
```

### **4. Vue.js Implementation**

#### **Axios Plugin:**
```javascript
// plugins/api.js - Vue axios plugin
import axios from 'axios';

export default {
  install(app, options) {
    const apiClient = axios.create({
      baseURL: options.baseURL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor for tenant headers
    apiClient.interceptors.request.use(
      (config) => {
        const store = app.config.globalProperties.$store;
        
        // Add JWT token
        const token = store.getters['auth/token'];
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add lab context
        const currentLab = store.getters['tenant/currentLab'];
        if (currentLab) {
          config.headers['X-Laboratory-ID'] = currentLab;
        }
        
        // Add request ID
        config.headers['X-Request-ID'] = 'req_' + Math.random().toString(36).substr(2, 9);
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    app.config.globalProperties.$api = apiClient;
    app.provide('api', apiClient);
  }
};
```

### **5. Angular Implementation**

#### **HTTP Interceptor:**
```typescript
// tenant-http.interceptor.ts - Angular HTTP interceptor
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantHttpInterceptor implements HttpInterceptor {
  
  constructor(private tenantService: TenantService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Clone the request to add headers
    let authReq = req;
    
    // Add JWT token
    const token = this.tenantService.getToken();
    if (token) {
      authReq = authReq.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    // Add lab context
    const currentLab = this.tenantService.getCurrentLab();
    if (currentLab) {
      authReq = authReq.clone({
        setHeaders: {
          'X-Laboratory-ID': currentLab
        }
      });
    }
    
    // Add request ID
    const requestId = 'req_' + Math.random().toString(36).substr(2, 9);
    authReq = authReq.clone({
      setHeaders: {
        'X-Request-ID': requestId
      }
    });
    
    return next.handle(authReq);
  }
}
```

## 🔐 **Security Considerations**

### **1. Token Management:**
```javascript
// Secure token storage and refresh
class TokenManager {
  static setTokens(accessToken, refreshToken) {
    // Store in httpOnly cookies (preferred) or localStorage
    if (this.supportsHttpOnlyCookies()) {
      document.cookie = `accessToken=${accessToken}; httpOnly; secure; samesite=strict`;
    } else {
      localStorage.setItem('accessToken', accessToken);
    }
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  static async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }
}
```

### **2. Lab Context Validation:**
```javascript
// Validate lab access before switching
async function validateLabAccess(labId) {
  try {
    const response = await apiClient.get(`/api/user/lab-access/${labId}`);
    return response.data.hasAccess;
  } catch (error) {
    console.error('Lab access validation failed:', error);
    return false;
  }
}

async function secureSwitchLab(labId) {
  const hasAccess = await validateLabAccess(labId);
  if (!hasAccess) {
    throw new Error('Access denied to laboratory');
  }
  
  apiClient.setCurrentLab(labId);
  localStorage.setItem('currentLab', labId);
}
```

## 📱 **Mobile App Considerations**

### **React Native:**
```javascript
// api.js - React Native API client
import AsyncStorage from '@react-native-async-storage/async-storage';

class MobileAPIClient {
  async addTenantHeaders(config) {
    // Get token from secure storage
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Get lab context
    const currentLab = await AsyncStorage.getItem('currentLab');
    if (currentLab) {
      config.headers['X-Laboratory-ID'] = currentLab;
    }
    
    return config;
  }
}
```

## 🧪 **Testing**

### **Unit Tests:**
```javascript
// api.test.js - Test header injection
import { apiClient } from './api';

describe('API Client', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('currentLab', 'lab-123');
  });
  
  test('should add tenant headers to requests', async () => {
    const mockAxios = jest.spyOn(apiClient.client, 'get');
    
    await apiClient.client.get('/api/patients');
    
    expect(mockAxios).toHaveBeenCalledWith('/api/patients', 
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
          'X-Laboratory-ID': 'lab-123'
        })
      })
    );
  });
});
```

### **Integration Tests:**
```javascript
// integration.test.js - Test full flow
describe('Multi-tenant API Integration', () => {
  test('should receive lab-filtered data', async () => {
    // Set lab context
    apiClient.setCurrentLab('lab-456');
    
    // Make request
    const patients = await UserService.getPatients();
    
    // Verify all patients belong to current lab
    patients.forEach(patient => {
      expect(patient.laboratory_uid).toBe('lab-456');
    });
  });
});
```

## 🔍 **Debugging**

### **Header Inspection:**
```javascript
// Debug helper for inspecting headers
class HeaderDebugger {
  static logOutgoingHeaders(config) {
    console.group('🔍 Outgoing Request Headers');
    console.log('URL:', config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', {
      'Authorization': config.headers.Authorization ? '***REDACTED***' : 'Missing',
      'X-Laboratory-ID': config.headers['X-Laboratory-ID'] || 'Missing',
      'X-Request-ID': config.headers['X-Request-ID'] || 'Missing',
      'Content-Type': config.headers['Content-Type'] || 'Missing'
    });
    console.groupEnd();
    return config;
  }
  
  static logIncomingHeaders(response) {
    console.group('📥 Incoming Response Headers');
    console.log('Status:', response.status);
    console.log('Rate Limit Headers:', {
      'X-RateLimit-User-Remaining-Minute': response.headers['x-ratelimit-user-remaining-minute'],
      'X-RateLimit-Lab-ID': response.headers['x-ratelimit-lab-id'],
      'X-RateLimit-Org-ID': response.headers['x-ratelimit-org-id']
    });
    console.groupEnd();
    return response;
  }
}

// Add to axios interceptors in development
if (process.env.NODE_ENV === 'development') {
  apiClient.client.interceptors.request.use(HeaderDebugger.logOutgoingHeaders);
  apiClient.client.interceptors.response.use(HeaderDebugger.logIncomingHeaders);
}
```

## 📋 **Migration Checklist**

### **✅ Authentication:**
- [ ] Update login flow to extract accessible labs from JWT
- [ ] Implement token refresh with tenant context
- [ ] Add logout cleanup for lab context

### **✅ HTTP Client:**
- [ ] Add request interceptor for automatic headers
- [ ] Implement lab switching functionality
- [ ] Add request ID generation for correlation

### **✅ State Management:**
- [ ] Create tenant context provider/store
- [ ] Implement lab selection persistence
- [ ] Add user/org context management

### **✅ UI Components:**
- [ ] Add lab selector dropdown
- [ ] Update navigation with tenant context
- [ ] Add tenant information display

### **✅ Error Handling:**
- [ ] Handle lab access denied errors
- [ ] Implement rate limit error display
- [ ] Add tenant context to error reporting

### **✅ Testing:**
- [ ] Unit tests for header injection
- [ ] Integration tests for multi-tenant flows
- [ ] E2E tests for lab switching

## 🚀 **Quick Start Example**

Here's a minimal working example:

```javascript
// minimal-example.js - Basic multi-tenant setup
class SimpleTenantAPI {
  constructor() {
    this.baseURL = 'http://localhost:8000';
    this.token = localStorage.getItem('accessToken');
    this.currentLab = localStorage.getItem('currentLab');
  }
  
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add tenant headers
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (this.currentLab) headers['X-Laboratory-ID'] = this.currentLab;
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });
    
    return response.json();
  }
  
  setLab(labId) {
    this.currentLab = labId;
    localStorage.setItem('currentLab', labId);
  }
}

// Usage
const api = new SimpleTenantAPI();
api.setLab('lab-123');
const patients = await api.request('/api/patients');
```

## 🎯 **Summary**

Your frontend needs to send these headers for full multi-tenancy support:

1. **`Authorization: Bearer <jwt>`** - User and organization context
2. **`X-Laboratory-ID: <lab_id>`** - Current lab selection  
3. **`X-Request-ID: <request_id>`** - Request correlation (optional)

The backend `TenantContextMiddleware` will automatically extract this information and set the tenant context for all subsequent operations.

**Your frontend is now ready for enterprise multi-tenancy!** 🎉