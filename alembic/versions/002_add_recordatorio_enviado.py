"""Add recordatorio_enviado to reservaciones

Revision ID: 002
Revises: 001
Create Date: 2026-03-27
"""
from alembic import op
import sqlalchemy as sa

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "reservaciones",
        sa.Column(
            "recordatorio_enviado",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )


def downgrade() -> None:
    op.drop_column("reservaciones", "recordatorio_enviado")
