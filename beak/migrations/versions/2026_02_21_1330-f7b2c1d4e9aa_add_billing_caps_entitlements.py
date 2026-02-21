"""compatibility marker: platform billing caps moved to platform_versions

Revision ID: f7b2c1d4e9aa
Revises: a1c9b0d3e4f5
Create Date: 2026-02-21 13:30:00.000000
"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f7b2c1d4e9aa"
down_revision: Union[str, None] = "a1c9b0d3e4f5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Intentionally no-op for tenant schema stream.
    # Platform migration with the same logical change is applied from:
    # beak/migrations/platform_versions/2026_02_21_1330-f7b2c1d4e9aa_add_billing_caps_entitlements.py
    op.execute("SELECT 1")


def downgrade() -> None:
    op.execute("SELECT 1")
