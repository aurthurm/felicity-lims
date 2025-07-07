# HIPAA Compliance Migration Strategy
## From Non-Encrypted to Encrypted Data

**Document Version:** 1.0  
**Date:** 2025-01-27  
**Migration Type:** Production Database Schema and Data Migration  
**Risk Level:** High (Data Transformation)  

---

## Executive Summary

This document outlines the migration strategy for existing Felicity LIMS clients to transition from non-encrypted data storage to HIPAA-compliant encrypted storage. The migration involves schema changes, data encryption, and search index creation while maintaining system availability and data integrity.

---

## Migration Challenges

### Current State
- **Patient data** stored in plaintext (names, contact info, DOB)
- **Analysis results** in plaintext (test outcomes, clinical data)
- **No search indices** for encrypted data
- **Active production systems** requiring minimal downtime

### Target State
- **All PII/PHI encrypted** using AES-256
- **High-performance search indices** for encrypted data
- **Backward compatibility** during transition period
- **Zero data loss** with full audit trail

---

## Migration Strategy Overview

### Phase 1: Preparation (Pre-Migration)
- Database backup and validation
- Schema extension (non-breaking)
- Migration tooling development
- Testing environment setup

### Phase 2: Dual-Column Approach (Transition)
- Add encrypted columns alongside existing ones
- Encrypt and populate new columns
- Create search indices
- Gradual application cutover

### Phase 3: Cleanup (Post-Migration)
- Remove old plaintext columns
- Optimize database performance
- Validate compliance
- Documentation updates

---

## Detailed Migration Plan

### Phase 1: Preparation (Duration: 1-2 weeks)

#### 1.1 Database Backup and Validation
```sql
-- Create comprehensive backup
pg_dump felicity_db > felicity_backup_pre_hipaa_$(date +%Y%m%d).sql

-- Validate data integrity
SELECT 
    'patient' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT uid) as unique_records,
    COUNT(*) - COUNT(first_name) as null_first_names,
    COUNT(*) - COUNT(last_name) as null_last_names
FROM patient
UNION ALL
SELECT 
    'analysis_result' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT uid) as unique_records,
    COUNT(*) - COUNT(result) as null_results,
    0 as null_last_names
FROM analysis_result;
```

