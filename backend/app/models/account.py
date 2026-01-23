from sqlalchemy import Column, Numeric, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid()  # 🔐 DB genera el UUID
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("auth.users.id", ondelete="CASCADE"),  # 👈 Supabase Auth
        nullable=False,
        unique=True,
        index=True
    )

    balance = Column(
        Numeric(12, 2),
        nullable=False,
        server_default="0"  # 🧮 default en DB, no en Python
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
