"""renamed models names

Revision ID: 2b777a90c545
Revises: 2f6c475b503d
Create Date: 2021-12-22 18:13:03.473329

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '2b777a90c545'
down_revision = '2f6c475b503d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('astlink', sa.Column('sample_type_uid', sa.Integer(), nullable=False))
    op.drop_constraint('astlink_sampletype_uid_fkey', 'astlink', type_='foreignkey')
    op.create_foreign_key(None, 'astlink', 'sampletype', ['sample_type_uid'], ['uid'])
    op.drop_column('astlink', 'sampletype_uid')
    op.add_column('sample', sa.Column('analysis_request_uid', sa.Integer(), nullable=True))
    op.add_column('sample', sa.Column('sample_type_uid', sa.Integer(), nullable=False))
    op.drop_constraint('sample_analysisrequest_uid_fkey', 'sample', type_='foreignkey')
    op.drop_constraint('sample_sampletype_uid_fkey', 'sample', type_='foreignkey')
    op.create_foreign_key(None, 'sample', 'analysisrequest', ['analysis_request_uid'], ['uid'])
    op.create_foreign_key(None, 'sample', 'sampletype', ['sample_type_uid'], ['uid'])
    op.drop_column('sample', 'sampletype_uid')
    op.drop_column('sample', 'analysisrequest_uid')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('sample', sa.Column('analysisrequest_uid', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('sample', sa.Column('sampletype_uid', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'sample', type_='foreignkey')
    op.drop_constraint(None, 'sample', type_='foreignkey')
    op.create_foreign_key('sample_sampletype_uid_fkey', 'sample', 'sampletype', ['sampletype_uid'], ['uid'])
    op.create_foreign_key('sample_analysisrequest_uid_fkey', 'sample', 'analysisrequest', ['analysisrequest_uid'], ['uid'])
    op.drop_column('sample', 'sample_type_uid')
    op.drop_column('sample', 'analysis_request_uid')
    op.add_column('astlink', sa.Column('sampletype_uid', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'astlink', type_='foreignkey')
    op.create_foreign_key('astlink_sampletype_uid_fkey', 'astlink', 'sampletype', ['sampletype_uid'], ['uid'])
    op.drop_column('astlink', 'sample_type_uid')
    # ### end Alembic commands ###
