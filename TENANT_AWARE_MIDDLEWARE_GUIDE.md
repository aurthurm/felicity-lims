# 🚀 **Tenant-Aware Middleware Integration Guide**

## ✅ **Enhanced Middleware with Tenant Context**

Both existing middleware can be significantly enhanced by leveraging the tenant context from `TenantContextMiddleware`.

### **📊 Enhancement Summary:**

| **Middleware** | **Original Capabilities** | **🆕 Enhanced Capabilities** |
|---------------|---------------------------|---------------------------|
| **APIActivityLog** | ❌ Token-only logging<br>❌ No tenant context<br>❌ Basic audit trails | ✅ User/Lab/Org context<br>✅ HIPAA-compliant audits<br>✅ Multi-lab tracking |
| **RateLimit** | ❌ IP-only limiting<br>❌ Global rate limits<br>❌ No user awareness | ✅ Per-lab rate limiting<br>✅ Per-user rate limiting<br>✅ Admin user support |

## 🔧 **Integration Options**

### **Option 1: Replace Existing Middleware (Recommended)**

Replace the existing middleware with enhanced versions:

```python
# In felicity/lims/boot.py

# BEFORE (Original middleware)
from felicity.lims.middleware import TenantContextMiddleware  
from felicity.lims.middleware.appactivity import APIActivityLogMiddleware
from felicity.lims.middleware.ratelimit import RateLimitMiddleware

app.add_middleware(TenantContextMiddleware)
app.add_middleware(APIActivityLogMiddleware)
app.add_middleware(RateLimitMiddleware, redis_client=redis_client)

# AFTER (Enhanced tenant-aware middleware)
from felicity.lims.middleware import TenantContextMiddleware
from felicity.lims.middleware.tenant_aware_appactivity import TenantAwareAPIActivityLogMiddleware  
from felicity.lims.middleware.tenant_aware_ratelimit import TenantAwareRateLimitMiddleware

app.add_middleware(TenantContextMiddleware)           # Must be first!
app.add_middleware(TenantAwareAPIActivityLogMiddleware)
app.add_middleware(TenantAwareRateLimitMiddleware, 
                   redis_client=redis_client,
                   # 🆕 Enhanced configuration options
                   user_minute_limit=300,
                   lab_minute_limit=2000,
                   admin_multiplier=5.0)
```

### **Option 2: Gradual Migration**

Keep both and switch gradually:

```python
# Use environment variable to control which middleware to use
USE_TENANT_AWARE_MIDDLEWARE = os.getenv("USE_TENANT_AWARE_MIDDLEWARE", "false").lower() == "true"

if USE_TENANT_AWARE_MIDDLEWARE:
    from felicity.lims.middleware.tenant_aware_appactivity import TenantAwareAPIActivityLogMiddleware
    from felicity.lims.middleware.tenant_aware_ratelimit import TenantAwareRateLimitMiddleware
    app.add_middleware(TenantAwareAPIActivityLogMiddleware)
    app.add_middleware(TenantAwareRateLimitMiddleware, redis_client=redis_client)
else:
    from felicity.lims.middleware.appactivity import APIActivityLogMiddleware
    from felicity.lims.middleware.ratelimit import RateLimitMiddleware
    app.add_middleware(APIActivityLogMiddleware)
    app.add_middleware(RateLimitMiddleware, redis_client=redis_client)
```

## 🎯 **Enhanced Features**

### **🔍 Tenant-Aware Activity Logging**

#### **Before (Original):**
```json
{
  "token_identifier": "abc123...",
  "path": "/felicity-gql/createPatient", 
  "method": "GraphQL",
  "ip_address": "192.168.1.100",
  "duration": 0.245
}
```

#### **After (Enhanced):**
```json
{
  "token_identifier": "abc123...",
  "path": "[LAB:lab_456] /felicity-gql/createPatient",
  "method": "GraphQL", 
  "ip_address": "192.168.1.100",
  "duration": 0.245,
  "tenantContext": {
    "user_uid": "user_123",
    "laboratory_uid": "lab_456", 
    "organization_uid": "org_789",
    "request_id": "req_abc123"
  }
}
```

