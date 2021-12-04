"""added message models

Revision ID: bb0846d0b978
Revises: e449fc441562
Create Date: 2021-12-04 22:36:17.177608

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'bb0846d0b978'
down_revision = 'e449fc441562'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('message',
    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
    sa.Column('uid', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('subject', sa.String(), nullable=False),
    sa.Column('body', sa.String(), nullable=False),
    sa.Column('broadcast', sa.Boolean(), nullable=False),
    sa.Column('created_by_uid', sa.Integer(), nullable=True),
    sa.Column('updated_by_uid', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_message_uid'), 'message', ['uid'], unique=False)
    op.create_table('message_delete',
    sa.Column('message_uid', sa.Integer(), nullable=False),
    sa.Column('user_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['message_uid'], ['message.uid'], ),
    sa.ForeignKeyConstraint(['user_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('message_uid', 'user_uid')
    )
    op.create_table('message_recipient',
    sa.Column('message_uid', sa.Integer(), nullable=False),
    sa.Column('user_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['message_uid'], ['message.uid'], ),
    sa.ForeignKeyConstraint(['user_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('message_uid', 'user_uid')
    )
    op.create_table('message_view',
    sa.Column('message_uid', sa.Integer(), nullable=False),
    sa.Column('user_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['message_uid'], ['message.uid'], ),
    sa.ForeignKeyConstraint(['user_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('message_uid', 'user_uid')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('message_view')
    op.drop_table('message_recipient')
    op.drop_table('message_delete')
    op.drop_index(op.f('ix_message_uid'), table_name='message')
    op.drop_table('message')
    # ### end Alembic commands ###
