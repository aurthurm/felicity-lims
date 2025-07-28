from __future__ import annotations

import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set, Tuple, Any
from dataclasses import asdict

from felicity.apps.abstract.service import BaseService
from felicity.apps.exceptions import AlreadyExistsError, ValidationError
from felicity.apps.setup.entities import Organization, OrganizationSetting
from felicity.apps.setup.entities.location import Country, District, Province
from felicity.apps.setup.entities.setup import (
    Department,
    Laboratory,
    LaboratorySetting,
    Manufacturer,
    Supplier,
    Unit,
)
from felicity.apps.setup.repositories import (
    CountryRepository,
    DepartmentRepository,
    DistrictRepository,
    LaboratoryRepository,
    LaboratorySettingRepository,
    ManufacturerRepository,
    ProvinceRepository,
    SupplierRepository,
    UnitRepository,
)
from felicity.apps.setup.repositories.setup import OrganizationRepository, OrganizationSettingRepository
from felicity.apps.setup.schemasssss import (
    EnhancedLaboratoryCreate,
    EnhancedLaboratoryUpdate,
    LaboratorySettingsCreate,
    LaboratorySettingsUpdate,
    LaboratoryTemplate,
    LaboratoryAnalytics,
    BulkLaboratoryOperation,
    LaboratoryValidationResult,
    LaboratoryUserSummary,
    LaboratoryComplianceCheck
)
from felicity.apps.user.entities import laboratory_user
from felicity.core.tenant_context import get_current_user


