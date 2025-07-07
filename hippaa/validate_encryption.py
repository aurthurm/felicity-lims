#!/usr/bin/env python3
"""
Encryption Validation Script for HIPAA Migration

Validates that encryption and decryption are working correctly
and that all sensitive data has been properly encrypted.
"""

import asyncio
import sys
import random
import string
from pathlib import Path
from datetime import datetime
from typing import List, Tuple, Optional

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session
from felicity.utils.encryption import encrypt_pii, decrypt_pii, encrypt_phi, decrypt_phi


class EncryptionValidator:
    """Validates encryption functionality for HIPAA compliance."""
    
    def __init__(self):
        self.validation_errors = []
        self.validation_warnings = []
    
    def test_encryption_functions(self) -> bool:
        """Test basic encryption/decryption functionality."""
        
        print("Testing encryption/decryption functions...")
        
        test_cases = [
            ("John Doe", "PII"),
            ("john.doe@example.com", "PII"),
            ("+1-555-123-4567", "PII"),
            ("1990-01-15", "PII"),
            ("Positive", "PHI"),
            ("Blood glucose: 95 mg/dL", "PHI"),
            ("Patient reports headache and fatigue", "PHI"),
        ]
        
        all_passed = True
        
        for i, (test_value, data_type) in enumerate(test_cases):
            print(f"  Test {i+1}: {data_type} - '{test_value[:20]}{'...' if len(test_value) > 20 else ''}'")
            
            try:
                # Choose encryption function based on data type
                if data_type == "PII":
                    encrypted = encrypt_pii(test_value)
                    decrypted = decrypt_pii(encrypted)
                else:  # PHI
                    encrypted = encrypt_phi(test_value)
                    decrypted = decrypt_phi(encrypted)
                
                # Validate encryption
                if encrypted == test_value:
                    self.validation_errors.append(f"Encryption failed: plaintext returned for '{test_value}'")
                    print(f"    ❌ Encryption failed - plaintext returned")
                    all_passed = False
                    continue
                
                # Validate decryption
                if decrypted != test_value:
                    self.validation_errors.append(f"Decryption failed: expected '{test_value}', got '{decrypted}'")
                    print(f"    ❌ Decryption failed - data mismatch")
                    all_passed = False
                    continue
                
                # Validate encrypted data looks encrypted
                if len(encrypted) < len(test_value) * 1.5:
                    self.validation_warnings.append(f"Encrypted data suspiciously short for '{test_value}'")
                    print(f"    ⚠️  Warning: encrypted data seems short")
                
                print(f"    ✅ Passed")
                
            except Exception as e:
                self.validation_errors.append(f"Encryption test failed for '{test_value}': {e}")
                print(f"    ❌ Error: {e}")
                all_passed = False
        
        return all_passed
    
    def generate_test_data(self, count: int = 100) -> List[Tuple[str, str]]:
        """Generate test data for encryption validation."""
        
        test_data = []
        
        # Generate various types of test data
        for i in range(count):
            # Names
            first_names = ["John", "Jane", "Michael", "Sarah", "David", "Lisa", "Robert", "Emily"]
            last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
            
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            
            # Email
            email = f"{first_name.lower()}.{last_name.lower()}@example.com"
            
            # Phone
            phone = f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
            
            # Date of birth
            year = random.randint(1950, 2000)
            month = random.randint(1, 12)
            day = random.randint(1, 28)
            dob = f"{year}-{month:02d}-{day:02d}"
            
            # Medical results
            results = [
                "Positive", "Negative", "Normal", "Abnormal", 
                "Glucose: 95 mg/dL", "Blood pressure: 120/80",
                "Temperature: 98.6°F", "Heart rate: 72 bpm"
            ]
            result = random.choice(results)
            
            test_data.extend([
                (first_name, "PII"),
                (last_name, "PII"),
                (email, "PII"),
                (phone, "PII"),
                (dob, "PII"),
                (result, "PHI")
            ])
        
        return test_data
    
    async def test_database_encryption(self, sample_size: int = 10) -> bool:
        """Test encryption of actual database records."""
        
        print(f"\nTesting database encryption with sample size: {sample_size}")
        
        try:
            async with async_session() as session:
                
                # Test patient encryption
                print("  Testing patient data encryption...")
                
                patient_query = """
                    SELECT uid, first_name, first_name_encrypted, 
                           last_name, last_name_encrypted,
                           email, email_encrypted,
                           migration_status
                    FROM patient 
                    WHERE migration_status = 'encrypted'
                    LIMIT :limit
                """
                
                result = await session.execute(patient_query, {"limit": sample_size})
                patients = result.fetchall()
                
                patient_validation_passed = True
                
                for patient in patients:
                    uid, first_name, first_name_enc, last_name, last_name_enc, email, email_enc, status = patient
                    
                    # Test first name
                    if first_name_enc:
                        try:
                            decrypted_first = decrypt_pii(first_name_enc)
                            if first_name and decrypted_first != first_name:
                                self.validation_errors.append(f"Patient {uid}: first name decryption mismatch")
                                patient_validation_passed = False
                        except Exception as e:
                            self.validation_errors.append(f"Patient {uid}: first name decryption failed - {e}")
                            patient_validation_passed = False
                    
                    # Test last name
                    if last_name_enc:
                        try:
                            decrypted_last = decrypt_pii(last_name_enc)
                            if last_name and decrypted_last != last_name:
                                self.validation_errors.append(f"Patient {uid}: last name decryption mismatch")
                                patient_validation_passed = False
                        except Exception as e:
                            self.validation_errors.append(f"Patient {uid}: last name decryption failed - {e}")
                            patient_validation_passed = False
                    
                    # Test email
                    if email_enc:
                        try:
                            decrypted_email = decrypt_pii(email_enc)
                            if email and decrypted_email != email:
                                self.validation_errors.append(f"Patient {uid}: email decryption mismatch")
                                patient_validation_passed = False
                        except Exception as e:
                            self.validation_errors.append(f"Patient {uid}: email decryption failed - {e}")
                            patient_validation_passed = False
                
                print(f"    Tested {len(patients)} patient records")
                if patient_validation_passed:
                    print(f"    ✅ All patient encryption tests passed")
                else:
                    print(f"    ❌ Some patient encryption tests failed")
                
                # Test analysis result encryption
                print("  Testing analysis result encryption...")
                
                result_query = """
                    SELECT uid, result, result_encrypted, migration_status
                    FROM analysis_result 
                    WHERE migration_status = 'encrypted'
                    AND result_encrypted IS NOT NULL
                    LIMIT :limit
                """
                
                result = await session.execute(result_query, {"limit": sample_size})
                results = result.fetchall()
                
                result_validation_passed = True
                
                for analysis_result in results:
                    uid, original_result, encrypted_result, status = analysis_result
                    
                    if encrypted_result:
                        try:
                            decrypted_result = decrypt_phi(encrypted_result)
                            if original_result and decrypted_result != original_result:
                                self.validation_errors.append(f"Result {uid}: decryption mismatch")
                                result_validation_passed = False
                        except Exception as e:
                            self.validation_errors.append(f"Result {uid}: decryption failed - {e}")
                            result_validation_passed = False
                
                print(f"    Tested {len(results)} analysis result records")
                if result_validation_passed:
                    print(f"    ✅ All result encryption tests passed")
                else:
                    print(f"    ❌ Some result encryption tests failed")
                
                return patient_validation_passed and result_validation_passed
        
        except Exception as e:
            self.validation_errors.append(f"Database encryption test failed: {e}")
            print(f"  ❌ Database test error: {e}")
            return False
    
    async def check_encryption_coverage(self) -> bool:
        """Check that all sensitive data has been encrypted."""
        
        print("\nChecking encryption coverage...")
        
        try:
            async with async_session() as session:
                
                coverage_queries = {
                    "patients_pending": """
                        SELECT COUNT(*) FROM patient 
                        WHERE COALESCE(migration_status, 'pending') = 'pending'
                        AND (first_name IS NOT NULL OR last_name IS NOT NULL)
                    """,
                    "patients_with_plaintext": """
                        SELECT COUNT(*) FROM patient 
                        WHERE migration_status = 'encrypted'
                        AND (first_name IS NOT NULL OR last_name IS NOT NULL 
                             OR email IS NOT NULL OR phone_mobile IS NOT NULL)
                    """,
                    "results_pending": """
                        SELECT COUNT(*) FROM analysis_result 
                        WHERE COALESCE(migration_status, 'pending') = 'pending'
                        AND result IS NOT NULL
                    """,
                    "total_encrypted_patients": """
                        SELECT COUNT(*) FROM patient 
                        WHERE migration_status = 'encrypted'
                    """,
                    "total_encrypted_results": """
                        SELECT COUNT(*) FROM analysis_result 
                        WHERE migration_status = 'encrypted'
                    """
                }
                
                coverage_passed = True
                
                for check_name, query in coverage_queries.items():
                    result = await session.execute(query)
                    count = result.scalar()
                    
                    print(f"  {check_name}: {count}")
                    
                    if "pending" in check_name and count > 0:
                        self.validation_warnings.append(f"{count} records still pending encryption ({check_name})")
                        print(f"    ⚠️  Warning: {count} records still need encryption")
                    
                    if "plaintext" in check_name and count > 0:
                        self.validation_errors.append(f"{count} encrypted records still have plaintext data")
                        print(f"    ❌ Error: {count} records have both encrypted and plaintext data")
                        coverage_passed = False
                
                return coverage_passed
        
        except Exception as e:
            self.validation_errors.append(f"Coverage check failed: {e}")
            print(f"  ❌ Coverage check error: {e}")
            return False
    
    def test_key_consistency(self) -> bool:
        """Test that encryption keys are consistent and secure."""
        
        print("\nTesting encryption key consistency...")
        
        # Test that same plaintext produces same ciphertext (for searchable encryption)
        test_value = "test_consistency_value"
        
        try:
            # Encrypt the same value multiple times
            encrypted_values = []
            for i in range(5):
                encrypted = encrypt_pii(test_value)
                encrypted_values.append(encrypted)
            
            # For deterministic encryption (needed for search), all values should be the same
            # For non-deterministic encryption, they would be different
            unique_values = set(encrypted_values)
            
            if len(unique_values) == 1:
                print("  ✅ Deterministic encryption confirmed (good for search)")
            else:
                print("  ℹ️  Non-deterministic encryption detected")
                # This is not necessarily an error, depends on implementation
            
            # Test that all values decrypt correctly
            for encrypted in encrypted_values:
                decrypted = decrypt_pii(encrypted)
                if decrypted != test_value:
                    self.validation_errors.append("Key consistency test failed - decryption mismatch")
                    print("  ❌ Key consistency test failed")
                    return False
            
            print("  ✅ Key consistency test passed")
            return True
            
        except Exception as e:
            self.validation_errors.append(f"Key consistency test failed: {e}")
            print(f"  ❌ Key consistency error: {e}")
            return False
    
    async def run_validation(self, sample_size: int = 10) -> bool:
        """Run complete encryption validation."""
        
        print("HIPAA Encryption Validation")
        print("=" * 50)
        
        # Test basic encryption functions
        functions_passed = self.test_encryption_functions()
        
        # Test key consistency
        keys_passed = self.test_key_consistency()
        
        # Test database encryption
        database_passed = await self.test_database_encryption(sample_size)
        
        # Check encryption coverage
        coverage_passed = await self.check_encryption_coverage()
        
        # Generate summary
        print("\n" + "=" * 50)
        print("ENCRYPTION VALIDATION SUMMARY")
        print("=" * 50)
        
        all_passed = functions_passed and keys_passed and database_passed and coverage_passed
        
        print(f"Basic encryption functions: {'✅ PASSED' if functions_passed else '❌ FAILED'}")
        print(f"Key consistency: {'✅ PASSED' if keys_passed else '❌ FAILED'}")
        print(f"Database encryption: {'✅ PASSED' if database_passed else '❌ FAILED'}")
        print(f"Encryption coverage: {'✅ PASSED' if coverage_passed else '❌ FAILED'}")
        
        if self.validation_errors:
            print(f"\n❌ ERRORS ({len(self.validation_errors)}):")
            for error in self.validation_errors:
                print(f"  • {error}")
        
        if self.validation_warnings:
            print(f"\n⚠️  WARNINGS ({len(self.validation_warnings)}):")
            for warning in self.validation_warnings:
                print(f"  • {warning}")
        
        if all_passed:
            print(f"\n✅ ALL ENCRYPTION VALIDATION TESTS PASSED")
        else:
            print(f"\n❌ SOME ENCRYPTION VALIDATION TESTS FAILED")
        
        return all_passed


async def main():
    """Main entry point for encryption validation."""
    
    import argparse
    
    parser = argparse.ArgumentParser(description='Validate HIPAA encryption implementation')
    parser.add_argument('--sample-size', type=int, default=10, 
                       help='Number of database records to test')
    
    args = parser.parse_args()
    
    validator = EncryptionValidator()
    success = await validator.run_validation(args.sample_size)
    
    return success


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)