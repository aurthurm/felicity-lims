"""core boundary decoupling

Revision ID: a1c9b0d3e4f5
Revises: bf2a10490c6f
Create Date: 2026-02-21 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1c9b0d3e4f5"
down_revision: Union[str, None] = "bf2a10490c6f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _drop_patient_fk(table_name: str, local_column: str) -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    fks = inspector.get_foreign_keys(table_name)
    for fk in fks:
        constrained_columns = fk.get("constrained_columns") or []
        referred_table = fk.get("referred_table")
        if local_column in constrained_columns and referred_table == "patient":
            name = fk.get("name")
            if name:
                op.drop_constraint(name, table_name, type_="foreignkey")


def upgrade() -> None:
    _drop_patient_fk("analysis_request", "patient_uid")
    _drop_patient_fk("test_bill", "patient_uid")
    _drop_patient_fk("voucher_customer", "patient_uid")

    op.create_table(
        "patient_analysis_request_link",
        sa.Column("patient_uid", sa.String(), nullable=False),
        sa.Column("analysis_request_uid", sa.String(), nullable=False),
        sa.Column("uid", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("created_by_uid", sa.String(), nullable=True),
        sa.Column("updated_by_uid", sa.String(), nullable=True),
        sa.Column("laboratory_uid", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["analysis_request_uid"], ["analysis_request.uid"]),
        sa.ForeignKeyConstraint(["patient_uid"], ["patient.uid"]),
        sa.PrimaryKeyConstraint("uid"),
        sa.UniqueConstraint("analysis_request_uid"),
    )
    op.create_index(
        op.f("ix_patient_analysis_request_link_uid"),
        "patient_analysis_request_link",
        ["uid"],
        unique=False,
    )
    op.create_index(
        "ix_patient_analysis_request_link_patient_uid",
        "patient_analysis_request_link",
        ["patient_uid"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_patient_analysis_request_link_patient_uid",
        table_name="patient_analysis_request_link",
    )
    op.drop_index(
        op.f("ix_patient_analysis_request_link_uid"),
        table_name="patient_analysis_request_link",
    )
    op.drop_table("patient_analysis_request_link")