#### 1.2 Schema Extension (Non-Breaking Changes)
```sql
-- Add encrypted columns alongside existing ones
-- Patient table extensions
ALTER TABLE patient 
ADD COLUMN first_name_encrypted VARCHAR(1000),
ADD COLUMN middle_name_encrypted VARCHAR(1000),
ADD COLUMN last_name_encrypted VARCHAR(1000),
ADD COLUMN phone_mobile_encrypted VARCHAR(1000),
ADD COLUMN phone_home_encrypted VARCHAR(1000),
ADD COLUMN email_encrypted VARCHAR(1000),
ADD COLUMN date_of_birth_encrypted VARCHAR(1000),
ADD COLUMN migration_status VARCHAR(50) DEFAULT 'pending';

-- Patient identification extensions
ALTER TABLE patient_identification
ADD COLUMN value_encrypted VARCHAR(1000),
ADD COLUMN migration_status VARCHAR(50) DEFAULT 'pending';

-- Analysis result extensions
ALTER TABLE analysis_result
ADD COLUMN result_encrypted VARCHAR(2000),
ADD COLUMN migration_status VARCHAR(50) DEFAULT 'pending';

-- Result mutation extensions
ALTER TABLE result_mutation
ADD COLUMN before_encrypted VARCHAR(2000),
ADD COLUMN after_encrypted VARCHAR(2000),
ADD COLUMN migration_status VARCHAR(50) DEFAULT 'pending';

-- Clinical data extensions
ALTER TABLE clinical_data
ADD COLUMN symptoms_raw_encrypted VARCHAR(4000),
ADD COLUMN clinical_indication_encrypted VARCHAR(4000),
ADD COLUMN vitals_encrypted VARCHAR(2000),
ADD COLUMN treatment_notes_encrypted VARCHAR(4000),
ADD COLUMN other_context_encrypted VARCHAR(4000),
ADD COLUMN migration_status VARCHAR(50) DEFAULT 'pending';

-- Create search index tables
CREATE TABLE patient_search_index (
    uid VARCHAR PRIMARY KEY,
    patient_uid VARCHAR REFERENCES patient(uid),
    field_name VARCHAR NOT NULL,
    search_hash VARCHAR NOT NULL,
    partial_hash_3 VARCHAR,
    partial_hash_4 VARCHAR,
    partial_hash_5 VARCHAR,
    phonetic_hash VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE phone_search_index (
    uid VARCHAR PRIMARY KEY,
    patient_uid VARCHAR REFERENCES patient(uid),
    field_name VARCHAR NOT NULL,
    normalized_hash VARCHAR NOT NULL,
    last_four_hash VARCHAR,
    area_code_hash VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE date_search_index (
    uid VARCHAR PRIMARY KEY,
    patient_uid VARCHAR REFERENCES patient(uid),
    field_name VARCHAR NOT NULL,
    year_hash VARCHAR,
    month_hash VARCHAR,
    day_hash VARCHAR,
    date_hash VARCHAR NOT NULL,
    age_range_hash VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indices for performance
CREATE INDEX idx_patient_field_hash ON patient_search_index(field_name, search_hash);
CREATE INDEX idx_patient_partial_3 ON patient_search_index(field_name, partial_hash_3);
CREATE INDEX idx_patient_partial_4 ON patient_search_index(field_name, partial_hash_4);
CREATE INDEX idx_patient_partial_5 ON patient_search_index(field_name, partial_hash_5);
CREATE INDEX idx_patient_phonetic ON patient_search_index(field_name, phonetic_hash);

CREATE INDEX idx_phone_normalized ON phone_search_index(field_name, normalized_hash);
CREATE INDEX idx_phone_last_four ON phone_search_index(field_name, last_four_hash);
CREATE INDEX idx_phone_area_code ON phone_search_index(field_name, area_code_hash);

CREATE INDEX idx_date_full ON date_search_index(field_name, date_hash);
CREATE INDEX idx_date_year ON date_search_index(field_name, year_hash);
CREATE INDEX idx_date_month ON date_search_index(field_name, month_hash);
CREATE INDEX idx_date_age_range ON date_search_index(field_name, age_range_hash);
```

#### 1.3 Migration Tools Development

Create migration scripts and utilities:

