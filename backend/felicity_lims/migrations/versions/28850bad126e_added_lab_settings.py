"""added lab settings

Revision ID: 28850bad126e
Revises: 131c8e759579
Create Date: 2022-03-01 14:02:36.874518

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '28850bad126e'
down_revision = '131c8e759579'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('userpreference',
    sa.Column('uid', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_uid', sa.Integer(), nullable=True),
    sa.Column('expanded_menu', sa.Boolean(), nullable=True),
    sa.Column('theme', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('created_by_uid', sa.Integer(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('updated_by_uid', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['user_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_userpreference_uid'), 'userpreference', ['uid'], unique=False)
    op.create_table('department_preference',
    sa.Column('department_uid', sa.Integer(), nullable=False),
    sa.Column('preference_uid', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['department_uid'], ['department.uid'], ),
    sa.ForeignKeyConstraint(['preference_uid'], ['userpreference.uid'], ),
    sa.PrimaryKeyConstraint('department_uid', 'preference_uid')
    )
    op.create_table('laboratorysetting',
    sa.Column('uid', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('laboratory_uid', sa.Integer(), nullable=True),
    sa.Column('allow_self_verification', sa.Boolean(), nullable=False),
    sa.Column('allow_patient_registration', sa.Boolean(), nullable=True),
    sa.Column('allow_sample_registration', sa.Boolean(), nullable=True),
    sa.Column('allow_worksheet_creation', sa.Boolean(), nullable=True),
    sa.Column('default_route', sa.Boolean(), nullable=True),
    sa.Column('password_lifetime', sa.Integer(), nullable=True),
    sa.Column('inactivity_log_out', sa.Integer(), nullable=True),
    sa.Column('default_theme', sa.String(), nullable=True),
    sa.Column('auto_receive_samples', sa.Boolean(), nullable=True),
    sa.Column('sticker_copies', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('created_by_uid', sa.Integer(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('updated_by_uid', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by_uid'], ['user.uid'], ),
    sa.ForeignKeyConstraint(['laboratory_uid'], ['laboratory.uid'], ),
    sa.ForeignKeyConstraint(['updated_by_uid'], ['user.uid'], ),
    sa.PrimaryKeyConstraint('uid')
    )
    op.create_index(op.f('ix_laboratorysetting_uid'), 'laboratorysetting', ['uid'], unique=False)
    op.add_column('laboratory', sa.Column('logo', sa.String(), nullable=True))
    op.add_column('user', sa.Column('avatar', sa.String(), nullable=True))
    op.add_column('user', sa.Column('bio', sa.String(), nullable=True))
    op.add_column('user', sa.Column('default_route', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'default_route')
    op.drop_column('user', 'bio')
    op.drop_column('user', 'avatar')
    op.drop_column('laboratory', 'logo')
    op.drop_index(op.f('ix_laboratorysetting_uid'), table_name='laboratorysetting')
    op.drop_table('laboratorysetting')
    op.drop_table('department_preference')
    op.drop_index(op.f('ix_userpreference_uid'), table_name='userpreference')
    op.drop_table('userpreference')
    # ### end Alembic commands ###
