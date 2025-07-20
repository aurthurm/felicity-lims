# 🎯 **TenantAwareRepository - Drop-in Replacement Guide**

## ✅ **Perfect Migration - Same Method Signatures**

The `TenantAwareRepository` has **EXACT same method names and signatures** as `BaseRepository` for seamless migration!

## 🔄 **Step 1: Update Repository Classes**

### **Before (BaseRepository):**
```python
from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.patient.entities import Patient

class PatientRepository(BaseRepository[Patient]):
    def __init__(self):
        super().__init__(Patient)
    
    async def get_patients(self):
        return await self.get_all()  # Returns ALL patients across ALL labs ❌
    
    async def create_patient(self, **data):
        return await self.create(**data)  # No tenant context ❌
```

### **After (TenantAwareRepository) - Just change the parent class!**
```python
from felicity.apps.abstract import TenantAwareRepository
from felicity.apps.patient.entities import Patient

class PatientRepository(TenantAwareRepository):
    def __init__(self):
        super().__init__(Patient)  # Same constructor! ⭐
    
    async def get_patients(self):
        return await self.get_all()  # Returns ONLY current lab's patients ✅
    
    async def create_patient(self, **data):
        return await self.create(**data)  # Automatic tenant context ✅
```

## 🎯 **Key Migration Changes**

| **Change** | **Before** | **After** |
|------------|------------|-----------| 
| **Parent Class** | `BaseRepository[Model]` | `TenantAwareRepository` |
| **Constructor** | ✅ Same | ✅ Same |
| **Method Names** | ✅ Same | ✅ Same |
| **Method Signatures** | ✅ Same | ✅ Same |
| **Behavior** | No lab filtering | ✅ Auto lab filtering |
| **Tenant Context** | Manual | ✅ Automatic |

## 🔧 **Complete Migration Example**

### **File: `/apps/patient/repository.py`**
```python
# BEFORE
from felicity.apps.abstract.repository import BaseRepository

class PatientRepository(BaseRepository[Patient]):
    def __init__(self):
        super().__init__(Patient)

# AFTER - Just 1 line changed!
from felicity.apps.abstract import TenantAwareRepository

class PatientRepository(TenantAwareRepository):
    def __init__(self):
        super().__init__(Patient)  # Same constructor!
```

## ✅ **What This Achieves**

### **Automatic Lab Filtering:**
```python
# Before: Returns patients from ALL labs
patients = await patient_repo.get_all()

# After: Returns patients from CURRENT lab only  
patients = await patient_repo.get_all()  # Same method, filtered behavior!
```

### **Automatic Tenant Context Injection:**
```python
# Before: Manual laboratory_uid handling
patient = await patient_repo.create(
    first_name="John",
    last_name="Doe", 
    laboratory_uid=current_lab_id,  # Manual ❌
    created_by_uid=current_user_id   # Manual ❌
)

# After: Automatic context injection
patient = await patient_repo.create(
    first_name="John",
    last_name="Doe"
    # laboratory_uid automatically added ✅
    # created_by_uid automatically added ✅  
)
```

### **Automatic Lab Security:**
```python
# Before: Can access any lab's data
patient = await patient_repo.get(uid="patient_123")  # Dangerous ❌

# After: Only current lab's data accessible
patient = await patient_repo.get(uid="patient_123")  # Safe ✅
# Returns None if patient belongs to different lab
```

## 📦 **All Methods Work Identically**

```python
# These exact method calls work in both BaseRepository and TenantAwareRepository
async def example_operations(repo):
    # Queries (now with automatic lab filtering)
    all_items = await repo.all()
    filtered = await repo.filter({"status": "active"})
    paginated = await repo.all_by_page(page=1, limit=20)
    single = await repo.get(uid="123")
    by_uids = await repo.get_by_uids(["uid1", "uid2"])
    search_results = await repo.search(name="test")
    count = await repo.count_where({"status": "pending"})
    
    # Mutations (now with automatic tenant context)
    created = await repo.create(name="New Item")
    bulk_created = await repo.bulk_create([{"name": "Item1"}, {"name": "Item2"}])
    updated = await repo.update("uid123", name="Updated")
    saved = await repo.save(entity)
    
    # Deletions (now with automatic lab filtering)
    await repo.delete("uid123")
    await repo.delete_where(status="inactive")
    
    # Advanced operations
    async with repo.transaction() as session:
        # Transaction operations with automatic tenant awareness
        pass
```

