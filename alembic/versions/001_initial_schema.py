"""Initial schema: terrazas and reservaciones

Revision ID: 001
Revises:
Create Date: 2026-03-27
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "terrazas",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nombre", sa.String(100), nullable=False, unique=True),
        sa.Column("capacidad", sa.Integer(), nullable=False),
        sa.Column("precio_hora", sa.Numeric(10, 2), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("activa", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
    )

    op.create_table(
        "reservaciones",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("codigo", sa.String(10), nullable=False, unique=True),
        sa.Column("nombre_cliente", sa.String(150), nullable=False),
        sa.Column("email_cliente", sa.String(200), nullable=True),
        sa.Column(
            "terraza_id",
            sa.Integer(),
            sa.ForeignKey("terrazas.id"),
            nullable=False,
        ),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("hora_inicio", sa.Time(), nullable=False),
        sa.Column("hora_fin", sa.Time(), nullable=False),
        sa.Column("num_personas", sa.Integer(), nullable=False),
        sa.Column(
            "estado",
            sa.String(20),
            nullable=False,
            server_default=sa.text("'confirmada'"),
        ),
        sa.Column("notas", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "estado IN ('pendiente','confirmada','cancelada','completada')",
            name="ck_reservaciones_estado",
        ),
    )

    op.create_index(
        "idx_reservaciones_disponibilidad",
        "reservaciones",
        ["terraza_id", "fecha", "estado"],
    )


def downgrade() -> None:
    op.drop_index("idx_reservaciones_disponibilidad", table_name="reservaciones")
    op.drop_table("reservaciones")
    op.drop_table("terrazas")
