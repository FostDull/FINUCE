from sqlalchemy import Column, String, ForeignKey, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # 1. Asegúrate de que el nombre de la tabla en ForeignKey coincida con tu tabla de cuentas
    account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False
    )

    # 2. El tipo es mejor restringirlo o usar el String con el Enum de Pydantic
    type = Column(String, nullable=False)  # "debit" o "credit"

    # 3. CAMBIO CRÍTICO: Usar Numeric en lugar de Float
    # precision=12 (dígitos totales), scale=2 (decimales)
    amount = Column(Numeric(precision=12, scale=2), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