## 🚫 **What NOT to Change**

### **Keep BaseRepository for Global Entities:**
```python
# These should stay as BaseRepository (no lab filtering needed)
class UserRepository(BaseRepository[User]):        # ✅ Keep BaseRepository
class OrganizationRepository(BaseRepository[Organization]):  # ✅ Keep BaseRepository

# Only change lab-scoped entities to TenantAwareRepository
class PatientRepository(TenantAwareRepository):    # ✅ Change to TenantAware
class SampleRepository(TenantAwareRepository):     # ✅ Change to TenantAware
```

## 🔍 **Service Integration**

### **If you're using both Service and Repository:**
```python
# BEFORE
class PatientService(BaseService[Patient, PatientCreate, PatientUpdate]):
    def __init__(self):
        super().__init__(PatientRepository())  # Repository instance

class PatientRepository(BaseRepository[Patient]):
    def __init__(self):
        super().__init__(Patient)

# AFTER - Both become tenant-aware!
class PatientService(TenantAwareService):
    def __init__(self):
        super().__init__(Patient)  # Model instead of repository

class PatientRepository(TenantAwareRepository):
    def __init__(self):
        super().__init__(Patient)  # Same as before
```

## 🚀 **Migration Script Usage**

### **Migrate Single Repository:**
```bash
python migrate_services.py --dry-run --file felicity/apps/patient/repository.py
python migrate_services.py --file felicity/apps/patient/repository.py
```

### **Migrate All Repositories:**
```bash
python migrate_services.py --dry-run  # Preview all changes
python migrate_services.py            # Apply all changes
```

## ✅ **Benefits After Migration**

### **Security:**
- **Cross-lab data isolation** - repositories can't access other labs' data
- **Automatic access control** - no manual laboratory_uid checks needed

### **Developer Experience:**
- **Zero code changes** - all existing method calls work identically  
- **Automatic context** - no manual tenant context injection
- **Same API** - drop-in replacement with identical signatures

### **HIPAA Compliance:**
- **Encrypted field support** - works with existing encrypted repositories
- **Audit trails** - automatic logging of tenant context
- **Data isolation** - complete separation between labs

## 🎯 **Zero Code Changes for Existing Logic**

All your existing repository logic continues to work:

```python
# This exact code works in both BaseRepository and TenantAwareRepository
async def complex_patient_operations(repo):
    # Complex queries
    active_patients = await repo.filter(
        {"status": "active", "age__gte": 18},
        sort_attrs=["last_name", "first_name"],
        limit=100
    )
    
    # Bulk operations
    updates = [
        {"uid": "p1", "status": "discharged"},
        {"uid": "p2", "status": "transferred"}
    ]
    await repo.bulk_update_with_mappings(updates)
    
    # Transaction handling
    async with repo.transaction() as session:
        patient = await repo.create(
            first_name="John",
            last_name="Doe",
            session=session
        )
        await repo.update(patient.uid, status="admitted", session=session)
```

## 🚀 **Summary**

✅ **Same method signatures** - no refactoring needed  
✅ **Same constructor** - existing code works  
✅ **Drop-in replacement** - just change parent class  
✅ **Automatic lab filtering** - secure by default  
✅ **Automatic tenant context** - no manual injection  
✅ **HIPAA compatibility** - works with encrypted fields  

**Migration effort: 1 line per repository file!** 🎉

**Your lab-scoped repositories are now multi-tenant ready!** 🚀