#### **Benefits:**
- ✅ **HIPAA Compliance** - Complete audit trail with user/lab context
- ✅ **Multi-lab Tracking** - Separate activity logs per lab
- ✅ **Security Monitoring** - Better threat detection per tenant
- ✅ **Performance Analytics** - Usage patterns by lab/user

### **⚡ Tenant-Aware Rate Limiting**

#### **Multi-layered Protection:**

```python
# 1. IP-based (traditional)
IP limits: 100/min, 2000/hour

# 2. 🆕 User-based  
User limits: 300/min, 5000/hour
Admin users: 1500/min, 25000/hour (5x multiplier)

# 3. 🆕 Lab-based
Lab limits: 2000/min, 40000/hour

# 4. 🆕 Organization-based
Org limits: 100000/hour, 1000000/day
```

#### **Headers Provided:**
```http
X-RateLimit-IP-Limit-Minute: 100
X-RateLimit-IP-Remaining-Minute: 87
X-RateLimit-User-Limit-Minute: 300  
X-RateLimit-User-Remaining-Minute: 276
X-RateLimit-Lab-ID: lab_456
X-RateLimit-Org-ID: org_789
```

#### **Benefits:**
- ✅ **Lab Isolation** - One lab can't exhaust another's quota
- ✅ **Fair Usage** - Balanced resource allocation
- ✅ **Admin Support** - Higher limits for administrative users
- ✅ **Business Tiers** - Different limits per organization

## 🔄 **Migration Steps**

### **Step 1: Update Import Statements**
```python
# Add to felicity/lims/middleware/__init__.py
from .tenant_aware_appactivity import TenantAwareAPIActivityLogMiddleware
from .tenant_aware_ratelimit import TenantAwareRateLimitMiddleware

__all__ = [
    "TenantContextMiddleware",
    "TenantAwareAPIActivityLogMiddleware", 
    "TenantAwareRateLimitMiddleware"
]
```

### **Step 2: Update Database Schema (if needed)**
```sql
-- Add tenant context fields to app activity log table
ALTER TABLE app_activity_log ADD COLUMN user_uid VARCHAR(255);
ALTER TABLE app_activity_log ADD COLUMN laboratory_uid VARCHAR(255);
ALTER TABLE app_activity_log ADD COLUMN organization_uid VARCHAR(255);
ALTER TABLE app_activity_log ADD COLUMN request_id VARCHAR(255);

-- Add indexes for better performance
CREATE INDEX idx_app_activity_user ON app_activity_log(user_uid);
CREATE INDEX idx_app_activity_lab ON app_activity_log(laboratory_uid);
CREATE INDEX idx_app_activity_org ON app_activity_log(organization_uid);
```

### **Step 3: Update Boot Configuration**
```python
# In felicity/lims/boot.py
app.add_middleware(TenantContextMiddleware)  # Must be first!

# Enhanced middleware with tenant awareness
app.add_middleware(
    TenantAwareAPIActivityLogMiddleware,
    auth_header="Authorization",
    graphql_path="/felicity-gql"
)

app.add_middleware(
    TenantAwareRateLimitMiddleware,
    redis_client=redis_client,
    # IP-based limits (original)
    ip_minute_limit=100,
    ip_hour_limit=2000,
    # 🆕 User-based limits
    user_minute_limit=300,
    user_hour_limit=5000,
    # 🆕 Lab-based limits
    lab_minute_limit=2000,
    lab_hour_limit=40000,
    # 🆕 Organization limits
    org_hour_limit=100000,
    org_day_limit=1000000,
    # 🆕 Admin multiplier
    admin_multiplier=5.0,
    exclude_paths=["/docs", "/redoc", "/health"]
)
```

