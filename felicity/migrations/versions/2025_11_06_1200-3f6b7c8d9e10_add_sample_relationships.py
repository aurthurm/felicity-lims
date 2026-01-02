"""add sample relationships

Revision ID: 3f6b7c8d9e10
Revises: be17afaf7482
Create Date: 2025-11-06 12:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "3f6b7c8d9e10"
down_revision = "be17afaf7482"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("sample", sa.Column("relationship_type", sa.String(), nullable=True))

    op.create_table(
        "sample_relationship",
        sa.Column("uid", sa.String(), primary_key=True, nullable=False),
        sa.Column("laboratory_uid", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("created_by_uid", sa.String(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("updated_by_uid", sa.String(), nullable=True),
        sa.Column("parent_sample_uid", sa.String(), nullable=True, index=True),
        sa.Column("child_sample_uid", sa.String(), nullable=False, index=True),
        sa.Column("relationship_type", sa.String(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("metadata_snapshot", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.ForeignKeyConstraint(["laboratory_uid"], ["laboratory.uid"]),
        sa.ForeignKeyConstraint(["created_by_uid"], ["user.uid"]),
        sa.ForeignKeyConstraint(["updated_by_uid"], ["user.uid"]),
        sa.ForeignKeyConstraint(["parent_sample_uid"], ["sample.uid"]),
        sa.ForeignKeyConstraint(["child_sample_uid"], ["sample.uid"]),
        sa.UniqueConstraint(
            "parent_sample_uid",
            "child_sample_uid",
            "relationship_type",
            name="uq_sample_relationship_edge",
        ),
        sa.CheckConstraint(
            "parent_sample_uid IS NULL OR parent_sample_uid <> child_sample_uid",
            name="ck_sample_relationship_no_self",
        ),
    )



def downgrade():
    op.drop_table("sample_relationship")
    op.drop_column("sample", "relationship_type")
