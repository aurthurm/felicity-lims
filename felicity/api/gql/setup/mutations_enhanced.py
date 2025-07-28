from __future__ import annotations

from typing import Dict, List, Optional, Any
import strawberry
from strawberry.types import Info

from felicity.api.gql.auth.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import MessageType, OperationError
from felicity.api.gql.setup.types import LaboratoryType
from felicity.apps.setup.services_enhanced import EnhancedLaboratoryService
from felicity.apps.setup.schemas_enhanced import (
    EnhancedLaboratoryCreate,
    EnhancedLaboratoryUpdate,
    LaboratorySettingsCreate,
    LaboratorySettingsUpdate,
    LaboratoryTemplate,
    LaboratoryCloneRequest,
    BulkLaboratoryOperation,
    LaboratoryValidationResult,
    LaboratoryAnalytics,
    LaboratoryComplianceCheck,
    LaboratoryCreationResponse,
    LaboratoryUpdateResponse,
    LaboratoryDeletionResponse,
    LaboratoryAssignmentResponse,
    BulkOperationResult
)


# Input Types for GraphQL

@strawberry.input
class EnhancedLaboratoryCreateInputType:
    name: str
    code: Optional[str] = None
    organization_uid: str
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    address: Optional[str] = None
    country_uid: Optional[str] = None
    province_uid: Optional[str] = None
    district_uid: Optional[str] = None
    lab_manager_uid: Optional[str] = None
    laboratory_type: str = "clinical"
    accreditation_number: Optional[str] = None
    license_number: Optional[str] = None
    registration_number: Optional[str] = None
    timezone: str = "UTC"
    is_active: bool = True
    is_reference_lab: bool = False
    default_departments: List[str] = strawberry.field(default_factory=lambda: ["Clinical", "Microbiology", "Chemistry"])
    create_default_settings: bool = True

@strawberry.input
class EnhancedLaboratoryUpdateInputType:
    name: Optional[str] = None
    code: Optional[str] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    address: Optional[str] = None
    country_uid: Optional[str] = None
    province_uid: Optional[str] = None
    district_uid: Optional[str] = None
    lab_manager_uid: Optional[str] = None
    laboratory_type: Optional[str] = None
    accreditation_number: Optional[str] = None
    license_number: Optional[str] = None
    registration_number: Optional[str] = None
    timezone: Optional[str] = None
    is_active: Optional[bool] = None
    is_reference_lab: Optional[bool] = None

@strawberry.input
class LaboratorySettingsInputType:
    password_lifetime: int = 90
    inactivity_log_out: int = 30
    allow_self_verification: bool = False
    require_two_factor: bool = False
    allow_patient_registration: bool = True
    allow_sample_registration: bool = True
    allow_worksheet_creation: bool = True
    auto_receive_samples: bool = False
    auto_assign_worksheets: bool = False
    qc_frequency: str = "daily"
    qc_percentage: float = 5.0
    require_qc_approval: bool = True
    default_report_format: str = "pdf"
    auto_release_results: bool = False
    require_result_verification: bool = True
    allow_provisional_results: bool = False
    allow_billing: bool = False
    currency: str = "USD"
    payment_terms_days: int = 30
    sample_retention_days: int = 3650
    result_retention_days: int = 2555
    audit_retention_days: int = 2555
    external_system_integration: bool = False
    lis_integration_enabled: bool = False
    hl7_enabled: bool = False

@strawberry.input
class LaboratoryCloneInputType:
    source_laboratory_uid: str
    new_laboratory_name: str
    new_laboratory_code: Optional[str] = None
    organization_uid: str
    clone_settings: bool = True
    clone_departments: bool = True
    clone_users: bool = False
    clone_user_roles: bool = True
    lab_manager_uid: Optional[str] = None
    location_overrides: Optional[Dict[str, str]] = strawberry.field(default_factory=dict)

