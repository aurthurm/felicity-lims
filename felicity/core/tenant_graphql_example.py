"""
GraphQL Examples for Tenant-Aware Operations

This file demonstrates how to implement tenant-aware GraphQL mutations and queries
using Strawberry GraphQL with automatic lab context and audit trails.
"""

import strawberry
from typing import List, Optional
from strawberry.types import Info

from felicity.apps.abstract import TenantAwareService
from felicity.apps.analysis.entities import Sample, SampleType
from felicity.apps.patient.entities import Patient
from felicity.core.tenant_context import get_tenant_context, require_lab_context, require_user_context
from felicity.api.deps import get_audit_context


# Input Types
@strawberry.input
class CreatePatientInput:
    first_name: str
    last_name: str
    client_patient_id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None


@strawberry.input
class CreateSampleInput:
    patient_uid: str
    sample_type_uid: str
    priority: Optional[int] = 0
    date_collected: Optional[str] = None


@strawberry.input
class UpdateSampleStatusInput:
    sample_uid: str
    status: str
    notes: Optional[str] = None


# Response Types
@strawberry.type
class PatientType:
    uid: str
    first_name: str
    last_name: str
    client_patient_id: str
    email: Optional[str]
    phone: Optional[str]
    laboratory_uid: str  # Shows which lab this patient belongs to
    
    @classmethod
    def from_entity(cls, patient: Patient):
        return cls(
            uid=patient.uid,
            first_name=patient.first_name,
            last_name=patient.last_name,
            client_patient_id=patient.client_patient_id,
            email=patient.email,
            phone=patient.phone,
            laboratory_uid=patient.laboratory_uid
        )


@strawberry.type
class SampleType:
    uid: str
    sample_id: str
    status: str
    priority: int
    laboratory_uid: str
    patient: Optional[PatientType]
    date_collected: Optional[str]
    
    @classmethod
    def from_entity(cls, sample: Sample):
        return cls(
            uid=sample.uid,
            sample_id=sample.sample_id,
            status=sample.status,
            priority=sample.priority,
            laboratory_uid=sample.laboratory_uid,
            patient=PatientType.from_entity(sample.patient) if sample.patient else None,
            date_collected=sample.date_collected.isoformat() if sample.date_collected else None
        )


@strawberry.type
class TenantContextType:
    """Shows current tenant context"""
    user_uid: Optional[str]
    laboratory_uid: Optional[str]
    organization_uid: Optional[str]
    request_id: Optional[str]
    
    @classmethod
    def from_context(cls):
        context = get_tenant_context()
        return cls(
            user_uid=context.user_uid if context else None,
            laboratory_uid=context.laboratory_uid if context else None,
            organization_uid=context.organization_uid if context else None,
            request_id=context.request_id if context else None
        )


# Tenant-aware services
class PatientService(TenantAwareService[Patient]):
    def __init__(self):
        super().__init__(Patient)


class SampleService(TenantAwareService[Sample]):
    def __init__(self):
        super().__init__(Sample)


