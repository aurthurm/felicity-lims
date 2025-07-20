"""
Tenant Context Management for Multi-Lab LIMS

This module provides tenant-aware context management that tracks:
- Current user
- Current laboratory
- Current organization
- Request context for audit trails
"""

import contextvars
from dataclasses import dataclass
from typing import Optional
from uuid import UUID


@dataclass
class TenantContext:
    """Container for tenant-specific context information"""
    
    user_uid: Optional[str] = None
    organization_uid: Optional[str] = None
    laboratory_uid: Optional[str] = None
    
    # Additional context for audit trails
    request_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    @property
    def is_authenticated(self) -> bool:
        """Check if user is authenticated"""
        return self.user_uid is not None
    
    @property
    def is_lab_context(self) -> bool:
        """Check if laboratory context is set"""
        return self.laboratory_uid is not None
    
    @property
    def is_org_context(self) -> bool:
        """Check if organization context is set"""
        return self.organization_uid is not None
    
    def to_dict(self) -> dict:
        """Convert to dictionary for logging/audit"""
        return {
            "user_uid": self.user_uid,
            "organization_uid": self.organization_uid,
            "laboratory_uid": self.laboratory_uid,
            "request_id": self.request_id,
            "ip_address": self.ip_address,
        }


# Context variable to store tenant context per request
_tenant_context: contextvars.ContextVar[Optional[TenantContext]] = (
    contextvars.ContextVar("tenant_context", default=None)
)


def get_tenant_context() -> Optional[TenantContext]:
    """Get the current tenant context"""
    return _tenant_context.get()


def set_tenant_context(context: TenantContext) -> None:
    """Set the tenant context for the current request"""
    _tenant_context.set(context)


def clear_tenant_context() -> None:
    """Clear the tenant context"""
    _tenant_context.set(None)


def get_current_user_uid() -> Optional[str]:
    """Get current user UID from context"""
    context = get_tenant_context()
    return context.user_uid if context else None


def get_current_lab_uid() -> Optional[str]:
    """Get current laboratory UID from context"""
    context = get_tenant_context()
    return context.laboratory_uid if context else None


def get_current_org_uid() -> Optional[str]:
    """Get current organization UID from context"""
    context = get_tenant_context()
    return context.organization_uid if context else None


def require_lab_context() -> str:
    """Get current lab UID, raise error if not set"""
    lab_uid = get_current_lab_uid()
    if not lab_uid:
        raise ValueError("Laboratory context is required for this operation")
    return lab_uid


def require_user_context() -> str:
    """Get current user UID, raise error if not set"""
    user_uid = get_current_user_uid()
    if not user_uid:
        raise ValueError("User context is required for this operation")
    return user_uid


class TenantContextManager:
    """Context manager for temporary tenant context"""
    
    def __init__(self, context: TenantContext):
        self.context = context
        self.previous_context = None
    
    def __enter__(self):
        self.previous_context = get_tenant_context()
        set_tenant_context(self.context)
        return self.context
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        set_tenant_context(self.previous_context)


def with_tenant_context(user_uid: str, organization_uid: str, laboratory_uid: str):
    """Decorator/context manager for operations requiring specific tenant context"""
    context = TenantContext(
        user_uid=user_uid,
        organization_uid=organization_uid,
        laboratory_uid=laboratory_uid
    )
    return TenantContextManager(context)