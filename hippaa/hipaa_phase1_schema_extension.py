"""HIPAA Phase 1: Add encrypted columns alongside existing ones

Revision ID: hipaa_001_schema_extension
Revises: [previous_revision]
Create Date: 2025-01-27

This migration adds encrypted columns alongside existing plaintext columns
to enable zero-downtime migration to HIPAA-compliant encrypted storage.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'hipaa_001_schema_extension'
down_revision = '[REPLACE_WITH_CURRENT_HEAD]'  # Replace with actual current head
branch_labels = None
depends_on = None


def upgrade():
    """Add encrypted columns and search index tables."""
    
    # Add encrypted columns to patient table
    op.add_column('patient', sa.Column('first_name_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('middle_name_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('last_name_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('phone_mobile_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('phone_home_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('email_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('date_of_birth_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient', sa.Column('migration_status', sa.String(50), nullable=True, default='pending'))
    
    # Add encrypted columns to patient_identification table
    op.add_column('patient_identification', sa.Column('value_encrypted', sa.String(1000), nullable=True))
    op.add_column('patient_identification', sa.Column('migration_status', sa.String(50), nullable=True, default='pending'))
    
    # Add encrypted columns to analysis_result table
    op.add_column('analysis_result', sa.Column('result_encrypted', sa.String(2000), nullable=True))
    op.add_column('analysis_result', sa.Column('migration_status', sa.String(50), nullable=True, default='pending'))
    
    # Add encrypted columns to result_mutation table
    op.add_column('result_mutation', sa.Column('before_encrypted', sa.String(2000), nullable=True))
    op.add_column('result_mutation', sa.Column('after_encrypted', sa.String(2000), nullable=True))
    op.add_column('result_mutation', sa.Column('migration_status', sa.String(50), nullable=True, default='pending'))
    
    # Add encrypted columns to clinical_data table
    op.add_column('clinical_data', sa.Column('symptoms_raw_encrypted', sa.String(4000), nullable=True))
    op.add_column('clinical_data', sa.Column('clinical_indication_encrypted', sa.String(4000), nullable=True))
    op.add_column('clinical_data', sa.Column('vitals_encrypted', sa.String(2000), nullable=True))
    op.add_column('clinical_data', sa.Column('treatment_notes_encrypted', sa.String(4000), nullable=True))
    op.add_column('clinical_data', sa.Column('other_context_encrypted', sa.String(4000), nullable=True))
    op.add_column('clinical_data', sa.Column('migration_status', sa.String(50), nullable=True, default='pending'))
    
    # Create patient search index table
    op.create_table('patient_search_index',
        sa.Column('uid', sa.String(), nullable=False),
        sa.Column('patient_uid', sa.String(), nullable=False),
        sa.Column('field_name', sa.String(), nullable=False),
        sa.Column('search_hash', sa.String(), nullable=False),
        sa.Column('partial_hash_3', sa.String(), nullable=True),
        sa.Column('partial_hash_4', sa.String(), nullable=True),
        sa.Column('partial_hash_5', sa.String(), nullable=True),
        sa.Column('phonetic_hash', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('created_by_uid', sa.String(), nullable=True),
        sa.Column('updated_by_uid', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['patient_uid'], ['patient.uid'], ),
        sa.PrimaryKeyConstraint('uid')
    )
    
    # Create phone search index table
    op.create_table('phone_search_index',
        sa.Column('uid', sa.String(), nullable=False),
        sa.Column('patient_uid', sa.String(), nullable=False),
        sa.Column('field_name', sa.String(), nullable=False),
        sa.Column('normalized_hash', sa.String(), nullable=False),
        sa.Column('last_four_hash', sa.String(), nullable=True),
        sa.Column('area_code_hash', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('created_by_uid', sa.String(), nullable=True),
        sa.Column('updated_by_uid', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['patient_uid'], ['patient.uid'], ),
        sa.PrimaryKeyConstraint('uid')
    )
    
    # Create date search index table
    op.create_table('date_search_index',
        sa.Column('uid', sa.String(), nullable=False),
        sa.Column('patient_uid', sa.String(), nullable=False),
        sa.Column('field_name', sa.String(), nullable=False),
        sa.Column('year_hash', sa.String(), nullable=True),
        sa.Column('month_hash', sa.String(), nullable=True),
        sa.Column('day_hash', sa.String(), nullable=True),
        sa.Column('date_hash', sa.String(), nullable=False),
        sa.Column('age_range_hash', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('created_by_uid', sa.String(), nullable=True),
        sa.Column('updated_by_uid', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['patient_uid'], ['patient.uid'], ),
        sa.PrimaryKeyConstraint('uid')
    )
    
    # Create indices for search performance
    op.create_index('idx_patient_field_hash', 'patient_search_index', ['field_name', 'search_hash'])
    op.create_index('idx_patient_partial_3', 'patient_search_index', ['field_name', 'partial_hash_3'])
    op.create_index('idx_patient_partial_4', 'patient_search_index', ['field_name', 'partial_hash_4'])
    op.create_index('idx_patient_partial_5', 'patient_search_index', ['field_name', 'partial_hash_5'])
    op.create_index('idx_patient_phonetic', 'patient_search_index', ['field_name', 'phonetic_hash'])
    
    op.create_index('idx_phone_normalized', 'phone_search_index', ['field_name', 'normalized_hash'])
    op.create_index('idx_phone_last_four', 'phone_search_index', ['field_name', 'last_four_hash'])
    op.create_index('idx_phone_area_code', 'phone_search_index', ['field_name', 'area_code_hash'])
    
    op.create_index('idx_date_full', 'date_search_index', ['field_name', 'date_hash'])
    op.create_index('idx_date_year', 'date_search_index', ['field_name', 'year_hash'])
    op.create_index('idx_date_month', 'date_search_index', ['field_name', 'month_hash'])
    op.create_index('idx_date_age_range', 'date_search_index', ['field_name', 'age_range_hash'])
    
    # Create indices for migration status tracking
    op.create_index('idx_patient_migration_status', 'patient', ['migration_status'])
    op.create_index('idx_patient_id_migration_status', 'patient_identification', ['migration_status'])
    op.create_index('idx_result_migration_status', 'analysis_result', ['migration_status'])
    op.create_index('idx_mutation_migration_status', 'result_mutation', ['migration_status'])
    op.create_index('idx_clinical_migration_status', 'clinical_data', ['migration_status'])


def downgrade():
    """Remove encrypted columns and search index tables."""
    
    # Drop indices first
    op.drop_index('idx_clinical_migration_status', table_name='clinical_data')
    op.drop_index('idx_mutation_migration_status', table_name='result_mutation')
    op.drop_index('idx_result_migration_status', table_name='analysis_result')
    op.drop_index('idx_patient_id_migration_status', table_name='patient_identification')
    op.drop_index('idx_patient_migration_status', table_name='patient')
    
    op.drop_index('idx_date_age_range', table_name='date_search_index')
    op.drop_index('idx_date_month', table_name='date_search_index')
    op.drop_index('idx_date_year', table_name='date_search_index')
    op.drop_index('idx_date_full', table_name='date_search_index')
    
    op.drop_index('idx_phone_area_code', table_name='phone_search_index')
    op.drop_index('idx_phone_last_four', table_name='phone_search_index')
    op.drop_index('idx_phone_normalized', table_name='phone_search_index')
    
    op.drop_index('idx_patient_phonetic', table_name='patient_search_index')
    op.drop_index('idx_patient_partial_5', table_name='patient_search_index')
    op.drop_index('idx_patient_partial_4', table_name='patient_search_index')
    op.drop_index('idx_patient_partial_3', table_name='patient_search_index')
    op.drop_index('idx_patient_field_hash', table_name='patient_search_index')
    
    # Drop search index tables
    op.drop_table('date_search_index')
    op.drop_table('phone_search_index')
    op.drop_table('patient_search_index')
    
    # Drop encrypted columns from clinical_data
    op.drop_column('clinical_data', 'migration_status')
    op.drop_column('clinical_data', 'other_context_encrypted')
    op.drop_column('clinical_data', 'treatment_notes_encrypted')
    op.drop_column('clinical_data', 'vitals_encrypted')
    op.drop_column('clinical_data', 'clinical_indication_encrypted')
    op.drop_column('clinical_data', 'symptoms_raw_encrypted')
    
    # Drop encrypted columns from result_mutation
    op.drop_column('result_mutation', 'migration_status')
    op.drop_column('result_mutation', 'after_encrypted')
    op.drop_column('result_mutation', 'before_encrypted')
    
    # Drop encrypted columns from analysis_result
    op.drop_column('analysis_result', 'migration_status')
    op.drop_column('analysis_result', 'result_encrypted')
    
    # Drop encrypted columns from patient_identification
    op.drop_column('patient_identification', 'migration_status')
    op.drop_column('patient_identification', 'value_encrypted')
    
    # Drop encrypted columns from patient
    op.drop_column('patient', 'migration_status')
    op.drop_column('patient', 'date_of_birth_encrypted')
    op.drop_column('patient', 'email_encrypted')
    op.drop_column('patient', 'phone_home_encrypted')
    op.drop_column('patient', 'phone_mobile_encrypted')
    op.drop_column('patient', 'last_name_encrypted')
    op.drop_column('patient', 'middle_name_encrypted')
    op.drop_column('patient', 'first_name_encrypted')