# GraphQL Queries
@strawberry.type
class TenantQuery:
    """Tenant-aware GraphQL queries"""
    
    @strawberry.field
    async def current_context(self) -> TenantContextType:
        """Get current tenant context - useful for debugging"""
        return TenantContextType.from_context()
    
    @strawberry.field
    async def patients(
        self, 
        info: Info,
        limit: Optional[int] = 20,
        search: Optional[str] = None
    ) -> List[PatientType]:
        """Get all patients in current laboratory"""
        
        # Context is automatically set by middleware
        # This query will only return patients from current lab
        patient_service = PatientService()
        
        if search:
            # Search with automatic lab filtering
            patients = await patient_service.filter_lab_scoped({
                "first_name__ilike": f"%{search}%"
            }, limit=limit)
        else:
            # Get all with automatic lab filtering
            patients = await patient_service.get_all_lab_scoped()
            patients = patients[:limit] if limit else patients
        
        return [PatientType.from_entity(p) for p in patients]
    
    @strawberry.field
    async def patient(self, info: Info, uid: str) -> Optional[PatientType]:
        """Get specific patient by UID (lab-scoped)"""
        
        patient_service = PatientService()
        
        # Automatically filtered to current lab
        patient = await patient_service.get_lab_scoped(uid=uid)
        return PatientType.from_entity(patient) if patient else None
    
    @strawberry.field
    async def samples(
        self, 
        info: Info,
        status: Optional[str] = None,
        patient_uid: Optional[str] = None,
        limit: Optional[int] = 50
    ) -> List[SampleType]:
        """Get samples in current laboratory"""
        
        sample_service = SampleService()
        
        filters = {}
        if status:
            filters["status"] = status
        if patient_uid:
            filters["patient_uid"] = patient_uid
        
        # Automatically filtered to current lab
        samples = await sample_service.filter_lab_scoped(filters, limit=limit)
        return [SampleType.from_entity(s) for s in samples]
    
    @strawberry.field
    async def sample(self, info: Info, uid: str) -> Optional[SampleType]:
        """Get specific sample by UID (lab-scoped)"""
        
        sample_service = SampleService()
        
        # Automatically filtered to current lab
        sample = await sample_service.get_lab_scoped(uid=uid, related=["patient"])
        return SampleType.from_entity(sample) if sample else None
    
    @strawberry.field
    async def lab_statistics(self, info: Info) -> dict:
        """Get statistics for current laboratory"""
        
        # Require lab context for this operation
        lab_uid = require_lab_context()
        
        patient_service = PatientService()
        sample_service = SampleService()
        
        # All counts automatically filtered to current lab
        total_patients = len(await patient_service.get_all_lab_scoped())
        total_samples = len(await sample_service.get_all_lab_scoped())
        
        pending_samples = len(await sample_service.filter_lab_scoped({"status": "pending"}))
        completed_samples = len(await sample_service.filter_lab_scoped({"status": "completed"}))
        
        return {
            "laboratory_uid": lab_uid,
            "total_patients": total_patients,
            "total_samples": total_samples,
            "pending_samples": pending_samples,
            "completed_samples": completed_samples
        }