```python
# File: migration/hipaa_migration_tools.py
import asyncio
import logging
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from felicity.apps.patient.entities import Patient
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.utils.encryption import encrypt_pii, encrypt_phi
from felicity.apps.patient.search_service import SearchableEncryptionService

logger = logging.getLogger(__name__)

class HIPAAMigrationService:
    """Service for migrating existing data to HIPAA-compliant encrypted storage."""
    
    def __init__(self):
        self.search_service = SearchableEncryptionService()
        self.batch_size = 100  # Process in batches to avoid memory issues
        
    async def migrate_patients_batch(
        self, 
        session: AsyncSession, 
        offset: int = 0, 
        limit: int = None
    ) -> dict:
        """Migrate a batch of patients to encrypted storage."""
        
        limit = limit or self.batch_size
        
        # Get patients that haven't been migrated yet
        query = """
            SELECT uid, first_name, middle_name, last_name, phone_mobile, 
                   phone_home, email, date_of_birth
            FROM patient 
            WHERE migration_status = 'pending'
            ORDER BY created_at
            OFFSET :offset LIMIT :limit
        """
        
        result = await session.execute(query, {"offset": offset, "limit": limit})
        patients = result.fetchall()
        
        migration_stats = {
            "processed": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }
        
        for patient_row in patients:
            try:
                patient_uid = patient_row.uid
                
                # Encrypt each field
                encrypted_data = {}
                if patient_row.first_name:
                    encrypted_data['first_name_encrypted'] = encrypt_pii(patient_row.first_name)
                if patient_row.middle_name:
                    encrypted_data['middle_name_encrypted'] = encrypt_pii(patient_row.middle_name)
                if patient_row.last_name:
                    encrypted_data['last_name_encrypted'] = encrypt_pii(patient_row.last_name)
                if patient_row.phone_mobile:
                    encrypted_data['phone_mobile_encrypted'] = encrypt_pii(patient_row.phone_mobile)
                if patient_row.phone_home:
                    encrypted_data['phone_home_encrypted'] = encrypt_pii(patient_row.phone_home)
                if patient_row.email:
                    encrypted_data['email_encrypted'] = encrypt_pii(patient_row.email)
                if patient_row.date_of_birth:
                    encrypted_data['date_of_birth_encrypted'] = encrypt_pii(patient_row.date_of_birth.isoformat())
                
                # Update patient with encrypted data
                update_query = """
                    UPDATE patient 
                    SET first_name_encrypted = :first_name_encrypted,
                        middle_name_encrypted = :middle_name_encrypted,
                        last_name_encrypted = :last_name_encrypted,
                        phone_mobile_encrypted = :phone_mobile_encrypted,
                        phone_home_encrypted = :phone_home_encrypted,
                        email_encrypted = :email_encrypted,
                        date_of_birth_encrypted = :date_of_birth_encrypted,
                        migration_status = 'encrypted',
                        updated_at = NOW()
                    WHERE uid = :uid
                """
                
                await session.execute(update_query, {
                    "uid": patient_uid,
                    **encrypted_data
                })
                
                # Create search indices for the patient
                patient_obj = Patient()
                patient_obj.uid = patient_uid
                patient_obj.first_name = patient_row.first_name
                patient_obj.middle_name = patient_row.middle_name
                patient_obj.last_name = patient_row.last_name
                patient_obj.phone_mobile = patient_row.phone_mobile
                patient_obj.phone_home = patient_row.phone_home
                patient_obj.email = patient_row.email
                patient_obj.date_of_birth = patient_row.date_of_birth
                
                await self.search_service.create_patient_indices(patient_obj, session)
                
                migration_stats["successful"] += 1
                logger.info(f"Successfully migrated patient {patient_uid}")
                
            except Exception as e:
                migration_stats["failed"] += 1
                migration_stats["errors"].append(f"Patient {patient_row.uid}: {str(e)}")
                logger.error(f"Failed to migrate patient {patient_row.uid}: {str(e)}")
                
            migration_stats["processed"] += 1
        
        await session.commit()
        return migration_stats
    
    async def migrate_analysis_results_batch(
        self, 
        session: AsyncSession, 
        offset: int = 0, 
        limit: int = None
    ) -> dict:
        """Migrate a batch of analysis results to encrypted storage."""
        
        limit = limit or self.batch_size
        
        query = """
            SELECT uid, result
            FROM analysis_result 
            WHERE migration_status = 'pending' AND result IS NOT NULL
            ORDER BY created_at
            OFFSET :offset LIMIT :limit
        """
        
        result = await session.execute(query, {"offset": offset, "limit": limit})
        results = result.fetchall()
        
        migration_stats = {
            "processed": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }
        
        for result_row in results:
            try:
                result_uid = result_row.uid
                
                # Encrypt result value
                encrypted_result = encrypt_phi(result_row.result)
                
                # Update analysis result with encrypted data
                update_query = """
                    UPDATE analysis_result 
                    SET result_encrypted = :result_encrypted,
                        migration_status = 'encrypted',
                        updated_at = NOW()
                    WHERE uid = :uid
                """
                
                await session.execute(update_query, {
                    "uid": result_uid,
                    "result_encrypted": encrypted_result
                })
                
                migration_stats["successful"] += 1
                logger.info(f"Successfully migrated analysis result {result_uid}")
                
            except Exception as e:
                migration_stats["failed"] += 1
                migration_stats["errors"].append(f"Result {result_row.uid}: {str(e)}")
                logger.error(f"Failed to migrate result {result_row.uid}: {str(e)}")
                
            migration_stats["processed"] += 1
        
        await session.commit()
        return migration_stats
    
    async def get_migration_progress(self, session: AsyncSession) -> dict:
        """Get overall migration progress."""
        
        queries = {
            "patients": "SELECT migration_status, COUNT(*) FROM patient GROUP BY migration_status",
            "results": "SELECT migration_status, COUNT(*) FROM analysis_result GROUP BY migration_status",
            "identifications": "SELECT migration_status, COUNT(*) FROM patient_identification GROUP BY migration_status",
            "mutations": "SELECT migration_status, COUNT(*) FROM result_mutation GROUP BY migration_status",
            "clinical_data": "SELECT migration_status, COUNT(*) FROM clinical_data GROUP BY migration_status"
        }
        
        progress = {}
        
        for table_name, query in queries.items():
            result = await session.execute(query)
            rows = result.fetchall()
            
            progress[table_name] = {
                "pending": 0,
                "encrypted": 0,
                "failed": 0,
                "total": 0
            }
            
            for row in rows:
                status = row[0] or "pending"
                count = row[1]
                progress[table_name][status] = count
                progress[table_name]["total"] += count
        
        return progress
```

