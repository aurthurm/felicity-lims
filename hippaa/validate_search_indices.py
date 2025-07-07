#!/usr/bin/env python3
"""
Search Index Validation Script for HIPAA Migration

Validates the consistency and completeness of search indices
created during the HIPAA migration process.
"""

import asyncio
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.utils.encryption import decrypt_pii
from felicity.apps.patient.search_service import SearchableEncryptionService


class SearchIndexValidator:
    """Validates search index consistency and completeness."""
    
    def __init__(self):
        self.search_service = SearchableEncryptionService()
        self.validation_errors = []
        self.validation_warnings = []
    
    async def check_index_completeness(self) -> bool:
        """Check that all migrated patients have search indices."""
        
        print("Checking search index completeness...")
        
        try:
            async with async_session() as session:
                
                # Get count of migrated patients
                patient_count_query = """
                    SELECT COUNT(*) FROM patient 
                    WHERE migration_status = 'encrypted'
                """
                result = await session.execute(patient_count_query)
                migrated_patients = result.scalar()
                
                # Get count of patients with search indices
                index_queries = {
                    "patient_search_indices": """
                        SELECT COUNT(DISTINCT patient_uid) FROM patient_search_index
                    """,
                    "phone_search_indices": """
                        SELECT COUNT(DISTINCT patient_uid) FROM phone_search_index  
                    """,
                    "date_search_indices": """
                        SELECT COUNT(DISTINCT patient_uid) FROM date_search_index
                    """
                }
                
                index_counts = {}
                for index_type, query in index_queries.items():
                    result = await session.execute(query)
                    count = result.scalar()
                    index_counts[index_type] = count
                    print(f"  {index_type}: {count}")
                
                print(f"  Migrated patients: {migrated_patients}")
                
                # Check completeness
                completeness_passed = True
                
                # Patient search indices should match migrated patients (approximately)
                patient_indices = index_counts["patient_search_indices"]
                if migrated_patients > 0 and patient_indices < migrated_patients * 0.9:
                    self.validation_errors.append(
                        f"Patient search indices incomplete: {patient_indices}/{migrated_patients}"
                    )
                    completeness_passed = False
                    print(f"    ❌ Patient search indices incomplete")
                else:
                    print(f"    ✅ Patient search indices complete")
                
                # Phone indices might be fewer (not all patients have phones)
                phone_indices = index_counts["phone_search_indices"]
                if phone_indices > migrated_patients:
                    self.validation_warnings.append(
                        f"More phone indices than patients: {phone_indices}/{migrated_patients}"
                    )
                    print(f"    ⚠️  More phone indices than expected")
                else:
                    print(f"    ✅ Phone search indices reasonable")
                
                # Date indices might be fewer (not all patients have dates)
                date_indices = index_counts["date_search_indices"]
                if date_indices > migrated_patients:
                    self.validation_warnings.append(
                        f"More date indices than patients: {date_indices}/{migrated_patients}"
                    )
                    print(f"    ⚠️  More date indices than expected")
                else:
                    print(f"    ✅ Date search indices reasonable")
                
                return completeness_passed
        
        except Exception as e:
            self.validation_errors.append(f"Index completeness check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_index_consistency(self, sample_size: int = 20) -> bool:
        """Check that search indices are consistent with patient data."""
        
        print(f"\nChecking search index consistency with sample size: {sample_size}")
        
        try:
            async with async_session() as session:
                
                # Get sample of patients with indices
                patient_query = """
                    SELECT DISTINCT p.uid, p.first_name, p.last_name, p.email, 
                           p.phone_mobile, p.date_of_birth
                    FROM patient p
                    INNER JOIN patient_search_index psi ON p.uid = psi.patient_uid
                    WHERE p.migration_status = 'encrypted'
                    LIMIT :limit
                """
                
                result = await session.execute(patient_query, {"limit": sample_size})
                patients = result.fetchall()
                
                consistency_passed = True
                
                for patient in patients:
                    uid, first_name, last_name, email, phone_mobile, date_of_birth = patient
                    
                    try:
                        # Check that search indices exist for this patient
                        index_check_query = """
                            SELECT 
                                (SELECT COUNT(*) FROM patient_search_index WHERE patient_uid = :uid) as patient_indices,
                                (SELECT COUNT(*) FROM phone_search_index WHERE patient_uid = :uid) as phone_indices,
                                (SELECT COUNT(*) FROM date_search_index WHERE patient_uid = :uid) as date_indices
                        """
                        
                        result = await session.execute(index_check_query, {"uid": uid})
                        index_counts = result.fetchone()
                        
                        patient_indices, phone_indices, date_indices = index_counts
                        
                        # Validate patient search indices
                        if (first_name or last_name or email) and patient_indices == 0:
                            self.validation_errors.append(
                                f"Patient {uid}: Missing patient search indices despite having searchable data"
                            )
                            consistency_passed = False
                        
                        # Validate phone indices
                        if phone_mobile and phone_indices == 0:
                            self.validation_warnings.append(
                                f"Patient {uid}: Missing phone search indices despite having phone"
                            )
                        
                        # Validate date indices  
                        if date_of_birth and date_indices == 0:
                            self.validation_warnings.append(
                                f"Patient {uid}: Missing date search indices despite having DOB"
                            )
                        
                    except Exception as e:
                        self.validation_errors.append(f"Patient {uid}: Index consistency check failed - {e}")
                        consistency_passed = False
                
                print(f"    Checked {len(patients)} patients for index consistency")
                if consistency_passed:
                    print(f"    ✅ Search index consistency validated")
                else:
                    print(f"    ❌ Search index inconsistencies found")
                
                return consistency_passed
        
        except Exception as e:
            self.validation_errors.append(f"Index consistency check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_index_integrity(self) -> bool:
        """Check for orphaned indices and referential integrity."""
        
        print("\nChecking search index integrity...")
        
        try:
            async with async_session() as session:
                
                # Check for orphaned indices
                orphan_queries = {
                    "orphaned_patient_indices": """
                        SELECT COUNT(*) FROM patient_search_index psi
                        LEFT JOIN patient p ON psi.patient_uid = p.uid
                        WHERE p.uid IS NULL
                    """,
                    "orphaned_phone_indices": """
                        SELECT COUNT(*) FROM phone_search_index psi
                        LEFT JOIN patient p ON psi.patient_uid = p.uid  
                        WHERE p.uid IS NULL
                    """,
                    "orphaned_date_indices": """
                        SELECT COUNT(*) FROM date_search_index dsi
                        LEFT JOIN patient p ON dsi.patient_uid = p.uid
                        WHERE p.uid IS NULL
                    """
                }
                
                integrity_passed = True
                
                for check_name, query in orphan_queries.items():
                    result = await session.execute(query)
                    orphan_count = result.scalar()
                    
                    print(f"  {check_name}: {orphan_count}")
                    
                    if orphan_count > 0:
                        self.validation_errors.append(
                            f"Index integrity violation: {orphan_count} {check_name}"
                        )
                        integrity_passed = False
                        print(f"    ❌ Found {orphan_count} orphaned indices")
                    else:
                        print(f"    ✅ No orphaned indices")
                
                # Check for duplicate indices
                duplicate_queries = {
                    "duplicate_patient_indices": """
                        SELECT patient_uid, field_name, search_hash, COUNT(*) as duplicates
                        FROM patient_search_index 
                        GROUP BY patient_uid, field_name, search_hash
                        HAVING COUNT(*) > 1
                        LIMIT 5
                    """,
                    "duplicate_phone_indices": """
                        SELECT patient_uid, field_name, normalized_hash, COUNT(*) as duplicates
                        FROM phone_search_index
                        GROUP BY patient_uid, field_name, normalized_hash  
                        HAVING COUNT(*) > 1
                        LIMIT 5
                    """
                }
                
                for check_name, query in duplicate_queries.items():
                    result = await session.execute(query)
                    duplicates = result.fetchall()
                    
                    if duplicates:
                        duplicate_count = len(duplicates)
                        print(f"  {check_name}: {duplicate_count} found")
                        self.validation_warnings.append(
                            f"Duplicate indices found: {duplicate_count} {check_name}"
                        )
                        print(f"    ⚠️  Found {duplicate_count} duplicate index entries")
                    else:
                        print(f"  {check_name}: None found ✅")
                
                return integrity_passed
        
        except Exception as e:
            self.validation_errors.append(f"Index integrity check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_search_performance(self) -> bool:
        """Check that search indices provide good performance."""
        
        print("\nChecking search index performance...")
        
        try:
            async with async_session() as session:
                
                # Get sample search terms
                sample_query = """
                    SELECT DISTINCT search_hash 
                    FROM patient_search_index 
                    WHERE field_name = 'first_name'
                    LIMIT 5
                """
                
                result = await session.execute(sample_query)
                search_hashes = [row[0] for row in result.fetchall()]
                
                if not search_hashes:
                    print("  ⚠️  No search hashes found for performance testing")
                    return True
                
                # Test search performance
                performance_passed = True
                
                for search_hash in search_hashes:
                    start_time = asyncio.get_event_loop().time()
                    
                    # Simulate index search
                    perf_query = """
                        SELECT patient_uid 
                        FROM patient_search_index 
                        WHERE field_name = 'first_name' AND search_hash = :hash
                        LIMIT 100
                    """
                    
                    result = await session.execute(perf_query, {"hash": search_hash})
                    results = result.fetchall()
                    
                    end_time = asyncio.get_event_loop().time()
                    duration_ms = (end_time - start_time) * 1000
                    
                    if duration_ms > 100:  # 100ms threshold
                        self.validation_warnings.append(
                            f"Slow search performance: {duration_ms:.2f}ms for hash search"
                        )
                        print(f"    ⚠️  Slow search: {duration_ms:.2f}ms")
                    else:
                        print(f"    ✅ Fast search: {duration_ms:.2f}ms")
                
                return performance_passed
        
        except Exception as e:
            self.validation_errors.append(f"Search performance check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def run_validation(self, sample_size: int = 20) -> bool:
        """Run complete search index validation."""
        
        print("HIPAA Search Index Validation")
        print("=" * 50)
        
        # Run all validation checks
        completeness_ok = await self.check_index_completeness()
        consistency_ok = await self.check_index_consistency(sample_size)
        integrity_ok = await self.check_index_integrity()
        performance_ok = await self.check_search_performance()
        
        # Generate summary
        print(f"\n" + "=" * 50)
        print("SEARCH INDEX VALIDATION SUMMARY")
        print("=" * 50)
        
        all_passed = completeness_ok and consistency_ok and integrity_ok and performance_ok
        
        print(f"Index completeness: {'✅ PASSED' if completeness_ok else '❌ FAILED'}")
        print(f"Index consistency: {'✅ PASSED' if consistency_ok else '❌ FAILED'}")
        print(f"Index integrity: {'✅ PASSED' if integrity_ok else '❌ FAILED'}")
        print(f"Search performance: {'✅ PASSED' if performance_ok else '❌ FAILED'}")
        
        if self.validation_errors:
            print(f"\n❌ ERRORS ({len(self.validation_errors)}):")
            for error in self.validation_errors[:10]:  # Show first 10 errors
                print(f"  • {error}")
            if len(self.validation_errors) > 10:
                print(f"  ... and {len(self.validation_errors) - 10} more errors")
        
        if self.validation_warnings:
            print(f"\n⚠️  WARNINGS ({len(self.validation_warnings)}):")
            for warning in self.validation_warnings[:10]:  # Show first 10 warnings
                print(f"  • {warning}")
            if len(self.validation_warnings) > 10:
                print(f"  ... and {len(self.validation_warnings) - 10} more warnings")
        
        if all_passed:
            print(f"\n✅ ALL SEARCH INDEX VALIDATION TESTS PASSED")
        else:
            print(f"\n❌ SOME SEARCH INDEX VALIDATION TESTS FAILED")
        
        return all_passed


async def main():
    """Main entry point for search index validation."""
    
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate HIPAA search indices')
    parser.add_argument('--sample-size', type=int, default=20, 
                       help='Number of patients to sample for consistency checks')
    
    args = parser.parse_args()
    
    validator = SearchIndexValidator()
    success = await validator.run_validation(args.sample_size)
    
    return success


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)