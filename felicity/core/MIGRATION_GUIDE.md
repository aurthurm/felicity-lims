# 🎯 Easy Multi-Tenancy Migration Guide

## ✅ **TenantAwareService - Drop-in Replacement**

The `TenantAwareService` has the **EXACT same method names and signatures** as `BaseService` for seamless migration!

## 🔄 **Step 1: Update Service Classes**

### **Before (BaseService):**
```python
from felicity.apps.abstract import BaseService
from felicity.apps.analysis.repository import SampleRepository

class SampleService(BaseService[Sample]):
    def __init__(self):
        super().__init__(SampleRepository())
    
    async def get_samples(self):
        return await self.get_all()  # Returns ALL samples across ALL labs ❌
    
    async def create_sample(self, data):
        return await self.create(data)  # No audit trail ❌
```

### **After (TenantAwareService) - Just change the parent class!**
```python
from felicity.apps.abstract import TenantAwareService

class SampleService(TenantAwareService):
    def __init__(self):
        super().__init__(Sample)  # Pass model instead of repository ⭐
    
    async def get_samples(self):
        return await self.get_all()  # Returns ONLY current lab's samples ✅
    
    async def create_sample(self, data):
        return await self.create(data)  # Automatic audit trail ✅
```

## 🎯 **Key Migration Changes**

| **Change** | **Before** | **After** |
|------------|------------|-----------|
| **Parent Class** | `BaseService[Model]` | `TenantAwareService` |
| **Constructor** | `super().__init__(Repository())` | `super().__init__(Model)` |
| **Method Names** | ✅ Same | ✅ Same |
| **Method Signatures** | ✅ Same | ✅ Same |
| **Behavior** | No filtering | ✅ Auto lab filtering |
| **Audit** | Manual | ✅ Automatic |

## 📝 **Step 2: Update GraphQL Resolvers**

### **Before (No tenant awareness):**
```python
@strawberry.field
async def samples_all(self, info: Info, limit: int = 20):
    sample_service = SampleService()
    return await sample_service.get_all()
```

### **After (Add decorators):**
```python
from felicity.api.gql.decorators import tenant_query

@strawberry.field
@tenant_query  # Add this decorator
async def samples_all(self, info: Info, limit: int = 20):
    sample_service = SampleService()  # Now uses TenantAwareService
    return await sample_service.get_all()  # Same method call!
```

## 🔧 **Complete Migration Example**

### **File: `/apps/analysis/services.py`**
```python
# BEFORE
from felicity.apps.abstract import BaseService
from felicity.apps.analysis.repository import SampleRepository

class SampleService(BaseService[Sample]):
    def __init__(self):
        super().__init__(SampleRepository())

# AFTER - Just 2 lines changed!
from felicity.apps.abstract import TenantAwareService

class SampleService(TenantAwareService):
    def __init__(self):
        super().__init__(Sample)  # Model instead of repository
```

### **File: `/api/gql/analysis/query.py`**
```python
# BEFORE
@strawberry.field
async def samples_all(self, info: Info):
    return await sample_service.get_all()

# AFTER - Just add decorator!
from felicity.api.gql.decorators import tenant_query

@strawberry.field
@tenant_query  # Add this line
async def samples_all(self, info: Info):
    return await sample_service.get_all()  # Same method!
```

## 🎯 **Which Decorators to Add**

### **For Lab-Scoped Queries:**
```python
@strawberry.field
@tenant_query  # Authentication + Lab context + Logging
async def get_samples(self, info: Info):
    pass
```

### **For Lab-Scoped Mutations:**
```python
@strawberry.mutation
@tenant_mutation("CREATE_SAMPLE")  # Custom audit action
async def create_sample(self, info: Info, input: CreateSampleInput):
    pass
```

### **For User-Only Operations:**
```python
@strawberry.field
@require_authentication  # Only auth, no lab context
async def user_accessible_labs(self, info: Info):
    pass
```

## 🚫 **What NOT to Change**

### **Keep BaseService for Global Entities:**
```python
# These should stay as BaseService (no lab filtering needed)
class UserService(BaseService[User]):        # ✅ Keep BaseService
class OrganizationService(BaseService[Organization]):  # ✅ Keep BaseService

# Only change lab-scoped entities to TenantAwareService
class SampleService(TenantAwareService):     # ✅ Change to TenantAware
class PatientService(TenantAwareService):    # ✅ Change to TenantAware
```

## 📦 **Step 3: Bulk Migration Script**

Here's a script to help migrate multiple services:

```python
# migration_script.py
import os
import re

def migrate_service_file(file_path):
    """Migrate a service file from BaseService to TenantAwareService"""
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if it's a lab-scoped service (not User, Organization, etc.)
    global_services = ['UserService', 'OrganizationService', 'LaboratoryService']
    if any(service in content for service in global_services):
        print(f"Skipping global service: {file_path}")
        return
    
    # Replace imports
    content = re.sub(
        r'from felicity\.apps\.abstract import BaseService',
        'from felicity.apps.abstract import TenantAwareService',
        content
    )
    
    # Replace class inheritance
    content = re.sub(
        r'class (\w+Service)\(BaseService\[(\w+)\]\):',
        r'class \1(TenantAwareService):',
        content
    )
    
    # Replace constructor calls
    content = re.sub(
        r'super\(\).__init__\((\w+Repository)\(\)\)',
        lambda m: f'super().__init__({m.group(1).replace("Repository", "")})',
        content
    )
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Migrated: {file_path}")

# Run migration
service_files = [
    '/apps/analysis/services.py',
    '/apps/patient/services.py', 
    '/apps/client/services.py',
    # Add more service files here
]

for file_path in service_files:
    migrate_service_file(file_path)
```

## ✅ **Benefits After Migration**

### **Automatic Lab Filtering:**
```python
# Before: Returns samples from ALL labs
samples = await sample_service.get_all()

# After: Returns samples from CURRENT lab only
samples = await sample_service.get_all()  # Same call, filtered behavior!
```

### **Automatic Audit Trails:**
```python
# Before: No audit logging
sample = await sample_service.create(data)

# After: Automatic audit with context
sample = await sample_service.create(data)  # Same call, automatic audit!
# Logs: "Creating Sample by user_123 in lab_456"
```

### **Automatic Tenant Context:**
```python
# Before: Manual lab_id handling
sample = await sample_service.create({
    "sample_type_uid": "type_123",
    "laboratory_uid": current_lab_id,  # Manual ❌
    "created_by_uid": current_user_id   # Manual ❌
})

# After: Automatic context injection
sample = await sample_service.create({
    "sample_type_uid": "type_123"
    # laboratory_uid automatically added ✅
    # created_by_uid automatically added ✅
})
```

## 🎯 **Zero Code Changes for Existing Logic**

All your existing business logic continues to work:

```python
# This exact code works in both BaseService and TenantAwareService
async def get_pending_samples(self):
    return await self.filter({"status": "pending"})

async def update_sample_status(self, sample_uid: str, status: str):
    return await self.update(sample_uid, {"status": status})

async def create_sample_for_patient(self, patient_uid: str, data: dict):
    data["patient_uid"] = patient_uid
    return await self.create(data)
```

## 🚀 **Summary**

✅ **Same method names** - no refactoring needed  
✅ **Same signatures** - existing code works  
✅ **Drop-in replacement** - just change parent class  
✅ **Automatic lab filtering** - secure by default  
✅ **Automatic audit trails** - compliance built-in  
✅ **Automatic tenant context** - no manual injection  

**Migration effort: 2 lines per service file!** 🎉