### Phase 2: Data Migration (Duration: 2-4 weeks)

#### 2.1 Incremental Migration Script

```python
# File: migration/run_hipaa_migration.py
import asyncio
import sys
from felicity.database.session import async_session
from migration.hipaa_migration_tools import HIPAAMigrationService

async def run_migration():
    """Run the complete HIPAA migration process."""
    
    migration_service = HIPAAMigrationService()
    
    print("Starting HIPAA Data Migration...")
    print("=" * 50)
    
    async with async_session() as session:
        # Get initial progress
        initial_progress = await migration_service.get_migration_progress(session)
        print("Initial Migration Status:")
        for table, stats in initial_progress.items():
            total = stats["total"]
            pending = stats["pending"]
            print(f"  {table}: {pending}/{total} pending migration")
        
        # Migrate patients
        print("\n1. Migrating Patients...")
        patient_offset = 0
        while True:
            stats = await migration_service.migrate_patients_batch(
                session, offset=patient_offset
            )
            
            if stats["processed"] == 0:
                break
                
            patient_offset += stats["processed"]
            print(f"   Processed: {stats['processed']}, "
                  f"Successful: {stats['successful']}, "
                  f"Failed: {stats['failed']}")
            
            if stats["errors"]:
                print(f"   Errors: {stats['errors'][:3]}...")  # Show first 3 errors
        
        # Migrate analysis results
        print("\n2. Migrating Analysis Results...")
        result_offset = 0
        while True:
            stats = await migration_service.migrate_analysis_results_batch(
                session, offset=result_offset
            )
            
            if stats["processed"] == 0:
                break
                
            result_offset += stats["processed"]
            print(f"   Processed: {stats['processed']}, "
                  f"Successful: {stats['successful']}, "
                  f"Failed: {stats['failed']}")
        
        # Get final progress
        final_progress = await migration_service.get_migration_progress(session)
        print("\nFinal Migration Status:")
        for table, stats in final_progress.items():
            total = stats["total"]
            encrypted = stats["encrypted"]
            pending = stats["pending"]
            failed = stats["failed"]
            print(f"  {table}: {encrypted}/{total} encrypted, "
                  f"{pending} pending, {failed} failed")
    
    print("\nMigration completed!")

if __name__ == "__main__":
    asyncio.run(run_migration())
```

#### 2.2 Application Compatibility Layer

Create a compatibility layer that reads from both old and new columns during transition:

```python
# File: felicity/apps/patient/compatibility.py
from typing import Optional
from felicity.utils.encryption import decrypt_pii

class PatientCompatibilityMixin:
    """Mixin to handle reading from both encrypted and non-encrypted columns."""
    
    @property
    def first_name_safe(self) -> Optional[str]:
        """Get first name from encrypted column, fallback to plaintext."""
        if hasattr(self, 'first_name_encrypted') and self.first_name_encrypted:
            return decrypt_pii(self.first_name_encrypted)
        return getattr(self, 'first_name', None)
    
    @property
    def last_name_safe(self) -> Optional[str]:
        """Get last name from encrypted column, fallback to plaintext."""
        if hasattr(self, 'last_name_encrypted') and self.last_name_encrypted:
            return decrypt_pii(self.last_name_encrypted)
        return getattr(self, 'last_name', None)
    
    @property
    def email_safe(self) -> Optional[str]:
        """Get email from encrypted column, fallback to plaintext."""
        if hasattr(self, 'email_encrypted') and self.email_encrypted:
            return decrypt_pii(self.email_encrypted)
        return getattr(self, 'email', None)
    
    # Similar properties for other encrypted fields...
```