@strawberry.input
class UserAssignmentInputType:
    user_uid: str
    role: str = "user"

@strawberry.input
class BulkUserAssignmentInputType:
    laboratory_uid: str
    user_assignments: List[UserAssignmentInputType]
    replace_existing: bool = False

@strawberry.input
class LaboratoryTransferInputType:
    source_laboratory_uid: str
    target_laboratory_uid: str
    user_uids: Optional[List[str]] = None
    preserve_roles: bool = True


# Response Types for GraphQL

@strawberry.type
class LaboratoryCreationResponseType:
    success: bool
    laboratory_uid: Optional[str] = None
    laboratory_code: Optional[str] = None
    errors: Dict[str, List[str]]
    warnings: List[str]
    created_departments: List[str]
    settings_created: bool

@strawberry.type
class LaboratoryUpdateResponseType:
    success: bool
    updated_fields: List[str]
    errors: Dict[str, List[str]]
    warnings: List[str]

@strawberry.type
class LaboratoryDeletionResponseType:
    success: bool
    cleanup_results: Dict[str, str]  # Simplified for GraphQL
    errors: List[str]
    warnings: List[str]

@strawberry.type
class LaboratoryAssignmentResponseType:
    success: bool
    laboratory_uid: str
    assigned_users: List[str]
    failed_assignments: Dict[str, str]
    warnings: List[str]

@strawberry.type
class BulkOperationResultType:
    operation_type: str
    total_attempted: int
    total_successful: int
    total_failed: int
    successful_items: List[str]
    failed_items: Dict[str, str]
    warnings: List[str]
    execution_time: Optional[float] = None

@strawberry.type
class LaboratoryValidationResultType:
    laboratory_uid: str
    is_valid: bool
    has_dependencies: bool
    errors: List[str]
    warnings: List[str]
    dependencies: Dict[str, str]  # Simplified for GraphQL

@strawberry.type
class LaboratoryAnalyticsType:
    laboratory_uid: str
    laboratory_name: str
    organization_name: Optional[str]
    total_users: int
    active_users: int
    inactive_users: int
    user_role_distribution: Dict[str, int]
    total_departments: int
    department_names: List[str]
    configuration_completeness: float
    compliance_score: float

@strawberry.type
class LaboratoryComplianceType:
    laboratory_uid: str
    overall_score: float
    checks_passed: int
    total_checks: int
    compliance_items: List[Dict[str, str]]
    recommendations: List[str]

@strawberry.type
class LaboratoryConfigurationType:
    laboratory_uid: str
    settings: Dict[str, str]  # Simplified for GraphQL
    inherited_settings: Dict[str, str]
    departments: List[str]
    user_count: int
    active_user_count: int


# Union Types for GraphQL Responses

LaboratoryCreateResponse = strawberry.union(
    "LaboratoryCreateResponse",
    [LaboratoryType, LaboratoryCreationResponseType, OperationError]
)

LaboratoryUpdateResponse = strawberry.union(
    "LaboratoryUpdateResponse",
    [LaboratoryType, LaboratoryUpdateResponseType, OperationError]
)

LaboratoryDeleteResponse = strawberry.union(
    "LaboratoryDeleteResponse",
    [LaboratoryDeletionResponseType, OperationError]
)

LaboratoryAssignmentResponse = strawberry.union(
    "LaboratoryAssignmentResponse",
    [LaboratoryAssignmentResponseType, OperationError]
)

BulkOperationResponse = strawberry.union(
    "BulkOperationResponse",
    [BulkOperationResultType, OperationError]
)

ValidationResponse = strawberry.union(
    "ValidationResponse",
    [LaboratoryValidationResultType, OperationError]
)

AnalyticsResponse = strawberry.union(
    "AnalyticsResponse",
    [LaboratoryAnalyticsType, OperationError]
)

ComplianceResponse = strawberry.union(
    "ComplianceResponse",
    [LaboratoryComplianceType, OperationError]
)

