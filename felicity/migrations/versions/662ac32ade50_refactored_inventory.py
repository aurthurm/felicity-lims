"""refactored inventory

Revision ID: 662ac32ade50
Revises: 79cc9c2c7768
Create Date: 2024-05-27 16:34:51.879908

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '662ac32ade50'
down_revision = '79cc9c2c7768'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stock_item_variant',
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('stock_item_uid', sa.String(), nullable=True),
    sa.Column('minimum_level', sa.Integer(), nullable=True),
    sa.Column('maximum_level', sa.Integer(), nullable=True),
    sa.Column('uid', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('created_by_uid', sa.String(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('updated_by_uid', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['stock_item_uid'], ['stock_item.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_stock_item_variant_uid'), 'stock_item_variant', ['uid'], unique=False)
    op.create_table('stock_lot',
    sa.Column('product_uid', sa.String(), nullable=True),
    sa.Column('lot_number', sa.String(), nullable=False),
    sa.Column('expiry_date', sa.DateTime(), nullable=False),
    sa.Column('remarks', sa.String(), nullable=True),
    sa.Column('uid', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('created_by_uid', sa.String(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('updated_by_uid', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['product_uid'], ['stock_product.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_stock_lot_uid'), 'stock_lot', ['uid'], unique=False)
    op.create_table('stock_product_inventory',
    sa.Column('product_uid', sa.String(), nullable=True),
    sa.Column('stock_lot_uid', sa.String(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('remarks', sa.String(), nullable=True),
    sa.Column('uid', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('created_by_uid', sa.String(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('updated_by_uid', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['product_uid'], ['stock_product.uid'], ),
    sa.ForeignKeyConstraint(['stock_lot_uid'], ['stock_lot.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_stock_product_inventory_uid'), 'stock_product_inventory', ['uid'], unique=False)
    op.create_table('stock_receipt',
    sa.Column('product_uid', sa.String(), nullable=False),
    sa.Column('stock_lot_uid', sa.String(), nullable=True),
    sa.Column('unit_price', sa.Float(), nullable=True),
    sa.Column('total_price', sa.Float(), nullable=True),
    sa.Column('supplier_uid', sa.String(), nullable=True),
    sa.Column('unit_uid', sa.String(), nullable=True),
    sa.Column('singles_received', sa.Integer(), nullable=True),
    sa.Column('packages_received', sa.Integer(), nullable=True),
    sa.Column('package_factor', sa.Integer(), nullable=True),
    sa.Column('quantity_received', sa.Integer(), nullable=False),
    sa.Column('receipt_type', sa.String(), nullable=False),
    sa.Column('receipt_by_uid', sa.String(), nullable=True),
    sa.Column('receipt_date', sa.DateTime(), nullable=False),
    sa.Column('expiry_date', sa.DateTime(), nullable=False),
    sa.Column('uid', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('created_by_uid', sa.String(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('updated_by_uid', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['product_uid'], ['stock_product.uid'], ),
    sa.ForeignKeyConstraint(['receipt_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['stock_lot_uid'], ['stock_lot.uid'], ),
    sa.ForeignKeyConstraint(['supplier_uid'], ['supplier.uid'], ),
    sa.ForeignKeyConstraint(['unit_uid'], ['stock_unit.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_stock_receipt_uid'), 'stock_receipt', ['uid'], unique=False)
    op.drop_index('ix_stock_packaging_uid', table_name='stock_packaging')
    op.drop_table('stock_packaging')
    op.drop_index('ix_stock_transaction_uid', table_name='stock_transaction')
    op.drop_table('stock_transaction')
    op.add_column('stock_adjustment', sa.Column('lot_number', sa.String(), nullable=True))
    op.add_column('stock_adjustment', sa.Column('adjustment_for_uid', sa.Integer(), nullable=True))
    op.add_column('stock_adjustment', sa.Column('adjustment_for', sa.String(), nullable=True))
    op.create_foreign_key(None, 'stock_adjustment', 'user', ['adjustment_for'], ['uid'])
    op.add_column('stock_item', sa.Column('category_uid', sa.String(), nullable=True))
    op.add_column('stock_item', sa.Column('hazard_uid', sa.String(), nullable=True))
    op.drop_constraint('stock_item_department_uid_fkey', 'stock_item', type_='foreignkey')
    op.create_foreign_key(None, 'stock_item', 'hazard', ['hazard_uid'], ['uid'])
    op.create_foreign_key(None, 'stock_item', 'stock_category', ['category_uid'], ['uid'])
    op.drop_column('stock_item', 'department_uid')
    op.add_column('stock_product', sa.Column('stock_item_variant_uid', sa.String(), nullable=False))
    op.drop_constraint('stock_product_hazard_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_store_room_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_supplier_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_unit_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_packaging_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_received_by_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_department_uid_fkey', 'stock_product', type_='foreignkey')
    op.drop_constraint('stock_product_category_uid_fkey', 'stock_product', type_='foreignkey')
    op.create_foreign_key(None, 'stock_product', 'stock_item_variant', ['stock_item_variant_uid'], ['uid'])
    op.drop_column('stock_product', 'department_uid')
    op.drop_column('stock_product', 'date_received')
    op.drop_column('stock_product', 'received_by_uid')
    op.drop_column('stock_product', 'batch')
    op.drop_column('stock_product', 'price')
    op.drop_column('stock_product', 'store_room_uid')
    op.drop_column('stock_product', 'hazard_uid')
    op.drop_column('stock_product', 'lot_number')
    op.drop_column('stock_product', 'unit_uid')
    op.drop_column('stock_product', 'quantity_received')
    op.drop_column('stock_product', 'supplier_uid')
    op.drop_column('stock_product', 'expiry_date')
    op.drop_column('stock_product', 'size')
    op.drop_column('stock_product', 'category_uid')
    op.drop_column('stock_product', 'remaining')
    op.drop_column('stock_product', 'packaging_uid')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stock_product', sa.Column('packaging_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('remaining', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('category_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('size', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('expiry_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('supplier_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('quantity_received', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('stock_product', sa.Column('unit_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('lot_number', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('hazard_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('store_room_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('batch', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('received_by_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('stock_product', sa.Column('date_received', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.add_column('stock_product', sa.Column('department_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'stock_product', type_='foreignkey')
    op.create_foreign_key('stock_product_category_uid_fkey', 'stock_product', 'stock_category', ['category_uid'], ['uid'])
    op.create_foreign_key('stock_product_department_uid_fkey', 'stock_product', 'department', ['department_uid'], ['uid'])
    op.create_foreign_key('stock_product_received_by_uid_fkey', 'stock_product', 'user', ['received_by_uid'], ['uid'])
    op.create_foreign_key('stock_product_packaging_uid_fkey', 'stock_product', 'stock_packaging', ['packaging_uid'], ['uid'])
    op.create_foreign_key('stock_product_unit_uid_fkey', 'stock_product', 'stock_unit', ['unit_uid'], ['uid'])
    op.create_foreign_key('stock_product_supplier_uid_fkey', 'stock_product', 'supplier', ['supplier_uid'], ['uid'])
    op.create_foreign_key('stock_product_store_room_uid_fkey', 'stock_product', 'store_room', ['store_room_uid'], ['uid'])
    op.create_foreign_key('stock_product_hazard_uid_fkey', 'stock_product', 'hazard', ['hazard_uid'], ['uid'])
    op.drop_column('stock_product', 'stock_item_variant_uid')
    op.add_column('stock_item', sa.Column('department_uid', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'stock_item', type_='foreignkey')
    op.drop_constraint(None, 'stock_item', type_='foreignkey')
    op.create_foreign_key('stock_item_department_uid_fkey', 'stock_item', 'department', ['department_uid'], ['uid'])
    op.drop_column('stock_item', 'hazard_uid')
    op.drop_column('stock_item', 'category_uid')
    op.drop_constraint(None, 'stock_adjustment', type_='foreignkey')
    op.drop_column('stock_adjustment', 'adjustment_for')
    op.drop_column('stock_adjustment', 'adjustment_for_uid')
    op.drop_column('stock_adjustment', 'lot_number')
    op.create_table('stock_transaction',
    sa.Column('product_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('issued', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('issued_to_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('department_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('date_issued', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('transaction_by_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('uid', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('created_by_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_by_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], name='stock_transaction_created_by_uid_fkey'),
    sa.ForeignKeyConstraint(['department_uid'], ['department.uid'], name='stock_transaction_department_uid_fkey'),
    sa.ForeignKeyConstraint(['issued_to_uid'], ['user.uid'], name='stock_transaction_issued_to_uid_fkey'),
    sa.ForeignKeyConstraint(['product_uid'], ['stock_product.uid'], name='stock_transaction_product_uid_fkey'),
    sa.ForeignKeyConstraint(['transaction_by_uid'], ['user.uid'], name='stock_transaction_transaction_by_uid_fkey'),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], name='stock_transaction_updated_by_uid_fkey'),
    sa.PrimaryKeyConstraint('uid', name='stock_transaction_pkey')
    )
    op.create_index('ix_stock_transaction_uid', 'stock_transaction', ['uid'], unique=False)
    op.create_table('stock_packaging',
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('uid', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('created_by_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_by_uid', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], name='stock_packaging_created_by_uid_fkey'),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], name='stock_packaging_updated_by_uid_fkey'),
    sa.PrimaryKeyConstraint('uid', name='stock_packaging_pkey')
    )
    op.create_index('ix_stock_packaging_uid', 'stock_packaging', ['uid'], unique=False)
    op.drop_index(op.f('ix_stock_receipt_uid'), table_name='stock_receipt')
    op.drop_table('stock_receipt')
    op.drop_index(op.f('ix_stock_product_inventory_uid'), table_name='stock_product_inventory')
    op.drop_table('stock_product_inventory')
    op.drop_index(op.f('ix_stock_lot_uid'), table_name='stock_lot')
    op.drop_table('stock_lot')
    op.drop_index(op.f('ix_stock_item_variant_uid'), table_name='stock_item_variant')
    op.drop_table('stock_item_variant')
    # ### end Alembic commands ###
