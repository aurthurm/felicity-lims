# GraphQL Multi-Tenancy Integration Guide

## ✅ Middleware Setup Complete

The `TenantContextMiddleware` has been added to your FastAPI app in `/felicity/lims/boot.py`. This middleware:

1. **Extracts user/org from JWT token** automatically
2. **Extracts lab context from headers** (X-Laboratory-ID)
3. **Sets tenant context** for every request
4. **Adds request tracking** for audit trails

## 🎯 Which Decorators to Add to GraphQL Resolvers

### **For Lab-Scoped Operations (Most Common)**

```python
# Import the decorators
from felicity.api.gql.decorators import tenant_query, tenant_mutation

# For queries that should only return current lab's data
@strawberry.field
@tenant_query  # Requires auth + lab context + logging
async def samples_all(self, info: Info, limit: int = 20):
    # Automatically filtered to current lab
    pass

# For mutations that create/update lab-scoped data
@strawberry.mutation  
@tenant_mutation("CREATE_SAMPLE")  # Custom audit action name
async def create_sample(self, info: Info, input: CreateSampleInput):
    # Automatically gets lab context + audit trail
    pass
```

### **For User-Only Operations (No Lab Required)**

```python
from felicity.api.gql.decorators import require_authentication, log_resolver_access

# For operations like "get user's accessible labs"
@strawberry.field
@require_authentication
@log_resolver_access
async def user_laboratories(self, info: Info):
    # User can see which labs they have access to
    pass
```

### **For Admin Operations (Cross-Lab)**

```python
from felicity.api.gql.decorators import admin_query, admin_mutation

# For admin queries that work across all labs
@strawberry.field
@admin_query
async def all_samples_cross_lab(self, info: Info):
    # Admin-only, works across labs
    pass
```

## 🔑 JWT Token vs Lab Context Headers

**Your analysis is correct!** Here's the complete strategy:

### **JWT Token Contains:**
- `user_uid` (who the user is)
- `organization_uid` (which organization they belong to)
- Optionally: `laboratory_uid` (if user only has access to one lab)

### **X-Laboratory-ID Header Contains:**
- Current lab context when user has access to multiple labs
- Allows lab switching in frontend

### **Why Both Are Needed:**

```javascript
// Frontend scenario:
const user = {
  uid: "user123",
  organization_uid: "org456", 
  accessible_labs: ["lab1", "lab2", "lab3"]  // User has access to multiple labs
};

// User selects Lab 2 from dropdown
const currentLab = "lab2";

// Frontend sends:
const headers = {
  'Authorization': `Bearer ${jwt_token}`,      // Contains user + org
  'X-Laboratory-ID': currentLab,              // Current lab selection  
  'Content-Type': 'application/json'
};
```

### **Middleware Logic:**
1. **Extract from JWT**: user_uid, organization_uid
2. **Extract from header**: laboratory_uid (current lab selection)
3. **Validate**: User has access to the selected lab
4. **Set context**: All three values available to resolvers

## 📝 What Decorators Must Be Added

### **✅ Add These Decorators:**

**Sample Queries/Mutations:**
```python
# Before (no tenant awareness)
@strawberry.field
async def samples_all(self, info: Info):
    return await sample_service.get_all()

# After (tenant-aware)
@strawberry.field
@tenant_query
async def samples_all(self, info: Info):
    return await sample_service.get_all_lab_scoped()
```

**Patient Queries/Mutations:**
```python
@strawberry.mutation
@tenant_mutation("CREATE_PATIENT")
async def create_patient(self, info: Info, input: CreatePatientInput):
    # Auto lab context + audit trail
    pass
```

**Analysis Results:**
```python
@strawberry.mutation
@tenant_mutation("VERIFY_RESULT")
async def verify_result(self, info: Info, result_uid: str):
    # Auto lab filtering + audit
    pass
```

### **🚫 Don't Add Decorators To:**

**Auth/Login Operations:**
```python
@strawberry.mutation
# No decorators - these are pre-authentication
async def authenticate_user(self, info: Info, credentials):
    pass
```

**User Lab Access Queries:**
```python
@strawberry.field
@require_authentication  # Only auth, no lab context
async def user_accessible_labs(self, info: Info):
    # Returns labs user can access
    pass
```

## 🎯 Frontend Integration Strategy

### **1. JWT Token Workflow:**
```javascript
// Login response includes:
{
  "access_token": "jwt_token_here",
  "user": {
    "uid": "user123",
    "organization_uid": "org456",
    "accessible_labs": [
      {"uid": "lab1", "name": "Main Lab"},
      {"uid": "lab2", "name": "Branch Lab"}
    ]
  }
}
```

### **2. Lab Selection UI:**
```javascript
// Show lab selector if user has multiple labs
if (user.accessible_labs.length > 1) {
  // Show dropdown to select current lab
  setCurrentLab(user.accessible_labs[0].uid); // Default to first
}
```

### **3. GraphQL Client Setup:**
```javascript
const client = new ApolloClient({
  headers: {
    authorization: `Bearer ${token}`,
    'X-Laboratory-ID': currentLab,  // Current lab selection
  }
});
```

### **4. Lab Switching:**
```javascript
function switchLab(newLabId) {
  setCurrentLab(newLabId);
  // All subsequent GraphQL requests will use new lab context
  // No need to refresh JWT token
}
```

## 🔄 Migration Steps

### **Step 1: Update Existing Resolvers**
Find all your existing sample/patient/analysis resolvers and add appropriate decorators:

```python
# File: /api/gql/analysis/query.py
@strawberry.field
@tenant_query  # Add this line
async def samples_all(self, info: Info, ...):
    # Change service to tenant-aware
    sample_service = TenantAwareService(Sample)  # Change this line
    return await sample_service.get_all_lab_scoped()  # Change this line
```

### **Step 2: Update Services**
```python
# Before
class SampleService(BaseService[Sample]):
    pass

# After  
class SampleService(TenantAwareService[Sample]):
    pass
```

### **Step 3: Update Frontend**
```javascript
// Add lab context to all GraphQL requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'X-Laboratory-ID': currentLabId,
};
```

## 🎯 Summary

**✅ Middleware**: Already added to your FastAPI app
**✅ Decorators**: Add `@tenant_query` and `@tenant_mutation()` to lab-scoped resolvers
**✅ JWT Strategy**: JWT contains user/org, header contains current lab selection
**✅ Frontend**: Must send both JWT token AND lab context header

This approach gives you:
- **Automatic tenant filtering** on all queries
- **Automatic audit trails** on all mutations  
- **Lab switching** without re-authentication
- **Complete isolation** between labs

Perfect for your multi-lab organization setup! 🎉