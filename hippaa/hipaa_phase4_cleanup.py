"""HIPAA Phase 4: Remove old plaintext columns and finalize migration

Revision ID: hipaa_004_cleanup
Revises: hipaa_003_application_cutover
Create Date: 2025-01-27

WARNING: This migration permanently removes plaintext data columns.
Only run this after:
1. Complete data validation
2. Successful production testing
3. Client approval for final cutover
4. Comprehensive backups
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'hipaa_004_cleanup'
down_revision = 'hipaa_003_application_cutover'  # Replace with actual previous revision
branch_labels = None
depends_on = None


def upgrade():
    """
    Remove old plaintext columns and rename encrypted columns.
    
    WARNING: This operation is IRREVERSIBLE and will permanently delete
    plaintext data. Ensure all validation is complete before running.
    """
    
    # First, make the encrypted columns non-nullable (data validation required)
    print("Making encrypted columns non-nullable...")
    
    # Patient table - update constraints
    op.alter_column('patient', 'first_name_encrypted', nullable=False)
    op.alter_column('patient', 'last_name_encrypted', nullable=False)
    # middle_name, phones, email can remain nullable
    
    # Patient identification
    op.alter_column('patient_identification', 'value_encrypted', nullable=False)
    
    # Analysis result
    # Note: result can be nullable for some analysis types
    
    print("Dropping old plaintext columns...")
    
    # Drop old patient columns
    op.drop_column('patient', 'first_name')
    op.drop_column('patient', 'middle_name')
    op.drop_column('patient', 'last_name')
    op.drop_column('patient', 'phone_mobile')
    op.drop_column('patient', 'phone_home')
    op.drop_column('patient', 'email')
    op.drop_column('patient', 'date_of_birth')  # This was DateTime, now encrypted as string
    
    # Drop old patient identification columns
    op.drop_column('patient_identification', 'value')
    
    # Drop old analysis result columns
    op.drop_column('analysis_result', 'result')
    
    # Drop old result mutation columns  
    op.drop_column('result_mutation', 'before')
    op.drop_column('result_mutation', 'after')
    
    # Drop old clinical data columns
    op.drop_column('clinical_data', 'symptoms_raw')
    op.drop_column('clinical_data', 'clinical_indication')
    op.drop_column('clinical_data', 'vitals')
    op.drop_column('clinical_data', 'treatment_notes')
    op.drop_column('clinical_data', 'other_context')
    
    print("Renaming encrypted columns to original names...")
    
    # Rename encrypted columns to original names - Patient
    op.alter_column('patient', 'first_name_encrypted', new_column_name='first_name')
    op.alter_column('patient', 'middle_name_encrypted', new_column_name='middle_name')
    op.alter_column('patient', 'last_name_encrypted', new_column_name='last_name')
    op.alter_column('patient', 'phone_mobile_encrypted', new_column_name='phone_mobile')
    op.alter_column('patient', 'phone_home_encrypted', new_column_name='phone_home')
    op.alter_column('patient', 'email_encrypted', new_column_name='email')
    op.alter_column('patient', 'date_of_birth_encrypted', new_column_name='date_of_birth')
    
    # Rename encrypted columns - Patient Identification
    op.alter_column('patient_identification', 'value_encrypted', new_column_name='value')
    
    # Rename encrypted columns - Analysis Result
    op.alter_column('analysis_result', 'result_encrypted', new_column_name='result')
    
    # Rename encrypted columns - Result Mutation
    op.alter_column('result_mutation', 'before_encrypted', new_column_name='before')
    op.alter_column('result_mutation', 'after_encrypted', new_column_name='after')
    
    # Rename encrypted columns - Clinical Data
    op.alter_column('clinical_data', 'symptoms_raw_encrypted', new_column_name='symptoms_raw')
    op.alter_column('clinical_data', 'clinical_indication_encrypted', new_column_name='clinical_indication')
    op.alter_column('clinical_data', 'vitals_encrypted', new_column_name='vitals')
    op.alter_column('clinical_data', 'treatment_notes_encrypted', new_column_name='treatment_notes')
    op.alter_column('clinical_data', 'other_context_encrypted', new_column_name='other_context')
    
    print("Removing migration status columns...")
    
    # Remove migration status tracking columns
    op.drop_column('patient', 'migration_status')
    op.drop_column('patient_identification', 'migration_status')
    op.drop_column('analysis_result', 'migration_status')
    op.drop_column('result_mutation', 'migration_status')
    op.drop_column('clinical_data', 'migration_status')
    
    # Drop migration status indices
    op.drop_index('idx_patient_migration_status', table_name='patient')
    op.drop_index('idx_patient_id_migration_status', table_name='patient_identification')
    op.drop_index('idx_result_migration_status', table_name='analysis_result')
    op.drop_index('idx_mutation_migration_status', table_name='result_mutation')
    op.drop_index('idx_clinical_migration_status', table_name='clinical_data')
    
    print("HIPAA cleanup migration completed successfully!")
    print("All sensitive data is now encrypted and migration is finalized.")


def downgrade():
    """
    Downgrade is not supported for this migration as it would require
    recreating plaintext data from encrypted data, which would defeat
    the purpose of HIPAA compliance.
    
    If rollback is absolutely necessary:
    1. Restore from backup taken before this migration
    2. Re-run the entire HIPAA migration process
    """
    
    raise Exception(
        "Downgrade not supported for HIPAA cleanup migration. "
        "This would recreate plaintext data from encrypted data, "
        "defeating HIPAA compliance. "
        "To rollback, restore from backup and re-run migration process."
    )