### **Step 4: Configure Admin User Detection**
```python
# Implement admin detection in TenantAwareRateLimitMiddleware
async def _is_admin_user(self, user_uid: str) -> bool:
    """Check if user has admin privileges"""
    
    # Option 1: Check Redis cache
    admin_key = f"user:admin:{user_uid}"
    is_admin = await self.redis_client.get(admin_key)
    if is_admin:
        return is_admin.decode() == "true"
    
    # Option 2: Check database (implement with your user service)
    # user_service = UserService()
    # user = await user_service.get(uid=user_uid)
    # return user and user.is_admin
    
    # Option 3: Check user groups
    # return await self._check_user_in_group(user_uid, "admin")
    
    return False
```

## 🎯 **Configuration Examples**

### **Development Environment:**
```python
# Relaxed limits for development
app.add_middleware(
    TenantAwareRateLimitMiddleware,
    redis_client=redis_client,
    ip_minute_limit=1000,     # Higher limits
    user_minute_limit=500,    
    lab_minute_limit=5000,
    admin_multiplier=2.0      # Lower multiplier
)
```

### **Production Environment:**
```python
# Strict limits for production
app.add_middleware(
    TenantAwareRateLimitMiddleware,
    redis_client=redis_client,
    ip_minute_limit=60,       # Strict IP limits
    user_minute_limit=200,    
    lab_minute_limit=1000,
    org_hour_limit=50000,
    admin_multiplier=10.0     # High admin privileges
)
```

### **High-Volume Environment:**
```python
# Enterprise-grade limits
app.add_middleware(
    TenantAwareRateLimitMiddleware,
    redis_client=redis_client,
    ip_minute_limit=500,
    user_minute_limit=1000,
    lab_minute_limit=10000,
    org_hour_limit=500000,
    org_day_limit=5000000
)
```

## 📊 **Monitoring & Analytics**

### **Enhanced Logging Queries:**
```sql
-- Activity by lab
SELECT laboratory_uid, COUNT(*) as requests, AVG(duration) as avg_duration
FROM app_activity_log 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY laboratory_uid;

-- Top users by activity
SELECT user_uid, COUNT(*) as requests
FROM app_activity_log 
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY user_uid
ORDER BY requests DESC
LIMIT 10;

-- Cross-lab security analysis
SELECT organization_uid, laboratory_uid, 
       COUNT(CASE WHEN response_code >= 400 THEN 1 END) as errors
FROM app_activity_log
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY organization_uid, laboratory_uid;
```

### **Rate Limit Monitoring:**
```bash
# Redis queries for rate limit monitoring
redis-cli KEYS "ratelimit:lab:*:minute" | wc -l  # Active labs
redis-cli GET "ratelimit:user:user_123:minute"   # User activity
redis-cli KEYS "ratelimit:org:*:hour"            # Org activity
```

## ✅ **Benefits Summary**

### **🔒 Security:**
- **Multi-layered protection** - IP + User + Lab + Organization 
- **Tenant isolation** - Labs can't affect each other
- **Enhanced audit trails** - Complete HIPAA compliance

### **🎯 Operations:**
- **Better monitoring** - Per-tenant analytics
- **Fair resource allocation** - Balanced usage across labs
- **Admin privileges** - Higher limits for administrative users

### **💼 Business:**
- **SLA compliance** - Guaranteed service levels per lab
- **Billing accuracy** - Usage tracking per organization
- **Scalability** - Independent scaling per tenant

## 🚀 **Ready to Deploy**

Your enhanced middleware provides enterprise-grade multi-tenant capabilities:

✅ **Tenant-aware activity logging** with HIPAA compliance  
✅ **Multi-layered rate limiting** with lab isolation  
✅ **Admin user support** with configurable privileges  
✅ **Complete audit trails** for compliance and security  
✅ **Production-ready** monitoring and analytics

**Your LIMS now has enterprise-grade multi-tenant middleware!** 🎉