#### 2.3 Application Code Updates

Update the Patient entity to use the compatibility layer:

```python
# Update: felicity/apps/patient/entities.py
from felicity.apps.patient.compatibility import PatientCompatibilityMixin

class Patient(BaseEntity, PatientCompatibilityMixin):
    __tablename__ = "patient"
    
    # Keep existing columns for backward compatibility
    first_name = Column(String, nullable=True)  # Made nullable during migration
    last_name = Column(String, nullable=True)   # Made nullable during migration
    # ... other existing columns
    
    # New encrypted columns
    first_name_encrypted = Column(EncryptedPII(500), nullable=True)
    last_name_encrypted = Column(EncryptedPII(500), nullable=True)
    # ... other encrypted columns
    
    migration_status = Column(String, default='pending')
    
    @property
    def full_name(self):
        """Use safe properties that handle both encrypted and plaintext."""
        first = self.first_name_safe
        middle = self.middle_name_safe
        last = self.last_name_safe
        
        if middle:
            return f"{first} {middle} {last}"
        else:
            return f"{first} {last}"
```

### Phase 3: Application Cutover (Duration: 1 week)

#### 3.1 Gradual Service Migration

Update services to prioritize encrypted data:

```python
# Update: felicity/apps/patient/services.py
class PatientService(BaseService[Patient, PatientCreate, PatientUpdate]):
    
    async def search_compatible(self, query_string: str = None) -> list[Patient]:
        """
        Search that works during migration period.
        Uses encrypted search indices when available, falls back to plaintext.
        """
        if not query_string:
            return []
        
        # Try encrypted search first
        try:
            encrypted_results = await self.high_performance_search(
                first_name=query_string,
                last_name=query_string,
                email=query_string,
                phone_mobile=query_string
            )
            if encrypted_results:
                return encrypted_results
        except Exception:
            pass  # Fall back to legacy search
        
        # Fallback to legacy search for non-migrated data
        return await self.legacy_search(query_string)
    
    async def legacy_search(self, query_string: str) -> list[Patient]:
        """Legacy search for non-migrated data."""
        filters = {
            "first_name": query_string,
            "last_name": query_string,
            "email": query_string,
            "phone_mobile": query_string,
        }
        return await super().search(**filters)
```

#### 3.2 Feature Flags for Migration Control

```python
# File: felicity/core/feature_flags.py
from felicity.core.config import settings

class FeatureFlags:
    """Feature flags for controlling migration behavior."""
    
    @staticmethod
    def use_encrypted_search() -> bool:
        """Whether to use encrypted search indices."""
        return getattr(settings, 'USE_ENCRYPTED_SEARCH', False)
    
    @staticmethod
    def migration_complete() -> bool:
        """Whether migration is complete and old columns can be ignored."""
        return getattr(settings, 'HIPAA_MIGRATION_COMPLETE', False)
    
    @staticmethod
    def require_encryption() -> bool:
        """Whether all new data must be encrypted."""
        return getattr(settings, 'REQUIRE_HIPAA_ENCRYPTION', True)
```

### Phase 4: Data Validation and Cleanup (Duration: 1 week)

#### 4.1 Migration Validation Script