ConfigurationResponse = strawberry.union(
    "ConfigurationResponse",
    [LaboratoryConfigurationType, OperationError]
)


# Enhanced Laboratory Mutations

@strawberry.type
class EnhancedLaboratoryMutations:
    """Enhanced laboratory mutations with comprehensive multi-tenant support"""

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_laboratory_enhanced(
        self,
        info: Info,
        laboratory_input: EnhancedLaboratoryCreateInputType,
        settings_input: Optional[LaboratorySettingsInputType] = None
    ) -> LaboratoryCreateResponse:
        """Create laboratory with enhanced multi-tenant support"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            # Convert input to schema
            lab_data = EnhancedLaboratoryCreate(
                name=laboratory_input.name,
                code=laboratory_input.code,
                organization_uid=laboratory_input.organization_uid,
                email=laboratory_input.email,
                email_cc=laboratory_input.email_cc,
                mobile_phone=laboratory_input.mobile_phone,
                business_phone=laboratory_input.business_phone,
                address=laboratory_input.address,
                country_uid=laboratory_input.country_uid,
                province_uid=laboratory_input.province_uid,
                district_uid=laboratory_input.district_uid,
                lab_manager_uid=laboratory_input.lab_manager_uid,
                laboratory_type=laboratory_input.laboratory_type,
                accreditation_number=laboratory_input.accreditation_number,
                license_number=laboratory_input.license_number,
                registration_number=laboratory_input.registration_number,
                timezone=laboratory_input.timezone,
                is_active=laboratory_input.is_active,
                is_reference_lab=laboratory_input.is_reference_lab,
                default_departments=laboratory_input.default_departments,
                create_default_settings=laboratory_input.create_default_settings
            )
            
            # Convert settings input if provided
            settings_data = None
            if settings_input:
                settings_data = LaboratorySettingsCreate(
                    password_lifetime=settings_input.password_lifetime,
                    inactivity_log_out=settings_input.inactivity_log_out,
                    allow_self_verification=settings_input.allow_self_verification,
                    require_two_factor=settings_input.require_two_factor,
                    allow_patient_registration=settings_input.allow_patient_registration,
                    allow_sample_registration=settings_input.allow_sample_registration,
                    allow_worksheet_creation=settings_input.allow_worksheet_creation,
                    auto_receive_samples=settings_input.auto_receive_samples,
                    auto_assign_worksheets=settings_input.auto_assign_worksheets,
                    qc_frequency=settings_input.qc_frequency,
                    qc_percentage=settings_input.qc_percentage,
                    require_qc_approval=settings_input.require_qc_approval,
                    default_report_format=settings_input.default_report_format,
                    auto_release_results=settings_input.auto_release_results,
                    require_result_verification=settings_input.require_result_verification,
                    allow_provisional_results=settings_input.allow_provisional_results,
                    allow_billing=settings_input.allow_billing,
                    currency=settings_input.currency,
                    payment_terms_days=settings_input.payment_terms_days,
                    sample_retention_days=settings_input.sample_retention_days,
                    result_retention_days=settings_input.result_retention_days,
                    audit_retention_days=settings_input.audit_retention_days,
                    external_system_integration=settings_input.external_system_integration,
                    lis_integration_enabled=settings_input.lis_integration_enabled,
                    hl7_enabled=settings_input.hl7_enabled
                )
            
            # Create laboratory
            laboratory = await service.create_with_settings(
                laboratory_data=lab_data,
                settings_data=settings_data,
                assign_creator=True,
                creator_role="admin",
                created_by=current_user.uid
            )
            
            return laboratory
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_enhanced(
        self,
        info: Info,
        laboratory_uid: str,
        laboratory_input: EnhancedLaboratoryUpdateInputType
    ) -> LaboratoryUpdateResponse:
        """Update laboratory with enhanced validation"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            # Convert input to dict, filtering None values
            update_data = {
                k: v for k, v in {
                    "name": laboratory_input.name,
                    "code": laboratory_input.code,
                    "email": laboratory_input.email,
                    "email_cc": laboratory_input.email_cc,
                    "mobile_phone": laboratory_input.mobile_phone,
                    "business_phone": laboratory_input.business_phone,
                    "address": laboratory_input.address,
                    "country_uid": laboratory_input.country_uid,
                    "province_uid": laboratory_input.province_uid,
                    "district_uid": laboratory_input.district_uid,
                    "lab_manager_uid": laboratory_input.lab_manager_uid,
                    "laboratory_type": laboratory_input.laboratory_type,
                    "accreditation_number": laboratory_input.accreditation_number,
                    "license_number": laboratory_input.license_number,
                    "registration_number": laboratory_input.registration_number,
                    "timezone": laboratory_input.timezone,
                    "is_active": laboratory_input.is_active,
                    "is_reference_lab": laboratory_input.is_reference_lab,
                }.items() if v is not None
            }
            
            # Create update schema
            lab_update = EnhancedLaboratoryUpdate(**update_data)
            
            # Update laboratory
            laboratory = await service.update_with_validation(
                laboratory_uid=laboratory_uid,
                laboratory_data=lab_update,
                validate_dependencies=True,
                updated_by=current_user.uid
            )
            
            return laboratory
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_laboratory_enhanced(
        self,
        info: Info,
        laboratory_uid: str,
        force_delete: bool = False,
        reassign_users_to: Optional[str] = None
    ) -> LaboratoryDeleteResponse:
        """Delete laboratory with comprehensive cleanup"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            cleanup_results = await service.delete_with_cleanup(
                laboratory_uid=laboratory_uid,
                force_delete=force_delete,
                reassign_users_to=reassign_users_to,
                deleted_by=current_user.uid
            )
            
            return LaboratoryDeletionResponseType(
                success=True,
                cleanup_results={k: str(v) for k, v in cleanup_results.items()},
                errors=[],
                warnings=cleanup_results.get("warnings", [])
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def assign_users_to_laboratory(
        self,
        info: Info,
        assignment_input: BulkUserAssignmentInputType
    ) -> LaboratoryAssignmentResponse:
        """Assign multiple users to laboratory with roles"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            # Convert input to expected format
            user_assignments = [
                {
                    "user_uid": assignment.user_uid,
                    "role": assignment.role
                }
                for assignment in assignment_input.user_assignments
            ]
            
            results = await service.assign_users_to_laboratory(
                laboratory_uid=assignment_input.laboratory_uid,
                user_assignments=user_assignments,
                replace_existing=assignment_input.replace_existing,
                assigned_by=current_user.uid
            )
            
            successful_users = [uid for uid, success in results.items() if success]
            failed_assignments = {uid: "Assignment failed" for uid, success in results.items() if not success}
            
            return LaboratoryAssignmentResponseType(
                success=len(successful_users) > 0,
                laboratory_uid=assignment_input.laboratory_uid,
                assigned_users=successful_users,
                failed_assignments=failed_assignments,
                warnings=[]
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def transfer_laboratory_users(
        self,
        info: Info,
        transfer_input: LaboratoryTransferInputType
    ) -> BulkOperationResponse:
        """Transfer users from one laboratory to another"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            transfer_results = await service.transfer_laboratory_users(
                source_laboratory_uid=transfer_input.source_laboratory_uid,
                target_laboratory_uid=transfer_input.target_laboratory_uid,
                user_uids=transfer_input.user_uids,
                preserve_roles=transfer_input.preserve_roles,
                transferred_by=current_user.uid
            )
            
            successful_items = [f"user_{i}" for i in range(transfer_results["transferred"])]
            failed_items = {k: str(v) for k, v in transfer_results.get("errors", {}).items()}
            
            return BulkOperationResultType(
                operation_type="user_transfer",
                total_attempted=transfer_results["total_users"],
                total_successful=transfer_results["transferred"],
                total_failed=transfer_results["failed"],
                successful_items=successful_items,
                failed_items=failed_items,
                warnings=[],
                execution_time=None
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def clone_laboratory(
        self,
        info: Info,
        clone_input: LaboratoryCloneInputType
    ) -> LaboratoryCreateResponse:
        """Clone laboratory with all its configuration"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            # Get source laboratory for cloning
            source_lab = await service.get(uid=clone_input.source_laboratory_uid)
            if not source_lab:
                return OperationError(error="Source laboratory not found")
            
            # Create new laboratory data based on source
            lab_data = EnhancedLaboratoryCreate(
                name=clone_input.new_laboratory_name,
                code=clone_input.new_laboratory_code,
                organization_uid=clone_input.organization_uid,
                email=source_lab.email,
                email_cc=source_lab.email_cc,
                mobile_phone=source_lab.mobile_phone,
                business_phone=source_lab.business_phone,
                address=source_lab.address,
                country_uid=source_lab.country_uid,
                province_uid=source_lab.province_uid,
                district_uid=source_lab.district_uid,
                lab_manager_uid=clone_input.lab_manager_uid or source_lab.lab_manager_uid,
                laboratory_type=source_lab.laboratory_type or "clinical",
                accreditation_number=source_lab.accreditation_number,
                license_number=source_lab.license_number,
                registration_number=source_lab.registration_number,
                timezone=source_lab.timezone or "UTC",
                is_active=True,
                is_reference_lab=getattr(source_lab, 'is_reference_lab', False),
                create_default_settings=clone_input.clone_settings
            )
            
            # Apply location overrides if provided
            if clone_input.location_overrides:
                for field, value in clone_input.location_overrides.items():
                    if hasattr(lab_data, field):
                        setattr(lab_data, field, value)
            
            # Create the cloned laboratory
            new_laboratory = await service.create_with_settings(
                laboratory_data=lab_data,
                settings_data=None,  # Will be cloned separately if requested
                assign_creator=True,
                creator_role="admin",
                created_by=current_user.uid
            )
            
            # Clone settings if requested
            if clone_input.clone_settings:
                await service.clone_laboratory_settings(
                    source_laboratory_uid=clone_input.source_laboratory_uid,
                    target_laboratory_uid=new_laboratory.uid,
                    include_departments=clone_input.clone_departments,
                    cloned_by=current_user.uid
                )
            
            return new_laboratory
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_settings(
        self,
        info: Info,
        laboratory_uid: str,
        settings_input: LaboratorySettingsInputType
    ) -> MessageType:
        """Update laboratory settings"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedLaboratoryService()
            
            # Convert input to schema (only include non-default values for update)
            settings_dict = {
                k: v for k, v in {
                    "password_lifetime": settings_input.password_lifetime,
                    "inactivity_log_out": settings_input.inactivity_log_out,
                    "allow_self_verification": settings_input.allow_self_verification,
                    "require_two_factor": settings_input.require_two_factor,
                    "allow_patient_registration": settings_input.allow_patient_registration,
                    "allow_sample_registration": settings_input.allow_sample_registration,
                    "allow_worksheet_creation": settings_input.allow_worksheet_creation,
                    "auto_receive_samples": settings_input.auto_receive_samples,
                    "auto_assign_worksheets": settings_input.auto_assign_worksheets,
                    "qc_frequency": settings_input.qc_frequency,
                    "qc_percentage": settings_input.qc_percentage,
                    "require_qc_approval": settings_input.require_qc_approval,
                    "default_report_format": settings_input.default_report_format,
                    "auto_release_results": settings_input.auto_release_results,
                    "require_result_verification": settings_input.require_result_verification,
                    "allow_provisional_results": settings_input.allow_provisional_results,
                    "allow_billing": settings_input.allow_billing,
                    "currency": settings_input.currency,
                    "payment_terms_days": settings_input.payment_terms_days,
                    "sample_retention_days": settings_input.sample_retention_days,
                    "result_retention_days": settings_input.result_retention_days,
                    "audit_retention_days": settings_input.audit_retention_days,
                    "external_system_integration": settings_input.external_system_integration,
                    "lis_integration_enabled": settings_input.lis_integration_enabled,
                    "hl7_enabled": settings_input.hl7_enabled,
                }.items()
            }
            
            settings_update = LaboratorySettingsUpdate(**settings_dict)
            
            await service.update_laboratory_settings(
                laboratory_uid=laboratory_uid,
                settings_data=settings_update,
                updated_by=current_user.uid
            )
            
            return MessageType(message="Laboratory settings updated successfully")
            
        except Exception as e:
            return MessageType(message=f"Error: {str(e)}")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def validate_laboratory_dependencies(
        self,
        info: Info,
        laboratory_uid: str
    ) -> ValidationResponse:
        """Validate laboratory dependencies before major operations"""
        try:
            service = EnhancedLaboratoryService()
            
            validation_result = await service.validate_laboratory_dependencies(laboratory_uid)
            
            return LaboratoryValidationResultType(
                laboratory_uid=validation_result.laboratory_uid,
                is_valid=validation_result.is_valid,
                has_dependencies=validation_result.has_dependencies,
                errors=validation_result.errors,
                warnings=validation_result.warnings,
                dependencies={k: str(v) for k, v in validation_result.dependencies.items()}
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def get_laboratory_analytics(
        self,
        info: Info,
        laboratory_uid: str
    ) -> AnalyticsResponse:
        """Get comprehensive laboratory analytics"""
        try:
            service = EnhancedLaboratoryService()
            
            analytics = await service.get_laboratory_analytics(laboratory_uid)
            
            return LaboratoryAnalyticsType(
                laboratory_uid=analytics.laboratory_uid,
                laboratory_name=analytics.laboratory_name,
                organization_name=analytics.organization_name,
                total_users=analytics.total_users,
                active_users=analytics.active_users,
                inactive_users=analytics.inactive_users,
                user_role_distribution=analytics.user_role_distribution,
                total_departments=analytics.total_departments,
                department_names=analytics.department_names,
                configuration_completeness=analytics.configuration_completeness,
                compliance_score=analytics.compliance_score
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def check_laboratory_compliance(
        self,
        info: Info,
        laboratory_uid: str
    ) -> ComplianceResponse:
        """Check laboratory compliance with organizational policies"""
        try:
            service = EnhancedLaboratoryService()
            
            compliance = await service.check_laboratory_compliance(laboratory_uid)
            
            return LaboratoryComplianceType(
                laboratory_uid=compliance.laboratory_uid,
                overall_score=compliance.overall_score,
                checks_passed=compliance.checks_passed,
                total_checks=compliance.total_checks,
                compliance_items=[{str(k): str(v) for k, v in item.items()} for item in compliance.compliance_items],
                recommendations=compliance.recommendations
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def get_laboratory_configuration(
        self,
        info: Info,
        laboratory_uid: str,
        include_inherited: bool = True
    ) -> ConfigurationResponse:
        """Get complete laboratory configuration"""
        try:
            service = EnhancedLaboratoryService()
            
            config = await service.get_laboratory_configuration(
                laboratory_uid=laboratory_uid,
                include_inherited=include_inherited
            )
            
            return LaboratoryConfigurationType(
                laboratory_uid=laboratory_uid,
                settings={k: str(v) for k, v in config["settings"].items()},
                inherited_settings={k: str(v) for k, v in config["inherited_settings"].items()},
                departments=[dept.name for dept in config["departments"]],
                user_count=config["user_count"],
                active_user_count=config["active_user_count"]
            )
            
        except Exception as e:
            return OperationError(error=str(e))