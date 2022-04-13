"""added data to job

Revision ID: bbd630cd4f62
Revises: 4ccf6eb96f6c
Create Date: 2022-04-13 18:45:14.664216

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'bbd630cd4f62'
down_revision = '4ccf6eb96f6c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('job', sa.Column('data', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('job', 'data')
    # ### end Alembic commands ###
