from sqlalchemy import Column, Numeric, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"))

    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String, default="usd")

    status = Column(String, nullable=False, default="pending")

    stripe_payment_intent_id = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
