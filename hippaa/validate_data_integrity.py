#!/usr/bin/env python3
"""
Data Integrity Validation Script for HIPAA Migration

Validates data integrity during and after HIPAA migration to ensure
no data corruption or loss has occurred.
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
from felicity.utils.encryption import decrypt_pii, decrypt_phi


class DataIntegrityValidator:
    """Validates data integrity for HIPAA migration."""
    
    def __init__(self):
        self.validation_errors = []
        self.validation_warnings = []
        self.integrity_checks = []
    
    async def check_record_counts(self) -> bool:
        """Check that record counts are consistent across migration."""
        
        print("Checking record counts and consistency...")
        
        try:
            async with async_session() as session:
                
                # Get record counts for all tables
                count_queries = {
                    "total_patients": "SELECT COUNT(*) FROM patient",
                    "migrated_patients": "SELECT COUNT(*) FROM patient WHERE migration_status = 'encrypted'",
                    "pending_patients": "SELECT COUNT(*) FROM patient WHERE COALESCE(migration_status, 'pending') = 'pending'",
                    "failed_patients": "SELECT COUNT(*) FROM patient WHERE migration_status = 'failed'",
                    
                    "total_results": "SELECT COUNT(*) FROM analysis_result",
                    "migrated_results": "SELECT COUNT(*) FROM analysis_result WHERE migration_status = 'encrypted'",
                    "pending_results": "SELECT COUNT(*) FROM analysis_result WHERE COALESCE(migration_status, 'pending') = 'pending'",
                    
                    "total_identifications": "SELECT COUNT(*) FROM patient_identification",
                    "migrated_identifications": "SELECT COUNT(*) FROM patient_identification WHERE migration_status = 'encrypted'",
                    
                    "search_indices": "SELECT COUNT(DISTINCT patient_uid) FROM patient_search_index",
                    "phone_indices": "SELECT COUNT(DISTINCT patient_uid) FROM phone_search_index",
                    "date_indices": "SELECT COUNT(DISTINCT patient_uid) FROM date_search_index"
                }
                
                counts = {}
                for check_name, query in count_queries.items():
                    result = await session.execute(query)
                    count = result.scalar()
                    counts[check_name] = count
                    print(f"  {check_name}: {count}")
                
                # Validate counts make sense
                integrity_passed = True
                
                # Total should equal migrated + pending + failed
                total_patients = counts["total_patients"]
                accounted_patients = counts["migrated_patients"] + counts["pending_patients"] + counts["failed_patients"]
                
                if total_patients != accounted_patients:
                    self.validation_errors.append(
                        f"Patient count mismatch: total={total_patients}, "
                        f"accounted={accounted_patients}"
                    )
                    integrity_passed = False
                    print(f"    ❌ Patient count mismatch")
                
                # Search indices should match migrated patients (approximately)
                migrated_patients = counts["migrated_patients"]
                search_indices = counts["search_indices"]
                
                if migrated_patients > 0 and search_indices < migrated_patients * 0.9:
                    self.validation_warnings.append(
                        f"Search indices incomplete: {search_indices} indices for {migrated_patients} patients"
                    )
                    print(f"    ⚠️  Search indices may be incomplete")
                
                return integrity_passed
        
        except Exception as e:
            self.validation_errors.append(f"Record count check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_data_consistency(self, sample_size: int = 20) -> bool:
        """Check data consistency between plaintext and encrypted columns."""
        
        print(f"\nChecking data consistency with sample size: {sample_size}")
        
        try:
            async with async_session() as session:
                
                # Check patient data consistency
                print("  Checking patient data consistency...")
                
                patient_query = """
                    SELECT uid, first_name, first_name_encrypted,
                           last_name, last_name_encrypted,
                           email, email_encrypted,
                           phone_mobile, phone_mobile_encrypted,
                           date_of_birth, date_of_birth_encrypted,
                           migration_status
                    FROM patient 
                    WHERE migration_status = 'encrypted'
                    AND (first_name_encrypted IS NOT NULL OR last_name_encrypted IS NOT NULL)
                    ORDER BY updated_at DESC
                    LIMIT :limit
                """
                
                result = await session.execute(patient_query, {"limit": sample_size})
                patients = result.fetchall()
                
                patient_consistency = True
                
                for patient in patients:
                    (uid, first_name, first_name_enc, last_name, last_name_enc, 
                     email, email_enc, phone_mobile, phone_mobile_enc, 
                     date_of_birth, date_of_birth_enc, status) = patient
                    
                    # Check first name consistency
                    if first_name_enc and first_name:
                        try:
                            decrypted_first = decrypt_pii(first_name_enc)
                            if decrypted_first != first_name:
                                self.validation_errors.append(
                                    f"Patient {uid}: first name mismatch - "
                                    f"'{first_name}' vs '{decrypted_first}'"
                                )
                                patient_consistency = False
                        except Exception as e:
                            self.validation_errors.append(
                                f"Patient {uid}: first name decryption failed - {e}"
                            )
                            patient_consistency = False
                    
                    # Check last name consistency
                    if last_name_enc and last_name:
                        try:
                            decrypted_last = decrypt_pii(last_name_enc)
                            if decrypted_last != last_name:
                                self.validation_errors.append(
                                    f"Patient {uid}: last name mismatch - "
                                    f"'{last_name}' vs '{decrypted_last}'"
                                )
                                patient_consistency = False
                        except Exception as e:
                            self.validation_errors.append(
                                f"Patient {uid}: last name decryption failed - {e}"
                            )
                            patient_consistency = False
                    
                    # Check email consistency
                    if email_enc and email:
                        try:
                            decrypted_email = decrypt_pii(email_enc)
                            if decrypted_email != email:
                                self.validation_errors.append(
                                    f"Patient {uid}: email mismatch - "
                                    f"'{email}' vs '{decrypted_email}'"
                                )
                                patient_consistency = False
                        except Exception as e:
                            self.validation_errors.append(
                                f"Patient {uid}: email decryption failed - {e}"
                            )
                            patient_consistency = False
                    
                    # Check phone consistency
                    if phone_mobile_enc and phone_mobile:
                        try:
                            decrypted_phone = decrypt_pii(phone_mobile_enc)
                            if decrypted_phone != phone_mobile:
                                self.validation_errors.append(
                                    f"Patient {uid}: phone mismatch - "
                                    f"'{phone_mobile}' vs '{decrypted_phone}'"
                                )
                                patient_consistency = False
                        except Exception as e:
                            self.validation_errors.append(
                                f"Patient {uid}: phone decryption failed - {e}"
                            )
                            patient_consistency = False
                    
                    # Check date of birth consistency
                    if date_of_birth_enc and date_of_birth:
                        try:
                            decrypted_dob = decrypt_pii(date_of_birth_enc)
                            # Convert date to string for comparison
                            if hasattr(date_of_birth, 'isoformat'):
                                dob_str = date_of_birth.isoformat()
                            else:
                                dob_str = str(date_of_birth)
                            
                            if decrypted_dob != dob_str:
                                self.validation_errors.append(
                                    f"Patient {uid}: DOB mismatch - "
                                    f"'{dob_str}' vs '{decrypted_dob}'"
                                )
                                patient_consistency = False
                        except Exception as e:
                            self.validation_errors.append(
                                f"Patient {uid}: DOB decryption failed - {e}"
                            )
                            patient_consistency = False
                
                print(f"    Checked {len(patients)} patient records")
                if patient_consistency:
                    print(f"    ✅ Patient data consistency validated")
                else:
                    print(f"    ❌ Patient data inconsistencies found")
                
                # Check analysis result consistency
                print("  Checking analysis result consistency...")
                
                result_query = """
                    SELECT uid, result, result_encrypted, migration_status
                    FROM analysis_result 
                    WHERE migration_status = 'encrypted'
                    AND result_encrypted IS NOT NULL
                    ORDER BY updated_at DESC
                    LIMIT :limit
                """
                
                result = await session.execute(result_query, {"limit": sample_size})
                results = result.fetchall()
                
                result_consistency = True
                
                for analysis_result in results:
                    uid, original_result, encrypted_result, status = analysis_result
                    
                    if encrypted_result and original_result:
                        try:
                            decrypted_result = decrypt_phi(encrypted_result)
                            if decrypted_result != original_result:
                                self.validation_errors.append(
                                    f"Result {uid}: mismatch - "
                                    f"'{original_result}' vs '{decrypted_result}'"
                                )
                                result_consistency = False
                        except Exception as e:
                            self.validation_errors.append(
                                f"Result {uid}: decryption failed - {e}"
                            )
                            result_consistency = False
                
                print(f"    Checked {len(results)} analysis result records")
                if result_consistency:
                    print(f"    ✅ Analysis result consistency validated")
                else:
                    print(f"    ❌ Analysis result inconsistencies found")
                
                return patient_consistency and result_consistency
        
        except Exception as e:
            self.validation_errors.append(f"Data consistency check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_foreign_key_integrity(self) -> bool:
        """Check foreign key integrity and referential constraints."""
        
        print("\nChecking foreign key integrity...")
        
        try:
            async with async_session() as session:
                
                integrity_queries = {
                    "orphaned_search_indices": """
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
                    """,
                    "orphaned_identifications": """
                        SELECT COUNT(*) FROM patient_identification pi
                        LEFT JOIN patient p ON pi.patient_uid = p.uid
                        WHERE p.uid IS NULL
                    """
                }
                
                integrity_passed = True
                
                for check_name, query in integrity_queries.items():
                    result = await session.execute(query)
                    orphaned_count = result.scalar()
                    
                    print(f"  {check_name}: {orphaned_count}")
                    
                    if orphaned_count > 0:
                        self.validation_errors.append(
                            f"Foreign key integrity violation: {orphaned_count} {check_name}"
                        )
                        integrity_passed = False
                        print(f"    ❌ Found {orphaned_count} orphaned records")
                    else:
                        print(f"    ✅ No orphaned records")
                
                return integrity_passed
        
        except Exception as e:
            self.validation_errors.append(f"Foreign key integrity check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_null_constraints(self) -> bool:
        """Check for unexpected null values in critical fields."""
        
        print("\nChecking null constraints...")
        
        try:
            async with async_session() as session:
                
                null_checks = {
                    "patients_without_names": """
                        SELECT COUNT(*) FROM patient 
                        WHERE migration_status = 'encrypted'
                        AND (first_name_encrypted IS NULL AND last_name_encrypted IS NULL)
                        AND (first_name IS NOT NULL OR last_name IS NOT NULL)
                    """,
                    "results_without_values": """
                        SELECT COUNT(*) FROM analysis_result 
                        WHERE migration_status = 'encrypted'
                        AND result_encrypted IS NULL
                        AND result IS NOT NULL
                    """,
                    "missing_uids": """
                        SELECT 
                            'patient' as table_name,
                            COUNT(*) as null_uid_count
                        FROM patient WHERE uid IS NULL
                        UNION ALL
                        SELECT 
                            'analysis_result' as table_name,
                            COUNT(*) as null_uid_count
                        FROM analysis_result WHERE uid IS NULL
                    """
                }
                
                constraints_passed = True
                
                for check_name, query in null_checks.items():
                    result = await session.execute(query)
                    
                    if check_name == "missing_uids":
                        rows = result.fetchall()
                        for table_name, null_count in rows:
                            print(f"  {table_name}_null_uids: {null_count}")
                            if null_count > 0:
                                self.validation_errors.append(
                                    f"Null UID constraint violation: {null_count} records in {table_name}"
                                )
                                constraints_passed = False
                                print(f"    ❌ Found {null_count} null UIDs in {table_name}")
                    else:
                        null_count = result.scalar()
                        print(f"  {check_name}: {null_count}")
                        
                        if null_count > 0:
                            self.validation_warnings.append(
                                f"Unexpected null values: {null_count} {check_name}"
                            )
                            print(f"    ⚠️  Found {null_count} unexpected null values")
                        else:
                            print(f"    ✅ No unexpected null values")
                
                return constraints_passed
        
        except Exception as e:
            self.validation_errors.append(f"Null constraint check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def check_migration_status_consistency(self) -> bool:
        """Check that migration status is consistent with data state."""
        
        print("\nChecking migration status consistency...")
        
        try:
            async with async_session() as session:
                
                status_queries = {
                    "encrypted_without_data": """
                        SELECT COUNT(*) FROM patient 
                        WHERE migration_status = 'encrypted'
                        AND first_name_encrypted IS NULL 
                        AND last_name_encrypted IS NULL
                        AND email_encrypted IS NULL
                        AND (first_name IS NOT NULL OR last_name IS NOT NULL OR email IS NOT NULL)
                    """,
                    "pending_with_encrypted_data": """
                        SELECT COUNT(*) FROM patient 
                        WHERE COALESCE(migration_status, 'pending') = 'pending'
                        AND (first_name_encrypted IS NOT NULL 
                             OR last_name_encrypted IS NOT NULL 
                             OR email_encrypted IS NOT NULL)
                    """,
                    "results_encrypted_without_data": """
                        SELECT COUNT(*) FROM analysis_result 
                        WHERE migration_status = 'encrypted'
                        AND result_encrypted IS NULL
                        AND result IS NOT NULL
                    """
                }
                
                status_consistent = True
                
                for check_name, query in status_queries.items():
                    result = await session.execute(query)
                    inconsistent_count = result.scalar()
                    
                    print(f"  {check_name}: {inconsistent_count}")
                    
                    if inconsistent_count > 0:
                        self.validation_errors.append(
                            f"Migration status inconsistency: {inconsistent_count} {check_name}"
                        )
                        status_consistent = False
                        print(f"    ❌ Found {inconsistent_count} inconsistent records")
                    else:
                        print(f"    ✅ Status consistent")
                
                return status_consistent
        
        except Exception as e:
            self.validation_errors.append(f"Migration status check failed: {e}")
            print(f"  ❌ Error: {e}")
            return False
    
    async def run_complete_validation(self, sample_size: int = 20) -> bool:
        """Run complete data integrity validation."""
        
        print("HIPAA Data Integrity Validation")
        print("=" * 50)
        
        # Run all integrity checks
        record_counts_ok = await self.check_record_counts()
        data_consistency_ok = await self.check_data_consistency(sample_size)
        foreign_keys_ok = await self.check_foreign_key_integrity()
        null_constraints_ok = await self.check_null_constraints()
        migration_status_ok = await self.check_migration_status_consistency()
        
        # Generate summary
        print(f"\n" + "=" * 50)
        print("DATA INTEGRITY VALIDATION SUMMARY")
        print("=" * 50)
        
        all_passed = (record_counts_ok and data_consistency_ok and 
                     foreign_keys_ok and null_constraints_ok and migration_status_ok)
        
        print(f"Record counts: {'✅ PASSED' if record_counts_ok else '❌ FAILED'}")
        print(f"Data consistency: {'✅ PASSED' if data_consistency_ok else '❌ FAILED'}")
        print(f"Foreign key integrity: {'✅ PASSED' if foreign_keys_ok else '❌ FAILED'}")
        print(f"Null constraints: {'✅ PASSED' if null_constraints_ok else '❌ FAILED'}")
        print(f"Migration status: {'✅ PASSED' if migration_status_ok else '❌ FAILED'}")
        
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
            print(f"\n✅ ALL DATA INTEGRITY VALIDATION TESTS PASSED")
        else:
            print(f"\n❌ SOME DATA INTEGRITY VALIDATION TESTS FAILED")
        
        return all_passed


async def main():
    """Main entry point for data integrity validation."""
    
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate data integrity for HIPAA migration')
    parser.add_argument('--sample-size', type=int, default=20, 
                       help='Number of records to sample for consistency checks')
    
    args = parser.parse_args()
    
    validator = DataIntegrityValidator()
    success = await validator.run_complete_validation(args.sample_size)
    
    return success


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)