# GraphQL Mutations
@strawberry.type
class TenantMutation:
    """Tenant-aware GraphQL mutations"""
    
    @strawberry.mutation
    async def create_patient(
        self, 
        info: Info, 
        input: CreatePatientInput
    ) -> PatientType:
        """Create a new patient in current laboratory"""
        
        # Require authentication and lab context
        user_uid = require_user_context()
        lab_uid = require_lab_context()
        
        patient_service = PatientService()
        
        # Create patient with audit trail
        # laboratory_uid is automatically injected
        patient = await patient_service.create_with_audit(
            audit_action="CREATE_PATIENT_VIA_GRAPHQL",
            first_name=input.first_name,
            last_name=input.last_name,
            client_patient_id=input.client_patient_id,
            email=input.email,
            phone=input.phone,
            date_of_birth=input.date_of_birth
        )
        
        return PatientType.from_entity(patient)
    
    @strawberry.mutation
    async def create_sample(
        self, 
        info: Info, 
        input: CreateSampleInput
    ) -> SampleType:
        """Create a new sample for a patient"""
        
        # Require authentication and lab context
        user_uid = require_user_context()
        lab_uid = require_lab_context()
        
        sample_service = SampleService()
        patient_service = PatientService()
        
        # Verify patient exists in current lab
        patient = await patient_service.get_lab_scoped(uid=input.patient_uid)
        if not patient:
            raise ValueError("Patient not found in current laboratory")
        
        # Create sample with audit trail
        # laboratory_uid is automatically injected
        sample = await sample_service.create_with_audit(
            audit_action="CREATE_SAMPLE_VIA_GRAPHQL",
            patient_uid=input.patient_uid,
            sample_type_uid=input.sample_type_uid,
            priority=input.priority,
            status="received",  # Default status
            date_collected=input.date_collected
        )
        
        return SampleType.from_entity(sample)
    
    @strawberry.mutation
    async def update_sample_status(
        self, 
        info: Info, 
        input: UpdateSampleStatusInput
    ) -> SampleType:
        """Update sample status with audit trail"""
        
        # Require authentication and lab context
        user_uid = require_user_context()
        lab_uid = require_lab_context()
        
        sample_service = SampleService()
        
        # Update sample status with audit trail
        # Automatically filtered to current lab
        updated_sample = await sample_service.update_with_audit(
            input.sample_uid,
            audit_action=f"UPDATE_SAMPLE_STATUS_TO_{input.status.upper()}",
            status=input.status,
            notes=input.notes
        )
        
        return SampleType.from_entity(updated_sample)
    
    @strawberry.mutation
    async def delete_patient(self, info: Info, uid: str) -> bool:
        """Delete patient from current laboratory"""
        
        # Require authentication and lab context
        user_uid = require_user_context()
        lab_uid = require_lab_context()
        
        patient_service = PatientService()
        
        # Verify patient exists in current lab before deletion
        patient = await patient_service.get_lab_scoped(uid=uid)
        if not patient:
            raise ValueError("Patient not found in current laboratory")
        
        # Delete with audit trail
        await patient_service.delete_with_audit(
            uid, 
            audit_action="DELETE_PATIENT_VIA_GRAPHQL"
        )
        
        return True
    
    @strawberry.mutation
    async def bulk_update_sample_status(
        self, 
        info: Info, 
        sample_uids: List[str], 
        new_status: str
    ) -> List[SampleType]:
        """Bulk update multiple samples status"""
        
        # Require authentication and lab context
        user_uid = require_user_context()
        lab_uid = require_lab_context()
        
        sample_service = SampleService()
        updated_samples = []
        
        for sample_uid in sample_uids:
            try:
                # Each update is automatically lab-scoped and audited
                updated_sample = await sample_service.update_with_audit(
                    sample_uid,
                    audit_action=f"BULK_UPDATE_STATUS_TO_{new_status.upper()}",
                    status=new_status
                )
                updated_samples.append(SampleType.from_entity(updated_sample))
            except Exception as e:
                # Log error but continue with other samples
                print(f"Failed to update sample {sample_uid}: {str(e)}")
                continue
        
        return updated_samples


# Admin Queries (Cross-lab operations)
@strawberry.type
class AdminQuery:
    """Admin queries that work across all labs"""
    
    @strawberry.field
    async def all_patients_admin(self, info: Info) -> List[PatientType]:
        """Get patients across all labs (admin only)"""
        
        # Require user context (admin check would go here)
        user_uid = require_user_context()
        
        patient_service = PatientService()
        
        # Cross-lab operation
        patients = await patient_service.get_all_cross_lab_admin()
        return [PatientType.from_entity(p) for p in patients]
    
    @strawberry.field
    async def patient_by_id_admin(self, info: Info, patient_id: str) -> Optional[PatientType]:
        """Find patient by ID across all labs (admin only)"""
        
        user_uid = require_user_context()
        
        patient_service = PatientService()
        
        # Cross-lab search
        patient = await patient_service.get_cross_lab_admin(client_patient_id=patient_id)
        return PatientType.from_entity(patient) if patient else None


# Complete Schema
@strawberry.type
class Query:
    """Main GraphQL Query"""
    
    # Tenant-aware queries
    current_context: TenantContextType = strawberry.field(resolver=TenantQuery.current_context)
    patients: List[PatientType] = strawberry.field(resolver=TenantQuery.patients)
    patient: Optional[PatientType] = strawberry.field(resolver=TenantQuery.patient)
    samples: List[SampleType] = strawberry.field(resolver=TenantQuery.samples)
    sample: Optional[SampleType] = strawberry.field(resolver=TenantQuery.sample)
    lab_statistics: dict = strawberry.field(resolver=TenantQuery.lab_statistics)
    
    # Admin queries
    all_patients_admin: List[PatientType] = strawberry.field(resolver=AdminQuery.all_patients_admin)
    patient_by_id_admin: Optional[PatientType] = strawberry.field(resolver=AdminQuery.patient_by_id_admin)