```python
# File: migration/validate_migration.py
async def validate_migration():
    """Validate that migration completed successfully."""
    
    async with async_session() as session:
        # Check for unmigrated records
        unmigrated_query = """
            SELECT 
                'patient' as table_name,
                COUNT(*) as unmigrated_count
            FROM patient 
            WHERE migration_status = 'pending'
            UNION ALL
            SELECT 
                'analysis_result' as table_name,
                COUNT(*) as unmigrated_count
            FROM analysis_result 
            WHERE migration_status = 'pending' AND result IS NOT NULL
        """
        
        result = await session.execute(unmigrated_query)
        unmigrated = result.fetchall()
        
        total_unmigrated = sum(row[1] for row in unmigrated)
        
        if total_unmigrated > 0:
            print(f"WARNING: {total_unmigrated} records still unmigrated!")
            for row in unmigrated:
                if row[1] > 0:
                    print(f"  {row[0]}: {row[1]} unmigrated")
            return False
        
        # Validate encrypted data integrity
        validation_query = """
            SELECT 
                COUNT(*) as total,
                COUNT(first_name_encrypted) as encrypted_first_name,
                COUNT(last_name_encrypted) as encrypted_last_name
            FROM patient 
            WHERE migration_status = 'encrypted'
        """
        
        result = await session.execute(validation_query)
        validation = result.fetchone()
        
        print(f"Validation Results:")
        print(f"  Total migrated patients: {validation[0]}")
        print(f"  Encrypted first names: {validation[1]}")
        print(f"  Encrypted last names: {validation[2]}")
        
        # Check search indices
        index_query = """
            SELECT COUNT(DISTINCT patient_uid) as indexed_patients
            FROM patient_search_index
        """
        
        result = await session.execute(index_query)
        indexed_count = result.scalar()
        
        print(f"  Patients with search indices: {indexed_count}")
        
        return total_unmigrated == 0

if __name__ == "__main__":
    import asyncio
    success = asyncio.run(validate_migration())
    sys.exit(0 if success else 1)
```

#### 4.2 Cleanup Script (Run after validation)

```python
# File: migration/cleanup_migration.py
async def cleanup_old_columns():
    """Remove old plaintext columns after successful migration."""
    
    print("WARNING: This will permanently delete plaintext data!")
    print("Ensure you have backups and validation is complete.")
    
    confirm = input("Type 'DELETE_PLAINTEXT_DATA' to continue: ")
    if confirm != "DELETE_PLAINTEXT_DATA":
        print("Cleanup cancelled.")
        return
    
    async with async_session() as session:
        # Drop old columns
        cleanup_queries = [
            "ALTER TABLE patient DROP COLUMN first_name",
            "ALTER TABLE patient DROP COLUMN middle_name", 
            "ALTER TABLE patient DROP COLUMN last_name",
            "ALTER TABLE patient DROP COLUMN phone_mobile",
            "ALTER TABLE patient DROP COLUMN phone_home",
            "ALTER TABLE patient DROP COLUMN email",
            "ALTER TABLE patient DROP COLUMN date_of_birth",
            
            "ALTER TABLE patient_identification DROP COLUMN value",
            
            "ALTER TABLE analysis_result DROP COLUMN result",
            
            "ALTER TABLE result_mutation DROP COLUMN before",
            "ALTER TABLE result_mutation DROP COLUMN after",
            
            "ALTER TABLE clinical_data DROP COLUMN symptoms_raw",
            "ALTER TABLE clinical_data DROP COLUMN clinical_indication",
            "ALTER TABLE clinical_data DROP COLUMN vitals",
            "ALTER TABLE clinical_data DROP COLUMN treatment_notes",
            "ALTER TABLE clinical_data DROP COLUMN other_context",
        ]
        
        for query in cleanup_queries:
            try:
                await session.execute(query)
                print(f"Executed: {query}")
            except Exception as e:
                print(f"Error executing {query}: {e}")
        
        # Rename encrypted columns to original names
        rename_queries = [
            "ALTER TABLE patient RENAME COLUMN first_name_encrypted TO first_name",
            "ALTER TABLE patient RENAME COLUMN middle_name_encrypted TO middle_name",
            "ALTER TABLE patient RENAME COLUMN last_name_encrypted TO last_name",
            "ALTER TABLE patient RENAME COLUMN phone_mobile_encrypted TO phone_mobile",
            "ALTER TABLE patient RENAME COLUMN phone_home_encrypted TO phone_home",
            "ALTER TABLE patient RENAME COLUMN email_encrypted TO email",
            "ALTER TABLE patient RENAME COLUMN date_of_birth_encrypted TO date_of_birth",
            
            "ALTER TABLE patient_identification RENAME COLUMN value_encrypted TO value",
            
            "ALTER TABLE analysis_result RENAME COLUMN result_encrypted TO result",
            
            "ALTER TABLE result_mutation RENAME COLUMN before_encrypted TO before",
            "ALTER TABLE result_mutation RENAME COLUMN after_encrypted TO after",
            
            "ALTER TABLE clinical_data RENAME COLUMN symptoms_raw_encrypted TO symptoms_raw",
            "ALTER TABLE clinical_data RENAME COLUMN clinical_indication_encrypted TO clinical_indication",
            "ALTER TABLE clinical_data RENAME COLUMN vitals_encrypted TO vitals",
            "ALTER TABLE clinical_data RENAME COLUMN treatment_notes_encrypted TO treatment_notes",
            "ALTER TABLE clinical_data RENAME COLUMN other_context_encrypted TO other_context",
        ]
        
        for query in rename_queries:
            try:
                await session.execute(query)
                print(f"Executed: {query}")
            except Exception as e:
                print(f"Error executing {query}: {e}")
        
        await session.commit()
        print("Cleanup completed successfully!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(cleanup_old_columns())
```

