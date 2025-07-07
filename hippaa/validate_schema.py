#!/usr/bin/env python3
"""
Schema Validation Script for HIPAA Migration

Validates that all required encrypted columns and search index tables 
have been created correctly during the HIPAA migration process.
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session


async def validate_schema():
    """Validate that HIPAA schema changes have been applied correctly."""
    
    print("Validating HIPAA migration schema...")
    print("=" * 50)
    
    validation_queries = {
        "patient_encrypted_columns": """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'patient' 
            AND column_name LIKE '%_encrypted'
            ORDER BY column_name
        """,
        "patient_search_tables": """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name IN ('patient_search_index', 'phone_search_index', 'date_search_index')
            ORDER BY table_name
        """,
        "migration_status_columns": """
            SELECT table_name, column_name
            FROM information_schema.columns 
            WHERE column_name = 'migration_status'
            AND table_name IN ('patient', 'patient_identification', 'analysis_result', 'result_mutation', 'clinical_data')
            ORDER BY table_name
        """,
        "search_indices": """
            SELECT indexname, tablename
            FROM pg_indexes 
            WHERE tablename IN ('patient_search_index', 'phone_search_index', 'date_search_index')
            ORDER BY tablename, indexname
        """,
        "analysis_result_encrypted": """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'analysis_result' 
            AND column_name = 'result_encrypted'
        """
    }
    
    expected_results = {
        "patient_encrypted_columns": [
            'date_of_birth_encrypted',
            'email_encrypted', 
            'first_name_encrypted',
            'last_name_encrypted',
            'middle_name_encrypted',
            'phone_home_encrypted',
            'phone_mobile_encrypted'
        ],
        "patient_search_tables": [
            'date_search_index',
            'patient_search_index', 
            'phone_search_index'
        ],
        "migration_status_columns": [
            ('analysis_result', 'migration_status'),
            ('clinical_data', 'migration_status'),
            ('patient', 'migration_status'),
            ('patient_identification', 'migration_status'),
            ('result_mutation', 'migration_status')
        ],
        "analysis_result_encrypted": ['result_encrypted']
    }
    
    validation_passed = True
    
    try:
        async with async_session() as session:
            
            for check_name, query in validation_queries.items():
                print(f"\nValidating {check_name}...")
                
                try:
                    result = await session.execute(query)
                    actual_results = result.fetchall()
                    
                    if check_name == "search_indices":
                        # Special handling for indices - just check they exist
                        index_count = len(actual_results)
                        print(f"  Found {index_count} search indices")
                        if index_count < 10:  # Expecting at least 10 indices
                            print(f"  ⚠️  Warning: Expected at least 10 search indices, found {index_count}")
                        else:
                            print(f"  ✅ Search indices created successfully")
                        continue
                    
                    # Extract values for comparison
                    if check_name == "migration_status_columns":
                        actual_values = [(row[0], row[1]) for row in actual_results]
                    else:
                        actual_values = [row[0] for row in actual_results]
                    
                    expected = expected_results.get(check_name, [])
                    
                    print(f"  Expected: {len(expected)} items")
                    print(f"  Found: {len(actual_values)} items")
                    
                    # Check if all expected items are present
                    missing = set(expected) - set(actual_values)
                    extra = set(actual_values) - set(expected)
                    
                    if missing:
                        print(f"  ❌ Missing: {missing}")
                        validation_passed = False
                    
                    if extra:
                        print(f"  ℹ️  Extra: {extra}")
                    
                    if not missing:
                        print(f"  ✅ All expected items found")
                        
                except Exception as e:
                    print(f"  ❌ Error executing validation: {e}")
                    validation_passed = False
            
            # Additional validation: Check foreign key constraints
            print(f"\nValidating foreign key constraints...")
            fk_query = """
                SELECT 
                    tc.table_name, 
                    kcu.column_name, 
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name 
                FROM 
                    information_schema.table_constraints AS tc 
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                      AND tc.table_schema = kcu.table_schema
                    JOIN information_schema.constraint_column_usage AS ccu
                      ON ccu.constraint_name = tc.constraint_name
                      AND ccu.table_schema = tc.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY' 
                AND tc.table_name IN ('patient_search_index', 'phone_search_index', 'date_search_index')
            """
            
            try:
                result = await session.execute(fk_query)
                fk_results = result.fetchall()
                
                expected_fks = 3  # One for each search table pointing to patient
                actual_fks = len(fk_results)
                
                print(f"  Expected foreign keys: {expected_fks}")
                print(f"  Found foreign keys: {actual_fks}")
                
                if actual_fks >= expected_fks:
                    print(f"  ✅ Foreign key constraints validated")
                else:
                    print(f"  ❌ Missing foreign key constraints")
                    validation_passed = False
                    
            except Exception as e:
                print(f"  ⚠️  Could not validate foreign keys: {e}")
    
    except Exception as e:
        print(f"❌ Schema validation failed with error: {e}")
        validation_passed = False
    
    print("\n" + "=" * 50)
    if validation_passed:
        print("✅ Schema validation PASSED - All required structures present")
        return True
    else:
        print("❌ Schema validation FAILED - Missing or incorrect structures")
        return False


if __name__ == "__main__":
    success = asyncio.run(validate_schema())
    sys.exit(0 if success else 1)