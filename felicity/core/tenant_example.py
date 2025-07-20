"""
Example of how to use tenant-aware services and repositories

This file demonstrates the proper usage patterns for multi-tenant operations.
"""

from felicity.apps.abstract import TenantAwareService, TenantAwareRepository
from felicity.apps.analysis.entities import Sample
from felicity.apps.patient.entities import Patient
from felicity.core.tenant_context import with_tenant_context


# Example 1: Convert existing service to tenant-aware
class SampleService(TenantAwareService[Sample]):
    """Tenant-aware sample service"""
    
    def __init__(self):
        super().__init__(Sample)
    
    async def create_sample_for_patient(self, patient_uid: str, sample_type_uid: str, **kwargs):
        """Create sample with patient context and audit trail"""
        
        # Verify patient exists in current lab
        patient_service = PatientService()
        patient = await patient_service.get_lab_scoped(uid=patient_uid)
        if not patient:
            raise ValueError("Patient not found in current laboratory context")
        
        # Create sample with audit trail
        return await self.create_with_audit(
            audit_action="CREATE_SAMPLE_FOR_PATIENT",
            patient_uid=patient_uid,
            sample_type_uid=sample_type_uid,
            **kwargs
        )
    
    async def update_sample_status(self, sample_uid: str, new_status: str):
        """Update sample status with audit trail"""
        return await super().update_sample_status(
            sample_uid, 
            new_status,
            status=new_status
        )


class PatientService(TenantAwareService[Patient]):
    """Tenant-aware patient service"""
    
    def __init__(self):
        super().__init__(Patient)
    
    async def create_patient_with_validation(self, **kwargs):
        """Create patient with validation and audit"""
        
        # Validate required fields
        required_fields = ["first_name", "last_name", "client_patient_id"]
        for field in required_fields:
            if field not in kwargs:
                raise ValueError(f"Missing required field: {field}")
        
        # Create with audit trail
        return await self.create_with_audit(
            audit_action="CREATE_PATIENT",
            **kwargs
        )


# Example 2: Using tenant context in operations
async def example_tenant_operations():
    """Example of tenant-aware operations"""
    
    # Example user context (this would come from JWT in real usage)
    user_uid = "user_123"
    org_uid = "org_456" 
    lab_uid = "lab_789"
    
    # Use context manager for operations
    async with with_tenant_context(user_uid, org_uid, lab_uid):
        
        # All operations within this context are automatically lab-scoped
        patient_service = PatientService()
        sample_service = SampleService()
        
        # Create patient - automatically gets lab context
        patient = await patient_service.create_patient_with_validation(
            first_name="John",
            last_name="Doe", 
            client_patient_id="P12345"
        )
        
        # Create sample for patient - automatically lab-scoped
        sample = await sample_service.create_sample_for_patient(
            patient_uid=patient.uid,
            sample_type_uid="sample_type_123",
            status="received"
        )
        
        # Update sample status - with audit trail
        await sample_service.update_sample_status(
            sample.uid, 
            "processing"
        )
        
        # Get all patients in this lab
        all_patients = await patient_service.get_all_lab_scoped()
        
        # Filter samples by status 
        processing_samples = await sample_service.filter_lab_scoped({
            "status": "processing"
        })
        
        print(f"Created patient {patient.uid} and sample {sample.uid}")
        print(f"Lab has {len(all_patients)} patients and {len(processing_samples)} processing samples")


# Example 3: Admin operations across labs
async def example_admin_operations():
    """Example of admin operations that work across labs"""
    
    # Admin user context
    admin_uid = "admin_123"
    org_uid = "org_456"
    
    async with with_tenant_context(admin_uid, org_uid, None):  # No specific lab
        
        sample_service = SampleService()
        
        # Get sample across all labs (admin operation)
        sample = await sample_service.get_cross_lab_admin(uid="sample_123")
        
        # Get all samples across all labs (admin operation) 
        all_samples = await sample_service.get_all_cross_lab_admin()
        
        print(f"Admin found {len(all_samples)} samples across all labs")


# Example 4: Direct repository usage
async def example_repository_usage():
    """Example of using tenant-aware repository directly"""
    
    user_uid = "user_123"
    org_uid = "org_456"
    lab_uid = "lab_789"
    
    async with with_tenant_context(user_uid, org_uid, lab_uid):
        
        # Use repository directly
        sample_repo = TenantAwareRepository(Sample)
        
        # Create sample - automatically gets lab context
        sample = await sample_repo.create(
            sample_type_uid="type_123",
            status="received"
        )
        
        # Get sample - automatically filtered by lab
        found_sample = await sample_repo.get(uid=sample.uid)
        
        # Update sample - automatically adds updated_by
        updated_sample = await sample_repo.update(
            sample.uid,
            status="processing"
        )
        
        print(f"Repository operations completed for sample {sample.uid}")


# Example 5: Integration with FastAPI/GraphQL
from fastapi import Depends
from felicity.api.deps import require_lab_context_dep, get_current_user_from_context

async def create_sample_endpoint(
    lab_uid: str = Depends(require_lab_context_dep),
    current_user = Depends(get_current_user_from_context),
    sample_data: dict = None
):
    """FastAPI endpoint with automatic tenant context"""
    
    # Context is automatically set by middleware
    # lab_uid and current_user are automatically available
    
    sample_service = SampleService()
    
    # This will automatically use the lab context from middleware
    sample = await sample_service.create_with_audit(**sample_data)
    
    return {"sample": sample.uid, "lab": lab_uid, "user": current_user.uid}


if __name__ == "__main__":
    import asyncio
    
    # Run examples
    asyncio.run(example_tenant_operations())
    asyncio.run(example_admin_operations())
    asyncio.run(example_repository_usage())