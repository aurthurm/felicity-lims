"""update 1.0.1.1

Revision ID: a31008878fc3
Revises: ea82c8f0cf79
Create Date: 2022-02-24 08:10:02.744775

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'a31008878fc3'
down_revision = 'ea82c8f0cf79'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('method_instrument',
    sa.Column('method_uid', sa.Integer(), nullable=False),
    sa.Column('instrument_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['instrument_uid'], ['instrument.uid'], ),
    sa.ForeignKeyConstraint(['method_uid'], ['method.uid'], ),
    sa.PrimaryKeyConstraint('method_uid', 'instrument_uid')
    )
    op.create_table('analysis_instrument',
    sa.Column('analysis_uid', sa.Integer(), nullable=False),
    sa.Column('instrument_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['analysis_uid'], ['analysis.uid'], ),
    sa.ForeignKeyConstraint(['instrument_uid'], ['instrument.uid'], ),
    sa.PrimaryKeyConstraint('analysis_uid', 'instrument_uid')
    )
    op.create_table('analysis_method',
    sa.Column('analysis_uid', sa.Integer(), nullable=False),
    sa.Column('method_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['analysis_uid'], ['analysis.uid'], ),
    sa.ForeignKeyConstraint(['method_uid'], ['method.uid'], ),
    sa.PrimaryKeyConstraint('analysis_uid', 'method_uid')
    )
    op.drop_table('instrument_method')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('instrument_method',
    sa.Column('instrument_uid', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('method_uid', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['instrument_uid'], ['instrument.uid'], name='instrument_method_instrument_uid_fkey'),
    sa.ForeignKeyConstraint(['method_uid'], ['method.uid'], name='instrument_method_method_uid_fkey'),
    sa.PrimaryKeyConstraint('instrument_uid', 'method_uid', name='instrument_method_pkey')
    )
    op.drop_table('analysis_method')
    op.drop_table('analysis_instrument')
    op.drop_table('method_instrument')
    # ### end Alembic commands ###
