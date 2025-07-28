from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set, Tuple

from felicity.apps.abstract.service import BaseService
from felicity.apps.common.utils import is_valid_email
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.exceptions import AlreadyExistsError, ValidationError
from felicity.apps.user.entities import Group, Permission, User, UserPreference, user_groups, permission_groups, laboratory_user
from felicity.apps.user.repository import (
    GroupRepository,
    PermissionRepository,
    UserPreferenceRepository,
    UserRepository,
)
from felicity.apps.user.schemas import (
    GroupCreate,
    GroupUpdate,
    PermissionCreate,
    PermissionUpdate,
    UserCreate,
    UserPreferenceCreate,
    UserPreferenceUpdate,
    UserUpdate,
)
from felicity.core.config import settings
from felicity.core.security import get_password_hash, password_check, verify_password
from felicity.core.tenant_context import get_current_laboratory_uid, get_current_user


class EnhancedUserService(BaseService[User, UserCreate, UserUpdate]):
    """Enhanced User Service with comprehensive multi-tenant user management capabilities"""
    
    def __init__(self) -> None:
        super().__init__(UserRepository())
        self._audit_events = []

    # Core User Management Extensions

    async def create_with_laboratories(
        self,
        user_data: UserCreate,
        laboratory_uids: List[str],
        laboratory_roles: Optional[Dict[str, str]] = None,
        set_active_laboratory: bool = True,
        send_welcome_email: bool = True,
        created_by: Optional[str] = None
    ) -> User:
        """
        Create user with multiple laboratory assignments in a single transaction
        
        Args:
            user_data: Basic user creation data
            laboratory_uids: List of laboratory UIDs to assign user to
            laboratory_roles: Optional mapping of laboratory_uid -> role
            set_active_laboratory: Whether to set first lab as active
            send_welcome_email: Whether to send welcome email
            created_by: UID of user creating this user (for audit)
        
        Returns:
            Created user with laboratory assignments
        """
        if not laboratory_uids:
            raise ValidationError("User must be assigned to at least one laboratory")
        
        # Validate laboratories exist and are accessible
        from felicity.apps.setup.services import LaboratoryService
        lab_service = LaboratoryService()
        laboratories = await lab_service.get_by_uids(laboratory_uids)
        
        if len(laboratories) != len(laboratory_uids):
            raise ValidationError("One or more laboratories not found or not accessible")
        
        async with self.transaction() as session:
            # Validate username and email uniqueness
            existing_user = await self.get_by_username(user_data.user_name)
            if existing_user:
                raise AlreadyExistsError(f"Username '{user_data.user_name}' already exists")
            
            existing_email = await self.get_by_email(user_data.email)
            if existing_email:
                raise AlreadyExistsError(f"Email '{user_data.email}' already exists")
            
            # Validate password policy
            policy = password_check(user_data.password, user_data.user_name)
            if not policy["password_ok"]:
                raise ValidationError(policy["message"])
            
            # Prepare user data
            user_dict = self._import(user_data)
            hashed_password = get_password_hash(user_data.password)
            del user_dict["password"]
            user_dict["hashed_password"] = hashed_password
            
            # Set active laboratory if requested
            if set_active_laboratory and laboratory_uids:
                user_dict["active_laboratory_uid"] = laboratory_uids[0]
            
            # Create user
            user = await super().create(user_dict, session=session, commit=False)
            
            # Create laboratory assignments
            assignments = []
            for lab_uid in laboratory_uids:
                assignment = {
                    "user_uid": user.uid,
                    "laboratory_uid": lab_uid,
                    "assigned_at": datetime.utcnow(),
                    "assigned_by_uid": created_by,
                    "role_in_laboratory": laboratory_roles.get(lab_uid, "user") if laboratory_roles else "user"
                }
                assignments.append(assignment)
            
            await self.repository.table_insert(
                table=laboratory_user,
                mappings=assignments,
                session=session,
                commit=False
            )
            
            # Create audit entry
            await self._create_audit_entry(
                action="user_created",
                target_uid=user.uid,
                details={
                    "laboratory_uids": laboratory_uids,
                    "laboratory_roles": laboratory_roles,
                    "created_by": created_by
                },
                session=session
            )
            
            await session.commit()
        
        # Send welcome email if requested
        if send_welcome_email:
            await self._send_welcome_email(user, laboratories)
        
        return await self.get(uid=user.uid, related=["laboratories", "active_laboratory"])

    async def assign_to_laboratories(
        self,
        user_uid: str,
        laboratory_uids: List[str],
        laboratory_roles: Optional[Dict[str, str]] = None,
        replace_existing: bool = False,
        set_active_if_none: bool = True,
        assigned_by: Optional[str] = None
    ) -> User:
        """
        Assign user to multiple laboratories with comprehensive validation
        
        Args:
            user_uid: User to assign
            laboratory_uids: Laboratories to assign to
            laboratory_roles: Optional role mappings
            replace_existing: Whether to replace all existing assignments
            set_active_if_none: Set first lab as active if user has no active lab
            assigned_by: UID of user making the assignment
        """
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        # Validate laboratories
        from felicity.apps.setup.services import LaboratoryService
        lab_service = LaboratoryService()
        laboratories = await lab_service.get_by_uids(laboratory_uids)
        
        if len(laboratories) != len(laboratory_uids):
            raise ValidationError("One or more laboratories not found")
        
        async with self.transaction() as session:
            existing_assignments = []
            
            if replace_existing:
                # Get existing assignments for audit
                existing_assignments = await self.repository.table_query(
                    table=laboratory_user,
                    user_uid=user_uid,
                    session=session
                )
                
                # Remove all existing assignments
                await self.repository.table_delete(
                    table=laboratory_user,
                    session=session,
                    user_uid=user_uid
                )
            
            # Create new assignments
            assignments = []
            for lab_uid in laboratory_uids:
                # Check if assignment already exists (if not replacing)
                if not replace_existing:
                    existing = await self.repository.table_query(
                        table=laboratory_user,
                        user_uid=user_uid,
                        laboratory_uid=lab_uid,
                        session=session
                    )
                    if existing:
                        continue  # Skip existing assignments
                
                assignment = {
                    "user_uid": user_uid,
                    "laboratory_uid": lab_uid,
                    "assigned_at": datetime.utcnow(),
                    "assigned_by_uid": assigned_by,
                    "role_in_laboratory": laboratory_roles.get(lab_uid, "user") if laboratory_roles else "user"
                }
                assignments.append(assignment)
            
            if assignments:
                await self.repository.table_insert(
                    table=laboratory_user,
                    mappings=assignments,
                    session=session,
                    commit=False
                )
            
            # Set active laboratory if needed
            if set_active_if_none and not user.active_laboratory_uid and laboratory_uids:
                await self.update(
                    user_uid,
                    {"active_laboratory_uid": laboratory_uids[0]},
                    session=session,
                    commit=False
                )
            
            # Create audit entry
            await self._create_audit_entry(
                action="laboratories_assigned",
                target_uid=user_uid,
                details={
                    "assigned_laboratories": laboratory_uids,
                    "laboratory_roles": laboratory_roles,
                    "replace_existing": replace_existing,
                    "assigned_by": assigned_by,
                    "previous_assignments": [a["laboratory_uid"] for a in existing_assignments] if replace_existing else None
                },
                session=session
            )
            
            await session.commit()
        
        return await self.get(uid=user_uid, related=["laboratories", "active_laboratory"])

    async def remove_from_laboratories(
        self,
        user_uid: str,
        laboratory_uids: List[str],
        reassign_active: bool = True,
        removed_by: Optional[str] = None
    ) -> User:
        """Remove user from multiple laboratories with proper cleanup"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        async with self.transaction() as session:
            # Get current assignments for audit
            current_assignments = await self.repository.table_query(
                table=laboratory_user,
                user_uid=user_uid,
                session=session
            )
            
            # Remove assignments
            for lab_uid in laboratory_uids:
                await self.repository.table_delete(
                    table=laboratory_user,
                    session=session,
                    user_uid=user_uid,
                    laboratory_uid=lab_uid
                )
            
            # Handle active laboratory reassignment
            if reassign_active and user.active_laboratory_uid in laboratory_uids:
                remaining_labs = await self.repository.table_query(
                    table=laboratory_user,
                    user_uid=user_uid,
                    session=session
                )
                
                new_active = remaining_labs[0]["laboratory_uid"] if remaining_labs else None
                await self.update(
                    user_uid,
                    {"active_laboratory_uid": new_active},
                    session=session,
                    commit=False
                )
            
            # Remove user from laboratory-specific groups
            await self._cleanup_laboratory_groups(user_uid, laboratory_uids, session)
            
            # Create audit entry
            await self._create_audit_entry(
                action="laboratories_removed",
                target_uid=user_uid,
                details={
                    "removed_laboratories": laboratory_uids,
                    "removed_by": removed_by,
                    "previous_active": user.active_laboratory_uid,
                    "new_active": new_active if 'new_active' in locals() else user.active_laboratory_uid
                },
                session=session
            )
            
            await session.commit()
        
        return await self.get(uid=user_uid, related=["laboratories", "active_laboratory"])

    async def switch_active_laboratory(
        self,
        user_uid: str,
        laboratory_uid: str,
        validate_access: bool = True
    ) -> User:
        """Switch user's active laboratory with comprehensive validation"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        if validate_access:
            # Verify user has access to laboratory
            user_labs = await self.get_user_laboratories(user_uid)
            lab_uids = [lab.uid for lab in user_labs]
            
            if laboratory_uid not in lab_uids:
                raise ValidationError("User does not have access to laboratory")
        
        # Update active laboratory
        updated_user = await self.update(
            user_uid,
            {"active_laboratory_uid": laboratory_uid},
            related=["active_laboratory", "laboratories"]
        )
        
        # Create audit entry
        await self._create_audit_entry(
            action="active_laboratory_switched",
            target_uid=user_uid,
            details={
                "previous_active": user.active_laboratory_uid,
                "new_active": laboratory_uid
            }
        )
        
        return updated_user

    # Multi-Tenant Operations

    async def get_user_laboratories(self, user_uid: str) -> List:
        """Get all laboratories assigned to user with detailed information"""
        from felicity.apps.setup.services import LaboratoryService
        
        assignments = await self.repository.table_query(
            table=laboratory_user,
            user_uid=user_uid
        )
        
        if not assignments:
            return []
        
        lab_uids = [assignment["laboratory_uid"] for assignment in assignments]
        laboratories = await LaboratoryService().get_by_uids(lab_uids)
        
        # Enrich with assignment details
        assignment_map = {a["laboratory_uid"]: a for a in assignments}
        for lab in laboratories:
            assignment = assignment_map.get(lab.uid, {})
            lab.assignment_details = {
                "assigned_at": assignment.get("assigned_at"),
                "assigned_by_uid": assignment.get("assigned_by_uid"),
                "role_in_laboratory": assignment.get("role_in_laboratory", "user")
            }
        
        return laboratories

    async def get_laboratory_users(
        self,
        laboratory_uid: str,
        include_inactive: bool = False,
        role_filter: Optional[str] = None
    ) -> List[User]:
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
        
        user_uids = [assignment["user_uid"] for assignment in assignments]
        users = await self.get_by_uids(user_uids)
        
        if not include_inactive:
            users = [user for user in users if user.is_active and not user.is_blocked]
        
        # Enrich with assignment details
        assignment_map = {a["user_uid"]: a for a in assignments}
        for user in users:
            assignment = assignment_map.get(user.uid, {})
            user.laboratory_assignment = {
                "assigned_at": assignment.get("assigned_at"),
                "assigned_by_uid": assignment.get("assigned_by_uid"),
                "role_in_laboratory": assignment.get("role_in_laboratory", "user")
            }
        
        return users

    async def bulk_assign_users(
        self,
        user_uids: List[str],
        laboratory_uid: str,
        role: str = "user",
        assigned_by: Optional[str] = None
    ) -> Dict[str, bool]:
        """Bulk assign multiple users to laboratory"""
        results = {}
        
        # Validate laboratory exists
        from felicity.apps.setup.services import LaboratoryService
        laboratory = await LaboratoryService().get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        async with self.transaction() as session:
            assignments = []
            
            for user_uid in user_uids:
                try:
                    # Check if user exists and is active
                    user = await self.get(uid=user_uid)
                    if not user or not user.is_active:
                        results[user_uid] = False
                        continue
                    
                    # Check if assignment already exists
                    existing = await self.repository.table_query(
                        table=laboratory_user,
                        user_uid=user_uid,
                        laboratory_uid=laboratory_uid,
                        session=session
                    )
                    
                    if existing:
                        results[user_uid] = True  # Already assigned
                        continue
                    
                    assignment = {
                        "user_uid": user_uid,
                        "laboratory_uid": laboratory_uid,
                        "assigned_at": datetime.utcnow(),
                        "assigned_by_uid": assigned_by,
                        "role_in_laboratory": role
                    }
                    assignments.append(assignment)
                    results[user_uid] = True
                    
                except Exception:
                    results[user_uid] = False
            
            if assignments:
                await self.repository.table_insert(
                    table=laboratory_user,
                    mappings=assignments,
                    session=session,
                    commit=False
                )
            
            # Create audit entry
            successful_assignments = [uid for uid, success in results.items() if success]
            if successful_assignments:
                await self._create_audit_entry(
                    action="bulk_users_assigned",
                    target_uid=laboratory_uid,
                    details={
                        "assigned_users": successful_assignments,
                        "role": role,
                        "assigned_by": assigned_by,
                        "total_attempted": len(user_uids),
                        "total_successful": len(successful_assignments)
                    },
                    session=session
                )
            
            await session.commit()
        
        return results

    # Advanced Permission Management

    async def get_user_permissions_by_laboratory(
        self,
        user_uid: str,
        laboratory_uid: Optional[str] = None
    ) -> Dict[str, List[Permission]]:
        """Get user permissions organized by laboratory context"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        # Check if user is global admin
        is_global = user.user_name in [
            settings.SYSTEM_DAEMON_USERNAME,
            settings.FIRST_SUPERUSER_USERNAME
        ] or user.is_superuser
        
        permissions_by_lab = {}
        
        if is_global:
            # Global permissions (apply to all laboratories)
            global_permissions = await self._get_permissions_for_context(user_uid, None)
            permissions_by_lab["global"] = global_permissions
        else:
            # Get permissions for each laboratory the user has access to
            user_laboratories = await self.get_user_laboratories(user_uid)
            
            for lab in user_laboratories:
                lab_permissions = await self._get_permissions_for_context(user_uid, lab.uid)
                permissions_by_lab[lab.uid] = lab_permissions
        
        return permissions_by_lab

    async def _get_permissions_for_context(
        self,
        user_uid: str,
        laboratory_uid: Optional[str]
    ) -> List[Permission]:
        """Get permissions for specific laboratory context"""
        user_groups_uid = await self.repository.table_query(
            user_groups,
            ["group_uid"],
            user_uid=user_uid,
            laboratory_uid=laboratory_uid
        )
        
        permissions_uid = set()
        for group_uid in user_groups_uid:
            group_permissions = await self.repository.table_query(
                permission_groups,
                ["permission_uid"],
                group_uid=group_uid,
                laboratory_uid=laboratory_uid
            )
            for permission_uid in group_permissions:
                permissions_uid.add(permission_uid)
        
        return await PermissionService().get_by_uids(list(permissions_uid))

    async def validate_user_permission(
        self,
        user_uid: str,
        action: str,
        target: str,
        laboratory_uid: Optional[str] = None
    ) -> bool:
        """Validate if user has specific permission in laboratory context"""
        permissions_by_lab = await self.get_user_permissions_by_laboratory(user_uid, laboratory_uid)
        
        # Check global permissions first
        global_permissions = permissions_by_lab.get("global", [])
        for perm in global_permissions:
            if perm.action == action and perm.target == target:
                return True
        
        # Check laboratory-specific permissions
        if laboratory_uid:
            lab_permissions = permissions_by_lab.get(laboratory_uid, [])
            for perm in lab_permissions:
                if perm.action == action and perm.target == target:
                    return True
        
        return False

    # User Validation and Sanitization

    async def validate_user_data(
        self,
        user_data: Dict,
        laboratory_uids: Optional[List[str]] = None,
        is_update: bool = False,
        existing_user_uid: Optional[str] = None
    ) -> Dict[str, List[str]]:
        """Comprehensive user data validation"""
        errors = {}
        
        # Username validation
        if "user_name" in user_data:
            username = user_data["user_name"]
            if not username or len(username.strip()) < 3:
                errors.setdefault("user_name", []).append("Username must be at least 3 characters")
            elif not username.replace("_", "").replace("-", "").isalnum():
                errors.setdefault("user_name", []).append("Username can only contain letters, numbers, hyphens, and underscores")
            else:
                # Check uniqueness
                existing = await self.get_by_username(username)
                if existing and (not is_update or existing.uid != existing_user_uid):
                    errors.setdefault("user_name", []).append("Username already exists")
        
        # Email validation
        if "email" in user_data:
            email = user_data["email"]
            if not email or not is_valid_email(email):
                errors.setdefault("email", []).append("Invalid email address")
            else:
                # Check uniqueness
                existing = await self.get_by_email(email)
                if existing and (not is_update or existing.uid != existing_user_uid):
                    errors.setdefault("email", []).append("Email already exists")
        
        # Password validation
        if "password" in user_data and user_data["password"]:
            password = user_data["password"]
            username = user_data.get("user_name", "")
            policy = password_check(password, username)
            if not policy["password_ok"]:
                errors.setdefault("password", []).append(policy["message"])
        
        # Name validation
        for field in ["first_name", "last_name"]:
            if field in user_data:
                name = user_data[field]
                if not name or len(name.strip()) < 2:
                    errors.setdefault(field, []).append(f"{field.replace('_', ' ').title()} must be at least 2 characters")
                elif not name.replace(" ", "").replace("-", "").replace("'", "").isalpha():
                    errors.setdefault(field, []).append(f"{field.replace('_', ' ').title()} can only contain letters, spaces, hyphens, and apostrophes")
        
        # Laboratory validation
        if laboratory_uids:
            from felicity.apps.setup.services import LaboratoryService
            try:
                laboratories = await LaboratoryService().get_by_uids(laboratory_uids)
                if len(laboratories) != len(laboratory_uids):
                    errors.setdefault("laboratories", []).append("One or more laboratories not found")
            except Exception:
                errors.setdefault("laboratories", []).append("Error validating laboratories")
        
        return errors

    async def sanitize_user_data(self, user_data: Dict) -> Dict:
        """Sanitize user input data"""
        sanitized = {}
        
        for key, value in user_data.items():
            if isinstance(value, str):
                # Trim whitespace
                value = value.strip()
                
                # Sanitize names
                if key in ["first_name", "last_name"]:
                    value = " ".join(word.capitalize() for word in value.split())
                
                # Sanitize username
                elif key == "user_name":
                    value = value.lower()
                
                # Sanitize email
                elif key == "email":
                    value = value.lower()
            
            sanitized[key] = value
        
        return sanitized

    # Audit and Activity Tracking

    async def _create_audit_entry(
        self,
        action: str,
        target_uid: str,
        details: Dict,
        session=None
    ):
        """Create audit log entry"""
        current_user = get_current_user()
        current_lab = get_current_laboratory_uid()
        
        audit_entry = {
            "action": action,
            "target_uid": target_uid,
            "performed_by": current_user.uid if current_user else None,
            "laboratory_context": current_lab,
            "details": details,
            "timestamp": datetime.utcnow(),
            "ip_address": getattr(current_user, 'ip_address', None) if current_user else None
        }
        
        # Store in audit log (implementation depends on your audit system)
        # For now, we'll add to internal audit events list
        self._audit_events.append(audit_entry)

    async def get_user_audit_trail(
        self,
        user_uid: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict]:
        """Get audit trail for specific user"""
        # This would typically query your audit log table
        # For now, return filtered internal events
        user_events = [
            event for event in self._audit_events
            if event.get("target_uid") == user_uid or event.get("performed_by") == user_uid
        ]
        
        # Sort by timestamp descending
        user_events.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return user_events[offset:offset + limit]

    async def get_user_activity_summary(self, user_uid: str) -> Dict:
        """Get comprehensive activity summary for user"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        laboratories = await self.get_user_laboratories(user_uid)
        permissions = await self.get_user_permissions_by_laboratory(user_uid)
        groups = await self.get_user_groups(user_uid)
        audit_trail = await self.get_user_audit_trail(user_uid, limit=10)
        
        return {
            "user": user,
            "laboratories": laboratories,
            "active_laboratory": user.active_laboratory_uid,
            "total_laboratories": len(laboratories),
            "permissions_by_lab": permissions,
            "groups": groups,
            "total_groups": len(groups),
            "recent_activity": audit_trail,
            "account_status": {
                "is_active": user.is_active,
                "is_blocked": user.is_blocked,
                "is_superuser": user.is_superuser,
                "login_retry_count": user.login_retry,
                "last_login": getattr(user, 'last_login', None)
            }
        }

    # Helper Methods

    async def _cleanup_laboratory_groups(
        self,
        user_uid: str,
        laboratory_uids: List[str],
        session
    ):
        """Remove user from laboratory-specific groups"""
        for lab_uid in laboratory_uids:
            await self.repository.table_delete(
                table=user_groups,
                session=session,
                user_uid=user_uid,
                laboratory_uid=lab_uid
            )

    async def _send_welcome_email(self, user: User, laboratories: List):
        """Send welcome email to new user"""
        # Implementation would depend on your email service
        print(f"Sending welcome email to {user.email} for laboratories: {[lab.name for lab in laboratories]}")

    # Legacy compatibility methods

    async def create(self, user_in: UserCreate, related: list[str] | None = None) -> User:
        """Legacy create method for backward compatibility"""
        return await super().create(user_in, related=related)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return await self.get(email=email)

    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return await self.get(user_name=username)

    async def authenticate(self, username: str, password: str) -> User:
        """Authenticate user with enhanced security"""
        if is_valid_email(username):
            raise Exception("Use your username to authenticate")
        
        user = await self.get_by_username(username)
        if not user:
            raise Exception("Invalid username or password")
        
        return await self.has_access(user, password)

    async def has_access(self, user: User, password: str) -> User:
        """Check if user has access with enhanced security"""
        if user.is_blocked:
            raise Exception("Account blocked: Contact administrator to regain access")

        if not user.is_active:
            raise Exception("Inactive account: Contact administrator")

        if not verify_password(password, user.hashed_password):
            retries = user.login_retry
            if user.login_retry < 3:
                msg = f"Wrong password. {2 - retries} attempts remaining"
                user.login_retry = user.login_retry + 1
                if user.login_retry == 3:
                    user.is_blocked = True
                    msg = "Account has been blocked due to multiple failed login attempts"
                    
                    # Create audit entry for account blocking
                    await self._create_audit_entry(
                        action="account_blocked",
                        target_uid=user.uid,
                        details={"reason": "multiple_failed_login_attempts"}
                    )
            else:
                msg = "Account is blocked"
                
            await self.save(user)
            raise Exception(msg)
        
        # Reset login retry count on successful login
        if user.login_retry != 0:
            user.login_retry = 0
            await self.save(user)
        
        # Create audit entry for successful login
        await self._create_audit_entry(
            action="user_login",
            target_uid=user.uid,
            details={"laboratory_context": user.active_laboratory_uid}
        )
        
        return user