---

## Migration Timeline and Rollout Strategy

### Timeline Overview
| Phase | Duration | Activities | Risk Level |
|-------|----------|------------|------------|
| **Preparation** | 1-2 weeks | Schema extension, tooling, testing | Low |
| **Data Migration** | 2-4 weeks | Batch encryption, index creation | Medium |
| **App Cutover** | 1 week | Service updates, feature flags | Medium |
| **Validation** | 1 week | Data validation, testing | Low |
| **Cleanup** | 1 week | Remove old columns, optimization | High |

### Rollout Strategy

#### Option 1: Rolling Migration (Recommended)
- **Approach**: Migrate clients one by one
- **Advantages**: Lower risk, easier rollback, lessons learned
- **Timeline**: 2-3 months for all clients
- **Resource Requirements**: Moderate

#### Option 2: Staged Migration
- **Approach**: Migrate in groups (dev → staging → production)
- **Advantages**: Thorough testing, coordinated rollout
- **Timeline**: 1-2 months per environment
- **Resource Requirements**: High

#### Option 3: Big Bang Migration
- **Approach**: Migrate all clients simultaneously
- **Advantages**: Faster completion, less maintenance overhead
- **Timeline**: 1-2 weeks (high intensity)
- **Resource Requirements**: Very high, higher risk

### Recommended Approach: Rolling Migration

#### Week 1-2: Preparation
- [ ] Develop and test migration tools
- [ ] Create test environments with sample data
- [ ] Document rollback procedures
- [ ] Train support team

#### Week 3-6: Pilot Migration (1-2 small clients)
- [ ] Run complete migration on pilot clients
- [ ] Validate functionality and performance
- [ ] Gather feedback and optimize process
- [ ] Document lessons learned

#### Week 7-12: Production Rollout (Remaining clients)
- [ ] Schedule migrations with clients
- [ ] Execute migrations during maintenance windows
- [ ] Monitor system performance
- [ ] Provide support for any issues

---

## Risk Mitigation and Rollback Procedures

### Pre-Migration Checklist
- [ ] **Complete database backup** (verified restorable)
- [ ] **Test migration** on copy of production data
- [ ] **Validate encryption keys** are properly configured
- [ ] **Performance baseline** established
- [ ] **Rollback plan** documented and tested
- [ ] **Support team** trained and available
- [ ] **Client communication** completed

### Rollback Procedures

#### During Migration (if issues occur)
1. **Stop migration process** immediately
2. **Assess data integrity** using validation scripts
3. **Restore from backup** if data corruption detected
4. **Investigate root cause** before resuming

#### After Migration (if major issues found)
1. **Switch feature flags** to disable encrypted search
2. **Use compatibility layer** to access both data types
3. **Restore from backup** if necessary (last resort)
4. **Fix issues** and re-run migration

### Monitoring During Migration

#### Key Metrics to Monitor
- **Migration progress** (records processed/remaining)
- **Error rates** (failed encryptions/indexing)
- **System performance** (response times, memory usage)
- **Database size** (storage requirements)
- **Search functionality** (accuracy and performance)

#### Alert Conditions
- Migration failure rate > 5%
- System response time > 2x baseline
- Database storage > 150% of expected
- Search result accuracy < 95%

