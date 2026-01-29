"""enforce task ownership

Revision ID: 21f62f46a272
Revises: 90f68a72c7a3
Create Date: 2026-01-29 07:34:02.991059

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '21f62f46a272'
down_revision: Union[str, Sequence[str], None] = '90f68a72c7a3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove orphan tasks
    op.execute(
        """
        DELETE FROM tasks
        WHERE user_id IS NULL
        """
    )

    # Enforce ownership
    op.alter_column(
        "tasks",
        "user_id",
        nullable=False,
    )



def downgrade() -> None:
    op.alter_column(
        "tasks",
        "user_id",
        nullable=True,
    )

