"""
Integration Guide for Tenant-Aware GraphQL

This shows how to integrate tenant awareness with your existing GraphQL resolvers
and how to update your current mutations/queries to be tenant-aware.
"""

import strawberry
from typing import List, Optional
from strawberry.types import Info

from felicity.apps.abstract import TenantAwareService
from felicity.core.tenant_context import require_lab_context, require_user_context, get_tenant_context
from felicity.api.deps import get_audit_context


# Step 1: Update your existing GraphQL context to include tenant info
@strawberry.type
class TenantInfo:
    """Add tenant info to your GraphQL context"""
    
    @strawberry.field
    def current_user_uid(self) -> Optional[str]:
        context = get_tenant_context()
        return context.user_uid if context else None
    
    @strawberry.field  
    def current_lab_uid(self) -> Optional[str]:
        context = get_tenant_context()
        return context.laboratory_uid if context else None
    
    @strawberry.field
    def current_org_uid(self) -> Optional[str]:
        context = get_tenant_context()
        return context.organization_uid if context else None


# Step 2: Add tenant validation decorators for GraphQL
def require_lab_context_gql(func):
    """Decorator to require lab context in GraphQL resolvers"""
    async def wrapper(*args, **kwargs):
        lab_uid = require_lab_context()  # Will raise error if no lab context
        return await func(*args, **kwargs)
    return wrapper


def require_auth_gql(func):
    """Decorator to require authentication in GraphQL resolvers"""
    async def wrapper(*args, **kwargs):
        user_uid = require_user_context()  # Will raise error if no user context
        return await func(*args, **kwargs)
    return wrapper


# Step 3: Example of updating existing sample mutations
@strawberry.type
class SampleMutations:
    """Updated sample mutations with tenant awareness"""
    
    @strawberry.mutation
    @require_auth_gql
    @require_lab_context_gql
    async def create_sample(
        self,
        info: Info,
        analysis_request_uid: str,
        sample_type_uid: str,
        profiles: Optional[List[str]] = None,
        analyses: Optional[List[str]] = None
    ) -> "SampleType":
        """Create sample - now tenant-aware"""
        
        from felicity.apps.analysis.services import SampleService
        
        # Convert to tenant-aware service
        sample_service = TenantAwareService(Sample)
        
        # All the lab filtering and context injection happens automatically
        sample = await sample_service.create_with_audit(
            audit_action="CREATE_SAMPLE_GRAPHQL",
            analysis_request_uid=analysis_request_uid,
            sample_type_uid=sample_type_uid,
            status="received",  # Default status
            # laboratory_uid automatically injected
            # created_by_uid automatically injected
        )
        
        # Handle profiles and analyses associations
        if profiles:
            # This would also be tenant-aware
            await self._assign_profiles(sample, profiles)
        
        if analyses:
            # This would also be tenant-aware  
            await self._assign_analyses(sample, analyses)
        
        return SampleType.from_entity(sample)
    
    @strawberry.mutation
    @require_auth_gql
    @require_lab_context_gql
    async def update_sample_status(
        self,
        info: Info,
        sample_uid: str,
        status: str
    ) -> "SampleType":
        """Update sample status - now tenant-aware"""
        
        sample_service = TenantAwareService(Sample)
        
        # Automatically filtered to current lab
        updated_sample = await sample_service.update_with_audit(
            sample_uid,
            audit_action=f"UPDATE_SAMPLE_STATUS_{status.upper()}",
            status=status
            # updated_by_uid automatically injected
        )
        
        return SampleType.from_entity(updated_sample)
    
    @strawberry.mutation
    @require_auth_gql 
    @require_lab_context_gql
    async def verify_sample(
        self,
        info: Info,
        sample_uid: str
    ) -> "SampleType":
        """Verify sample - now tenant-aware"""
        
        sample_service = TenantAwareService(Sample)
        
        # Use the specialized verify method with audit
        verified_sample = await sample_service.verify_result(
            sample_uid,
            status="verified",
            date_verified=datetime.utcnow()
            # verified_by_uid automatically injected from context
        )
        
        return SampleType.from_entity(verified_sample)


