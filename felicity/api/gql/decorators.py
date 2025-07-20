"""
GraphQL Decorators for Tenant-Aware Operations

These decorators should be added to GraphQL resolvers to enforce
tenant context and authentication requirements.
"""

import functools
import logging
from typing import Callable

from felicity.core.tenant_context import (
    require_lab_context,
    require_user_context,
    get_tenant_context,
)

logger = logging.getLogger(__name__)


def require_authentication(func: Callable) -> Callable:
    """
    Decorator to require user authentication in GraphQL resolvers.
    
    Usage:
    @strawberry.mutation
    @require_authentication
    async def create_sample(self, info: Info, ...):
        # User is guaranteed to be authenticated here
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            user_uid = require_user_context()
            logger.debug(f"Authenticated user {user_uid} accessing {func.__name__}")
            return await func(*args, **kwargs)
        except ValueError as e:
            raise Exception(f"Authentication required: {str(e)}")

    return wrapper


def require_lab_context_gql(func: Callable) -> Callable:
    """
    Decorator to require laboratory context in GraphQL resolvers.
    
    Usage:
    @strawberry.query
    @require_authentication
    @require_lab_context_gql
    async def get_samples(self, info: Info, ...):
        # Lab context is guaranteed to be available here
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            lab_uid = require_lab_context()
            logger.debug(f"Lab context {lab_uid} for {func.__name__}")
            return await func(*args, **kwargs)
        except ValueError as e:
            raise Exception(f"Laboratory context required: {str(e)}. Please select a laboratory.")

    return wrapper


def require_tenant_context(func: Callable) -> Callable:
    """
    Decorator to require both user authentication and lab context.
    
    Usage:
    @strawberry.mutation
    @require_tenant_context
    async def create_sample(self, info: Info, ...):
        # Both user and lab context guaranteed
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            user_uid = require_user_context()
            lab_uid = require_lab_context()
            logger.debug(f"Full tenant context - User: {user_uid}, Lab: {lab_uid} for {func.__name__}")
            return await func(*args, **kwargs)
        except ValueError as e:
            raise Exception(f"Tenant context required: {str(e)}")

    return wrapper


def audit_action(action_name: str):
    """
    Decorator to add custom audit action names to GraphQL operations.
    
    Usage:
    @strawberry.mutation
    @require_tenant_context
    @audit_action("CREATE_PATIENT_VIA_GRAPHQL")
    async def create_patient(self, info: Info, ...):
        # Action name will be logged in audit trail
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            context = get_tenant_context()
            if context:
                logger.info(
                    f"GraphQL Action: {action_name}",
                    extra={
                        "audit_action": action_name,
                        "resolver": func.__name__,
                        "user_uid": context.user_uid,
                        "laboratory_uid": context.laboratory_uid,
                        "request_id": context.request_id,
                    }
                )
            return await func(*args, **kwargs)

        return wrapper

    return decorator


def admin_only(func: Callable) -> Callable:
    """
    Decorator for admin-only operations that can work across labs.
    
    Usage:
    @strawberry.query
    @require_authentication
    @admin_only
    async def get_all_samples_cross_lab(self, info: Info, ...):
        # Admin permissions verified
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        # First require authentication
        user_uid = require_user_context()

        # TODO: Add your admin permission check here
        # For now, just log the admin operation
        context = get_tenant_context()
        logger.warning(
            f"Admin operation {func.__name__} by user {user_uid}",
            extra={
                "audit_action": f"ADMIN_{func.__name__.upper()}",
                "user_uid": user_uid,
                "organization_uid": context.organization_uid if context else None,
            }
        )

        return await func(*args, **kwargs)

    return wrapper


def log_resolver_access(func: Callable) -> Callable:
    """
    Decorator to log all access to GraphQL resolvers with tenant context.
    
    Usage:
    @strawberry.query
    @log_resolver_access
    async def get_samples(self, info: Info, ...):
        # All access will be logged
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        context = get_tenant_context()
        logger.info(
            f"GraphQL Access: {func.__name__}",
            extra={
                "resolver": func.__name__,
                "user_uid": context.user_uid if context else None,
                "laboratory_uid": context.laboratory_uid if context else None,
                "organization_uid": context.organization_uid if context else None,
                "request_id": context.request_id if context else None,
            }
        )
        return await func(*args, **kwargs)

    return wrapper


# Convenience decorators for common patterns
def tenant_query(func: Callable) -> Callable:
    """
    Convenience decorator for tenant-aware queries.
    Combines authentication, lab context, and logging.
    """
    return log_resolver_access(require_tenant_context(func))


def tenant_mutation(action_name: str = None):
    """
    Convenience decorator for tenant-aware mutations.
    Combines authentication, lab context, audit action, and logging.
    """

    def decorator(func: Callable) -> Callable:
        action = action_name or f"GRAPHQL_{func.__name__.upper()}"
        return log_resolver_access(audit_action(action)(require_tenant_context(func)))

    return decorator


def admin_query(func: Callable) -> Callable:
    """
    Convenience decorator for admin queries.
    """
    return log_resolver_access(admin_only(func))


def admin_mutation(action_name: str = None):
    """
    Convenience decorator for admin mutations.
    """

    def decorator(func: Callable) -> Callable:
        action = action_name or f"ADMIN_GRAPHQL_{func.__name__.upper()}"
        return log_resolver_access(audit_action(action)(admin_only(func)))

    return decorator


# Examples of how to use these decorators:
DECORATOR_USAGE_EXAMPLES = """
# Example 1: Simple tenant-aware query
@strawberry.field
@tenant_query
async def samples_all(self, info: Info, limit: int = 20) -> List[SampleType]:
    # Automatically filtered to current lab, user authenticated, logged
    sample_service = TenantAwareService(Sample)
    samples = await sample_service.get_all_lab_scoped()
    return [SampleType.from_entity(s) for s in samples[:limit]]

# Example 2: Tenant-aware mutation with custom audit action
@strawberry.mutation
@tenant_mutation("CREATE_SAMPLE_GRAPHQL")
async def create_sample(self, info: Info, input: CreateSampleInput) -> SampleType:
    # User auth + lab context + custom audit action + logging
    sample_service = TenantAwareService(Sample)
    sample = await sample_service.create_with_audit(**input.__dict__)
    return SampleType.from_entity(sample)

# Example 3: Admin-only cross-lab query
@strawberry.field
@admin_query
async def all_samples_cross_lab(self, info: Info) -> List[SampleType]:
    # Admin permissions + logging, no lab filtering
    sample_service = TenantAwareService(Sample)
    samples = await sample_service.get_all_cross_lab_admin()
    return [SampleType.from_entity(s) for s in samples]

# Example 4: Manual decorator stacking for fine control
@strawberry.mutation
@log_resolver_access
@audit_action("VERIFY_SAMPLE_RESULT")
@require_tenant_context
async def verify_sample(self, info: Info, sample_uid: str) -> SampleType:
    # Full control over decorator order and behavior
    sample_service = TenantAwareService(Sample)
    sample = await sample_service.verify_result(sample_uid)
    return SampleType.from_entity(sample)

# Example 5: Authentication only (no lab context required)
@strawberry.field
@require_authentication
@log_resolver_access
async def user_laboratories(self, info: Info) -> List[LaboratoryType]:
    # User can see which labs they have access to
    user_uid = require_user_context()
    # Return labs user has access to
    pass
"""