---

## Client Communication Plan

### Pre-Migration Communication (2 weeks before)
```
Subject: Important: HIPAA Compliance Upgrade Scheduled

Dear [Client Name],

We are upgrading your Felicity LIMS system to include enhanced HIPAA compliance 
features with data-at-rest encryption. This upgrade will:

✅ Encrypt all patient and analysis data for enhanced security
✅ Improve search performance with new indexing technology  
✅ Ensure full HIPAA technical safeguards compliance
✅ Maintain all existing functionality

Scheduled Maintenance Window:
📅 Date: [Date]
⏰ Time: [Time] (estimated 4-6 hours)
🔄 Expected Downtime: 30 minutes maximum

What to Expect:
• Brief system downtime during final cutover
• All data will be preserved and encrypted
• No changes to user interface or workflows
• Enhanced security and performance post-upgrade

Our support team will be available throughout the process.

Contact: [Support Contact Information]
```

### During Migration Updates
```
Subject: HIPAA Upgrade Progress Update

Migration Progress: [X]% Complete
Current Phase: [Phase Name]
Estimated Completion: [Time]

All data migration is proceeding normally. No action required.
```

### Post-Migration Communication
```
Subject: HIPAA Compliance Upgrade Complete

Your Felicity LIMS system has been successfully upgraded with enhanced 
HIPAA compliance features. 

✅ All patient and analysis data is now encrypted
✅ System performance improved with new search technology
✅ Full HIPAA technical safeguards compliance achieved

You may notice:
• Faster search results
• Enhanced data security indicators
• No changes to daily workflows

Thank you for your patience during this important security upgrade.
```

---

## Success Criteria and Validation

### Technical Success Criteria
- [ ] **100% data migration** with zero data loss
- [ ] **All PII/PHI encrypted** using AES-256
- [ ] **Search indices created** for all migrated records
- [ ] **Performance maintained** (≤ 2x search response time)
- [ ] **Validation tests pass** (data integrity, encryption, search)

### Business Success Criteria  
- [ ] **No user workflow disruption** beyond planned maintenance
- [ ] **HIPAA compliance achieved** per technical safeguards
- [ ] **Client satisfaction maintained** (> 95% satisfaction score)
- [ ] **Support tickets** related to migration < 5% of normal volume

### Compliance Success Criteria
- [ ] **164.312(a)(1) Access Control** - Encrypted field access implemented
- [ ] **164.312(c)(1) Integrity** - Authenticated encryption verified
- [ ] **164.312(d) Authentication** - User context in operations verified
- [ ] **164.312(e)(1) Transmission Security** - Data-at-rest encryption confirmed

---

## Resource Requirements

### Technical Resources
- **Database Administrator**: 40 hours/week during migration
- **Senior Developer**: 40 hours/week for application changes
- **DevOps Engineer**: 20 hours/week for deployment and monitoring
- **QA Engineer**: 30 hours/week for validation and testing

### Infrastructure Requirements
- **Additional Storage**: 50-100% increase during dual-column period
- **Backup Storage**: Full database backups before each migration
- **Computing Resources**: 50% additional CPU/memory during migration
- **Monitoring Tools**: Enhanced logging and alerting capabilities

### Budget Considerations
- **Development Time**: 200-300 developer hours per client
- **Infrastructure Costs**: 50% increase during migration period
- **Support Overhead**: 24/7 support during migration weekends
- **Testing Environments**: Copy of production data for validation

---

## Conclusion

This migration strategy provides a comprehensive, low-risk approach to transitioning existing Felicity LIMS clients from non-encrypted to HIPAA-compliant encrypted data storage. The dual-column approach ensures data safety while the gradual rollout minimizes risk and allows for lessons learned.

Key success factors:
1. **Thorough preparation** with comprehensive testing
2. **Incremental migration** with validation at each step
3. **Strong rollback procedures** for risk mitigation
4. **Clear client communication** throughout the process
5. **Comprehensive monitoring** during migration

The strategy balances compliance requirements, system performance, and operational risk to deliver a successful HIPAA compliance upgrade with minimal business disruption.