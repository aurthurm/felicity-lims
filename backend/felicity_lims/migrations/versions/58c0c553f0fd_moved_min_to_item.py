"""moved min to item

Revision ID: 58c0c553f0fd
Revises: af73934b8ef7
Create Date: 2023-03-26 21:19:10.054187

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '58c0c553f0fd'
down_revision = 'af73934b8ef7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stockitem', sa.Column('minimum_level', sa.Integer(), nullable=True))
    op.add_column('stockitem', sa.Column('maximum_level', sa.Integer(), nullable=True))
    op.add_column('stockproduct', sa.Column('stock_item_uid', sa.String(), nullable=False))
    op.alter_column('stockproduct', 'name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.create_foreign_key(None, 'stockproduct', 'stockitem', ['stock_item_uid'], ['uid'])
    op.drop_column('stockproduct', 'minimum_level')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stockproduct', sa.Column('minimum_level', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'stockproduct', type_='foreignkey')
    op.alter_column('stockproduct', 'name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_column('stockproduct', 'stock_item_uid')
    op.drop_column('stockitem', 'maximum_level')
    op.drop_column('stockitem', 'minimum_level')
    # ### end Alembic commands ###