class EnhancedLaboratoryService(BaseService[Laboratory, EnhancedLaboratoryCreate, EnhancedLaboratoryUpdate]):
    """Enhanced Laboratory Service with comprehensive multi-tenant management capabilities"""
    
    def __init__(self) -> None:
        super().__init__(LaboratoryRepository())
        self._audit_events = []

    # Core Laboratory Management Extensions

    async def create_with_settings(
        self,
        laboratory_data: EnhancedLaboratoryCreate,
        settings_data: Optional[LaboratorySettingsCreate] = None,
        assign_creator: bool = True,
        creator_role: str = "admin",
        created_by: Optional[str] = None
    ) -> Laboratory:
        """
        Create laboratory with default settings and user assignment in single transaction
        
        Args:
            laboratory_data: Laboratory creation data
            settings_data: Optional laboratory settings
            assign_creator: Whether to assign creator as laboratory user
            creator_role: Role to assign to creator
            created_by: UID of user creating laboratory
        
        Returns:
            Created laboratory with settings
        """
        # Validate organization exists
        org_service = OrganizationService()
        organization = await org_service.get(uid=laboratory_data.organization_uid)
        if not organization:
            raise ValidationError(f"Organization {laboratory_data.organization_uid} not found")
        
        # Check for duplicate laboratory name in organization
        existing = await self.get_laboratory_by_name(
            laboratory_data.name, 
            laboratory_data.organization_uid
        )
        if existing:
            raise AlreadyExistsError(f"Laboratory '{laboratory_data.name}' already exists in organization")
        
        # Validate laboratory manager if specified
        if laboratory_data.lab_manager_uid:
            from felicity.apps.user.services_enhanced import EnhancedUserService
            user_service = EnhancedUserService()
            manager = await user_service.get(uid=laboratory_data.lab_manager_uid)
            if not manager:
                raise ValidationError(f"Laboratory manager {laboratory_data.lab_manager_uid} not found")
        
        async with self.transaction() as session:
            # Create laboratory
            lab_dict = self._import(laboratory_data)
            
            # Generate code if not provided
            if not lab_dict.get("code"):
                lab_dict["code"] = await self._generate_laboratory_code(laboratory_data.name, organization.code)
            
            laboratory = await super().create(lab_dict, session=session, commit=False)
            
            # Create default settings
            if settings_data or True:  # Always create default settings
                default_settings = settings_data or LaboratorySettingsCreate()
                await self._create_laboratory_settings(
                    laboratory.uid, 
                    default_settings, 
                    session
                )
            
            # Assign creator to laboratory if requested
            if assign_creator and created_by:
                await self._assign_user_to_laboratory(
                    user_uid=created_by,
                    laboratory_uid=laboratory.uid,
                    role=creator_role,
                    assigned_by=created_by,
                    session=session
                )
            
            # Create default departments if specified
            if laboratory_data.default_departments:
                await self._create_default_departments(
                    laboratory.uid,
                    laboratory_data.default_departments,
                    session
                )
            
            # Create audit entry
            await self._create_audit_entry(
                action="laboratory_created",
                target_uid=laboratory.uid,
                details={
                    "laboratory_name": laboratory_data.name,
                    "organization_uid": laboratory_data.organization_uid,
                    "created_by": created_by,
                    "has_settings": settings_data is not None,
                    "assigned_creator": assign_creator
                },
                session=session
            )
            
            await session.commit()
        
        return await self.get(uid=laboratory.uid, related=["organization", "settings", "manager"])

    async def update_with_validation(
        self,
        laboratory_uid: str,
        laboratory_data: EnhancedLaboratoryUpdate,
        validate_dependencies: bool = True,
        updated_by: Optional[str] = None
    ) -> Laboratory:
        """Update laboratory with comprehensive validation"""
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        # Validate name uniqueness if changed
        if laboratory_data.name and laboratory_data.name != laboratory.name:
            existing = await self.get_laboratory_by_name(
                laboratory_data.name, 
                laboratory.organization_uid
            )
            if existing and existing.uid != laboratory_uid:
                raise AlreadyExistsError(f"Laboratory '{laboratory_data.name}' already exists in organization")
        
        # Validate manager if changed
        if laboratory_data.lab_manager_uid:
            from felicity.apps.user.services_enhanced import EnhancedUserService
            user_service = EnhancedUserService()
            manager = await user_service.get(uid=laboratory_data.lab_manager_uid)
            if not manager:
                raise ValidationError(f"Laboratory manager {laboratory_data.lab_manager_uid} not found")
            
            # Ensure manager has access to laboratory
            user_labs = await user_service.get_user_laboratories(laboratory_data.lab_manager_uid)
            lab_uids = [lab.uid for lab in user_labs]
            if laboratory_uid not in lab_uids:
                await user_service.assign_to_laboratories(
                    user_uid=laboratory_data.lab_manager_uid,
                    laboratory_uids=[laboratory_uid],
                    laboratory_roles={laboratory_uid: "admin"},
                    assigned_by=updated_by
                )
        
        # Validate dependencies if requested
        if validate_dependencies:
            validation_result = await self.validate_laboratory_dependencies(laboratory_uid)
            if not validation_result.is_valid:
                raise ValidationError(f"Laboratory has dependency issues: {validation_result.errors}")
        
        # Update laboratory
        updated_lab = await super().update(
            laboratory_uid, 
            laboratory_data, 
            related=["organization", "settings", "manager"]
        )
        
        # Create audit entry
        await self._create_audit_entry(
            action="laboratory_updated",
            target_uid=laboratory_uid,
            details={
                "updated_fields": [k for k, v in laboratory_data.dict(exclude_unset=True).items() if v is not None],
                "updated_by": updated_by
            }
        )
        
        return updated_lab

    async def delete_with_cleanup(
        self,
        laboratory_uid: str,
        force_delete: bool = False,
        reassign_users_to: Optional[str] = None,
        deleted_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Delete laboratory with comprehensive cleanup
        
        Args:
            laboratory_uid: Laboratory to delete
            force_delete: Force deletion even with dependencies
            reassign_users_to: Laboratory UID to reassign users to
            deleted_by: UID of user performing deletion
        
        Returns:
            Dictionary with cleanup results
        """
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        cleanup_results = {
            "users_reassigned": 0,
            "dependencies_checked": True,
            "settings_removed": False,
            "departments_removed": 0,
            "warnings": []
        }
        
        # Check dependencies unless forced
        if not force_delete:
            validation_result = await self.validate_laboratory_dependencies(laboratory_uid)
            if validation_result.has_dependencies:
                raise ValidationError(
                    f"Cannot delete laboratory with active dependencies. "
                    f"Use force_delete=True to override. Dependencies: {validation_result.dependencies}"
                )
        
        async with self.transaction() as session:
            # Get laboratory users before deletion
            lab_users = await self.get_laboratory_users(laboratory_uid)
            
            # Reassign users if target laboratory specified
            if reassign_users_to and lab_users:
                from felicity.apps.user.services_enhanced import EnhancedUserService
                user_service = EnhancedUserService()
                
                for user in lab_users:
                    try:
                        await user_service.assign_to_laboratories(
                            user_uid=user.uid,
                            laboratory_uids=[reassign_users_to],
                            assigned_by=deleted_by
                        )
                        cleanup_results["users_reassigned"] += 1
                    except Exception as e:
                        cleanup_results["warnings"].append(f"Failed to reassign user {user.uid}: {str(e)}")
            
            # Remove user assignments
            await self.repository.table_delete(
                table=laboratory_user,
                session=session,
                laboratory_uid=laboratory_uid
            )
            
            # Remove laboratory settings
            settings_service = LaboratorySettingService()
            lab_settings = await settings_service.get(laboratory_uid=laboratory_uid)
            if lab_settings:
                await settings_service.delete(lab_settings.uid, session=session, commit=False)
                cleanup_results["settings_removed"] = True
            
            # Remove departments
            dept_service = DepartmentService()
            departments = await dept_service.get_all(laboratory_uid=laboratory_uid)
            for dept in departments:
                await dept_service.delete(dept.uid, session=session, commit=False)
                cleanup_results["departments_removed"] += 1
            
            # Delete laboratory
            await super().delete(laboratory_uid, session=session, commit=False)
            
            # Create audit entry
            await self._create_audit_entry(
                action="laboratory_deleted",
                target_uid=laboratory_uid,
                details={
                    "laboratory_name": laboratory.name,
                    "organization_uid": laboratory.organization_uid,
                    "deleted_by": deleted_by,
                    "force_delete": force_delete,
                    "cleanup_results": cleanup_results
                },
                session=session
            )
            
            await session.commit()
        
        return cleanup_results

    # Advanced User-Laboratory Assignment Operations

    async def assign_users_to_laboratory(
        self,
        laboratory_uid: str,
        user_assignments: List[Dict[str, Any]],  # [{"user_uid": str, "role": str}]
        replace_existing: bool = False,
        assigned_by: Optional[str] = None
    ) -> Dict[str, bool]:
        """Assign multiple users to laboratory with roles"""
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        results = {}
        
        async with self.transaction() as session:
            if replace_existing:
                # Remove existing assignments
                await self.repository.table_delete(
                    table=laboratory_user,
                    session=session,
                    laboratory_uid=laboratory_uid
                )
            
            # Process each assignment
            for assignment in user_assignments:
                user_uid = assignment["user_uid"]
                role = assignment.get("role", "user")
                
                try:
                    # Validate user exists
                    from felicity.apps.user.services_enhanced import EnhancedUserService
                    user_service = EnhancedUserService()
                    user = await user_service.get(uid=user_uid)
                    
                    if not user:
                        results[user_uid] = False
                        continue
                    
                    # Check if assignment already exists
                    if not replace_existing:
                        existing = await self.repository.table_query(
                            table=laboratory_user,
                            session=session,
                            user_uid=user_uid,
                            laboratory_uid=laboratory_uid
                        )
                        if existing:
                            results[user_uid] = True  # Already assigned
                            continue
                    
                    # Create assignment
                    await self._assign_user_to_laboratory(
                        user_uid=user_uid,
                        laboratory_uid=laboratory_uid,
                        role=role,
                        assigned_by=assigned_by,
                        session=session
                    )
                    
                    results[user_uid] = True
                    
                except Exception as e:
                    results[user_uid] = False
            
            # Create audit entry
            successful_assignments = [uid for uid, success in results.items() if success]
            await self._create_audit_entry(
                action="bulk_users_assigned_to_laboratory",
                target_uid=laboratory_uid,
                details={
                    "assigned_users": successful_assignments,
                    "total_attempted": len(user_assignments),
                    "total_successful": len(successful_assignments),
                    "assigned_by": assigned_by,
                    "replace_existing": replace_existing
                },
                session=session
            )
            
            await session.commit()
        
        return results

    async def get_laboratory_users(
        self,
        laboratory_uid: str,
        role_filter: Optional[str] = None,
        include_inactive: bool = False,
        include_assignment_details: bool = True
    ) -> List:
        """Get all users assigned to laboratory with filtering options"""
        query_params = {"laboratory_uid": laboratory_uid}
        
        if role_filter:
            query_params["role_in_laboratory"] = role_filter
        
        assignments = await self.repository.table_query(
            table=laboratory_user,
            **query_params
        )
        
        if not assignments:
            return []
        
        # Get user details
        from felicity.apps.user.services_enhanced import EnhancedUserService
        user_service = EnhancedUserService()
        user_uids = [assignment["user_uid"] for assignment in assignments]
        users = await user_service.get_by_uids(user_uids)
        
        # Filter inactive users if requested
        if not include_inactive:
            users = [user for user in users if user.is_active and not user.is_blocked]
        
        # Enrich with assignment details if requested
        if include_assignment_details:
            assignment_map = {a["user_uid"]: a for a in assignments}
            for user in users:
                assignment = assignment_map.get(user.uid, {})
                user.laboratory_assignment = {
                    "laboratory_uid": laboratory_uid,
                    "role_in_laboratory": assignment.get("role_in_laboratory", "user"),
                    "assigned_at": assignment.get("assigned_at"),
                    "assigned_by_uid": assignment.get("assigned_by_uid")
                }
        
        return users

    async def get_user_laboratories(
        self,
        user_uid: str,
        include_assignment_details: bool = True
    ) -> List[Laboratory]:
        """Get all laboratories assigned to user"""
        assignments = await self.repository.table_query(
            table=laboratory_user,
            user_uid=user_uid
        )
        
        if not assignments:
            return []
        
        lab_uids = [assignment["laboratory_uid"] for assignment in assignments]
        laboratories = await self.get_by_uids(lab_uids)
        
        # Enrich with assignment details if requested
        if include_assignment_details:
            assignment_map = {a["laboratory_uid"]: a for a in assignments}
            for lab in laboratories:
                assignment = assignment_map.get(lab.uid, {})
                lab.user_assignment = {
                    "user_uid": user_uid,
                    "role_in_laboratory": assignment.get("role_in_laboratory", "user"),
                    "assigned_at": assignment.get("assigned_at"),
                    "assigned_by_uid": assignment.get("assigned_by_uid")
                }
        
        return laboratories

    async def transfer_laboratory_users(
        self,
        source_laboratory_uid: str,
        target_laboratory_uid: str,
        user_uids: Optional[List[str]] = None,  # If None, transfer all
        preserve_roles: bool = True,
        transferred_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """Transfer users from one laboratory to another"""
        # Validate laboratories exist
        source_lab = await self.get(uid=source_laboratory_uid)
        target_lab = await self.get(uid=target_laboratory_uid)
        
        if not source_lab:
            raise ValueError(f"Source laboratory {source_laboratory_uid} not found")
        if not target_lab:
            raise ValueError(f"Target laboratory {target_laboratory_uid} not found")
        
        # Get users to transfer
        if user_uids:
            # Validate specified users are in source laboratory
            source_users = await self.get_laboratory_users(source_laboratory_uid)
            source_user_uids = {user.uid for user in source_users}
            invalid_users = set(user_uids) - source_user_uids
            if invalid_users:
                raise ValueError(f"Users not in source laboratory: {invalid_users}")
            
            users_to_transfer = [user for user in source_users if user.uid in user_uids]
        else:
            # Transfer all users
            users_to_transfer = await self.get_laboratory_users(source_laboratory_uid)
        
        transfer_results = {
            "total_users": len(users_to_transfer),
            "transferred": 0,
            "failed": 0,
            "errors": {}
        }
        
        async with self.transaction() as session:
            from felicity.apps.user.services_enhanced import EnhancedUserService
            user_service = EnhancedUserService()
            
            for user in users_to_transfer:
                try:
                    # Get current role if preserving
                    current_role = "user"
                    if preserve_roles and hasattr(user, 'laboratory_assignment'):
                        current_role = user.laboratory_assignment.get("role_in_laboratory", "user")
                    
                    # Remove from source laboratory
                    await self.repository.table_delete(
                        table=laboratory_user,
                        session=session,
                        user_uid=user.uid,
                        laboratory_uid=source_laboratory_uid
                    )
                    
                    # Add to target laboratory
                    await self._assign_user_to_laboratory(
                        user_uid=user.uid,
                        laboratory_uid=target_laboratory_uid,
                        role=current_role,
                        assigned_by=transferred_by,
                        session=session
                    )
                    
                    # Update active laboratory if it was the source
                    if user.active_laboratory_uid == source_laboratory_uid:
                        await user_service.update(
                            user.uid,
                            {"active_laboratory_uid": target_laboratory_uid},
                            session=session,
                            commit=False
                        )
                    
                    transfer_results["transferred"] += 1
                    
                except Exception as e:
                    transfer_results["failed"] += 1
                    transfer_results["errors"][user.uid] = str(e)
            
            # Create audit entry
            await self._create_audit_entry(
                action="laboratory_users_transferred",
                target_uid=source_laboratory_uid,
                details={
                    "target_laboratory_uid": target_laboratory_uid,
                    "source_laboratory_name": source_lab.name,
                    "target_laboratory_name": target_lab.name,
                    "transfer_results": transfer_results,
                    "transferred_by": transferred_by,
                    "preserve_roles": preserve_roles
                },
                session=session
            )
            
            await session.commit()
        
        return transfer_results

    # Laboratory Settings and Configuration Management

    async def update_laboratory_settings(
        self,
        laboratory_uid: str,
        settings_data: LaboratorySettingsUpdate,
        updated_by: Optional[str] = None
    ) -> LaboratorySettingsCreate:
        """Update laboratory settings with validation"""
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        settings_service = LaboratorySettingService()
        existing_settings = await settings_service.get(laboratory_uid=laboratory_uid)
        
        if existing_settings:
            # Update existing settings
            updated_settings = await settings_service.update(
                existing_settings.uid,
                settings_data
            )
        else:
            # Create new settings
            settings_create = LaboratorySettingsCreate(
                laboratory_uid=laboratory_uid,
                **settings_data.dict(exclude_unset=True)
            )
            updated_settings = await settings_service.create(settings_create)
        
        # Create audit entry
        await self._create_audit_entry(
            action="laboratory_settings_updated",
            target_uid=laboratory_uid,
            details={
                "updated_fields": list(settings_data.dict(exclude_unset=True).keys()),
                "updated_by": updated_by
            }
        )
        
        return updated_settings

    async def get_laboratory_configuration(
        self,
        laboratory_uid: str,
        include_inherited: bool = True
    ) -> Dict[str, Any]:
        """Get complete laboratory configuration including inherited settings"""
        laboratory = await self.get(uid=laboratory_uid, related=["organization", "settings"])
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        config = {
            "laboratory": laboratory,
            "settings": {},
            "inherited_settings": {},
            "departments": [],
            "user_count": 0,
            "active_user_count": 0
        }
        
        # Get laboratory-specific settings
        if laboratory.settings:
            config["settings"] = laboratory.settings[0].to_dict() if laboratory.settings else {}
        
        # Get inherited organization settings if requested
        if include_inherited and laboratory.organization:
            org_service = OrganizationSettingService()
            org_settings = await org_service.get(organization_uid=laboratory.organization_uid)
            if org_settings:
                config["inherited_settings"] = org_settings.to_dict()
        
        # Get departments
        dept_service = DepartmentService()
        departments = await dept_service.get_all(laboratory_uid=laboratory_uid)
        config["departments"] = departments
        
        # Get user statistics
        users = await self.get_laboratory_users(laboratory_uid, include_inactive=True)
        config["user_count"] = len(users)
        config["active_user_count"] = len([u for u in users if u.is_active and not u.is_blocked])
        
        return config

    async def clone_laboratory_settings(
        self,
        source_laboratory_uid: str,
        target_laboratory_uid: str,
        include_departments: bool = True,
        cloned_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """Clone settings from one laboratory to another"""
        source_lab = await self.get(uid=source_laboratory_uid)
        target_lab = await self.get(uid=target_laboratory_uid)
        
        if not source_lab:
            raise ValueError(f"Source laboratory {source_laboratory_uid} not found")
        if not target_lab:
            raise ValueError(f"Target laboratory {target_laboratory_uid} not found")
        
        clone_results = {
            "settings_cloned": False,
            "departments_cloned": 0,
            "errors": []
        }
        
        async with self.transaction() as session:
            # Clone settings
            settings_service = LaboratorySettingService()
            source_settings = await settings_service.get(laboratory_uid=source_laboratory_uid)
            
            if source_settings:
                try:
                    # Remove laboratory-specific fields
                    settings_dict = source_settings.to_dict()
                    exclude_fields = ["uid", "laboratory_uid", "created_at", "updated_at"]
                    for field in exclude_fields:
                        settings_dict.pop(field, None)
                    
                    settings_dict["laboratory_uid"] = target_laboratory_uid
                    
                    # Delete existing target settings if any
                    existing_target_settings = await settings_service.get(laboratory_uid=target_laboratory_uid)
                    if existing_target_settings:
                        await settings_service.delete(existing_target_settings.uid, session=session, commit=False)
                    
                    # Create new settings
                    settings_create = LaboratorySettingsCreate(**settings_dict)
                    await settings_service.create(settings_create, session=session, commit=False)
                    clone_results["settings_cloned"] = True
                    
                except Exception as e:
                    clone_results["errors"].append(f"Settings clone failed: {str(e)}")
            
            # Clone departments if requested
            if include_departments:
                dept_service = DepartmentService()
                source_departments = await dept_service.get_all(laboratory_uid=source_laboratory_uid)
                
                for dept in source_departments:
                    try:
                        # Remove department-specific fields
                        dept_dict = dept.to_dict()
                        exclude_fields = ["uid", "laboratory_uid", "created_at", "updated_at"]
                        for field in exclude_fields:
                            dept_dict.pop(field, None)
                        
                        dept_dict["laboratory_uid"] = target_laboratory_uid
                        
                        # Check if department with same name already exists
                        existing_dept = await dept_service.get(
                            name=dept.name,
                            laboratory_uid=target_laboratory_uid
                        )
                        
                        if not existing_dept:
                            from felicity.apps.setup.schemas import DepartmentCreate
                            dept_create = DepartmentCreate(**dept_dict)
                            await dept_service.create(dept_create, session=session, commit=False)
                            clone_results["departments_cloned"] += 1
                        
                    except Exception as e:
                        clone_results["errors"].append(f"Department {dept.name} clone failed: {str(e)}")
            
            # Create audit entry
            await self._create_audit_entry(
                action="laboratory_settings_cloned",
                target_uid=target_laboratory_uid,
                details={
                    "source_laboratory_uid": source_laboratory_uid,
                    "source_laboratory_name": source_lab.name,
                    "target_laboratory_name": target_lab.name,
                    "clone_results": clone_results,
                    "cloned_by": cloned_by,
                    "include_departments": include_departments
                },
                session=session
            )
            
            await session.commit()
        
        return clone_results

    # Laboratory Analytics and Reporting

    async def get_laboratory_analytics(
        self,
        laboratory_uid: str,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> LaboratoryAnalytics:
        """Get comprehensive laboratory analytics"""
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        # Set default date range if not provided
        if not date_to:
            date_to = datetime.utcnow()
        if not date_from:
            date_from = date_to - timedelta(days=30)  # Last 30 days
        
        # Get user statistics
        users = await self.get_laboratory_users(laboratory_uid, include_inactive=True)
        active_users = [u for u in users if u.is_active and not u.is_blocked]
        
        # Get role distribution
        role_distribution = {}
        for user in users:
            if hasattr(user, 'laboratory_assignment'):
                role = user.laboratory_assignment.get("role_in_laboratory", "user")
                role_distribution[role] = role_distribution.get(role, 0) + 1
        
        # Get department statistics
        dept_service = DepartmentService()
        departments = await dept_service.get_all(laboratory_uid=laboratory_uid)
        
        # Get recent activity (from audit logs)
        recent_activities = [
            event for event in self._audit_events
            if event.get("target_uid") == laboratory_uid or 
               event.get("details", {}).get("laboratory_uid") == laboratory_uid
        ][-10:]  # Last 10 activities
        
        return LaboratoryAnalytics(
            laboratory_uid=laboratory_uid,
            laboratory_name=laboratory.name,
            organization_name=laboratory.organization.name if laboratory.organization else None,
            date_from=date_from,
            date_to=date_to,
            total_users=len(users),
            active_users=len(active_users),
            inactive_users=len(users) - len(active_users),
            user_role_distribution=role_distribution,
            total_departments=len(departments),
            department_names=[dept.name for dept in departments],
            recent_activities=recent_activities,
            configuration_completeness=await self._calculate_configuration_completeness(laboratory_uid),
            compliance_score=await self._calculate_compliance_score(laboratory_uid)
        )

    async def get_organization_laboratory_summary(
        self,
        organization_uid: str
    ) -> Dict[str, Any]:
        """Get summary of all laboratories in organization"""
        org_service = OrganizationService()
        organization = await org_service.get(uid=organization_uid)
        if not organization:
            raise ValueError(f"Organization {organization_uid} not found")
        
        laboratories = await self.get_laboratories_by_organization(organization_uid)
        
        summary = {
            "organization": organization,
            "total_laboratories": len(laboratories),
            "laboratory_details": [],
            "total_users_across_labs": 0,
            "active_users_across_labs": 0,
            "laboratories_by_status": {"active": 0, "inactive": 0},
            "average_users_per_lab": 0
        }
        
        total_users = 0
        total_active_users = 0
        
        for lab in laboratories:
            users = await self.get_laboratory_users(lab.uid, include_inactive=True)
            active_users = [u for u in users if u.is_active and not u.is_blocked]
            
            lab_detail = {
                "laboratory": lab,
                "user_count": len(users),
                "active_user_count": len(active_users),
                "has_manager": lab.lab_manager_uid is not None,
                "manager_name": None
            }
            
            # Get manager name if available
            if lab.lab_manager_uid:
                from felicity.apps.user.services_enhanced import EnhancedUserService
                user_service = EnhancedUserService()
                manager = await user_service.get(uid=lab.lab_manager_uid)
                if manager:
                    lab_detail["manager_name"] = f"{manager.first_name} {manager.last_name}"
            
            summary["laboratory_details"].append(lab_detail)
            total_users += len(users)
            total_active_users += len(active_users)
            
            # Status tracking (assuming is_active field exists)
            if getattr(lab, 'is_active', True):
                summary["laboratories_by_status"]["active"] += 1
            else:
                summary["laboratories_by_status"]["inactive"] += 1
        
        summary["total_users_across_labs"] = total_users
        summary["active_users_across_labs"] = total_active_users
        summary["average_users_per_lab"] = total_users / len(laboratories) if laboratories else 0
        
        return summary

    # Laboratory Validation and Compliance

    async def validate_laboratory_dependencies(
        self,
        laboratory_uid: str
    ) -> LaboratoryValidationResult:
        """Validate laboratory dependencies before deletion or major changes"""
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        validation_result = LaboratoryValidationResult(
            laboratory_uid=laboratory_uid,
            is_valid=True,
            has_dependencies=False,
            errors=[],
            warnings=[],
            dependencies={}
        )
        
        # Check for active users
        users = await self.get_laboratory_users(laboratory_uid, include_inactive=False)
        if users:
            validation_result.has_dependencies = True
            validation_result.dependencies["active_users"] = len(users)
            validation_result.warnings.append(f"Laboratory has {len(users)} active users")
        
        # Check for departments
        dept_service = DepartmentService()
        departments = await dept_service.get_all(laboratory_uid=laboratory_uid)
        if departments:
            validation_result.has_dependencies = True
            validation_result.dependencies["departments"] = len(departments)
            validation_result.warnings.append(f"Laboratory has {len(departments)} departments")
        
        # TODO: Add checks for other dependencies like:
        # - Active samples
        # - Ongoing tests
        # - Financial records
        # - Equipment assignments
        
        # Check for required fields
        required_fields = ["name", "organization_uid"]
        for field in required_fields:
            if not getattr(laboratory, field, None):
                validation_result.is_valid = False
                validation_result.errors.append(f"Required field '{field}' is missing")
        
        return validation_result

    async def check_laboratory_compliance(
        self,
        laboratory_uid: str
    ) -> LaboratoryComplianceCheck:
        """Check laboratory compliance with organizational policies"""
        laboratory = await self.get(uid=laboratory_uid, related=["organization", "settings"])
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        compliance = LaboratoryComplianceCheck(
            laboratory_uid=laboratory_uid,
            overall_score=0.0,
            checks_passed=0,
            total_checks=0,
            compliance_items=[],
            recommendations=[]
        )
        
        # Check 1: Has laboratory manager
        compliance.total_checks += 1
        if laboratory.lab_manager_uid:
            compliance.checks_passed += 1
            compliance.compliance_items.append({
                "check": "has_manager",
                "status": "passed",
                "description": "Laboratory has assigned manager"
            })
        else:
            compliance.compliance_items.append({
                "check": "has_manager", 
                "status": "failed",
                "description": "Laboratory missing assigned manager"
            })
            compliance.recommendations.append("Assign a laboratory manager")
        
        # Check 2: Has laboratory settings
        compliance.total_checks += 1
        if laboratory.settings:
            compliance.checks_passed += 1
            compliance.compliance_items.append({
                "check": "has_settings",
                "status": "passed", 
                "description": "Laboratory has configured settings"
            })
        else:
            compliance.compliance_items.append({
                "check": "has_settings",
                "status": "failed",
                "description": "Laboratory missing settings configuration"
            })
            compliance.recommendations.append("Configure laboratory settings")
        
        # Check 3: Has departments
        compliance.total_checks += 1
        dept_service = DepartmentService()
        departments = await dept_service.get_all(laboratory_uid=laboratory_uid)
        if departments:
            compliance.checks_passed += 1
            compliance.compliance_items.append({
                "check": "has_departments",
                "status": "passed",
                "description": f"Laboratory has {len(departments)} departments"
            })
        else:
            compliance.compliance_items.append({
                "check": "has_departments",
                "status": "failed", 
                "description": "Laboratory has no departments"
            })
            compliance.recommendations.append("Create laboratory departments")
        
        # Check 4: Has active users
        compliance.total_checks += 1
        users = await self.get_laboratory_users(laboratory_uid, include_inactive=False)
        if users:
            compliance.checks_passed += 1
            compliance.compliance_items.append({
                "check": "has_active_users",
                "status": "passed",
                "description": f"Laboratory has {len(users)} active users"
            })
        else:
            compliance.compliance_items.append({
                "check": "has_active_users",
                "status": "failed",
                "description": "Laboratory has no active users"  
            })
            compliance.recommendations.append("Assign users to laboratory")
        
        # Calculate overall score
        compliance.overall_score = (compliance.checks_passed / compliance.total_checks) * 100 if compliance.total_checks > 0 else 0.0
        
        return compliance

    # Helper Methods

    async def _generate_laboratory_code(self, lab_name: str, org_code: str = None) -> str:
        """Generate unique laboratory code"""
        # Create base code from name
        base_code = "".join(word[:3].upper() for word in lab_name.split()[:2])
        
        # Add organization prefix if available
        if org_code:
            base_code = f"{org_code[:2]}-{base_code}"
        
        # Ensure uniqueness
        counter = 1
        code = base_code
        while await self.get(code=code):
            code = f"{base_code}-{counter:02d}"
            counter += 1
        
        return code

    async def _create_laboratory_settings(
        self,
        laboratory_uid: str,
        settings_data: LaboratorySettingsCreate,
        session
    ):
        """Create default laboratory settings"""
        settings_service = LaboratorySettingService()
        
        settings_dict = settings_data.dict()
        settings_dict["laboratory_uid"] = laboratory_uid
        
        # Set default values if not provided
        defaults = {
            "allow_self_verification": False,
            "allow_patient_registration": True,
            "allow_sample_registration": True,
            "allow_worksheet_creation": True,
            "password_lifetime": 90,
            "inactivity_log_out": 30
        }
        
        for key, value in defaults.items():
            if key not in settings_dict or settings_dict[key] is None:
                settings_dict[key] = value
        
        settings_create = LaboratorySettingsCreate(**settings_dict)
        await settings_service.create(settings_create, session=session, commit=False)

    async def _assign_user_to_laboratory(
        self,
        user_uid: str,
        laboratory_uid: str,
        role: str = "user",
        assigned_by: Optional[str] = None,
        session=None
    ):
        """Assign single user to laboratory"""
        assignment = {
            "user_uid": user_uid,
            "laboratory_uid": laboratory_uid,
            "assigned_at": datetime.utcnow(),
            "assigned_by_uid": assigned_by,
            "role_in_laboratory": role
        }
        
        await self.repository.table_insert(
            table=laboratory_user,
            mappings=[assignment],
            session=session,
            commit=False
        )

    async def _create_default_departments(
        self,
        laboratory_uid: str,
        department_names: List[str],
        session
    ):
        """Create default departments for laboratory"""
        dept_service = DepartmentService()
        
        for dept_name in department_names:
            from felicity.apps.setup.schemas import DepartmentCreate
            dept_create = DepartmentCreate(
                name=dept_name,
                laboratory_uid=laboratory_uid,
                description=f"Default {dept_name} department"
            )
            await dept_service.create(dept_create, session=session, commit=False)

    async def _calculate_configuration_completeness(self, laboratory_uid: str) -> float:
        """Calculate how complete the laboratory configuration is"""
        laboratory = await self.get(uid=laboratory_uid, related=["settings"])
        
        total_items = 6  # Total configuration items to check
        completed_items = 0
        
        # Check if basic info is complete
        if laboratory.name and laboratory.organization_uid:
            completed_items += 1
        
        # Check if manager is assigned
        if laboratory.lab_manager_uid:
            completed_items += 1
        
        # Check if contact info is complete
        if laboratory.email and laboratory.mobile_phone:
            completed_items += 1
        
        # Check if location is set
        if laboratory.address:
            completed_items += 1
        
        # Check if settings exist
        if laboratory.settings:
            completed_items += 1
        
        # Check if departments exist
        dept_service = DepartmentService()
        departments = await dept_service.get_all(laboratory_uid=laboratory_uid)
        if departments:
            completed_items += 1
        
        return (completed_items / total_items) * 100

    async def _calculate_compliance_score(self, laboratory_uid: str) -> float:
        """Calculate laboratory compliance score"""
        compliance = await self.check_laboratory_compliance(laboratory_uid)
        return compliance.overall_score

    async def _create_audit_entry(
        self,
        action: str,
        target_uid: str,
        details: Dict,
        session=None
    ):
        """Create audit log entry"""
        current_user = get_current_user()
        
        audit_entry = {
            "action": action,
            "target_uid": target_uid,
            "performed_by": current_user.uid if current_user else None,
            "details": details,
            "timestamp": datetime.utcnow(),
            "ip_address": getattr(current_user, 'ip_address', None) if current_user else None
        }
        
        # Store in internal audit events list (in real implementation, this would go to audit table)
        self._audit_events.append(audit_entry)

    # Legacy compatibility methods

    async def create_laboratory(self, laboratory_data) -> Laboratory:
        """Legacy create method for backward compatibility"""
        return await super().create(laboratory_data)

    async def get_laboratories_by_organization(self, organization_uid: str) -> List[Laboratory]:
        """Get all laboratories for an organization"""
        return await self.repository.get_laboratories_by_organization(organization_uid)

    async def search_laboratories(
        self, text: str, organization_uid: str = None, limit: int = 10
    ) -> List[Laboratory]:
        """Search laboratories by text"""
        return await self.repository.search_laboratories(text, organization_uid, limit)

    async def get_laboratory_by_name(self, name: str, organization_uid: str = None) -> Laboratory | None:
        """Get laboratory by name"""
        return await self.repository.get_laboratory_by_name(name, organization_uid)


# Keep existing services for backward compatibility
class OrganizationService(BaseService[Organization, "OrganizationCreate", "OrganizationUpdate"]):
    def __init__(self):
        super().__init__(OrganizationRepository())

    async def get_by_setup_name(self, keyword="felicity") -> Organization:
        return await self.get(setup_name=keyword)


class LaboratorySettingService(BaseService["LaboratorySetting", "LaboratorySettingCreate", "LaboratorySettingUpdate"]):
    def __init__(self):
        super().__init__(LaboratorySettingRepository())


class DepartmentService(BaseService["Department", "DepartmentCreate", "DepartmentUpdate"]):
    def __init__(self):
        super().__init__(DepartmentRepository())


class OrganizationSettingService(BaseService["OrganizationSetting", "OrganizationSettingCreate", "OrganizationSettingUpdate"]):
    def __init__(self):
        super().__init__(OrganizationSettingRepository())