# Step 4: Example of updating existing queries
@strawberry.type  
class SampleQueries:
    """Updated sample queries with tenant awareness"""
    
    @strawberry.field
    @require_auth_gql
    @require_lab_context_gql
    async def samples_all(
        self,
        info: Info,
        page_size: Optional[int] = 20,
        after_cursor: Optional[str] = None,
        before_cursor: Optional[str] = None,
        text: Optional[str] = None,
        sort_by: Optional[List[str]] = None
    ) -> "SampleCursorPage":
        """Get all samples - now tenant-aware"""
        
        sample_service = TenantAwareService(Sample)
        
        filters = {}
        if text:
            filters = {"sample_id__ilike": f"%{text}%"}
        
        # Automatically filtered to current lab
        page_cursor = await sample_service.paginate_lab_scoped(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by or ["created_at"]
        )
        
        return SampleCursorPage.from_page_cursor(page_cursor)
    
    @strawberry.field
    @require_auth_gql
    @require_lab_context_gql
    async def sample_by_uid(
        self,
        info: Info,
        uid: str
    ) -> Optional["SampleType"]:
        """Get sample by UID - now tenant-aware"""
        
        sample_service = TenantAwareService(Sample)
        
        # Automatically filtered to current lab
        sample = await sample_service.get_lab_scoped(
            uid=uid,
            related=["analysis_request", "sample_type", "profiles", "analyses"]
        )
        
        return SampleType.from_entity(sample) if sample else None
    
    @strawberry.field
    @require_auth_gql
    @require_lab_context_gql
    async def samples_by_status(
        self,
        info: Info,
        status: str,
        limit: Optional[int] = 50
    ) -> List["SampleType"]:
        """Get samples by status - now tenant-aware"""
        
        sample_service = TenantAwareService(Sample)
        
        # Automatically filtered to current lab
        samples = await sample_service.filter_lab_scoped(
            {"status": status},
            limit=limit
        )
        
        return [SampleType.from_entity(s) for s in samples]


# Step 5: Example of admin queries that work across labs
@strawberry.type
class AdminQueries:
    """Admin queries that bypass lab filtering"""
    
    @strawberry.field
    async def all_samples_cross_lab(
        self,
        info: Info,
        organization_uid: Optional[str] = None
    ) -> List["SampleType"]:
        """Get all samples across labs (admin only)"""
        
        # Check if user has admin permissions
        user_uid = require_user_context()
        # Add your admin permission check here
        
        sample_service = TenantAwareService(Sample)
        
        # Cross-lab operation
        samples = await sample_service.get_all_cross_lab_admin()
        
        return [SampleType.from_entity(s) for s in samples]


# Step 6: Example of how to handle lab switching
@strawberry.type
class LabSwitchingMutations:
    """Handle lab context switching"""
    
    @strawberry.mutation
    @require_auth_gql
    async def switch_laboratory(
        self,
        info: Info,
        laboratory_uid: str
    ) -> "TenantInfo":
        """Switch current laboratory context"""
        
        from felicity.apps.user.services import UserService
        from felicity.apps.setup.services import LaboratoryService
        
        user_uid = require_user_context()
        
        # Verify user has access to this lab
        user_service = UserService()
        lab_service = LaboratoryService()
        
        # Check if user has role in target lab
        user_lab_roles = await user_service.get_user_lab_roles(user_uid)
        has_access = any(role.laboratory_uid == laboratory_uid for role in user_lab_roles)
        
        if not has_access:
            raise ValueError("User does not have access to this laboratory")
        
        # Lab switching would typically be handled by updating JWT token
        # or by setting a header that the middleware picks up
        # This is more of a frontend concern
        
        return TenantInfo()