@strawberry.type
class Mutation:
    """Main GraphQL Mutation"""
    
    create_patient: PatientType = strawberry.field(resolver=TenantMutation.create_patient)
    create_sample: SampleType = strawberry.field(resolver=TenantMutation.create_sample)
    update_sample_status: SampleType = strawberry.field(resolver=TenantMutation.update_sample_status)
    delete_patient: bool = strawberry.field(resolver=TenantMutation.delete_patient)
    bulk_update_sample_status: List[SampleType] = strawberry.field(resolver=TenantMutation.bulk_update_sample_status)


# Example GraphQL operations that would be sent by frontend:

EXAMPLE_GRAPHQL_QUERIES = """
# 1. Get current tenant context (useful for debugging)
query GetContext {
  currentContext {
    userUid
    laboratoryUid
    organizationUid
    requestId
  }
}

# 2. Get all patients in current lab
query GetPatients($limit: Int, $search: String) {
  patients(limit: $limit, search: $search) {
    uid
    firstName
    lastName
    clientPatientId
    laboratoryUid
  }
}

# 3. Get samples with filters
query GetSamples($status: String, $patientUid: String) {
  samples(status: $status, patientUid: $patientUid) {
    uid
    sampleId
    status
    priority
    laboratoryUid
    patient {
      firstName
      lastName
    }
  }
}

# 4. Get lab statistics
query GetLabStats {
  labStatistics {
    laboratoryUid
    totalPatients
    totalSamples
    pendingSamples
    completedSamples
  }
}

# 5. Create a new patient
mutation CreatePatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
    uid
    firstName
    lastName
    clientPatientId
    laboratoryUid
  }
}

# 6. Create a sample for a patient
mutation CreateSample($input: CreateSampleInput!) {
  createSample(input: $input) {
    uid
    sampleId
    status
    laboratoryUid
    patient {
      firstName
      lastName
    }
  }
}

# 7. Update sample status
mutation UpdateSampleStatus($input: UpdateSampleStatusInput!) {
  updateSampleStatus(input: $input) {
    uid
    status
  }
}

# 8. Bulk update sample statuses
mutation BulkUpdateStatus($sampleUids: [String!]!, $newStatus: String!) {
  bulkUpdateSampleStatus(sampleUids: $sampleUids, newStatus: $newStatus) {
    uid
    status
  }
}

# 9. Admin query - get all patients across labs
query GetAllPatientsAdmin {
  allPatientsAdmin {
    uid
    firstName
    lastName
    laboratoryUid
  }
}
"""

# Example variables for mutations:
EXAMPLE_VARIABLES = """
# Variables for CreatePatient mutation:
{
  "input": {
    "firstName": "John",
    "lastName": "Doe", 
    "clientPatientId": "P12345",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }
}

# Variables for CreateSample mutation:
{
  "input": {
    "patientUid": "patient_123",
    "sampleTypeUid": "blood_sample_type",
    "priority": 1,
    "dateCollected": "2023-01-15T10:30:00Z"
  }
}

# Variables for UpdateSampleStatus mutation:
{
  "input": {
    "sampleUid": "sample_123",
    "status": "processing",
    "notes": "Started analysis"
  }
}
"""

# Example headers that frontend should send:
EXAMPLE_HEADERS = """
{
  "Authorization": "Bearer jwt_token_here",
  "X-Laboratory-ID": "lab_123",  // Optional: to switch lab context
  "Content-Type": "application/json"
}
"""