# Step 7: Integration with existing schema
def integrate_tenant_awareness():
    """
    Example of how to integrate tenant awareness into existing schema
    """
    
    # 1. Add middleware to your FastAPI app
    """
    from felicity.api.middleware.tenant import TenantContextMiddleware
    
    app.add_middleware(TenantContextMiddleware)
    """
    
    # 2. Update your existing resolvers
    """
    # Before (existing code):
    @strawberry.mutation
    async def create_sample(self, info: Info, **kwargs):
        sample_service = SampleService()
        return await sample_service.create(**kwargs)
    
    # After (tenant-aware):
    @strawberry.mutation 
    @require_auth_gql
    @require_lab_context_gql
    async def create_sample(self, info: Info, **kwargs):
        sample_service = TenantAwareService(Sample)  # Use tenant-aware service
        return await sample_service.create_with_audit(**kwargs)  # Auto audit trail
    """
    
    # 3. Update your services
    """
    # Before:
    class SampleService(BaseService[Sample]):
        pass
    
    # After:
    class SampleService(TenantAwareService[Sample]):
        pass
    """
    
    # 4. Add tenant info to your GraphQL types
    """
    @strawberry.type
    class SampleType:
        uid: str
        sample_id: str
        laboratory_uid: str  # Add this to show which lab owns the sample
        created_by_uid: str  # Add this to show who created it
        
        @strawberry.field
        def laboratory(self) -> LaboratoryType:
            # Show lab information
            pass
            
        @strawberry.field  
        def created_by(self) -> UserType:
            # Show who created this sample
            pass
    """


# Step 8: Error handling for tenant context
@strawberry.type
class TenantErrors:
    """Custom errors for tenant operations"""
    
    @staticmethod
    def no_lab_context():
        return "Laboratory context required. Please select a laboratory."
    
    @staticmethod  
    def no_user_context():
        return "Authentication required."
    
    @staticmethod
    def lab_access_denied(lab_uid: str):
        return f"Access denied to laboratory {lab_uid}"
    
    @staticmethod
    def cross_lab_admin_required():
        return "Administrator privileges required for cross-laboratory operations."


# Example of complete updated mutation class
@strawberry.type
class Mutation:
    """Complete mutation class with tenant awareness"""
    
    # Sample mutations
    create_sample: "SampleType" = strawberry.field(resolver=SampleMutations.create_sample)
    update_sample_status: "SampleType" = strawberry.field(resolver=SampleMutations.update_sample_status)
    verify_sample: "SampleType" = strawberry.field(resolver=SampleMutations.verify_sample)
    
    # Lab switching
    switch_laboratory: TenantInfo = strawberry.field(resolver=LabSwitchingMutations.switch_laboratory)


@strawberry.type
class Query:
    """Complete query class with tenant awareness"""
    
    # Tenant info
    tenant_info: TenantInfo = strawberry.field(resolver=lambda: TenantInfo())
    
    # Sample queries  
    samples_all: "SampleCursorPage" = strawberry.field(resolver=SampleQueries.samples_all)
    sample_by_uid: Optional["SampleType"] = strawberry.field(resolver=SampleQueries.sample_by_uid)
    samples_by_status: List["SampleType"] = strawberry.field(resolver=SampleQueries.samples_by_status)
    
    # Admin queries
    all_samples_cross_lab: List["SampleType"] = strawberry.field(resolver=AdminQueries.all_samples_cross_lab)


# Frontend integration example
FRONTEND_INTEGRATION_NOTES = """
Frontend Integration Notes:

1. Include lab context in requests:
   - Add X-Laboratory-ID header for lab switching
   - Store current lab in client state
   - Show lab selector in UI

2. Handle tenant errors gracefully:
   - Catch "Laboratory context required" errors
   - Prompt user to select lab
   - Show appropriate error messages

3. Display tenant context in UI:
   - Show current lab name in header/navigation
   - Show user's role in current lab
   - Allow lab switching for multi-lab users

4. Query examples with tenant awareness:
   ```javascript
   // All queries automatically filtered to current lab
   const GET_SAMPLES = gql`
     query GetSamples {
       samplesAll {
         items {
           uid
           sampleId
           laboratoryUid  // Shows which lab owns this
           status
         }
       }
     }
   `;
   
   // Headers to include
   const headers = {
     'Authorization': `Bearer ${token}`,
     'X-Laboratory-ID': currentLabId
   };
   ```
"""